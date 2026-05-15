# Knowledge Base Draft Template

Status: draft only; requires service desk lead approval before publication
Audience: service desk agents
Data boundary: synthetic POC evidence only

## Agent Summary

Briefly state when the article applies and what the service desk agent should confirm first.

## Symptoms

- List observable symptoms in user or tool language.
- Include a guardrail for similar issues that should not use this article.

## Likely Cause

Explain the probable cause in agent-friendly terms without exposing internal-only details that users do not need.

## Agent Steps

1. Confirm prerequisite signals.
2. Collect evidence needed for the ticket.
3. Use only approved, non-destructive checks or demo helpers.
4. Route the case to the right resolver group when human approval or privileged action is required.

## User-Facing Wording

Provide short wording the agent can send to the user without promising a fix before resolver review is complete.

## Escalation Triggers

- List conditions that require escalation.
- Include false-positive signals that point to a different workflow.

## Related Runbook And Script

- Runbook: `runbooks/example.md`
- Safe script helper: `scripts/example-demo.mjs`

## Evidence References

List ticket IDs and source filenames only. Do not include personal data, credentials, real hostnames, or production tenant details.

## Review And Safety Notes

- Draft only; do not auto-publish.
- Do not execute production remediation from this article.
- Human approval is required before any operational change.
