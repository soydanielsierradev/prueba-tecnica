import { useState } from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { UserPosts } from '@/features/posts/components/UserPosts'
import { UserList } from '@/features/users/components/UserList'
import type { User } from '@/features/users/types'
import { cn } from '@/lib/utils'
import { tileClass } from '@/shared/lib/tiles'

const panelClass =
  'h-full min-h-0 overflow-hidden rounded-[1.75rem] bg-card shadow-[0_8px_24px_-12px] shadow-black/10'

function App() {
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  return (
    <div className="grid h-svh gap-3 p-3 md:grid-cols-[20rem_1fr] md:gap-4 md:p-4">
      {/* Two independent panels, each with its own scroll. On mobile the hidden one stays
          mounted, so the search term survives going back. */}
      <aside aria-label="Users" className={cn(panelClass, selectedUser && 'hidden md:block')}>
        <ScrollArea className="h-full">
          <div className="flex flex-col gap-5 p-5">
            <header>
              <h1 className="text-lg font-semibold tracking-tight">User Posts Explorer</h1>
              <p className="text-sm text-muted-foreground">Pick a user to read and write posts.</p>
            </header>
            <UserList selectedUserId={selectedUser?.id ?? null} onSelectUser={setSelectedUser} />
          </div>
        </ScrollArea>
      </aside>

      <main aria-label="Posts" className={cn(panelClass, !selectedUser && 'hidden md:block')}>
        <ScrollArea className="h-full">
          {selectedUser ? (
            <UserPosts
              key={selectedUser.id}
              author={selectedUser}
              onBack={() => setSelectedUser(null)}
            />
          ) : (
            <div className="flex min-h-[calc(100svh-2rem)] flex-col items-center justify-center gap-6 p-8 text-center">
              <div aria-hidden="true" className="grid grid-cols-2 gap-2">
                {[0, 1, 2, 3].map((index) => (
                  <div
                    key={index}
                    className={cn(
                      'flex size-16 items-start rounded-2xl p-2 text-xl font-light text-tile-ink',
                      tileClass(index),
                    )}
                  >
                    {String(index + 1).padStart(2, '0')}
                  </div>
                ))}
              </div>
              <p className="max-w-xs text-sm text-muted-foreground">
                Select a user to see their posts
              </p>
            </div>
          )}
        </ScrollArea>
      </main>
    </div>
  )
}

export default App
