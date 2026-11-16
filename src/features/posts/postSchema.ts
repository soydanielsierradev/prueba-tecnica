import { z } from 'zod'

// trim() makes whitespace-only values invalid and sends the cleaned value.
export const postSchema = z.object({
  title: z.string().trim().min(1, 'Title is required'),
  body: z.string().trim().min(1, 'Body is required'),
})

export type NewPostInput = z.infer<typeof postSchema>
