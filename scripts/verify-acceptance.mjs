#!/usr/bin/env node
/* global console, process */

import {
  formatAcceptanceSummary,
  runAcceptanceVerification,
} from "../src/acceptance/verify.mjs";

const result = await runAcceptanceVerification();

console.log(formatAcceptanceSummary(result));

if (!result.ok) {
  process.exitCode = 1;
}
