import { postSchema } from './postSchema'

function fieldErrors(input: unknown) {
  const result = postSchema.safeParse(input)
  if (result.success) return {}

  return Object.fromEntries(result.error.issues.map((issue) => [issue.path[0], issue.message]))
}

describe('postSchema', () => {
  it('requires a title and a body', () => {
    expect(fieldErrors({ title: '', body: '' })).toEqual({
      title: 'Title is required',
      body: 'Body is required',
    })
  })

  it('rejects whitespace-only values', () => {
    expect(fieldErrors({ title: '   ', body: '\n\t ' })).toEqual({
      title: 'Title is required',
      body: 'Body is required',
    })
  })

  it('accepts valid input and trims it', () => {
    expect(postSchema.parse({ title: '  Hello  ', body: ' World ' })).toEqual({
      title: 'Hello',
      body: 'World',
    })
  })
})
