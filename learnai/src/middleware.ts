import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// ─── Route protection config ─────────────────────────────────
const PROTECTED_ROUTES = ["/dashboard", "/certificates", "/profile"];
const INSTRUCTOR_ROUTES = ["/studio", "/analytics", "/payouts"];
const ADMIN_ROUTES = ["/admin"];
const AUTH_ROUTES = ["/login", "/register", "/forgot-password"];

// Auth.js v5 session decoding — see src/lib/auth.ts for full config
// Using a lightweight middleware that checks the session cookie
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Read Auth.js session token from cookie
  const sessionToken =
    req.cookies.get("authjs.session-token")?.value ??
    req.cookies.get("__Secure-authjs.session-token")?.value;

  const isLoggedIn = !!sessionToken;

  // ── Redirect logged-in users away from auth pages ──────────
  if (AUTH_ROUTES.some((r) => pathname.startsWith(r)) && isLoggedIn) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // ── Protect dashboard / user routes ───────────────────────
  if (PROTECTED_ROUTES.some((r) => pathname.startsWith(r)) && !isLoggedIn) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // ── Protect instructor-only routes ─────────────────────────
  if (INSTRUCTOR_ROUTES.some((r) => pathname.startsWith(r)) && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // ── Protect admin-only routes ──────────────────────────────
  if (ADMIN_ROUTES.some((r) => pathname.startsWith(r)) && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|public|api/webhooks).*)"],
};
