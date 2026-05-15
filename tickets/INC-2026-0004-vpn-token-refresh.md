---
id: INC-2026-0004
title: Engineering contractor VPN login loops after MFA approval
created_at: 2026-04-09T13:11:00+08:00
updated_at: 2026-04-09T15:02:00+08:00
affected_system: GlobalProtect VPN
business_unit: Product Engineering
location: Sydney
severity: S3
status: resolved
symptom: User receives "Authentication failed" after approving MFA push during VPN login.
resolver_action: Cleared stale VPN authentication token, refreshed IdP device claim, and validated access to source repository gateway.
synthetic: true
---

## Description

Synthetic enterprise incident ticket for local POC use only. No real user, credential, hostname, or production system is represented.

Contractor could authenticate to standard SaaS applications but could not establish VPN. VPN client showed repeated login prompts after approved MFA.

## Impact

User could not access source repository gateway or internal package registry.

## Comment History

- 2026-04-09T13:11:00+08:00 - Service Desk: Confirmed managed device certificate is valid.
- 2026-04-09T13:46:00+08:00 - Network Access: Logs show accepted MFA and rejected cached auth token.
- 2026-04-09T14:33:00+08:00 - Identity Ops: Refreshed device claim and cleared stale VPN token.
- 2026-04-09T15:02:00+08:00 - Service Desk: Contractor connected and reached repository gateway.

## Evidence Notes

- Cluster candidate: VPN login failures
- Recurrence signals: GlobalProtect, accepted MFA, stale token, resolver clears token cache
