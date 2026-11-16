# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

The primary user is the **evaluator** of a Frontend React technical assessment: a recruiter or tech lead who opens the app for a few minutes to judge quality. Their job is to confirm that every requirement works (search, user posts, validated post creation, loading and error states) and to read the level of craft and care in the details.

## Product Purpose

User Posts Explorer lets a visitor browse the users of the public JSONPlaceholder API, search them by name, read each user's posts, and publish a new post through a validated form. It exists to demonstrate production-grade React + TypeScript work within a 3-hour budget. Success means the evaluator sees every requirement working at first glance and leaves with a clear impression of quality.

## Positioning

A small, complete, carefully finished app rather than a broad one: spec-first documentation, strict TDD, explicit states for every wait and failure, and a polished interface on top of a mock API.

## Operating Context

- Reviewed on a desktop browser first; the layout must also work at phone width.
- Data comes from `https://jsonplaceholder.typicode.com` (10 users, 10 posts each). `POST /posts` does not persist and always returns `id: 101`; created posts live in the TanStack Query cache for the session.
- Post titles and bodies are Latin placeholder text from the API.
- The evaluator also reads the repository: `docs/`, commits, tests, and the README.

## Capabilities and Constraints

- Functionality is fixed by `docs/PRD.md` (FR-1…FR-5, AC-1…AC-8). A redesign must not change behavior, and all existing tests must keep passing.
- Users and posts are two independent areas: the users list behaves as an independent sidebar, and the posts area scrolls and changes on its own.
- Stack is fixed by `CLAUDE.md` and `docs/TRD.md`: React, TypeScript, Tailwind CSS v4, shadcn/ui (radix-nova preset), React Hook Form + Zod, TanStack Query. shadcn components must remain the building blocks; no new UI libraries.
- UI copy is in English (project rule in `CLAUDE.md`).

## Brand Commitments

None established. There is no logo or brand identity; the product name is "User Posts Explorer".

## Evidence on Hand

- Real data only from JSONPlaceholder. No testimonials, metrics, or imagery exist and none may be invented.

## Product Principles

1. Every requirement is visible and working without explanation.
2. State is always visible: loading, empty, error, and success each have a dedicated UI.
3. Craft shows in the details, not in extra features beyond the PRD.
4. Forgiving interactions: specific errors, input is never lost.

## Accessibility & Inclusion

WCAG 2.2 AA: text and UI contrast, full keyboard navigation, visible focus, labelled controls, and announced status/alert regions.
