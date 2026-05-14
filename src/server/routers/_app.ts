import { router } from "@/lib/trpc/server";
import { courseRouter } from "./course";
import { userRouter } from "./user";
import { enrollmentRouter } from "./enrollment";
import { paymentRouter } from "./payment";
import { moduleRouter } from "./module";
import { lessonRouter } from "./lesson";
import { certificateRouter } from "./certificate";
import { reviewRouter } from "./review";
import { instructorRouter } from "./instructor";
import { adminRouter } from "./admin";
import { notificationRouter } from "./notification";
import { quizRouter } from "./quiz";

export const appRouter = router({
  course: courseRouter,
  user: userRouter,
  enrollment: enrollmentRouter,
  payment: paymentRouter,
  module: moduleRouter,
  lesson: lessonRouter,
  certificate: certificateRouter,
  review: reviewRouter,
  instructor: instructorRouter,
  admin: adminRouter,
  notification: notificationRouter,
  quiz: quizRouter,
});

export type AppRouter = typeof appRouter;
