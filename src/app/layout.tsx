import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SiteChrome } from "@/components/layout/SiteChrome";
import { SessionProvider } from "next-auth/react";
import { TRPCProvider } from "@/components/providers/trpc-provider";
import { ToastProvider } from "@/components/ui/toast";

const inter = Inter({ subsets: ["latin"], display: "swap" });

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://learnai.in";

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: "LearnAI — India's Best AI Courses Platform",
    template: "%s | LearnAI",
  },
  description:
    "Master ChatGPT, Gemini AI, Image Generation, and Prompt Engineering with India's top AI educators. Live classes, pre-recorded videos, quizzes, and verifiable certificates. Start free today.",
  keywords: [
    "AI courses India",
    "ChatGPT course",
    "Gemini AI training",
    "machine learning",
    "artificial intelligence",
    "prompt engineering",
    "image generation AI",
    "online AI classes",
    "AI certificate",
  ],
  authors: [{ name: "LearnAI", url: APP_URL }],
  creator: "LearnAI",
  publisher: "LearnAI",

  // Open Graph
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: APP_URL,
    siteName: "LearnAI",
    title: "LearnAI — India's Best AI Courses Platform",
    description:
      "Master ChatGPT, Gemini AI, Image Generation & Prompt Engineering. Live classes, certificates, and 12+ courses from India's top AI educators.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "LearnAI — AI Courses Platform",
      },
    ],
  },

  // Twitter Card
  twitter: {
    card: "summary_large_image",
    title: "LearnAI — India's Best AI Courses Platform",
    description:
      "Master ChatGPT, Gemini AI, Image Generation & Prompt Engineering. Start learning AI for free.",
    images: ["/og-image.png"],
    creator: "@learnai_india",
  },

  // Robots
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // App icons
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png" }],
    other: [{ rel: "mask-icon", url: "/safari-pinned-tab.svg", color: "#7c3aed" }],
  },

  // PWA manifest
  manifest: "/manifest.json",

  // Canonical
  alternates: { canonical: APP_URL },

  // App meta
  applicationName: "LearnAI",
  category: "education",

  // Verification
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        {/* PWA theme color */}
        <meta name="theme-color" content="#7c3aed" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="LearnAI" />
      </head>
      <body className={`${inter.className} antialiased`}>
        {/*
          Provider hierarchy (order matters):
          1. SessionProvider  — Auth.js session available everywhere
          2. TRPCProvider     — QueryClient + tRPC client
          3. ToastProvider    — Toast notifications + Toaster portal
        */}
        <SessionProvider>
          <TRPCProvider>
            <ToastProvider>
              <SiteChrome>{children}</SiteChrome>
            </ToastProvider>
          </TRPCProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
