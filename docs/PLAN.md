# PLAN — Build sequence

Exact order to build the app described in [PRD.md](./PRD.md) using [TRD.md](./TRD.md), [UI-UX.md](./UI-UX.md), [FLOW.md](./FLOW.md), and [DATA.md](./DATA.md). Follow the steps in order. Do not start a step until the previous one passes its checks.

## Working rules

- **One step = one or more small commits** with conventional commit messages (`chore:`, `feat:`, `test:`, `docs:`, `refactor:`). Never one commit for everything.
- **TDD for pure logic and key behaviors:** write the failing test (RED), make it pass (GREEN), then clean up (REFACTOR). Commit the test and the implementation separately when it helps show the thinking.
- **Checks after every step:** `npm run test:run`, `npm run build` (type-check included), and `npm run lint`. If one fails, fix it before moving on.
- **Scope guard:** if something is not in the PRD, it goes to the README's "more time" list instead of the code.
- **AI log:** after each step, note in the AI-usage log what was asked, accepted, and corrected (for the README).

## Time budget (≈ 3 h total)

| Phase           | Steps | Budget |
| --------------- | ----- | ------ |
| Specs           | 0     | done   |
| Setup           | 1–3   | 30 min |
| Users           | 4–6   | 45 min |
| Posts           | 7–10  | 60 min |
| Polish + README | 11–12 | 30 min |
| Buffer          | —     | 15 min |

If time runs short, cut in this order: step 11 extras → optional tests 4 and 6 of TRD §8 → mobile focus handling. Never cut the README or the 3 required tests.

## Steps

### Step 0 — Specs ✅

PRD, TRD, UI/UX, FLOW, DATA, and PLAN in `docs/`.

### Step 1 — Scaffold

1. `npm create vite@latest . -- --template react-ts` and `npm install`.
2. Remove template content (logos, `App.css`, demo counter). Leave a minimal `App` rendering the title.
3. Enable `strict` (already on in the template, verify). Add Prettier and a `format` script.
4. Add `.gitignore` check (`node_modules`, `dist`, `coverage`).

**Done when:** `npm run dev` shows the title; build and lint pass.
**Commit:** `chore: scaffold vite react-ts project`

### Step 2 — Tailwind v4 + shadcn/ui

1. `npm install tailwindcss @tailwindcss/vite`; `src/index.css` → `@import "tailwindcss";`.
2. `npm install -D @types/node`; add `tailwindcss()` plugin and `@` alias in `vite.config.ts`; add `paths` (no `baseUrl`, removed in TypeScript 7) in `tsconfig.json` and `tsconfig.app.json`.
3. `npx shadcn@latest init` (base color: neutral).
4. `npx shadcn@latest add button input textarea label card skeleton alert badge sonner scroll-area form`.
5. Verify `react-hook-form`, `zod`, and `@hookform/resolvers` are installed and compatible.
6. Render a shadcn `Button` in `App` to confirm styles load, then remove it.

**Done when:** a shadcn component renders styled; build passes.
**Commits:** `chore: add tailwind v4 and path alias`, `chore: init shadcn/ui and add base components`

### Step 3 — Testing infrastructure

1. Install `vitest`, `jsdom`, `@testing-library/react`, `@testing-library/user-event`, `@testing-library/jest-dom`, `msw`.
2. Vitest config (in `vite.config.ts` or `vitest.config.ts`): `environment: 'jsdom'`, `setupFiles: './src/test/setup.ts'`, `globals: true`.
3. Add `"types": ["vitest/globals", "@testing-library/jest-dom"]` where needed.
4. Create `src/test/`: `fixtures.ts`, `handlers.ts`, `server.ts`, `setup.ts` (jest-dom import, `server.listen({ onUnhandledRequest: 'error' })`, `resetHandlers`, `close`), `renderWithClient.tsx` (fresh `QueryClient` with `retry: false` per test).
5. Scripts: `"test": "vitest"`, `"test:run": "vitest run"`.
6. One smoke test: `App` renders the title.

**Done when:** `npm run test:run` passes the smoke test.
**Commit:** `test: set up vitest, testing library and msw`

### Step 4 — API client and data layer

1. `shared/api/client.ts`: `apiGet<T>(path)` and `apiPost<T>(path, body)`; throw `Error` with status on `!ok`.
2. `features/users/types.ts`, `features/posts/types.ts` exactly as in DATA §2.
3. `features/users/api.ts` → `getUsers()`; `features/posts/api.ts` → `getUserPosts(userId)`, `createPost(payload)`.
4. `main.tsx`: `QueryClientProvider` (`retry: 1`, `refetchOnWindowFocus: false`) + `<Toaster />`.

**Done when:** build passes (types compile).
**Commit:** `feat: add api client and data types`

### Step 5 — User search logic (TDD)

1. RED: `filterUsers.test.ts` — empty term returns all; case-insensitive substring; no match returns `[]`; leading/trailing spaces ignored.
2. GREEN: `filterUsers.ts`.

**Commits:** `test: add filterUsers specs`, `feat: implement filterUsers`

### Step 6 — Users list UI

1. Shared: `LoadingState` (skeletons, `role="status"`, label prop) and `ErrorState` (shadcn `Alert`, `role="alert"`, `onRetry`).
2. `useUsers()` (`['users']`, `staleTime: Infinity`).
3. Presentational: `UserSearch`, `UserListItem` (button, `aria-current`).
4. Container: `UserList` with `searchTerm` state and empty message.
5. Test (RED → GREEN): loading → users → type "leanne" → only Leanne → nonsense term → empty message (AC-1, AC-2, AC-3).
6. Test: users endpoint returns `500` → alert + Retry visible (AC-4).

**Commits:** `feat: add loading and error state components`, `test: add user list behavior specs`, `feat: add searchable user list`

### Step 7 — Layout and selection

1. `App`: header + two-pane grid (`md:grid-cols-[20rem_1fr]`), `selectedUser` state.
2. Posts pane placeholder: "Select a user to see their posts".
3. Mobile: show list or posts based on `selectedUser`; list hidden with CSS (not unmounted) to keep the search term.

**Commit:** `feat: add two-pane layout and user selection`

### Step 8 — User posts UI

1. `usePosts(userId)` (`['posts', userId]`, `staleTime: Infinity`).
2. Presentational `PostList` (cards, "New" badge when `isLocal`, empty message).
3. Container `UserPosts`: user header (name, email, company, count badge), loading, error + retry, list, mobile back button.
4. Wire into `App`.

**Commit:** `feat: show selected user's posts`

### Step 9 — Post schema (TDD)

1. RED: `postSchema.test.ts` — empty fields fail with "Title is required" / "Body is required"; whitespace-only fails; valid input passes and is trimmed.
2. GREEN: `postSchema.ts` (DATA §2 / TRD §5).

**Commits:** `test: add post schema specs`, `feat: add post validation schema`

### Step 10 — Create post

1. `useCreatePost()`: `useMutation(createPost)`; `onSuccess` → local post with `crypto.randomUUID()` + `isLocal: true`, `setQueryData(['posts', userId], old => [localPost, ...(old ?? [])])`.
2. `PostForm`: `useForm` + `zodResolver`, shadcn `Form`, pending button state, inline error alert, `form.reset()` + focus title + `toast.success` on success.
3. Place `PostForm` above `PostList` in `UserPosts`.
4. Tests: submit empty → both errors, no request (AC-6); valid submit → new post first + form cleared (AC-7); `POST` returns `500` → error shown, input kept (AC-8, if time allows).

**Commits:** `test: add post creation specs`, `feat: create posts with validated form`

### Step 11 — Polish

1. Walk through the FLOW §3 matrix in the browser and fix any missing state.
2. Accessibility pass: keyboard-only run, labels, focus after select (mobile) and after publish.
3. Responsive check at 375px and 1280px.
4. Remove dead code and unused shadcn components.

**Commit(s):** `fix: ...` / `refactor: ...` as needed

### Step 12 — README

Sections (required by the assessment):

1. **How to run:** requirements (Node 24 LTS, `mise install` or any Node ≥ 22.12), `npm install`, `npm run dev`, `npm run test:run`, `npm run build`.
2. **Decisions:** stack and why (summary of TRD), architecture, the `id: 101` handling, no router.
3. **What I'd do with more time:** URL routing with deep links, optimistic updates, `localStorage` persistence of created posts, dark mode, E2E with Playwright, CI pipeline, error monitoring.
4. **How I used AI:** spec-first workflow (these docs), what I asked, what I accepted, what I corrected (e.g. CSS Modules → Tailwind v4 + shadcn, manual validation → React Hook Form + Zod, BACKEND → DATA).
5. Link to `docs/`.

**Commit:** `docs: add README`

## Definition of done (whole project)

- [ ] All PRD acceptance criteria AC-1 … AC-8 work in the browser.
- [ ] At least 3 tests pass (`npm run test:run`); target 6.
- [ ] `npm run build` and `npm run lint` pass with no errors.
- [ ] README complete with the four required sections.
- [ ] Git history shows incremental, conventional commits.
