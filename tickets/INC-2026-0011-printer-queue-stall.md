---
id: INC-2026-0011
title: Finance printer queue not releasing queued invoices
created_at: 2026-04-20T08:58:00+08:00
updated_at: 2026-04-20T10:49:00+08:00
affected_system: PaperCut Print Queue
business_unit: Finance Operations
location: Hong Kong Floor 8
severity: S3
status: resolved
symptom: Department printer shows jobs queued but nothing prints until a held secure-print job is removed.
resolver_action: Removed orphaned secure-print job, restarted local print spooler, and re-submitted failed invoice batch.
synthetic: true
---

## Description

Synthetic enterprise incident ticket for local POC use only. No real user, credential, hostname, or production system is represented.

Finance users reported a stalled invoice print batch. Queue showed a held secure-print job submitted the prior evening and all new jobs behind it remained pending.

## Impact

Invoice mailing workflow paused for the morning batch.

## Comment History

- 2026-04-20T08:58:00+08:00 - Service Desk: Users report new jobs stay pending behind a held item.
- 2026-04-20T09:29:00+08:00 - Workplace Tech: Hardware checks pass; print server shows queue blockage.
- 2026-04-20T10:12:00+08:00 - Workplace Tech: Removed orphaned secure-print job and restarted spooler.
- 2026-04-20T10:49:00+08:00 - Service Desk: Invoice batch re-submitted and printed successfully.

## Evidence Notes

- Cluster candidate: Printer queue stalls
- Recurrence signals: PaperCut, held job blocks queue, hardware checks pass, resolver removes orphaned job
