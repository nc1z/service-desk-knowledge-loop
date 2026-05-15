import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import {
  buildReviewerHandoff,
  reviewerHandoffSections,
} from "../src/reviews/reviewer-handoff.mjs";

test("reviewer handoff separates required review packet sections", () => {
  const handoff = buildReviewerHandoff();

  for (const section of reviewerHandoffSections) {
    assert.match(handoff, new RegExp(`## ${section}`));
  }

  assert.match(handoff, /## Facts[\s\S]*INC-2026-0001/);
  assert.match(handoff, /## Recommendations[\s\S]*Service desk lead/);
  assert.match(handoff, /## Required Human Approvals[\s\S]*Operations owner/);
});

test("reviewer handoff lists changed files and evidence rationale", () => {
  const handoff = buildReviewerHandoff();

  for (const changedFile of [
    "reviews/incident-pattern-brief-vpn-login-failures.md",
    "runbooks/vpn-login-failures.md",
    "scripts/check-vpn-session-demo.mjs",
    "kb/vpn-login-failures.md",
    "reviews/reviewer-handoff-vpn-login-failures.md",
  ]) {
    assert.match(handoff, new RegExp(escapeRegExp(changedFile)));
  }

  assert.match(handoff, /INC-2026-0001[\s\S]*INC-2026-0004/);
  assert.match(handoff, /false-positive guardrail/i);
});

test("reviewer handoff preserves safety and approval boundaries", () => {
  const handoff = buildReviewerHandoff();

  assert.match(handoff, /No production scripts were executed/);
  assert.match(handoff, /No credentials, real tickets, live ITSM records/);
  assert.match(
    handoff,
    /Observed locally on 2026-05-15: all commands below passed/,
  );
  assert.match(handoff, /do not auto-publish the KB article/);
  assert.match(handoff, /Service desk lead approval is required/);
  assert.match(handoff, /Operations owner approval is required/);
  assert.doesNotMatch(handoff, /we executed production scripts/i);
  assert.doesNotMatch(handoff, /auto-published/i);
});

test("reviewer handoff includes executable verification steps", () => {
  const handoff = buildReviewerHandoff();

  for (const command of [
    "pnpm ingest:tickets",
    "pnpm cluster:incidents",
    "pnpm brief:pattern",
    "pnpm validate:runbooks",
    "pnpm check:vpn-demo",
    "pnpm draft:kb",
    "pnpm handoff:review",
    "pnpm test",
  ]) {
    assert.match(handoff, new RegExp(escapeRegExp(command)));
  }
});

test("committed reviewer handoff matches deterministic builder", async () => {
  const artifact = await readFile(
    "reviews/reviewer-handoff-vpn-login-failures.md",
    "utf8",
  );

  assert.equal(artifact, buildReviewerHandoff());
});

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
