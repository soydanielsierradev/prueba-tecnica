// Minimal local shapes; the feature types in src/features/*/types.ts replace these in PLAN step 4.
interface UserFixture {
  id: number
  name: string
  username: string
  email: string
  company: { name: string }
}

interface PostFixture {
  id: number
  userId: number
  title: string
  body: string
}

export const users: UserFixture[] = [
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

export const posts: PostFixture[] = [
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
