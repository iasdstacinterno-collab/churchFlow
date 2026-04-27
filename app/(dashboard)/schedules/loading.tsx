import { SkeletonHeader } from "@/components/loading-ui"
import { Skeleton } from "@/components/ui/skeleton"

export default function SchedulesLoading() {
  return (
    <div className="animate-in fade-in duration-500">
      <SkeletonHeader />
      <div className="space-y-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="space-y-4">
            <Skeleton className="h-6 w-32" />
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, j) => (
                <div key={j} className="p-4 rounded-xl border bg-card space-y-3">
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-3/4" />
                  <div className="flex -space-x-2">
                    <Skeleton className="h-8 w-8 rounded-full border-2 border-background" />
                    <Skeleton className="h-8 w-8 rounded-full border-2 border-background" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
