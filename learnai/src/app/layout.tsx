import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { SessionProvider } from "next-auth/react";

const inter = Inter({ subsets: ["latin"] });

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://learnai.in";

// FIX #18: comprehensive metadata with Open Graph, Twitter Card, robots
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

  // Verification (fill in once accounts are created)
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },

  // App icons
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },

  // Canonical
  alternates: {
    canonical: APP_URL,
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} antialiased`}>
        {/*
          SessionProvider makes useSession() available throughout the app.
          Required for the header to read the logged-in user.
        */}
        <SessionProvider>
          <Header />
          <main className="min-h-screen pt-16">{children}</main>
          <Footer />
        </SessionProvider>
      </body>
    </html>
  );
}
