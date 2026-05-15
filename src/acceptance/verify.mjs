import { readFile } from "node:fs/promises";
import path from "node:path";

import { ingestTickets } from "../ingestion/tickets.mjs";

/* global process */

const requiredScripts = [
  "reset:demo",
  "demo:run",
  "eval:poc",
  "test",
  "dev",
  "build",
  "preview",
];

const requiredArtifacts = [
  "runbooks/vpn-login-failures.md",
  "scripts/check-vpn-session-demo.mjs",
  "kb/vpn-login-failures.md",
  "reviews/reviewer-handoff-vpn-login-failures.md",
  "src/data/monitor-events.json",
];

const mermaidDocs = [
  "README.md",
  "docs/architecture.md",
  "service-desk-knowledge-loop-prd.md",
];

export async function runAcceptanceVerification(repoRoot = process.cwd()) {
  const checks = [];
  const packageJson = await readJson(path.join(repoRoot, "package.json"));
  const readme = await readText(path.join(repoRoot, "README.md"));
  const ingestResult = await ingestTickets(path.join(repoRoot, "tickets"));
  const artifacts = Object.fromEntries(
    await Promise.all(
      requiredArtifacts.map(async (artifactPath) => [
        artifactPath,
        await readText(path.join(repoRoot, artifactPath)),
      ]),
    ),
  );

  checks.push(
    check(
      "local_demo_commands",
      requiredScripts.every((scriptName) => packageJson.scripts?.[scriptName]),
      `package scripts include ${requiredScripts.join(", ")}`,
    ),
  );
  checks.push(
    check(
      "readme_getting_started",
      ["pnpm reset:demo", "pnpm demo:run", "pnpm test", "pnpm dev"].every(
        (command) => readme.includes(command),
      ),
      "README lists the local reset, demo, test, and UI commands",
    ),
  );
  checks.push(
    check(
      "updated_runbook",
      artifacts["runbooks/vpn-login-failures.md"].includes("Status: updated") &&
        artifacts["runbooks/vpn-login-failures.md"].includes("## Evidence"),
      "VPN runbook is updated and evidence-backed",
    ),
  );
  checks.push(
    check(
      "safe_support_script",
      artifacts["scripts/check-vpn-session-demo.mjs"].includes("DEMO ONLY") &&
        artifacts["scripts/check-vpn-session-demo.mjs"].includes(
          "only supports dry-run mode",
        ),
      "support script is demo-only and dry-run guarded",
    ),
  );
  checks.push(
    check(
      "kb_draft",
      artifacts["kb/vpn-login-failures.md"].includes("Status: draft only") &&
        artifacts["kb/vpn-login-failures.md"].includes("## Agent Steps"),
      "KB draft exists with agent-facing instructions",
    ),
  );
  checks.push(
    check(
      "reviewer_handoff",
      artifacts["reviews/reviewer-handoff-vpn-login-failures.md"].includes(
        "## Required Human Approvals",
      ) &&
        artifacts["reviews/reviewer-handoff-vpn-login-failures.md"].includes(
          "No production scripts were executed",
        ),
      "reviewer handoff exists with approvals and safety boundary",
    ),
  );
  checks.push(
    check(
      "animated_monitor",
      containsAll(artifacts["src/data/monitor-events.json"], [
        "Incident Tickets",
        "Codex App",
        "Codex CLI",
        "Runbook Repo",
        "Support Scripts",
        "Knowledge Base",
        "ready-for-review",
      ]),
      "monitor event data covers the end-to-end knowledge loop",
    ),
  );
  checks.push(
    check(
      "reset_supported",
      packageJson.scripts["reset:demo"] === "node scripts/reset-demo.mjs",
      "reset command restores transient demo outputs",
    ),
  );
  checks.push(
    check(
      "synthetic_only",
      ingestResult.summary.syntheticOnly === true &&
        artifacts["scripts/check-vpn-session-demo.mjs"].includes(
          "no VPN, IdP, network, credential, or production system is contacted",
        ),
      "tickets are synthetic and support helper does not contact production systems",
    ),
  );
  checks.push(await verifyMermaidBlocks(repoRoot));

  return summarize(checks);
}

export function formatAcceptanceSummary(result) {
  const lines = [
    "Service Desk Knowledge Loop acceptance verification",
    `status: ${result.ok ? "pass" : "fail"}`,
    `passed: ${result.passed}/${result.total}`,
  ];

  for (const item of result.checks) {
    lines.push(`${item.ok ? "PASS" : "FAIL"} ${item.name}`);
    lines.push(`  ${item.detail}`);
  }

  return lines.join("\n");
}

async function verifyMermaidBlocks(repoRoot) {
  const errors = [];

  for (const docPath of mermaidDocs) {
    const markdown = await readText(path.join(repoRoot, docPath));
    const blocks = [...markdown.matchAll(/```mermaid\n([\s\S]*?)\n```/g)];

    for (const [index, block] of blocks.entries()) {
      const diagram = block[1].trim();
      const hasSupportedStart = /^(flowchart|graph)\s+(LR|TD|TB|RL|BT)/.test(
        diagram,
      );
      const hasEdges = /-->|---|==>/.test(diagram);
      const balancedSquareBrackets =
        count(diagram, "[") === count(diagram, "]");

      if (!hasSupportedStart || !hasEdges || !balancedSquareBrackets) {
        errors.push(`${docPath} mermaid block ${index + 1}`);
      }
    }
  }

  return check(
    "mermaid_diagrams",
    errors.length === 0,
    errors.length === 0
      ? "Mermaid blocks passed local syntax checks"
      : `Mermaid syntax issues: ${errors.join(", ")}`,
  );
}

function check(name, ok, detail) {
  return { name, ok, detail };
}

function summarize(checks) {
  const passed = checks.filter((item) => item.ok).length;

  return {
    ok: passed === checks.length,
    passed,
    failed: checks.length - passed,
    total: checks.length,
    checks,
  };
}

async function readJson(filePath) {
  return JSON.parse(await readText(filePath));
}

async function readText(filePath) {
  return readFile(filePath, "utf8");
}

function containsAll(text, values) {
  return values.every((value) => text.includes(value));
}

function count(text, needle) {
  return text.split(needle).length - 1;
}
