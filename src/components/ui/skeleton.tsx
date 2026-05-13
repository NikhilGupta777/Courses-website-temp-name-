import { cn } from "@/lib/utils";

// Base skeleton shimmer component
export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-lg bg-gray-200", className)}
      {...props}
    />
  );
}

// ─── Course Card Skeleton ───────────────────────────────────────────────────
export function CourseCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
      <Skeleton className="h-44 w-full rounded-none" />
      <div className="p-4 space-y-3">
        <div className="flex gap-2">
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-5 w-12 rounded-full" />
        </div>
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
        <Skeleton className="h-3 w-24" />
        <div className="flex gap-1 pt-1">
          {[1,2,3,4,5].map((i) => <Skeleton key={i} className="h-3 w-3 rounded-full" />)}
          <Skeleton className="h-3 w-16 ml-1" />
        </div>
        <Skeleton className="h-5 w-20 mt-2" />
      </div>
    </div>
  );
}

// ─── Course Catalog Skeleton (grid of cards) ────────────────────────────────
export function CatalogSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
      {Array.from({ length: 6 }).map((_, i) => (
        <CourseCardSkeleton key={i} />
      ))}
    </div>
  );
}

// ─── Dashboard Skeleton ─────────────────────────────────────────────────────
export function DashboardSkeleton() {
  return (
    <div className="p-6 space-y-8">
      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[1,2,3,4].map((i) => (
          <div key={i} className="bg-white rounded-2xl p-5 border border-gray-100">
            <Skeleton className="h-10 w-10 rounded-xl mb-3" />
            <Skeleton className="h-7 w-16 mb-1.5" />
            <Skeleton className="h-3 w-24" />
          </div>
        ))}
      </div>
      {/* Continue learning */}
      <div>
        <Skeleton className="h-6 w-40 mb-4" />
        <div className="space-y-4">
          {[1,2].map((i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 flex items-center gap-5">
              <Skeleton className="w-14 h-14 rounded-xl flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
                <Skeleton className="h-2 w-full rounded-full" />
              </div>
              <Skeleton className="w-20 h-8 rounded-lg flex-shrink-0" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Course Player Sidebar Skeleton ─────────────────────────────────────────
export function CoursePlayerSkeleton() {
  return (
    <div className="flex h-screen bg-gray-900">
      {/* Sidebar */}
      <div className="w-72 bg-gray-950 border-r border-gray-800 p-4 space-y-4">
        <Skeleton className="h-4 w-32 bg-gray-800" />
        <Skeleton className="h-2 w-full bg-gray-800 rounded-full" />
        <div className="space-y-2 pt-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex gap-3 items-center">
              <Skeleton className="w-5 h-5 rounded-full bg-gray-800 flex-shrink-0" />
              <div className="flex-1 space-y-1">
                <Skeleton className="h-3 w-full bg-gray-800" />
                <Skeleton className="h-2 w-12 bg-gray-800" />
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Main */}
      <div className="flex-1 flex flex-col">
        <Skeleton className="flex-1 rounded-none bg-gray-800" />
        <div className="bg-gray-900 px-4 py-3 flex items-center gap-4 border-t border-gray-800">
          <Skeleton className="w-8 h-8 rounded-lg bg-gray-700" />
          <Skeleton className="flex-1 h-1.5 bg-gray-700 rounded-full" />
          <Skeleton className="w-24 h-6 bg-gray-700 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

// ─── Blog Post Skeleton ─────────────────────────────────────────────────────
export function BlogPostSkeleton() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <Skeleton className="h-64 w-full rounded-2xl mb-8" />
      <Skeleton className="h-8 w-3/4 mb-4" />
      <Skeleton className="h-5 w-full mb-2" />
      <Skeleton className="h-5 w-5/6 mb-8" />
      <div className="space-y-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className={`h-4 ${i % 3 === 2 ? "w-4/5" : "w-full"}`} />
        ))}
      </div>
    </div>
  );
}

// ─── Table Row Skeleton ─────────────────────────────────────────────────────
export function TableRowSkeleton({ cols = 5 }: { cols?: number }) {
  return (
    <tr>
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-5 py-4">
          <Skeleton className="h-4 w-full max-w-[120px]" />
        </td>
      ))}
    </tr>
  );
}
