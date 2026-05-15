export const requiredRunbookSections = [
  "Scope",
  "Current Symptoms",
  "Evidence",
  "Triage Steps",
  "Resolver Actions",
  "False-Positive Guardrails",
  "Escalation",
  "Evidence",
  "Safety Notes",
];

export function validateRunbookMarkdown(markdown) {
  const errors = [];

  for (const section of requiredRunbookSections) {
    if (!markdown.includes(`## ${section}`)) {
      errors.push(`Missing required runbook section: ${section}`);
    }
  }

  if (!markdown.includes("Evidence: INC-2026-0001")) {
    errors.push("Runbook must cite selected ticket evidence.");
  }

  if (!markdown.includes("INC-2026-0013")) {
    errors.push("Runbook must cite the VPN false-positive guardrail ticket.");
  }

  if (!markdown.includes("Do not execute production scripts")) {
    errors.push("Runbook must include production-execution safety guidance.");
  }

  return {
    ok: errors.length === 0,
    errors,
  };
}
