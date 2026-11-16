import { http, HttpResponse } from 'msw'
import { posts, users } from './fixtures'

export const API_URL = 'https://jsonplaceholder.typicode.com'

export const handlers = [
  http.get(`${API_URL}/users`, () => HttpResponse.json(users)),

  http.get(`${API_URL}/users/:userId/posts`, ({ params }) => {
    const userId = Number(params.userId)
    return HttpResponse.json(posts.filter((post) => post.userId === userId))
  }),

  // JSONPlaceholder echoes the payload and always returns id 101 without persisting it.
  http.post(`${API_URL}/posts`, async ({ request }) => {
    const payload = (await request.json()) as Record<string, unknown>
    return HttpResponse.json({ ...payload, id: 101 }, { status: 201 })
  }),
]
