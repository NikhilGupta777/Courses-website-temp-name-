import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy | LearnAI",
  description: "How LearnAI collects, uses, and protects your personal information.",
};

const LAST_UPDATED = "May 1, 2026";

const sections = [
  {
    title: "1. Information We Collect",
    content: `We collect information you provide directly:
• Account information: name, email address, password (hashed)
• Profile information: bio, headline, social links, profile photo
• Payment information: processed by Razorpay — we never store your full card details
• Course progress, quiz results, and certificates earned
• Communications you send us (support tickets, contact forms)

We collect information automatically:
• Log data: IP address, browser type, pages visited, timestamps
• Device information: device type, operating system
• Cookies and similar tracking technologies (see Cookie section)`,
  },
  {
    title: "2. How We Use Your Information",
    content: `We use the information we collect to:
• Provide, maintain, and improve the Platform
• Process payments and send receipts and invoices
• Send course completion certificates and notifications
• Respond to your support requests
• Send important service announcements (non-optional)
• Send marketing emails with your consent (you can opt out anytime)
• Analyse usage patterns to improve the learning experience
• Detect and prevent fraud, abuse, and security incidents`,
  },
  {
    title: "3. Information Sharing",
    content: `We do not sell your personal data to third parties. We share information only:

• With service providers: Razorpay (payments), Resend (email), Vercel (hosting), Neon (database), Mux (video)
• With instructors: limited profile information (name, progress on their courses) when you enrol
• With your consent: when you explicitly authorise us to share your information
• For legal compliance: when required by law or to protect the safety of our users
• In a merger or acquisition: in which case we will notify users before data is transferred`,
  },
  {
    title: "4. Data Retention",
    content: `We retain your data as follows:
• Account data: until you delete your account
• Payment records: 7 years (as required by Indian tax law)
• Course progress and certificates: indefinitely (your certificates must remain verifiable)
• Quiz attempts: 2 years
• Support communications: 3 years
• Marketing consent records: until consent is withdrawn

When you delete your account, we remove your personal data within 30 days, except where retention is legally required.`,
  },
  {
    title: "5. Cookies",
    content: `We use the following cookies:
• Essential cookies: session management, security (cannot be disabled)
• Analytics cookies: understanding how users navigate the Platform (you can opt out)
• Preference cookies: remembering your settings (e.g. video quality, dark mode)

You can manage cookies in your browser settings. Disabling essential cookies will affect Platform functionality.`,
  },
  {
    title: "6. Your Rights",
    content: `Under applicable privacy law, you have the right to:
• Access the personal data we hold about you
• Correct inaccurate or incomplete data
• Delete your account and associated personal data
• Export your data in a machine-readable format
• Withdraw consent for marketing communications at any time
• Lodge a complaint with the relevant data protection authority

To exercise any of these rights, email privacy@learnai.in with your request.`,
  },
  {
    title: "7. Security",
    content: `We implement industry-standard security measures including:
• All data encrypted in transit (TLS 1.3)
• Passwords hashed with bcrypt (cost factor 12)
• Database encrypted at rest
• Webhook signatures verified for all payment events
• Regular security audits

No method of transmission over the internet is 100% secure. We encourage you to use a strong, unique password.`,
  },
  {
    title: "8. Children's Privacy",
    content: `LearnAI is not directed to children under 13. We do not knowingly collect personal information from children under 13. If you believe a child has provided us information, contact us immediately at privacy@learnai.in.`,
  },
  {
    title: "9. Changes to This Policy",
    content: `We may update this Privacy Policy periodically. We will notify you of material changes via email. Continued use of the Platform after changes constitutes acceptance of the updated policy.`,
  },
  {
    title: "10. Contact",
    content: `For privacy-related questions or to exercise your rights:
• Email: privacy@learnai.in
• Post: LearnAI, 123 Koramangala 5th Block, Bangalore, Karnataka 560095, India`,
  },
];

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <section className="pt-20 pb-10 bg-gradient-to-br from-gray-50 to-white border-b border-gray-100">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <Link href="/" className="hover:text-violet-600 transition-colors">Home</Link>
            <span>/</span>
            <span>Privacy Policy</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Privacy Policy</h1>
          <p className="mt-2 text-gray-500 text-sm">Last updated: {LAST_UPDATED}</p>
          <div className="mt-4 p-4 bg-green-50 border border-green-100 rounded-xl text-sm text-green-700">
            We take your privacy seriously. This policy explains exactly what data we collect and how we use it.
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Contents</div>
              <nav className="space-y-1">
                {sections.map((s) => (
                  <a key={s.title} href={`#${s.title.replace(/\s+/g, "-").toLowerCase()}`}
                    className="block text-xs text-gray-500 hover:text-violet-600 py-1 transition-colors line-clamp-1">
                    {s.title}
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          <div className="lg:col-span-3 space-y-10">
            {sections.map((section) => (
              <section key={section.title} id={section.title.replace(/\s+/g, "-").toLowerCase()}>
                <h2 className="text-xl font-bold text-gray-900 mb-4 scroll-mt-24">{section.title}</h2>
                <div className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{section.content}</div>
              </section>
            ))}
            <div className="border-t border-gray-100 pt-8 flex flex-wrap gap-4 text-sm">
              <Link href="/terms" className="text-violet-600 hover:underline">Terms of Service →</Link>
              <Link href="/contact" className="text-violet-600 hover:underline">Contact Us →</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
