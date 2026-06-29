# SCSS and Shadcn-Style Transition Implementation Plan

> **Superseded (2026-06-19)** by
> `docs/plans/2026-06-19-tailwind-shadcn-migration-plan.md`, which adopts real
> Tailwind v4 + shadcn/ui. This plan (SCSS, no Tailwind) was implemented and is
> the starting point for the new one. Kept for history.

> **For agentic workers:** implement this plan task by task. Use checkbox (`- [ ]`) syntax for tracking. Keep each task buildable, focused, and independently reviewable.

**Goal:** Convert the portfolio styling architecture to SCSS and introduce a small shadcn-style local primitive layer without changing the site's visual design, behavior, deployment shape, or content.

**Architecture:** Keep the current React component tree and class-driven styling intact while the CSS files become SCSS. After that baseline is verified, add local UI primitives that own reusable link, button, badge, and eventually surface patterns, with SCSS classes preserving the existing visual language.

**Tech Stack:** Vite, React 19, TypeScript, SCSS through `sass`, Framer Motion, lucide/react-icons, optional `@radix-ui/react-slot` only for `asChild` composition.

---

## Source Design

Use `docs/plans/2026-06-10-scss-shadcn-transition-design.md` as the governing design. The important constraints are:

- No Tailwind adoption.
- No shadcn CLI.
- No redesign.
- No site copy or data changes.
- Preserve responsive override order.
- Preserve behavior-coupled selectors such as `.project-card`.
- Manual visual verification is done by the project owner.

## File Structure

Eventual target structure:

```txt
src/
  components/
    ui/
      badge.tsx
      button.tsx
      link-button.tsx
      card-surface.tsx
  styles/
    abstracts/
      _tokens.scss
      _mixins.scss
      _motion.scss
    base/
      _reset.scss
      _document.scss
    components/
      _background.scss
      _footer.scss
      _hero.scss
      _intro.scss
      _nav.scss
      _projects.scss
      _symbols.scss
      _trajectory.scss
    ui/
      _badge.scss
      _button.scss
      _card.scss
      _link.scss
    index.scss
```

`src/index.css` may stay as the reset entry during the first pass. Convert it to `src/index.scss` only if the rename is purely mechanical and `src/main.tsx` is updated in the same commit.

## Guardrails

- Keep `src/styles/responsive.scss` or `src/styles/components/_responsive.scss` imported last until every responsive override is deliberately relocated.
- Do not move broad layout selector blocks and component markup in the same commit. Primitive migrations may move only the exact selectors for the primitive being adopted.
- Do not introduce generic variants that have no current caller.
- Keep class names stable during primitive migration by allowing primitives to receive `className`.
- Use `npm run check` after every task that changes source.
- Do not run automated screenshot generation as part of this plan.

---

## Task 1: Install SCSS Support

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json`

- [ ] **Step 1: Install `sass`**

Run:

```sh
npm install -D sass
```

Expected:

```txt
npm exits successfully and updates package-lock.json
```

- [ ] **Step 2: Verify the dependency**

Run:

```sh
npm ls sass
```

Expected output includes:

```txt
sass@
```

- [ ] **Step 3: Run the baseline check**

Run:

```sh
npm run check
```

Expected:

```txt
✓ built
```

- [ ] **Step 4: Commit**

Run:

```sh
git add package.json package-lock.json
git commit -m "build: add sass support"
```

---

## Task 2: Mechanically Rename CSS to SCSS

**Files:**
- Rename: `src/styles/index.css` to `src/styles/index.scss`
- Rename: every file under `src/styles/components/*.css` to `*.scss`
- Rename: `src/styles/animations.css` to `src/styles/animations.scss`
- Rename: `src/styles/layout.css` to `src/styles/layout.scss`
- Rename: `src/styles/responsive.css` to `src/styles/responsive.scss`
- Rename: `src/styles/tokens.css` to `src/styles/tokens.scss`
- Modify: `src/App.tsx`
- Optional rename: `src/index.css` to `src/index.scss`
- Optional modify: `src/main.tsx`

- [ ] **Step 1: Rename files without changing selector contents**

Use `git mv` for every rename:

```sh
git mv src/styles/index.css src/styles/index.scss
git mv src/styles/tokens.css src/styles/tokens.scss
git mv src/styles/layout.css src/styles/layout.scss
git mv src/styles/animations.css src/styles/animations.scss
git mv src/styles/responsive.css src/styles/responsive.scss
git mv src/styles/components/background.css src/styles/components/background.scss
git mv src/styles/components/footer.css src/styles/components/footer.scss
git mv src/styles/components/hero.css src/styles/components/hero.scss
git mv src/styles/components/intro.css src/styles/components/intro.scss
git mv src/styles/components/nav.css src/styles/components/nav.scss
git mv src/styles/components/projects.css src/styles/components/projects.scss
git mv src/styles/components/symbols.css src/styles/components/symbols.scss
git mv src/styles/components/trajectory.css src/styles/components/trajectory.scss
```

- [ ] **Step 2: Update the app stylesheet import**

In `src/App.tsx`, change:

```ts
import './styles/index.css'
```

to:

```ts
import './styles/index.scss'
```

- [ ] **Step 3: Update SCSS imports**

In `src/styles/index.scss`, change imports to:

```scss
@use './tokens.scss';
@use './components/intro.scss';
@use './components/symbols.scss';
@use './components/background.scss';
@use './components/nav.scss';
@use './layout.scss';
@use './components/hero.scss';
@use './components/projects.scss';
@use './components/trajectory.scss';
@use './components/footer.scss';
@use './animations.scss';
@use './responsive.scss';
```

`responsive.scss` must remain last.

- [ ] **Step 4: Run checks**

Run:

```sh
npm run check
```

Expected:

```txt
✓ built
```

- [ ] **Step 5: Commit**

Run:

```sh
git add src package.json package-lock.json
git commit -m "refactor: convert stylesheets to scss"
```

---

## Task 3: Organize SCSS Folders Without Selector Changes

**Files:**
- Create: `src/styles/abstracts/_tokens.scss`
- Create: `src/styles/base/_reset.scss` if converting `src/index.css`
- Create: `src/styles/base/_document.scss`
- Rename: component styles to partial names under `src/styles/components/`
- Modify: `src/styles/index.scss`
- Optional modify: `src/main.tsx`

- [ ] **Step 1: Move global tokens**

Move the contents of `src/styles/tokens.scss` to `src/styles/abstracts/_tokens.scss`.

Do not create `_mixins.scss` or `_motion.scss` until a later task consumes the first mixin or motion token. Avoid unused SCSS modules.

- [ ] **Step 2: Move document-level styles**

Move `body`, `a`, `button`, and `::selection` rules from the old token file into `src/styles/base/_document.scss`. Keep declarations unchanged.

- [ ] **Step 3: Rename component styles to partials**

Run:

```sh
git mv src/styles/components/background.scss src/styles/components/_background.scss
git mv src/styles/components/footer.scss src/styles/components/_footer.scss
git mv src/styles/components/hero.scss src/styles/components/_hero.scss
git mv src/styles/components/intro.scss src/styles/components/_intro.scss
git mv src/styles/components/nav.scss src/styles/components/_nav.scss
git mv src/styles/components/projects.scss src/styles/components/_projects.scss
git mv src/styles/components/symbols.scss src/styles/components/_symbols.scss
git mv src/styles/components/trajectory.scss src/styles/components/_trajectory.scss
```

- [ ] **Step 4: Keep responsive overrides last**

Leave `src/styles/responsive.scss` as a non-partial file for now, or rename it to `_responsive.scss` only if it remains the final import.

- [ ] **Step 5: Update `src/styles/index.scss`**

Use:

```scss
@use './abstracts/_tokens.scss';
@use './base/_document.scss';
@use './components/_intro.scss';
@use './components/_symbols.scss';
@use './components/_background.scss';
@use './components/_nav.scss';
@use './layout.scss';
@use './components/_hero.scss';
@use './components/_projects.scss';
@use './components/_trajectory.scss';
@use './components/_footer.scss';
@use './animations.scss';
@use './responsive.scss';
```

- [ ] **Step 6: Run checks**

Run:

```sh
npm run check
```

Expected:

```txt
✓ built
```

- [ ] **Step 7: Commit**

Run:

```sh
git add src
git commit -m "refactor: organize scss structure"
```

---

## Task 4: Add Local UI Primitive Foundation

**Files:**
- Create: `src/components/ui/link-button.tsx`
- Create: `src/components/ui/button.tsx`
- Create: `src/components/ui/badge.tsx`
- Create: `src/components/ui/card-surface.tsx`
- Create: `src/styles/ui/_link.scss`
- Create: `src/styles/ui/_button.scss`
- Create: `src/styles/ui/_badge.scss`
- Create: `src/styles/ui/_card.scss`
- Modify: `src/styles/index.scss`

- [ ] **Step 1: Add `LinkButton`**

Create `src/components/ui/link-button.tsx`:

```tsx
import type { AnchorHTMLAttributes, ElementType, ReactNode } from 'react'
import { cn } from '../../lib/cn'

type LinkButtonVariant = 'primary' | 'secondary' | 'ghost'
type LinkButtonSize = 'sm' | 'md' | 'icon'

type LinkButtonProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  icon?: ElementType
  iconOnly?: boolean
  size?: LinkButtonSize
  variant?: LinkButtonVariant
  children: ReactNode
}

export function LinkButton({
  children,
  className,
  icon: Icon,
  iconOnly = false,
  size = 'md',
  variant = 'secondary',
  ...props
}: LinkButtonProps) {
  return (
    <a
      className={cn(
        'ui-link-button',
        `ui-link-button-${variant}`,
        `ui-link-button-${size}`,
        iconOnly && 'ui-link-button-icon-only',
        className,
      )}
      {...props}
    >
      {Icon ? <Icon aria-hidden="true" /> : null}
      {children}
    </a>
  )
}
```

- [ ] **Step 2: Add `Button`**

Create `src/components/ui/button.tsx`:

```tsx
import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '../../lib/cn'

type ButtonVariant = 'nav' | 'ghost'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
  children: ReactNode
}

export function Button({ children, className, variant = 'ghost', type = 'button', ...props }: ButtonProps) {
  return (
    <button className={cn('ui-button', `ui-button-${variant}`, className)} type={type} {...props}>
      {children}
    </button>
  )
}
```

- [ ] **Step 3: Add `Badge`**

Create `src/components/ui/badge.tsx`:

```tsx
import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '../../lib/cn'

type BadgeVariant = 'square' | 'pill'

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: BadgeVariant
  children: ReactNode
}

export function Badge({ children, className, variant = 'square', ...props }: BadgeProps) {
  return (
    <span className={cn('ui-badge', `ui-badge-${variant}`, className)} {...props}>
      {children}
    </span>
  )
}
```

- [ ] **Step 4: Add `CardSurface` without migrating callers**

Create `src/components/ui/card-surface.tsx`:

```tsx
import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '../../lib/cn'

type CardSurfaceProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode
}

export function CardSurface({ children, className, ...props }: CardSurfaceProps) {
  return (
    <div className={cn('ui-card-surface', className)} {...props}>
      {children}
    </div>
  )
}
```

- [ ] **Step 5: Add UI SCSS modules**

Create the four UI SCSS files as empty modules:

```sh
touch src/styles/ui/_link.scss
touch src/styles/ui/_button.scss
touch src/styles/ui/_badge.scss
touch src/styles/ui/_card.scss
```

- [ ] **Step 6: Import UI styles before responsive overrides**

Add these imports in `src/styles/index.scss` after component imports and before `responsive.scss`:

```scss
@use './ui/_link.scss';
@use './ui/_button.scss';
@use './ui/_badge.scss';
@use './ui/_card.scss';
```

- [ ] **Step 7: Run checks**

Run:

```sh
npm run check
```

Expected:

```txt
✓ built
```

- [ ] **Step 8: Commit**

Run:

```sh
git add src
git commit -m "feat: add local ui primitive foundation"
```

---

## Task 5: Migrate Hero Action Links to `LinkButton`

**Files:**
- Modify: `src/components/Hero.tsx`
- Modify: `src/styles/components/_hero.scss`
- Modify: `src/styles/ui/_link.scss`
- Modify: `src/styles/responsive.scss`

- [ ] **Step 1: Move hero link styles into UI link styles**

Move `.hero-action`, `.hero-action svg`, `.hero-action-primary`, `.hero-action-secondary`, and their hover/focus rules from `_hero.scss` into `_link.scss`.

Rename selectors as follows:

```scss
.hero-action -> .ui-link-button
.hero-action svg -> .ui-link-button svg
.hero-action-primary -> .ui-link-button-primary
.hero-action-secondary -> .ui-link-button-secondary
.hero-action:hover -> .ui-link-button:hover
.hero-action:focus-visible -> .ui-link-button:focus-visible
.hero-action-primary:hover -> .ui-link-button-primary:hover
.hero-action-primary:focus-visible -> .ui-link-button-primary:focus-visible
```

Keep declarations unchanged.

- [ ] **Step 2: Update responsive selectors**

In `src/styles/responsive.scss`, replace hero action overrides:

```scss
.hero-action
```

with:

```scss
.hero-actions .ui-link-button
```

Keep declarations unchanged.

- [ ] **Step 3: Update `Hero.tsx`**

Import `LinkButton`:

```tsx
import { LinkButton } from './ui/link-button'
```

Replace the mapped `<a>` with:

```tsx
<LinkButton
  download={link.download || undefined}
  href={link.href}
  icon={Icon}
  key={label}
  variant={variant}
  {...getExternalLinkProps(link)}
>
  {label}
</LinkButton>
```

- [ ] **Step 4: Run checks**

Run:

```sh
npm run check
```

Expected:

```txt
✓ built
```

- [ ] **Step 5: Commit**

Run:

```sh
git add src
git commit -m "refactor: migrate hero links to local primitive"
```

---

## Task 6: Migrate Floating Nav Links and Buttons

**Files:**
- Modify: `src/components/FloatingNav.tsx`
- Modify: `src/styles/components/_nav.scss`
- Modify: `src/styles/ui/_button.scss`
- Modify: `src/styles/ui/_link.scss`
- Modify: `src/styles/responsive.scss`

- [ ] **Step 1: Move shared nav control styles**

Move declarations from:

```scss
.floating-nav a,
.floating-nav button
```

into:

```scss
.ui-button-nav,
.ui-link-button-nav
```

Keep nav-specific layout selectors such as `.nav-social a` in `_nav.scss` until the JSX migration is complete.

- [ ] **Step 2: Add nav variant to `LinkButton`**

In `src/components/ui/link-button.tsx`, extend the variant type:

```tsx
type LinkButtonVariant = 'primary' | 'secondary' | 'ghost' | 'nav'
```

- [ ] **Step 3: Update `FloatingNav.tsx`**

Import primitives:

```tsx
import { Button } from './ui/button'
import { LinkButton } from './ui/link-button'
```

Replace section buttons with:

```tsx
<Button key={item.targetId} onClick={() => scrollToSection(item.targetId)} variant="nav">
  <span className="nav-label-full">{item.label}</span>
  <span className="nav-label-short">{item.shortLabel}</span>
</Button>
```

Replace contact anchors with:

```tsx
<LinkButton
  aria-label={item.label}
  download={item.download || undefined}
  href={item.href}
  icon={Icon}
  iconOnly
  key={item.href}
  size="icon"
  variant="nav"
  {...getExternalLinkProps(item)}
>
  <span className="sr-only">{item.label}</span>
</LinkButton>
```

- [ ] **Step 4: Add screen-reader utility if missing**

If no `.sr-only` utility exists, add this to `src/styles/base/_document.scss`:

```scss
.sr-only {
  clip: rect(0, 0, 0, 0);
  border: 0;
  height: 1px;
  margin: -1px;
  overflow: hidden;
  padding: 0;
  position: absolute;
  white-space: nowrap;
  width: 1px;
}
```

- [ ] **Step 5: Update responsive selectors**

In `src/styles/responsive.scss`, replace:

```scss
.floating-nav a,
.floating-nav button
```

with:

```scss
.floating-nav .ui-link-button,
.floating-nav .ui-button
```

Replace:

```scss
.nav-social a
```

with:

```scss
.nav-social .ui-link-button
```

- [ ] **Step 6: Run checks**

Run:

```sh
npm run check
```

Expected:

```txt
✓ built
```

- [ ] **Step 7: Commit**

Run:

```sh
git add src
git commit -m "refactor: migrate floating nav controls"
```

---

## Task 7: Migrate Project Links

**Files:**
- Modify: `src/components/Projects.tsx`
- Modify: `src/styles/components/_projects.scss`
- Modify: `src/styles/ui/_link.scss`
- Modify: `src/styles/responsive.scss`

- [ ] **Step 1: Extend link variants for project links**

In `src/components/ui/link-button.tsx`, extend the variant type:

```tsx
type LinkButtonVariant = 'primary' | 'secondary' | 'ghost' | 'nav' | 'project'
```

- [ ] **Step 2: Move project link styles**

Move declarations from:

```scss
.project-detail-links a
.project-detail-links a:hover
.project-detail-links a:focus-visible
.project-detail-links svg
.project-plate-links a
.project-plate-links a:hover
.project-plate-links a:focus-visible
.project-plate-links svg
```

into `.ui-link-button-project` and `.ui-link-button-project svg`. Preserve container layout selectors such as `.project-detail-links` and `.project-plate-links` in `_projects.scss`.

- [ ] **Step 3: Update `ProjectLinks`**

Import `LinkButton`:

```tsx
import { LinkButton } from './ui/link-button'
```

Replace each project link anchor with:

```tsx
<LinkButton
  href={link.href}
  icon={link.icon === 'github' ? FaGithub : ExternalLink}
  key={link.href}
  onClick={(event) => event.stopPropagation()}
  onKeyDown={(event) => event.stopPropagation()}
  rel="noreferrer"
  target="_blank"
  variant="project"
>
  {link.label}
</LinkButton>
```

Delete `ProjectLinkIcon` if it is no longer used.

- [ ] **Step 4: Update responsive selectors**

In `src/styles/responsive.scss`, replace:

```scss
.project-detail-links a
```

with:

```scss
.project-detail-links .ui-link-button
```

- [ ] **Step 5: Run checks**

Run:

```sh
npm run check
```

Expected:

```txt
✓ built
```

- [ ] **Step 6: Commit**

Run:

```sh
git add src
git commit -m "refactor: migrate project links"
```

---

## Task 8: Migrate Badges and Tags

**Files:**
- Modify: `src/components/Hero.tsx`
- Modify: `src/components/Projects.tsx`
- Modify: `src/components/ExperienceTimeline.tsx`
- Modify: `src/styles/components/_hero.scss`
- Modify: `src/styles/components/_projects.scss`
- Modify: `src/styles/components/_trajectory.scss`
- Modify: `src/styles/ui/_badge.scss`
- Modify: `src/styles/responsive.scss`

- [ ] **Step 1: Move badge styles**

Move declarations from these selectors into UI badge variants:

```scss
.tag-border -> .ui-badge-square
.project-plate-tags span -> .ui-badge-square
.exp-tags span -> .ui-badge-pill
.hero-facts span -> .ui-badge-pill
```

Preserve layout containers:

```scss
.meta-tags
.project-plate-tags
.exp-tags
.hero-facts
```

- [ ] **Step 2: Update components**

Import `Badge` where needed:

```tsx
import { Badge } from './ui/badge'
```

Use square badges for project tags:

```tsx
<Badge key={tag} variant="square">
  {tag}
</Badge>
```

Use pill badges for hero facts and experience tags:

```tsx
<Badge key={tag} variant="pill">
  {tag}
</Badge>
```

- [ ] **Step 3: Preserve existing class hooks only where needed**

If a responsive override still targets a legacy badge class, keep that class in `className` until the override is migrated:

```tsx
<Badge className="tag-border" key={tag} variant="square">
  {tag}
</Badge>
```

Remove the legacy class in the same task once selectors are updated.

- [ ] **Step 4: Update responsive selectors**

Replace:

```scss
.hero-facts span
```

with:

```scss
.hero-facts .ui-badge
```

- [ ] **Step 5: Run checks**

Run:

```sh
npm run check
```

Expected:

```txt
✓ built
```

- [ ] **Step 6: Commit**

Run:

```sh
git add src
git commit -m "refactor: migrate badges to local primitive"
```

---

## Task 9: Reassess Card Surface Extraction

**Files:**
- Modify only if the visual contracts are still clearly duplicated:
  - `src/components/Projects.tsx`
  - `src/components/ExperienceTimeline.tsx`
  - `src/components/FloatingNav.tsx`
  - `src/styles/components/_projects.scss`
  - `src/styles/components/_trajectory.scss`
  - `src/styles/components/_nav.scss`
  - `src/styles/ui/_card.scss`

- [ ] **Step 1: Classify surfaces**

Create a temporary local note outside the commit by listing each surface and its required behavior:

```txt
nav shell: fixed pill, compact controls, no pseudo-border mask
project card shell: interactive, transform states, expanded/activating states, project-card selector required
project plate shell: static article, hover lift, masked border
timeline content: prism border, nth-child CSS variables, no shared DOM needs
project meta panel: absolute overlay, compact type, pseudo highlight
```

- [ ] **Step 2: Extract only one stable surface if justified**

Only migrate a surface if the primitive can preserve its current class and state hooks. Example for project plates:

```tsx
<CardSurface className="project-plate" as="article">
  ...
</CardSurface>
```

Do not implement `as` support unless a caller needs a non-`div` element. If `as` is needed, update `CardSurface` before migration:

```tsx
import type { ElementType, HTMLAttributes, ReactNode } from 'react'
import { cn } from '../../lib/cn'

type CardSurfaceProps = HTMLAttributes<HTMLElement> & {
  as?: ElementType
  children: ReactNode
}

export function CardSurface({
  as,
  children,
  className,
  ...props
}: CardSurfaceProps) {
  const Component = as ?? 'div'

  return (
    <Component className={cn('ui-card-surface', className)} {...props}>
      {children}
    </Component>
  )
}
```

- [ ] **Step 3: Skip extraction if contracts are still divergent**

If the classification shows the surfaces still require different pseudo-elements, layout state, or selector hooks, leave `CardSurface` unused and keep this task as a no-op commitless review.

- [ ] **Step 4: Run checks if code changed**

Run:

```sh
npm run check
```

Expected:

```txt
✓ built
```

- [ ] **Step 5: Commit only if code changed**

Run:

```sh
git add src
git commit -m "refactor: migrate stable card surface"
```

---

## Task 10: Final Cleanup and Verification

**Files:**
- Modify: `src/styles/**/*.scss`
- Modify: `src/components/**/*.tsx`
- Modify: `docs/plans/2026-06-10-scss-shadcn-transition-design.md` only if implementation diverged intentionally

- [ ] **Step 1: Remove dead selectors**

Run:

```sh
rg -n "hero-action|tag-border|project-detail-links a|project-plate-links a|floating-nav a|floating-nav button" src
```

Expected: no matches for selectors that were fully migrated. Remaining matches must be intentional layout containers or documented behavior hooks.

- [ ] **Step 2: Confirm no accidental Tailwind or shadcn config was added**

Run:

```sh
find . -maxdepth 3 \( -name 'tailwind.config.*' -o -name 'components.json' \) -print
```

Expected: no output.

- [ ] **Step 3: Run full verification**

Run:

```sh
npm run check
```

Expected:

```txt
✓ built
```

- [ ] **Step 4: Manual verification handoff**

Ask the project owner to verify:

```txt
1440px desktop
1024px tablet
768px tablet/mobile boundary
430px mobile
375px narrow mobile
project open/close
project keyboard Enter/Space activation
outside click close
nav scroll targets
external links
resume download
reduced-motion mode
mobile bottom nav overflow
small-card detail scrolling
```

- [ ] **Step 5: Commit cleanup**

Run:

```sh
git add src docs/plans/2026-06-10-scss-shadcn-transition-design.md
git commit -m "chore: finalize styling transition cleanup"
```

Skip this commit if there were no cleanup changes.

---

## Self-Review

- Spec coverage: The plan covers SCSS installation, mechanical conversion, SCSS organization, local primitives, link migration, button migration, badge migration, deferred surface extraction, verification, and cleanup.
- Placeholder scan: The plan intentionally avoids unspecified implementation steps and names exact files, commands, selectors, and expected outcomes.
- Type consistency: Primitive names and variants are consistent across tasks: `LinkButton`, `Button`, `Badge`, and `CardSurface`; `primary`, `secondary`, `ghost`, `nav`, and `project` variants are introduced before use.
