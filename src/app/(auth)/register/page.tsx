"use client";

import Link from "next/link";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { AuthShell, authInputClass } from "@/components/shared/AuthShell";

function strengthLabel(pw: string) {
  if (pw.length < 6) return { label: "Weak", level: 1 };
  if (pw.length < 10) return { label: "Moderate", level: 2 };
  if (pw.length < 13) return { label: "Strong", level: 3 };
  return { label: "Very strong", level: 4 };
}

export default function RegisterPage() {
  const [formData, setFormData] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [showPw, setShowPw] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<"google" | "github" | null>(null);
  const [error, setError] = useState<string | null>(null);

  const strength = strengthLabel(formData.password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (formData.password !== formData.confirmPassword) { setError("Passwords do not match"); return; }
    if (formData.password.length < 8) { setError("Password must be at least 8 characters"); return; }
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: formData.name, email: formData.email, password: formData.password }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "Registration failed. Please try again.");
        setIsLoading(false);
        return;
      }
      await signIn("credentials", { email: formData.email, password: formData.password, callbackUrl: "/dashboard", redirect: true });
    } catch {
      setError("Something went wrong. Please try again.");
      setIsLoading(false);
    }
  };

  const handleOAuth = (provider: "google" | "github") => {
    setOauthLoading(provider);
    signIn(provider, { callbackUrl: "/dashboard" });
  };

  return (
    <AuthShell
      heading="Create your account"
      subheading="Join 10,000+ learners mastering AI. Start free — no card needed."
      footer={
        <>
          Already have an account?{" "}
          <Link href="/login" className="text-violet-600 font-semibold hover:text-violet-700">Sign in</Link>
        </>
      }
    >
      {error && (
        <div role="alert" className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 animate-fade-in">
          {error}
        </div>
      )}

      {/* OAuth */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <button onClick={() => handleOAuth("google")} disabled={!!oauthLoading} type="button" className="flex items-center justify-center gap-2 px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-colors disabled:opacity-60">
          {oauthLoading === "google" ? <span className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" /> : (
            <svg className="w-5 h-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /></svg>
          )}
          <span className="text-sm font-medium text-gray-700">Google</span>
        </button>
        <button onClick={() => handleOAuth("github")} disabled={!!oauthLoading} type="button" className="flex items-center justify-center gap-2 px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-colors disabled:opacity-60">
          {oauthLoading === "github" ? <span className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" /> : (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" /></svg>
          )}
          <span className="text-sm font-medium text-gray-700">GitHub</span>
        </button>
      </div>

      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200" /></div>
        <div className="relative flex justify-center text-xs"><span className="px-3 bg-white text-gray-400">or sign up with email</span></div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
          <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Rahul Verma" required autoComplete="name" className={authInputClass} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
          <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="you@example.com" required autoComplete="email" className={authInputClass} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
          <div className="relative">
            <input type={showPw ? "text" : "password"} value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} placeholder="Min. 8 characters" required minLength={8} autoComplete="new-password" className={`${authInputClass} pr-10`} />
            <button type="button" onClick={() => setShowPw(!showPw)} aria-label={showPw ? "Hide password" : "Show password"} className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600">
              {showPw
                ? <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                : <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>}
            </button>
          </div>
          {formData.password.length > 0 && (
            <div className="mt-2">
              <div className="flex gap-1 mb-1">
                {[1, 2, 3, 4].map((level) => (
                  <div key={level} className={`h-1.5 flex-1 rounded-full transition-colors ${
                    level <= strength.level
                      ? strength.level <= 1 ? "bg-red-400" : strength.level === 2 ? "bg-yellow-400" : strength.level === 3 ? "bg-lime-500" : "bg-green-500"
                      : "bg-gray-200"
                  }`} />
                ))}
              </div>
              <p className="text-xs text-gray-400">{strength.label}</p>
            </div>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm Password</label>
          <input type="password" value={formData.confirmPassword} onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })} placeholder="Repeat your password" required autoComplete="new-password" className={authInputClass} />
        </div>
        <div className="flex items-start gap-2">
          <input type="checkbox" required id="terms" className="mt-1 rounded border-gray-300 text-violet-600 focus:ring-violet-500" />
          <label htmlFor="terms" className="text-xs text-gray-500">
            I agree to the{" "}
            <Link href="/terms" className="text-violet-600 hover:underline">Terms of Service</Link>{" "}and{" "}
            <Link href="/privacy" className="text-violet-600 hover:underline">Privacy Policy</Link>
          </label>
        </div>
        <button type="submit" disabled={isLoading} className="w-full py-3 px-4 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-violet-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg shadow-violet-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
          {isLoading ? (<><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />Creating account…</>) : "Create Account"}
        </button>
      </form>
    </AuthShell>
  );
}
