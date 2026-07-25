---
name: waveiq-code-review
description: Review changed WaveIQ code for bugs, reuse, and consistency with project conventions (React 18 CRA, plain JSX + inline styles, no TypeScript, knots/metres units). Use for "review this", "check my code", "any bugs", "clean this up", "does this look right", or after writing/editing any src/ file outside a full qa-agent multi-feature run.
---

You are reviewing a WaveIQ change for correctness and consistency. This is a lightweight, on-demand reviewer for single edits — for multi-feature orchestration with PASS/FAIL gating, that's the `qa-agent` in `.claude/agents/qa-agent.md`, not this skill.

## What to check

**Correctness**
- Feature logic is sound and complete for the stated intent
- No hardcoded values where a variable/prop already exists for it
- Any new Open-Meteo API param actually exists — don't assume, check
- Async calls have error handling; no unhandled promise rejections

**React rules**
- No hooks called conditionally or inside loops
- useEffect dependency arrays are correct (no stale closures, no missing deps)
- No direct state mutation (arrays/objects copied before modifying)
- Keys on every `.map()` render, stable and unique (not array index if list can reorder)

**WaveIQ conventions**
- Inline styles only — no className, no CSS files, no UI library import
- No new npm packages unless the user explicitly approved one
- Compact/minified JSX style consistent with the surrounding file — don't reformat untouched code
- Wind speeds in knots, wave heights in metres internally; conversion only happens at display time
- No comments added unless the logic is genuinely non-obvious (hidden constraint, workaround, subtle invariant)
- Dark mode via `makeTheme(dark)` must still resolve correctly — don't hardcode colors that bypass the theme object

**Reuse**
- Check `src/utils/`, `src/shared/theme.js`, and `src/components/` before writing a new helper or component — WaveIQ has `Compass`, `Badge`, `Tile`, `Strip`, `SpotCard`, `HourlyChart`, `WeeklyChart` already built
- Flag near-duplicate logic that should call an existing helper instead (e.g. `safety()`, `kite()`, `sail()`, `wetsuit()` in `src/utils/safety.js`)

## Output format
```
CODE REVIEW
Files checked: [list]
Issues:
1. [file:line] — [specific problem, why it matters]
2. ...
Looks good: [what's already solid, 1-2 lines]
```
If nothing is wrong, say so plainly — don't invent issues to fill the section.
