# Password Reset Loops Runbook

Status: intentionally stale fixture for the local POC
Last reviewed: 2025-09-30
Owner: Identity Operations

## Scope

Use this runbook when a user reports repeated SSO password reset prompts.

This fixture is synthetic and demo-only. It does not describe a real identity
tenant, credential, user, or production support action.

## Current Guidance

1. Confirm the user completed the self-service password reset flow.
2. Ask the user to close the browser and try a new session.
3. Confirm the user can reach the SSO portal.
4. If the reset prompt returns, escalate to Identity Operations.

## Known Gaps

- Does not mention a stuck password-expired flag after a successful reset.
- Does not distinguish routine reset loops from security holds after phishing review.
- Does not capture session invalidation or risk-policy state as evidence.
- Does not give agents a safe local checklist for documenting recurrence.

## Escalation

Escalate unresolved cases to Identity Operations with the ticket ID, reset
timestamp, whether the user reached the app dashboard, and any security-hold note.
