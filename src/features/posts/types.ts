export interface Post {
  id: number | string // number from the API, string (UUID) for posts created locally
  userId: number
  title: string
  body: string
  isLocal?: true // set only on posts created in this session
}

// The posts feature never imports from features/users: it declares the author fields it needs,
// and App passes a User, which is structurally compatible.
export interface PostAuthor {
  id: number
  name: string
  email: string
  company: { name: string }
}

// Refined in PLAN step 9 to derive from the Zod post schema.
export type CreatePostPayload = Pick<Post, 'title' | 'body' | 'userId'>
