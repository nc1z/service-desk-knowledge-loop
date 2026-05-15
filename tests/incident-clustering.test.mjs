import assert from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import {
  clusterTickets,
  writeClusterOutput,
} from "../src/clustering/incidents.mjs";
import { ingestTickets } from "../src/ingestion/tickets.mjs";

async function loadExpectedClusters() {
  const raw = await readFile("fixtures/expected-clusters.json", "utf8");
  return JSON.parse(raw);
}

test("clusters recurring incidents according to expected fixture groups", async () => {
  const [ingestResult, expected] = await Promise.all([
    ingestTickets("tickets"),
    loadExpectedClusters(),
  ]);

  const output = clusterTickets(ingestResult.tickets);
  const recurringClusters = output.clusters.filter(
    (cluster) => cluster.recurrenceCount > 1,
  );

  assert.equal(ingestResult.summary.invalidFileCount, 0);
  assert.equal(output.recurringClusterCount, expected.clusters.length);
  assert.equal(output.selectedPattern.id, expected.preferredDemoPattern);

  for (const expectedCluster of expected.clusters) {
    const actualCluster = recurringClusters.find(
      (cluster) => cluster.id === expectedCluster.id,
    );

    assert.ok(actualCluster, `missing cluster ${expectedCluster.id}`);
    assert.equal(actualCluster.affectedSystem, expectedCluster.affectedSystem);
    assert.equal(
      actualCluster.recurrenceCount,
      expectedCluster.expectedTicketIds.length,
    );
    assert.deepEqual(
      actualCluster.ticketIds,
      expectedCluster.expectedTicketIds,
    );
    assert.equal(
      actualCluster.sourceFilenames.length,
      actualCluster.ticketIds.length,
    );
    assert.ok(actualCluster.confidence >= 0.85);
    assert.ok(actualCluster.evidenceQuality >= 90);
  }
});

test("keeps false-positive trap tickets out of recurring clusters", async () => {
  const [ingestResult, expected] = await Promise.all([
    ingestTickets("tickets"),
    loadExpectedClusters(),
  ]);

  const output = clusterTickets(ingestResult.tickets);
  const recurringTicketIds = new Set(
    output.clusters
      .filter((cluster) => cluster.recurrenceCount > 1)
      .flatMap((cluster) => cluster.ticketIds),
  );

  for (const trap of expected.falsePositiveTraps) {
    assert.equal(
      recurringTicketIds.has(trap.ticketId),
      false,
      `${trap.ticketId} should remain outside recurring clusters`,
    );
  }
});

test("writes deterministic cluster output artifact", async () => {
  const tempRoot = await mkdtemp(path.join(os.tmpdir(), "incident-clusters-"));
  const outputPath = path.join(tempRoot, "generated", "incident-clusters.json");

  try {
    const ingestResult = await ingestTickets("tickets");
    const output = clusterTickets(ingestResult.tickets);

    await writeClusterOutput(outputPath, output);
    const firstWrite = await readFile(outputPath, "utf8");

    await writeClusterOutput(outputPath, output);
    const secondWrite = await readFile(outputPath, "utf8");

    assert.equal(secondWrite, firstWrite);
    assert.deepEqual(JSON.parse(secondWrite), output);
  } finally {
    await rm(tempRoot, { recursive: true, force: true });
  }
});
