import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service | LearnAI",
  description: "LearnAI Terms of Service — your rights and responsibilities as a learner on our platform.",
};

const LAST_UPDATED = "May 1, 2026";

const sections = [
  {
    title: "1. Acceptance of Terms",
    content: `By accessing or using LearnAI ("Platform", "we", "us", or "our"), you agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree, please do not use the Platform.

These Terms apply to all visitors, students, instructors, and other users who access or use the Platform.`,
  },
  {
    title: "2. Use of the Platform",
    content: `You agree to use LearnAI only for lawful purposes and in accordance with these Terms. You must not:
• Use the Platform in any way that violates applicable local, national, or international law
• Transmit unsolicited advertising, promotional material, or spam
• Impersonate any person or misrepresent your identity or affiliation
• Attempt to gain unauthorised access to any part of the Platform
• Scrape, copy, or redistribute course content without permission`,
  },
  {
    title: "3. Account Registration",
    content: `To access certain features, you must register for an account. You are responsible for:
• Maintaining the confidentiality of your password
• All activities that occur under your account
• Notifying us immediately of any unauthorised account use

You must be at least 13 years old to register. By registering, you confirm you meet this requirement.`,
  },
  {
    title: "4. Courses and Content",
    content: `All course content on LearnAI is protected by copyright. When you purchase or access a course, you receive a limited, non-exclusive, non-transferable licence to access and view the content for personal, non-commercial purposes.

You may not:
• Download, copy, or redistribute course content
• Share your account or login credentials with others
• Resell or sublicence access to course content
• Record live sessions without instructor permission`,
  },
  {
    title: "5. Payments and Subscriptions",
    content: `Course purchases and subscription fees are processed securely through Razorpay. All prices are in Indian Rupees (₹) and are inclusive of applicable GST.

Subscriptions renew automatically at the end of each billing period. You may cancel at any time from your Account → Billing page, and cancellation takes effect at the end of the current billing period.

We offer a 30-day money-back guarantee on Pro plan subscriptions. To request a refund, email support@learnai.in within 30 days of purchase.`,
  },
  {
    title: "6. Instructor Terms",
    content: `If you create and publish courses on LearnAI as an instructor, you agree to:
• Own or have the rights to all content you upload
• Not infringe any third-party intellectual property
• Maintain a minimum 3.5-star rating to remain published
• Receive 70% revenue share on all course sales, paid monthly

LearnAI reserves the right to remove courses that violate our content standards, misrepresent their content, or receive sustained negative reviews.`,
  },
  {
    title: "7. Certificates",
    content: `Completion certificates are issued when you finish 100% of a course and achieve a minimum passing score on assessments. Certificates issued by LearnAI represent completion of our courses and are not equivalent to degrees or professional licences from accredited institutions.

Certificates remain valid indefinitely and have a permanent verification URL.`,
  },
  {
    title: "8. Limitation of Liability",
    content: `To the maximum extent permitted by law, LearnAI and its directors, employees, partners, and agents shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the Platform.

Our total liability for any claim shall not exceed the amount you paid to us in the 12 months preceding the claim.`,
  },
  {
    title: "9. Privacy",
    content: `Your use of the Platform is governed by our Privacy Policy, which is incorporated into these Terms by reference. Please review our Privacy Policy to understand our practices.`,
  },
  {
    title: "10. Changes to Terms",
    content: `We may update these Terms from time to time. We will notify you of material changes via email or a prominent notice on the Platform. Continued use after changes constitutes acceptance of the updated Terms.`,
  },
  {
    title: "11. Governing Law",
    content: `These Terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts of Bangalore, Karnataka, India.`,
  },
  {
    title: "12. Contact",
    content: `For any questions about these Terms, please contact us at legal@learnai.in or write to:

LearnAI
123 Koramangala 5th Block
Bangalore, Karnataka 560095
India`,
  },
];

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="pt-20 pb-10 bg-gradient-to-br from-gray-50 to-white border-b border-gray-100">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <Link href="/" className="hover:text-violet-600 transition-colors">Home</Link>
            <span>/</span>
            <span>Terms of Service</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Terms of Service</h1>
          <p className="mt-2 text-gray-500 text-sm">Last updated: {LAST_UPDATED}</p>
          <div className="mt-4 p-4 bg-violet-50 border border-violet-100 rounded-xl text-sm text-violet-700">
            Please read these terms carefully before using the LearnAI platform.
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          {/* Table of contents */}
          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Contents</div>
              <nav className="space-y-1">
                {sections.map((s) => (
                  <a
                    key={s.title}
                    href={`#${s.title.replace(/\s+/g, "-").toLowerCase()}`}
                    className="block text-xs text-gray-500 hover:text-violet-600 py-1 transition-colors line-clamp-1"
                  >
                    {s.title}
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          {/* Sections */}
          <div className="lg:col-span-3 space-y-10">
            {sections.map((section) => (
              <section
                key={section.title}
                id={section.title.replace(/\s+/g, "-").toLowerCase()}
              >
                <h2 className="text-xl font-bold text-gray-900 mb-4 scroll-mt-24">{section.title}</h2>
                <div className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                  {section.content}
                </div>
              </section>
            ))}

            <div className="border-t border-gray-100 pt-8 flex flex-wrap gap-4 text-sm">
              <Link href="/privacy" className="text-violet-600 hover:underline">Privacy Policy →</Link>
              <Link href="/contact" className="text-violet-600 hover:underline">Contact Us →</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
