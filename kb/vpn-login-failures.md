# KB Draft: VPN Login Fails After MFA Approval

Status: draft only; requires service desk lead approval before publication
Audience: service desk agents
Source scope: synthetic POC evidence from local ticket fixtures, runbook, and dry-run support helper

## Agent Summary

Use this draft when a user can complete browser SSO or approve MFA, but GlobalProtect VPN then returns `Authentication failed` or loops back to login. The recurring fixture pattern points to stale VPN authentication token or cached IdP session state after an MFA token, device claim, or session change.

This article is not published guidance. It is a reviewable KB draft for the local POC and requires human approval before use in any operational knowledge base.

## Symptoms

- Browser SSO succeeds, but the VPN session fails after MFA is approved.
- GlobalProtect reports `Authentication failed` or returns to the login screen after accepted MFA.
- The user may report a recent MFA token replacement, replacement phone enrollment, or device claim refresh.
- Password reset should not be the first action when browser SSO already succeeds.
- Guardrail: if the VPN fails before MFA is reached, treat it as a possible network-path issue instead of the stale-token pattern.

## Likely Cause

The likely cause is stale VPN authentication token state or cached IdP session state. In the synthetic evidence, resolver teams cleared stale VPN token state, expired cached IdP state, or refreshed a device claim before the user completed a fresh sign-in and reconnected.

## Agent Steps

1. Confirm the ticket is synthetic POC data or an approved review scenario before using this draft.
2. Confirm the user has internet access and is on a managed device.
3. Ask whether browser SSO works outside the VPN client.
4. Ask whether MFA was reached and approved before the VPN failure.
5. Record the ticket ID, exact VPN error text, MFA timing, recent token or device changes, and whether browser SSO succeeds.
6. Run only the local dry-run helper if demonstration evidence is needed: `node scripts/check-vpn-session-demo.mjs --ticket INC-2026-0001 --stage after-mfa`.
7. Do not clear tokens, expire sessions, change VPN profiles, or contact production systems from this article or script.
8. Escalate to Network Access or Identity Ops with the collected evidence when stale token or cached session state is suspected.
9. After the resolver group completes an approved change, ask the user to complete a fresh SSO sign-in, reconnect to VPN, and confirm access to the originally blocked resource.

## User-Facing Wording

"Thanks for confirming that MFA was approved and browser sign-in works. This points away from a password issue and toward cached VPN session state. I am escalating the case with the VPN error text, MFA timing, and recent token or device-change details so the resolver team can review the session state. Please do not reset your password unless we ask you to."

## Escalation Triggers

- MFA is approved, but GlobalProtect still returns `Authentication failed`.
- Browser SSO succeeds while VPN fails after MFA.
- The user recently replaced an MFA token, enrolled a replacement phone, or had a device claim refreshed.
- The user remains blocked after a fresh SSO sign-in and VPN reconnect attempt.
- The case involves privileged token/session review or any resolver action that must be approved by Network Access or Identity Ops.
- Do not use this article for before-MFA failures, hotspot-only success, or SSL fallback cases; those signals point to a network-path workflow.

## Related Runbook And Script

- Runbook: `runbooks/vpn-login-failures.md`
- Safe support helper: `scripts/check-vpn-session-demo.mjs`
- Helper behavior: dry-run only, prints evidence prompts, and exits instead of running non-dry-run mode.

## Evidence References

The evidence below cites ticket IDs and source filenames only. It intentionally avoids personal data, credentials, hostnames, tenant names, and production identifiers.

<!-- prettier-ignore -->
| Ticket | Source file | Relevant evidence |
| --- | --- | --- |
| INC-2026-0001 | `tickets/INC-2026-0001-vpn-token-refresh.md` | Browser SSO succeeded, VPN failed after MFA approval, and stale VPN token state was cleared by the resolver group. |
| INC-2026-0002 | `tickets/INC-2026-0002-vpn-token-refresh.md` | Device compliance and browser SSO were confirmed; logs showed MFA success followed by auth-token mismatch. |
| INC-2026-0003 | `tickets/INC-2026-0003-vpn-token-refresh.md` | Browser SSO succeeded, password reset was avoided, and stale token state tied to a previous MFA device was removed. |
| INC-2026-0004 | `tickets/INC-2026-0004-vpn-token-refresh.md` | Accepted MFA was followed by cached-token rejection; resolver notes mention device claim refresh and stale token cleanup. |
| INC-2026-0013 | `tickets/INC-2026-0013-vpn-false-positive-network.md` | False-positive guardrail: VPN failure occurred before MFA and resolved through SSL fallback for a blocked UDP tunnel. |

## Review And Safety Notes

- Draft only; do not auto-publish.
- Human approval is required before this article is added to any production knowledge base.
- This article does not authorize production execution, token clearing, session expiration, VPN profile changes, or credential handling.
- The linked helper script is for local/demo dry-run output only and does not contact VPN, IdP, network, credential, or production systems.
