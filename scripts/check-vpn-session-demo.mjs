#!/usr/bin/env node
/* global console, process */

const args = parseArgs(process.argv.slice(2));

if (args.help) {
  printHelp();
  process.exit(0);
}

const ticket = args.ticket ?? "INC-2026-DEMO";
const stage = args.stage ?? "after-mfa";

if (!["before-mfa", "after-mfa"].includes(stage)) {
  fail('Invalid --stage. Use "before-mfa" or "after-mfa".');
}

console.log(
  "DEMO ONLY: no VPN, IdP, network, credential, or production system is contacted.",
);
console.log(`Ticket: ${ticket}`);
console.log("Mode: dry-run");
console.log(`Observed login stage: ${stage}`);

if (stage === "after-mfa") {
  console.log(
    "Suggested fixture cluster: VPN login failures / stale auth token.",
  );
  console.log(
    "Sample evidence to record: MFA approved, GlobalProtect rejected session, token refresh recent.",
  );
  console.log("Non-action: do not clear real tokens from this script.");
} else {
  console.log(
    "Suggested fixture cluster: possible false positive / network path issue.",
  );
  console.log(
    "Sample evidence to record: MFA not reached, compare hotspot or SSL fallback notes.",
  );
  console.log("Non-action: do not change real VPN profiles from this script.");
}

function parseArgs(argv) {
  const parsed = {};
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--help" || arg === "-h") {
      parsed.help = true;
      continue;
    }
    if (arg === "--ticket" || arg === "--stage") {
      const value = argv[index + 1];
      if (!value || value.startsWith("--")) {
        fail(`Missing value for ${arg}.`);
      }
      parsed[arg.slice(2)] = value;
      index += 1;
      continue;
    }
    fail(`Unknown argument: ${arg}`);
  }
  return parsed;
}

function fail(message) {
  console.error(message);
  console.error("Run with --help for usage.");
  process.exit(1);
}

function printHelp() {
  console.log(`Usage: node scripts/check-vpn-session-demo.mjs [--ticket INC-2026-0001] [--stage after-mfa]

Local fixture helper for the Service Desk Knowledge Loop POC.
This script prints safe demo triage notes only and never touches production systems.`);
}
