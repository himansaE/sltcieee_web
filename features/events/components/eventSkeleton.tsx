import { Skeleton } from "@/components/ui/skeleton";

export function EventCardSkeleton() {
  return (
    <div className="group relative overflow-hidden rounded-xl bg-white border transition-all">
      {/* Cover Image Skeleton */}
      <div className="relative h-48 w-full overflow-hidden">
        <Skeleton className="h-full w-full" />
        {/* Organization Badge Skeleton */}
        <div className="absolute bottom-4 left-4 right-4 z-10 flex items-center">
          <div className="flex items-center gap-2 bg-white/90 backdrop-blur-sm rounded-full pl-1 pr-3 py-1">
            <Skeleton className="h-6 w-6 rounded-full" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
      </div>

      <div className="p-4 space-y-3">
        {/* Title and Description Skeletons */}
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />

        {/* Event Type Badge Skeleton */}
        <Skeleton className="h-5 w-24" />

        {/* Event Details Skeleton */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-20" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function EventsGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <EventCardSkeleton key={i} />
      ))}
    </div>
  );
}
