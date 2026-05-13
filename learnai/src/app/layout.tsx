import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "LearnAI - Master Artificial Intelligence",
  description:
    "World-class AI courses with live classes, pre-recorded videos, quizzes, certificates, and hands-on projects. Start your AI journey today.",
  keywords: [
    "AI courses",
    "machine learning",
    "deep learning",
    "data science",
    "artificial intelligence",
    "online learning",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} antialiased`}>
        <Header />
        <main className="min-h-screen pt-16">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
