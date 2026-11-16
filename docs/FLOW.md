# FLOW — User Posts Explorer

How the user moves through the app and what happens in the code at each step. Requirements come from [PRD.md](./PRD.md), screens from [UI-UX.md](./UI-UX.md), and technical pieces from [TRD.md](./TRD.md).

## 1. Journey map

```
                ┌──────────────┐
   open app ──▶ │ Loading users│──fail──▶ [Users error] ──Retry──┐
                └──────┬───────┘                                 │
                       │ ok                                      │
                       ▼                                         │
                ┌──────────────┐◀────────────────────────────────┘
                │  Users list  │◀──type──▶ filtered list / "No users match"
                └──────┬───────┘
                       │ click user
                       ▼
                ┌──────────────┐
                │Loading posts │──fail──▶ [Posts error] ──Retry──┐
                └──────┬───────┘                                 │
                       │ ok                                      │
                       ▼                                         │
                ┌──────────────┐◀────────────────────────────────┘
                │ User posts   │──click another user──▶ Loading posts (or cache hit)
                │ + PostForm   │──(mobile) Back──▶ Users list (search kept)
                └──────┬───────┘
                       │ submit
          ┌────────────┼──────────────────┐
          ▼ invalid    ▼ valid            │
   field errors   Publishing…             │
   (no request)        │                  │
                 ok ───┴─── fail          │
                 ▼          ▼             │
   post on top + toast   inline error,    │
   form reset            input kept ──────┘ (user retries)
```

## 2. Flows step by step

### F1 — Open the app

1. `main.tsx` renders `<App />` inside `QueryClientProvider` and `<Toaster />` (sonner).
2. `App` renders the layout; `selectedUser` starts as `null`.
3. `UserList` mounts → `useUsers()` → `useQuery({ queryKey: ['users'], queryFn: getUsers })`.
4. While `isPending`: users pane shows `LoadingState` ("Loading users"). Posts pane (desktop) shows "Select a user to see their posts".
5. On success: render `UserSearch` + the list of users.
6. On error: render `ErrorState` "Couldn't load users" → see F6.

### F2 — Search users

1. User types in `UserSearch` (`type="search"`).
2. `onChange` updates `searchTerm` (`useState` in `UserList`).
3. During render: `visibleUsers = filterUsers(users, searchTerm)` (case-insensitive substring on `name`, empty term returns all).
4. If `visibleUsers` is empty → show `No users match "<term>"`.
5. Clearing the input (or `Esc`) shows the full list again.
6. No network request is made; the term does not affect `selectedUser`.

### F3 — Select a user

1. User clicks (or presses `Enter`/`Space` on) a user item.
2. `onSelect(user)` → `App` sets `selectedUser = user`. If it is the same user, nothing happens.
3. Selected item gets `aria-current="true"` and the accent background.
4. `UserPosts` renders for `selectedUser` → `usePosts(user.id)` → `useQuery({ queryKey: ['posts', user.id], queryFn: () => getUserPosts(user.id) })`.
5. **Cache miss:** show the user header (name/email from the `User` already in memory) + `LoadingState` ("Loading posts"), then the posts.
6. **Cache hit** (user visited before): posts render immediately, including any posts created locally earlier (`staleTime: Infinity`).
7. **Mobile:** the list is hidden and the posts view is shown; focus moves to the posts header.
8. On error → `ErrorState` "Couldn't load posts" → see F6.

### F4 — Go back (mobile only)

1. User taps `← Back to users`.
2. `App` sets `selectedUser = null`; the list is shown again.
3. `searchTerm` survives because the search state lives in `UserList`, which on mobile is hidden with CSS (not unmounted).

### F5 — Create a post

1. User fills **Title** and **Body** in `PostForm` (React Hook Form, `zodResolver(postSchema)`).
2. User clicks **Publish** or presses `Enter` in the title field.
3. `form.handleSubmit` runs the Zod schema:
   - **Invalid** → `FieldError` shows "Title is required" / "Body is required"; focus goes to the first invalid field; **no request is sent**. From now on, errors re-validate on change.
   - **Valid** → `onValid({ title, body })` with trimmed values.
4. `createPost.mutate({ title, body, userId: selectedUser.id })` → `POST /posts`.
5. While `isPending`: button disabled, `Loader2` icon, label "Publishing…". Inputs stay editable but a double submit is impossible.
6. **Success (`onSuccess`)**:
   1. Build the local post: `{ ...response, id: crypto.randomUUID(), isLocal: true }` (the API always returns `id: 101`).
   2. `queryClient.setQueryData(['posts', userId], (old = []) => [localPost, ...old])`.
   3. `form.reset()` and focus back to the title input.
   4. `toast.success('Post published')`.
   5. The new post appears first, marked with a "New" badge; the posts count badge goes up by one.
7. **Failure (`onError`)**: inline `Alert` "Couldn't publish the post. Please try again."; the form is **not** reset. Submitting again clears the alert and retries.

### F6 — Retry after a failed fetch

1. `ErrorState` shows the message and a **Retry** button.
2. Click → `refetch()` from the failed query.
3. The pane returns to its loading state, then goes to success or error again.
4. In the app, TanStack Query already retried once (`retry: 1`) before showing the error.

### F7 — Switch users while a request is in flight

1. User selects user A, then user B before A's posts arrive.
2. Each user has its own query key (`['posts', A]`, `['posts', B]`), so B's view never shows A's data.
3. A's response is still cached when it arrives, so going back to A is instant.

### F8 — Submit, then switch users before the response

1. The mutation captured `userId` when it was called.
2. `onSuccess` updates `['posts', thatUserId]`, not the currently selected user, so the post lands in the right list.

## 3. State ↔ UI matrix

| Area       | State               | What the user sees                 | Possible actions                 |
| ---------- | ------------------- | ---------------------------------- | -------------------------------- |
| Users pane | pending             | Skeleton rows                      | —                                |
| Users pane | error               | Destructive alert + Retry          | Retry                            |
| Users pane | success, matches    | Search + user buttons              | Type, select                     |
| Users pane | success, no matches | Search + "No users match"          | Edit or clear search             |
| Posts pane | no selection        | "Select a user…" (desktop only)    | Select a user                    |
| Posts pane | pending             | User header + skeleton cards       | Select another user              |
| Posts pane | error               | User header + alert + Retry        | Retry, select another user       |
| Posts pane | success             | Header, form, posts                | Create post, select another user |
| Post form  | idle                | Empty fields, Publish enabled      | Type, submit                     |
| Post form  | invalid             | Field errors                       | Fix fields, resubmit             |
| Post form  | submitting          | Disabled "Publishing…" button      | Wait                             |
| Post form  | error               | Inline alert, input kept           | Resubmit                         |
| Post form  | success             | Toast, form reset, new post on top | Write another                    |

## 4. Component wiring

```
main.tsx
└─ QueryClientProvider + Toaster
   └─ App                       state: selectedUser
      ├─ UserList               useUsers(), state: searchTerm
      │  ├─ UserSearch          props: value, onChange
      │  ├─ LoadingState / ErrorState
      │  └─ UserListItem[]      props: user, isSelected, onSelect
      └─ UserPosts              props: author (PostAuthor ← User), onBack · usePosts(author.id)
         ├─ LoadingState / ErrorState
         ├─ PostForm            props: userId · useCreatePost(), useForm()
         └─ PostList            props: posts
```

Data flows **down** as props; events flow **up** through callbacks (`onSelect`, `onBack`). The only shared data channel between features is the TanStack Query cache.
