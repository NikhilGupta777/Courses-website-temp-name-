"use client";

import Link from "next/link";
import { useState } from "react";
import { PLANS, TRUST_BADGES, PRICING_FAQ, COMPARISON_FEATURES } from "@/lib/data/pricing";

function CheckIcon({ included, dark }: { included: boolean; dark?: boolean }) {
  if (included) {
    return (
      <svg className={`w-4 h-4 flex-shrink-0 ${dark ? "text-violet-200" : "text-violet-500"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    );
  }
  return (
    <svg className={`w-4 h-4 flex-shrink-0 ${dark ? "text-violet-400/60" : "text-gray-300"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

export default function PricingPage() {
  const [annual, setAnnual] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative py-20 bg-gradient-to-br from-violet-50 via-white to-indigo-50 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-20 left-1/4 w-72 h-72 bg-violet-200/30 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 right-1/4 w-72 h-72 bg-indigo-200/30 rounded-full blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-violet-100 text-violet-700 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            All prices in Indian Rupees · GST inclusive
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900">
            Simple, Honest{" "}
            <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">Pricing</span>
          </h1>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Start free forever. Upgrade when you&apos;re ready. No hidden charges. Cancel anytime.
          </p>

          {/* Billing toggle */}
          <div className="mt-8 inline-flex items-center gap-4 bg-gray-100 rounded-2xl p-1.5">
            <button
              onClick={() => setAnnual(false)}
              className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all ${!annual ? "bg-white shadow-sm text-gray-900" : "text-gray-500 hover:text-gray-700"}`}
            >
              Monthly
            </button>
            <button
              onClick={() => setAnnual(true)}
              className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${annual ? "bg-white shadow-sm text-gray-900" : "text-gray-500 hover:text-gray-700"}`}
            >
              Annual
              <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded-full">Save ₹2,989</span>
            </button>
          </div>
        </div>
      </section>

      {/* Plans grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
            {PLANS.map((plan) => {
              const displayPrice = annual && plan.annualPriceDisplay
                ? plan.annualPriceDisplay
                : plan.priceDisplay;
              const displayPeriod = annual && plan.annualPrice ? "/year" : plan.period;
              const monthlyEquiv = annual && plan.annualPrice
                ? `₹${Math.round(plan.annualPrice / 12).toLocaleString("en-IN")}/mo`
                : null;

              return (
                <div
                  key={plan.id}
                  className={`relative rounded-2xl flex flex-col ${
                    plan.popular
                      ? "bg-gradient-to-b from-violet-600 to-indigo-700 text-white shadow-2xl shadow-violet-500/30 -mt-4 mb-4"
                      : "bg-white border border-gray-200 shadow-sm"
                  }`}
                >
                  {plan.badge && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                      <span className={`text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap ${plan.popular ? "bg-yellow-400 text-yellow-900" : "bg-indigo-100 text-indigo-700"}`}>
                        {plan.badge}
                      </span>
                    </div>
                  )}

                  <div className="p-8 pb-6">
                    <h2 className={`text-xl font-bold ${plan.popular ? "text-white" : "text-gray-900"}`}>{plan.name}</h2>
                    <p className={`mt-1 text-sm ${plan.popular ? "text-violet-200" : "text-gray-500"}`}>{plan.description}</p>

                    <div className="mt-6">
                      <div className="flex items-baseline gap-1">
                        <span className={`text-5xl font-extrabold ${plan.popular ? "text-white" : "text-gray-900"}`}>
                          {displayPrice}
                        </span>
                        {displayPeriod && (
                          <span className={`text-sm ${plan.popular ? "text-violet-200" : "text-gray-500"}`}>{displayPeriod}</span>
                        )}
                      </div>
                      {monthlyEquiv && (
                        <p className={`text-xs mt-1 ${plan.popular ? "text-violet-200" : "text-green-600"}`}>
                          Just {monthlyEquiv} billed annually
                        </p>
                      )}
                      {plan.originalPrice && !annual && (
                        <p className={`text-xs mt-1 line-through ${plan.popular ? "text-violet-300" : "text-gray-400"}`}>
                          ₹{plan.originalPrice.toLocaleString("en-IN")}/month
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="px-8 pb-6 flex-1">
                    <ul className="space-y-3">
                      {plan.features.map((f) => (
                        <li key={f.text} className="flex items-start gap-2.5">
                          <CheckIcon included={f.included} dark={plan.popular} />
                          <span className={`text-sm leading-snug ${
                            plan.popular
                              ? f.included ? "text-white" : "text-violet-300/70"
                              : f.included ? "text-gray-700" : "text-gray-400"
                          }`}>
                            {f.text}
                          </span>
                        </li>
                      ))}
                    </ul>

                    {plan.useCases && (
                      <div className="mt-5">
                        <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">Ideal for</p>
                        <div className="flex flex-wrap gap-1.5">
                          {plan.useCases.map((u) => (
                            <span key={u} className="text-xs bg-indigo-50 text-indigo-700 px-2.5 py-0.5 rounded-full font-medium">{u}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="px-8 pb-8">
                    <Link
                      href={plan.href}
                      className={`block text-center py-3.5 px-4 rounded-xl text-sm font-semibold transition-all hover:scale-[1.02] ${
                        plan.popular
                          ? "bg-white text-violet-700 hover:bg-violet-50 shadow-lg"
                          : plan.id === "free"
                          ? "bg-gray-100 text-gray-800 hover:bg-gray-200"
                          : "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md hover:shadow-lg"
                      }`}
                    >
                      {plan.cta}
                    </Link>
                    {plan.popular && (
                      <p className="text-center text-violet-200 text-xs mt-2">7-day free trial · No credit card needed</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Trust badges */}
      <section className="py-8 bg-gray-50 border-y border-gray-100">
        <div className="mx-auto max-w-5xl px-4">
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10">
            {TRUST_BADGES.map((badge) => (
              <div key={badge} className="flex items-center gap-2 text-sm text-gray-600">
                <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {badge}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison table */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-10">Full Feature Comparison</h2>
          <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left py-4 px-5 text-sm font-semibold text-gray-700">Feature</th>
                  <th className="py-4 px-4 text-sm font-semibold text-gray-700 text-center">Free</th>
                  <th className="py-4 px-4 text-sm font-semibold text-violet-700 text-center bg-violet-50">Pro</th>
                  <th className="py-4 px-4 text-sm font-semibold text-indigo-700 text-center">Enterprise</th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON_FEATURES.map((row, i) => (
                  <tr key={row.feature} className={i % 2 === 0 ? "bg-white" : "bg-gray-50/50"}>
                    <td className="py-3.5 px-5 text-sm text-gray-700 font-medium">{row.feature}</td>
                    <td className="py-3.5 px-4 text-sm text-center text-gray-500">{row.free}</td>
                    <td className="py-3.5 px-4 text-sm text-center text-violet-700 font-medium bg-violet-50/50">{row.pro}</td>
                    <td className="py-3.5 px-4 text-sm text-center text-indigo-700">{row.enterprise}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-10">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {PRICING_FAQ.map((faq, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left"
                >
                  <span className="font-semibold text-gray-900 text-sm pr-4">{faq.question}</span>
                  <svg
                    className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform ${openFaq === i ? "rotate-180" : ""}`}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-5 text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-4">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-16 bg-gradient-to-r from-violet-600 to-indigo-600 text-center px-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">Ready to get started?</h2>
        <p className="text-violet-200 mb-8">Start free today. Upgrade anytime. 30-day money-back guarantee on Pro.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/register" className="px-8 py-3.5 bg-white text-violet-700 font-semibold rounded-xl hover:bg-violet-50 shadow-lg transition-all hover:scale-105">
            Start Free
          </Link>
          <Link href="/register?plan=pro" className="px-8 py-3.5 bg-white/10 text-white font-semibold rounded-xl border border-white/30 hover:bg-white/20 transition-all">
            Try Pro — 7 Days Free
          </Link>
        </div>
      </section>
    </div>
  );
}
