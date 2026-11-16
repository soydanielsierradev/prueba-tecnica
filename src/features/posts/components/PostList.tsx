import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { tileClass } from '@/shared/lib/tiles'
import type { Post } from '../types'

interface PostListProps {
  posts: Post[]
}

// Posts are numbered in the order they were written: API posts keep their order (01, 02…)
// and posts created this session (always at the head of the list) continue the count.
function postNumber(index: number, total: number, localCount: number) {
  const number = index < localCount ? total - index : index - localCount + 1
  return String(number).padStart(2, '0')
}

export function PostList({ posts }: PostListProps) {
  if (posts.length === 0) {
    return (
      <p className="rounded-3xl bg-muted/60 px-6 py-10 text-center text-sm text-muted-foreground">
        This user has no posts yet
      </p>
    )
  }

  const localCount = posts.filter((post) => post.isLocal).length

  return (
    <ul aria-label="Posts" className="grid gap-3 sm:grid-cols-2 2xl:grid-cols-3">
      {posts.map((post, index) => {
        const number = postNumber(index, posts.length, localCount)

        return (
          <li key={post.id} className="animate-in duration-200 fade-in-0">
            <Card
              className={cn(
                'h-full gap-3 rounded-3xl border-0 text-tile-ink shadow-none ring-0',
                tileClass(Number(number) - 1),
              )}
            >
              <CardHeader className="flex flex-row items-start justify-between gap-2 px-5">
                <span aria-hidden="true" className="text-5xl leading-none font-light">
                  {number}
                </span>
                {post.isLocal && <Badge className="bg-white text-tile-ink">New</Badge>}
              </CardHeader>
              <CardContent className="flex flex-col gap-2 px-5">
                <h3 className="text-base leading-snug font-semibold text-balance first-letter:uppercase">
                  {post.title}
                </h3>
                <p className="text-sm leading-relaxed whitespace-pre-line text-tile-ink-soft first-letter:uppercase">
                  {post.body}
                </p>
              </CardContent>
            </Card>
          </li>
        )
      })}
    </ul>
  )
}
