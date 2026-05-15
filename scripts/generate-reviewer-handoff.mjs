#!/usr/bin/env node
/* global console, process */

import { mkdir, writeFile } from "node:fs/promises";
import { dirname } from "node:path";

import {
  buildReviewerHandoff,
  reviewerHandoffPath,
} from "../src/reviews/reviewer-handoff.mjs";

const outputPath = process.argv[2] ?? reviewerHandoffPath;
const handoff = buildReviewerHandoff();

await mkdir(dirname(outputPath), { recursive: true });
await writeFile(outputPath, handoff);

console.log(`Wrote reviewer handoff: ${outputPath}`);
