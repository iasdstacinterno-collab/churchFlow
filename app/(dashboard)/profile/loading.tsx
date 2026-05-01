import { SkeletonHeader } from "@/app/components/loading-ui"
import { Skeleton } from "@/app/components/ui/skeleton"

export default function ProfileLoading() {
  return (
    <div className="animate-in fade-in duration-500 max-w-2xl mx-auto">
      <SkeletonHeader />
      <div className="space-y-8">
        <div className="p-6 rounded-xl border bg-card space-y-6">
          <div className="flex items-center gap-4">
            <Skeleton className="h-16 w-16 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-48" />
            </div>
          </div>
          <div className="grid gap-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>

        <div className="p-6 rounded-xl border bg-card space-y-4">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-10 w-32" />
        </div>
      </div>
    </div>
  )
}
