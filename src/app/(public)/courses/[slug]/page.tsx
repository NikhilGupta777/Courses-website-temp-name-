import Link from "next/link";
import { notFound } from "next/navigation";
import { trpcClient } from "@/lib/trpc/client";
import { CATEGORY_COLORS } from "@/lib/data/courses";
import { CourseJsonLd, BreadcrumbJsonLd } from "@/components/seo/json-ld";
import { ReviewForm } from "@/components/course/ReviewForm";

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1,2,3,4,5].map((i) => (
        <svg key={i} className={`w-4 h-4 ${i <= Math.round(rating) ? "text-yellow-400" : "text-gray-200"} fill-current`} viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  try {
    const course = await trpcClient.course.getBySlug.query({ slug });
    if (!course) return {};
    return {
      title: `${course.title} | LearnAI`,
      description: course.subtitle ?? course.description.slice(0, 155),
      openGraph: {
        title: course.title,
        description: course.subtitle ?? course.description.slice(0, 155),
        type: "website",
        url: `https://learnai.in/courses/${course.slug}`,
      },
    };
  } catch { return {}; }
}

export default async function CourseDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  let course: Awaited<ReturnType<typeof trpcClient.course.getBySlug.query>> = null;
  try {
    course = await trpcClient.course.getBySlug.query({ slug });
  } catch { course = null; }
  if (!course) notFound();

  let reviews: Awaited<ReturnType<typeof trpcClient.review.getByCourse.query>> = { reviews: [], total: 0, pages: 1, averageRating: 0, distribution: {} };
  try {
    reviews = await trpcClient.review.getByCourse.query({ courseId: course.id });
  } catch { /* use defaults */ }

  const catSlug = course.category?.slug ?? "prompting";
  const colors = CATEGORY_COLORS[catSlug] ?? { from: "from-violet-100", to: "to-indigo-200", icon: "text-violet-600" };
  const discount = (course.originalPrice ?? 0) > (course.price ?? 0) && (course.originalPrice ?? 0) > 0
    ? Math.round((1 - (course.price ?? 0) / (course.originalPrice ?? 1)) * 100)
    : 0;
  const instructorName = course.instructor.displayName ?? course.instructor.user?.name ?? "Instructor";

  return (
    <div className="min-h-screen bg-white">
      <CourseJsonLd
        title={course.title}
        description={course.description}
        url={`https://learnai.in/courses/${course.slug}`}
        instructor={{ name: instructorName, title: "", bio: course.instructor.bio }}
        price={course.price ?? 0}
        isFree={course.isFree}
        rating={course.averageRating}
        reviewCount={course.totalReviews}
        level={course.level}
      />
      <BreadcrumbJsonLd items={[
        { name: "Home", url: "https://learnai.in" },
        { name: "Courses", url: "https://learnai.in/courses" },
        { name: course.title, url: `https://learnai.in/courses/${course.slug}` },
      ]} />

      {/* Hero */}
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <nav className="flex items-center gap-2 text-sm text-gray-400 mb-6">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link href="/courses" className="hover:text-white transition-colors">Courses</Link>
            <span>/</span>
            <span className="text-gray-300 truncate max-w-xs">{course.title}</span>
          </nav>
          <div className="lg:grid lg:grid-cols-3 lg:gap-12">
            <div className="lg:col-span-2">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className="text-xs font-medium bg-white/10 text-gray-300 px-3 py-1 rounded-full">{course.category?.name?.toUpperCase() ?? "AI"}</span>
                <span className="text-xs font-medium bg-white/10 text-gray-300 px-3 py-1 rounded-full">{course.level}</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white leading-tight">{course.title}</h1>
              {course.subtitle && <p className="mt-3 text-lg text-gray-300">{course.subtitle}</p>}
              <div className="mt-5 flex flex-wrap items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <StarRating rating={course.averageRating} />
                  <span className="font-semibold text-yellow-400">{course.averageRating.toFixed(1)}</span>
                  <span className="text-gray-400">({course.totalReviews.toLocaleString()} reviews)</span>
                </div>
                <span className="text-gray-400">{course.totalStudents.toLocaleString()} students</span>
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-gray-400">
                <span>By <span className="text-violet-300 font-medium">{instructorName}</span></span>
                <span>·</span>
                <span>{course.deliveryMode === "HYBRID" ? "🎥 Live + Pre-recorded" : "📹 Pre-recorded"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="lg:grid lg:grid-cols-3 lg:gap-10">
          <div className="lg:col-span-2 space-y-10">
            {/* Learning outcomes */}
            {course.learningOutcomes.length > 0 && (
              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-5">What you&apos;ll learn</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-6 bg-amber-50 border border-amber-100 rounded-2xl">
                  {course.learningOutcomes.map((outcome, i) => (
                    <div key={i} className="flex items-start gap-2.5">
                      <svg className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-sm text-gray-700">{outcome}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Description */}
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">About this course</h2>
              <p className="text-gray-600 leading-relaxed">{course.description}</p>
              {course.prerequisites.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">Prerequisites</h3>
                  <ul className="space-y-1.5">
                    {course.prerequisites.map((p, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                        <span className="w-1.5 h-1.5 rounded-full bg-violet-400 flex-shrink-0" />{p}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </section>

            {/* Curriculum */}
            {course.modules.length > 0 && (
              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-5">Course Curriculum</h2>
                <div className="space-y-3">
                  {course.modules.map((mod, mi) => (
                    <details key={mod.id} open={mi === 0} className="group border border-gray-200 rounded-xl overflow-hidden">
                      <summary className="flex items-center justify-between p-4 cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors list-none">
                        <div className="flex items-center gap-3">
                          <span className="w-7 h-7 rounded-lg bg-violet-100 text-violet-700 text-xs font-bold flex items-center justify-center">{mi + 1}</span>
                          <span className="font-semibold text-gray-900 text-sm">{mod.title}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-gray-500 hidden sm:block">{mod.lessons.length} lessons</span>
                          <svg className="w-4 h-4 text-gray-400 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </summary>
                      <ul className="divide-y divide-gray-100">
                        {mod.lessons.map((lesson) => (
                          <li key={lesson.id} className="flex items-center justify-between px-4 py-3">
                            <div className="flex items-center gap-3">
                              {lesson.type === "VIDEO" ? (
                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                              ) : lesson.type === "QUIZ" ? (
                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                              ) : (
                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                              )}
                              <span className="text-sm text-gray-700">{lesson.title}</span>
                              {lesson.isFree && <span className="text-xs text-green-600 font-medium bg-green-50 px-1.5 py-0.5 rounded">Preview</span>}
                            </div>
                            {lesson.duration && <span className="text-xs text-gray-400">{lesson.duration}m</span>}
                          </li>
                        ))}
                      </ul>
                    </details>
                  ))}
                </div>
              </section>
            )}

            {/* Instructor */}
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-5">Your Instructor</h2>
              <div className="flex items-start gap-5 p-6 bg-gray-50 rounded-2xl border border-gray-100">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-400 to-indigo-500 flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
                  {instructorName.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{instructorName}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed mt-1">{course.instructor.bio}</p>
                </div>
              </div>
            </section>

            {/* Reviews */}
            <section>
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-xl font-bold text-gray-900">Student Reviews</h2>
                <div className="flex items-center gap-2">
                  <StarRating rating={reviews.averageRating} />
                  <span className="font-bold text-gray-900">{reviews.averageRating.toFixed(1)}</span>
                  <span className="text-gray-400 text-sm">({reviews.total.toLocaleString()})</span>
                </div>
              </div>
              <div className="mb-6">
                <ReviewForm courseId={course.id} />
              </div>
              {reviews.reviews.length === 0 ? (
                <p className="text-gray-500 text-sm">No reviews yet. Be the first to review this course!</p>
              ) : (
                <div className="space-y-5">
                  {reviews.reviews.map((review) => (
                    <div key={review.id} className="border-b border-gray-100 pb-5 last:border-0">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-300 to-indigo-400 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                          {review.user.name?.charAt(0) ?? "?"}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-sm text-gray-900">{review.user.name}</span>
                          </div>
                          <div className="flex items-center gap-2 mb-2">
                            <StarRating rating={review.rating} />
                            <span className="text-xs text-gray-400">{new Date(review.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                          </div>
                          {review.comment && <p className="text-sm text-gray-600 leading-relaxed">{review.comment}</p>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>

          {/* Sticky enrollment card */}
          <div className="mt-10 lg:mt-0">
            <div className="sticky top-20">
              <div className="rounded-2xl border border-gray-200 shadow-xl overflow-hidden">
                <div className={`h-48 bg-gradient-to-br ${colors.from} ${colors.to} flex items-center justify-center`}>
                  <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                    <svg className={`w-7 h-7 ${colors.icon} ml-1`} fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    {course.isFree ? (
                      <div className="text-3xl font-bold text-green-600">Free</div>
                    ) : (
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-gray-900">₹{(course.price ?? 0).toLocaleString("en-IN")}</span>
                        {discount > 0 && (
                          <>
                            <span className="text-lg text-gray-400 line-through">₹{(course.originalPrice ?? 0).toLocaleString("en-IN")}</span>
                            <span className="text-sm font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded">{discount}% OFF</span>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                  {course.isFree ? (
                    <Link href={`/dashboard/courses/${course.id}/learn`}
                      className="block w-full text-center py-3.5 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition-colors shadow-lg">
                      Enroll Free — Start Now
                    </Link>
                  ) : (
                    <div className="space-y-2">
                      <Link href={`/register?plan=pro`}
                        className="block w-full text-center py-3.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-semibold rounded-xl transition-all shadow-lg">
                        Enroll Now
                      </Link>
                      <p className="text-center text-xs text-gray-500">
                        Included in <Link href="/pricing" className="text-violet-600 font-medium hover:underline">Pro Plan ₹999/mo</Link>
                      </p>
                    </div>
                  )}
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2.5">This course includes</p>
                    <ul className="space-y-2">
                      {[
                        { icon: "M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z", text: "On-demand video content" },
                        { icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z", text: "Quizzes & assessments" },
                        { icon: "M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z", text: "Completion certificate" },
                        { icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z", text: "Lifetime access" },
                      ].map((item) => (
                        <li key={item.text} className="flex items-center gap-2.5 text-sm text-gray-600">
                          <svg className="w-4 h-4 text-violet-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                          </svg>
                          {item.text}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
                    <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    30-day money-back guarantee
                  </div>
                  {course.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {course.tags.map((tag) => (
                        <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">{tag}</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
