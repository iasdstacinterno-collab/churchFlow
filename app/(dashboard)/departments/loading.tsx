import { SkeletonCard, SkeletonHeader } from "@/components/loading-ui"

export default function DepartmentsLoading() {
  return (
    <div className="animate-in fade-in duration-500">
      <SkeletonHeader />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </div>
  )
}
