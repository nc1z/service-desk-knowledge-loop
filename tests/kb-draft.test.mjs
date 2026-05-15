import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import {
  buildVpnLoginFailuresKbDraft,
  vpnLoginFailuresKbTemplate,
} from "../src/kb/vpn-login-failures-draft.mjs";

test("VPN KB draft follows the service desk article template", async () => {
  const markdown = await readFile("kb/vpn-login-failures.md", "utf8");

  for (const section of vpnLoginFailuresKbTemplate) {
    assert.match(markdown, new RegExp(`## ${section}`));
  }

  assert.match(markdown, /service desk agents/);
  assert.match(markdown, /stale VPN authentication token/);
  assert.match(markdown, /browser SSO/i);
  assert.match(markdown, /MFA was reached and approved/);
  assert.match(markdown, /Please do not reset your password/);
  assert.match(markdown, /Network Access or Identity Ops/);
});

test("VPN KB draft cites synthetic evidence and related artifacts", async () => {
  const markdown = await readFile("kb/vpn-login-failures.md", "utf8");

  for (const citation of [
    "INC-2026-0001",
    "INC-2026-0002",
    "INC-2026-0003",
    "INC-2026-0004",
    "INC-2026-0013",
    "tickets/INC-2026-0001-vpn-token-refresh.md",
    "tickets/INC-2026-0013-vpn-false-positive-network.md",
    "runbooks/vpn-login-failures.md",
    "scripts/check-vpn-session-demo.mjs",
  ]) {
    assert.match(markdown, new RegExp(escapeRegExp(citation)));
  }

  assert.match(markdown, /synthetic POC evidence/);
  assert.match(markdown, /avoids personal data/);
});

test("VPN KB draft preserves safety boundaries", async () => {
  const markdown = await readFile("kb/vpn-login-failures.md", "utf8");

  assert.match(markdown, /Draft only; do not auto-publish/);
  assert.match(markdown, /Human approval is required/);
  assert.match(markdown, /dry-run only/);
  assert.match(
    markdown,
    /does not contact VPN, IdP, network, credential, or production systems/,
  );
  assert.match(markdown, /Do not clear tokens/);

  assert.doesNotMatch(markdown, /auto-published/i);
  assert.doesNotMatch(markdown, /automatically publish/i);
  assert.doesNotMatch(markdown, /run against production/i);
  assert.doesNotMatch(markdown, /clear real tokens/i);
});

test("generated VPN KB artifact matches the deterministic builder", async () => {
  const markdown = await readFile("kb/vpn-login-failures.md", "utf8");

  assert.equal(markdown, buildVpnLoginFailuresKbDraft());
});

test("KB draft template records required safety and article sections", async () => {
  const markdown = await readFile(
    "kb/knowledge-base-draft-template.md",
    "utf8",
  );

  assert.match(markdown, /Status: draft only/);
  assert.match(markdown, /## Symptoms/);
  assert.match(markdown, /## Agent Steps/);
  assert.match(markdown, /## User-Facing Wording/);
  assert.match(markdown, /## Escalation Triggers/);
  assert.match(markdown, /## Evidence References/);
  assert.match(markdown, /do not auto-publish/);
  assert.match(markdown, /Human approval is required/);
});

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
