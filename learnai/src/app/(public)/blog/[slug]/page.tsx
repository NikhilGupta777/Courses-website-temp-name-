import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPostBySlug, BLOG_POSTS } from "@/lib/data/blog";

interface Props { params: { slug: string } }

export async function generateStaticParams() {
  return BLOG_POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = getPostBySlug(params.slug);
  if (!post) return {};
  return {
    title: `${post.title} | LearnAI Blog`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.publishedAt,
      authors: [post.author.name],
    },
  };
}

export default function BlogPostPage({ params }: Props) {
  const post = getPostBySlug(params.slug);
  if (!post) notFound();

  const related = BLOG_POSTS.filter((p) => p.slug !== post.slug && p.category === post.category).slice(0, 3);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className={`pt-24 pb-16 bg-gradient-to-br ${post.coverColor} relative overflow-hidden`}>
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-sm text-white/70 mb-6">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-white transition-colors">Blog</Link>
            <span>/</span>
            <span className="text-white truncate max-w-xs">{post.title}</span>
          </nav>
          <div className="inline-flex items-center gap-2 bg-white/20 text-white px-3 py-1 rounded-full text-xs font-semibold mb-4 backdrop-blur-sm">
            {post.category}
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-4">
            {post.title}
          </h1>
          <p className="text-lg text-white/80 mb-6 max-w-2xl">{post.subtitle}</p>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-sm backdrop-blur-sm">
              {post.author.avatar}
            </div>
            <div>
              <div className="text-sm font-semibold text-white">{post.author.name}</div>
              <div className="text-xs text-white/70">{post.author.role} · {post.publishedAt} · {post.readingTime}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Article body */}
          <article className="lg:col-span-3">
            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-8">
              {post.tags.map((tag) => (
                <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
                  {tag}
                </span>
              ))}
            </div>

            {/* Prose content — rendered from markdown-like string */}
            <div className="prose prose-lg max-w-none prose-headings:font-bold prose-headings:text-gray-900 prose-p:text-gray-600 prose-p:leading-relaxed prose-a:text-violet-600 prose-a:no-underline hover:prose-a:underline prose-code:bg-gray-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-pre:bg-gray-900 prose-pre:rounded-2xl prose-blockquote:border-violet-500 prose-blockquote:bg-violet-50 prose-blockquote:not-italic">
              {post.content.split("\n").map((line, i) => {
                if (line.startsWith("## ")) {
                  return <h2 key={i} className="text-2xl font-bold text-gray-900 mt-10 mb-4">{line.slice(3)}</h2>;
                }
                if (line.startsWith("### ")) {
                  return <h3 key={i} className="text-xl font-bold text-gray-900 mt-8 mb-3">{line.slice(4)}</h3>;
                }
                if (line.startsWith("**") && line.endsWith("**")) {
                  return <p key={i} className="font-bold text-gray-900 my-2">{line.slice(2, -2)}</p>;
                }
                if (line.startsWith("- ")) {
                  return <li key={i} className="text-gray-600 ml-4 my-1 list-disc">{line.slice(2)}</li>;
                }
                if (line.startsWith("| ")) {
                  return null; // Table rows handled below
                }
                if (line.startsWith("```")) {
                  return null; // Code blocks handled below
                }
                if (line === "---") {
                  return <hr key={i} className="my-8 border-gray-200" />;
                }
                if (line.trim() === "") {
                  return <div key={i} className="my-3" />;
                }
                // Handle inline links [text](/href)
                const withLinks = line.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, text, href) =>
                  `<a href="${href}" class="text-violet-600 hover:underline">${text}</a>`
                );
                // Handle inline bold **text**
                const withBold = withLinks.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");

                return <p key={i} className="text-gray-600 leading-relaxed my-2" dangerouslySetInnerHTML={{ __html: withBold }} />;
              })}
            </div>

            {/* CTA */}
            <div className="mt-12 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-2xl p-8 text-white text-center">
              <div className="text-2xl mb-2">🎓</div>
              <h3 className="text-xl font-bold mb-2">Ready to Go Deeper?</h3>
              <p className="text-violet-200 mb-5 text-sm">
                We have free and premium courses that cover everything in this article — with hands-on projects and certificates.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/courses" className="px-6 py-3 bg-white text-violet-700 font-semibold rounded-xl hover:bg-violet-50 transition-colors text-sm">
                  Browse Courses
                </Link>
                <Link href="/register" className="px-6 py-3 bg-white/10 text-white font-semibold rounded-xl border border-white/30 hover:bg-white/20 transition-colors text-sm">
                  Start Free
                </Link>
              </div>
            </div>

            {/* Author card */}
            <div className="mt-10 flex items-start gap-4 p-6 bg-gray-50 rounded-2xl border border-gray-100">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                {post.author.avatar}
              </div>
              <div>
                <div className="font-bold text-gray-900">{post.author.name}</div>
                <div className="text-sm text-violet-600 mb-2">{post.author.role}</div>
                <p className="text-sm text-gray-600">
                  Expert AI educator and instructor at LearnAI. Passionate about making AI accessible to every Indian learner.
                </p>
              </div>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="lg:col-span-1 space-y-6">
            {/* Reading progress indicator */}
            <div className="sticky top-24">
              <div className="bg-violet-50 rounded-2xl p-5 border border-violet-100 mb-4">
                <div className="text-xs font-semibold text-violet-600 uppercase tracking-wide mb-3">Share</div>
                <div className="flex gap-2">
                  {[
                    { label: "Twitter", bg: "bg-sky-500", href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(`https://learnai.in/blog/${post.slug}`)}` },
                    { label: "LinkedIn", bg: "bg-blue-700", href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`https://learnai.in/blog/${post.slug}`)}` },
                  ].map((s) => (
                    <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                      className={`flex-1 py-2 ${s.bg} text-white text-xs font-semibold rounded-lg text-center hover:opacity-90 transition-opacity`}>
                      {s.label}
                    </a>
                  ))}
                </div>
              </div>

              {/* Related posts */}
              {related.length > 0 && (
                <div>
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Related Articles</div>
                  <div className="space-y-3">
                    {related.map((rel) => (
                      <Link key={rel.slug} href={`/blog/${rel.slug}`} className="block group">
                        <div className="flex gap-3 items-start">
                          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${rel.coverColor} flex-shrink-0`} />
                          <div className="min-w-0">
                            <div className="text-xs font-semibold text-gray-900 group-hover:text-violet-600 transition-colors line-clamp-2">{rel.title}</div>
                            <div className="text-[10px] text-gray-400 mt-0.5">{rel.readingTime}</div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
