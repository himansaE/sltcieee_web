import { Skeleton } from "@/components/ui/skeleton";

export function EventDetailsSkeleton() {
  return (
    <div className="container mx-auto py-6 space-y-8 animate-in fade-in-50">
      {/* Header Skeleton */}
      <div className="relative h-[300px] rounded-xl overflow-hidden bg-muted">
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute top-4 left-4 z-20">
          <Skeleton className="h-6 w-24" />
        </div>
        <div className="absolute bottom-6 left-6 right-6">
          <div className="flex items-center gap-4">
            <Skeleton className="h-16 w-16 rounded-lg flex-shrink-0" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-8 w-3/4" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column Skeleton */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border p-6 space-y-6">
            <Skeleton className="h-7 w-32" />
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="h-5 w-5 rounded" />
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column Skeleton */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border">
            <div className="p-4 border-b flex items-center justify-between">
              <Skeleton className="h-7 w-32" />
              <Skeleton className="h-9 w-24" />
            </div>
            <div className="p-4">
              <div className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-[90%]" />
                <Skeleton className="h-4 w-[85%]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
