---
id: INC-2026-0010
title: APAC mailroom print queue blocked by orphaned job
created_at: 2026-04-17T14:18:00+08:00
updated_at: 2026-04-17T16:04:00+08:00
affected_system: PaperCut Print Queue
business_unit: Facilities
location: Singapore Mailroom
severity: S3
status: resolved
symptom: Department printer shows jobs queued but nothing prints until a held secure-print job is removed.
resolver_action: Removed orphaned secure-print job, restarted local print spooler, and confirmed badge release works.
synthetic: true
---

## Description

Synthetic enterprise incident ticket for local POC use only. No real user, credential, hostname, or production system is represented.

Mailroom multifunction printer stopped releasing badge-print jobs. Queue inspection found a held secure-print job with no active owner session.

## Impact

Shipping labels and visitor badges were delayed.

## Comment History

- 2026-04-17T14:18:00+08:00 - Service Desk: Facilities reports multiple queued jobs and no printer error on display.
- 2026-04-17T14:52:00+08:00 - Workplace Tech: Printer responds to ping and supplies are healthy.
- 2026-04-17T15:31:00+08:00 - Workplace Tech: Removed orphaned secure-print job and restarted spooler.
- 2026-04-17T16:04:00+08:00 - Service Desk: Badge release and shipping label print verified.

## Evidence Notes

- Cluster candidate: Printer queue stalls
- Recurrence signals: PaperCut, orphaned secure-print job, no hardware fault, resolver restarts spooler
