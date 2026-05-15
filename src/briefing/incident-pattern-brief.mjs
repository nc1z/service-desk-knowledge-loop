import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

export const incidentPatternBriefFormat = {
  schemaVersion: 1,
  requiredSections: [
    "Brief Metadata",
    "Facts",
    "Ticket Evidence",
    "Suspected Stale Documentation",
    "False-Positive Guardrail",
    "Recommended Next Actions",
    "Review Boundary",
  ],
  citationRule:
    "Every major factual claim must cite a ticket ID, source filename, or documentation filename.",
};

const RUNBOOK_BY_PATTERN_ID = {
  "vpn-login-failures": "runbooks/vpn-login-failures.md",
  "password-reset-loops": "runbooks/password-reset-loops.md",
  "printer-queue-stalls": "runbooks/printer-queue-stalls.md",
};

export function expectedBriefPathForCluster(cluster, reviewsDir = "reviews") {
  return path.join(reviewsDir, `incident-pattern-brief-${cluster.id}.md`);
}

export function documentationPathForCluster(cluster) {
  return RUNBOOK_BY_PATTERN_ID[cluster.id] ?? "";
}

export async function loadDocumentationEvidence(repoRoot, cluster) {
  const relativePath = documentationPathForCluster(cluster);

  if (!relativePath) {
    return null;
  }

  const raw = await readFile(path.join(repoRoot, relativePath), "utf8");

  return {
    path: relativePath,
    filename: path.basename(relativePath),
    ...summarizeRunbook(raw),
  };
}

export function generateIncidentPatternBrief({
  cluster,
  tickets,
  documentation,
  falsePositiveTraps = [],
}) {
  if (!cluster) {
    throw new Error(
      "Cannot generate incident-pattern brief without a cluster.",
    );
  }

  const ticketsById = new Map(tickets.map((ticket) => [ticket.id, ticket]));
  const clusterTickets = cluster.ticketIds.map((ticketId) => {
    const ticket = ticketsById.get(ticketId);

    if (!ticket) {
      throw new Error(`Cluster references missing ticket: ${ticketId}`);
    }

    return ticket;
  });
  const evidenceCitations = clusterTickets
    .map((ticket) => `${ticket.id}/${path.basename(ticket.sourceFile)}`)
    .join(", ");
  const sourceFilenames = clusterTickets
    .map((ticket) => path.basename(ticket.sourceFile))
    .join(", ");
  const dateWindow = `${formatDate(cluster.firstSeenAt)} to ${formatDate(
    cluster.lastUpdatedAt,
  )}`;
  const runbookReference = documentation
    ? `${documentation.path}`
    : "no matching runbook file";
  const knownGaps = documentation?.knownGaps ?? [];
  const falsePositiveNotes = formatFalsePositiveNotes(
    falsePositiveTraps,
    ticketsById,
    cluster,
  );

  return `${formatHeader(cluster)}

## Brief Metadata

- Format version: ${incidentPatternBriefFormat.schemaVersion}
- Selected cluster: ${cluster.id} (${cluster.label}); confidence ${formatConfidence(
    cluster.confidence,
  )}; recurrence count ${cluster.recurrenceCount}. Sources: ${evidenceCitations}.
- Cluster method: affected system, normalized symptom, and primary resolver-action signal. Sources: ${sourceFilenames}.
- Suspected stale documentation reviewed: ${runbookReference}${
    documentation?.lastReviewed
      ? `; last reviewed ${documentation.lastReviewed}`
      : ""
  }.

## Facts

- The selected recurring pattern affects ${cluster.affectedSystem} and appears in ${cluster.recurrenceCount} resolved synthetic tickets during ${dateWindow}. Sources: ${evidenceCitations}.
- The shared user-visible symptom is: "${cluster.symptom}" Sources: ${evidenceCitations}.
- The repeated resolver signal is "${cluster.resolverActionSignal}"; ticket resolutions clear or refresh VPN/IdP token state before reconnect. Sources: ${evidenceCitations}.
- Evidence quality is ${cluster.evidenceQuality}/100 because each selected ticket includes descriptions, impact, resolver action, and timestamped comments. Sources: ${evidenceCitations}.

## Ticket Evidence

<!-- prettier-ignore -->
| Ticket | Source file | Evidence |
| --- | --- | --- |
${clusterTickets.map(formatTicketEvidenceRow).join("\n")}

## Suspected Stale Documentation

${formatDocumentationEvidence(documentation, knownGaps)}

## False-Positive Guardrail

${falsePositiveNotes}

## Recommended Next Actions

- In the Phase 5 runbook update, add a branch that distinguishes MFA-approved VPN authentication failures from failures before MFA or ISP/UDP tunnel issues. Basis: ${runbookReference}; ${evidenceCitations}.
- Add agent-facing evidence checks for browser SSO success, MFA approval, stale VPN token or cached IdP session, and successful reconnect after token clearance. Basis: ${evidenceCitations}.
- Keep the resolution scoped to reviewable documentation first; do not create KB drafts, handoff packets, or production automation in this phase. Basis: Phase 4 scope in PLAN.md and selected ticket evidence ${evidenceCitations}.

## Review Boundary

- This brief is a review artifact only; it does not update runbooks, create KB content, create reviewer handoff output, execute scripts, or touch production systems. Sources: PLAN.md; ${evidenceCitations}.
`;
}

export async function writeIncidentPatternBrief(outputPath, markdown) {
  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, markdown, "utf8");
}

function formatHeader(cluster) {
  return `# Incident Pattern Brief: ${cluster.label}`;
}

function formatTicketEvidenceRow(ticket) {
  const evidence = [
    `symptom: ${ticket.symptom}`,
    `resolver: ${ticket.resolverAction}`,
  ].join("; ");

  return `| ${escapeTable(ticket.id)} | ${escapeTable(
    path.basename(ticket.sourceFile),
  )} | ${escapeTable(evidence)} |`;
}

function formatDocumentationEvidence(documentation, knownGaps) {
  if (!documentation) {
    return "- No matching stale documentation file was found for this selected cluster. Source: selected cluster metadata.";
  }

  const statusLine = documentation.status
    ? `- ${documentation.path} declares "${documentation.status}" and is therefore treated as suspected stale documentation. Source: ${documentation.path}.`
    : `- ${documentation.path} is treated as suspected stale documentation for this selected cluster. Source: ${documentation.path}.`;

  if (knownGaps.length === 0) {
    return `${statusLine}\n- No explicit known-gap bullets were found. Source: ${documentation.path}.`;
  }

  const gapLines = knownGaps
    .map((gap) => `- Known gap: ${gap} Source: ${documentation.path}.`)
    .join("\n");

  return `${statusLine}\n${gapLines}`;
}

function formatFalsePositiveNotes(falsePositiveTraps, ticketsById, cluster) {
  const relatedTraps = falsePositiveTraps.filter(
    (trap) => trap.similarTo === cluster.id,
  );

  if (relatedTraps.length === 0) {
    return "- No false-positive trap is defined for this selected cluster. Source: fixtures/expected-clusters.json.";
  }

  return relatedTraps
    .map((trap) => {
      const ticket = ticketsById.get(trap.ticketId);
      const filename = ticket
        ? path.basename(ticket.sourceFile)
        : "unknown file";

      return `- Exclude ${trap.ticketId}/${filename}: ${trap.reasonToExclude} Source: fixtures/expected-clusters.json; ${trap.ticketId}/${filename}.`;
    })
    .join("\n");
}

function summarizeRunbook(raw) {
  return {
    status: matchLineValue(raw, "Status"),
    lastReviewed: matchLineValue(raw, "Last reviewed"),
    owner: matchLineValue(raw, "Owner"),
    knownGaps: extractBulletSection(raw, "Known Gaps"),
  };
}

function matchLineValue(raw, label) {
  const match = raw.match(new RegExp(`^${escapeRegExp(label)}:\\s*(.*)$`, "m"));

  return match?.[1]?.trim() ?? "";
}

function extractBulletSection(raw, heading) {
  const match = raw.match(
    new RegExp(
      `## ${escapeRegExp(heading)}\\r?\\n\\r?\\n([\\s\\S]*?)(?:\\r?\\n## |\\r?\\n?$)`,
    ),
  );

  if (!match) {
    return [];
  }

  return match[1]
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.startsWith("- "))
    .map((line) => line.slice(2).trim());
}

function formatConfidence(value) {
  return `${Math.round(value * 100)}%`;
}

function formatDate(value) {
  return value.slice(0, 10);
}

function escapeTable(value) {
  return String(value).replace(/\|/g, "\\|").replace(/\r?\n/g, " ");
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
