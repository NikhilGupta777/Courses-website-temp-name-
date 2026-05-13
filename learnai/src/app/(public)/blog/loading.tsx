import { BlogPostSkeleton } from "@/components/ui/skeleton";

export default function BlogLoading() {
  return (
    <div className="min-h-screen bg-white">
      <div className="pt-20 pb-12 bg-gradient-to-br from-violet-50 via-white to-indigo-50">
        <div className="mx-auto max-w-7xl px-4 space-y-3">
          <div className="h-5 w-24 bg-violet-100 animate-pulse rounded-full" />
          <div className="h-10 w-2/3 bg-gray-200 animate-pulse rounded-xl" />
          <div className="h-5 w-1/2 bg-gray-100 animate-pulse rounded-lg" />
        </div>
      </div>
      <BlogPostSkeleton />
    </div>
  );
}
