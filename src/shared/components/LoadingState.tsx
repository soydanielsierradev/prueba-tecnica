import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

interface LoadingStateProps {
  label: string
  variant?: 'list' | 'cards'
  rows?: number
}

export function LoadingState({ label, variant = 'list', rows = 6 }: LoadingStateProps) {
  return (
    <div
      role="status"
      aria-label={label}
      className={cn(variant === 'cards' ? 'grid gap-3 sm:grid-cols-2' : 'flex flex-col gap-1')}
    >
      {Array.from({ length: rows }, (_, index) =>
        variant === 'cards' ? (
          <div key={index} className="flex flex-col gap-3 rounded-3xl bg-muted/60 p-5">
            <Skeleton className="h-11 w-14 rounded-lg" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-5/6" />
          </div>
        ) : (
          <div key={index} className="flex items-center gap-3 p-2">
            <Skeleton className="size-10 shrink-0 rounded-xl" />
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
