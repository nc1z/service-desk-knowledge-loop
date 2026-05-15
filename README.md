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
pnpm reset:demo
pnpm demo:run
pnpm test
pnpm dev
pnpm build
pnpm preview

# Hand-authored fixtures: tickets/, runbooks/, scripts/
# Generated outputs: generated/, reviews/, kb/
# If setup fails, rerun pnpm install. If preview fails, run pnpm build first.
```
