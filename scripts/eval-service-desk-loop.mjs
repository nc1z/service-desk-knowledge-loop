#!/usr/bin/env node
/* global console, process */

import { formatEvalSummary, runServiceDeskEval } from "../src/eval/harness.mjs";

const result = await runServiceDeskEval();

console.log(formatEvalSummary(result));

if (!result.ok) {
  process.exitCode = 1;
}
