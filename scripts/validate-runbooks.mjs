#!/usr/bin/env node
/* global console, process */
import { readFile } from "node:fs/promises";

import { validateRunbookMarkdown } from "../src/runbooks/validate.mjs";

const runbookPath = process.argv[2] ?? "runbooks/vpn-login-failures.md";
const markdown = await readFile(runbookPath, "utf8");
const result = validateRunbookMarkdown(markdown);

if (result.ok) {
  console.log(`Runbook validation passed: ${runbookPath}`);
} else {
  console.error(`Runbook validation failed: ${runbookPath}`);
  for (const error of result.errors) {
    console.error(`- ${error}`);
  }
  process.exitCode = 1;
}
