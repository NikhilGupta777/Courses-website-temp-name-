import type { ReactNode } from "react";
import Link from "next/link";
import { AuthBrandPanel } from "./AuthBrandPanel";

// ─── AuthShell ──────────────────────────────────────────────────────────────
// Two-column premium layout for all auth screens: animated brand panel on the
// left (hidden on mobile), the form column on the right. Each page passes its
// heading, optional icon, and form content as children.

interface AuthShellProps {
  heading: string;
  subheading?: ReactNode;
  children: ReactNode;
  /** Footer line below the card (e.g. "Don't have an account? Sign up"). */
  footer?: ReactNode;
}

export function AuthShell({ heading, subheading, children, footer }: AuthShellProps) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-white">
      {/* Left brand panel */}
      <AuthBrandPanel />

      {/* Right form column */}
      <div className="relative flex flex-col items-center justify-center px-4 py-12 sm:px-8">
        {/* Subtle mesh on mobile where the brand panel is hidden */}
        <div className="absolute inset-0 lg:hidden bg-gradient-to-br from-violet-50 via-white to-indigo-50 pointer-events-none" />

        <div className="relative w-full max-w-md">
          {/* Mobile brand mark */}
          <Link href="/" className="lg:hidden inline-flex items-center gap-2 mb-8">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-md">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M22 10v6M2 10l10-5 10 5-10 5z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12v5c3 3 9 3 12 0v-5" />
              </svg>
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
              LearnAI
            </span>
          </Link>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">{heading}</h1>
            {subheading && <p className="mt-2 text-sm text-gray-500">{subheading}</p>}
          </div>

          {children}

          {footer && <div className="mt-6 text-center text-sm text-gray-500">{footer}</div>}
        </div>
      </div>
    </div>
  );
}

// Shared input style used across auth forms for visual consistency.
export const authInputClass =
  "w-full px-4 py-3 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-shadow placeholder:text-gray-400";
