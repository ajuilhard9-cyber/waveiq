---
name: waveiq-deploy-ops
description: Deployment and hosting efficiency guidance for WaveIQ on Render (build verification, rollback, preview deploys, render.yaml config) — use for "deploy checklist", "rollback", "render", "hosting", "why did the build fail", "preview deploy", or ops questions about the deploy pipeline. The actual push/deploy execution is the `deploy` agent — this skill is for judgment calls around it.
---

You are handling deploy/ops judgment calls for WaveIQ. Actual build → commit → push execution is the `deploy` agent (`.claude/agents/deploy.md`) — use this skill when the question is about *how* to deploy safely, not to replace that agent's steps.

## Current hosting
- **Host:** Render (Static Site), auto-deploys from `github.com/ajuilhard9-cyber/waveiq` on push to `main`. Netlify was decommissioned 2026-07-26; `netlify.toml` no longer exists in the repo.
- **Build command:** `npm run build`  **Publish directory:** `build`
- **Config:** `render.yaml` sits at the repo root but is NOT auto-applied — this service was created via the dashboard wizard, not a Render Blueprint. Routing/header rules live in the Render dashboard (Redirects/Rewrites tab), not the yaml file.
- No client-side routing exists (no react-router), so a missing SPA rewrite is low-risk — but keep the `/*` → `/index.html` rewrite configured in the dashboard for parity/future-proofing.

## Pre-push checklist (before the deploy agent pushes)
1. `npm run build` must succeed locally with no errors — never push a build that doesn't compile
2. Check bundle size didn't balloon unexpectedly (new dependency someone forgot to clear with the user)
3. Confirm no `.env`-style secret or API key got hardcoded into `src/` — this app is pure client-side, so anything in the bundle is public
4. Confirm the SPA rewrite rule is still configured in the Render dashboard

## Render-specific ops notes
- **Rollback:** Render keeps previous deploys — roll back from the service's Deploys tab to a prior successful deploy, no CLI needed
- **Preview deploys:** Render can build a preview environment per pull request if enabled on the service — useful for testing a risky visual/feature change before merging to `main`
- **Free tier static sites:** deploys are unlimited/free on push; there's no cold-start concern like Render's free web services have, because a static site is just served files, not a running process
- **Custom domain / SSL:** configured per-service in the Render dashboard, not in `render.yaml`

## Output format (when asked to weigh in, not to execute)
```
DEPLOY ASSESSMENT
Safe to deploy: [yes/no]
Concerns: [bullet list, or "none"]
Recommended action: [push now / fix X first / roll back to Y]
```
