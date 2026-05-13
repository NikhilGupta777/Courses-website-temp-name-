import Link from "next/link";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for exploring AI fundamentals",
    features: [
      { text: "Access to 10 free courses", included: true },
      { text: "Community forum access", included: true },
      { text: "Basic quizzes", included: true },
      { text: "Mobile access", included: true },
      { text: "Live classes", included: false },
      { text: "Certificates", included: false },
      { text: "AI Tutor", included: false },
      { text: "Priority support", included: false },
    ],
    cta: "Get Started",
    href: "/register",
    popular: false,
  },
  {
    name: "Pro Monthly",
    price: "$29",
    period: "/month",
    description: "Full access for serious learners",
    features: [
      { text: "All 200+ courses", included: true },
      { text: "Community forum access", included: true },
      { text: "Unlimited quizzes & timed tests", included: true },
      { text: "Mobile access + offline downloads", included: true },
      { text: "Live class access (unlimited)", included: true },
      { text: "Completion certificates", included: true },
      { text: "AI Tutor chatbot", included: true },
      { text: "Priority support", included: true },
    ],
    cta: "Start 7-Day Free Trial",
    href: "/register?plan=pro_monthly",
    popular: true,
  },
  {
    name: "Pro Annual",
    price: "$249",
    period: "/year",
    description: "Best value - save $99/year",
    features: [
      { text: "Everything in Pro Monthly", included: true },
      { text: "2 months free (save $99)", included: true },
      { text: "Early access to new courses", included: true },
      { text: "Exclusive webinars & workshops", included: true },
      { text: "1-on-1 mentor session (monthly)", included: true },
      { text: "Career guidance resources", included: true },
      { text: "Custom learning path", included: true },
      { text: "LinkedIn profile review", included: true },
    ],
    cta: "Start 7-Day Free Trial",
    href: "/register?plan=pro_annual",
    popular: false,
    badge: "Best Value",
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "For teams and organizations",
    features: [
      { text: "Everything in Pro Annual", included: true },
      { text: "Team management dashboard", included: true },
      { text: "Custom learning paths", included: true },
      { text: "SSO/SAML integration", included: true },
      { text: "Dedicated account manager", included: true },
      { text: "Advanced analytics & reporting", included: true },
      { text: "API access", included: true },
      { text: "Custom branding", included: true },
    ],
    cta: "Contact Sales",
    href: "/contact",
    popular: false,
  },
];

const faqs = [
  {
    question: "Can I switch plans anytime?",
    answer: "Yes! You can upgrade or downgrade your plan at any time. If you upgrade, you'll be charged the prorated difference. If you downgrade, you'll receive credit towards your next billing cycle.",
  },
  {
    question: "Is there a free trial?",
    answer: "Yes, Pro plans come with a 7-day free trial. You won't be charged until the trial ends, and you can cancel anytime during the trial period.",
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards (Visa, Mastercard, American Express), PayPal, and bank transfers for Enterprise plans.",
  },
  {
    question: "Can I get a refund?",
    answer: "We offer a 30-day money-back guarantee. If you're not satisfied with your purchase, contact us within 30 days for a full refund.",
  },
  {
    question: "Do certificates expire?",
    answer: "No! Once you earn a certificate, it's yours forever. Certificates include a unique verification URL that never expires.",
  },
  {
    question: "How do team plans work?",
    answer: "Enterprise plans allow you to manage multiple team members under one account. You can assign courses, track progress, and view team analytics from a central dashboard.",
  },
];

export default function PricingPage() {
  return (
    <div>
      {/* Header */}
      <section className="pt-20 pb-12 bg-gradient-to-b from-violet-50 to-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900">
            Invest in Your{" "}
            <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
              AI Future
            </span>
          </h1>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Choose the plan that matches your ambition. All plans include access to our world-class content and community.
          </p>
        </div>
      </section>

      {/* Plans Grid */}
      <section className="pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-2xl p-6 flex flex-col ${
                  plan.popular
                    ? "bg-gradient-to-b from-violet-600 to-indigo-700 text-white shadow-2xl shadow-violet-500/25 ring-2 ring-violet-500"
                    : "bg-white border border-gray-200 shadow-sm"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-green-400 text-green-900 text-xs font-bold px-3 py-1 rounded-full">
                      {plan.badge}
                    </span>
                  </div>
                )}

                <div className="text-center mb-6">
                  <h3 className={`text-lg font-semibold ${plan.popular ? "text-white" : "text-gray-900"}`}>
                    {plan.name}
                  </h3>
                  <div className="mt-3">
                    <span className={`text-4xl font-bold ${plan.popular ? "text-white" : "text-gray-900"}`}>
                      {plan.price}
                    </span>
                    <span className={`text-sm ${plan.popular ? "text-violet-200" : "text-gray-500"}`}>
                      {plan.period}
                    </span>
                  </div>
                  <p className={`mt-2 text-sm ${plan.popular ? "text-violet-200" : "text-gray-500"}`}>
                    {plan.description}
                  </p>
                </div>

                <ul className="space-y-3 flex-grow">
                  {plan.features.map((feature) => (
                    <li key={feature.text} className="flex items-start gap-2">
                      {feature.included ? (
                        <svg className={`w-4 h-4 mt-0.5 flex-shrink-0 ${plan.popular ? "text-violet-200" : "text-violet-500"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4 mt-0.5 flex-shrink-0 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      )}
                      <span className={`text-sm ${
                        feature.included
                          ? plan.popular ? "text-violet-100" : "text-gray-600"
                          : "text-gray-400"
                      }`}>
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={plan.href}
                  className={`mt-6 w-full py-3 px-4 rounded-xl text-sm font-semibold text-center block transition-all ${
                    plan.popular
                      ? "bg-white text-violet-700 hover:bg-violet-50 shadow-lg"
                      : "bg-violet-600 text-white hover:bg-violet-700 shadow-md"
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-gray-50">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {faqs.map((faq) => (
              <div key={faq.question} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="font-semibold text-gray-900">{faq.question}</h3>
                <p className="mt-2 text-sm text-gray-600 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
