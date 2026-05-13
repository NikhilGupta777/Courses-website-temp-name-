import { router } from "@/lib/trpc/server";
import { courseRouter } from "./course";
import { userRouter } from "./user";
import { enrollmentRouter } from "./enrollment";
import { paymentRouter } from "./payment";

export const appRouter = router({
  course: courseRouter,
  user: userRouter,
  enrollment: enrollmentRouter,
  payment: paymentRouter,
});

export type AppRouter = typeof appRouter;
