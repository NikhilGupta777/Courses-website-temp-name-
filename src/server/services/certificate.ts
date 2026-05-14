import { db } from "@/lib/db";
import { nanoid } from "nanoid";

/**
 * Auto-generate a completion certificate when a user finishes 100% of a course.
 * Called from markLessonComplete in enrollment service.
 *
 * Sweep fix: metadata.instructorName was incorrectly set to course.title.
 * Fixed to join through to InstructorProfile.displayName.
 */
export async function issueCertificateIfCompleted(userId: string, courseId: string): Promise<void> {
  // Only issue if enrollment is genuinely 100% complete
  const enrollment = await db.enrollment.findUnique({
    where: { userId_courseId: { userId, courseId } },
    select: { progress: true },
  });
  if (!enrollment || enrollment.progress < 100) return;

  // Idempotency — never issue a duplicate
  const existing = await db.certificate.findFirst({
    where: { userId, courseId },
    select: { id: true },
  });
  if (existing) return;

  // Fetch course + instructor in one query
  const course = await db.course.findUnique({
    where: { id: courseId },
    select: {
      title: true,
      instructor: { select: { displayName: true } },
    },
  });
  if (!course) return;

  // Fetch user name for the certificate
  const user = await db.user.findUnique({
    where: { id: userId },
    select: { name: true },
  });

  const certNumber = `LEARNAI-${new Date().getFullYear()}-${nanoid(6).toUpperCase()}`;
  const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://learnai.in";
  const verificationUrl = `${APP_URL}/verify/${certNumber}`;

  const newCert = await db.certificate.create({
    data: {
      userId,
      courseId,
      certificateNumber: certNumber,
      verificationUrl,
      metadata: {
        courseName:      course.title,
        userName:        user?.name ?? "Learner",
        completionDate:  new Date().toISOString(),
        instructorName:  course.instructor.displayName,   // ← was incorrectly course.title
      },
    },
  });

  // Store the PDF/print URL so the Download button can link to it immediately
  await db.certificate.update({
    where: { id: newCert.id },
    data: { pdfUrl: `${APP_URL}/api/certificates/${newCert.id}/pdf` },
  });

  // In-app notification
  await db.notification.create({
    data: {
      userId,
      type:    "CERTIFICATE_ISSUED",
      title:   "🎉 Certificate Earned!",
      message: `Congratulations! Your certificate for "${course.title}" is ready to download.`,
      link:    `/dashboard/certificates`,
    },
  });
}

/** Verify a certificate by its certificate number (used by the public /verify page) */
export async function verifyCertificate(certificateNumber: string) {
  return db.certificate.findUnique({
    where: { certificateNumber },
    include: {
      user:   { select: { name: true } },
      course: { select: { title: true, duration: true } },
    },
  });
}
