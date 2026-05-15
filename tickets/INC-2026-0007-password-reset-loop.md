---
id: INC-2026-0007
title: Finance approver stuck on password reset page
created_at: 2026-04-14T09:12:00+08:00
updated_at: 2026-04-14T10:58:00+08:00
affected_system: Okta Workforce Identity
business_unit: Finance Operations
location: Hong Kong
severity: S2
status: resolved
symptom: User completes password reset but is immediately prompted to reset again on next SSO login.
resolver_action: Cleared stuck password-expired flag, revoked stale session cookies, and verified ERP approval access.
synthetic: true
---

## Description

Synthetic enterprise incident ticket for local POC use only. No real user, credential, hostname, or production system is represented.

Finance approver was unable to complete time-sensitive invoice approvals because the SSO portal required password reset at every login.

## Impact

User could not access ERP approval queue.

## Comment History

- 2026-04-14T09:12:00+08:00 - Service Desk: User reports three successful password changes with no access restored.
- 2026-04-14T09:37:00+08:00 - Identity Ops: Login events show successful credential validation followed by reset-required redirect.
- 2026-04-14T10:22:00+08:00 - Identity Ops: Cleared password-expired flag and revoked stale sessions.
- 2026-04-14T10:58:00+08:00 - Service Desk: User reached ERP approval queue.

## Evidence Notes

- Cluster candidate: Password reset loops
- Recurrence signals: Okta, reset-required redirect after credential validation, resolver clears flag
