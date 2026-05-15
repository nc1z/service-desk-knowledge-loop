# Enterprise Demo Script

## 5-8 Minute Talk Track

### 0:00-0:45 - Set The Problem

Service desk teams resolve repeated issues every day, but the useful resolution detail often stays in ticket comments. This POC shows a local, synthetic knowledge loop where recurring incidents become proposed runbook updates, safe support-script changes, KB drafts, and reviewer evidence.

### 0:45-1:45 - Show The Local Demo Boundary

Open the README and run `pnpm reset:demo` followed by `pnpm demo:run`. Point out that the demo uses local fixture folders only: `tickets/`, `runbooks/`, `scripts/`, `kb/`, and `reviews/`. No ITSM connector, credential, VPN, IdP, KB platform, or production system is contacted.

### 1:45-2:45 - Codex App: Triage, Summary, Review

Codex App is represented by the incident-pattern brief in `reviews/incident-pattern-brief-vpn-login-failures.md` and the animated monitor's Codex App node. It ingests the support evidence, summarizes the recurring VPN pattern, separates facts from recommendations, cites ticket IDs and filenames, and keeps the service desk lead in the review loop.

### 2:45-4:15 - Codex CLI: Repository Edits And Validation

Codex CLI is represented by the local workspace edits and commands. It updates `runbooks/vpn-login-failures.md`, keeps `scripts/check-vpn-session-demo.mjs` dry-run only, generates `kb/vpn-login-failures.md`, writes `reviews/reviewer-handoff-vpn-login-failures.md`, and runs validation through `pnpm validate:runbooks`, `pnpm check:vpn-demo`, `pnpm eval:poc`, and `pnpm test`.

### 4:15-5:30 - Monitoring View

Run `pnpm dev` and open the local Vite URL. The monitor shows Incident Tickets flowing to Codex App, the brief handoff to Codex CLI, file-change pulses for Runbook Repo and Support Scripts, and both outputs converging into Knowledge Base. Use the Replay control to restart the local animation without rerunning the pipeline.

### 5:30-6:45 - Review Packet And Human Approval

Open `reviews/reviewer-handoff-vpn-login-failures.md`. Explain that the handoff lists changed files, ticket evidence, risks, assumptions, verification steps, and required approvals. The service desk lead reviews agent wording and KB clarity. The operations owner reviews runbook and support-script safety.

### 6:45-8:00 - Evaluation And Production Path

Run `pnpm eval:poc`. The eval confirms the selected pattern, expected ticket evidence, false-positive guardrail, runbook citations, dry-run script behavior, KB clarity, and absence of hallucinated systems or production execution claims. Close by explaining that production would replace local fixtures with governed connectors and approval workflows.

## Production Architecture Note

- ITSM connector: governed access to incident tickets, comments, tags, attachments metadata, and resolution notes.
- Repository integration: branch-protected runbook, support-script, and KB source repositories with pull requests or review packets.
- Identity: role-based access for service desk agents, support leads, operations owners, security reviewers, and CI service identities.
- Audit logging: prompts, source ticket exports, generated artifacts, diffs, approvals, commands, test results, and publication events.
- CI: documentation checks, support-script tests, evals, security scans, and policy gates before merge.
- KB publishing: approved markdown or CMS-bound drafts move through a publishing workflow only after service desk lead approval.

## Safety Note

- The POC uses synthetic data only.
- No production support scripts are executed.
- No credentials, live tickets, VPN systems, IdP systems, ITSM systems, or KB platforms are contacted.
- Generated KB and operational guidance require human approval before use.
- Ticket-derived evidence must be minimized or redacted before any production workflow.
- Review records must remain attributable to a ticket set, reviewer, approval decision, and repository change.

## Screen Capture Instructions

1. Run `pnpm dev`.
2. Open the Vite local URL shown by the command.
3. Capture the first viewport with the monitor loaded.
4. Click Replay and capture the ticket-flow or handoff animation state.
5. Capture a mobile-width viewport to show the responsive stacked layout.
6. Keep screenshots in demo material outside the repo unless they are intentionally added as reviewed artifacts.

## Final Acceptance Checklist

- [ ] A user can run the demo from a local workspace with `pnpm reset:demo` and `pnpm demo:run`.
- [ ] The demo produces one updated runbook.
- [ ] The demo produces one safe support script change.
- [ ] The demo produces one KB draft.
- [ ] The demo produces one reviewer handoff.
- [ ] The animated monitoring view shows the end-to-end knowledge loop.
- [ ] The POC can be reset by restoring fixture files.
- [ ] No real credentials, real tickets, or production systems are required.
- [ ] Mermaid diagrams in documentation parse successfully.
- [ ] Tests and evals pass from a clean checkout.
