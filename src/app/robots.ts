import type { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://learnai.in";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          // ─── Fix #10: only disallow routes that expose private user data ───
          //
          // Removed from the original disallow list:
          //   /forgot-password  — this is a public, discoverable page; some users
          //                       land on it directly from a search for "reset
          //                       LearnAI password". It contains no private data.
          //
          // Kept:
          //   /reset-password   — contains a one-time security token in the query
          //                       string; we do NOT want this indexed/cached by
          //                       crawlers under any circumstances.
          //   /dashboard*       — personal student progress data
          //   /admin*           — admin panel
          //   /studio*          — instructor-only content management
          //   /api/             — all API routes (no crawlable HTML content)
          //                       Note: /api/auth/* uses normal fetch/redirects
          //                       for OAuth; robots.txt disallow does not affect
          //                       browser-initiated OAuth flows, only crawlers.

          "/dashboard",
          "/dashboard/",
          "/admin",
          "/admin/",
          "/studio",
          "/studio/",
          "/api/",
          "/reset-password",
        ],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  };
}
