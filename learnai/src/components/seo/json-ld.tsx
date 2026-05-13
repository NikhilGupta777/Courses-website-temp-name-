// JSON-LD Structured Data components for SEO
// Drop these into any page's JSX — Next.js renders them as <script> tags

// ─── Organisation ─────────────────────────────────────────────────────────────
export function OrganisationJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "LearnAI",
    url: "https://learnai.in",
    logo: "https://learnai.in/icons/icon-512x512.png",
    description: "India's best AI courses platform — ChatGPT, Gemini, Image Generation, Prompting.",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Bangalore",
      addressRegion: "Karnataka",
      addressCountry: "IN",
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Customer Support",
      email: "support@learnai.in",
      availableLanguage: ["en", "hi"],
    },
    sameAs: [
      "https://twitter.com/learnai_india",
      "https://linkedin.com/company/learnai-india",
      "https://github.com/learnai-india",
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

// ─── Website Search Box ───────────────────────────────────────────────────────
export function WebSiteJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    url: "https://learnai.in",
    name: "LearnAI",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://learnai.in/courses?search={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

// ─── Course Structured Data ────────────────────────────────────────────────────
interface CourseJsonLdProps {
  title: string;
  description: string;
  url: string;
  instructor: { name: string };
  price: number;
  isFree: boolean;
  rating?: number;
  reviewCount?: number;
  level: string;
}

export function CourseJsonLd({
  title, description, url, instructor, price, isFree, rating, reviewCount, level,
}: CourseJsonLdProps) {
  const data = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: title,
    description,
    url,
    provider: {
      "@type": "Organization",
      name: "LearnAI",
      url: "https://learnai.in",
    },
    instructor: {
      "@type": "Person",
      name: instructor.name,
    },
    courseLevel: level,
    inLanguage: "en-IN",
    ...(rating && reviewCount
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: rating.toString(),
            reviewCount: reviewCount.toString(),
            bestRating: "5",
            worstRating: "1",
          },
        }
      : {}),
    offers: {
      "@type": "Offer",
      price: isFree ? "0" : price.toString(),
      priceCurrency: "INR",
      availability: "https://schema.org/InStock",
      url,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

// ─── FAQ Schema ────────────────────────────────────────────────────────────────
interface FAQJsonLdProps {
  items: { question: string; answer: string }[];
}

export function FAQJsonLd({ items }: FAQJsonLdProps) {
  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

// ─── BreadcrumbList ───────────────────────────────────────────────────────────
interface BreadcrumbJsonLdProps {
  items: { name: string; url: string }[];
}

export function BreadcrumbJsonLd({ items }: BreadcrumbJsonLdProps) {
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

// ─── BlogPosting ───────────────────────────────────────────────────────────────
interface BlogPostingJsonLdProps {
  title: string;
  description: string;
  url: string;
  author: { name: string };
  publishedAt: string;
  imageUrl?: string;
}

export function BlogPostingJsonLd({ title, description, url, author, publishedAt, imageUrl }: BlogPostingJsonLdProps) {
  const data = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description,
    url,
    author: { "@type": "Person", name: author.name },
    datePublished: publishedAt,
    publisher: { "@type": "Organization", name: "LearnAI", url: "https://learnai.in" },
    ...(imageUrl ? { image: imageUrl } : {}),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
