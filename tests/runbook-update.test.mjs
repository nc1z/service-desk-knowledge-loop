import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import {
  requiredRunbookSections,
  validateRunbookMarkdown,
} from "../src/runbooks/validate.mjs";

test("updated VPN runbook has required sections and evidence citations", async () => {
  const markdown = await readFile("runbooks/vpn-login-failures.md", "utf8");
  const result = validateRunbookMarkdown(markdown);

  assert.equal(result.ok, true, result.errors.join("\n"));

  for (const section of requiredRunbookSections) {
    assert.match(markdown, new RegExp(`## ${section}`));
  }

  assert.match(markdown, /INC-2026-0001-vpn-token-refresh\.md/);
  assert.match(markdown, /INC-2026-0013-vpn-false-positive-network\.md/);
  assert.match(markdown, /## Evidence[\s\S]*auth-token mismatch/);
  assert.match(markdown, /Do not execute production scripts/);
});

test("runbook update record lists the changed runbook path", async () => {
  const record = await readFile("reviews/runbook-update-record.md", "utf8");

  assert.match(record, /runbooks\/vpn-login-failures\.md/);
  assert.match(record, /No production script was executed/);
});

test("runbook validation reports missing required sections", () => {
  const result = validateRunbookMarkdown(`# Minimal Runbook

## Scope

Only a scope section.
`);

  assert.equal(result.ok, false);
  assert.match(result.errors.join("\n"), /Current Symptoms/);
  assert.match(result.errors.join("\n"), /Evidence/);
});
