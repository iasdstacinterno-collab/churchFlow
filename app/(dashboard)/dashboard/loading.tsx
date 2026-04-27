import { SkeletonCard, SkeletonHeader } from "@/components/loading-ui"

export default function DashboardLoading() {
  return (
    <div className="animate-in fade-in duration-500">
      <SkeletonHeader />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <div className="h-[300px] rounded-xl border bg-card animate-pulse" />
        <div className="h-[300px] rounded-xl border bg-card animate-pulse" />
      </div>
    </div>
  )
}
