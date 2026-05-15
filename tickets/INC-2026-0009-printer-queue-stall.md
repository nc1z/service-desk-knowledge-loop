---
id: INC-2026-0009
title: Floor 12 printer queue stalls on held secure print job
created_at: 2026-04-16T09:33:00+08:00
updated_at: 2026-04-16T11:41:00+08:00
affected_system: PaperCut Print Queue
business_unit: Legal
location: Singapore Floor 12
severity: S3
status: resolved
symptom: Department printer shows jobs queued but nothing prints until a held secure-print job is removed.
resolver_action: Removed orphaned secure-print job, restarted local print spooler, and released pending jobs.
synthetic: true
---

## Description

Synthetic enterprise incident ticket for local POC use only. No real user, credential, hostname, or production system is represented.

Legal team printer accepted new jobs but did not print. Queue displayed one held secure-print item at the top and multiple pending jobs behind it.

## Impact

Department could not print time-sensitive contract packets.

## Comment History

- 2026-04-16T09:33:00+08:00 - Service Desk: Users report jobs stuck behind a held secure-print item.
- 2026-04-16T10:05:00+08:00 - Workplace Tech: Printer hardware online; no paper or toner alerts.
- 2026-04-16T11:12:00+08:00 - Workplace Tech: Removed orphaned secure-print job and restarted local spooler.
- 2026-04-16T11:41:00+08:00 - Service Desk: Pending jobs released and users confirmed printing.

## Evidence Notes

- Cluster candidate: Printer queue stalls
- Recurrence signals: PaperCut, held secure-print job, hardware online, resolver removes orphaned job
