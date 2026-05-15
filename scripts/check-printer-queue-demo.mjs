#!/usr/bin/env node
/* global console, process */

const args = parseArgs(process.argv.slice(2));

if (args.help) {
  printHelp();
  process.exit(0);
}

const ticket = args.ticket ?? "INC-2026-DEMO";
const hardwareOnline = args["hardware-online"] !== "false";
const heldSecureJob = args["held-secure-job"] !== "false";

console.log(
  "DEMO ONLY: no print server, spooler, printer, queue, or production system is contacted.",
);
console.log(`Ticket: ${ticket}`);
console.log("Mode: dry-run");
console.log(`Hardware online: ${hardwareOnline}`);
console.log(`Held secure-print job observed: ${heldSecureJob}`);

if (hardwareOnline && heldSecureJob) {
  console.log(
    "Suggested fixture cluster: printer queue stalls / orphaned secure-print job.",
  );
  console.log(
    "Sample evidence to record: PaperCut queue blocked, pending jobs behind held item.",
  );
  console.log(
    "Non-action: do not remove real print jobs or restart real spoolers from this script.",
  );
} else if (!hardwareOnline) {
  console.log(
    "Suggested fixture cluster: not the queue-stall fixture; check hardware path first.",
  );
  console.log(
    "Sample evidence to record: printer offline, panel alert, or supply issue.",
  );
} else {
  console.log(
    "Suggested fixture cluster: insufficient evidence for orphaned secure-print job.",
  );
  console.log(
    "Sample evidence to record: queue state, top job status, affected location.",
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
    if (["--ticket", "--hardware-online", "--held-secure-job"].includes(arg)) {
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
  console.log(`Usage: node scripts/check-printer-queue-demo.mjs [--ticket INC-2026-0009] [--hardware-online true] [--held-secure-job true]

Local fixture helper for the Service Desk Knowledge Loop POC.
This script prints safe demo triage notes only and never touches production systems.`);
}
