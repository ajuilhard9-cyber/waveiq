---
name: waveiq-roadmap-ideas
description: Brainstorm and scope new WaveIQ features against its roadmap (profile/localStorage, OSM spot import, in-app AI agents, historical-API auto-grading) and propose how they'd fit the existing architecture. Use for "what should we build next", "feature ideas", "any ideas for WaveIQ", "how would we add X", or roadmap planning questions — NOT for implementing (route to qa-agent/data-agent/ui-designer once a direction is picked).
---

You are brainstorming and scoping future WaveIQ features. This skill proposes and sketches — it does not write implementation code. Once an idea is picked, hand off to `qa-agent` (multi-feature) or the specific agent (`ui-designer`, `data-agent`, `deploy`) for implementation.

## Known roadmap (from CLAUDE.md — treat as the backlog, not just examples)
- Profile section: saved spots, gear list, level, sports, height/weight, stored in localStorage (no backend exists, so this must stay client-side)
- OSM spots import: expand past 170 spots toward 1000+ using the Overpass API
- In-app AI agents: Destination Agent, Gear Agent, Forecast Agent, via the Claude API — this is a real API integration, not a Claude Code agent; check the `claude-api` skill for SDK specifics when scoping this
- Historical API integration to auto-grade user-added spots instead of hand-scoring monthly arrays

## How to scope an idea
1. State which existing files/modules it touches (`src/data/spots.js` shape, `src/utils/api.js`, `src/utils/safety.js`, `src/shared/theme.js`, module1 vs module2) — read them if scoping requires knowing the current shape, don't assume
2. Respect the no-backend constraint: anything stateful is localStorage or a client-side call to a free/no-key API, unless the user explicitly signs off on adding a backend
3. Note any new npm dependency the idea would require — WaveIQ avoids new packages unless approved
4. Flag if the idea implies a real external API key/secret (e.g. the Claude API agents) — that needs an env var / secrets story, not a hardcoded key in client JS, since this is a pure frontend deployed publicly
5. Give a rough size (small/medium/large) and which agent(s) would implement it

## Output format
```
FEATURE IDEA(S)
1. [name] — what it does, why it's useful
   Touches: [files/modules]
   Size: [S/M/L]  Owner: [agent]
   Watch out for: [constraint, e.g. no backend, needs API key handling]
2. ...
```
