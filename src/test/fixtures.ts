import type { Post } from '@/features/posts/types'
import type { User } from '@/features/users/types'

export const users: User[] = [
  {
    id: 1,
    name: 'Leanne Graham',
    username: 'Bret',
    email: 'Sincere@april.biz',
    company: { name: 'Romaguera-Crona' },
  },
  {
    id: 2,
    name: 'Ervin Howell',
    username: 'Antonette',
    email: 'Shanna@melissa.tv',
    company: { name: 'Deckow-Crist' },
  },
  {
    id: 3,
    name: 'Clementine Bauch',
    username: 'Samantha',
    email: 'Nathan@yesenia.net',
    company: { name: 'Romaguera-Jacobson' },
  },
]

export const posts: Post[] = [
  {
    id: 1,
    userId: 1,
    title: 'First post by Leanne',
    body: 'Body of the first post.',
  },
  {
    id: 2,
    userId: 1,
    title: 'Second post by Leanne',
    body: 'Body of the second post.',
  },
]
