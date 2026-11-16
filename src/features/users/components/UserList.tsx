import { useState } from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { describeError } from '@/shared/api/client'
import { ErrorState } from '@/shared/components/ErrorState'
import { LoadingState } from '@/shared/components/LoadingState'
import { filterUsers } from '../filterUsers'
import type { User } from '../types'
import { useUsers } from '../useUsers'
import { UserListItem } from './UserListItem'
import { UserSearch } from './UserSearch'

interface UserListProps {
  selectedUserId: number | null
  onSelectUser: (user: User) => void
}

export function UserList({ selectedUserId, onSelectUser }: UserListProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const { data: users, isPending, isError, error, refetch } = useUsers()

  if (isPending) {
    return (
      <div className="px-5">
        <LoadingState label="Loading users" />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="px-5">
        <ErrorState
          title="Couldn't load users"
          message={describeError(error)}
          onRetry={() => void refetch()}
        />
      </div>
    )
  }

  const visibleUsers = filterUsers(users, searchTerm)

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="shrink-0 px-5 pb-3">
        <UserSearch value={searchTerm} onChange={setSearchTerm} />
      </div>
      {visibleUsers.length === 0 ? (
        <p className="px-5 py-6 text-center text-sm text-muted-foreground">
          No users match "{searchTerm.trim()}"
        </p>
      ) : (
        <ScrollArea className="min-h-0 flex-1">
          <ul className="flex flex-col gap-1 px-5 pb-5">
            {visibleUsers.map((user) => (
              <li key={user.id}>
                <UserListItem
                  user={user}
                  isSelected={user.id === selectedUserId}
                  onSelect={onSelectUser}
                />
              </li>
            ))}
          </ul>
        </ScrollArea>
      )}
    </div>
  )
}
