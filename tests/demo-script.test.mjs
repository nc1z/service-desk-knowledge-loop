import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("enterprise demo script covers Phase 12 presentation requirements", async () => {
  const markdown = await readFile("docs/demo-script.md", "utf8");

  for (const phrase of [
    "## 5-8 Minute Talk Track",
    "Codex App",
    "Codex CLI",
    "## Production Architecture Note",
    "ITSM connector",
    "Repository integration",
    "Identity",
    "Audit logging",
    "CI",
    "KB publishing",
    "## Safety Note",
    "No production support scripts are executed",
    "human approval",
    "Ticket-derived evidence must be minimized",
    "## Screen Capture Instructions",
    "## Final Acceptance Checklist",
  ]) {
    assert.match(markdown, new RegExp(escapeRegExp(phrase)));
  }
});

test("enterprise demo script acceptance checklist mirrors PRD outcomes", async () => {
  const markdown = await readFile("docs/demo-script.md", "utf8");

  for (const phrase of [
    "run the demo from a local workspace",
    "one updated runbook",
    "one safe support script change",
    "one KB draft",
    "one reviewer handoff",
    "animated monitoring view",
    "reset by restoring fixture files",
    "No real credentials, real tickets, or production systems",
    "Mermaid diagrams",
    "Tests and evals pass",
  ]) {
    assert.match(markdown, new RegExp(escapeRegExp(phrase), "i"));
  }
});

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
