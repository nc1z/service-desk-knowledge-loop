---
id: INC-2026-0005
title: User is prompted to reset password after every SSO login
created_at: 2026-04-10T08:05:00+08:00
updated_at: 2026-04-10T12:18:00+08:00
affected_system: Okta Workforce Identity
business_unit: Shared Services
location: Singapore
severity: S3
status: resolved
symptom: User completes password reset but is immediately prompted to reset again on next SSO login.
resolver_action: Cleared stuck password-expired flag, invalidated active sessions, and confirmed normal SSO login.
synthetic: true
---

## Description

Synthetic enterprise incident ticket for local POC use only. No real user, credential, hostname, or production system is represented.

User completed the self-service password reset workflow twice. The portal continued to show the password-expired page at the next login.

## Impact

User could not open HR self-service or finance approval apps through SSO.

## Comment History

- 2026-04-10T08:05:00+08:00 - Service Desk: User reports reset loop after successful password change.
- 2026-04-10T08:47:00+08:00 - Identity Ops: Password policy evaluation shows expired flag still set after reset.
- 2026-04-10T11:36:00+08:00 - Identity Ops: Cleared stuck password-expired flag and invalidated sessions.
- 2026-04-10T12:18:00+08:00 - Service Desk: User confirmed login proceeds to app dashboard.

## Evidence Notes

- Cluster candidate: Password reset loops
- Recurrence signals: Okta, password-expired flag, repeated reset prompts, resolver clears flag
