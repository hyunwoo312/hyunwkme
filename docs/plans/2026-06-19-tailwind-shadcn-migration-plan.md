# Tailwind v4 + shadcn/ui Migration Plan

Date: 2026-06-19

> **Supersedes** `docs/plans/2026-06-10-scss-shadcn-transition-design.md` and
> `docs/plans/2026-06-10-scss-shadcn-transition-implementation-plan.md`, which
> deliberately chose **not** to adopt Tailwind and used a hand-rolled
> "shadcn-style" SCSS layer instead. This plan reverses that decision: the
> project now adopts real Tailwind CSS v4 and real shadcn/ui primitives. The
> earlier SCSS work is the *starting point* this plan builds on, not wasted
> effort — it produced the structured style folders and the `ui/` component
> seams we will convert.

---

## Goal

Migrate the portfolio's styling architecture from SCSS to **Tailwind CSS v4**,
and replace the hand-rolled `src/components/ui/*` wrappers with **real
shadcn/ui** primitives, using a **hybrid** strategy:

- Tailwind utilities own layout, spacing, typography, color, and simple state.
- shadcn/ui owns the reusable primitives that genuinely map (Button, Badge,
  Card, and Tooltip/Dialog only if a real need appears).
- **Bespoke CSS stays bespoke.** Animations, the geometric mesh, the hero
  signature SVG draw, the intro boot sequence, masks/filters, and the
  responsive choreography remain authored CSS (in Tailwind `@layer`), because
  utility classes are a worse tool for those.

This is a modernization of the styling stack. It is **not** a rewrite of the
site's behavior or content.

## Decisions locked with the owner (2026-06-19)

1. **Scope: Hybrid.** Do not attempt a "pure utilities" rewrite of the
   animation/effect CSS (~70% of current SCSS volume).
2. **Fidelity: Migrate, then refine.** The owner is open to design
   refinements. To keep verification tractable, this plan does the migration
   **pixel-identical first** (Phases 1–5), verifies it, and only then does an
   **explicitly separated refinement pass** (Phase 6). Architecture changes
   and visual changes must not land in the same commit.
3. **Process: Plan-first.** This document is reviewed before any code changes.

## Why this is lower-risk than it looks

A scan of `src/styles/**` shows the current SCSS uses **no Sass-specific
features**: 0 `$variables`, 0 `@mixin`/`@include`, 1 `&`. Design tokens are
already CSS custom properties in `:root`. `@use` is being used only to
concatenate files. Native CSS nesting (supported by Vite's Lightning CSS and
Tailwind v4) covers the existing nesting.

Consequence: **dropping `sass` is mechanical.** `.scss` → `.css`, `@use
'./x.scss'` → `@import './x.css'` (or fold into `@layer`), and the cascade is
preserved. This is the single most important de-risking fact in the plan.

---

## Target tech stack

| Concern            | Today                          | After migration                          |
| ------------------ | ------------------------------ | ---------------------------------------- |
| CSS compiler       | `sass` (Dart Sass)             | Tailwind v4 via `@tailwindcss/vite`      |
| Utility classes    | none                           | Tailwind v4 utilities                    |
| Class merge helper | `cn()` = `join`                | `cn()` = `clsx` + `tailwind-merge`       |
| UI primitives      | hand-rolled `ui-*` SCSS shells | shadcn/ui (CVA + Radix where applicable) |
| Path alias         | relative imports               | `@/*` → `src/*`                          |
| Theme tokens       | `:root` custom properties      | `@theme` + shadcn variable contract      |
| Bespoke effects    | SCSS partials                  | authored CSS in `@layer`                 |

New dependencies: `tailwindcss@^4`, `@tailwindcss/vite@^4`, `clsx`,
`tailwind-merge`, plus whatever shadcn pulls in per primitive (`@radix-ui/*`,
`class-variance-authority`, `lucide-react` is already present). Removed:
`sass`.

> **Version note:** Before installing, confirm current Tailwind v4 + shadcn
> guidance with the `documentation-lookup` skill (Context7) rather than
> assuming flags — shadcn's React 19 / Vite / Tailwind v4 setup details and
> peer-dep handling change between releases.

---

## Phase 0 — Baseline & safety net

- [ ] Confirm clean tree and current build:
  ```sh
  git status
  npm run check
  ```
- [ ] Capture **before** reference screenshots (manual, owner-driven) at the
  five breakpoints used in the prior plan: **1440 / 1024 / 768 / 430 / 375**.
  These are the ground truth for "pixel-identical" verification in Phases 1–5.
- [ ] Create the working branch:
  ```sh
  git checkout -b feature/tailwind-shadcn-migration
  ```

**No code change. No commit.**

---

## Phase 1 — Tooling: add Tailwind v4, path alias, drop sass-as-compiler

Goal: Tailwind is installed and producing output, the `@/` alias works, and the
**existing styles still render identically** because they are imported as plain
CSS through Tailwind's pipeline. shadcn is **not** added yet.

- [ ] Install Tailwind v4 + the helpers, remove sass:
  ```sh
  npm install tailwindcss @tailwindcss/vite clsx tailwind-merge
  npm uninstall sass
  ```
- [ ] Add the Vite plugin (`vite.config.ts`):
  ```ts
  import tailwindcss from '@tailwindcss/vite'
  // plugins: [react(), tailwindcss()]
  ```
- [ ] Add the `@/*` alias in **both** `vite.config.ts` (`resolve.alias`) and
  `tsconfig.json` (`compilerOptions.paths` + `baseUrl`). Verify one import
  rewrites cleanly (e.g. `@/lib/cn`).
- [ ] Convert the style entry to a Tailwind CSS entry. Rename
  `src/styles/index.scss` → `src/styles/index.css`, and at the top add:
  ```css
  @import 'tailwindcss';
  ```
  Replace each `@use './x.scss'` with `@import './x.css'` (see Phase 2 for the
  file renames). Keep **`responsive.css` imported last**.
- [ ] Update `src/App.tsx`: `import './styles/index.scss'` →
  `import './styles/index.css'`.
- [ ] Verify and commit:
  ```sh
  npm run check
  git add -A && git commit -m "build: add tailwind v4, drop sass, add @/ alias"
  ```

**Verification:** site renders identically; Tailwind utility (test one, e.g.
`class="hidden"`) takes effect; `npm run check` is green.

---

## Phase 2 — Mechanical SCSS → CSS conversion

Goal: every `.scss` becomes `.css` with native nesting. **No selector or
declaration changes.** Pure rename + import-path update.

- [ ] `git mv` each partial, dropping the leading underscore is optional but
  recommended for plain-CSS clarity (`_hero.scss` → `hero.css`). Update the
  `@import` graph in `src/styles/index.css` to match, order unchanged,
  `responsive.css` still last.
- [ ] Confirm `src/index.css` (the reset, imported by `main.tsx`) — leave as-is
  or fold into the Tailwind entry; keep it a separate file this phase.
- [ ] Convert the `@import url('...fonts...')` at the top of `_tokens.scss` per
  Tailwind v4 conventions (CSS `@import` for fonts must precede
  `@import 'tailwindcss'`, or move font loading to `index.html` `<link>` —
  decide and document the choice in the commit).
- [ ] Verify and commit:
  ```sh
  npm run check
  git add -A && git commit -m "refactor: convert scss to plain css (no visual change)"
  ```

**Verification:** identical render; no `.scss` files remain; `npm run check`
green. This phase is a no-op visually by construction.

---

## Phase 3 — Theme tokens: Tailwind `@theme` + shadcn variable contract

Goal: the existing design tokens are expressed in Tailwind v4's theme so
utilities (`bg-base`, `text-ink`, `rounded-soft`, etc.) and shadcn primitives
both read from one source.

- [ ] In the Tailwind entry, define `@theme` mapping the current tokens:
  - `--bg-base`, `--ink`, `--ink-light`, `--jelly-blue|pink|purple`,
    `--star-gold`, `--glass-bg`, `--glass-border`, `--radius-pill`,
    `--radius-soft`, `--font-display`, `--font-mono`.
- [ ] Add the shadcn variable contract (`--background`, `--foreground`,
  `--primary`, `--border`, `--ring`, `--radius`, etc.) **mapped onto the
  existing palette** so shadcn components inherit the site's look rather than
  shadcn defaults. Keep the original token names too — existing CSS still
  references them.
- [ ] Verify and commit:
  ```sh
  npm run check
  git add -A && git commit -m "feat: express design tokens via tailwind @theme"
  ```

**Verification:** identical render (tokens resolve to the same values); a spot
check that a Tailwind theme utility yields the expected color.

---

## Phase 4 — Introduce real shadcn/ui primitives

Goal: replace the hand-rolled `ui/` wrappers with genuine shadcn components,
one primitive at a time, each behind the existing call sites.

- [ ] Upgrade `src/lib/cn.ts` to `clsx` + `tailwind-merge`:
  ```ts
  import { clsx, type ClassValue } from 'clsx'
  import { twMerge } from 'tailwind-merge'
  export function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)) }
  ```
  (Signature stays compatible with all current callers.)
- [ ] `npx shadcn@latest init` — accept the Vite + Tailwind v4 config, point it
  at the `@/` alias and the Tailwind entry. Review the generated
  `components.json` and confirm it does **not** clobber existing theme tokens.
- [ ] Migrate primitives in this order (lowest-risk first), replacing the
  matching `ui-*` SCSS with Tailwind-styled shadcn components and rewiring
  callers. Keep behavior identical (focus rings, keyboard, `asChild` where the
  current code renders anchors):
  1. **Badge** — `src/components/ui/badge.tsx`; callers in `Hero`, `Projects`,
     `ExperienceTimeline` (`square`/`pill` → shadcn variants via CVA).
  2. **Button** — `src/components/ui/button.tsx`; nav controls in `FloatingNav`.
  3. **LinkButton** — anchor-based pill; map to shadcn `Button` with
     `asChild` + `<a>` (hero actions, nav contacts, project links). This is the
     highest-traffic primitive; migrate its three call-site families in
     separate commits.
  4. **Card** — replace `card-surface.tsx`. **Defer / evaluate:** the prior
     analysis found the five "surfaces" (nav shell, project card, project
     plate, timeline panel, meta panel) have divergent contracts
     (pseudo-element borders, `nth-child` vars, `.project-card` behavior hook
     for outside-click). Adopt shadcn `Card` **only** where the contract is
     clean; leave the others as authored CSS. Do not break the
     `.project-card` selector relied on by outside-click handling.
- [ ] Keep the bespoke local components (`Highlighter` via rough-notation,
  `TypingAnimation`) as-is — they are not shadcn primitives and work today.
  Restyle their classes to Tailwind only if trivial.
- [ ] One commit per primitive (and per LinkButton call-site family). Run
  `npm run check` after each.

**Verification per primitive:** the migrated control looks and behaves
identically (hover, focus-visible, keyboard Enter/Space, external-link attrs,
resume download, outside-click for project cards).

---

## Phase 5 — Hybrid utility pass (layout/spacing/typography only)

Goal: convert the *simple, presentational* CSS to Tailwind utilities where it
genuinely reduces code, leaving effects alone.

- [ ] Candidates (convert to utilities): `layout.css`, document-level spacing,
  the simpler parts of `_footer`, `_symbols`, static type/spacing in `_hero`,
  `_nav`, `_projects`.
- [ ] **Do NOT convert to utilities:** `animations.css`, `_background.css`
  (mesh), hero signature draw, `_intro.css` boot sequence, masks/filters, and
  the `responsive.css` choreography. These remain authored CSS under
  `@layer components`.
- [ ] Migrate file-by-file, smallest first; one commit per file; visual diff
  against Phase 0 screenshots after each.
- [ ] Run `npm run check` per commit.

**Verification:** pixel-identical at all five breakpoints; reduced-motion still
disables long animations; mobile bottom nav doesn't overflow.

> **Honest scoping note:** Phase 5 is the phase with the worst
> effort-to-value ratio. It is acceptable to stop early here — converting
> 100% of presentational CSS to utilities is not required for the migration to
> be "done." Convert what clearly reads better as utilities; leave the rest.

---

## Phase 6 — Optional design refinement (separated)

Only after Phases 1–5 are merged and verified. This is where the "refine" part
of "migrate + refine" lives, kept isolated so regressions are attributable.

- [ ] Before starting, invoke the `brainstorming` skill to define what
  "refine" means (spacing scale, type ramp, color adjustments, component
  polish) with the owner. Do not free-style visual changes.
- [ ] Each refinement is its own commit with a before/after note.

---

## Cross-cutting guardrails

- After **every** source-changing commit: `npm run check` (typecheck + lint +
  build) must pass. Each commit is independently buildable.
- Preserve behavior-coupled selectors, especially `.project-card`
  (outside-click), the mesh classes, the hero signature SVG, intro timing, and
  project expand/collapse timing.
- Do not touch: `public/` assets, `service-worker.js`/`sw.js`,
  `public/_headers` (Cloudflare), `index.html` metadata, `src/data/portfolio.ts`
  content, deployment shape.
- Keep `responsive.css` last in the cascade until each override is deliberately
  relocated.
- Do not introduce shadcn variants or Tailwind abstractions with no current
  caller.
- When implementation begins, the `karpathy-guidelines` skill applies per the
  owner's standing rule (surgical, minimal, surface assumptions).

## Verification checklist (manual, owner-driven)

Breakpoints: **1440 / 1024 / 768 / 430 / 375**. Check:

- project card open/close; keyboard Enter/Space activation; outside-click close
- floating nav scrolls to correct sections
- external links + resume download
- reduced-motion disables long animations
- mobile bottom nav does not overflow
- project detail content scrolls inside small cards
- hero signature placement; intro timing; fixed nav position; project grid
  choreography; expanded overlay; timeline glass panels; Cyrene corner image

## Rollback

Each phase is a discrete commit (or small commit group) on
`feature/tailwind-shadcn-migration`. Any phase can be reverted in isolation.
The branch is not merged to `main` until the full Phase 1–5 verification passes.

## Commit sequence summary

1. `build: add tailwind v4, drop sass, add @/ alias`
2. `refactor: convert scss to plain css (no visual change)`
3. `feat: express design tokens via tailwind @theme`
4. `refactor: cn() via clsx + tailwind-merge` + `chore: shadcn init`
5. `refactor: migrate <primitive>` ×N (badge, button, link-button families, card)
6. `refactor: tailwindify <file>` ×N (Phase 5, optional depth)
7. `style: <refinement>` ×N (Phase 6, optional)

## Non-goals

- No change to site content, copy, or `portfolio.ts` data.
- No change to deployment, headers, or service-worker behavior.
- No replacement of `motion` (Framer Motion), rough-notation, or the bespoke
  Highlighter/TypingAnimation components.
- No "pure utilities" rewrite of animation/effect CSS.
- No redesign smuggled into the migration commits (refinement is Phase 6).
