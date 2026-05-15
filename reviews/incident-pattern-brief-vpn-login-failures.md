# Incident Pattern Brief: VPN login failures

## Brief Metadata

- Format version: 1
- Selected cluster: vpn-login-failures (VPN login failures); confidence 100%; recurrence count 4. Sources: INC-2026-0001/INC-2026-0001-vpn-token-refresh.md, INC-2026-0002/INC-2026-0002-vpn-token-refresh.md, INC-2026-0003/INC-2026-0003-vpn-token-refresh.md, INC-2026-0004/INC-2026-0004-vpn-token-refresh.md.
- Cluster method: affected system, normalized symptom, and primary resolver-action signal. Sources: INC-2026-0001-vpn-token-refresh.md, INC-2026-0002-vpn-token-refresh.md, INC-2026-0003-vpn-token-refresh.md, INC-2026-0004-vpn-token-refresh.md.
- Suspected stale documentation reviewed: runbooks/vpn-login-failures.md; last reviewed 2025-10-15.

## Facts

- The selected recurring pattern affects GlobalProtect VPN and appears in 4 resolved synthetic tickets during 2026-04-06 to 2026-04-09. Sources: INC-2026-0001/INC-2026-0001-vpn-token-refresh.md, INC-2026-0002/INC-2026-0002-vpn-token-refresh.md, INC-2026-0003/INC-2026-0003-vpn-token-refresh.md, INC-2026-0004/INC-2026-0004-vpn-token-refresh.md.
- The shared user-visible symptom is: "User receives "Authentication failed" after approving MFA push during VPN login." Sources: INC-2026-0001/INC-2026-0001-vpn-token-refresh.md, INC-2026-0002/INC-2026-0002-vpn-token-refresh.md, INC-2026-0003/INC-2026-0003-vpn-token-refresh.md, INC-2026-0004/INC-2026-0004-vpn-token-refresh.md.
- The repeated resolver signal is "stale VPN authentication token"; ticket resolutions clear or refresh VPN/IdP token state before reconnect. Sources: INC-2026-0001/INC-2026-0001-vpn-token-refresh.md, INC-2026-0002/INC-2026-0002-vpn-token-refresh.md, INC-2026-0003/INC-2026-0003-vpn-token-refresh.md, INC-2026-0004/INC-2026-0004-vpn-token-refresh.md.
- Evidence quality is 100/100 because each selected ticket includes descriptions, impact, resolver action, and timestamped comments. Sources: INC-2026-0001/INC-2026-0001-vpn-token-refresh.md, INC-2026-0002/INC-2026-0002-vpn-token-refresh.md, INC-2026-0003/INC-2026-0003-vpn-token-refresh.md, INC-2026-0004/INC-2026-0004-vpn-token-refresh.md.

## Ticket Evidence

<!-- prettier-ignore -->
| Ticket | Source file | Evidence |
| --- | --- | --- |
| INC-2026-0001 | INC-2026-0001-vpn-token-refresh.md | symptom: User receives "Authentication failed" after approving MFA push during VPN login.; resolver: Cleared stale VPN authentication token, forced IdP session refresh, and had user reconnect. |
| INC-2026-0002 | INC-2026-0002-vpn-token-refresh.md | symptom: User receives "Authentication failed" after approving MFA push during VPN login.; resolver: Cleared stale VPN authentication token, expired cached IdP session, and verified successful reconnect. |
| INC-2026-0003 | INC-2026-0003-vpn-token-refresh.md | symptom: User receives "Authentication failed" after approving MFA push during VPN login.; resolver: Cleared stale VPN authentication token and asked user to complete a new SSO sign-in before reconnecting. |
| INC-2026-0004 | INC-2026-0004-vpn-token-refresh.md | symptom: User receives "Authentication failed" after approving MFA push during VPN login.; resolver: Cleared stale VPN authentication token, refreshed IdP device claim, and validated access to source repository gateway. |

## Suspected Stale Documentation

- runbooks/vpn-login-failures.md declares "intentionally stale fixture for the local POC" and is therefore treated as suspected stale documentation. Source: runbooks/vpn-login-failures.md.
- Known gap: Does not separate failures before MFA from failures after MFA approval. Source: runbooks/vpn-login-failures.md.
- Known gap: Does not mention stale authentication tokens after MFA token refresh. Source: runbooks/vpn-login-failures.md.
- Known gap: Does not include a safe way to collect demo evidence before escalation. Source: runbooks/vpn-login-failures.md.
- Known gap: Does not warn agents to keep ISP or UDP tunnel issues out of the token-refresh cluster. Source: runbooks/vpn-login-failures.md.

## False-Positive Guardrail

- Exclude INC-2026-0013/INC-2026-0013-vpn-false-positive-network.md: VPN failure occurs before MFA and is resolved by SSL fallback for a home ISP UDP tunnel issue. Source: fixtures/expected-clusters.json; INC-2026-0013/INC-2026-0013-vpn-false-positive-network.md.

## Recommended Next Actions

- In the Phase 5 runbook update, add a branch that distinguishes MFA-approved VPN authentication failures from failures before MFA or ISP/UDP tunnel issues. Basis: runbooks/vpn-login-failures.md; INC-2026-0001/INC-2026-0001-vpn-token-refresh.md, INC-2026-0002/INC-2026-0002-vpn-token-refresh.md, INC-2026-0003/INC-2026-0003-vpn-token-refresh.md, INC-2026-0004/INC-2026-0004-vpn-token-refresh.md.
- Add agent-facing evidence checks for browser SSO success, MFA approval, stale VPN token or cached IdP session, and successful reconnect after token clearance. Basis: INC-2026-0001/INC-2026-0001-vpn-token-refresh.md, INC-2026-0002/INC-2026-0002-vpn-token-refresh.md, INC-2026-0003/INC-2026-0003-vpn-token-refresh.md, INC-2026-0004/INC-2026-0004-vpn-token-refresh.md.
- Keep the resolution scoped to reviewable documentation first; do not create KB drafts, handoff packets, or production automation in this phase. Basis: Phase 4 scope in PLAN.md and selected ticket evidence INC-2026-0001/INC-2026-0001-vpn-token-refresh.md, INC-2026-0002/INC-2026-0002-vpn-token-refresh.md, INC-2026-0003/INC-2026-0003-vpn-token-refresh.md, INC-2026-0004/INC-2026-0004-vpn-token-refresh.md.

## Review Boundary

- This brief is a review artifact only; it does not update runbooks, create KB content, create reviewer handoff output, execute scripts, or touch production systems. Sources: PLAN.md; INC-2026-0001/INC-2026-0001-vpn-token-refresh.md, INC-2026-0002/INC-2026-0002-vpn-token-refresh.md, INC-2026-0003/INC-2026-0003-vpn-token-refresh.md, INC-2026-0004/INC-2026-0004-vpn-token-refresh.md.
