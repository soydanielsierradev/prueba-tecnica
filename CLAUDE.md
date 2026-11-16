# CLAUDE.md

Guidance for AI coding agents working in this repository.

## Project

Technical assessment for a Frontend React position: a small React + TypeScript app on top of the public JSONPlaceholder API (user list with search, user posts, validated create-post form, loading/error states, tests, README). **Hard time budget: 3 hours.**

## Source of truth

Read the relevant spec before writing code. If code and docs disagree, update the doc first, then the code.

| Doc                            | Use it for                                                    |
| ------------------------------ | ------------------------------------------------------------- |
| [docs/PRD.md](docs/PRD.md)     | What to build, non-goals, acceptance criteria AC-1…AC-8       |
| [docs/TRD.md](docs/TRD.md)     | Stack, folder structure, architecture rules, testing strategy |
| [docs/UI-UX.md](docs/UI-UX.md) | Layout, states, shadcn components, copy                       |
| [docs/FLOW.md](docs/FLOW.md)   | User journeys, state ↔ UI matrix, component wiring            |
| [docs/DATA.md](docs/DATA.md)   | Types, API contract, cache rules (`id: 101` handling)         |
| [docs/PLAN.md](docs/PLAN.md)   | **Build order.** Work one step at a time, in sequence         |

## Stack (do not substitute)

Vite · React · TypeScript (`strict`) · TanStack Query · Tailwind CSS v4 (`@tailwindcss/vite`, no `tailwind.config`) · shadcn/ui · React Hook Form + Zod · Vitest + React Testing Library + user-event + MSW.

Do not add libraries that are not listed in the TRD without asking first.

## Commands

```bash
npm run dev        # dev server
npm test           # vitest watch
npm run test:run   # vitest single run
npm run build      # type-check + production build
npm run lint       # oxlint
```

Run `test:run`, `build`, and `lint` after every PLAN step. Do not move on with any of them failing.

## Architecture rules

- Feature-based structure: `src/features/users`, `src/features/posts`; generic code in `src/shared`; shadcn primitives only in `src/components/ui`.
- Container/presentational split: containers call hooks; presentational components receive props and never fetch.
- `features/users` and `features/posts` never import each other. Only `App.tsx` composes them.
- Pure logic (`filterUsers`, `postSchema`) has no React imports.
- No `any`. Use the `@/` import alias.
- Server state lives in TanStack Query only; no global state library.

## Testing

- Strict TDD for pure logic and key behaviors: failing test first (RED), then implementation (GREEN), then refactor.
- Test behavior, not implementation: query by role/label/text, interact with `user-event`, mock the network with MSW (never mock hooks or `fetch` directly).
- Fresh `QueryClient` per test with `retry: false`. No snapshot tests.

## Git

- Small, incremental commits; one PLAN step is one or more commits. A single "everything" commit is not acceptable.
- Conventional commits: `feat:`, `fix:`, `test:`, `docs:`, `chore:`, `refactor:`.
- No AI attribution lines (`Co-Authored-By`, "Generated with…") in commits.
- Never rewrite pushed history (no rebase/squash/force-push on `main`).

## Scope guard

Anything not in the PRD goes to the README's "Qué haría con más tiempo" list, not into the code. When a decision is unclear, ask instead of guessing.

## Language

All code, comments, UI copy, docs, and commit messages are in English. Exception: `README.md` is written in neutral Spanish, at the author's request.
