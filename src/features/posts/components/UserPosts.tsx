import { ArrowLeft } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ErrorState } from '@/shared/components/ErrorState'
import { LoadingState } from '@/shared/components/LoadingState'
import type { PostAuthor } from '../types'
import { usePosts } from '../usePosts'
import { PostList } from './PostList'

interface UserPostsProps {
  author: PostAuthor
  onBack: () => void
}

export function UserPosts({ author, onBack }: UserPostsProps) {
  const { data: posts, isPending, isError, error, refetch } = usePosts(author.id)

  return (
    <div className="flex flex-col gap-4">
      <Button variant="ghost" size="sm" onClick={onBack} className="self-start md:hidden">
        <ArrowLeft />
        Back to users
      </Button>

      <header className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-0.5">
          <h2 className="text-lg font-semibold">{author.name}</h2>
          <p className="text-sm text-muted-foreground">
            {author.email} · {author.company.name}
          </p>
        </div>
        {posts && <Badge variant="outline">{posts.length} posts</Badge>}
      </header>

      {isPending ? (
        <LoadingState label="Loading posts" variant="cards" rows={3} />
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
