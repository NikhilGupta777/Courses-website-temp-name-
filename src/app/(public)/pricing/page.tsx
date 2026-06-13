"use client";

import { useState } from "react";
import { PLANS, TRUST_BADGES, PRICING_FAQ, COMPARISON_FEATURES } from "@/lib/data/pricing";
import { PageHero } from "@/components/shared/PageHero";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { RevealOnScroll } from "@/components/home/RevealOnScroll";
import { MagneticButton } from "@/components/home/MagneticButton";

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
    <div className="bg-white">
      {/* ── Animated hero ── */}
      <PageHero
        eyebrow="All prices in ₹ · GST inclusive"
        title={
          <>
            Simple, honest{" "}
            <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">pricing</span>
          </>
        }
        subtitle="Start free forever. Upgrade when you're ready. No hidden charges. Cancel anytime."
      >
        {/* Billing toggle */}
        <div className="inline-flex items-center gap-2 bg-white/70 backdrop-blur-sm border border-violet-100 rounded-2xl p-1.5 shadow-sm">
          <button
            onClick={() => setAnnual(false)}
            className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all ${!annual ? "bg-violet-600 text-white shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
          >
            Monthly
          </button>
          <button
            onClick={() => setAnnual(true)}
            className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${annual ? "bg-violet-600 text-white shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
          >
            Annual
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${annual ? "bg-white/20 text-white" : "bg-green-100 text-green-700"}`}>Save ₹2,989</span>
          </button>
        </div>
      </PageHero>

      {/* ── Plans grid ── */}
      <section className="py-12 lg:py-16 px-4 sm:px-6 lg:px-8 -mt-4">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
            {PLANS.map((plan, i) => {
              const displayPrice = annual && plan.annualPriceDisplay ? plan.annualPriceDisplay : plan.priceDisplay;
              const displayPeriod = annual && plan.annualPrice ? "/year" : plan.period;
              const monthlyEquiv = annual && plan.annualPrice
                ? `₹${Math.round(plan.annualPrice / 12).toLocaleString("en-IN")}/mo`
                : null;

              return (
                <RevealOnScroll key={plan.id} delay={i * 100} from="bottom">
                  <div
                    className={`relative rounded-3xl flex flex-col transition-transform hover:-translate-y-1 ${
                      plan.popular
                        ? "bg-gradient-to-b from-violet-600 to-indigo-700 text-white shadow-2xl shadow-violet-500/30 md:-mt-4 md:mb-4"
                        : "bg-white border border-gray-200 shadow-sm hover:shadow-xl"
                    }`}
                  >
                    {plan.badge && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                        <span className={`text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap shadow-sm ${plan.popular ? "bg-yellow-400 text-yellow-900" : "bg-indigo-100 text-indigo-700"}`}>
                          {plan.badge}
                        </span>
                      </div>
                    )}

                    <div className="p-8 pb-6">
                      <h2 className={`text-xl font-bold ${plan.popular ? "text-white" : "text-gray-900"}`}>{plan.name}</h2>
                      <p className={`mt-1 text-sm ${plan.popular ? "text-violet-200" : "text-gray-500"}`}>{plan.description}</p>

                      <div className="mt-6">
                        <div className="flex items-baseline gap-1">
                          <span className={`text-5xl font-extrabold tracking-tight ${plan.popular ? "text-white" : "text-gray-900"}`}>{displayPrice}</span>
                          {displayPeriod && <span className={`text-sm ${plan.popular ? "text-violet-200" : "text-gray-500"}`}>{displayPeriod}</span>}
                        </div>
                        {monthlyEquiv && <p className={`text-xs mt-1 ${plan.popular ? "text-violet-200" : "text-green-600"}`}>Just {monthlyEquiv} billed annually</p>}
                        {plan.originalPrice && !annual && (
                          <p className={`text-xs mt-1 line-through ${plan.popular ? "text-violet-300" : "text-gray-400"}`}>₹{plan.originalPrice.toLocaleString("en-IN")}/month</p>
                        )}
                      </div>
                    </div>

                    <div className="px-8 pb-6 flex-1">
                      <ul className="space-y-3">
                        {plan.features.map((f) => (
                          <li key={f.text} className="flex items-start gap-2.5">
                            <CheckIcon included={f.included} dark={plan.popular} />
                            <span className={`text-sm leading-snug ${plan.popular ? (f.included ? "text-white" : "text-violet-300/70") : f.included ? "text-gray-700" : "text-gray-400"}`}>
                              {f.text}
                            </span>
                          </li>
                        ))}
                      </ul>

                      {plan.useCases && (
                        <div className="mt-5">
                          <p className={`text-xs font-semibold mb-2 uppercase tracking-wide ${plan.popular ? "text-violet-200" : "text-gray-500"}`}>Ideal for</p>
                          <div className="flex flex-wrap gap-1.5">
                            {plan.useCases.map((u) => (
                              <span key={u} className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${plan.popular ? "bg-white/15 text-violet-100" : "bg-indigo-50 text-indigo-700"}`}>{u}</span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="px-8 pb-8">
                      <MagneticButton
                        href={plan.href}
                        strength={8}
                        className={`block text-center py-3.5 px-4 rounded-xl text-sm font-semibold transition-all ${
                          plan.popular
                            ? "bg-white text-violet-700 hover:bg-violet-50 shadow-lg"
                            : plan.id === "free"
                            ? "bg-gray-100 text-gray-800 hover:bg-gray-200"
                            : "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md hover:shadow-lg shadow-violet-500/20"
                        }`}
                      >
                        {plan.cta}
                      </MagneticButton>
                      {plan.popular && <p className="text-center text-violet-200 text-xs mt-2">7-day free trial · No credit card needed</p>}
                    </div>
                  </div>
                </RevealOnScroll>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Trust badges ── */}
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

      {/* ── Comparison table ── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="mx-auto max-w-4xl">
          <RevealOnScroll>
            <SectionHeading eyebrow="Compare" title="Full feature comparison" className="mb-10" />
          </RevealOnScroll>
          <RevealOnScroll delay={100}>
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
          </RevealOnScroll>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-violet-50/30 to-white">
        <div className="mx-auto max-w-3xl">
          <RevealOnScroll>
            <SectionHeading eyebrow="FAQ" title="Frequently asked questions" className="mb-10" />
          </RevealOnScroll>
          <div className="space-y-3">
            {PRICING_FAQ.map((faq, i) => {
              const isOpen = openFaq === i;
              return (
                <RevealOnScroll key={i} delay={i * 40}>
                  <div className={`rounded-2xl border overflow-hidden transition-all ${isOpen ? "border-violet-200 bg-white shadow-md" : "border-gray-100 bg-white/70 hover:border-gray-200"}`}>
                    <button onClick={() => setOpenFaq(isOpen ? null : i)} className="w-full flex items-center justify-between gap-4 p-5 text-left" aria-expanded={isOpen}>
                      <span className={`font-semibold text-sm ${isOpen ? "text-violet-700" : "text-gray-800"}`}>{faq.question}</span>
                      <span className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-all ${isOpen ? "bg-violet-600 text-white rotate-45" : "bg-gray-100 text-gray-400"}`}>
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                        </svg>
                      </span>
                    </button>
                    <div className="overflow-hidden transition-all duration-300" style={{ maxHeight: isOpen ? "400px" : "0", opacity: isOpen ? 1 : 0 }}>
                      <div className="px-5 pb-5 text-sm text-gray-600 leading-relaxed">{faq.answer}</div>
                    </div>
                  </div>
                </RevealOnScroll>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section className="relative py-20 overflow-hidden bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 text-center px-4">
        <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-pink-400/20 blur-3xl animate-blob-1" />
        <div className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full bg-violet-400/20 blur-3xl animate-blob-2" />
        <div className="relative mx-auto max-w-2xl">
          <RevealOnScroll from="scale">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Ready to get started?</h2>
            <p className="text-violet-200 mb-8">Start free today. Upgrade anytime. 30-day money-back guarantee on Pro.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <MagneticButton href="/register" strength={12} className="px-8 py-3.5 bg-white text-violet-700 font-bold rounded-xl hover:bg-violet-50 shadow-lg transition-colors">
                Start Free
              </MagneticButton>
              <MagneticButton href="/register?plan=pro" strength={8} className="px-8 py-3.5 bg-white/10 backdrop-blur-sm text-white font-bold rounded-xl border border-white/30 hover:bg-white/20 transition-colors">
                Try Pro — 7 Days Free
              </MagneticButton>
            </div>
          </RevealOnScroll>
        </div>
      </section>
    </div>
  );
}
