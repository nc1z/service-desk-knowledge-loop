---
id: INC-2026-0008
title: Contact center user cannot exit SSO password reset flow
created_at: 2026-04-15T06:52:00+08:00
updated_at: 2026-04-15T08:27:00+08:00
affected_system: Okta Workforce Identity
business_unit: Customer Support
location: Manila
severity: S3
status: resolved
symptom: User completes password reset but is immediately prompted to reset again on next SSO login.
resolver_action: Cleared stuck password-expired flag and confirmed user could launch contact center tools.
synthetic: true
---

## Description

Synthetic enterprise incident ticket for local POC use only. No real user, credential, hostname, or production system is represented.

Contact center user completed password reset before shift start. Login redirected back to reset page instead of the application launcher.

## Impact

User could not open call queue dashboard at shift start.

## Comment History

- 2026-04-15T06:52:00+08:00 - Service Desk: User reports reset loop from managed laptop and mobile browser.
- 2026-04-15T07:20:00+08:00 - Identity Ops: Password history updated correctly; expired flag remains active.
- 2026-04-15T08:03:00+08:00 - Identity Ops: Cleared stuck password-expired flag on account.
- 2026-04-15T08:27:00+08:00 - Service Desk: User reached application launcher and contact center dashboard.

## Evidence Notes

- Cluster candidate: Password reset loops
- Recurrence signals: Okta, password history updated, expired flag remains active, resolver clears flag
