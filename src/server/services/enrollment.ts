import { db } from "@/lib/db";
import { issueCertificateIfCompleted } from "./certificate";

/**
 * Mark a lesson complete and recalculate overall course progress.
 *
 * Issue #001 fix: the original code upserted progress BEFORE fetching the
 * lesson, meaning the course lookup could fail (returning 0) if the lesson
 * didn't exist — and the progress write was wasted. Fixed order:
 *   1. Verify lesson + its course exist FIRST
 *   2. Upsert lesson progress
 *   3. Recount and update enrollment
 */
export async function markLessonComplete(userId: string, lessonId: string): Promise<number> {
  // 1. Fetch lesson + course BEFORE writing anything
  const lesson = await db.lesson.findUnique({
    where: { id: lessonId },
    select: {
      id: true,
      module: { select: { courseId: true } },
    },
  });

  if (!lesson?.module?.courseId) {
    throw new Error(`Lesson ${lessonId} not found or has no associated course`);
  }

  const courseId = lesson.module.courseId;

  // 2. Verify the user is actually enrolled before touching anything
  const enrollment = await db.enrollment.findUnique({
    where: { userId_courseId: { userId, courseId } },
  });
  if (!enrollment) {
    throw new Error("User is not enrolled in this course");
  }

  // 3. Upsert lesson progress (now that we know the lesson and enrollment exist)
  await db.lessonProgress.upsert({
    where: { userId_lessonId: { userId, lessonId } },
    create: { userId, lessonId, isCompleted: true, completedAt: new Date() },
    update: { isCompleted: true, completedAt: new Date() },
  });

  // 4. Count total published lessons vs completed for this course
  const [totalLessons, completedLessons] = await Promise.all([
    db.lesson.count({
      where: {
        isPublished: true,
        module: { courseId },
      },
    }),
    db.lessonProgress.count({
      where: {
        userId,
        isCompleted: true,
        lesson: {
          isPublished: true,
          module: { courseId },
        },
      },
    }),
  ]);

  const progress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  // 5. Update enrollment progress (and mark completed if 100%)
  await db.enrollment.update({
    where: { userId_courseId: { userId, courseId } },
    data: {
      progress,
      ...(progress === 100
        ? { completedAt: new Date(), status: "COMPLETED" }
        : {}),
    },
  });

  // 6. Auto-issue certificate on 100% completion
  if (progress === 100) {
    await issueCertificateIfCompleted(userId, courseId);
  }

  return progress;
}

/**
 * Enroll a user in a free course instantly.
 *
 * Issue #002 fix: atomically increment course.totalStudents only on a fresh
 * enrolment (not on a re-enrolment upsert).
 */
export async function enrollFree(userId: string, courseId: string) {
  const course = await db.course.findUnique({
    where: { id: courseId },
    select: { id: true, isFree: true },
  });
  if (!course) throw new Error("Course not found");
  if (!course.isFree) throw new Error("This course requires payment");

  // Check if already enrolled to avoid double-incrementing totalStudents
  const existing = await db.enrollment.findUnique({
    where: { userId_courseId: { userId, courseId } },
  });

  const enrollment = await db.enrollment.upsert({
    where: { userId_courseId: { userId, courseId } },
    create: { userId, courseId, status: "ACTIVE" },
    update: { status: "ACTIVE" },
  });

  // Only increment totalStudents for genuinely new enrolments
  if (!existing) {
    await db.course.update({
      where: { id: courseId },
      data: { totalStudents: { increment: 1 } },
    });
  }

  return enrollment;
}

/** Check if a user has access to a course (enrolled OR has active Pro subscription) */
export async function checkCourseAccess(userId: string, courseId: string): Promise<boolean> {
  // 1. Check direct active enrollment
  const enrollment = await db.enrollment.findUnique({
    where: { userId_courseId: { userId, courseId } },
    select: { status: true },
  });
  if (enrollment?.status === "ACTIVE" || enrollment?.status === "COMPLETED") return true;

  // 2. Pro/Annual/Enterprise subscription grants access to all courses
  const subscription = await db.subscription.findFirst({
    where: {
      userId,
      status: "ACTIVE",
      plan: { in: ["PRO_MONTHLY", "PRO_ANNUAL", "ENTERPRISE"] },
    },
    select: { id: true },
  });

  return !!subscription;
}
