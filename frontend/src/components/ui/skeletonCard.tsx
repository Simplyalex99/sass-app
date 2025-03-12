import { Skeleton } from '@/components/ui/skeleton'

export const SkeletonButton = () => {
  return (
    <div className="flex flex-col space-y-3">
      <Skeleton className="h-9 w-24 rounded-xl px-4 py-2" />
    </div>
  )
}
