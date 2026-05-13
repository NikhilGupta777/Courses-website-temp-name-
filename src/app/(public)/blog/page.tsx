import type { Metadata } from "next";
import Link from "next/link";
import { BLOG_POSTS, BLOG_CATEGORIES, getFeaturedPosts } from "@/lib/data/blog";
import { NewsletterForm } from "@/components/ui/newsletter-form";

export const metadata: Metadata = {
  title: "Blog — AI Insights, Tutorials & Career Tips | LearnAI",
  description:
    "Stay ahead with the latest AI tutorials, prompting tips, career guides, and tool comparisons from India's top AI educators.",
  openGraph: {
    title: "LearnAI Blog — AI Insights & Tutorials",
    description: "Practical AI guides, prompting tips, and career advice from India's top AI educators.",
  },
};

const CATEGORY_COLORS: Record<string, string> = {
  Prompting: "bg-violet-100 text-violet-700",
  "AI Tools": "bg-indigo-100 text-indigo-700",
  "Image Generation": "bg-pink-100 text-pink-700",
  Career: "bg-green-100 text-green-700",
  LLMs: "bg-slate-100 text-slate-700",
  Tutorials: "bg-orange-100 text-orange-700",
};

export default function BlogPage() {
  const featured = getFeaturedPosts();

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="pt-20 pb-12 bg-gradient-to-br from-violet-50 via-white to-indigo-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-violet-100 text-violet-700 px-3 py-1 rounded-full text-xs font-semibold mb-4">
              ✍️ LearnAI Blog
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight">
              AI Insights,{" "}
              <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                Tutorials & Tips
              </span>
            </h1>
            <p className="mt-4 text-lg text-gray-600">
              Practical guides from India&apos;s top AI educators — covering prompting, tools, career advice and more.
            </p>
          </div>
        </div>
      </section>

      {/* Category pills */}
      <div className="border-b border-gray-100 bg-white sticky top-16 z-30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex gap-2 overflow-x-auto py-3 scrollbar-hide">
            {BLOG_CATEGORIES.map((cat) => (
              <Link
                key={cat}
                href={cat === "All" ? "/blog" : `/blog?category=${cat}`}
                className="flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium bg-gray-100 text-gray-600 hover:bg-violet-100 hover:text-violet-700 transition-colors"
              >
                {cat}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Featured posts */}
        {featured.length > 0 && (
          <section className="mb-16">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-violet-600 rounded-full" />
              Featured
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {featured.map((post) => (
                <Link key={post.slug} href={`/blog/${post.slug}`} className="group">
                  <article className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:border-violet-200 transition-all duration-300 h-full flex flex-col">
                    {/* Cover gradient */}
                    <div className={`h-48 bg-gradient-to-br ${post.coverColor} flex items-end p-6`}>
                      <span
                        className={`text-xs font-semibold px-2.5 py-1 rounded-full bg-white/20 text-white backdrop-blur-sm`}
                      >
                        {post.category}
                      </span>
                    </div>
                    <div className="p-6 flex flex-col flex-1">
                      <h3 className="text-lg font-bold text-gray-900 group-hover:text-violet-600 transition-colors line-clamp-2 mb-2">
                        {post.title}
                      </h3>
                      <p className="text-sm text-gray-500 line-clamp-2 flex-1">{post.excerpt}</p>
                      <div className="mt-4 flex items-center gap-3">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-400 to-indigo-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                          {post.author.avatar}
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-semibold text-gray-800 truncate">{post.author.name}</div>
                          <div className="text-xs text-gray-400">{post.publishedAt} · {post.readingTime}</div>
                        </div>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* All posts grid */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <span className="w-1.5 h-6 bg-indigo-500 rounded-full" />
            All Articles
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {BLOG_POSTS.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="group">
                <article className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg hover:border-violet-200 transition-all duration-200 h-full flex flex-col">
                  <div className={`h-32 bg-gradient-to-br ${post.coverColor}`} />
                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${CATEGORY_COLORS[post.category] ?? "bg-gray-100 text-gray-600"}`}>
                        {post.category}
                      </span>
                      <span className="text-xs text-gray-400">{post.readingTime}</span>
                    </div>
                    <h3 className="text-sm font-bold text-gray-900 group-hover:text-violet-600 transition-colors line-clamp-2 flex-1">
                      {post.title}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1.5 line-clamp-2">{post.excerpt}</p>
                    <div className="mt-4 flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-violet-400 to-indigo-500 flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">
                        {post.author.avatar}
                      </div>
                      <span className="text-xs text-gray-500 truncate">{post.author.name} · {post.publishedAt}</span>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </section>

        {/* Newsletter CTA */}
        <section className="mt-16 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-3xl p-8 md:p-12 text-center text-white">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">Never Miss an Article</h2>
          <p className="text-violet-200 mb-6 max-w-lg mx-auto">
            Get the latest AI tutorials, tool comparisons, and career tips delivered to your inbox every week.
          </p>
          <NewsletterForm />
          <p className="text-violet-300 text-xs mt-3">No spam. Unsubscribe anytime.</p>
        </section>
      </div>
    </div>
  );
}
