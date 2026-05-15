import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import test from "node:test";

const execFileAsync = promisify(execFile);

test("VPN helper defaults to dry-run and prints harmless evidence guidance", async () => {
  const { stdout } = await execFileAsync("node", [
    "scripts/check-vpn-session-demo.mjs",
    "--ticket",
    "INC-2026-0001",
    "--stage",
    "after-mfa",
  ]);

  assert.match(stdout, /Mode: dry-run/);
  assert.match(stdout, /DEMO ONLY/);
  assert.match(stdout, /Non-action: do not clear real tokens/);
  assert.match(stdout, /Manual recovery note/);
});

test("VPN helper blocks non-dry-run execution", async () => {
  await assert.rejects(
    execFileAsync("node", [
      "scripts/check-vpn-session-demo.mjs",
      "--ticket",
      "INC-2026-0001",
      "--stage",
      "after-mfa",
      "--dry-run",
      "false",
    ]),
    /only supports dry-run mode/,
  );
});

test("VPN helper validates ticket IDs", async () => {
  await assert.rejects(
    execFileAsync("node", [
      "scripts/check-vpn-session-demo.mjs",
      "--ticket",
      "REAL-123",
    ]),
    /Invalid --ticket/,
  );
});
