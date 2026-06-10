# SCSS and Shadcn-Style Transition Design

Date: 2026-06-10

## Goal

Transition the portfolio styling architecture toward SCSS and shadcn-style local UI primitives without changing how the current website looks, behaves, deploys, or performs.

The intended result is a more standard, reusable frontend structure while preserving the existing custom visual identity.

## Current Codebase Summary

The site is a Vite, React, and TypeScript portfolio with Framer Motion for selected animations. Styling is currently plain global CSS.

Relevant structure:

- `src/main.tsx` imports the base reset layer from `src/index.css`.
- `src/App.tsx` imports the visual system from `src/styles/index.css`.
- `src/styles/index.css` imports global partials for tokens, components, layout, animations, and responsive overrides.
- Components are mostly presentational and class-driven.
- There is no Tailwind, Sass, Radix, or shadcn configuration today.
- Production CSS is small enough that this migration is about maintainability and code organization, not bundle size.

## Constraint: Shadcn Without Tailwind

Official shadcn/ui components are Tailwind-based. The CLI and `components.json` expect Tailwind configuration for generated component styling.

For this project, "shadcn without Tailwind" should mean:

- use shadcn's composition model and local ownership approach;
- use Radix primitives selectively where they solve accessibility or composition problems;
- style local primitives with SCSS instead of Tailwind utilities;
- avoid adding the shadcn CLI unless the project later adopts Tailwind.

Useful dependencies for this model:

- `sass` for SCSS support in Vite;
- `@radix-ui/react-slot` for `asChild` composition;
- `class-variance-authority` for typed variant APIs, if variants become useful;
- optional Radix packages only when a real primitive is needed, such as tooltip or dialog.

## Recommended Approach

Use a two-phase migration.

### Phase 1: CSS to SCSS, Behavior Unchanged

First convert the existing CSS structure to SCSS with minimal semantic changes.

Rules:

- preserve current class names;
- preserve the current import graph initially;
- keep responsive overrides last in the stylesheet graph unless a later change deliberately replaces them;
- do not change component markup during the mechanical conversion;
- keep visual output equivalent;
- move repeated values into SCSS tokens, mixins, and placeholders only after the mechanical conversion is verified.

Target structure:

```txt
src/styles/
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

The base reset can either remain as `src/index.css` temporarily or become `src/index.scss` in the same phase if the change is strictly mechanical.

### Phase 2: Local UI Primitive Layer

After the SCSS conversion is verified, introduce a small in-repo UI layer inspired by shadcn's ownership model.

Initial primitive candidates:

```txt
src/components/ui/link-button.tsx
src/components/ui/button.tsx
src/components/ui/badge.tsx
src/components/ui/card-surface.tsx
```

These primitives should be styled by SCSS, not Tailwind:

```txt
src/styles/ui/_button.scss
src/styles/ui/_badge.scss
src/styles/ui/_card.scss
src/styles/ui/_link.scss
```

The primitives should support only variants that map to existing site patterns. Avoid generic design-system expansion until the portfolio needs it.

## Extraction Order

Extract the highest-duplication, lowest-risk patterns first.

1. `LinkButton`

   Replace repeated anchor-based pill styling in:

   - hero action links;
   - floating navigation contact links;
   - project detail links;
   - project plate links.

2. `Button`

   Replace true button controls only after link behavior is stable:

   - floating navigation section buttons.

3. `Badge`

   Replace repeated tag/chip styling in:

   - project card tags;
   - project plate tags;
   - experience tags;
   - hero facts.

4. `CardSurface`

   Consolidate repeated glass/backdrop panel styling from:

   - project card shell;
   - project plate shell;
   - timeline content;
   - nav shell;
   - project meta panels.

   This should be deferred until link and badge primitives are complete. These surfaces share a visual language, but they do not yet share one clean contract.

5. `SectionHeader`

   Keep the existing component, but move its styles into the new SCSS organization. Add variants only if another section type needs them.

## Files by Migration Risk

High risk:

- `src/components/Projects.tsx`
- `src/styles/components/projects.css`
- `src/styles/responsive.css`
- `src/components/IntroScreen.tsx`
- `src/components/Hero.tsx`
- `src/components/FloatingNav.tsx`

Reason: these files combine layout choreography, animation timing, responsive overrides, interaction state, keyboard behavior, and visual effects.

Medium risk:

- `src/styles/components/hero.css`
- `src/styles/components/nav.css`
- `src/styles/components/trajectory.css`
- `src/styles/components/intro.css`
- `src/styles/components/background.css`
- `src/styles/animations.css`

Reason: they are mostly presentational, but they contain motion, masks, filters, fixed positioning, and layered effects.

Low risk:

- `src/components/Footer.tsx`
- `src/components/SectionHeader.tsx`
- `src/components/CyreneCorner.tsx`
- `src/components/Symbols.tsx`
- `src/components/BackgroundMesh.tsx`
- `src/data/portfolio.ts`
- `src/lib/*`
- config files

Reason: these are simple, data-driven, or only lightly styled.

## Things Not to Touch Early

Avoid changing these during the first migration pass:

- project layout classes like `pc-1`, `pc-2`, `pc-3`, and `pc-4`;
- behavior-coupled selectors such as `.project-card`, which are used by outside-click handling;
- geometric mesh rendering and mesh animation classes;
- the hero signature SVG and draw animation;
- intro boot animation timing;
- project expansion timing and outside-click behavior;
- service worker cleanup files;
- Cloudflare headers;
- metadata in `index.html`;
- public asset paths.

## Verification Plan

Each phase should pass:

```sh
npm run check
npm run build
```

Manual interaction checks:

- project card open and close;
- project card keyboard Enter and Space activation;
- outside click closes expanded project cards;
- floating nav scrolls to the correct sections;
- external links and resume download still work;
- reduced-motion mode still disables long animations;
- mobile bottom nav does not overflow;
- project detail content remains scrollable inside small cards.

Visual checks should compare these viewport widths:

- 1440px desktop;
- 1024px tablet;
- 768px tablet/mobile boundary;
- 430px mobile;
- 375px narrow mobile.

Pay special attention to:

- hero signature placement;
- intro screen timing;
- fixed nav position on desktop and mobile;
- project grid choreography;
- project card expanded overlay;
- timeline glass panels;
- Cyrene corner image position.

Visual verification is manual. The implementation should make it easy to compare these states, but screenshots do not need to be generated as part of the automated workflow.

## Commit Strategy

Use small commits that isolate risk:

1. install SCSS dependency and perform mechanical file rename/import update;
2. organize SCSS folders while keeping selectors stable and preserving responsive override order;
3. add local UI primitive foundation;
4. migrate anchor-based link buttons;
5. migrate true button controls;
6. migrate badges/tags;
7. migrate project links if they were not covered by the link-button pass;
8. migrate card/glass surfaces only after manual verification shows no drift.

Each commit should be independently buildable.

## Non-Goals

This transition should not:

- adopt Tailwind;
- run the shadcn CLI;
- redesign the portfolio;
- reduce CSS line percentage by hiding files from GitHub Linguist;
- change deployment behavior;
- change site copy or project data;
- replace Framer Motion;
- convert everything into generic components.

## Decision

Proceed with Option A:

1. convert CSS to SCSS first with no visual or behavioral changes;
2. introduce a small local UI primitive layer after the SCSS baseline is verified;
3. use Radix selectively for composition and accessibility, not as a blanket dependency;
4. preserve the current portfolio look and functionality throughout the migration.
