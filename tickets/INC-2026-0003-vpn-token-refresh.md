---
id: INC-2026-0003
title: Remote user cannot establish VPN tunnel after MFA
created_at: 2026-04-08T07:48:00+08:00
updated_at: 2026-04-08T09:31:00+08:00
affected_system: GlobalProtect VPN
business_unit: Customer Support
location: Manila
severity: S3
status: resolved
symptom: User receives "Authentication failed" after approving MFA push during VPN login.
resolver_action: Cleared stale VPN authentication token and asked user to complete a new SSO sign-in before reconnecting.
synthetic: true
---

## Description

Synthetic enterprise incident ticket for local POC use only. No real user, credential, hostname, or production system is represented.

Support agent could not connect to VPN at shift start. The agent had recently enrolled a replacement phone for MFA.

## Impact

User could not reach internal ticket escalation tools from home network.

## Comment History

- 2026-04-08T07:48:00+08:00 - Service Desk: User reports MFA approval followed by VPN authentication failure.
- 2026-04-08T08:16:00+08:00 - Service Desk: Password reset not attempted because browser SSO succeeds.
- 2026-04-08T08:59:00+08:00 - Network Access: Removed stale GlobalProtect token entry tied to previous MFA device.
- 2026-04-08T09:31:00+08:00 - Service Desk: User completed fresh SSO sign-in and connected to VPN.

## Evidence Notes

- Cluster candidate: VPN login failures
- Recurrence signals: GlobalProtect, MFA device change, SSO succeeds, resolver clears token cache
