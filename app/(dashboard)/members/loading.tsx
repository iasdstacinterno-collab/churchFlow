import { SkeletonList, SkeletonHeader } from "@/app/components/loading-ui"

export default function MembersLoading() {
  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-8">
        <SkeletonHeader />
        <div className="h-10 w-32 rounded-md bg-muted animate-pulse" />
      </div>
      <div className="rounded-md border">
        <SkeletonList count={8} />
      </div>
    </div>
  )
}
