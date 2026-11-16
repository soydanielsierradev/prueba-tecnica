# TRD — User Posts Explorer

Technical blueprint for the app described in [PRD.md](./PRD.md). When in doubt, this document wins over improvisation; when this document is silent, prefer the simplest option that satisfies the PRD.

## 1. Stack

| Concern | Choice | Why |
|---------|--------|-----|
| Build tool | **Vite** (`react-ts` template) | Fast dev server, zero-config TS, native Vitest integration. |
| UI | **React** + **TypeScript** (`strict: true`) | Required by the assessment. |
| Server state | **TanStack Query** | Gives loading, error, retry, and caching for free; mutations update the cache cleanly. Avoids hand-rolled `useEffect` fetching and its race conditions. |
| HTTP | Native **`fetch`** wrapped in a tiny client | No need for axios for three endpoints. |
| Forms | **React Hook Form** + **Zod** (via `@hookform/resolvers`) + shadcn `Form` | Declarative schema as single source of truth for validation and types (`z.infer`); uncontrolled inputs keep re-renders low; shadcn `Form` wires labels, errors, and ARIA automatically. Scales if the form grows. |
| Styling | **Tailwind CSS v4** via `@tailwindcss/vite` (no `tailwind.config`, CSS-first config in `index.css`) | Utility-first, fast iteration, theme tokens as CSS variables. |
| Components | **shadcn/ui** (copied into `src/components/ui`, built on Radix + Tailwind) | Accessible primitives (labels, focus, ARIA) out of the box; the code is owned by the project, not a black-box dependency. |
| Icons | **lucide-react** (shadcn default) | Comes with shadcn; consistent icon set. |
| Routing | **None** — selection lives in React state | Only two views (list + detail) shown side by side. A router adds setup without user value here. |
| Testing | **Vitest** + **React Testing Library** + **user-event** + **jsdom** | Required by the assessment; Vitest shares Vite's config. |
| API mocking (tests) | **MSW** (Mock Service Worker) | Tests exercise the real `fetch` path; handlers can simulate errors per test. |
| Lint/format | ESLint (Vite default) + Prettier | Consistency; no time spent on custom rules. |

Runtime: Node ≥ 20.19 (current machine: Node 20.20, npm 10.8). Use the latest stable versions available when scaffolding; do not pin to guesses.

## 2. Architecture

Feature-based ("screaming") structure. Each feature owns its API calls, hooks, and components. Shared code holds only truly generic pieces.

```
src/
├── main.tsx                 # React root + QueryClientProvider
├── App.tsx                  # Layout and selected-user state
├── index.css                # @import "tailwindcss" + shadcn theme tokens
├── components/
│   └── ui/                  # shadcn-generated primitives (do not hand-edit lightly)
├── lib/
│   └── utils.ts             # shadcn `cn()` helper
├── shared/
│   ├── api/
│   │   └── client.ts        # fetch wrapper: base URL, JSON, error on !ok
│   └── components/
│       ├── LoadingState.tsx # skeletons with role="status"
│       └── ErrorState.tsx   # shadcn Alert + optional retry button
├── features/
│   ├── users/
│   │   ├── api.ts           # getUsers()
│   │   ├── types.ts         # User
│   │   ├── useUsers.ts      # useQuery wrapper
│   │   ├── filterUsers.ts   # pure name filter
│   │   └── components/
│   │       ├── UserList.tsx     # container: data + search state
│   │       ├── UserSearch.tsx   # presentational input
│   │       └── UserListItem.tsx # presentational item
│   └── posts/
│       ├── api.ts           # getUserPosts(userId), createPost(input)
│       ├── types.ts         # Post, NewPost
│       ├── usePosts.ts      # useQuery wrapper
│       ├── useCreatePost.ts # useMutation wrapper, updates cache
│       ├── postSchema.ts    # Zod schema + inferred NewPostInput type
│       └── components/
│           ├── UserPosts.tsx    # container: posts + form
│           ├── PostList.tsx     # presentational
│           └── PostForm.tsx     # React Hook Form + zodResolver
└── test/
    ├── setup.ts             # jest-dom matchers, MSW lifecycle
    ├── server.ts            # MSW server
    ├── handlers.ts          # default happy-path handlers
    ├── fixtures.ts          # sample users and posts
    └── renderWithClient.tsx # render helper with a fresh QueryClient
```

**Rules**
- **Container / presentational split:** containers (`UserList`, `UserPosts`) call hooks; presentational components receive props only and never fetch.
- **Pure logic out of components:** `filterUsers` and `postSchema` have no React imports.
- `features/users` must not import from `features/posts` and the reverse. Only `App.tsx` composes them.
- No `any`. API responses are typed through `types.ts`.
- Imports use the `@/` alias (`@/features/...`, `@/components/ui/...`), configured in both `vite.config.ts` and `tsconfig`.
- `components/ui` holds only shadcn primitives; app-specific components live in their feature.

**Setup notes (Vite + Tailwind v4 + shadcn)**
1. `npm create vite@latest . -- --template react-ts`
2. `npm install tailwindcss @tailwindcss/vite` and replace `src/index.css` with `@import "tailwindcss";`
3. `npm install -D @types/node`; add `tailwindcss()` plugin and the `@` alias in `vite.config.ts`; add `baseUrl`/`paths` in `tsconfig.json` and `tsconfig.app.json`.
4. `npx shadcn@latest init`, then add only the components listed in [UI-UX.md](./UI-UX.md).

## 3. API integration

Base URL: `https://jsonplaceholder.typicode.com`, defined once in `shared/api/client.ts`.

| Function | Request | Returns |
|----------|---------|---------|
| `getUsers()` | `GET /users` | `User[]` |
| `getUserPosts(userId)` | `GET /users/{userId}/posts` | `Post[]` |
| `createPost(input)` | `POST /posts` with JSON body `{ title, body, userId }` | `Post` |

**Client contract**
- Sets `Content-Type: application/json` on requests with a body.
- Throws an `Error` with the HTTP status when `response.ok` is false, so TanStack Query moves to the error state.
- Network failures propagate as thrown errors.

Data shapes and cache rules are detailed in [BACKEND.md](./BACKEND.md).

## 4. State management

| State | Owner | Notes |
|-------|-------|-------|
| Users list | TanStack Query, key `['users']` | Fetched once; `staleTime: Infinity` (data never changes). |
| Search term | `useState` in `UserList` | Filtering derived during render, no extra state. |
| Selected user | `useState` in `App` | Stores the full `User` (or `null`). |
| Posts per user | TanStack Query, key `['posts', userId]` | `staleTime: Infinity` so locally created posts survive re-selecting the user during the session. |
| Created post | `useMutation` → `setQueryData(['posts', userId], prepend)` | Server response is merged with a **local unique id** (`crypto.randomUUID()` or a negative counter) because the API always returns `id: 101`. |
| Form fields + errors | `useForm` in `PostForm` | `mode: 'onSubmit'`, `reValidateMode: 'onChange'`: errors appear after the first submit and clear as the user fixes them. `form.reset()` on success. |

**QueryClient defaults:** `retry: 1` in the app; `retry: false` in tests (so error tests are fast and deterministic). `refetchOnWindowFocus: false`.

## 5. Validation

`postSchema.ts`:

```ts
export const postSchema = z.object({
  title: z.string().trim().min(1, 'Title is required'),
  body: z.string().trim().min(1, 'Body is required'),
})
export type NewPostInput = z.infer<typeof postSchema>
```

- `.trim()` makes whitespace-only values invalid and sends trimmed values.
- `useForm<NewPostInput>({ resolver: zodResolver(postSchema), defaultValues: { title: '', body: '' } })`.
- `handleSubmit` only calls the mutation when the schema passes, so no request is sent on invalid input.
- Check that the installed `@hookform/resolvers` version supports the installed Zod major version.

## 6. Error and loading handling

- `isPending` → `<LoadingState />` (shadcn `Skeleton`s) wrapped with `role="status"` and an accessible label.
- `isError` → `<ErrorState message onRetry={refetch} />` (shadcn `Alert`, `role="alert"`).
- Mutation: submit button shows "Saving…" and is `disabled` while `isPending`; on error, an inline `role="alert"` message appears and the inputs keep their values.

## 7. Accessibility baseline

- Inputs have associated `<label>`s; error messages linked via `aria-describedby`, invalid fields get `aria-invalid`.
- User items are `<button>`s (keyboard-selectable), the selected one has `aria-pressed` or `aria-current`.
- Semantic landmarks: `<header>`, `<main>`, lists as `<ul>/<li>`.

These also make tests query by role/label, as Testing Library recommends.

## 8. Testing strategy

Behavior-first tests: query by role/label/text, interact with `user-event`, mock the network with MSW. No snapshot tests, no testing implementation details.

| # | Test | Covers |
|---|------|--------|
| 1 | `filterUsers` unit test | Case-insensitive substring match, empty term returns all |
| 2 | `postSchema` unit test | Empty and whitespace-only fields fail with the right messages; valid input passes trimmed |
| 3 | `UserList` integration | Loading indicator → users rendered → search filters → empty message (AC-1, AC-2, AC-3) |
| 4 | `UserList` error | Server 500 → error alert + retry button (AC-4) |
| 5 | `PostForm` validation | Submitting empty shows both errors, no request sent (AC-6) |
| 6 | `UserPosts` create flow | Valid submit → new post appears first, form cleared (AC-7) |

Tests 1–3 are the minimum; 4–6 are added if time allows.

Commands: `npm test` (watch), `npm run test:run` (CI, single run).

## 9. Out of scope (technical)

No SSR, no global state library (Redux/Zustand), no E2E tests, no CI pipeline, no deployment.
