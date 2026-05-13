import { initTRPC, TRPCError } from "@trpc/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

// ─── Context ─────────────────────────────────────────────────────────────────
// Previously createContext always returned session: null (hardcoded TODO).
// Fixed: read the real Auth.js session so protectedProcedure actually works.

export type Context = {
  db: typeof db;
  session: { user: { id: string; role: string; email: string } } | null;
};

export const createContext = async (): Promise<Context> => {
  const session = await auth();

  if (!session?.user?.email) {
    return { db, session: null };
  }

  // Fetch role from our DB (JWT may be slightly stale on first OAuth sign-in)
  const user = await db.user.findUnique({
    where: { email: session.user.email },
    select: { id: true, role: true, email: true },
  });

  if (!user) return { db, session: null };

  return {
    db,
    session: {
      user: {
        id: user.id,
        role: user.role,
        email: user.email,
      },
    },
  };
};

// ─── tRPC init ────────────────────────────────────────────────────────────────
const t = initTRPC.context<Context>().create();

export const router           = t.router;
export const publicProcedure  = t.procedure;

// Requires a valid login session
export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.session?.user) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "You must be logged in" });
  }
  return next({
    ctx: {
      ...ctx,
      // TypeScript now knows session is non-null inside protected procedures
      session: ctx.session,
    },
  });
});

// Requires INSTRUCTOR or ADMIN role
export const instructorProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.session.user.role !== "INSTRUCTOR" && ctx.session.user.role !== "ADMIN") {
    throw new TRPCError({ code: "FORBIDDEN", message: "Instructor access required" });
  }
  return next({ ctx });
});

// Requires ADMIN role
export const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.session.user.role !== "ADMIN") {
    throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
  }
  return next({ ctx });
});
