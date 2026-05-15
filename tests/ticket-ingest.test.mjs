import assert from "node:assert/strict";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import {
  ingestTickets,
  parseTicketJson,
  parseTicketMarkdown,
} from "../src/ingestion/tickets.mjs";

const validTicket = `---
id: INC-TEST-0001
title: Synthetic VPN test fixture
created_at: 2026-04-06T08:14:00+08:00
updated_at: 2026-04-06T10:42:00+08:00
affected_system: GlobalProtect VPN
symptom: User receives "Authentication failed" after approving MFA push during VPN login.
resolver_action: Cleared stale VPN authentication token and had user reconnect.
synthetic: true
---

## Description

Synthetic test fixture.

## Impact

User cannot connect to VPN.

## Comment History

- 2026-04-06T08:14:00+08:00 - Service Desk: User reports repeated VPN failure after MFA approval.
`;

test("parses and normalizes a valid markdown ticket", () => {
  const result = parseTicketMarkdown(validTicket, "tickets/INC-TEST-0001.md");

  assert.equal(result.ok, true);
  assert.equal(result.ticket.id, "INC-TEST-0001");
  assert.equal(result.ticket.affectedSystem, "GlobalProtect VPN");
  assert.equal(result.ticket.createdAt, "2026-04-06T00:14:00.000Z");
  assert.equal(result.ticket.comments.length, 1);
  assert.match(result.ticket.description, /Synthetic test fixture/);
  assert.match(result.ticket.rawBody, /Comment History/);
});

test("parses JSON tickets with schema parity", () => {
  const result = parseTicketJson(
    JSON.stringify({
      id: "INC-TEST-0002",
      createdAt: "2026-04-07T08:00:00+08:00",
      updatedAt: "2026-04-07T09:00:00+08:00",
      affectedSystem: "Okta Workforce Identity",
      symptom: "User repeats password reset.",
      resolverAction: "Cleared stuck expired flag.",
      synthetic: true,
      description: "Synthetic JSON ticket.",
      impact: "User cannot access apps.",
      comments: [
        {
          timestamp: "2026-04-07T08:00:00+08:00",
          authorRole: "Service Desk",
          body: "User reports reset loop.",
        },
      ],
    }),
    "tickets/INC-TEST-0002.json",
  );

  assert.equal(result.ok, true);
  assert.equal(result.ticket.id, "INC-TEST-0002");
  assert.equal(result.ticket.sourceType, "json");
});

test("reports missing required fields without throwing", () => {
  const invalidTicket = validTicket.replace(
    "affected_system: GlobalProtect VPN\n",
    "",
  );

  const result = parseTicketMarkdown(invalidTicket, "tickets/bad.md");

  assert.equal(result.ok, false);
  assert.match(
    result.errors.join("\n"),
    /Missing required field: affectedSystem/,
  );
});

test("reports invalid timestamps without throwing", () => {
  const invalidTicket = validTicket.replace(
    "created_at: 2026-04-06T08:14:00+08:00",
    "created_at: not-a-date",
  );

  const result = parseTicketMarkdown(invalidTicket, "tickets/bad-date.md");

  assert.equal(result.ok, false);
  assert.match(result.errors.join("\n"), /Invalid timestamp: createdAt/);
});

test("requires synthetic ticket fixtures", () => {
  const invalidTicket = validTicket.replace(
    "synthetic: true",
    "synthetic: false",
  );

  const result = parseTicketMarkdown(invalidTicket, "tickets/real-ish.md");

  assert.equal(result.ok, false);
  assert.match(result.errors.join("\n"), /must declare synthetic: true/);
});

test("reports malformed front matter without throwing", () => {
  const result = parseTicketMarkdown("id: INC-TEST-0001\n", "tickets/bad.md");

  assert.equal(result.ok, false);
  assert.match(result.errors.join("\n"), /missing front matter/i);
});

test("reports malformed JSON without throwing", () => {
  const result = parseTicketJson("{", "tickets/bad.json");

  assert.equal(result.ok, false);
  assert.match(result.errors.join("\n"), /Malformed JSON/);
});

test("ingests valid tickets and reports unsupported files", async () => {
  const tempRoot = await mkdtemp(path.join(os.tmpdir(), "ticket-ingest-"));
  const ticketDir = path.join(tempRoot, "tickets");

  try {
    await mkdir(ticketDir);
    await writeFile(path.join(ticketDir, "INC-TEST-0001.md"), validTicket);
    await writeFile(path.join(ticketDir, "notes.txt"), "not a ticket");

    const result = await ingestTickets(ticketDir);

    assert.equal(result.summary.ticketCount, 1);
    assert.equal(result.summary.invalidFileCount, 0);
    assert.equal(result.summary.unsupportedFileCount, 1);
    assert.equal(result.summary.syntheticOnly, true);
    assert.deepEqual(result.summary.affectedSystems, ["GlobalProtect VPN"]);
    assert.equal(
      result.unsupportedFiles[0].sourceFile.endsWith("notes.txt"),
      true,
    );
  } finally {
    await rm(tempRoot, { recursive: true, force: true });
  }
});

test("reports duplicate IDs and filename mismatches", async () => {
  const tempRoot = await mkdtemp(path.join(os.tmpdir(), "ticket-ingest-"));
  const ticketDir = path.join(tempRoot, "tickets");

  try {
    await mkdir(ticketDir);
    await writeFile(path.join(ticketDir, "INC-TEST-0001-a.md"), validTicket);
    await writeFile(path.join(ticketDir, "INC-TEST-0001-b.md"), validTicket);
    await writeFile(path.join(ticketDir, "wrong-name.md"), validTicket);

    const result = await ingestTickets(ticketDir);

    assert.equal(result.summary.ticketCount, 1);
    assert.equal(result.summary.invalidFileCount, 2);
    assert.match(
      result.invalidFiles.flatMap((file) => file.errors).join("\n"),
      /Duplicate ticket id|Filename must include ticket id/,
    );
  } finally {
    await rm(tempRoot, { recursive: true, force: true });
  }
});
