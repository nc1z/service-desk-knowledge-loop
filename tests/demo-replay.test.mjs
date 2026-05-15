import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { access, mkdir, readFile, writeFile } from "node:fs/promises";
import { promisify } from "node:util";
import test from "node:test";

/* global process */

const execFileAsync = promisify(execFile);

test("reset demo removes transient generated artifacts", async () => {
  await mkdir("generated", { recursive: true });
  await writeFile("generated/transient-test.json", "{}\n");
  await writeFile("reviews/incident-pattern-brief.md", "# transient\n");

  const result = await execFileAsync(process.execPath, [
    "scripts/reset-demo.mjs",
  ]);

  assert.match(result.stdout, /Reset demo outputs to fixture state/);
  await assert.rejects(access("generated/transient-test.json"));
  await assert.rejects(access("reviews/incident-pattern-brief.md"));
  await access("generated");
});

test("clean reset followed by demo run produces expected outputs", async () => {
  await execFileAsync(process.execPath, ["scripts/reset-demo.mjs"]);
  const result = await execFileAsync(process.execPath, [
    "scripts/demo-run.mjs",
  ]);

  assert.match(result.stdout, /Demo run complete/);
  assert.match(result.stdout, /Result: PASS/);

  const clusterOutput = JSON.parse(
    await readFile("generated/incident-clusters.json", "utf8"),
  );
  const brief = await readFile(
    "reviews/incident-pattern-brief-vpn-login-failures.md",
    "utf8",
  );
  const kb = await readFile("kb/vpn-login-failures.md", "utf8");
  const handoff = await readFile(
    "reviews/reviewer-handoff-vpn-login-failures.md",
    "utf8",
  );

  assert.equal(clusterOutput.selectedPattern.id, "vpn-login-failures");
  assert.match(brief, /Incident Pattern Brief: VPN login failures/);
  assert.match(kb, /KB Draft: VPN Login Fails After MFA Approval/);
  assert.match(handoff, /Reviewer Handoff: VPN Login Failures/);
});
