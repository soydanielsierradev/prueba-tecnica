import { cn } from '@/lib/utils'
import type { User } from '../types'

interface UserListItemProps {
  user: User
  isSelected: boolean
  onSelect: (user: User) => void
}

export function UserListItem({ user, isSelected, onSelect }: UserListItemProps) {
  return (
    <button
      type="button"
      aria-current={isSelected ? 'true' : undefined}
      onClick={() => onSelect(user)}
      className={cn(
        'flex w-full flex-col items-start rounded-md px-3 py-2 text-left transition-colors hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
        isSelected && 'bg-accent',
      )}
    >
      <span className="text-sm font-medium">{user.name}</span>
      <span className="text-xs text-muted-foreground">{user.email}</span>
    </button>
  )
}
