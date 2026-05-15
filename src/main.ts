import "./styles.css";
import monitorEvents from "./data/monitor-events.json";

type MonitorNodeId =
  | "incident-tickets"
  | "codex-app"
  | "codex-cli"
  | "runbook-repo"
  | "support-scripts"
  | "knowledge-base";

type TimelineStateId =
  | "ingesting"
  | "clustering"
  | "briefing"
  | "editing"
  | "validating"
  | "ready-for-review";

type MonitorNode = {
  id: MonitorNodeId;
  label: string;
  detail: string;
};

type TicketEvent = {
  id: string;
  system: string;
  symptom: string;
  cluster: string;
};

type PatternBrief = {
  title: string;
  confidence: string;
  facts: string[];
  recommendation: string;
};

type FileChange = {
  path: string;
  summary: string;
};

type TimelineState = {
  id: TimelineStateId;
  label: string;
  detail: string;
};

type MonitorData = {
  title: string;
  summary: string;
  nodes: MonitorNode[];
  tickets: TicketEvent[];
  patternBrief: PatternBrief;
  fileChanges: FileChange[];
  knowledgeBase: FileChange;
  timeline: TimelineState[];
  counters: {
    ticketCount: number;
    clusterCount: number;
    filesChanged: number;
    reviewStatus: string;
  };
};

const app = document.querySelector<HTMLDivElement>("#app");

if (!app) {
  throw new Error("App root element was not found.");
}

const escapeHtml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");

const getNode = (data: MonitorData, nodeId: MonitorNodeId) => {
  const node = data.nodes.find((item) => item.id === nodeId);

  if (!node) {
    throw new Error(`Monitor node ${nodeId} was not found in mock event data.`);
  }

  return node;
};

const renderNode = (
  data: MonitorData,
  nodeId: MonitorNodeId,
  content = "",
  modifier = "",
) => {
  const node = getNode(data, nodeId);

  return `
    <article class="monitor-node monitor-node--${node.id} ${modifier}" data-node="${node.id}">
      <div>
        <span class="node-kicker">${escapeHtml(node.id.replaceAll("-", " "))}</span>
        <h2>${escapeHtml(node.label)}</h2>
        <p>${escapeHtml(node.detail)}</p>
      </div>
      ${content}
    </article>
  `;
};

const renderTicketStack = (tickets: TicketEvent[]) => `
  <div class="ticket-stack" aria-label="Sample incident cards">
    ${tickets
      .map(
        (ticket) => `
          <article class="ticket-card">
            <strong>${escapeHtml(ticket.id)}</strong>
            <span>${escapeHtml(ticket.system)} / ${escapeHtml(ticket.cluster)}</span>
            <p>${escapeHtml(ticket.symptom)}</p>
          </article>
        `,
      )
      .join("")}
  </div>
`;

const renderFlightCards = (tickets: TicketEvent[]) => `
  <div class="flight-layer" aria-hidden="true">
    <div class="handoff-line"></div>
    ${tickets
      .slice(0, 3)
      .map(
        (ticket, index) => `
          <div class="ticket-card ticket-card--flight ticket-stream ticket-card--flight-${index + 1}">
            <strong>${escapeHtml(ticket.id)}</strong>
            <span>${escapeHtml(ticket.cluster)}</span>
          </div>
        `,
      )
      .join("")}
    <div class="handoff-token">Brief handoff</div>
    <div class="output-token output-token--runbook merge-runbook">Runbook update</div>
    <div class="output-token output-token--script merge-script">Script change</div>
  </div>
`;

const renderBrief = (brief: PatternBrief) => `
  <div class="brief-card pattern-brief" data-brief-card>
    <span class="brief-status">${escapeHtml(brief.confidence)}</span>
    <h3>${escapeHtml(brief.title)}</h3>
    <ul>
      ${brief.facts.map((fact) => `<li>${escapeHtml(fact)}</li>`).join("")}
    </ul>
    <p>${escapeHtml(brief.recommendation)}</p>
  </div>
`;

const renderFileChanges = (changes: FileChange[]) => `
  <div class="change-list">
    ${changes
      .map(
        (change) => `
          <article class="change-row">
            <strong>${escapeHtml(change.path)}</strong>
            <span>${escapeHtml(change.summary)}</span>
          </article>
        `,
      )
      .join("")}
  </div>
`;

const renderTimeline = (timeline: TimelineState[]) => `
  <ol class="timeline" aria-label="Replay timeline">
    ${timeline
      .map(
        (state, index) => `
          <li class="timeline-step" data-step="${escapeHtml(state.id)}" style="--step-index: ${index}">
            <span>${escapeHtml(state.label)}</span>
            <small>${escapeHtml(state.detail)}</small>
          </li>
        `,
      )
      .join("")}
  </ol>
`;

const renderMonitor = (data: MonitorData) => {
  app.innerHTML = `
    <section class="monitor-shell" aria-labelledby="page-title">
      <header class="monitor-header">
        <div>
          <p class="section-label">Animated monitoring view</p>
          <h1 id="page-title">${escapeHtml(data.title)}</h1>
          <p class="summary">${escapeHtml(data.summary)}</p>
        </div>
        <div class="counter-grid" aria-label="Monitor counters">
          <div class="counter"><span data-counter="ticketCount">0</span><small>Tickets</small></div>
          <div class="counter"><span data-counter="clusterCount">0</span><small>Clusters</small></div>
          <div class="counter"><span data-counter="filesChanged">0</span><small>Files changed</small></div>
          <div class="counter"><span data-counter="reviewStatus">Queued</span><small>Review</small></div>
        </div>
      </header>

      <main class="monitor-stage" data-current-stage="ingesting">
        ${renderFlightCards(data.tickets)}
        ${renderNode(data, "incident-tickets", renderTicketStack(data.tickets))}
        ${renderNode(data, "codex-app", renderBrief(data.patternBrief))}
        ${renderNode(data, "codex-cli", '<div class="cli-terminal"><span>$ codex review packet</span><span>$ local tests pass</span><span>$ local build pass</span></div>')}
        ${renderNode(data, "runbook-repo", renderFileChanges([data.fileChanges[0]]), "pulse-target runbook-pulse")}
        ${renderNode(data, "support-scripts", renderFileChanges([data.fileChanges[1]]), "pulse-target script-pulse")}
        ${renderNode(data, "knowledge-base", renderFileChanges([data.knowledgeBase]), "kb-target")}
      </main>

      <section class="replay-panel" aria-label="Replay controls and timeline">
        <div class="replay-controls">
          <button class="replay-button control-button control-button--primary" type="button" data-action="toggle">Pause</button>
          <button class="replay-button control-button" type="button" data-action="replay">Replay</button>
          <label>
            <span>Speed</span>
            <select data-action="speed">
              <option value="1800">1x</option>
              <option value="1100" selected>1.5x</option>
              <option value="700">2x</option>
            </select>
          </label>
        </div>
        ${renderTimeline(data.timeline)}
      </section>
    </section>
  `;

  startReplay(data);
};

const startReplay = (data: MonitorData) => {
  const stage = document.querySelector<HTMLElement>(".monitor-stage");
  const toggleButton = document.querySelector<HTMLButtonElement>(
    '[data-action="toggle"]',
  );
  const replayButton = document.querySelector<HTMLButtonElement>(
    '[data-action="replay"]',
  );
  const speedControl = document.querySelector<HTMLSelectElement>(
    '[data-action="speed"]',
  );
  const timelineSteps = Array.from(
    document.querySelectorAll<HTMLElement>(".timeline-step"),
  );

  if (!stage || !toggleButton || !replayButton || !speedControl) {
    throw new Error("Replay controls were not rendered.");
  }

  let currentIndex = 0;
  let isPlaying = true;
  let delay = Number(speedControl.value);
  let timer = 0;

  const updateCounters = (stateId: TimelineStateId) => {
    const stageIndex = data.timeline.findIndex((item) => item.id === stateId);
    const counterValues = {
      ticketCount: stageIndex >= 0 ? data.counters.ticketCount : 0,
      clusterCount: stageIndex >= 1 ? data.counters.clusterCount : 0,
      filesChanged: stageIndex >= 3 ? data.counters.filesChanged : 0,
      reviewStatus:
        stageIndex >= data.timeline.length - 1
          ? data.counters.reviewStatus
          : "Drafting",
    };

    Object.entries(counterValues).forEach(([key, value]) => {
      const counter = document.querySelector<HTMLElement>(
        `[data-counter="${key}"]`,
      );
      if (counter) {
        counter.textContent = String(value);
      }
    });
  };

  const renderState = () => {
    const state = data.timeline[currentIndex];
    stage.dataset.currentStage = state.id;
    stage.classList.remove("is-replaying");
    window.setTimeout(() => stage.classList.add("is-replaying"), 1);
    updateCounters(state.id);

    timelineSteps.forEach((step, index) => {
      step.classList.toggle("is-active", index === currentIndex);
      step.classList.toggle("is-complete", index < currentIndex);
    });
  };

  const stopTimer = () => {
    window.clearInterval(timer);
    timer = 0;
  };

  const startTimer = () => {
    stopTimer();
    timer = window.setInterval(() => {
      currentIndex = (currentIndex + 1) % data.timeline.length;
      renderState();
    }, delay);
  };

  toggleButton.addEventListener("click", () => {
    isPlaying = !isPlaying;
    toggleButton.textContent = isPlaying ? "Pause" : "Play";

    if (isPlaying) {
      startTimer();
    } else {
      stopTimer();
    }
  });

  replayButton.addEventListener("click", () => {
    currentIndex = 0;
    renderState();

    if (isPlaying) {
      startTimer();
    }
  });

  speedControl.addEventListener("change", () => {
    delay = Number(speedControl.value);

    if (isPlaying) {
      startTimer();
    }
  });

  renderState();
  startTimer();
};

renderMonitor(monitorEvents as MonitorData);
