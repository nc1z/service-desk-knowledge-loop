# Printer Queue Stalls Runbook

Status: intentionally stale fixture for the local POC
Last reviewed: 2025-08-20
Owner: Workplace Technology

## Scope

Use this runbook when a department printer accepts jobs but nothing prints.

This fixture is synthetic and demo-only. It does not describe a real print
server, printer, queue, credential, or production support action.

## Current Guidance

1. Confirm the printer is powered on.
2. Check for paper, toner, and visible hardware alerts.
3. Ask one user to resend a small test job.
4. If the queue remains blocked, escalate to Workplace Technology.

## Known Gaps

- Does not mention held secure-print jobs blocking pending jobs.
- Does not capture whether PaperCut shows an orphaned secure-print item.
- Does not include demo-safe evidence collection before spooler restart.
- Does not define what agents should record after pending jobs release.

## Escalation

Escalate unresolved cases to Workplace Technology with the ticket ID, printer
location, whether hardware is online, and whether a held secure-print item appears.
