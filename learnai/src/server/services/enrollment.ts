import { db } from "@/lib/db";
import { issueCertificateIfCompleted } from "./certificate";

/** Mark a lesson complete and recalculate overall course progress */
export async function markLessonComplete(userId: string, lessonId: string): Promise<number> {
  // Upsert lesson progress
  await db.lessonProgress.upsert({
    where: { userId_lessonId: { userId, lessonId } },
    create: { userId, lessonId, isCompleted: true, completedAt: new Date() },
    update: { isCompleted: true, completedAt: new Date() },
  });

  // Find which course this lesson belongs to
  const lesson = await db.lesson.findUnique({
    where: { id: lessonId },
    include: { module: { select: { courseId: true } } },
  });

  if (!lesson?.module?.courseId) return 0;

  const courseId = lesson.module.courseId;

  // Count total lessons vs completed for this course
  const [totalLessons, completedLessons] = await Promise.all([
    db.lesson.count({
      where: { module: { courseId }, isPublished: true },
    }),
    db.lessonProgress.count({
      where: {
        userId,
        isCompleted: true,
        lesson: { module: { courseId }, isPublished: true },
      },
    }),
  ]);

  const progress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  // Update enrollment progress
  await db.enrollment.update({
    where: { userId_courseId: { userId, courseId } },
    data: {
      progress,
      ...(progress === 100 ? { completedAt: new Date(), status: "COMPLETED" } : {}),
    },
  });

  // Auto-issue certificate if course is now 100% complete
  if (progress === 100) {
    await issueCertificateIfCompleted(userId, courseId);
  }

  return progress;
}

/** Enroll a user in a free course instantly */
export async function enrollFree(userId: string, courseId: string) {
  const course = await db.course.findUnique({ where: { id: courseId } });
  if (!course) throw new Error("Course not found");
  if (!course.isFree) throw new Error("This course requires payment");

  return db.enrollment.upsert({
    where: { userId_courseId: { userId, courseId } },
    create: { userId, courseId, status: "ACTIVE" },
    update: { status: "ACTIVE" },
  });
}

/** Check if a user has access to a course (enrolled OR has Pro subscription) */
export async function checkCourseAccess(userId: string, courseId: string): Promise<boolean> {
  // Check direct enrollment
  const enrollment = await db.enrollment.findUnique({
    where: { userId_courseId: { userId, courseId } },
  });
  if (enrollment?.status === "ACTIVE") return true;

  // Check active Pro subscription
  const subscription = await db.subscription.findFirst({
    where: {
      userId,
      status: "ACTIVE",
      plan: { in: ["PRO_MONTHLY", "PRO_ANNUAL", "ENTERPRISE"] },
    },
  });

  return !!subscription;
}
