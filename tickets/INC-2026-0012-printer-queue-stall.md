---
id: INC-2026-0012
title: HR onboarding printer queue stalled by secure print item
created_at: 2026-04-21T11:07:00+08:00
updated_at: 2026-04-21T12:55:00+08:00
affected_system: PaperCut Print Queue
business_unit: Human Resources
location: Kuala Lumpur Floor 5
severity: S3
status: resolved
symptom: Department printer shows jobs queued but nothing prints until a held secure-print job is removed.
resolver_action: Removed orphaned secure-print job, restarted local print spooler, and verified new onboarding packet print.
synthetic: true
---

## Description

Synthetic enterprise incident ticket for local POC use only. No real user, credential, hostname, or production system is represented.

HR onboarding team could not print badge forms. Printer display was ready, but PaperCut queue showed all jobs waiting behind one held secure-print item.

## Impact

Onboarding packet preparation delayed for new starters.

## Comment History

- 2026-04-21T11:07:00+08:00 - Service Desk: HR reports queued jobs and ready printer display.
- 2026-04-21T11:38:00+08:00 - Workplace Tech: Confirmed no paper jam and print server route is healthy.
- 2026-04-21T12:22:00+08:00 - Workplace Tech: Removed orphaned secure-print job and restarted local spooler.
- 2026-04-21T12:55:00+08:00 - Service Desk: New onboarding packet printed successfully.

## Evidence Notes

- Cluster candidate: Printer queue stalls
- Recurrence signals: PaperCut, ready printer, held secure-print item, resolver removes orphaned job
