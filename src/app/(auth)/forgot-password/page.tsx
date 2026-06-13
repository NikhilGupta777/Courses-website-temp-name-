"use client";

import Link from "next/link";
import { useState, Suspense } from "react";
import { AuthShell, authInputClass } from "@/components/shared/AuthShell";

function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) {
        const d = await res.json();
        setError(d.error ?? "Something went wrong.");
      } else {
        setSent(true);
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      heading="Forgot your password?"
      subheading="No problem. Enter your email and we'll send a reset link."
      footer={
        <>
          Remember your password?{" "}
          <Link href="/login" className="text-violet-600 font-semibold hover:text-violet-700">Sign in</Link>
        </>
      }
    >
      {sent ? (
        <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center animate-fade-in">
          <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="text-lg font-bold text-green-800 mb-2">Check your inbox</h2>
          <p className="text-sm text-green-700 mb-4">
            We&apos;ve sent a password reset link to <strong>{email}</strong>. It expires in 1 hour.
          </p>
          <p className="text-xs text-green-600">
            Didn&apos;t receive it? Check spam or{" "}
            <button onClick={() => setSent(false)} className="underline font-medium">try again</button>.
          </p>
        </div>
      ) : (
        <>
          {error && (
            <div role="alert" className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 animate-fade-in">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">Email address</label>
              <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" placeholder="you@example.com" className={authInputClass} />
            </div>
            <button type="submit" disabled={loading} className="w-full py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-violet-700 hover:to-indigo-700 transition-all shadow-md shadow-violet-500/20 disabled:opacity-50 flex items-center justify-center gap-2">
              {loading ? (<><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />Sending…</>) : "Send Reset Link"}
            </button>
          </form>
        </>
      )}
    </AuthShell>
  );
}

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-white"><div className="w-8 h-8 border-4 border-violet-600 border-t-transparent rounded-full animate-spin" /></div>}>
      <ForgotPasswordForm />
    </Suspense>
  );
}
