#!/usr/bin/env node
/* global console, process */

import { mkdir, writeFile } from "node:fs/promises";
import { dirname } from "node:path";

import {
  buildVpnLoginFailuresKbDraft,
  vpnLoginFailuresKbPath,
} from "../src/kb/vpn-login-failures-draft.mjs";

const outputPath = process.argv[2] ?? vpnLoginFailuresKbPath;
const draft = buildVpnLoginFailuresKbDraft();

await mkdir(dirname(outputPath), { recursive: true });
await writeFile(outputPath, draft);

console.log(`Wrote KB draft: ${outputPath}`);
