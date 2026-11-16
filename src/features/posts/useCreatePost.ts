import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createPost } from './api'
import type { Post } from './types'
import { postsQueryKey } from './usePosts'

export function useCreatePost() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createPost,
    // Use the userId captured at submit time, so the post lands in the right list
    // even if another user was selected before the response arrived.
    onSuccess: (createdPost, { userId }) => {
      // JSONPlaceholder always answers id 101, so give each post a unique local id for React keys.
      const localPost: Post = { ...createdPost, id: crypto.randomUUID(), isLocal: true }

      queryClient.setQueryData<Post[]>(postsQueryKey(userId), (previous = []) => [
        localPost,
        ...previous,
      ])
    },
  })
}
