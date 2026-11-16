import { Users } from 'lucide-react'
import { useState } from 'react'
import { UserPosts } from '@/features/posts/components/UserPosts'
import { UserList } from '@/features/users/components/UserList'
import type { User } from '@/features/users/types'
import { cn } from '@/lib/utils'

function App() {
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  return (
    <div className="mx-auto flex min-h-svh max-w-6xl flex-col gap-6 p-4 md:p-6">
      <header>
        <h1 className="text-xl font-semibold">User Posts Explorer</h1>
      </header>
      <main className="grid gap-6 md:grid-cols-[20rem_1fr]">
        {/* On mobile the hidden pane stays mounted, so the search term survives going back. */}
        <aside
          aria-label="Users"
          className={cn(
            selectedUser && 'hidden md:block',
            'md:max-h-[calc(100svh-8rem)] md:overflow-y-auto',
          )}
        >
          <UserList selectedUserId={selectedUser?.id ?? null} onSelectUser={setSelectedUser} />
        </aside>
        <section aria-label="Posts" className={cn(!selectedUser && 'hidden md:block')}>
          {selectedUser ? (
            <UserPosts
              key={selectedUser.id}
              author={selectedUser}
              onBack={() => setSelectedUser(null)}
            />
          ) : (
            <div className="flex h-full min-h-64 flex-col items-center justify-center gap-2 rounded-lg border border-dashed text-muted-foreground">
              <Users className="size-6" />
              <p className="text-sm">Select a user to see their posts</p>
            </div>
          )}
        </section>
      </main>
    </div>
  )
}

export default App
