import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("monitoring event data covers required Phase 9 nodes and states", async () => {
  const data = JSON.parse(
    await readFile("src/data/monitor-events.json", "utf8"),
  );

  assert.deepEqual(
    data.nodes.map((node) => node.label),
    [
      "Incident Tickets",
      "Codex App",
      "Codex CLI",
      "Runbook Repo",
      "Support Scripts",
      "Knowledge Base",
    ],
  );

  assert.deepEqual(
    data.timeline.map((state) => state.id),
    [
      "ingesting",
      "clustering",
      "briefing",
      "editing",
      "validating",
      "ready-for-review",
    ],
  );
  assert.deepEqual(
    data.timeline.map((state) => state.label.toLowerCase()),
    [
      "ingesting",
      "clustering",
      "briefing",
      "editing",
      "validating",
      "ready for review",
    ],
  );
});

test("monitoring event data exposes demo counters and artifacts", async () => {
  const data = JSON.parse(
    await readFile("src/data/monitor-events.json", "utf8"),
  );

  assert.equal(data.counters.ticketCount, 16);
  assert.equal(data.counters.clusterCount, 3);
  assert.equal(data.counters.filesChanged, 2);
  assert.equal(data.counters.reviewStatus, "Ready");
  assert.deepEqual(
    data.tickets.map((ticket) => ticket.id),
    ["INC-2026-0001", "INC-2026-0002", "INC-2026-0003", "INC-2026-0004"],
  );

  for (const artifact of [
    "runbooks/vpn-login-failures.md",
    "scripts/check-vpn-session-demo.mjs",
    "kb/vpn-login-failures.md",
  ]) {
    assert.match(JSON.stringify(data), new RegExp(escapeRegExp(artifact)));
  }
});

test("monitoring UI markup includes replay-only controls and animation surfaces", async () => {
  const source = await readFile("src/main.ts", "utf8");

  assert.match(source, /monitor-events\.json/);
  assert.match(source, /data-action="replay"/);
  assert.match(source, /currentIndex = 0/);
  assert.match(source, /renderState\(\)/);
  assert.doesNotMatch(source, /child_process|exec\(|spawn\(/);

  for (const surface of [
    "ticket-card--flight",
    "brief-card",
    "handoff-token",
    "output-token--runbook",
    "output-token--script",
    "kb-target",
  ]) {
    assert.match(source, new RegExp(surface));
  }
});

test("monitoring CSS supports animation, responsive layout, and reduced motion", async () => {
  const css = await readFile("src/styles.css", "utf8");

  for (const token of [
    "@keyframes ticket-to-app",
    "@keyframes handoff-to-cli",
    "@keyframes output-to-kb",
    "@keyframes file-pulse",
    "@media (prefers-reduced-motion: reduce)",
    "@media (max-width: 1060px)",
    "@media (max-width: 680px)",
  ]) {
    assert.match(css, new RegExp(escapeRegExp(token)));
  }
});

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
