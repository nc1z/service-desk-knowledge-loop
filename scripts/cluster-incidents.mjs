#!/usr/bin/env node
/* global console, process */
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  clusterTickets,
  writeClusterOutput,
} from "../src/clustering/incidents.mjs";
import { ingestTickets } from "../src/ingestion/tickets.mjs";

const repoRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
const ticketsDir = path.resolve(repoRoot, process.argv[2] ?? "tickets");
const outputPath = path.resolve(
  repoRoot,
  process.argv[3] ?? "generated/incident-clusters.json",
);
const ingestResult = await ingestTickets(ticketsDir);

for (const invalidFile of ingestResult.invalidFiles) {
  console.error(`Invalid ticket fixture: ${invalidFile.sourceFile}`);
  for (const error of invalidFile.errors ?? [invalidFile.reason]) {
    console.error(`  ${error}`);
  }
}

for (const unsupportedFile of ingestResult.unsupportedFiles) {
  console.error(`Unsupported ticket fixture: ${unsupportedFile.sourceFile}`);
  console.error(`  ${unsupportedFile.reason}`);
}

if (ingestResult.summary.invalidFileCount > 0) {
  process.exitCode = 1;
} else {
  const output = clusterTickets(ingestResult.tickets);
  await writeClusterOutput(outputPath, output);

  console.log(`Incident clustering summary`);
  console.log(`tickets: ${ingestResult.summary.ticketCount}`);
  console.log(`clusters: ${output.clusterCount}`);
  console.log(`recurringClusters: ${output.recurringClusterCount}`);
  console.log(
    `selectedPattern: ${output.selectedPattern?.id ?? "(none selected)"}`,
  );
  console.log(`output: ${outputPath}`);
}
