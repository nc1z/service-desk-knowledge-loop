import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

const SUPPORTED_EXTENSIONS = new Set([".json", ".md"]);

export const ticketSchema = {
  requiredFields: [
    "id",
    "createdAt",
    "updatedAt",
    "affectedSystem",
    "symptom",
    "resolverAction",
    "synthetic",
  ],
  requiredSections: ["Description", "Impact", "Comment History"],
};

export async function ingestTickets(ticketsDir = "tickets") {
  const entries = await readdir(ticketsDir, { withFileTypes: true });
  const filenames = entries
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b));
  const tickets = [];
  const invalidFiles = [];
  const unsupportedFiles = [];
  const seenIds = new Set();

  for (const filename of filenames) {
    const sourceFile = path.join(ticketsDir, filename);
    const extension = path.extname(filename).toLowerCase();

    if (!SUPPORTED_EXTENSIONS.has(extension)) {
      unsupportedFiles.push({
        sourceFile,
        reason: `Unsupported ticket file extension "${extension || "(none)"}".`,
      });
      continue;
    }

    const raw = await readFile(sourceFile, "utf8");
    const result =
      extension === ".json"
        ? parseTicketJson(raw, sourceFile)
        : parseTicketMarkdown(raw, sourceFile);

    if (!result.ok) {
      invalidFiles.push({
        sourceFile,
        reason: result.errors.join("; "),
        errors: result.errors,
      });
      continue;
    }

    const filenameErrors = validateFilenameAndId(
      filename,
      result.ticket,
      seenIds,
    );
    if (filenameErrors.length > 0) {
      invalidFiles.push({
        sourceFile,
        reason: filenameErrors.join("; "),
        errors: filenameErrors,
      });
      continue;
    }

    seenIds.add(result.ticket.id);
    tickets.push(result.ticket);
  }

  return {
    tickets,
    invalidFiles,
    unsupportedFiles,
    summary: summarizeIngest(
      filenames,
      tickets,
      invalidFiles,
      unsupportedFiles,
    ),
  };
}

export function parseTicketMarkdown(raw, sourceFile = "inline.md") {
  const frontmatterMatch = raw.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);

  if (!frontmatterMatch) {
    return {
      ok: false,
      errors: ["Markdown ticket is missing front matter."],
    };
  }

  let frontmatter;

  try {
    frontmatter = parseSimpleYaml(frontmatterMatch[1]);
  } catch (error) {
    return {
      ok: false,
      errors: [
        error instanceof Error ? error.message : "Invalid front matter.",
      ],
    };
  }

  const body = raw.slice(frontmatterMatch[0].length);
  return normalizeParsedTicket(frontmatter, body, sourceFile);
}

export function parseTicketJson(raw, sourceFile = "inline.json") {
  let parsed;

  try {
    parsed = JSON.parse(raw);
  } catch {
    return {
      ok: false,
      errors: ["Malformed JSON ticket fixture."],
    };
  }

  if (!isRecord(parsed)) {
    return {
      ok: false,
      errors: ["JSON ticket must contain an object."],
    };
  }

  return normalizeParsedTicket(parsed, formatJsonBody(parsed), sourceFile);
}

function normalizeParsedTicket(parsed, body, sourceFile) {
  const normalized = {
    id: stringValue(parsed, ["id", "ticket_id", "ticketId"]).toUpperCase(),
    title: stringValue(parsed, ["title"]),
    sourceFile,
    sourceType: path.extname(sourceFile).slice(1),
    createdAt: timestampValue(parsed, ["created_at", "createdAt"]),
    updatedAt: timestampValue(parsed, ["updated_at", "updatedAt"]),
    affectedSystem: stringValue(parsed, [
      "affected_system",
      "affectedSystem",
      "system",
    ]),
    businessUnit: stringValue(parsed, ["business_unit", "businessUnit"]),
    location: stringValue(parsed, ["location"]),
    severity: stringValue(parsed, ["severity"]),
    status: stringValue(parsed, ["status"]),
    symptom: stringValue(parsed, ["symptom"]),
    resolverAction: stringValue(parsed, [
      "resolver_action",
      "resolverAction",
      "resolution",
    ]),
    synthetic: firstValue(parsed, ["synthetic"]),
    description: extractSection(body, "Description"),
    impact: extractSection(body, "Impact"),
    evidenceNotes: extractSection(body, "Evidence Notes"),
    comments: parseCommentHistory(body),
    rawBody: body.trim(),
  };

  const errors = validateNormalizedTicket(normalized, body);

  if (errors.length > 0) {
    return { ok: false, errors };
  }

  return { ok: true, ticket: normalized };
}

function validateNormalizedTicket(ticket, body) {
  const errors = [];

  for (const field of ticketSchema.requiredFields) {
    if (ticket[field] === "" || ticket[field] === undefined) {
      errors.push(`Missing required field: ${field}`);
    }
  }

  if (ticket.createdAt === "INVALID_TIMESTAMP") {
    errors.push("Invalid timestamp: createdAt");
  }

  if (ticket.updatedAt === "INVALID_TIMESTAMP") {
    errors.push("Invalid timestamp: updatedAt");
  }

  if (ticket.synthetic !== true) {
    errors.push("Ticket fixture must declare synthetic: true");
  }

  for (const section of ticketSchema.requiredSections) {
    if (!body.includes(`## ${section}`)) {
      errors.push(`Missing required section: ${section}`);
    }
  }

  if (ticket.comments.length === 0) {
    errors.push(
      "Comment History must contain at least one timestamped comment.",
    );
  }

  return errors;
}

function validateFilenameAndId(filename, ticket, seenIds) {
  const errors = [];

  if (!filename.includes(ticket.id)) {
    errors.push(`Filename must include ticket id: ${ticket.id}`);
  }

  if (seenIds.has(ticket.id)) {
    errors.push(`Duplicate ticket id: ${ticket.id}`);
  }

  return errors;
}

function parseSimpleYaml(raw) {
  const parsed = {};

  for (const [index, line] of raw.split(/\r?\n/).entries()) {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    const separatorIndex = trimmed.indexOf(":");
    if (separatorIndex === -1) {
      throw new Error(`Invalid front matter line ${index + 1}.`);
    }

    const key = trimmed.slice(0, separatorIndex).trim();
    const value = trimmed.slice(separatorIndex + 1).trim();

    if (!key) {
      throw new Error(`Invalid front matter line ${index + 1}.`);
    }

    parsed[key] = coerceYamlScalar(value);
  }

  return parsed;
}

function coerceYamlScalar(value) {
  if (value === "true") {
    return true;
  }

  if (value === "false") {
    return false;
  }

  return stripWrappingQuotes(value);
}

function stripWrappingQuotes(value) {
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1);
  }

  return value;
}

function parseCommentHistory(body) {
  const commentSection = body.match(
    /## Comment History\r?\n\r?\n(?<comments>[\s\S]*?)(?:\r?\n## |\r?\n?$)/,
  );

  if (!commentSection?.groups?.comments) {
    return [];
  }

  return commentSection.groups.comments
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.startsWith("- "))
    .map((line) => line.slice(2).match(/^(.*?) - ([^:]+): (.*)$/))
    .filter(Boolean)
    .filter((match) => !Number.isNaN(Date.parse(match[1])))
    .map((match) => ({
      timestamp: new Date(match[1]).toISOString(),
      authorRole: match[2],
      body: match[3],
    }));
}

function formatJsonBody(rawTicket) {
  const comments = Array.isArray(rawTicket.comments) ? rawTicket.comments : [];
  const commentLines = comments.map(
    (comment) =>
      `- ${comment.timestamp} - ${comment.authorRole ?? comment.author ?? "Unknown"}: ${comment.body}`,
  );
  const evidenceNotes = Array.isArray(rawTicket.evidenceNotes)
    ? rawTicket.evidenceNotes.map((note) => `- ${note}`).join("\n")
    : (rawTicket.evidenceNotes ?? "");

  return `## Description

${rawTicket.description ?? ""}

## Impact

${rawTicket.impact ?? ""}

## Comment History

${commentLines.join("\n")}

## Evidence Notes

${evidenceNotes}
`;
}

function extractSection(body, section) {
  const match = body.match(
    new RegExp(
      `## ${section}\\r?\\n\\r?\\n([\\s\\S]*?)(?:\\r?\\n## |\\r?\\n?$)`,
    ),
  );
  return match?.[1]?.trim() ?? "";
}

function summarizeIngest(filenames, tickets, invalidFiles, unsupportedFiles) {
  return {
    totalFileCount: filenames.length,
    ticketCount: tickets.length,
    invalidFileCount: invalidFiles.length,
    unsupportedFileCount: unsupportedFiles.length,
    dateRange: summarizeDateRange(tickets),
    affectedSystems: [
      ...new Set(tickets.map((ticket) => ticket.affectedSystem)),
    ].sort((a, b) => a.localeCompare(b)),
    syntheticOnly: tickets.every((ticket) => ticket.synthetic === true),
  };
}

function summarizeDateRange(tickets) {
  if (tickets.length === 0) {
    return null;
  }

  const createdDates = tickets.map((ticket) => ticket.createdAt).sort();

  return {
    start: createdDates[0],
    end: createdDates[createdDates.length - 1],
  };
}

function stringValue(record, keys) {
  const value = firstValue(record, keys);

  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
}

function timestampValue(record, keys) {
  const value = stringValue(record, keys);

  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "INVALID_TIMESTAMP";
  }

  return date.toISOString();
}

function firstValue(record, keys) {
  for (const key of keys) {
    if (Object.hasOwn(record, key)) {
      return record[key];
    }
  }

  return undefined;
}

function isRecord(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
