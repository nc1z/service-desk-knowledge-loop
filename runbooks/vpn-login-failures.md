# VPN Login Failures Runbook

Status: updated from synthetic incident evidence for the local POC
Last reviewed: 2026-05-15
Owner: Network Access

## Scope

Use this runbook when a user reaches MFA, approves the prompt, and then receives `Authentication failed` from GlobalProtect VPN.

This fixture is synthetic and demo-only. It does not describe a real tenant, hostname, credential, user, or production support action.

## Current Symptoms

- User can complete browser SSO or MFA, but GlobalProtect rejects the VPN session after MFA approval.
- Recent MFA token replacement, device-claim refresh, or cached IdP session state may be present.
- The likely resolver signal is a stale VPN authentication token or cached IdP session, not a password reset or ISP tunnel issue.

Evidence: INC-2026-0001 / `INC-2026-0001-vpn-token-refresh.md`, INC-2026-0002 / `INC-2026-0002-vpn-token-refresh.md`, INC-2026-0003 / `INC-2026-0003-vpn-token-refresh.md`, INC-2026-0004 / `INC-2026-0004-vpn-token-refresh.md`.

## Triage Steps

1. Confirm the user has internet access and is using a managed device.
2. Confirm browser SSO succeeds before changing any VPN state.
3. Ask whether MFA was reached and approved.
4. If MFA was approved and VPN still shows `Authentication failed`, collect the ticket ID, VPN error text, MFA timing, and whether a token or device claim changed recently.
5. Keep before-MFA connection failures separate from this pattern; those may indicate ISP, UDP tunnel, or profile fallback issues.

Evidence: INC-2026-0001 / `INC-2026-0001-vpn-token-refresh.md`, INC-2026-0002 / `INC-2026-0002-vpn-token-refresh.md`, INC-2026-0013 / `INC-2026-0013-vpn-false-positive-network.md`.

## Resolver Actions

- For this synthetic POC, the documented resolver action is to clear or refresh stale VPN authentication token state and require a fresh IdP session before reconnect.
- Validate that the user can reconnect to VPN and reach the originally blocked internal resource.
- Do not run production remediation from this runbook; use it as reviewable guidance for a later approved operational process.

Evidence: INC-2026-0001 / `INC-2026-0001-vpn-token-refresh.md`, INC-2026-0002 / `INC-2026-0002-vpn-token-refresh.md`, INC-2026-0003 / `INC-2026-0003-vpn-token-refresh.md`, INC-2026-0004 / `INC-2026-0004-vpn-token-refresh.md`.

## False-Positive Guardrails

- If VPN fails before MFA is reached, do not merge the ticket into the stale-token pattern.
- If hotspot or SSL fallback resolves the issue, treat it as a network-path case rather than a token-refresh case.

Evidence: INC-2026-0013 / `INC-2026-0013-vpn-false-positive-network.md`.

## Escalation

Escalate unresolved cases to Network Access with the ticket ID, client error text, whether MFA was reached, whether browser SSO succeeds, recent token/device changes, and the attempted resolver action.

## Evidence

<!-- prettier-ignore -->
| Ticket | Source file | Evidence |
| --- | --- | --- |
| INC-2026-0001 | INC-2026-0001-vpn-token-refresh.md | Browser SSO succeeded, VPN failed after MFA approval, and Network Access cleared the GlobalProtect auth token before successful reconnect. |
| INC-2026-0002 | INC-2026-0002-vpn-token-refresh.md | Device compliance and browser SSO were confirmed, VPN logs showed MFA success followed by auth-token mismatch, and Identity Ops expired cached IdP state. |
| INC-2026-0003 | INC-2026-0003-vpn-token-refresh.md | Browser SSO succeeded, password reset was avoided, and Network Access removed a stale token tied to the previous MFA device. |
| INC-2026-0004 | INC-2026-0004-vpn-token-refresh.md | Logs showed accepted MFA and rejected cached auth token; Identity Ops refreshed the device claim and cleared stale VPN token state. |
| INC-2026-0013 | INC-2026-0013-vpn-false-positive-network.md | False-positive guardrail: VPN failure occurred before MFA and resolved through SSL fallback for blocked UDP tunnel traffic. |

## Safety Notes

- Synthetic POC fixture only.
- No credentials, production hostnames, real tenant identifiers, or live ITSM connectors are required.
- Do not execute production scripts or clear real authentication tokens from this repository.
