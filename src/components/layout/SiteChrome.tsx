"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { Header } from "./header";
import { Footer } from "./footer";

// ─── SiteChrome ─────────────────────────────────────────────────────────────
// Decides whether to render the marketing Header/Footer + main padding.
// Auth screens (login/register/forgot/reset) are full-bleed split layouts and
// should NOT show the global header, footer, or the top padding.

const FULLSCREEN_PREFIXES = ["/login", "/register", "/forgot-password", "/reset-password"];

export function SiteChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname() ?? "";
  const isFullscreen = FULLSCREEN_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );

  if (isFullscreen) {
    return <>{children}</>;
  }

  return (
    <>
      <Header />
      <main className="min-h-screen pt-16">{children}</main>
      <Footer />
    </>
  );
}
