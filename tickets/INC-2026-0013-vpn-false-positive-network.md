---
id: INC-2026-0013
title: VPN login fails because home ISP blocks UDP tunnel
created_at: 2026-04-22T18:20:00+08:00
updated_at: 2026-04-22T20:10:00+08:00
affected_system: GlobalProtect VPN
business_unit: Executive Office
location: Remote
severity: S2
status: resolved
symptom: User receives "Connection failed" while attempting VPN login from home network.
resolver_action: Switched VPN client to SSL fallback profile and confirmed ISP router firmware was blocking UDP tunnel traffic.
synthetic: true
---

## Description

Synthetic enterprise incident ticket for local POC use only. No real user, credential, hostname, or production system is represented.

Executive assistant could not connect to VPN from home, but the login did not reach MFA. Mobile hotspot worked, which pointed away from identity token issues.

## Impact

User could not reach executive calendar delegation tools from the home network.

## Comment History

- 2026-04-22T18:20:00+08:00 - Service Desk: User reports VPN connection failure before MFA prompt.
- 2026-04-22T18:55:00+08:00 - Network Access: Same laptop connects over mobile hotspot; home ISP path suspected.
- 2026-04-22T19:42:00+08:00 - Network Access: Enabled SSL fallback profile; UDP tunnel blocked by ISP router firmware.
- 2026-04-22T20:10:00+08:00 - Service Desk: User connected from home with SSL fallback profile.

## Evidence Notes

- False-positive trap: Similar VPN symptom but different root cause from stale token cluster
- Do not merge with VPN token-refresh incidents: MFA prompt was never reached and resolver action was network-profile fallback
