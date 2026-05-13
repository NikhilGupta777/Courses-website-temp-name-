import type { NextConfig } from "next";

// ─── Security headers ─────────────────────────────────────────────────────────
// Applied to every route. These protect against XSS, clickjacking, MIME sniffing,
// and other common browser-exploitable vulnerabilities.
const securityHeaders = [
  // Prevent the site being embedded in iframes on other origins (clickjacking)
  { key: "X-Frame-Options",        value: "SAMEORIGIN" },
  // Stop browsers from guessing MIME types (drive-by download attacks)
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Limit referrer info sent to third-party sites
  { key: "Referrer-Policy",        value: "strict-origin-when-cross-origin" },
  // Enable XSS filter in older browsers (belt-and-suspenders)
  { key: "X-XSS-Protection",       value: "1; mode=block" },
  // Restrict browser feature APIs available to this origin
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  // Force HTTPS for 1 year, include subdomains
  {
    key: "Strict-Transport-Security",
    value: "max-age=31536000; includeSubDomains; preload",
  },
  // Prevent cross-origin data leaks via fetch / XHR
  {
    key: "Cross-Origin-Resource-Policy",
    value: "same-origin",
  },
  {
    key: "Cross-Origin-Opener-Policy",
    value: "same-origin-allow-popups", // allow-popups for OAuth windows
  },
];

const nextConfig: NextConfig = {
  // ── Security headers on every response ─────────────────────────────────────
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },

  // ── Image optimisation ─────────────────────────────────────────────────────
  images: {
    remotePatterns: [
      // Mux video thumbnails
      { protocol: "https", hostname: "image.mux.com" },
      // AWS S3 / Cloudflare R2 for course thumbnails
      { protocol: "https", hostname: "*.s3.amazonaws.com" },
      { protocol: "https", hostname: "*.r2.cloudflarestorage.com" },
      // CDN for certificate / profile images
      { protocol: "https", hostname: "cdn.learnai.in" },
      // Google / GitHub OAuth avatars
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
    ],
    formats: ["image/avif", "image/webp"],
  },

  // ── Logging ─────────────────────────────────────────────────────────────────
  logging: {
    fetches: {
      fullUrl: process.env.NODE_ENV === "development",
    },
  },

  // ── TypeScript (strict in CI) ────────────────────────────────────────────────
  typescript: {
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
