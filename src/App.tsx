import { useRef, useState } from 'react'
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
  const usersPanelRef = useRef<HTMLElement>(null)

  function handleBack() {
    const userId = selectedUser?.id
    setSelectedUser(null)
    // On mobile the posts panel disappears; return focus to the user the visitor came from.
    requestAnimationFrame(() => {
      usersPanelRef.current?.querySelector<HTMLElement>(`[data-user-id="${userId}"]`)?.focus()
    })
  }

  return (
    <div className="grid h-svh gap-3 p-3 md:grid-cols-[20rem_1fr] md:gap-4 md:p-4">
      {/* Two independent panels, each with its own scroll. On mobile the hidden one stays
          mounted, so the search term survives going back. */}
      <aside
        ref={usersPanelRef}
        aria-label="Users"
        className={cn(panelClass, selectedUser && 'hidden md:block')}
      >
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
        {/* Keyed by user so switching users starts the posts panel back at the top. */}
        <ScrollArea key={selectedUser?.id ?? 'none'} className="h-full">
          {selectedUser ? (
            <UserPosts author={selectedUser} onBack={handleBack} />
          ) : (
            <div className="flex min-h-[calc(100svh-2rem)] flex-col items-center justify-center gap-8 p-8 text-center">
              <div aria-hidden="true" className="grid grid-cols-2 gap-3">
                {[0, 1, 2].map((index) => (
                  <div
                    key={index}
                    className={cn(
                      'flex size-28 rounded-3xl p-4 text-5xl leading-none font-light text-tile-ink md:size-36',
                      tileClass(index),
                    )}
                  >
                    {String(index + 1).padStart(2, '0')}
                  </div>
                ))}
                <div className="flex size-28 rounded-3xl bg-primary p-4 text-5xl leading-none font-light text-primary-foreground md:size-36">
                  04
                </div>
              </div>
              <p className="max-w-sm text-2xl font-bold tracking-tight text-balance text-primary">
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
