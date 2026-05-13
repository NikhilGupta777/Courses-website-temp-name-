import { CatalogSkeleton } from "@/components/ui/skeleton";

export default function CoursesLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 py-10 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-3">
          <div className="h-8 w-48 bg-gray-200 animate-pulse rounded-lg" />
          <div className="h-4 w-72 bg-gray-100 animate-pulse rounded-lg" />
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <CatalogSkeleton />
      </div>
    </div>
  );
}
