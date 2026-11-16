import { useState } from 'react'
import { UserList } from '@/features/users/components/UserList'
import type { User } from '@/features/users/types'

function App() {
  // Selection is wired here; the two-pane layout and posts pane arrive in PLAN step 7.
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  return (
    <div className="mx-auto flex min-h-svh max-w-6xl flex-col gap-6 p-4 md:p-6">
      <header>
        <h1 className="text-xl font-semibold">User Posts Explorer</h1>
      </header>
      <main className="md:w-80">
        <UserList selectedUserId={selectedUser?.id ?? null} onSelectUser={setSelectedUser} />
      </main>
    </div>
  )
}

export default App
