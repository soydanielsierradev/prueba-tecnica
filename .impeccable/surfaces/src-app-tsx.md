---
version: 1
slug: 'src-app-tsx'
primary_target: 'src/App.tsx'
related_targets:
  ['src/features/users/components/UserList.tsx', 'src/features/posts/components/UserPosts.tsx']
---

# Surface brief — User Posts Explorer (app shell)

Scope: the single app screen (`src/App.tsx` and its feature components). Visitor mode: **Operate**. Build path: code-led (Operate surface; no image generation).

Audience and job: the assessment evaluator, a few minutes, checking search, user posts, validated post creation, and loading/error/empty states, and judging craft.

Constraints: behavior fixed by docs/PRD.md (AC-1…AC-8), all tests keep passing, shadcn components remain the building blocks, WCAG 2.2 AA, UI copy in English.

## Direction contract

THESIS: A users-and-posts tool dressed as a holiday promo calendar: posts become numbered candy tiles and the composer is the one red tile that matters. Refuses the default grey admin list with a single accent.

OWN-WORLD: Aqua-mint canvas; two white, deeply rounded panels floating on it like phones. Pastel tiles cycling butter, lavender, sky, mint, with near-black ink. One saturated tomato red for the composer tile, the user headline, primary actions, and selection. Geist throughout; oversized light numerals ("01") as the only display gesture. No arrows, no gradients, no shadows beyond a soft panel lift.

STORY: The evaluator scans users in the sidebar, searches, picks one, reads that user's numbered posts, and publishes a new one in the red tile; the new post lands first as tile 01-equivalent with a "New" badge.

FIRST VIEWPORT: Desktop: mint canvas, left panel ~20rem full height (app title, search, user rows with pastel initial chips, independent scroll); right panel fills the rest with its own scroll: red bold user-name headline, email · company and post count, then a grid of tiles where the red composer tile leads, followed by pastel post tiles with big numerals. Mobile: one panel at a time with a back control.

FORM: Brief-pinned reference world (promo calendar screens supplied by the user). seed: none (pinned) — user: "quiero que uses impeccable para crear un diseño como el referente, no dejes de usar los componentes de shadcn, además el panel de la izquierda quiero que sea independiente al panel de la derecha con los post, onda un sidebar"; direction confirmed in chat ("Sí, construí eso").

Signature interaction: publishing turns the red composer's next-number into a new pastel tile at the head of the grid, marked "New"; the composer's numeral advances. Motion: 150–250 ms state transitions only.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
