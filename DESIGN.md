---
name: User Posts Explorer
description: A users-and-posts tool dressed as a holiday promo calendar, with numbered pastel candy tiles and one red composer tile on an aqua-mint canvas.
colors:
  canvas-mint: "oklch(0.93 0.045 178)"
  panel-white: "oklch(1 0 0)"
  tomato-red: "oklch(0.55 0.205 28)"
  on-tomato: "oklch(1 0 0)"
  tile-butter: "oklch(0.91 0.07 88)"
  tile-lavender: "oklch(0.84 0.065 290)"
  tile-sky: "oklch(0.89 0.045 235)"
  tile-mint: "oklch(0.87 0.09 165)"
  tile-ink: "oklch(0.2 0.02 260)"
  tile-ink-soft: "oklch(0.36 0.03 260)"
  ink: "oklch(0.2 0.02 260)"
  muted-ink: "oklch(0.48 0.01 260)"
  muted-wash: "oklch(0.97 0 0)"
  hairline: "oklch(0.922 0 0)"
  destructive: "oklch(0.577 0.245 27.325)"
typography:
  numeral-display:
    fontFamily: "Geist Variable, sans-serif"
    fontSize: "6rem"
    fontWeight: 300
    lineHeight: 1
  numeral-tile:
    fontFamily: "Geist Variable, sans-serif"
    fontSize: "4.5rem"
    fontWeight: 300
    lineHeight: 1
  headline:
    fontFamily: "Geist Variable, sans-serif"
    fontSize: "2.25rem"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.025em"
  title:
    fontFamily: "Geist Variable, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 600
    lineHeight: 1.3
  body:
    fontFamily: "Geist Variable, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.625
  label:
    fontFamily: "Geist Variable, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 400
    lineHeight: 1.33
rounded:
  base: "14px"
  chip: "19.6px"
  row: "25.2px"
  tile: "30.8px"
  panel: "28px"
  pill: "9999px"
spacing:
  gap-tight: "4px"
  gap-grid: "12px"
  gap-panel: "16px"
  pad-panel: "20px"
  pad-tile: "20px"
components:
  panel:
    backgroundColor: "{colors.panel-white}"
    rounded: "{rounded.panel}"
    padding: "20px"
  composer-tile:
    backgroundColor: "{colors.tomato-red}"
    textColor: "{colors.on-tomato}"
    rounded: "{rounded.tile}"
    padding: "20px 24px"
  post-tile:
    backgroundColor: "{colors.tile-butter}"
    textColor: "{colors.tile-ink}"
    rounded: "{rounded.tile}"
    padding: "20px"
  user-row:
    backgroundColor: "{colors.panel-white}"
    textColor: "{colors.ink}"
    rounded: "{rounded.row}"
    padding: "8px 12px 8px 8px"
  user-row-hover:
    backgroundColor: "{colors.muted-wash}"
  user-row-selected:
    backgroundColor: "{colors.tomato-red}"
    textColor: "{colors.on-tomato}"
  initial-chip:
    backgroundColor: "{colors.tile-lavender}"
    textColor: "{colors.tile-ink}"
    rounded: "{rounded.chip}"
    size: "40px"
  button-publish:
    backgroundColor: "{colors.on-tomato}"
    textColor: "{colors.tomato-red}"
    rounded: "{rounded.pill}"
    height: "40px"
    padding: "0 20px"
  field-on-tile:
    backgroundColor: "{colors.panel-white}"
    textColor: "{colors.tile-ink}"
    rounded: "{rounded.chip}"
    height: "40px"
  search-field:
    backgroundColor: "{colors.muted-wash}"
    textColor: "{colors.ink}"
    rounded: "{rounded.chip}"
    height: "40px"
---

# Design System: User Posts Explorer

## Overview

**Creative North Star: "The Promo Calendar"**

A utility tool dressed as a holiday promo calendar. Posts become numbered candy tiles and the composer is the one red tile that matters. Two white, deeply rounded panels float on an aqua-mint canvas like phones laid on a table: users on the left, posts on the right, each scrolling on its own. The system rejects the default grey admin list with a single accent.

The mood is cheerful, tactile, and confident, but the layout stays plain and legible. All personality lives in color and one typographic gesture: oversized light numerals ("01", "02") that turn a list of posts into a calendar grid. Everything else is Geist at ordinary sizes with near-black ink. Shadows are limited to one soft lift under each panel. Tiles are flat color.

**Key Characteristics:**
- Aqua-mint canvas with two floating white panels; the canvas is the only large tinted field.
- Four pastel tiles (butter, lavender, sky, mint) cycle by number; one saturated tomato red carries every action and selection.
- Oversized light numerals are the only display gesture.
- Flat tiles, large radii (28px panels, about 31px tiles), no gradients, no hard shadows.
- Motion only on state: 150 to 300 ms transitions, one entrance for a newly published post.

## Colors

A pastel candy family on a cool mint ground, with a single hot red doing all the work of emphasis. Values are OKLCH, matching `src/index.css`.

### Primary
- **Tomato Red** (oklch(0.55 0.205 28)): The composer tile, the selected user row, the user headline, the empty-state prompt, text selection, caret, and focus ring. White text on it measures 5.38:1.

### Secondary
- **Tile Butter** (oklch(0.91 0.07 88)), **Tile Lavender** (oklch(0.84 0.065 290)), **Tile Sky** (oklch(0.89 0.045 235)), **Tile Mint** (oklch(0.87 0.09 165)): The pastel tile family. Always used in this order, indexed by post number (`tileClass`) or user id for initial chips. Ink on every pastel is at least 10.9:1.

### Neutral
- **Canvas Mint** (oklch(0.93 0.045 178)): The page background behind both panels.
- **Panel White** (oklch(1 0 0)): Panel surface and the fields and button sitting on the red tile.
- **Tile Ink** (oklch(0.2 0.02 260)): Text on pastel tiles, body ink, and the toast background. A blue-leaning near-black.
- **Tile Ink Soft** (oklch(0.36 0.03 260)): Post body text on pastel tiles, at least 6.5:1.
- **Muted Ink** (oklch(0.48 0.01 260)): Secondary text on white (emails, subtitle, counts), about 7:1.
- **Muted Wash** (oklch(0.97 0 0)): Row hover, search field fill (at 60%), empty and skeleton surfaces.
- **Hairline** (oklch(0.922 0 0)): Default border color.
- **Destructive** (oklch(0.577 0.245 27.325)): Load-error alerts only, on white panels.

### Named Rules
**The One Red Rule.** Tomato red marks the thing you act on or are in: the composer, the selected user, the headline of that user, and the primary focus ring. No second saturated hue exists, and red never decorates.

**The Tile Cycle Rule.** Pastels cycle butter, lavender, sky, mint by number. Never pick a tile color by meaning or status; the cycle is the whole logic.

**The Red-Tile Inversion Rule.** On the red tile, controls invert to white: white fields, white button with red text, white focus rings, white error text. The theme's destructive red would vanish there, so errors on red are signaled with a white ring and weight, never with red.

## Typography

**Display Font:** Geist Variable (with sans-serif)
**Body Font:** Geist Variable (with sans-serif)

**Character:** One family, two voices. Light (300) enormous numerals read as calendar dates; bold tight headlines and small medium-weight UI text keep the tool functional.

### Hierarchy
- **Numeral Display** (300, 6rem at mobile, 8rem at md, line-height 1): The composer's next-number only.
- **Numeral Tile** (300, 3.75rem at mobile, 4.5rem at md, line-height 1): The post number on each tile; the empty state uses 3rem numerals in 7 to 9rem squares.
- **Headline** (700, 1.875rem, 2.25rem at md, tracking -0.025em, balanced): The selected user's name in Tomato Red. The empty-state prompt uses the same weight at 1.5rem.
- **Title** (600, 1.25rem): The composer's "New post". App title in the sidebar is 600, 1.125rem, tight tracking.
- **Tile heading** (600, 1rem, line-height snug, first letter uppercased): Post titles.
- **Body** (400, 0.875rem, relaxed line-height): Post bodies in Tile Ink Soft, subtitles in Muted Ink. Post body width is capped by tile width, never by a measure setting.
- **Label** (400 to 500, 0.75rem to 0.875rem): User name (500, 0.875rem) and email (0.75rem) in rows, badges, counts with tabular numerals.

### Named Rules
**The Numeral Only Rule.** Large display type is for numerals. Words never get the display treatment beyond the bold headline.

## Layout

A fixed-viewport two-panel app shell: `h-svh` grid with 12px padding and gap on mobile, 16px at md and up. At md the columns are a 20rem sidebar and a flexible right panel. Each panel is `h-full` with its own Radix scroll area, so the two never scroll together. The right panel keeps content in a centered column capped at `max-w-5xl` with 32px padding (20px on mobile) and 24px between sections: back control (mobile only), header, composer, grid.

The post grid is one column on mobile, two from sm, three from 2xl, with 12px gaps. The composer spans full width above it. Sidebar content is a 20px-padded column with 20px between header and list, 4px between rows.

Below md only one panel shows at a time: selecting a user hides the sidebar (kept mounted so the search term survives) and a "Back to users" ghost button appears, returning focus to the row the visitor came from. The empty right panel shows a 2-column sample grid of numbered tiles (the fourth is red) over the prompt.

## Elevation & Depth

Flat by default, with exactly one shadow. Depth is conveyed by tonal layering: white panels over the mint canvas, flat saturated and pastel tiles on white. The only shadow is the panel lift, `0 8px 24px -12px` at 10% black, a soft ground contact that makes the panels read as floating sheets. Tiles, buttons, and fields carry no shadow (`shadow-none`, `ring-0`). The toast alone uses a stock `shadow-lg`.

### Named Rules
**The One Lift Rule.** Only panels lift. A tile that needs emphasis changes color, not elevation.

## Shapes

Soft and generous. Everything derives from a 14px base radius (`--radius: 0.875rem`) scaled by the theme: panels use a fixed 28px (1.75rem), tiles and cards use `rounded-3xl` (about 31px), user rows `rounded-2xl` (about 25px), initial chips, search field, and form fields `rounded-xl` (about 20px), and the publish button and count badge are full pills. Nested shapes step down one rung from their container: tile 31px, chip 20px inside a 25px row. Tiles are borderless solid fills; the only outlined element is the post-count badge.

### Named Rules
**The Step-Down Rule.** A child inside a rounded container uses the next smaller radius rung, never the same one.

## Components

### Panels
- **Shape:** 28px radius, white (oklch(1 0 0)), overflow hidden, with the One Lift shadow.
- **Behavior:** Own scroll area; labeled landmarks ("Users" aside, "Posts" main).

### User Row
Rounded 25px button with a 40px initial chip (pastel by user id, Tile Ink initials) and a two-line name and email block, truncating.
- **Hover:** Muted Wash fill, 200 ms color transition.
- **Selected:** Tomato Red fill, white text, chip turns white; `aria-current` is set.
- **Focus:** 3px ring in Tomato Red at 50%.

### Search Field
Shadcn Input at 40px height, 20px radius, Muted Wash at 60% fill, leading magnifier icon at 16px in Muted Ink. The label is screen-reader only; the placeholder reads "Search by name".

### Composer Tile (signature)
The one red tile. A shadcn Card at 31px radius, Tomato Red fill, white text, no ring or shadow. A header row pairs "New post" with the next-number in 8rem light numerals (animates up on change), then title input and body textarea (4 rows) as white fields in Tile Ink, then a white pill "Publish" button with red text. Errors appear as a white ring plus white medium-weight message; submit failure is a translucent white alert. Pending shows a spinning loader and "Publishing…".

### Post Tile
A shadcn Card, 31px radius, flat pastel fill from the cycle, Tile Ink text. A 4.5rem light numeral top-left, an optional white "New" badge top-right, then a 600 title and Tile Ink Soft body. A newly published tile enters with a 300 ms fade and zoom-in (motion-safe only) and leads the grid.

### Count Badge
Outline shadcn Badge as a pill, 28px high, 0.875rem tabular numerals: "N posts" beside the user headline.

### Loading, Empty, and Error States
- **Loading:** Skeleton rows (40px rounded chip plus two lines) in the sidebar; skeleton cards on Muted Wash at 60% with 31px radius in the grid. Container has `role="status"`.
- **Empty:** A Muted Wash block, centered small Muted Ink text.
- **Error:** shadcn destructive Alert with a title, message, and an outline "Retry" button.

### Toast
Sonner at bottom center, 25px radius, borderless, Tile Ink background with white text and a mint success icon.

## Do's and Don'ts

### Do:
- **Do** keep tomato red (oklch(0.55 0.205 28)) as the only saturated hue, reserved for the composer, selection, the user headline, and focus.
- **Do** cycle the four pastels in order by number and set text on them in Tile Ink or Tile Ink Soft.
- **Do** use large light (300) numerals as the display gesture, padded to two digits.
- **Do** invert controls to white on the red tile, as the composer does.
- **Do** build with the shadcn primitives in `src/components/ui` and restyle through className at the usage site.
- **Do** keep panels independently scrollable and the shell at viewport height.
- **Do** limit transitions to 150 to 300 ms state changes, and wrap entrances in `motion-safe`.

### Don't:
- **Don't** return to a grey admin list with a single accent.
- **Don't** add gradients, hard offset shadows, or shadows on tiles, fields, and buttons.
- **Don't** use destructive red for errors that sit on the red composer tile; it disappears.
- **Don't** use pastel text colors or put Muted Ink on a pastel tile; use Tile Ink Soft.
- **Don't** assign tile colors by status or meaning.
- **Don't** edit shadcn primitives in place.

## Not canonized

Recorded here as build facts so future surfaces do not inherit them: the mobile "Back to users" control uses an arrow icon although the direction specified no arrows; the `.dark` token block, chart-1..5, and sidebar-* tokens are unmodified shadcn defaults that no surface uses (no dark mode is shipped and `.dark` has a neutral primary that does not match this world).
