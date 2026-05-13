import { DashboardSkeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-gray-50 flex pt-16">
      {/* Sidebar skeleton */}
      <div className="hidden lg:block w-64 bg-white border-r border-gray-200 p-5 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gray-200 animate-pulse" />
          <div className="flex-1 space-y-1.5">
            <div className="h-3 w-24 bg-gray-200 animate-pulse rounded" />
            <div className="h-2.5 w-32 bg-gray-100 animate-pulse rounded" />
          </div>
        </div>
        <div className="space-y-2 pt-2">
          {[1,2,3,4,5].map((i) => (
            <div key={i} className="flex items-center gap-3 px-3 py-2.5">
              <div className="w-4 h-4 bg-gray-200 animate-pulse rounded" />
              <div className="h-3 w-20 bg-gray-200 animate-pulse rounded" />
            </div>
          ))}
        </div>
      </div>
      <div className="flex-1">
        <DashboardSkeleton />
      </div>
    </div>
  );
}
