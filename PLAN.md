# Service Desk Knowledge Loop POC Plan

This plan breaks the PRD into small, commit-friendly tasks. Each section can be implemented and committed independently so the project grows from a static repo into a demo-able enterprise POC.

## 0. Repository Baseline

Goal: create a clean project foundation before adding behavior.

- [x] Add a concise `README.md` with the POC story, local run commands, and folder map.
- [x] Choose and document the initial implementation stack for the local demo app, pipeline, validation, and support-script language.
- [x] Add minimal project scaffolding for the chosen stack, with placeholders only for the monitoring UI and local pipeline foundation.
- [x] Add formatting and linting commands.
- [x] Add `.gitignore` entries for build outputs, caches, local env files, and generated demo artifacts.
- [x] Document authored fixture folders versus generated output folders.
- [x] Document POC safety boundaries: synthetic data only, no production connectors, no credentials, no production script execution, and human review for generated outputs.
- [x] Add a `docs/architecture.md` file with the PRD Mermaid diagram and a short explanation of the Codex App / Codex CLI split.
- [x] Verify the baseline project installs, audits, lints, formats, builds, and runs locally with exact commands recorded.

Suggested commit: `chore: scaffold service desk knowledge loop poc`

## 1. Demo Fixture Data

Goal: create synthetic enterprise-like inputs that make the demo repeatable without using real tickets or credentials.

- [x] Create `tickets/` with 12-20 synthetic incident tickets.
- [x] Include at least three repeated issue clusters:
  - [x] VPN login failures.
  - [x] Password reset loops.
  - [x] Printer queue stalls.
- [x] Add at least one false-positive trap where similar symptoms have different root causes.
- [x] Give every ticket a stable ID, affected system, symptom, resolver action, timestamp, and short comment history.
- [x] Create `runbooks/` with intentionally stale markdown runbooks for each major cluster.
- [x] Create `scripts/` with simple, safe support scripts that never touch production systems.
- [x] Create empty or placeholder `kb/` and `reviews/` folders with `.gitkeep` files.
- [x] Add `fixtures/expected-clusters.json` describing the expected groupings and the preferred demo pattern.

Suggested commit: `test: add synthetic service desk fixtures`

## 2. Ticket Ingestion

Goal: load local ticket files into structured records with clear validation errors.

- [x] Define the ticket schema used by the POC.
- [x] Support ingesting ticket files from `tickets/`.
- [x] Normalize ticket fields such as ID, system, symptom, resolver action, and timestamps.
- [x] Validate required fields and report malformed fixtures without crashing.
- [x] Add a CLI or script command for running ingestion.
- [x] Print an ingest summary with ticket count and invalid-file count.
- [x] Add tests covering valid tickets, missing fields, and unsupported files.

Suggested commit: `feat: ingest synthetic incident tickets`

## 3. Incident Clustering

Goal: group incidents by practical support signals and select one high-confidence recurring pattern.

- [x] Implement grouping by symptom, affected system, resolver action, and recurrence count.
- [x] Generate cluster summaries with ticket IDs and source filenames.
- [x] Rank clusters by confidence, recurrence count, and evidence quality.
- [x] Select one high-confidence recurring pattern for the demo run.
- [x] Ensure the false-positive trap is not merged into the wrong cluster.
- [x] Save cluster output to a deterministic local artifact.
- [x] Add tests against `fixtures/expected-clusters.json`.

Suggested commit: `feat: identify recurring incident patterns`

## 4. Codex App Brief Output

Goal: simulate the human-facing triage and review layer that would happen in Codex App.

- [x] Define the incident-pattern brief format.
- [x] Generate a concise brief for the selected cluster.
- [x] Include facts, ticket evidence, suspected stale documentation, and recommended next actions.
- [x] Cite ticket IDs or filenames for every major claim.
- [x] Separate facts from recommendations.
- [x] Save the brief as a review artifact under `reviews/`.
- [x] Add a sample completed brief for the demo path.

Suggested commit: `feat: generate incident pattern brief`

## 5. Codex CLI Runbook Update

Goal: simulate Codex CLI making a scoped repository edit to improve stale operational documentation.

- [ ] Map the selected incident cluster to the matching runbook.
- [ ] Update the runbook with current symptoms, triage steps, resolver actions, and escalation notes.
- [ ] Add an evidence section that cites the relevant ticket IDs or filenames.
- [ ] Avoid unrelated runbook rewrites or style churn.
- [ ] Add validation for required runbook sections.
- [ ] Record the changed runbook path in the review output.
- [ ] Add tests or snapshot checks for the generated runbook content.

Suggested commit: `feat: update runbook from incident evidence`

## 6. Codex CLI Support Script Change

Goal: simulate a safe script patch that supports service desk work without taking production action.

- [ ] Decide whether the demo should patch an existing script or create a new one for the selected pattern.
- [ ] Add a dry-run mode by default.
- [ ] Add clear input validation and harmless sample output.
- [ ] Add comments or help text explaining that the script is for local/demo use only.
- [ ] Add rollback or manual recovery notes where appropriate.
- [ ] Add tests for dry-run behavior and non-destructive defaults.
- [ ] Record the changed script path in the review output.

Suggested commit: `feat: patch safe support script for recurring issue`

## 7. Knowledge Base Draft

Goal: create a service-desk-readable article from the updated runbook and script behavior.

- [ ] Define the KB draft template.
- [ ] Generate a KB article under `kb/` for the selected recurring issue.
- [ ] Include symptoms, likely cause, agent steps, user-facing wording, escalation triggers, and related runbook/script links.
- [ ] Keep production actions and auto-publish claims out of the article.
- [ ] Make the article understandable to a service desk agent.
- [ ] Include ticket evidence references without exposing personal data.
- [ ] Add a snapshot or content check for the generated KB draft.

Suggested commit: `feat: draft knowledge base article`

## 8. Reviewer Handoff

Goal: produce the enterprise review packet that explains what changed and why.

- [ ] Generate a handoff file under `reviews/`.
- [ ] List changed files with short summaries.
- [ ] Include rationale tied to ticket evidence.
- [ ] Include risks, assumptions, and verification steps.
- [ ] Clearly separate facts, recommendations, and required human approvals.
- [ ] State that no production scripts were executed.
- [ ] Include next steps for service desk lead and operations owner review.

Suggested commit: `feat: create reviewer handoff packet`

## 9. Animated Monitoring View

Goal: show the end-to-end knowledge loop in a replayable local UI.

- [ ] Create local mock event data loaded from JSON.
- [ ] Build the main monitoring layout with nodes for Incident Tickets, Codex App, Codex CLI, Runbook Repo, Support Scripts, and Knowledge Base.
- [ ] Animate ticket cards flowing from Incident Tickets to Codex App.
- [ ] Show Codex App producing the pattern brief.
- [ ] Animate the handoff from Codex App to Codex CLI.
- [ ] Show file-change pulses for Runbook Repo and Support Scripts.
- [ ] Animate both outputs converging into Knowledge Base.
- [ ] Add a timeline with states: ingesting, clustering, briefing, editing, validating, ready for review.
- [ ] Add counters for ticket count, cluster count, files changed, and review status.
- [ ] Add replay controls that do not rerun the pipeline.
- [ ] Verify the UI works on desktop and mobile viewports.

Suggested commit: `feat: add animated knowledge loop monitor`

## 10. Evaluation Harness

Goal: make the demo measurable and protect against hallucinated or unsafe outputs.

- [ ] Add an eval command that runs against golden fixtures.
- [ ] Check whether the correct recurring pattern is selected.
- [ ] Check whether runbook changes cite the expected ticket evidence.
- [ ] Check whether support script changes are scoped and non-destructive.
- [ ] Check whether the KB draft contains clear agent-facing instructions.
- [ ] Penalize hallucinated systems, missing ticket references, and production execution claims.
- [ ] Include the false-positive trap in automated checks.
- [ ] Print a pass/fail summary suitable for demo narration.

Suggested commit: `test: add service desk knowledge loop evals`

## 11. Reset And Replay Workflow

Goal: make the POC easy to rerun during demos.

- [ ] Add a reset command that restores generated demo files to fixture state.
- [ ] Add a demo-run command that executes ingest, clustering, brief generation, runbook/script updates, KB draft, and handoff.
- [ ] Make generated artifacts deterministic where practical.
- [ ] Document which files are generated versus hand-authored fixtures.
- [ ] Add a short troubleshooting section for common local setup issues.
- [ ] Verify a clean reset followed by a demo run produces the expected outputs.

Suggested commit: `chore: add reset and demo replay workflow`

## 12. Enterprise Demo Story

Goal: make the POC easy to present to an enterprise audience.

- [ ] Add a `docs/demo-script.md` with a 5-8 minute talk track.
- [ ] Explain where Codex App is used for triage, summarization, and review.
- [ ] Explain where Codex CLI is used for repository edits and validation.
- [ ] Add a production architecture note covering ITSM connectors, repo integration, identity, audit logging, CI, and KB publishing.
- [ ] Add a safety note covering no production execution, human approval, data minimization, and review records.
- [ ] Add screenshots or screen-capture instructions for the monitoring UI.
- [ ] Add a final acceptance checklist that mirrors the PRD.

Suggested commit: `docs: add enterprise demo narrative`

## 13. Final Acceptance Pass

Goal: confirm the POC satisfies the PRD end to end.

- [ ] A user can run the demo from a local workspace.
- [ ] The demo produces one updated runbook.
- [ ] The demo produces one safe support script change.
- [ ] The demo produces one KB draft.
- [ ] The demo produces one reviewer handoff.
- [ ] The animated monitoring view clearly shows the end-to-end knowledge loop.
- [ ] The POC can be reset by restoring fixture files.
- [ ] No real credentials, real tickets, or production systems are required.
- [ ] Mermaid diagrams in documentation parse successfully.
- [ ] Tests and evals pass from a clean checkout.

Suggested commit: `chore: verify poc acceptance criteria`
