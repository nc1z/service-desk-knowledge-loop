import assert from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import { clusterTickets } from "../src/clustering/incidents.mjs";
import {
  expectedBriefPathForCluster,
  generateIncidentPatternBrief,
  incidentPatternBriefFormat,
  loadDocumentationEvidence,
  writeIncidentPatternBrief,
} from "../src/briefing/incident-pattern-brief.mjs";
import { ingestTickets } from "../src/ingestion/tickets.mjs";

async function buildSelectedBrief() {
  const ingestResult = await ingestTickets("tickets");
  const clusterOutput = clusterTickets(ingestResult.tickets);
  const cluster = clusterOutput.selectedPattern;
  const documentation = await loadDocumentationEvidence(
    path.resolve("."),
    cluster,
  );
  const brief = generateIncidentPatternBrief({
    cluster,
    tickets: ingestResult.tickets,
    documentation,
    falsePositiveTraps: [
      {
        ticketId: "INC-2026-0013",
        similarTo: "vpn-login-failures",
        reasonToExclude:
          "VPN failure occurs before MFA and is resolved by SSL fallback for a home ISP UDP tunnel issue.",
      },
    ],
  });

  return { brief, cluster, documentation };
}

test("defines the incident-pattern brief review format", () => {
  assert.equal(incidentPatternBriefFormat.schemaVersion, 1);
  assert.deepEqual(incidentPatternBriefFormat.requiredSections, [
    "Brief Metadata",
    "Facts",
    "Ticket Evidence",
    "Suspected Stale Documentation",
    "False-Positive Guardrail",
    "Recommended Next Actions",
    "Review Boundary",
  ]);
  assert.match(incidentPatternBriefFormat.citationRule, /major factual claim/i);
});

test("generates a cited brief for the selected recurring cluster", async () => {
  const { brief, cluster, documentation } = await buildSelectedBrief();

  assert.equal(cluster.id, "vpn-login-failures");
  assert.equal(documentation.path, "runbooks/vpn-login-failures.md");

  for (const section of incidentPatternBriefFormat.requiredSections) {
    assert.match(brief, new RegExp(`## ${section}`));
  }

  assert.match(brief, /## Facts[\s\S]*## Ticket Evidence/);
  assert.match(brief, /## Recommended Next Actions[\s\S]*## Review Boundary/);
  assert.match(brief, /runbooks\/vpn-login-failures\.md/);
  assert.match(brief, /Does not separate failures before MFA/);
  assert.match(brief, /INC-2026-0013/);
  assert.match(brief, /vpn-false-positive-network\.md/);
  assert.match(brief, /do not create KB drafts, handoff packets/);

  for (const [index, ticketId] of cluster.ticketIds.entries()) {
    assert.match(brief, new RegExp(ticketId));
    assert.match(brief, new RegExp(cluster.sourceFilenames[index]));
  }
});

test("writes deterministic review artifact under reviews path", async () => {
  const tempRoot = await mkdtemp(path.join(os.tmpdir(), "incident-brief-"));

  try {
    const { brief, cluster } = await buildSelectedBrief();
    const outputPath = expectedBriefPathForCluster(
      cluster,
      path.join(tempRoot, "reviews"),
    );

    await writeIncidentPatternBrief(outputPath, brief);
    const firstWrite = await readFile(outputPath, "utf8");

    await writeIncidentPatternBrief(outputPath, brief);
    const secondWrite = await readFile(outputPath, "utf8");

    assert.equal(
      outputPath.endsWith("incident-pattern-brief-vpn-login-failures.md"),
      true,
    );
    assert.equal(secondWrite, firstWrite);
    assert.equal(secondWrite, brief);
  } finally {
    await rm(tempRoot, { recursive: true, force: true });
  }
});
