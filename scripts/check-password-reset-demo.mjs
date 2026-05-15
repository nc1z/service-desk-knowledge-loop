#!/usr/bin/env node
/* global console, process */

const args = parseArgs(process.argv.slice(2));

if (args.help) {
  printHelp();
  process.exit(0);
}

const ticket = args.ticket ?? "INC-2026-DEMO";
const securityHold = args["security-hold"] === "true";
const repeatedPrompt = args["repeated-prompt"] !== "false";

console.log(
  "DEMO ONLY: no identity provider, credential, user account, or production system is contacted.",
);
console.log(`Ticket: ${ticket}`);
console.log("Mode: dry-run");
console.log(`Repeated prompt after reset: ${repeatedPrompt}`);
console.log(`Security hold indicated: ${securityHold}`);

if (securityHold) {
  console.log(
    "Suggested fixture cluster: false positive / security hold review.",
  );
  console.log(
    "Sample evidence to record: phishing-review hold, supervised reset, security owner note.",
  );
  console.log("Non-action: do not remove real account holds from this script.");
} else if (repeatedPrompt) {
  console.log(
    "Suggested fixture cluster: password reset loops / stuck password-expired flag.",
  );
  console.log(
    "Sample evidence to record: reset completed, next SSO login returns to reset page.",
  );
  console.log(
    "Non-action: do not clear real password flags or revoke sessions from this script.",
  );
} else {
  console.log(
    "Suggested fixture cluster: not enough recurrence evidence for the reset-loop fixture.",
  );
  console.log(
    "Sample evidence to record: portal reached, app dashboard reached, no repeated prompt.",
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
    if (["--ticket", "--security-hold", "--repeated-prompt"].includes(arg)) {
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
  console.log(`Usage: node scripts/check-password-reset-demo.mjs [--ticket INC-2026-0005] [--repeated-prompt true] [--security-hold false]

Local fixture helper for the Service Desk Knowledge Loop POC.
This script prints safe demo triage notes only and never touches production systems.`);
}
