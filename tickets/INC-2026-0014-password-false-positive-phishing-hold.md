---
id: INC-2026-0014
title: Password reset prompt caused by security hold after phishing report
created_at: 2026-04-23T09:41:00+08:00
updated_at: 2026-04-23T13:19:00+08:00
affected_system: Okta Workforce Identity
business_unit: Procurement
location: Singapore
severity: S2
status: resolved
symptom: User sees password reset required during SSO login.
resolver_action: Security team reviewed phishing report, removed temporary account hold, and user completed one supervised password reset.
synthetic: true
---

## Description

Synthetic enterprise incident ticket for local POC use only. No real user, credential, hostname, or production system is represented.

Procurement user saw a reset-required screen after reporting a suspicious email. Unlike the reset-loop cluster, this was an intentional security hold and cleared after investigation.

## Impact

User could not access supplier onboarding portal until security review completed.

## Comment History

- 2026-04-23T09:41:00+08:00 - Service Desk: User reports password reset page after phishing report.
- 2026-04-23T10:25:00+08:00 - Security Operations: Temporary account hold applied by phishing-response playbook.
- 2026-04-23T12:44:00+08:00 - Security Operations: Removed hold after message review and endpoint check.
- 2026-04-23T13:19:00+08:00 - Service Desk: User completed one supervised reset and reached supplier portal.

## Evidence Notes

- False-positive trap: Similar password reset symptom but different root cause from stuck expired-flag cluster
- Do not merge with password reset loop incidents: reset prompt was intentional and did not recur after security hold removal
