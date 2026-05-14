import { z } from "zod";
import { TRPCError } from "@trpc/server";
import type { PrismaClient } from "@prisma/client";
import { router, protectedProcedure, instructorProcedure } from "@/lib/trpc/server";
import { checkCourseAccess } from "@/server/services/enrollment";

type QuizRouterContext = {
  db: PrismaClient;
  session: { user: { id: string } };
};

async function assertQuizAccess(ctx: QuizRouterContext, quizId: string) {
  const quiz = await ctx.db.quiz.findUnique({
    where: { id: quizId },
    select: {
      id: true,
      lesson: {
        select: {
          isFree: true,
          isPublished: true,
          module: { select: { courseId: true, course: { select: { status: true } } } },
        },
      },
    },
  });
  if (!quiz) throw new TRPCError({ code: "NOT_FOUND" });

  const courseId = quiz.lesson.module.courseId;
  const hasAccess = await checkCourseAccess(ctx.session.user.id, courseId);
  const canPreviewFreeLesson = quiz.lesson.isFree && quiz.lesson.isPublished && quiz.lesson.module.course.status === "PUBLISHED";
  if (!hasAccess && !canPreviewFreeLesson) {
    throw new TRPCError({ code: "FORBIDDEN", message: "You do not have access to this quiz" });
  }

  return quiz;
}

async function assertInstructorOwnsQuiz(ctx: QuizRouterContext, quizId: string) {
  const profile = await ctx.db.instructorProfile.findUnique({ where: { userId: ctx.session.user.id } });
  if (!profile) throw new TRPCError({ code: "NOT_FOUND" });
  const quiz = await ctx.db.quiz.findUnique({
    where: { id: quizId },
    select: { lesson: { select: { module: { select: { course: { select: { instructorId: true } } } } } } },
  });
  if (!quiz) throw new TRPCError({ code: "NOT_FOUND" });
  if (quiz.lesson.module.course.instructorId !== profile.id) throw new TRPCError({ code: "FORBIDDEN" });
}

async function assertInstructorOwnsQuestion(ctx: QuizRouterContext, questionId: string) {
  const question = await ctx.db.question.findUnique({
    where: { id: questionId },
    select: { quizId: true },
  });
  if (!question) throw new TRPCError({ code: "NOT_FOUND" });
  await assertInstructorOwnsQuiz(ctx, question.quizId);
}

export const quizRouter = router({
  get: protectedProcedure
    .input(z.object({ quizId: z.string() }))
    .query(async ({ ctx, input }) => {
      await assertQuizAccess(ctx, input.quizId);
      const quiz = await ctx.db.quiz.findUnique({
        where: { id: input.quizId },
        include: {
          questions: {
            orderBy: { position: "asc" },
            select: { id: true, type: true, text: true, options: true, points: true, position: true },
          },
        },
      });
      if (!quiz) throw new TRPCError({ code: "NOT_FOUND" });
      return quiz;
    }),

  submit: protectedProcedure
    .input(z.object({
      quizId: z.string(),
      answers: z.array(z.object({ questionId: z.string(), answer: z.string() })),
    }))
    .mutation(async ({ ctx, input }) => {
      await assertQuizAccess(ctx, input.quizId);
      const quiz = await ctx.db.quiz.findUnique({
        where: { id: input.quizId },
        include: { questions: { orderBy: { position: "asc" } } },
      });
      if (!quiz) throw new TRPCError({ code: "NOT_FOUND" });

      const answerMap = new Map(input.answers.map((a) => [a.questionId, a.answer]));
      let earnedPoints = 0;
      const totalPoints = quiz.questions.reduce((sum, q) => sum + q.points, 0);
      const canShowAnswers = quiz.showCorrectAnswers === true;

      const questionResults = quiz.questions.map((q) => {
        const userAnswer = answerMap.get(q.id) ?? "";
        const correct = userAnswer === q.correctAnswer;
        if (correct) earnedPoints += q.points;
        return {
          questionId: q.id,
          userAnswer,
          correct,
          correctAnswer: canShowAnswers ? q.correctAnswer : null,
          explanation: canShowAnswers ? q.explanation : null,
        };
      });

      const score = totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0;

      const attempt = await ctx.db.quizAttempt.create({
        data: {
          userId: ctx.session.user.id,
          quizId: input.quizId,
          score,
          totalPoints,
          earnedPoints,
          answers: questionResults,
          completedAt: new Date(),
          timeTaken: 0,
        },
      });

      return { attempt, score, earnedPoints, totalPoints, passed: score >= quiz.passingScore, questionResults };
    }),

  getAttempts: protectedProcedure
    .input(z.object({ quizId: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.quizAttempt.findMany({
        where: { quizId: input.quizId, userId: ctx.session.user.id },
        orderBy: { startedAt: "desc" },
      });
    }),

  create: instructorProcedure
    .input(z.object({
      lessonId: z.string(),
      title: z.string().min(1),
      timeLimit: z.number().optional(),
      passingScore: z.number().min(0).max(100).optional().default(70),
      shuffleQuestions: z.boolean().optional().default(false),
    }))
    .mutation(async ({ ctx, input }) => {
      const lesson = await ctx.db.lesson.findUnique({ where: { id: input.lessonId }, include: { module: { include: { course: true } } } });
      if (!lesson) throw new TRPCError({ code: "NOT_FOUND" });
      const profile = await ctx.db.instructorProfile.findUnique({ where: { userId: ctx.session.user.id } });
      if (!profile || lesson.module.course.instructorId !== profile.id) throw new TRPCError({ code: "FORBIDDEN" });
      return ctx.db.quiz.create({ data: { lessonId: input.lessonId, title: input.title, timeLimit: input.timeLimit, passingScore: input.passingScore ?? 70, shuffleQuestions: input.shuffleQuestions ?? false } });
    }),

  addQuestion: instructorProcedure
    .input(z.object({
      quizId: z.string(),
      type: z.enum(["MULTIPLE_CHOICE", "MULTI_SELECT", "TRUE_FALSE", "SHORT_ANSWER", "CODE"]),
      text: z.string().min(1),
      options: z.any().optional(),
      correctAnswer: z.string().optional(),
      points: z.number().optional().default(1),
      explanation: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      await assertInstructorOwnsQuiz(ctx, input.quizId);
      const maxPos = await ctx.db.question.aggregate({ where: { quizId: input.quizId }, _max: { position: true } });
      const position = (maxPos._max.position ?? 0) + 1;
      return ctx.db.question.create({
        data: { quizId: input.quizId, type: input.type, text: input.text, options: input.options, correctAnswer: input.correctAnswer, points: input.points ?? 1, explanation: input.explanation, position },
      });
    }),

  updateQuestion: instructorProcedure
    .input(z.object({
      id: z.string(),
      text: z.string().optional(),
      options: z.any().optional(),
      correctAnswer: z.string().optional(),
      explanation: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      await assertInstructorOwnsQuestion(ctx, input.id);
      const { id, ...data } = input;
      return ctx.db.question.update({ where: { id }, data });
    }),

  deleteQuestion: instructorProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await assertInstructorOwnsQuestion(ctx, input.id);
      return ctx.db.question.delete({ where: { id: input.id } });
    }),
});
