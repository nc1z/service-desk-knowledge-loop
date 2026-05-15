#!/usr/bin/env node
/* global console, process */
import path from "node:path";
import { fileURLToPath } from "node:url";

import { ingestTickets } from "../src/ingestion/tickets.mjs";

const repoRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
const ticketsDir = path.resolve(repoRoot, process.argv[2] ?? "tickets");
const result = await ingestTickets(ticketsDir);

for (const invalidFile of result.invalidFiles) {
  console.error(`Invalid ticket fixture: ${invalidFile.sourceFile}`);
  for (const error of invalidFile.errors ?? [invalidFile.reason]) {
    console.error(`  ${error}`);
  }
}

for (const unsupportedFile of result.unsupportedFiles) {
  console.error(`Unsupported ticket fixture: ${unsupportedFile.sourceFile}`);
  console.error(`  ${unsupportedFile.reason}`);
}

console.log(`Ticket ingest summary`);
console.log(`tickets: ${result.summary.ticketCount}`);
console.log(`invalidFiles: ${result.summary.invalidFileCount}`);
console.log(`unsupportedFiles: ${result.summary.unsupportedFileCount}`);
console.log(`syntheticOnly: ${result.summary.syntheticOnly}`);

if (result.summary.dateRange) {
  console.log(
    `dateRange: ${result.summary.dateRange.start} to ${result.summary.dateRange.end}`,
  );
}

if (result.summary.affectedSystems.length > 0) {
  console.log(`affectedSystems: ${result.summary.affectedSystems.join(", ")}`);
}

process.exitCode = result.summary.invalidFileCount > 0 ? 1 : 0;
