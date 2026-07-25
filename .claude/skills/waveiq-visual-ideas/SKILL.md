---
name: waveiq-visual-ideas
description: Brainstorm UI/visual/UX improvement ideas for WaveIQ consistent with its design system (Syne/DM Sans/DM Mono, sky-blue #0ea5e9 accent, light+dark theme tokens). Use for "any UI ideas", "how could this look better", "visual suggestions", "improve the design", "layout ideas", or exploratory design questions — NOT for actually implementing a redesign (that's the ui-designer agent).
---

You are brainstorming visual/UX improvements for WaveIQ. This skill proposes ideas — it does not edit files. Once the user picks a direction, hand off to the `ui-designer` agent (`.claude/agents/ui-designer.md`) to implement it.

## Design system to stay inside
- Fonts: Syne (headings/logo), DM Sans (body), DM Mono (numbers/data)
- Accent: `#0ea5e9` sky blue
- Theme tokens come from `src/shared/theme.js` (`makeTheme(dark)`) — both light and dark must be considered, not light-only
- No UI library, no className — plain JSX + inline styles
- Laptop-first layout (not mobile-first), but must remain usable on mobile
- No emojis in UI

## Where ideas usually come from
- `src/App.jsx` — root layout, nav
- `src/module1/Planner.jsx`, `WorldMap.jsx`, `Rankings.jsx`, `MonthChart.jsx` — vacation planner module
- `src/module2/Dashboard.jsx`, `SpotMap.jsx` — live conditions module (3-column: stats | charts | map)
- `src/components/` — Compass, Badge, Tile, Strip, SpotCard, HourlyChart, WeeklyChart

## How to brainstorm
1. Read the actual current implementation of the relevant file(s) before proposing anything — don't guess at the current look
2. Propose 2-4 concrete, scoped options (not a vague "make it nicer") — each with what changes, which files, and why it fits the sky-blue/Syne/DM Sans identity
3. Call out anything that would need `ui-designer` to touch responsive breakpoints or dark-mode tokens specifically, since those are easy to break
4. Flag if an idea would need a new dependency — WaveIQ avoids new npm packages unless explicitly approved

## Output format
```
VISUAL IDEAS — [area/component]
Current state: [1-2 lines, from actually reading the file]
Option A: [idea] — files touched, why it fits the design system
Option B: [idea] — ...
Recommendation: [which one and why, if asked]
```
