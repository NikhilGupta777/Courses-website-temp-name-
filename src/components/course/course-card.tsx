import Link from "next/link";
import { type Course, CATEGORY_COLORS } from "@/lib/data/courses";

interface CourseCardProps {
  course: Course;
  showFreeTag?: boolean;
  size?: "sm" | "md" | "lg";
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <svg
          key={i}
          className={`w-3.5 h-3.5 ${i <= Math.round(rating) ? "text-yellow-400" : "text-gray-200"} fill-current`}
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export function CourseCard({ course, showFreeTag = true, size = "md" }: CourseCardProps) {
  const colors = CATEGORY_COLORS[course.category] ?? {
    from: "from-violet-100",
    to: "to-indigo-200",
    icon: "text-violet-600",
  };

  const discount =
    course.originalPrice > course.price && course.originalPrice > 0
      ? Math.round((1 - course.price / course.originalPrice) * 100)
      : 0;

  const thumbnailHeight =
    size === "sm" ? "h-32" : size === "lg" ? "h-56" : "h-44";

  const titleClamp = size === "lg" ? "line-clamp-3" : "line-clamp-2";

  return (
    <Link href={`/courses/${course.slug}`} className="block h-full">
      <article
        className={`
          relative bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm
          hover:shadow-xl hover:border-violet-200 hover:-translate-y-0.5
          transition-all duration-300 group h-full flex flex-col
        `}
      >
        {/* Thumbnail */}
        <div className={`relative ${thumbnailHeight} bg-gradient-to-br ${colors.from} ${colors.to} overflow-hidden flex-shrink-0`}>
          {/* Play button overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:bg-white transition-all duration-200">
              <svg
                className={`w-5 h-5 ${colors.icon} ml-0.5`}
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>

          {/* Badges top-left */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {course.isFree && showFreeTag && (
              <span className="inline-flex items-center bg-green-500 text-white text-xs font-bold px-2.5 py-0.5 rounded-full shadow-sm">
                FREE
              </span>
            )}
            {course.badge && !(course.isFree && showFreeTag) && (
              <span
                className={`inline-flex items-center text-xs font-semibold px-2.5 py-0.5 rounded-full shadow-sm ${
                  course.badge === "Bestseller"
                    ? "bg-orange-100 text-orange-700"
                    : course.badge === "Hot"
                    ? "bg-red-100 text-red-700"
                    : course.badge === "New"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-green-100 text-green-700"
                }`}
              >
                {course.badge}
              </span>
            )}
          </div>

          {/* Live badge top-right */}
          {course.deliveryMode === "HYBRID" && (
            <div className="absolute top-3 right-3">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-violet-600 text-white shadow-sm">
                <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                LIVE
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className={`flex flex-col flex-1 ${size === "sm" ? "p-3" : size === "lg" ? "p-6" : "p-4"}`}>
          {/* Level + duration */}
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-medium text-violet-600 bg-violet-50 px-2 py-0.5 rounded">
              {course.level}
            </span>
            <span className="text-xs text-gray-400">{course.duration}</span>
            {size !== "sm" && (
              <span className="text-xs text-gray-400">· {course.totalLessons} lessons</span>
            )}
          </div>

          {/* Title */}
          <h3
            className={`
              font-semibold text-gray-900 ${titleClamp}
              group-hover:text-violet-600 transition-colors flex-1
              ${size === "sm" ? "text-xs leading-snug" : size === "lg" ? "text-lg" : "text-sm"}
            `}
          >
            {course.title}
          </h3>

          {/* Instructor */}
          <p className={`mt-1 text-gray-500 ${size === "sm" ? "text-xs" : "text-xs"}`}>
            {course.instructor.name}
          </p>

          {/* Rating */}
          <div className="mt-2 flex items-center gap-1.5">
            <StarRating rating={course.rating} />
            <span className="text-xs font-medium text-gray-700">{course.rating}</span>
            {size !== "sm" && (
              <span className="text-xs text-gray-400">
                ({course.totalStudents.toLocaleString("en-IN")})
              </span>
            )}
          </div>

          {/* Price */}
          <div className="mt-3 flex items-center gap-2">
            {course.isFree ? (
              <div className="flex items-center gap-2">
                <span
                  className={`font-bold text-green-600 ${
                    size === "sm" ? "text-sm" : "text-base"
                  }`}
                >
                  Free
                </span>
                <span className="text-xs text-gray-400">No credit card</span>
              </div>
            ) : (
              <>
                <span
                  className={`font-bold text-gray-900 ${
                    size === "sm" ? "text-sm" : "text-base"
                  }`}
                >
                  ₹{course.price.toLocaleString("en-IN")}
                </span>
                {discount > 0 && (
                  <>
                    <span className="text-xs text-gray-400 line-through">
                      ₹{course.originalPrice.toLocaleString("en-IN")}
                    </span>
                    {size !== "sm" && (
                      <span className="text-xs font-semibold text-green-600 bg-green-50 px-1.5 py-0.5 rounded">
                        {discount}% off
                      </span>
                    )}
                  </>
                )}
              </>
            )}
          </div>

          {/* CTA for large size */}
          {size === "lg" && (
            <div className="mt-4">
              <span
                className={`inline-flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-xl transition-colors ${
                  course.isFree
                    ? "bg-green-600 text-white group-hover:bg-green-700"
                    : "bg-violet-600 text-white group-hover:bg-violet-700"
                }`}
              >
                {course.isFree ? "Enroll Free" : "Enroll Now"}
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </span>
            </div>
          )}
        </div>
      </article>
    </Link>
  );
}

export default CourseCard;
