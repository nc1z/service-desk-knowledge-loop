#!/usr/bin/env node
/* global console, process */

import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

const steps = [
  ["ingest tickets", ["scripts/ingest-tickets.mjs"]],
  ["cluster incidents", ["scripts/cluster-incidents.mjs"]],
  ["generate pattern brief", ["scripts/generate-incident-brief.mjs"]],
  ["validate runbooks", ["scripts/validate-runbooks.mjs"]],
  [
    "verify safe support helper",
    [
      "scripts/check-vpn-session-demo.mjs",
      "--ticket",
      "INC-2026-0001",
      "--stage",
      "after-mfa",
    ],
  ],
  ["draft knowledge base article", ["scripts/generate-kb-draft.mjs"]],
  ["generate reviewer handoff", ["scripts/generate-reviewer-handoff.mjs"]],
  ["run POC eval", ["scripts/eval-service-desk-loop.mjs"]],
];

console.log("Service Desk Knowledge Loop demo run");

for (const [label, args] of steps) {
  console.log(`\n[demo] ${label}`);

  try {
    const result = await execFileAsync(process.execPath, args);
    printOutput(result.stdout);
    printOutput(result.stderr);
  } catch (error) {
    printOutput(error.stdout);
    printOutput(error.stderr);
    console.error(`[demo] failed: ${label}`);
    process.exitCode = error.code ?? 1;
    break;
  }
}

if (!process.exitCode) {
  console.log(
    "\nDemo run complete. Review generated/, reviews/, kb/, and the local monitor.",
  );
}

function printOutput(output) {
  if (output) {
    console.log(output.trimEnd());
  }
}
