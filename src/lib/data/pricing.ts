// ============================================================
// LearnAI — Pricing Data
// ============================================================

export interface PlanFeature {
  text: string;
  included: boolean;
}

export interface Plan {
  id: string;
  name: string;
  price: number | null;
  priceDisplay: string;
  originalPrice?: number;
  period: string;
  annualPrice?: number;
  annualPriceDisplay?: string;
  annualOriginal?: number;
  description: string;
  badge: string | null;
  popular: boolean;
  cta: string;
  href: string;
  color: string;
  features: PlanFeature[];
  useCases?: string[];
}

export const PLANS: Plan[] = [
  {
    id: "free",
    name: "Free",
    price: 0,
    priceDisplay: "₹0",
    period: "forever",
    description: "Start your AI journey with 3 handpicked free courses",
    badge: null,
    popular: false,
    cta: "Get Started Free",
    href: "/register",
    color: "gray",
    features: [
      { text: "3 curated free courses (Prompting, ChatGPT Basics, AI Tools)", included: true },
      { text: "Access to community forum", included: true },
      { text: "Basic quizzes & assessments", included: true },
      { text: "Mobile access", included: true },
      { text: "Course completion badge", included: true },
      { text: "Live webinars & classes", included: false },
      { text: "Completion certificates", included: false },
      { text: "All premium courses (₹999+ each)", included: false },
      { text: "AI Tutor chatbot", included: false },
      { text: "Priority support", included: false },
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: 999,
    priceDisplay: "₹999",
    originalPrice: 1999,
    period: "/month",
    annualPrice: 8999,
    annualPriceDisplay: "₹8,999",
    annualOriginal: 11988,
    description: "Full access to all courses, live classes & certificates",
    badge: "Most Popular",
    popular: true,
    cta: "Start 7-Day Free Trial",
    href: "/register?plan=pro",
    color: "violet",
    features: [
      { text: "Everything in Free", included: true },
      { text: "All 12+ AI courses (unlimited access)", included: true },
      { text: "Live webinars & online classes", included: true },
      { text: "Completion certificates (shareable)", included: true },
      { text: "Timed tests & advanced quizzes", included: true },
      { text: "AI Tutor chatbot (GPT-powered)", included: true },
      { text: "Offline downloads", included: true },
      { text: "Priority support (24h response)", included: true },
      { text: "New courses as they launch", included: true },
      { text: "Progress tracking & analytics", included: true },
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: null,
    priceDisplay: "Custom",
    period: "",
    description: "For companies, colleges, schools & large teams",
    badge: "For Teams",
    popular: false,
    cta: "Contact Sales",
    href: "/contact?type=enterprise",
    color: "indigo",
    features: [
      { text: "Everything in Pro", included: true },
      { text: "Unlimited team members", included: true },
      { text: "Team management dashboard", included: true },
      { text: "Custom learning paths & curricula", included: true },
      { text: "SSO / SAML integration", included: true },
      { text: "Dedicated account manager", included: true },
      { text: "Advanced analytics & reporting", included: true },
      { text: "Custom branding & white-labeling", included: true },
      { text: "Bulk certificate issuance", included: true },
      { text: "API access & integrations", included: true },
    ],
    useCases: ["IT Companies", "Engineering Colleges", "Schools", "Bootcamps", "Corporate Training"],
  },
];

export const TRUST_BADGES = [
  "30-day money-back guarantee",
  "Cancel anytime",
  "Secure payment via Razorpay",
  "GST invoice provided",
];

export const PRICING_FAQ = [
  {
    question: "Do you charge GST on top of the plan price?",
    answer:
      "No — the prices shown are inclusive of 18% GST. You will receive a proper GST invoice that you can use for business expense claims. If you need a specific GST invoice format, please contact support.",
  },
  {
    question: "Which payment methods do you accept?",
    answer:
      "We use Razorpay for all payments. You can pay via UPI (GPay, PhonePe, Paytm), all major credit/debit cards, net banking, and EMI options on select cards. No international card restrictions.",
  },
  {
    question: "Can I get a refund if I'm not satisfied?",
    answer:
      "Yes. We offer a 30-day no-questions-asked money-back guarantee for Pro plan subscriptions. Simply email us at support@learnai.in within 30 days of your purchase and we will process your refund within 5-7 working days.",
  },
  {
    question: "What happens to my access if I cancel my Pro subscription?",
    answer:
      "Your Pro access continues until the end of your billing period. After that, you revert to the Free plan and retain access to only the 3 free courses. Any certificates you've already earned remain valid and downloadable.",
  },
  {
    question: "Can I switch between monthly and annual plans?",
    answer:
      "Yes. You can upgrade from monthly to annual at any time from your account settings. The upgrade is prorated — you'll only pay the difference for the remaining time. Downgrading from annual to monthly takes effect at the next renewal.",
  },
  {
    question: "Is the Enterprise plan suitable for colleges and coaching institutes?",
    answer:
      "Absolutely. Our Enterprise plan is designed for institutions including engineering colleges, MBA institutes, school chains, and coaching centres. We support custom curricula, student progress reporting, branded certificates, and bulk enrollment. Contact our education team at enterprise@learnai.in for a custom quote.",
  },
];

export const COMPARISON_FEATURES = [
  { feature: "Free courses", free: "3 courses", pro: "All 12+", enterprise: "All + Custom" },
  { feature: "Live webinars", free: "✗", pro: "✓ All sessions", enterprise: "✓ + Private sessions" },
  { feature: "Completion certificates", free: "✗", pro: "✓ Shareable PDF", enterprise: "✓ Custom branded" },
  { feature: "Quizzes & tests", free: "Basic only", pro: "Advanced + Timed", enterprise: "Advanced + Timed" },
  { feature: "AI Tutor chatbot", free: "✗", pro: "✓ GPT-powered", enterprise: "✓ GPT-powered" },
  { feature: "Offline downloads", free: "✗", pro: "✓", enterprise: "✓" },
  { feature: "Team management", free: "✗", pro: "✗", enterprise: "✓ Full dashboard" },
  { feature: "Custom learning paths", free: "✗", pro: "✗", enterprise: "✓" },
  { feature: "SSO / SAML", free: "✗", pro: "✗", enterprise: "✓" },
  { feature: "Analytics & reporting", free: "✗", pro: "Personal stats", enterprise: "Team analytics" },
  { feature: "Support", free: "Community forum", pro: "Priority (24h)", enterprise: "Dedicated manager" },
  { feature: "API access", free: "✗", pro: "✗", enterprise: "✓" },
];
