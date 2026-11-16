# PRD — User Posts Explorer

## 1. Overview

A small single-page web app that lets a visitor browse users, read their posts, and draft new posts. It consumes the public JSONPlaceholder API (`https://jsonplaceholder.typicode.com`), which acts as a read-only mock backend.

**Context:** technical assessment for a Frontend React position. Time budget: **3 hours max**. The goal is to demonstrate clean React + TypeScript, sensible state handling, tests, and clear communication — not feature breadth.

## 2. Goals

- Show a searchable list of users.
- Show a selected user's posts.
- Let the visitor create a new post through a validated form.
- Make loading and error states explicit everywhere data is fetched.
- Ship with automated tests and a README that explains decisions and AI usage.

## 3. Non-goals

- Authentication, user accounts, or permissions.
- Real persistence (the API fakes writes; new posts live only in memory).
- Editing or deleting posts.
- Comments, albums, todos, or any other JSONPlaceholder resource.
- Pagination, i18n, dark mode, or offline support.

## 4. Users

A single anonymous visitor. No roles.

## 5. Functional requirements

### FR-1 — User list

- On load, fetch all users (`GET /users`) and display them.
- Each item shows at least the user's **name** (plus email or username as secondary info).
- Selecting a user opens that user's posts view.

### FR-2 — Search by name

- A text input filters the user list by **name**, case-insensitive, matching any substring.
- Filtering is client-side over the already-fetched list.
- When no user matches, show an explicit empty message (e.g. "No users match 'xyz'").

### FR-3 — User posts

- Fetch the selected user's posts (`GET /users/:id/posts`).
- Display each post's **title** and **body**.
- Show which user is selected and provide a way back to the list.

### FR-4 — Create post

- A form with two fields: **title** and **body**.
- Both fields are **required**; whitespace-only values are invalid.
- Validation errors are shown next to the relevant field and the form is not submitted.
- On submit, send `POST /posts` with `{ title, body, userId }`.
- On success, the new post appears **at the top** of the selected user's list and the form resets.
- While submitting, the submit button is disabled to prevent double submits.
- If the request fails, show an error message and keep the user's input.

### FR-5 — Loading and error states

- Every fetch (users, posts) shows a visible loading indicator.
- Every failed fetch shows a visible error message with a **retry** action.
- Post creation shows its own pending and error feedback (see FR-4).

## 6. Acceptance criteria

| ID   | Given                   | When                              | Then                                                                     |
| ---- | ----------------------- | --------------------------------- | ------------------------------------------------------------------------ |
| AC-1 | The app loads           | Users are being fetched           | A loading indicator is visible                                           |
| AC-2 | Users loaded            | I type "leanne"                   | Only "Leanne Graham" is listed                                           |
| AC-3 | Users loaded            | I type a name that matches nobody | An empty-state message is shown                                          |
| AC-4 | The users request fails | —                                 | An error message and a retry button are shown                            |
| AC-5 | I select a user         | Posts load                        | That user's posts are listed                                             |
| AC-6 | Post form is empty      | I submit                          | "Title is required" and "Body is required" are shown; no request is sent |
| AC-7 | Form is valid           | I submit and the API succeeds     | The new post appears first in the list and the form clears               |
| AC-8 | Form is valid           | I submit and the API fails        | An error is shown and my input is preserved                              |

## 7. Known API constraints

- JSONPlaceholder does **not** persist writes: `POST /posts` always returns `id: 101`. Created posts must be stored client-side and given a unique local id to avoid key collisions.
- Navigating away and back to a user refetches posts from the API, so locally created posts may be lost unless kept in app state. Keeping them for the session is a nice-to-have, not a requirement.

## 8. Deliverables

1. Source code (React + TypeScript).
2. At least 3 tests (Vitest + Testing Library).
3. `README.md`: how to run, decisions, what I'd do with more time, how AI was used.
4. Incremental git history (no single "everything" commit).
