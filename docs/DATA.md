# DATA — Data model & API contract

This app has **no backend of its own**: no server, database, authentication, or migrations. The public JSONPlaceholder API is the data source, and it is read-only in practice (writes are faked). This document is the single source of truth for data shapes, the API contract, and how client-side state replaces persistence.

## 1. Entities

```
┌──────────────┐ 1        N ┌──────────────┐
│     User     │───────────▶│     Post     │
│ id (PK)      │            │ id (PK)      │
│ name         │            │ userId (FK)  │
│ username     │            │ title        │
│ email        │            │ body         │
│ company.name │            └──────────────┘
└──────────────┘
```

- A `User` has many `Post`s; a `Post` belongs to exactly one `User` through `userId`.
- JSONPlaceholder has 10 users (ids 1–10) and 100 posts (10 per user, ids 1–100).

## 2. TypeScript types

Only the fields the UI uses are typed. TypeScript ignores the extra fields the API returns (address, phone, website…), and keeping the types small avoids typing data we never read.

```ts
// features/users/types.ts
export interface User {
  id: number
  name: string
  username: string
  email: string
  company: { name: string }
}

// features/posts/types.ts
export interface Post {
  id: number | string // number from the API, string (UUID) for local posts
  userId: number
  title: string
  body: string
  isLocal?: true // set only on posts created in this session
}

// features/posts/postSchema.ts (see TRD §5)
export type NewPostInput = z.infer<typeof postSchema> // { title: string; body: string }

// features/posts/api.ts
export type CreatePostPayload = NewPostInput & { userId: number }
```

## 3. API contract

Base URL: `https://jsonplaceholder.typicode.com`

### `GET /users`

Response `200`: `User[]` (10 items)

```json
[
  {
    "id": 1,
    "name": "Leanne Graham",
    "username": "Bret",
    "email": "Sincere@april.biz",
    "company": { "name": "Romaguera-Crona" },
    "...": "extra fields ignored"
  }
]
```

### `GET /users/{userId}/posts`

Response `200`: `Post[]` (10 items for ids 1–10; `[]` for unknown ids)

```json
[{ "userId": 1, "id": 1, "title": "sunt aut facere…", "body": "quia et suscipit…" }]
```

### `POST /posts`

Request headers: `Content-Type: application/json; charset=UTF-8`
Request body: `CreatePostPayload`

```json
{ "title": "My title", "body": "My body", "userId": 1 }
```

Response `201`: the payload echoed back plus `"id": 101`, **always 101**. Nothing is stored: a later `GET` will not return it.

### Errors

JSONPlaceholder rarely fails, so errors are simulated in tests with MSW (`500` responses, network errors). The client (`shared/api/client.ts`) treats any non-2xx status and any network failure as a thrown `Error`. See [TRD.md](./TRD.md) §3.

## 4. Client-side "persistence"

Persistence lives in the TanStack Query cache, in memory only, for the browser session.

| Cache key           | Value                  | Written by                                                                | Lifetime                        |
| ------------------- | ---------------------- | ------------------------------------------------------------------------- | ------------------------------- |
| `['users']`         | `User[]`               | `GET /users`                                                              | Session (`staleTime: Infinity`) |
| `['posts', userId]` | `Post[]`, newest first | `GET /users/{id}/posts`, then `setQueryData` after each successful create | Session (`staleTime: Infinity`) |

**Create rule:** on `POST` success the cache entry becomes `[localPost, ...previous]`, where

```ts
const localPost: Post = { ...response, id: crypto.randomUUID(), isLocal: true }
```

- `id` is replaced so React keys never collide (the API returns `101` every time).
- `isLocal` drives the "New" badge in the UI.
- If the posts query for that user has not loaded yet, `old` defaults to `[]`, so the update never crashes.

**What is lost:** a page reload clears everything created locally. This is accepted and documented (see "more time" in the README: `localStorage` persistence via the query persister).

## 5. Test fixtures

`src/test/fixtures.ts` holds a small, deterministic dataset that mirrors these types:

- 3 users (including "Leanne Graham" and "Ervin Howell" for search tests).
- 2 posts for user 1.

MSW handlers in `src/test/handlers.ts` serve these fixtures for the three endpoints. Individual tests override a handler to return `500` when they need an error state.
