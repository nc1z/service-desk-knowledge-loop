# VPN Login Failures Runbook

Status: intentionally stale fixture for the local POC
Last reviewed: 2025-10-15
Owner: Network Access

## Scope

Use this runbook when a user cannot establish a GlobalProtect VPN session.

This fixture is synthetic and demo-only. It does not describe a real tenant,
hostname, credential, user, or production support action.

## Current Guidance

1. Confirm the user has internet access.
2. Ask the user to restart the VPN client.
3. Confirm the username format is correct.
4. If the user still cannot connect, escalate to Network Access.

## Known Gaps

- Does not separate failures before MFA from failures after MFA approval.
- Does not mention stale authentication tokens after MFA token refresh.
- Does not include a safe way to collect demo evidence before escalation.
- Does not warn agents to keep ISP or UDP tunnel issues out of the token-refresh cluster.

## Escalation

Escalate unresolved cases to Network Access with the ticket ID, client error text,
and whether MFA was reached.
