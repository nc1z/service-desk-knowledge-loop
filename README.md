# Service Desk Knowledge Loop

Local proof of concept for turning recurring service desk incidents into proposed runbook updates, safe support script changes, knowledge-base drafts, and reviewer-ready evidence.

The demo story follows a small synthetic ticket set through a Codex App review layer and Codex CLI repository edits. Later phases add fixtures, ingestion, clustering, generated documentation, and a replayable monitoring view. This baseline provides the TypeScript/Vite workspace those pieces will build on.

## Stack

- TypeScript for local app and pipeline code.
- Vite for the browser-based monitoring demo.
- pnpm for dependency management.
- ESLint and Prettier for linting and formatting.
- Vitest is the planned test runner once behavior lands in Phase 2.
- TypeScript is the planned support-script language so dry-run behavior and validation can share local pipeline types.

## Local Commands

```bash
pnpm install
pnpm audit
pnpm dev
pnpm build
pnpm lint
pnpm format:check
```

Use `pnpm preview` after `pnpm build` to serve the production bundle locally.

Baseline verification for Phase 0 is:

```bash
pnpm install
pnpm audit
pnpm lint
pnpm format:check
pnpm build
pnpm dev
```

## Folder Map

```text
.
├── docs/                  Architecture and demo notes.
├── src/                   Local demo app source.
├── tickets/               Planned authored synthetic ticket fixtures.
├── runbooks/              Planned authored stale runbook fixtures.
├── scripts/               Planned safe local support scripts.
├── kb/                    Planned knowledge-base drafts.
├── reviews/               Planned reviewer handoff artifacts.
├── generated/             Planned deterministic demo output artifacts.
├── PLAN.md                Phase-by-phase implementation plan.
├── service-desk-knowledge-loop-prd.md
├── package.json           Project scripts and pinned dev tooling.
└── index.html             Vite app entry point.
```

Planned authored fixtures will live in `tickets/`, `runbooks/`, and selected files under `scripts/`. Planned generated demo outputs will live in `generated/` plus generated review and KB files under `reviews/` and `kb/`. Generated outputs are ignored by default unless a future phase intentionally commits a stable sample artifact for demo documentation.

## Safety Boundaries

This POC uses synthetic local data only. It does not connect to live ITSM systems, require production credentials, execute production support scripts, or publish KB content. Generated briefs, code changes, runbook edits, and KB drafts remain local artifacts that require human review before any real-world use.
