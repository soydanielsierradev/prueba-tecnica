# UI/UX — User Posts Explorer

Visual and interaction spec for the app in [PRD.md](./PRD.md), built with Tailwind CSS v4 + shadcn/ui as defined in [TRD.md](./TRD.md). Exact tokens, type scale, radii, and named design rules live in [DESIGN.md](../DESIGN.md), which is generated from the shipped build; this document describes screens, states, and interactions.

## 1. Product feel

A users-and-posts tool dressed as a holiday promo calendar: posts are numbered candy tiles, and the composer is the one red tile that matters. Playful in color, precise in behavior. Every wait and every failure is visible and explained; the user is never left staring at a blank area.

**Principles**

1. **State is always visible** — loading, empty, error, and success each have a dedicated UI.
2. **Two independent panels** — the users sidebar and the posts panel scroll on their own, so reading posts never loses your place in the list.
3. **Forgiving forms** — errors are specific, appear next to the field, and never wipe what was typed.
4. **Accessible by default** — WCAG 2.2 AA contrast, keyboard-first, real labels, visible focus, managed focus on mobile.

## 2. Visual style

Summary only; see [DESIGN.md](../DESIGN.md) for the values.

| Aspect     | Decision                                                                                                                         |
| ---------- | -------------------------------------------------------------------------------------------------------------------------------- |
| Canvas     | Aqua-mint ground with two white, deeply rounded panels floating on it                                                            |
| Color      | Pastel tile family (butter, lavender, sky, mint) with near-black ink; one tomato red for the composer, headline, selection, logo |
| Typography | Geist Variable only; light oversized numerals as the single display gesture; bold red headline for the selected user             |
| Shape      | Large radii (panels ~28px, tiles ~31px), pill buttons and badges, flat tiles; the only shadow is the soft panel lift             |
| Logo       | 2×2 tile grid "01 02 03 04" (the fourth tile red), used in the sidebar, the empty state, the favicon, and the README             |
| Icons      | lucide-react, `size-4`, used sparingly: `Search`, `AlertCircle`, `RotateCw`, `Loader2`, `ArrowLeft`                              |

No arrows on post tiles: posts are not clickable, so an arrow would promise an action that does not exist. Dark mode is out of scope (see "more time" in the README).

## 3. Layout

### Desktop (≥ `md`, 768px)

```
 mint canvas
┌────────────────────┐ ┌──────────────────────────────────────────┐
│ [logo] User Posts  │ │  Leanne Graham            (red, bold)    │
│        Explorer    │ │  Sincere@april.biz · Romaguera-Crona  10 posts
│ [🔍 Search by name]│ │  ┌──────────── red composer ───────────┐ │
│ (LG) Leanne Graham │ │  │ New post                         11 │ │
│ (EH) Ervin Howell  │ │  │ Title [____________________]        │ │
│ (CB) Clementine…   │ │  │ Body  [____________________]        │ │
│  …                 │ │  │ (Publish)                           │ │
│                    │ │  └─────────────────────────────────────┘ │
│  own scroll        │ │  ┌── 01 butter ──┐ ┌── 02 lavender ─┐    │
│                    │ │  │ title / body  │ │ title / body   │    │
└────────────────────┘ └──────────────────────────────────────────┘
```

- Grid: `h-svh`, `md:grid-cols-[20rem_1fr]`; each panel is a shadcn `ScrollArea` with its own scroll.
- The posts panel's `ScrollArea` is keyed by user, so switching users starts at the top.
- Post tiles: 1 column on mobile, 2 from `sm`, 3 from `2xl`.

### Mobile (< `md`)

Single panel at a time: the users sidebar **or** the selected user's posts.

- Selecting a user swaps to the posts panel and moves focus to the user's name.
- The posts panel shows a `Back to users` ghost button at the top; going back refocuses the user row.
- The sidebar stays mounted (hidden with CSS), so the search term is preserved.

## 4. Screens and states

### 4.1 Users pane

| State      | UI                                                                                                                                             |
| ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| Loading    | 6 `Skeleton` rows (rounded chip + two text lines), wrapped in `role="status"` with `aria-label="Loading users"`                                |
| Error      | `Alert variant="destructive"` with `AlertCircle`, title "Couldn't load users", the error message, and an outline `Button` "Retry" (`RotateCw`) |
| Loaded     | Search `Input` (with `Search` icon) + list of user buttons                                                                                     |
| No matches | Muted text centered: `No users match "<term>"`                                                                                                 |

**User item:** a full-width row button with a pastel initials chip (decorative, `aria-hidden`), **name** (`font-medium`) and **email**. The selected item turns red with white text and `aria-current="true"`.

### 4.2 Posts pane

| State                      | UI                                                                                              |
| -------------------------- | ----------------------------------------------------------------------------------------------- |
| No user selected (desktop) | Large logo + bold red prompt "Select a user to see their posts"                                 |
| Loading                    | Header with the user's name (already known) + 4 skeleton tiles (`LoadingState variant="cards"`) |
| Error                      | Same `ErrorState` pattern: "Couldn't load posts" + Retry                                        |
| Loaded                     | User header → red composer tile → grid of numbered pastel post tiles                            |
| Loaded, zero posts         | Composer + muted panel "This user has no posts yet"                                             |

**User header:** name as a bold red headline (`h2`), email · company in muted text, post count `Badge` ("1 post" / "10 posts").

**Post tile:** shadcn `Card` in the pastel cycle with a large light numeral (decorative, `aria-hidden`), the title as `h3` (first letter capitalized via CSS), and the body in soft ink. Posts are numbered in writing order: API posts 01–10, posts created this session continue the count (11, 12…) even though they are shown first. A local post shows a white "New" badge.

### 4.3 Post form (red composer tile)

A red `Card` titled "New post" with the next post number as a large white numeral, placed above the tiles so the result of submitting is immediately visible below it.

Built with shadcn `Field` (`FieldGroup` → `Field` → `FieldLabel` + control + `FieldError`) wired to React Hook Form `Controller` + Zod. (The `radix-nova` registry no longer ships the old `form` component.)

| Element      | Component                             | Details                                                                                                           |
| ------------ | ------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| Title        | `Controller name="title"` + `Input`   | White field on red, placeholder "Give your post a title"                                                          |
| Body         | `Controller name="body"` + `Textarea` | 4 rows, placeholder "What do you want to say?"                                                                    |
| Field error  | `FieldError`                          | White, medium-weight Zod message (red would vanish on the tile); `data-invalid` + `aria-invalid` and a white ring |
| Submit       | `Button` "Publish"                    | White pill with red text. While pending: `disabled`, spinning `Loader2`, label "Publishing…"                      |
| Submit error | `Alert` inside the tile               | Translucent white alert: "Couldn't publish the post. Please try again." Inputs keep their values                  |
| Success      | `Sonner` toast "Post published"       | Ink-colored toast; form clears, focus returns to the title input, the new post appears first                      |

**Validation timing:** validate on submit (`mode: 'onSubmit'`). After the first failed submit, re-validate on change (`reValidateMode: 'onChange'`) so errors disappear as soon as the user fixes them (no nagging before they try).

## 5. shadcn components to install

```
npx shadcn@latest add button input textarea label card skeleton alert badge sonner scroll-area field
```

Install `react-hook-form`, `zod`, and `@hookform/resolvers` separately (`field` does not pull them in).

## 6. Interaction details

- **Search:** filters on every keystroke (list is 10 items, no debounce needed). Input has `type="search"` so `Esc`/clear button works natively.
- **Selection:** clicking the already-selected user does nothing (no refetch, cache is fresh).
- **Keyboard:** Tab reaches search → user buttons → form fields → Publish. `Enter` in the title input submits; in the textarea it inserts a newline.
- **Focus:** on mobile, selecting a user focuses the posts heading; `Back to users` refocuses that user's row.
- **Motion:** one authored moment, gated by `prefers-reduced-motion`: a freshly published tile settles into the grid and the composer numeral advances. Otherwise only shadcn defaults (skeleton pulse, spinner).

## 7. Copy

All UI text in English, short and plain. Errors say what failed and what to do ("Couldn't load users" + "Retry"), never raw HTTP codes as the headline (the status can appear as secondary text).
