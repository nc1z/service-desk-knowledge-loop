---
id: INC-2026-0001
title: VPN login fails after MFA token refresh
created_at: 2026-04-06T08:14:00+08:00
updated_at: 2026-04-06T10:42:00+08:00
affected_system: GlobalProtect VPN
business_unit: Finance Operations
location: Singapore
severity: S2
status: resolved
symptom: User receives "Authentication failed" after approving MFA push during VPN login.
resolver_action: Cleared stale VPN authentication token, forced IdP session refresh, and had user reconnect.
synthetic: true
---

## Description

Synthetic enterprise incident ticket for local POC use only. No real user, credential, hostname, or production system is represented.

Finance analyst could sign in to web SSO but GlobalProtect VPN rejected the session immediately after the MFA approval. The issue started after the user's hardware token was replaced the prior week.

## Impact

User could not access internal finance file shares or ERP reporting from a managed laptop while working remotely.

## Comment History

- 2026-04-06T08:14:00+08:00 - Service Desk: User reports repeated VPN failure after MFA approval. Confirmed internet access and correct username.
- 2026-04-06T08:39:00+08:00 - Identity Ops: SSO sign-in succeeds; stale VPN token cache suspected after token refresh.
- 2026-04-06T10:15:00+08:00 - Network Access: Cleared GlobalProtect auth token record and requested fresh IdP session.
- 2026-04-06T10:42:00+08:00 - Service Desk: User confirmed VPN connection succeeds after reconnect.

## Evidence Notes

- Cluster candidate: VPN login failures
- Recurrence signals: GlobalProtect, MFA approval succeeds, stale authentication token, resolver clears token cache
