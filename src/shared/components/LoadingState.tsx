import { Skeleton } from '@/components/ui/skeleton'

interface LoadingStateProps {
  label: string
  variant?: 'list' | 'cards'
  rows?: number
}

export function LoadingState({ label, variant = 'list', rows = 6 }: LoadingStateProps) {
  return (
    <div role="status" aria-label={label} className="flex flex-col gap-3">
      {Array.from({ length: rows }, (_, index) =>
        variant === 'cards' ? (
          <div key={index} className="flex flex-col gap-2 rounded-xl border p-4">
            <Skeleton className="h-5 w-2/3" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-5/6" />
          </div>
        ) : (
          <div key={index} className="flex items-center gap-3">
            <Skeleton className="size-9 shrink-0 rounded-full" />
            <div className="flex flex-1 flex-col gap-1.5">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
        ),
      )}
    </div>
  )
}
