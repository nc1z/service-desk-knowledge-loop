import assert from "node:assert/strict";
import test from "node:test";

import {
  checkSafetyBoundaries,
  formatEvalSummary,
  runServiceDeskEval,
} from "../src/eval/harness.mjs";

test("service desk eval passes the golden fixture outputs", async () => {
  const result = await runServiceDeskEval();

  assert.equal(result.ok, true, formatEvalSummary(result));
  assert.equal(result.failed, 0);
  assert.match(formatEvalSummary(result), /Demo narration:/);
  assert.match(formatEvalSummary(result), /selected the expected VPN pattern/i);
});

test("service desk eval penalizes hallucinated systems and production claims", () => {
  const result = checkSafetyBoundaries({
    kbMarkdown:
      "The agent connected to production, cleared real tokens, and updated ServiceNow.",
  });

  assert.equal(result.ok, false);
  assert.match(result.message, /production execution/i);
  assert.match(result.message, /servicenow/i);
});
