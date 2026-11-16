# UI/UX — User Posts Explorer

Visual and interaction spec for the app in [PRD.md](./PRD.md), built with Tailwind CSS v4 + shadcn/ui as defined in [TRD.md](./TRD.md).

## 1. Product feel

Calm, clean, and fast. It should feel like a well-made internal tool: neutral colors, generous whitespace, no decoration that does not carry information. Every wait and every failure is visible and explained; the user is never left staring at a blank area.

**Principles**

1. **State is always visible** — loading, empty, error, and success each have a dedicated UI.
2. **One screen, two panes** — the list never disappears on desktop, so switching users is one click.
3. **Forgiving forms** — errors are specific, appear next to the field, and never wipe what was typed.
4. **Accessible by default** — keyboard-first, real labels, visible focus rings (shadcn provides these).

## 2. Visual style

| Token       | Value                                                                                                                                                                 |
| ----------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Theme       | shadcn `radix-nova` preset, **neutral** base color, light mode only                                                                                                   |
| Typography  | Geist Variable (Nova preset, self-hosted via `@fontsource-variable/geist`); `text-sm` for body, `text-xl font-semibold` for page title, `font-medium` for card titles |
| Radius      | shadcn default `--radius` (0.625rem)                                                                                                                                  |
| Spacing     | Tailwind scale; `gap-4`/`p-4` inside panes, `gap-6` between panes                                                                                                     |
| Color usage | `muted-foreground` for secondary text (email, body preview); `destructive` only for errors; `primary` for the main action and the selected user                       |
| Icons       | lucide-react, `size-4`, used sparingly: `Search`, `Users`, `FileText`, `AlertCircle`, `RotateCw`, `Loader2`, `ArrowLeft`                                              |

Dark mode is out of scope (see "more time" in the README).

## 3. Layout

### Desktop (≥ `md`, 768px)

```
┌───────────────────────────────────────────────────────────────┐
│  Header: "User Posts Explorer"                                │
├──────────────────────┬────────────────────────────────────────┤
│  USERS (w-80)        │  POSTS                                 │
│  [🔍 Search by name] │  Leanne Graham · Sincere@april.biz     │
│                      │  ┌──────────────────────────────────┐  │
│  ▸ Leanne Graham  ◀  │  │ New post                         │  │
│    Ervin Howell      │  │ Title  [______________________]  │  │
│    Clementine Bauch  │  │ Body   [______________________]  │  │
│    ...               │  │                     [Publish]    │  │
│                      │  └──────────────────────────────────┘  │
│                      │  ┌──────────────────────────────────┐  │
│                      │  │ Post title                       │  │
│                      │  │ Post body...                     │  │
│                      │  └──────────────────────────────────┘  │
└──────────────────────┴────────────────────────────────────────┘
```

- Grid: `md:grid-cols-[20rem_1fr]`, max width `max-w-6xl mx-auto`.
- Left pane scrolls independently (`ScrollArea` or `overflow-y-auto`) so a long list does not push the posts away.

### Mobile (< `md`)

Single column. Shows **either** the list **or** the selected user's posts.

- Selecting a user swaps to the posts view.
- The posts view shows a `← Back to users` ghost button at the top.
- Search term is preserved when going back.

## 4. Screens and states

### 4.1 Users pane

| State      | UI                                                                                                                                             |
| ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| Loading    | 6 `Skeleton` rows (avatar-sized circle + two text lines), wrapped in `role="status"` with `aria-label="Loading users"`                         |
| Error      | `Alert variant="destructive"` with `AlertCircle`, title "Couldn't load users", the error message, and an outline `Button` "Retry" (`RotateCw`) |
| Loaded     | Search `Input` (with `Search` icon) + list of user buttons                                                                                     |
| No matches | Muted text centered: `No users match "<term>"`                                                                                                 |

**User item:** a full-width ghost `Button`-like row showing **name** (`font-medium`) and **email** (`text-muted-foreground text-xs`). Selected item uses `bg-accent` and `aria-current="true"`.

### 4.2 Posts pane

| State                      | UI                                                                                             |
| -------------------------- | ---------------------------------------------------------------------------------------------- |
| No user selected (desktop) | Centered empty state: `Users` icon + "Select a user to see their posts"                        |
| Loading                    | Header with the user's name (already known) + 3 `Skeleton` cards, `aria-label="Loading posts"` |
| Error                      | Same `ErrorState` pattern: "Couldn't load posts" + Retry                                       |
| Loaded                     | User header → `PostForm` card → list of post `Card`s, newest first                             |
| Loaded, zero posts         | Form + muted text "This user has no posts yet"                                                 |

**User header:** name (`text-lg font-semibold`), email and company name in muted text, post count `Badge` ("10 posts").

**Post card:** `Card` with `CardHeader` → `CardTitle` (title, first letter capitalized via CSS) and `CardContent` → body in `text-sm text-muted-foreground`. A post created locally shows a small `Badge variant="secondary"` "New" so the user sees it landed.

### 4.3 Post form

Inside a `Card` titled "New post", placed above the list so the result of submitting is immediately visible below it.

Built with shadcn `Field` (`FieldGroup` → `Field` → `FieldLabel` + control + `FieldError`) wired to React Hook Form `Controller` + Zod. (The `radix-nova` registry no longer ships the old `form` component.)

| Element      | Component                                     | Details                                                                                                                                  |
| ------------ | --------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| Title        | `Controller name="title"` + `Input`           | Placeholder "Give your post a title"                                                                                                     |
| Body         | `Controller name="body"` + `Textarea`         | 4 rows, placeholder "What do you want to say?"                                                                                           |
| Field error  | `FieldError`                                  | Renders the Zod message in `text-destructive`; set `data-invalid` on `Field` and `aria-invalid` on the control from `fieldState.invalid` |
| Submit       | `Button` "Publish"                            | While pending: `disabled`, `Loader2` spinning icon, label "Publishing…"                                                                  |
| Submit error | `Alert variant="destructive"` inside the card | "Couldn't publish the post. Please try again." Inputs keep their values                                                                  |
| Success      | `Sonner` toast "Post published"               | Form clears, focus returns to the title input, the new post appears first in the list                                                    |

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
- **Focus:** after selecting a user on mobile, focus moves to the posts header so screen readers announce the change.
- **Motion:** only shadcn defaults (skeleton pulse, spinner). No custom animations.

## 7. Copy

All UI text in English, short and plain. Errors say what failed and what to do ("Couldn't load users" + "Retry"), never raw HTTP codes as the headline (the status can appear as secondary text).
