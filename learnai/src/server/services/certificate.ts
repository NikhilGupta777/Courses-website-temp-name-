import { db } from "@/lib/db";
import { nanoid } from "nanoid";

/**
 * Auto-generate a completion certificate when a user finishes 100% of a course.
 * Called from enrollment progress update logic.
 */
export async function issueCertificateIfCompleted(userId: string, courseId: string): Promise<void> {
  // Check enrollment is 100% complete
  const enrollment = await db.enrollment.findUnique({
    where: { userId_courseId: { userId, courseId } },
  });

  if (!enrollment || enrollment.progress < 100) return;

  // Don't issue duplicate
  const existing = await db.certificate.findFirst({
    where: { userId, courseId },
  });
  if (existing) return;

  // Check quiz passing score (optional — can be made strict)
  const course = await db.course.findUnique({ where: { id: courseId } });
  if (!course) return;

  const certNumber = `LEARNAI-${new Date().getFullYear()}-${nanoid(6).toUpperCase()}`;
  const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify/${certNumber}`;

  // Fetch user details for metadata
  const user = await db.user.findUnique({ where: { id: userId } });

  await db.certificate.create({
    data: {
      userId,
      courseId,
      certificateNumber: certNumber,
      verificationUrl,
      metadata: {
        courseName: course.title,
        userName: user?.name ?? "Learner",
        completionDate: new Date().toISOString(),
        instructorName: course.title, // join to instructor in production
      },
    },
  });

  // Create in-app notification
  await db.notification.create({
    data: {
      userId,
      type: "CERTIFICATE_ISSUED",
      title: "🎉 Certificate Earned!",
      message: `Congratulations! Your certificate for "${course.title}" is ready to download.`,
      link: `/dashboard/certificates`,
    },
  });
}

/** Verify a certificate by its certificate number (public endpoint) */
export async function verifyCertificate(certificateNumber: string) {
  return db.certificate.findUnique({
    where: { certificateNumber },
    include: {
      user: { select: { name: true } },
      course: { select: { title: true, duration: true } },
    },
  });
}
