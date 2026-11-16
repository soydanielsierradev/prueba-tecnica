export const API_URL = 'https://jsonplaceholder.typicode.com'

export class ApiError extends Error {
  readonly status: number

  constructor(status: number) {
    super(`Request failed with status ${status}`)
    this.name = 'ApiError'
    this.status = status
  }
}

// User-facing explanation for a failed request: never the raw browser message.
export function describeError(error: unknown): string {
  if (error instanceof ApiError) {
    return `The server responded with an error (${error.status}). Please try again.`
  }
  return 'Check your connection and try again.'
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, init)

  if (!response.ok) {
    throw new ApiError(response.status)
  }

  return (await response.json()) as T
}

export function apiGet<T>(path: string): Promise<T> {
  return request<T>(path)
}

export function apiPost<T>(path: string, body: unknown): Promise<T> {
  return request<T>(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=UTF-8' },
    body: JSON.stringify(body),
  })
}
