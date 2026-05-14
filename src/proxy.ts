import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { sanitizeLoginCallbackUrl } from "@/lib/security";

// ─── Issue #006 fix: do NOT import `auth` from lib/auth.ts in middleware ───────
// lib/auth.ts uses PrismaAdapter which imports @prisma/client — a Node.js-only
// module that crashes in the Edge runtime that Next.js uses for middleware.
// Use Auth.js' Edge-compatible token decoder so the proxy understands Auth.js
// cookie formats without importing the Prisma-backed auth config.

const PROTECTED_ROUTES  = ["/dashboard", "/certificates", "/profile"];
const INSTRUCTOR_ROUTES = ["/studio", "/analytics", "/payouts"];
const ADMIN_ROUTES      = ["/admin"];
const AUTH_ROUTES       = ["/login", "/register", "/forgot-password"];

async function getSessionPayload(req: NextRequest) {
  const secret = process.env.AUTH_SECRET;
  if (!secret) return null;
  return getToken({ req, secret });
}

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const session = await getSessionPayload(req);
  const isLoggedIn = session !== null;
  const role = session?.role ?? "STUDENT";

  // ── Redirect logged-in users away from auth pages ──────────────────────────
  if (AUTH_ROUTES.some((r) => pathname.startsWith(r)) && isLoggedIn) {
    const callbackUrl = sanitizeLoginCallbackUrl(req.nextUrl.searchParams.get("callbackUrl"));
    const authRedirect = AUTH_ROUTES.some((r) => callbackUrl.startsWith(r)) ? "/dashboard" : callbackUrl;
    return NextResponse.redirect(new URL(authRedirect, req.url));
  }

  // ── Protect dashboard / user routes ────────────────────────────────────────
  if (PROTECTED_ROUTES.some((r) => pathname.startsWith(r)) && !isLoggedIn) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", `${pathname}${req.nextUrl.search}`);
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
