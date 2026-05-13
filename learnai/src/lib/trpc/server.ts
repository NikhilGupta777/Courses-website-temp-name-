import { initTRPC, TRPCError } from "@trpc/server";
import { db } from "@/lib/db";
import { z } from "zod";

export type Context = {
  db: typeof db;
  session: { user: { id: string; role: string } } | null;
};

export const createContext = async (): Promise<Context> => {
  // TODO: Get session from Auth.js
  return {
    db,
    session: null,
  };
};

const t = initTRPC.context<Context>().create();

export const router = t.router;
export const publicProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.session?.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({
    ctx: {
      ...ctx,
      session: ctx.session,
    },
  });
});

export const instructorProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.session.user.role !== "INSTRUCTOR" && ctx.session.user.role !== "ADMIN") {
    throw new TRPCError({ code: "FORBIDDEN" });
  }
  return next({ ctx });
});

export const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.session.user.role !== "ADMIN") {
    throw new TRPCError({ code: "FORBIDDEN" });
  }
  return next({ ctx });
});
