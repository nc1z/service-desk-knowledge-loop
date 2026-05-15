#!/usr/bin/env node
/* global console, process */

const args = parseArgs(process.argv.slice(2));

if (args.help) {
  printHelp();
  process.exit(0);
}

const ticket = args.ticket ?? "INC-2026-DEMO";
const stage = args.stage ?? "after-mfa";
const dryRun = args["dry-run"] !== "false";

if (!["before-mfa", "after-mfa"].includes(stage)) {
  fail('Invalid --stage. Use "before-mfa" or "after-mfa".');
}

if (!/^INC-\d{4}-(?:\d{4}|DEMO)$/.test(ticket)) {
  fail('Invalid --ticket. Use a synthetic ID such as "INC-2026-0001".');
}

if (!dryRun) {
  fail("This demo script only supports dry-run mode. Use --dry-run true.");
}

console.log(
  "DEMO ONLY: no VPN, IdP, network, credential, or production system is contacted.",
);
console.log(`Ticket: ${ticket}`);
console.log(`Mode: ${dryRun ? "dry-run" : "blocked"}`);
console.log(`Observed login stage: ${stage}`);

if (stage === "after-mfa") {
  console.log(
    "Suggested fixture cluster: VPN login failures / stale auth token.",
  );
  console.log(
    "Sample evidence to record: MFA approved, GlobalProtect rejected session, token refresh recent.",
  );
  console.log("Non-action: do not clear real tokens from this script.");
  console.log(
    "Manual recovery note: if this were approved production guidance, Network Access would review token/session state in the governed admin console and document the change in the ticket.",
  );
} else {
  console.log(
    "Suggested fixture cluster: possible false positive / network path issue.",
  );
  console.log(
    "Sample evidence to record: MFA not reached, compare hotspot or SSL fallback notes.",
  );
  console.log("Non-action: do not change real VPN profiles from this script.");
  console.log(
    "Manual recovery note: keep before-MFA failures on the network-path branch and escalate with ISP/SSL fallback evidence.",
  );
}

function parseArgs(argv) {
  const parsed = {};
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--help" || arg === "-h") {
      parsed.help = true;
      continue;
    }
    if (["--ticket", "--stage", "--dry-run"].includes(arg)) {
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
  console.log(`Usage: node scripts/check-vpn-session-demo.mjs [--ticket INC-2026-0001] [--stage after-mfa] [--dry-run true]

Local fixture helper for the Service Desk Knowledge Loop POC.
This script prints safe demo triage notes only, defaults to dry-run mode, and never touches production systems.`);
}
