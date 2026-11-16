import { cn } from '@/lib/utils'
import { tileClass } from '@/shared/lib/tiles'
import type { User } from '../types'

interface UserListItemProps {
  user: User
  isSelected: boolean
  onSelect: (user: User) => void
}

function initials(name: string) {
  return name
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
}

export function UserListItem({ user, isSelected, onSelect }: UserListItemProps) {
  return (
    <button
      type="button"
      aria-current={isSelected ? 'true' : undefined}
      onClick={() => onSelect(user)}
      className={cn(
        'flex w-full items-center gap-3 rounded-2xl p-2 pr-3 text-left transition-colors duration-200 outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50',
        isSelected && 'bg-primary text-primary-foreground hover:bg-primary',
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          'flex size-10 shrink-0 items-center justify-center rounded-xl text-sm font-medium text-tile-ink',
          isSelected ? 'bg-white' : tileClass(user.id - 1),
        )}
      >
        {initials(user.name)}
      </span>
      <span className="flex min-w-0 flex-col">
        <span className="truncate text-sm font-medium">{user.name}</span>
        <span
          className={cn(
            'truncate text-xs',
            isSelected ? 'text-primary-foreground' : 'text-muted-foreground',
          )}
        >
          {user.email}
        </span>
      </span>
    </button>
  )
}
