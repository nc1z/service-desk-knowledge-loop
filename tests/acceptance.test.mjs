import assert from "node:assert/strict";
import test from "node:test";

import {
  formatAcceptanceSummary,
  runAcceptanceVerification,
} from "../src/acceptance/verify.mjs";

test("acceptance verifier passes the PRD completion criteria", async () => {
  const result = await runAcceptanceVerification();

  assert.equal(result.ok, true, formatAcceptanceSummary(result));
  assert.equal(result.failed, 0);
  assert.deepEqual(
    result.checks.map((item) => item.name),
    [
      "local_demo_commands",
      "readme_getting_started",
      "updated_runbook",
      "safe_support_script",
      "kb_draft",
      "reviewer_handoff",
      "animated_monitor",
      "reset_supported",
      "synthetic_only",
      "mermaid_diagrams",
    ],
  );
});

test("acceptance summary is readable for final demo review", async () => {
  const summary = formatAcceptanceSummary(await runAcceptanceVerification());

  assert.match(summary, /status: pass/);
  assert.match(summary, /PASS local_demo_commands/);
  assert.match(summary, /PASS mermaid_diagrams/);
  assert.doesNotMatch(summary, /FAIL/);
});
