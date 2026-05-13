import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// ─── Issue #006 fix: do NOT import `auth` from lib/auth.ts in middleware ───────
// lib/auth.ts uses PrismaAdapter which imports @prisma/client — a Node.js-only
// module that crashes in the Edge runtime that Next.js uses for middleware.
// Instead, we decode the JWT ourselves using jose (already installed by NextAuth)
// which is Edge-compatible and zero-dependency.
//
// We read the session cookie that NextAuth writes and verify it with AUTH_SECRET.
// This gives us the user's id and role without hitting the database or using
// Node.js APIs, keeping the middleware fully Edge-compatible.

import { jwtVerify, type JWTPayload } from "jose";

const PROTECTED_ROUTES  = ["/dashboard", "/certificates", "/profile"];
const INSTRUCTOR_ROUTES = ["/studio", "/analytics", "/payouts"];
const ADMIN_ROUTES      = ["/admin"];
const AUTH_ROUTES       = ["/login", "/register", "/forgot-password"];

// Cookie names used by Auth.js v5 (changes between http/https)
const SESSION_COOKIE_NAMES = [
  "authjs.session-token",
  "__Secure-authjs.session-token",
];

interface SessionPayload extends JWTPayload {
  id?:   string;
  role?: string;
  email?: string;
}

async function getSessionPayload(req: NextRequest): Promise<SessionPayload | null> {
  const secret = process.env.AUTH_SECRET;
  if (!secret) return null;

  for (const cookieName of SESSION_COOKIE_NAMES) {
    const token = req.cookies.get(cookieName)?.value;
    if (!token) continue;

    try {
      const secretBytes = new TextEncoder().encode(secret);
      const { payload } = await jwtVerify(token, secretBytes);
      return payload as SessionPayload;
    } catch {
      // Token invalid or expired — treat as logged out
      continue;
    }
  }

  return null;
}

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const session = await getSessionPayload(req);
  const isLoggedIn = session !== null;
  const role = session?.role ?? "STUDENT";

  // ── Redirect logged-in users away from auth pages ──────────────────────────
  if (AUTH_ROUTES.some((r) => pathname.startsWith(r)) && isLoggedIn) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // ── Protect dashboard / user routes ────────────────────────────────────────
  if (PROTECTED_ROUTES.some((r) => pathname.startsWith(r)) && !isLoggedIn) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // ── Protect instructor-only routes ─────────────────────────────────────────
  if (INSTRUCTOR_ROUTES.some((r) => pathname.startsWith(r))) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    if (role !== "INSTRUCTOR" && role !== "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  }

  // ── Protect admin-only routes ──────────────────────────────────────────────
  if (ADMIN_ROUTES.some((r) => pathname.startsWith(r))) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    if (role !== "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Skip static assets, images, favicon, and webhook routes (no auth needed there)
    "/((?!_next/static|_next/image|favicon.ico|public|api/webhooks).*)",
  ],
};
