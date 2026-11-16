import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import type { Post } from '../types'

interface PostListProps {
  posts: Post[]
}

export function PostList({ posts }: PostListProps) {
  if (posts.length === 0) {
    return (
      <p className="py-6 text-center text-sm text-muted-foreground">This user has no posts yet</p>
    )
  }

  return (
    <ul aria-label="Posts" className="flex flex-col gap-3">
      {posts.map((post) => (
        <li key={post.id}>
          <Card>
            <CardHeader className="flex flex-row items-start justify-between gap-2">
              <h3 className="font-medium first-letter:uppercase">{post.title}</h3>
              {post.isLocal && <Badge variant="secondary">New</Badge>}
            </CardHeader>
            <CardContent>
              <p className="text-sm whitespace-pre-line text-muted-foreground">{post.body}</p>
            </CardContent>
          </Card>
        </li>
      ))}
    </ul>
  )
}
