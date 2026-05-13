import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { z } from "zod";

type UserWithRole = {
  role?: string;
};

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(db),

  // ── Session strategy ──────────────────────────────────────
  session: { strategy: "jwt" },

  // ── Pages ─────────────────────────────────────────────────
  pages: {
    signIn: "/login",
    error: "/login",
  },

  // ── Providers ─────────────────────────────────────────────
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),

    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        // Validate input shape
        const parsed = z
          .object({ email: z.string().email(), password: z.string().min(8) })
          .safeParse(credentials);

        if (!parsed.success) return null;

        const { email, password } = parsed.data;

        // Look up user
        const user = await db.user.findUnique({ where: { email } });
        if (!user || !user.password) return null;

        // Verify password
        const valid = await bcrypt.compare(password, user.password);
        if (!valid) return null;

        // Block suspended accounts
        if (!user.isActive) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role,
        };
      },
    }),
  ],

  // ── Callbacks ─────────────────────────────────────────────
  callbacks: {
    // Attach role & id to the JWT
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        // For OAuth sign-in, fetch role from DB
        if (account?.provider !== "credentials") {
          const dbUser = await db.user.findUnique({ where: { email: user.email! } });
          token.role = dbUser?.role ?? "STUDENT";
        } else {
          token.role = (user as UserWithRole).role ?? "STUDENT";
        }
      }
      return token;
    },

    // Expose id and role on the session.user object
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        (session.user as UserWithRole).role = typeof token.role === "string" ? token.role : "STUDENT";
      }
      return session;
    },
  },

  // ── Events ────────────────────────────────────────────────
  events: {
    // Create default FREE subscription on first sign-in
    async createUser({ user }) {
      await db.subscription.create({
        data: {
          userId: user.id!,
          plan: "FREE",
          status: "ACTIVE",
          currentPeriodStart: new Date(),
          currentPeriodEnd: new Date(Date.now() + 100 * 365 * 24 * 60 * 60 * 1000), // far future
        },
      });
    },
  },

  // ── Security ──────────────────────────────────────────────
  secret: process.env.AUTH_SECRET,
  trustHost: true,
});
