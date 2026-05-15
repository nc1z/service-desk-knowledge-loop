#!/usr/bin/env node
/* global console */

import { mkdir, rm } from "node:fs/promises";

const transientPaths = [
  "generated",
  "reviews/incident-pattern-brief.md",
  "generated/clusters.json",
  "generated/incident-clusters.json",
];

for (const transientPath of transientPaths) {
  await rm(transientPath, { force: true, recursive: true });
}

await mkdir("generated", { recursive: true });

console.log("Reset demo outputs to fixture state.");
console.log("Removed transient generated artifacts.");
console.log(
  "Hand-authored fixtures remain in tickets/, runbooks/, scripts/, kb/, and reviews/.",
);
