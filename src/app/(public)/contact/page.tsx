"use client";

import { useState } from "react";

const contactReasons = [
  "General Enquiry",
  "Course Support",
  "Technical Issue",
  "Enterprise / College Partnership",
  "Instructor Application",
  "Refund Request",
  "Press / Media",
];

const faqs = [
  { q: "How do I reset my password?", a: "Go to the login page and click 'Forgot Password'. Enter your email and we'll send you a reset link within 2 minutes." },
  { q: "I paid but can't access the course — what do I do?", a: "This usually resolves within 5 minutes. If not, email support@learnai.in with your payment receipt and we'll fix it immediately." },
  { q: "How do I get a GST invoice?", a: "GST invoices are automatically emailed after every payment. You can also download them from your Account → Billing page." },
  { q: "Can I get a refund?", a: "Yes — 30-day no-questions-asked money-back guarantee for Pro subscriptions. Email support@learnai.in with your order details." },
];

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", reason: "", message: "", website: "" });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // FIX #22: call real API endpoint instead of a fake setTimeout
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json();
        alert(data.error ?? "Failed to send. Please try again.");
      } else {
        setSent(true);
      }
    } catch {
      alert("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">

      {/* ── Hero ── */}
      <section className="py-20 bg-gradient-to-br from-violet-50 via-white to-indigo-50">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900">
            Get in <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">Touch</span>
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            We typically respond within 4 business hours. For urgent issues, reach out on WhatsApp.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-sm text-gray-500">
            <a href="mailto:support@learnai.in" className="flex items-center gap-2 hover:text-violet-600 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              support@learnai.in
            </a>
            <span className="text-gray-300">|</span>
            <a href="https://wa.me/919999999999" className="flex items-center gap-2 hover:text-green-600 transition-colors">
              <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.464 3.488" /></svg>
              WhatsApp Support
            </a>
            <span className="text-gray-300">|</span>
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              Bangalore, Karnataka, India
            </span>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">

          {/* ── Contact Form ── */}
          <div className="lg:col-span-3">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h2>
            {sent ? (
              <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-green-800 mb-2">Message sent!</h3>
                <p className="text-green-700 text-sm">We&apos;ll get back to you at <strong>{form.email}</strong> within 4 business hours.</p>
                <button onClick={() => { setSent(false); setForm({ name: "", email: "", reason: "", message: "", website: "" }); }}
                  className="mt-6 px-6 py-2.5 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-colors text-sm">
                  Send Another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Honeypot — hidden from real users, but bots will fill it */}
                <input
                  type="text"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  value={form.website}
                  onChange={(e) => setForm({ ...form, website: e.target.value })}
                  style={{ position: "absolute", left: "-9999px", width: "1px", height: "1px", opacity: 0 }}
                  aria-hidden="true"
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name *</label>
                    <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Rahul Mehta"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-shadow" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address *</label>
                    <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="you@example.com"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-shadow" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Reason for Contact *</label>
                  <select required value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 bg-white cursor-pointer">
                    <option value="">Select a reason...</option>
                    {contactReasons.map((r) => <option key={r}>{r}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Message *</label>
                  <textarea required rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Tell us how we can help you..."
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none transition-shadow" />
                </div>
                <button type="submit" disabled={loading}
                  className="w-full py-3.5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-violet-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all disabled:opacity-60">
                  {loading ? "Sending..." : "Send Message →"}
                </button>
                <p className="text-xs text-gray-400 text-center">We respond within 4 business hours · Mon–Sat 9am–7pm IST</p>
              </form>
            )}
          </div>

          {/* ── FAQ sidebar ── */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-5">Quick Answers</h2>
              <div className="space-y-4">
                {faqs.map((faq, i) => (
                  <div key={i} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <h3 className="text-sm font-semibold text-gray-900 mb-1.5">{faq.q}</h3>
                    <p className="text-xs text-gray-600 leading-relaxed">{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-violet-50 to-indigo-50 rounded-2xl p-6 border border-violet-100">
              <h3 className="font-bold text-gray-900 mb-1">Enterprise / College Enquiry?</h3>
              <p className="text-sm text-gray-600 mb-4">For team plans, custom curricula, and institutional pricing, reach our education team directly.</p>
              <a href="mailto:enterprise@learnai.in" className="flex items-center gap-2 text-sm font-semibold text-violet-600 hover:text-violet-700 transition-colors">
                enterprise@learnai.in →
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
