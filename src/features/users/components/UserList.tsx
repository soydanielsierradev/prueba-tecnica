import { useState } from 'react'
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

  if (isPending) return <LoadingState label="Loading users" />

  if (isError) {
    return (
      <ErrorState
        title="Couldn't load users"
        message={error.message}
        onRetry={() => void refetch()}
      />
    )
  }

  const visibleUsers = filterUsers(users, searchTerm)

  return (
    <div className="flex flex-col gap-3">
      <UserSearch value={searchTerm} onChange={setSearchTerm} />
      {visibleUsers.length === 0 ? (
        <p className="py-6 text-center text-sm text-muted-foreground">
          No users match "{searchTerm.trim()}"
        </p>
      ) : (
        <ul className="flex flex-col gap-1">
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
      )}
    </div>
  )
}
