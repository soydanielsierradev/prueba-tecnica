import { http, HttpResponse } from 'msw'
import { server } from '@/test/server'
import { API_URL, ApiError, apiGet, apiPost, describeError } from './client'

describe('describeError', () => {
  it('names the HTTP status for server errors', () => {
    expect(describeError(new ApiError(503))).toBe(
      'The server responded with an error (503). Please try again.',
    )
  })

  it('suggests checking the connection for anything else', () => {
    expect(describeError(new TypeError('Failed to fetch'))).toBe(
      'Check your connection and try again.',
    )
  })
})

describe('api client', () => {
  it('returns the parsed JSON of a successful GET', async () => {
    server.use(http.get(`${API_URL}/things`, () => HttpResponse.json([{ id: 1 }])))

    await expect(apiGet('/things')).resolves.toEqual([{ id: 1 }])
  })

  it('throws an ApiError with the HTTP status when the response is not ok', async () => {
    server.use(http.get(`${API_URL}/things`, () => new HttpResponse(null, { status: 500 })))

    const error = await apiGet('/things').catch((caught: unknown) => caught)

    expect(error).toBeInstanceOf(ApiError)
    expect(error).toMatchObject({ status: 500 })
  })

  it('sends the body as JSON on POST and returns the response', async () => {
    server.use(
      http.post(`${API_URL}/things`, async ({ request }) => {
        const body = (await request.json()) as Record<string, unknown>
        return HttpResponse.json(
          { ...body, contentType: request.headers.get('Content-Type') },
          { status: 201 },
        )
      }),
    )

    await expect(apiPost('/things', { name: 'test' })).resolves.toEqual({
      name: 'test',
      contentType: 'application/json; charset=UTF-8',
    })
  })
})
