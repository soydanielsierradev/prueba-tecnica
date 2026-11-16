import { useQuery } from '@tanstack/react-query'
import { getUserPosts } from './api'

export function postsQueryKey(userId: number) {
  return ['posts', userId] as const
}

export function usePosts(userId: number) {
  return useQuery({
    queryKey: postsQueryKey(userId),
    queryFn: () => getUserPosts(userId),
    // Never refetch on its own: locally created posts live only in this cache entry.
    staleTime: Infinity,
  })
}
