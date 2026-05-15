---
id: INC-2026-0015
title: Teams meeting add-in missing from Outlook after client update
created_at: 2026-04-24T10:08:00+08:00
updated_at: 2026-04-24T11:37:00+08:00
affected_system: Microsoft Outlook Desktop
business_unit: Marketing
location: Sydney
severity: S4
status: resolved
symptom: User cannot create Teams meeting because the Outlook add-in button is missing.
resolver_action: Re-enabled disabled Teams add-in, cleared Outlook add-in cache, and restarted Outlook.
synthetic: true
---

## Description

Synthetic enterprise incident ticket for local POC use only. No real user, credential, hostname, or production system is represented.

Marketing coordinator lost the Teams Meeting button after an Outlook update. Existing calendar entries were unaffected.

## Impact

User could not send new Teams meeting invitations from Outlook desktop.

## Comment History

- 2026-04-24T10:08:00+08:00 - Service Desk: User reports missing Teams Meeting button.
- 2026-04-24T10:31:00+08:00 - Productivity Apps: Confirmed Teams desktop app signed in and calendar permissions intact.
- 2026-04-24T11:05:00+08:00 - Productivity Apps: Re-enabled disabled add-in and cleared Outlook add-in cache.
- 2026-04-24T11:37:00+08:00 - Service Desk: User restarted Outlook and created Teams invitation.

## Evidence Notes

- Single-incident noise case
- Distinct system and resolver action from repeated clusters
