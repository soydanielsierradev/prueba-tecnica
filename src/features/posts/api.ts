import { apiGet, apiPost } from '@/shared/api/client'
import type { CreatePostPayload, Post } from './types'

export function getUserPosts(userId: number): Promise<Post[]> {
  return apiGet<Post[]>(`/users/${userId}/posts`)
}

// JSONPlaceholder echoes the payload with id 101 and does not persist it.
export function createPost(payload: CreatePostPayload): Promise<Post> {
  return apiPost<Post>('/posts', payload)
}
