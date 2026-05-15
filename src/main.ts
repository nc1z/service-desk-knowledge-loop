import "./styles.css";

type WorkflowNode = {
  label: string;
  detail: string;
};

const workflowNodes: WorkflowNode[] = [
  {
    label: "Incident Tickets",
    detail: "Synthetic ticket exports feed repeatable demo runs.",
  },
  {
    label: "Codex App",
    detail: "Support leads review incident patterns and proposed actions.",
  },
  {
    label: "Codex CLI",
    detail: "Repository edits and validation happen in the local workspace.",
  },
  {
    label: "Knowledge Base",
    detail: "Approved runbook and script changes inform draft articles.",
  },
];

const app = document.querySelector<HTMLDivElement>("#app");

if (!app) {
  throw new Error("App root element was not found.");
}

app.innerHTML = `
  <section class="shell" aria-labelledby="page-title">
    <div class="intro">
      <p class="eyebrow">Local POC Baseline</p>
      <h1 id="page-title">Service Desk Knowledge Loop</h1>
      <p class="summary">
        Recurring incidents become evidence-backed runbook updates, support script changes,
        knowledge-base drafts, and reviewer handoffs.
      </p>
    </div>
    <ol class="workflow" aria-label="POC workflow">
      ${workflowNodes
        .map(
          (node) => `
            <li class="workflow-card">
              <h2>${node.label}</h2>
              <p>${node.detail}</p>
            </li>
          `,
        )
        .join("")}
    </ol>
  </section>
`;
