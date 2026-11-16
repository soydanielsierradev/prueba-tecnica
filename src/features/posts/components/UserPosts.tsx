import { ArrowLeft } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ErrorState } from '@/shared/components/ErrorState'
import { LoadingState } from '@/shared/components/LoadingState'
import type { PostAuthor } from '../types'
import { usePosts } from '../usePosts'
import { PostForm } from './PostForm'
import { PostList } from './PostList'

interface UserPostsProps {
  author: PostAuthor
  onBack: () => void
}

export function UserPosts({ author, onBack }: UserPostsProps) {
  const { data: posts, isPending, isError, error, refetch } = usePosts(author.id)
  const headingRef = useRef<HTMLHeadingElement>(null)

  // On mobile the users panel is hidden when this view opens, so move focus here.
  useEffect(() => {
    if (window.matchMedia?.('(max-width: 767px)').matches) headingRef.current?.focus()
  }, [])

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 p-5 md:p-8">
      <Button variant="ghost" size="sm" onClick={onBack} className="-ml-2 self-start md:hidden">
        <ArrowLeft />
        Back to users
      </Button>

      <header className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
        <div className="flex flex-col gap-1.5">
          <h2
            ref={headingRef}
            tabIndex={-1}
            className="text-3xl font-bold tracking-tight text-balance text-primary outline-none md:text-4xl"
          >
            {author.name}
          </h2>
          <p className="text-sm text-muted-foreground">
            {author.email} · {author.company.name}
          </p>
        </div>
        {posts && (
          <Badge variant="outline" className="h-7 rounded-full px-3 text-sm tabular-nums">
            {posts.length} {posts.length === 1 ? 'post' : 'posts'}
          </Badge>
        )}
      </header>

      <PostForm userId={author.id} nextNumber={posts ? posts.length + 1 : null} />

      {isPending ? (
        <LoadingState label="Loading posts" variant="cards" rows={4} />
      ) : isError ? (
        <ErrorState
          title="Couldn't load posts"
          message={error.message}
          onRetry={() => void refetch()}
        />
      ) : (
        <PostList posts={posts} />
      )}
    </div>
  )
}
