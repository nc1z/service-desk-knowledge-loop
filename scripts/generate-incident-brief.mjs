#!/usr/bin/env node
/* global console, process */
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  clusterTickets,
  writeClusterOutput,
} from "../src/clustering/incidents.mjs";
import {
  expectedBriefPathForCluster,
  generateIncidentPatternBrief,
  loadDocumentationEvidence,
  writeIncidentPatternBrief,
} from "../src/briefing/incident-pattern-brief.mjs";
import { ingestTickets } from "../src/ingestion/tickets.mjs";

const repoRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
const ticketsDir = path.resolve(repoRoot, process.argv[2] ?? "tickets");
const reviewsDir = path.resolve(repoRoot, process.argv[3] ?? "reviews");
const clusterOutputPath = path.resolve(
  repoRoot,
  "generated/incident-clusters.json",
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
  const clusterOutput = clusterTickets(ingestResult.tickets);
  const selectedCluster = clusterOutput.selectedPattern;
  const expectedClusters = JSON.parse(
    await readFile(
      path.resolve(repoRoot, "fixtures/expected-clusters.json"),
      "utf8",
    ),
  );

  if (!selectedCluster) {
    console.error("No high-confidence recurring pattern selected.");
    process.exitCode = 1;
  } else {
    const documentation = await loadDocumentationEvidence(
      repoRoot,
      selectedCluster,
    );
    const brief = generateIncidentPatternBrief({
      cluster: selectedCluster,
      tickets: ingestResult.tickets,
      documentation,
      falsePositiveTraps: expectedClusters.falsePositiveTraps,
    });
    const outputPath = expectedBriefPathForCluster(selectedCluster, reviewsDir);

    await writeClusterOutput(clusterOutputPath, clusterOutput);
    await writeIncidentPatternBrief(outputPath, brief);

    console.log(`Incident pattern brief summary`);
    console.log(`tickets: ${selectedCluster.recurrenceCount}`);
    console.log(`selectedPattern: ${selectedCluster.id}`);
    console.log(`documentation: ${documentation?.path ?? "(none)"}`);
    console.log(`clusterOutput: ${clusterOutputPath}`);
    console.log(`briefOutput: ${outputPath}`);
  }
}
