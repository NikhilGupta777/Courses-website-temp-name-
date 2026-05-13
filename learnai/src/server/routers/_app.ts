import { router } from "@/lib/trpc/server";
import { courseRouter } from "./course";
import { userRouter } from "./user";

export const appRouter = router({
  course: courseRouter,
  user: userRouter,
});

export type AppRouter = typeof appRouter;
