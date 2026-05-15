---
id: INC-2026-0006
title: SSO password reset keeps returning for HR coordinator
created_at: 2026-04-11T10:26:00+08:00
updated_at: 2026-04-11T13:44:00+08:00
affected_system: Okta Workforce Identity
business_unit: Human Resources
location: Kuala Lumpur
severity: S3
status: resolved
symptom: User completes password reset but is immediately prompted to reset again on next SSO login.
resolver_action: Cleared stuck password-expired flag, reset risk-policy state, and asked user to sign in from a fresh browser session.
synthetic: true
---

## Description

Synthetic enterprise incident ticket for local POC use only. No real user, credential, hostname, or production system is represented.

HR coordinator changed password successfully, then encountered the same reset-required page while trying to approve onboarding forms.

## Impact

User could not process new-hire forms during regional onboarding window.

## Comment History

- 2026-04-11T10:26:00+08:00 - Service Desk: Confirmed password reset email was legitimate and completed.
- 2026-04-11T11:04:00+08:00 - Identity Ops: Account audit shows current password accepted but expired flag remains true.
- 2026-04-11T12:58:00+08:00 - Identity Ops: Cleared password-expired flag and reset risk-policy state.
- 2026-04-11T13:44:00+08:00 - Service Desk: User signed in from fresh browser session and reached HR app.

## Evidence Notes

- Cluster candidate: Password reset loops
- Recurrence signals: Okta, current password accepted, expired flag remains true, resolver clears flag
