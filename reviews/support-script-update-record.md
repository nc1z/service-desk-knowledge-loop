# Support Script Update Record

## Changed Files

- `scripts/check-vpn-session-demo.mjs`

## Rationale

Patched the selected VPN support helper so the POC can demonstrate safe dry-run evidence collection for `vpn-login-failures`.

Evidence: INC-2026-0001 / `INC-2026-0001-vpn-token-refresh.md`, INC-2026-0002 / `INC-2026-0002-vpn-token-refresh.md`, INC-2026-0003 / `INC-2026-0003-vpn-token-refresh.md`, INC-2026-0004 / `INC-2026-0004-vpn-token-refresh.md`.

## Safety Boundary

The script does not contact VPN, IdP, network, credential, or production systems. Non-dry-run execution is blocked.
