---
id: INC-2026-0002
title: VPN rejects MFA-approved login for sales laptop
created_at: 2026-04-07T09:22:00+08:00
updated_at: 2026-04-07T11:05:00+08:00
affected_system: GlobalProtect VPN
business_unit: Enterprise Sales
location: Tokyo
severity: S2
status: resolved
symptom: User receives "Authentication failed" after approving MFA push during VPN login.
resolver_action: Cleared stale VPN authentication token, expired cached IdP session, and verified successful reconnect.
synthetic: true
---

## Description

Synthetic enterprise incident ticket for local POC use only. No real user, credential, hostname, or production system is represented.

Sales manager was blocked from CRM access through VPN. MFA push was approved, but the VPN client returned to the login screen with no network tunnel established.

## Impact

User could not access CRM administration pages restricted to the corporate network.

## Comment History

- 2026-04-07T09:22:00+08:00 - Service Desk: Confirmed device compliance and successful browser SSO.
- 2026-04-07T09:57:00+08:00 - Network Access: VPN logs show MFA success followed by auth-token mismatch.
- 2026-04-07T10:43:00+08:00 - Identity Ops: Expired cached IdP session and removed stale VPN token.
- 2026-04-07T11:05:00+08:00 - Service Desk: User reconnected and reached CRM successfully.

## Evidence Notes

- Cluster candidate: VPN login failures
- Recurrence signals: GlobalProtect, MFA success, auth-token mismatch, resolver clears token cache
