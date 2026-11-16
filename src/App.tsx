import { useRef, useState } from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { UserPosts } from '@/features/posts/components/UserPosts'
import { UserList } from '@/features/users/components/UserList'
import type { User } from '@/features/users/types'
import { cn } from '@/lib/utils'
import { AppLogo } from '@/shared/components/AppLogo'

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
            <header className="flex items-center gap-3">
              <AppLogo className="size-11" />
              <div>
                <h1 className="text-lg leading-tight font-semibold tracking-tight">
                  User Posts Explorer
                </h1>
                <p className="text-sm text-muted-foreground">
                  Pick a user to read and write posts.
                </p>
              </div>
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
              <AppLogo className="size-60 md:size-72" />
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
