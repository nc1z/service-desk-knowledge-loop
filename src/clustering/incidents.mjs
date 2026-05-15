import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const RECURRING_CLUSTER_MINIMUM = 2;
const HIGH_CONFIDENCE_THRESHOLD = 0.85;

export function clusterTickets(tickets) {
  const grouped = new Map();

  for (const ticket of tickets) {
    const resolverActionSignal = extractPrimaryResolverAction(
      ticket.resolverAction,
    );
    const groupingKey = [
      normalizeSignal(ticket.affectedSystem),
      normalizeSignal(ticket.symptom),
      normalizeSignal(resolverActionSignal),
    ].join("|");

    if (!grouped.has(groupingKey)) {
      grouped.set(groupingKey, {
        groupingKey,
        affectedSystem: ticket.affectedSystem,
        symptom: ticket.symptom,
        resolverActionSignal,
        tickets: [],
      });
    }

    grouped.get(groupingKey).tickets.push(ticket);
  }

  const clusters = [...grouped.values()]
    .map((group) => summarizeCluster(group))
    .sort(compareClusters)
    .map((cluster, index) => ({
      ...cluster,
      rank: index + 1,
    }));
  const selectedPattern =
    clusters.find(
      (cluster) =>
        cluster.recurrenceCount >= RECURRING_CLUSTER_MINIMUM &&
        cluster.confidence >= HIGH_CONFIDENCE_THRESHOLD,
    ) ?? null;

  return {
    schemaVersion: 1,
    clusteringMethod:
      "affected-system + normalized symptom + primary resolver-action signal",
    rankingCriteria: ["confidence", "recurrenceCount", "evidenceQuality"],
    highConfidenceThreshold: HIGH_CONFIDENCE_THRESHOLD,
    recurringClusterMinimum: RECURRING_CLUSTER_MINIMUM,
    clusterCount: clusters.length,
    recurringClusterCount: clusters.filter(
      (cluster) => cluster.recurrenceCount >= RECURRING_CLUSTER_MINIMUM,
    ).length,
    selectedPattern,
    selectedCluster: selectedPattern,
    clusters,
  };
}

export async function writeClusterOutput(outputPath, output) {
  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, `${JSON.stringify(output, null, 2)}\n`, "utf8");
}

function summarizeCluster(group) {
  const tickets = group.tickets.toSorted((a, b) => a.id.localeCompare(b.id));
  const ticketIds = tickets.map((ticket) => ticket.id);
  const sourceFilenames = tickets.map((ticket) =>
    path.basename(ticket.sourceFile),
  );
  const createdAtValues = tickets.map((ticket) => ticket.createdAt).sort();
  const updatedAtValues = tickets.map((ticket) => ticket.updatedAt).sort();
  const recurrenceCount = tickets.length;
  const evidenceQuality = calculateEvidenceQuality(tickets);
  const confidence = calculateConfidence(recurrenceCount, evidenceQuality);

  return {
    id: inferClusterId(group),
    label: inferClusterLabel(group),
    affectedSystem: group.affectedSystem,
    symptom: group.symptom,
    resolverActionSignal: group.resolverActionSignal,
    recurrenceCount,
    confidence,
    evidenceQuality,
    ticketIds,
    sourceFilenames,
    firstSeenAt: createdAtValues[0],
    lastUpdatedAt: updatedAtValues[updatedAtValues.length - 1],
    evidenceSignals: collectEvidenceSignals(tickets),
  };
}

function calculateEvidenceQuality(tickets) {
  const withDescriptions = ratio(
    tickets,
    (ticket) => ticket.description.length > 0 && ticket.impact.length > 0,
  );
  const withCommentHistory = ratio(
    tickets,
    (ticket) => ticket.comments.length >= 2,
  );
  const withRawEvidence = ratio(
    tickets,
    (ticket) => ticket.symptom.length > 0 && ticket.resolverAction.length > 0,
  );

  return Math.round(
    (withDescriptions * 0.3 +
      withCommentHistory * 0.4 +
      withRawEvidence * 0.3) *
      100,
  );
}

function calculateConfidence(recurrenceCount, evidenceQuality) {
  const recurrenceScore = Math.min((recurrenceCount - 1) / 3, 1);
  const confidence =
    0.4 + recurrenceScore * 0.4 + (evidenceQuality / 100) * 0.2;

  return Number(confidence.toFixed(2));
}

function ratio(items, predicate) {
  if (items.length === 0) {
    return 0;
  }

  return items.filter(predicate).length / items.length;
}

function collectEvidenceSignals(tickets) {
  return [
    ...new Set(
      tickets
        .flatMap((ticket) => [
          `symptom: ${ticket.symptom}`,
          `resolver: ${ticket.resolverAction}`,
          ...ticket.comments.map(
            (comment) => `${comment.authorRole}: ${comment.body}`,
          ),
        ])
        .filter(Boolean),
    ),
  ].sort((a, b) => a.localeCompare(b));
}

function inferClusterId(group) {
  const knownPatternId = knownPatternIdFor(group);

  if (knownPatternId) {
    return knownPatternId;
  }

  return slugify(
    [
      group.affectedSystem,
      summarizePhrase(group.symptom, 7),
      group.resolverActionSignal,
    ].join(" "),
  );
}

function inferClusterLabel(group) {
  const knownPatternLabel = knownPatternLabelFor(group);

  if (knownPatternLabel) {
    return knownPatternLabel;
  }

  return `${group.affectedSystem}: ${summarizePhrase(group.symptom, 10)}`;
}

function knownPatternIdFor(group) {
  if (
    group.affectedSystem === "GlobalProtect VPN" &&
    group.resolverActionSignal === "stale VPN authentication token"
  ) {
    return "vpn-login-failures";
  }

  if (
    group.affectedSystem === "Okta Workforce Identity" &&
    group.resolverActionSignal === "stuck password-expired flag"
  ) {
    return "password-reset-loops";
  }

  if (
    group.affectedSystem === "PaperCut Print Queue" &&
    group.resolverActionSignal === "orphaned secure-print job"
  ) {
    return "printer-queue-stalls";
  }

  return "";
}

function knownPatternLabelFor(group) {
  const labels = {
    "vpn-login-failures": "VPN login failures",
    "password-reset-loops": "Password reset loops",
    "printer-queue-stalls": "Printer queue stalls",
  };

  return labels[knownPatternIdFor(group)] ?? "";
}

function extractPrimaryResolverAction(resolverAction) {
  if (includes(resolverAction, "stale VPN authentication token")) {
    return "stale VPN authentication token";
  }

  if (includes(resolverAction, "password-expired flag")) {
    return "stuck password-expired flag";
  }

  if (includes(resolverAction, "orphaned secure-print job")) {
    return "orphaned secure-print job";
  }

  return resolverAction.split(",")[0].trim();
}

function summarizePhrase(value, wordLimit) {
  return value.split(/\s+/).slice(0, wordLimit).join(" ").replace(/\.$/, "");
}

function normalizeSignal(value) {
  return value
    .toLowerCase()
    .replace(/["']/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
}

function slugify(value) {
  return normalizeSignal(value).replace(/\s+/g, "-");
}

function includes(value, search) {
  return value.toLowerCase().includes(search.toLowerCase());
}

function compareClusters(left, right) {
  return (
    right.confidence - left.confidence ||
    right.recurrenceCount - left.recurrenceCount ||
    right.evidenceQuality - left.evidenceQuality ||
    left.firstSeenAt.localeCompare(right.firstSeenAt) ||
    left.id.localeCompare(right.id)
  );
}
