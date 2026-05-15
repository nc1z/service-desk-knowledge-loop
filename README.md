# Service Desk Knowledge Loop

Codex POC that turns synthetic recurring service desk tickets into a local review-and-update workflow for runbooks, support scripts, and knowledge-base drafts.

## Flow

```mermaid
flowchart LR
  T[synthetic tickets] --> A[Codex App review]
  A --> C[Codex CLI workspace]
  C --> R[runbook update]
  C --> S[support script change]
  R --> K[knowledge-base draft]
  S --> K
```

## Getting Started

```bash
pnpm install
pnpm ingest:tickets
pnpm cluster:incidents
pnpm brief:pattern
pnpm validate:runbooks
pnpm check:vpn-demo
pnpm test
pnpm dev
pnpm build
pnpm preview
```

TODO: add supported local commands for full demo simulation, reset, and replay.
