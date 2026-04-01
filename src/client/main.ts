import { controlCards } from "../shared/gameData.js";
import type {
  ClientToServerMessage,
  ControlCard,
  CurrentInjectView,
  InjectCard,
  InjectCardDraft,
  PlayerState,
  RoomState,
  ServerToClientMessage
} from "../shared/types.js";
import QRCode from "qrcode";

type RoleView = "landing" | "facilitator" | "player" | "admin";
type ReportDraft = { summary: string; notified: string[] };
type JoinLinkEntry = { url: string; qrDataUrl: string };
type PreservedFieldSnapshot = {
  key: string;
  value: string;
  checked?: boolean;
  selectionStart?: number | null;
  selectionEnd?: number | null;
  hadFocus: boolean;
};

const app = document.getElementById("app") as HTMLDivElement | null;
if (!app) throw new Error("App root not found");
const appRoot = app;

const state: {
  socket: WebSocket | null;
  clientId: string;
  role: "facilitator" | "player" | null;
  room: RoomState | null;
  roomCode: string;
  playerName: string;
  error: string;
  hostInfo: { port: number; addresses: string[]; joinBaseUrl?: string; adminConfigured?: boolean } | null;
  joinLinks: JoinLinkEntry[];
  joinLinksKey: string;
  reportDrafts: Record<string, ReportDraft>;
  currentTime: number;
  reconnectTimer: number | null;
  facilitatorInjectModalDismissedRound: number;
  facilitatorSelectedPlayerId: string;
  facilitatorModalMode: "" | "deck" | "inject";
  facilitatorFinalModalDismissed: boolean;
  facilitatorFinalModalRound: number;
  injectLibrary: InjectCard[];
  injectBuilderError: string;
  injectEditorId: string;
  injectDraft: InjectCardDraft;
  adminConfigured: boolean;
  adminAuthenticated: boolean;
  adminChecking: boolean;
  adminLoginError: string;
} = {
  socket: null,
  clientId: "",
  role: null,
  room: null,
  roomCode: new URLSearchParams(window.location.search).get("room")?.toUpperCase() ?? "",
  playerName: "",
  error: "",
  hostInfo: null,
  joinLinks: [],
  joinLinksKey: "",
  reportDrafts: {},
  currentTime: Date.now(),
  reconnectTimer: null,
  facilitatorInjectModalDismissedRound: 0,
  facilitatorSelectedPlayerId: "",
  facilitatorModalMode: "",
  facilitatorFinalModalDismissed: false,
  facilitatorFinalModalRound: 0,
  injectLibrary: [],
  injectBuilderError: "",
  injectEditorId: "",
  injectDraft: createEmptyInjectDraft(),
  adminConfigured: true,
  adminAuthenticated: false,
  adminChecking: false,
  adminLoginError: ""
};

const categoryOrder: ControlCard["category"][] = ["Identify", "Protect", "Detect", "Respond"];
const categoryClassMap: Record<ControlCard["category"], string> = {
  Identify: "identify",
  Protect: "protect",
  Detect: "detect",
  Respond: "respond"
};

function createEmptyInjectDraft(): InjectCardDraft {
  return {
    event: "",
    description: "",
    impacts: [
      { text: "", mitigatedBy: controlCards[0]?.title ?? "" },
      { text: "", mitigatedBy: controlCards[1]?.title ?? controlCards[0]?.title ?? "" }
    ],
    stats: "",
    remediation: ""
  };
}

function cloneInjectDraft(inject: InjectCardDraft): InjectCardDraft {
  return {
    event: inject.event,
    description: inject.description,
    impacts: inject.impacts.map((impact) => ({ ...impact })),
    stats: inject.stats,
    remediation: inject.remediation
  };
}

function getFacilitatorSessionStorageKey() {
  return "irtt-facilitator-session";
}

function getOrCreateFacilitatorSessionKey() {
  let sessionKey = localStorage.getItem(getFacilitatorSessionStorageKey());
  if (!sessionKey) {
    sessionKey = crypto.randomUUID();
    localStorage.setItem(getFacilitatorSessionStorageKey(), sessionKey);
  }
  return sessionKey;
}

function getPlayerSessionStorageKey(roomCode: string) {
  return `irtt-player-session:${roomCode.toUpperCase()}`;
}

function getPlayerNameStorageKey(roomCode: string) {
  return `irtt-player-name:${roomCode.toUpperCase()}`;
}

function getPlayerActiveRoomStorageKey() {
  return "irtt-player-active-room";
}

function getOrCreatePlayerSessionKey(roomCode: string) {
  const key = getPlayerSessionStorageKey(roomCode);
  let sessionKey = localStorage.getItem(key);
  if (!sessionKey) {
    sessionKey = crypto.randomUUID();
    localStorage.setItem(key, sessionKey);
  }
  return sessionKey;
}

function persistPlayerIdentity(roomCode: string, playerName: string) {
  localStorage.setItem(getPlayerNameStorageKey(roomCode), playerName);
  getOrCreatePlayerSessionKey(roomCode);
}

function getStoredPlayerIdentity(roomCode: string) {
  return {
    name: localStorage.getItem(getPlayerNameStorageKey(roomCode)) ?? "",
    sessionKey: localStorage.getItem(getPlayerSessionStorageKey(roomCode)) ?? ""
  };
}

function getActivePlayerRoomCode() {
  return sessionStorage.getItem(getPlayerActiveRoomStorageKey()) ?? "";
}

function setActivePlayerRoomCode(roomCode: string) {
  sessionStorage.setItem(getPlayerActiveRoomStorageKey(), roomCode.toUpperCase());
}

function clearActivePlayerRoomCode() {
  sessionStorage.removeItem(getPlayerActiveRoomStorageKey());
}

function getFieldPreserveKey(element: Element) {
  if (!(element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement || element instanceof HTMLSelectElement)) {
    return "";
  }

  if (element.id) return `id:${element.id}`;
  if (element instanceof HTMLInputElement && element.closest(".report-check")) return `report-check:${element.value}`;
  if ("impactTextIndex" in element.dataset && element.dataset.impactTextIndex) return `impact-text:${element.dataset.impactTextIndex}`;
  if ("impactControlIndex" in element.dataset && element.dataset.impactControlIndex) return `impact-control:${element.dataset.impactControlIndex}`;
  return "";
}

function capturePreservedFields(): PreservedFieldSnapshot[] {
  const activeElement = document.activeElement;
  return [...appRoot.querySelectorAll("input, textarea, select")]
    .map((element) => {
      const key = getFieldPreserveKey(element);
      if (!key) return null;
      const field = element as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
      return {
        key,
        value: field.value,
        checked: field instanceof HTMLInputElement ? field.checked : undefined,
        selectionStart: "selectionStart" in field ? field.selectionStart : null,
        selectionEnd: "selectionEnd" in field ? field.selectionEnd : null,
        hadFocus: activeElement === field
      } satisfies PreservedFieldSnapshot;
    })
    .filter((snapshot): snapshot is PreservedFieldSnapshot => Boolean(snapshot));
}

function restorePreservedFields(snapshots: PreservedFieldSnapshot[]) {
  if (!snapshots.length) return;

  const fieldMap = new Map<string, Element>();
  for (const element of appRoot.querySelectorAll("input, textarea, select")) {
    const key = getFieldPreserveKey(element);
    if (key) fieldMap.set(key, element);
  }

  for (const snapshot of snapshots) {
    const nextField = fieldMap.get(snapshot.key);
    if (!(nextField instanceof HTMLInputElement || nextField instanceof HTMLTextAreaElement || nextField instanceof HTMLSelectElement)) {
      continue;
    }

    if (nextField instanceof HTMLInputElement && typeof snapshot.checked === "boolean") {
      nextField.checked = snapshot.checked;
    } else {
      nextField.value = snapshot.value;
    }

    if (snapshot.hadFocus) {
      nextField.focus();
      if ("setSelectionRange" in nextField && typeof snapshot.selectionStart === "number" && typeof snapshot.selectionEnd === "number") {
        nextField.setSelectionRange(snapshot.selectionStart, snapshot.selectionEnd);
      }
    }
  }
}

function getView(): RoleView {
  if (window.location.pathname.startsWith("/admin/injects")) return "admin";
  if (window.location.pathname.startsWith("/facilitator")) return "facilitator";
  if (window.location.pathname.startsWith("/player")) return "player";
  return "landing";
}

function getJoinUrls() {
  if (!state.hostInfo || !state.roomCode) return [] as string[];
  const baseUrl = state.hostInfo.joinBaseUrl?.trim();
  if (baseUrl) {
    return [`${baseUrl}/player?room=${state.roomCode}`];
  }
  if (state.hostInfo.addresses.length) {
    return state.hostInfo.addresses.map((address) => `http://${address}:${state.hostInfo?.port}/player?room=${state.roomCode}`);
  }
  return [`${window.location.origin}/player?room=${state.roomCode}`];
}

async function refreshJoinLinks() {
  const urls = getJoinUrls();
  const nextKey = urls.join("|");
  if (!urls.length) {
    state.joinLinks = [];
    state.joinLinksKey = "";
    return;
  }
  if (nextKey === state.joinLinksKey && state.joinLinks.length === urls.length) {
    return;
  }

  state.joinLinksKey = nextKey;
  state.joinLinks = await Promise.all(
    urls.map(async (url) => ({
      url,
      qrDataUrl: await QRCode.toDataURL(url, { margin: 1, width: 220 })
    }))
  );
}

function getReportDraftKey(round: number) {
  return `${state.roomCode}:${round}`;
}

function getReportDraft(round: number): ReportDraft {
  return state.reportDrafts[getReportDraftKey(round)] ?? { summary: "", notified: [] };
}

function updateReportDraft(round: number, nextDraft: ReportDraft) {
  state.reportDrafts[getReportDraftKey(round)] = nextDraft;
}

function clearReportDraft(round: number) {
  delete state.reportDrafts[getReportDraftKey(round)];
}

function formatCountdown(targetTime: number) {
  const remainingMs = Math.max(0, targetTime - state.currentTime);
  const totalSeconds = Math.ceil(remainingMs / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

async function loadHostInfo() {
  try {
    const response = await fetch("/api/info");
    state.hostInfo = await response.json();
    state.adminConfigured = state.hostInfo.adminConfigured ?? false;
    await refreshJoinLinks();
  } catch {
    state.hostInfo = null;
    state.adminConfigured = false;
    state.joinLinks = [];
    state.joinLinksKey = "";
  }
}

async function adminApiFetch(url: string, init: RequestInit = {}) {
  return fetch(url, {
    ...init,
    credentials: "same-origin",
    headers: new Headers(init.headers)
  });
}

async function loadAdminSession() {
  if (getView() !== "admin") return;

  state.adminChecking = true;
  try {
    const response = await adminApiFetch("/api/admin/session");
    const payload = (await response.json()) as { configured: boolean; authenticated: boolean };
    state.adminConfigured = payload.configured;
    state.adminAuthenticated = payload.authenticated;
    state.adminLoginError = "";

    if (payload.authenticated) {
      await loadAdminInjectLibrary();
    }
  } catch {
    state.adminConfigured = true;
    state.adminAuthenticated = false;
    state.adminLoginError = "Unable to contact the admin service right now.";
  } finally {
    state.adminChecking = false;
  }
}

async function loadAdminInjectLibrary() {
  if (getView() !== "admin") return;

  try {
    const response = await adminApiFetch("/api/admin/injects");
    if (response.status === 401) {
      state.adminAuthenticated = false;
      state.injectLibrary = [];
      return;
    }
    const payload = (await response.json()) as { injects: InjectCard[] };
    state.injectLibrary = payload.injects;
    state.injectBuilderError = "";
  } catch {
    state.injectBuilderError = "Unable to load the inject library right now.";
  }
}

async function loginAdmin(password: string) {
  state.adminLoginError = "";
  try {
    const response = await adminApiFetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password })
    });

    if (!response.ok) {
      const payload = (await response.json()) as { message?: string };
      state.adminLoginError = payload.message ?? "Login failed.";
      render();
      return;
    }

    state.adminAuthenticated = true;
    state.injectDraft = createEmptyInjectDraft();
    state.injectEditorId = "";
    await loadAdminInjectLibrary();
    render();
  } catch {
    state.adminLoginError = "Unable to contact the admin service right now.";
    render();
  }
}

async function logoutAdmin() {
  try {
    await adminApiFetch("/api/admin/logout", { method: "POST" });
  } catch {}

  state.adminAuthenticated = false;
  state.injectLibrary = [];
  state.injectBuilderError = "";
  state.injectEditorId = "";
  state.injectDraft = createEmptyInjectDraft();
  render();
}

function maybeAutoRejoinPlayerRoom() {
  if (getView() !== "player" || !state.roomCode || !state.socket || state.room) return;
  if (getActivePlayerRoomCode() !== state.roomCode) return;
  const stored = getStoredPlayerIdentity(state.roomCode);
  if (!stored.name || !stored.sessionKey) return;
  state.playerName = stored.name;
  send({ type: "join-room", roomCode: state.roomCode, name: stored.name, sessionKey: stored.sessionKey });
}

function maybeAutoRejoinFacilitatorRoom() {
  if (getView() !== "facilitator" || !state.roomCode || !state.socket || state.room) return;
  send({ type: "rejoin-facilitator", roomCode: state.roomCode, sessionKey: getOrCreateFacilitatorSessionKey() });
}

function connect() {
  if (state.socket || !["facilitator", "player"].includes(getView())) return;

  const protocol = window.location.protocol === "https:" ? "wss" : "ws";
  state.socket = new WebSocket(`${protocol}://${window.location.host}`);

  state.socket.addEventListener("message", (event) => {
    const message = JSON.parse(event.data) as ServerToClientMessage;
    if (message.type === "welcome") {
      state.clientId = message.clientId;
      state.role = message.role;
    }
    if (message.type === "room-created") {
      state.roomCode = message.roomCode;
      history.replaceState(null, "", `/facilitator?room=${message.roomCode}`);
      void refreshJoinLinks().then(() => render());
    }
    if (message.type === "room-state") {
      const priorPhase = state.room?.phase;
      const priorInjectRound = state.room?.currentInject?.round ?? 0;
      state.room = message.room;
      if (getView() === "facilitator") {
        void refreshJoinLinks().then(() => render());
      }
      if (getView() === "player" && message.room.currentInject) {
        const resolution = message.room.currentInject.resolutions.find((entry) => entry.playerId === state.clientId);
        if (resolution?.reportSubmitted) {
          clearReportDraft(message.room.currentInject.round);
        }
      }
      if (getView() === "player") {
        const playerExists = message.room.players.some((player) => player.id === state.clientId);
        if (playerExists) {
          setActivePlayerRoomCode(message.room.roomCode);
        }
      }
      if (getView() === "facilitator") {
        if (!state.facilitatorSelectedPlayerId && message.room.players.length) {
          state.facilitatorSelectedPlayerId = message.room.players[0]?.id ?? "";
        }
        const selectedStillExists = message.room.players.some((player) => player.id === state.facilitatorSelectedPlayerId);
        if (!selectedStillExists) {
          state.facilitatorSelectedPlayerId = message.room.players[0]?.id ?? "";
          state.facilitatorModalMode = "";
        }
        if (message.room.currentInject && message.room.currentInject.round !== priorInjectRound) {
          state.facilitatorInjectModalDismissedRound = 0;
        }
        if (message.room.phase === "hotwash" && priorPhase !== "hotwash") {
          state.facilitatorFinalModalDismissed = false;
          state.facilitatorFinalModalRound = message.room.round;
        }
        if (message.room.phase !== "hotwash") {
          state.facilitatorFinalModalDismissed = false;
          state.facilitatorFinalModalRound = 0;
        }
      }
    }
    if (message.type === "error") {
      state.error = message.message;
    }
    render();
    maybeAutoRejoinPlayerRoom();
    maybeAutoRejoinFacilitatorRoom();
  });

  state.socket.addEventListener("close", () => {
    state.socket = null;
    if (state.reconnectTimer) {
      window.clearTimeout(state.reconnectTimer);
    }
    if (!["facilitator", "player"].includes(getView())) return;
    state.reconnectTimer = window.setTimeout(() => {
      state.reconnectTimer = null;
      connect();
    }, 1000);
    render();
  });
}

function send(message: ClientToServerMessage) {
  state.error = "";
  state.socket?.send(JSON.stringify(message));
}

function cardSelected(player: PlayerState | undefined, cardTitle: string) {
  return player?.selectedCards.includes(cardTitle) ?? false;
}

function getLocalPlayer() {
  return state.room?.players.find((player) => player.id === state.clientId);
}

function escapeHtml(text: string) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function renderRoomJoinSummary() {
  if (!state.hostInfo || !state.roomCode) return `<div class="muted">Join details will appear once the room is ready.</div>`;
  if (!state.joinLinks.length) return `<div class="muted">Generating join QR code...</div>`;
  const primaryJoinLink = state.joinLinks[0];
  const joinDisplayUrl = primaryJoinLink.url.split("?")[0] ?? primaryJoinLink.url;

  return `
    <div class="room-code-block">
      <img class="join-qr compact" src="${primaryJoinLink.qrDataUrl}" alt="QR code for ${escapeHtml(primaryJoinLink.url)}">
      <div>
        <div class="eyebrow">Room</div>
        <h2 class="room-code-value">Code: ${state.roomCode}</h2>
        <div class="muted room-join-path">${escapeHtml(joinDisplayUrl)}</div>
      </div>
    </div>
  `;
}

function selectAdminInject(injectId = "") {
  state.injectBuilderError = "";
  state.injectEditorId = injectId;
  if (injectId) {
    const inject = state.injectLibrary.find((entry) => entry.id === injectId);
    state.injectDraft = inject ? cloneInjectDraft(inject) : createEmptyInjectDraft();
  } else {
    state.injectDraft = createEmptyInjectDraft();
  }
  render();
}
function renderLanding() {
  appRoot.innerHTML = `
    <div class="app-shell">
      <div class="hero">
        <div>
          <div class="eyebrow">Multiplayer Classroom Mode</div>
          <h1>Incident Response Tabletop Live</h1>
          <p class="muted">A facilitator hosts the room, players join on their own devices, everyone builds a deck, then the room survives the inject phase together.</p>
        </div>
        <div class="landing-actions">
          <a href="/facilitator"><button>Facilitator Screen</button></a>
          <a href="/player"><button class="secondary">Player Join</button></a>
        </div>
      </div>
    </div>
  `;
}

function renderInject(currentInject: CurrentInjectView) {
  return `
    <h3>Round ${currentInject.round}: ${escapeHtml(currentInject.inject.event)}</h3>
    <p class="muted">${escapeHtml(currentInject.inject.description)}</p>
    ${currentInject.inject.impacts.map((impact) => `<div class="inject-row"><span>${escapeHtml(impact.text)}</span><span class="badge warn">${escapeHtml(impact.mitigatedBy)}</span></div>`).join("")}
    <div class="spacer"></div>
    <div class="eyebrow">Player outcomes</div>
    ${currentInject.resolutions.map((resolution) => `
      <div class="inject-row">
        <strong>${escapeHtml(resolution.playerName)}</strong>
        <div class="stack">
          ${resolution.reportSubmitted ? `<span class="badge good">Report +${resolution.reportBonus}</span>` : ""}
          <span class="badge ${resolution.delta >= 0 ? "good" : "bad"}">${resolution.delta >= 0 ? "+" : ""}${resolution.delta}</span>
        </div>
      </div>
    `).join("")}
    ${currentInject.reports.length ? `
      <div class="spacer"></div>
      <div class="eyebrow">Submitted Reports</div>
      ${currentInject.reports.map((report) => `
        <div class="report-card">
          <strong>${escapeHtml(report.playerName)}</strong>
          <div class="muted">${report.summary ? escapeHtml(report.summary) : "No written summary provided."}</div>
          <div class="row">
            ${report.notified.length
              ? report.notified.map((entry) => `<span class="badge warn">${escapeHtml(entry)}</span>`).join("")
              : `<span class="badge">No notifications selected</span>`}
          </div>
        </div>
      `).join("")}
    ` : ""}
  `;
}

function renderFacilitatorPlayerInjectModal(currentInject: CurrentInjectView, player: PlayerState) {
  const resolution = currentInject.resolutions.find((entry) => entry.playerId === player.id);
  const report = currentInject.reports.find((entry) => entry.playerId === player.id);
  return `
    <div class="eyebrow">Current Round View</div>
    <h2>${escapeHtml(player.name)}</h2>
    <h3>Round ${currentInject.round}: ${escapeHtml(currentInject.inject.event)}</h3>
    <p class="muted">${escapeHtml(currentInject.inject.description)}</p>
    ${currentInject.inject.impacts.map((impact) => {
      const protectedByPlayer = player.selectedCards.includes(impact.mitigatedBy);
      return `
        <div class="inject-impact ${protectedByPlayer ? "good" : "bad"}">
          <strong>${escapeHtml(impact.text)}</strong>
          <div class="muted">${protectedByPlayer ? `Covered by ${escapeHtml(impact.mitigatedBy)}` : `Missing ${escapeHtml(impact.mitigatedBy)}`}</div>
        </div>
      `;
    }).join("")}
    <div class="spacer"></div>
    <div class="inject-row">
      <strong>Round Result</strong>
      <div class="stack">
        ${resolution?.reportSubmitted ? `<span class="badge good">Report +${resolution.reportBonus}</span>` : ""}
        <span class="badge ${resolution && resolution.delta >= 0 ? "good" : "bad"}">${resolution ? `${resolution.delta >= 0 ? "+" : ""}${resolution.delta}` : "Pending"}</span>
      </div>
    </div>
    ${report ? `
      <div class="report-card">
        <strong>Submitted Report</strong>
        <div class="muted">${report.summary ? escapeHtml(report.summary) : "No written summary provided."}</div>
        <div class="row">
          ${report.notified.length
            ? report.notified.map((entry) => `<span class="badge warn">${escapeHtml(entry)}</span>`).join("")
            : `<span class="badge">No notifications selected</span>`}
        </div>
      </div>
    ` : `<div class="report-card"><strong>No report submitted</strong><div class="muted">This player did not submit the optional incident report for this round.</div></div>`}
  `;
}

function renderInjectDiscussionModal(currentInject: CurrentInjectView) {
  return `
    <div class="eyebrow">Current Inject</div>
    <h2>Round ${currentInject.round}: ${escapeHtml(currentInject.inject.event)}</h2>
    <p class="muted">${escapeHtml(currentInject.inject.description)}</p>
    ${currentInject.inject.impacts.map((impact) => `
      <div class="inject-row">
        <span>${escapeHtml(impact.text)}</span>
        <span class="badge warn">${escapeHtml(impact.mitigatedBy)}</span>
      </div>
    `).join("")}
    <div class="spacer"></div>
    <div class="report-card">
      <strong>Remediation Guidance</strong>
      <div class="muted">${escapeHtml(currentInject.inject.remediation)}</div>
    </div>
    <div class="spacer"></div>
    <div class="report-card">
      <strong>Discussion Prompt</strong>
      <div class="stack modal-prompt-list">
        <div>What happened first, and how would your team confirm the incident is real?</div>
        <div>Who needs to be notified in the first 15 minutes?</div>
        <div>Which selected controls helped most, and what gaps were exposed?</div>
        <div>What is your next operational decision before moving to the next round?</div>
      </div>
    </div>
  `;
}

function renderInjectBuilderContent() {
  const draft = state.injectDraft;
  return `
    <div class="inject-builder-page">
      ${state.injectBuilderError ? `<div class="panel slim-panel"><span class="badge bad">${escapeHtml(state.injectBuilderError)}</span></div>` : ""}
      <div class="inject-builder-layout">
        <div class="inject-library-list">
          <div class="inject-builder-section-row">
            <div class="eyebrow">Library</div>
            <button class="secondary slim-button" id="create-new-inject" type="button">New Inject</button>
          </div>
          ${state.injectLibrary.length
            ? state.injectLibrary.map((inject) => `
              <div class="inject-library-item ${inject.id === state.injectEditorId ? "active" : ""}">
                <div>
                  <strong>${escapeHtml(inject.event)}</strong>
                  <div class="muted">${inject.impacts.length} impacts</div>
                </div>
                <div class="stack">
                  <button class="secondary slim-button" data-inject-edit-id="${inject.id}">Edit</button>
                  <button class="danger slim-button" data-inject-delete-id="${inject.id}">Delete</button>
                </div>
              </div>
            `).join("")
            : `<div class="muted">No inject cards yet. Create the first one to seed the library.</div>`}
        </div>
        <div class="inject-builder-form">
          <label class="form-block">
            <span class="eyebrow">Inject Title</span>
            <input id="inject-event" value="${escapeHtml(draft.event)}" maxlength="120" placeholder="Ransomware - Shared Drive Encryption">
          </label>
          <label class="form-block">
            <span class="eyebrow">Scenario Description</span>
            <textarea id="inject-description" maxlength="600" placeholder="What is happening in this inject?">${escapeHtml(draft.description)}</textarea>
          </label>
          <div class="form-block">
            <div class="inject-builder-section-row">
              <span class="eyebrow">Impact Rows</span>
              <button class="secondary slim-button" id="add-impact-row" type="button">Add Impact</button>
            </div>
            <div class="inject-impact-list">
              ${draft.impacts.map((impact, index) => `
                <div class="inject-impact-editor">
                  <input data-impact-text-index="${index}" value="${escapeHtml(impact.text)}" maxlength="140" placeholder="What goes wrong for the team?">
                  <select data-impact-control-index="${index}">
                    ${controlCards.map((card) => `<option value="${escapeHtml(card.title)}" ${impact.mitigatedBy === card.title ? "selected" : ""}>${escapeHtml(card.title)}</option>`).join("")}
                  </select>
                  <button class="danger slim-button" data-remove-impact-index="${index}" type="button" ${draft.impacts.length <= 1 ? "disabled" : ""}>Remove</button>
                </div>
              `).join("")}
            </div>
          </div>
          <label class="form-block">
            <span class="eyebrow">Context / Stats</span>
            <textarea id="inject-stats" maxlength="400" placeholder="Why does this scenario matter in the real world?">${escapeHtml(draft.stats)}</textarea>
          </label>
          <label class="form-block">
            <span class="eyebrow">Remediation Guidance</span>
            <textarea id="inject-remediation" maxlength="500" placeholder="What should the team discuss or do next?">${escapeHtml(draft.remediation)}</textarea>
          </label>
          <div class="controls">
            <button class="success" id="save-inject">${state.injectEditorId ? "Save Changes" : "Create Inject"}</button>
          </div>
        </div>
      </div>
    </div>
  `;
}
function renderFacilitator() {
  const room = state.room;
  const players = room?.players ?? [];
  const ready = players.filter((player) => player.locked).length;
  const canBegin = Boolean(room && room.phase === "deckbuild" && players.length > 0 && ready === players.length);
  const currentInject = room?.currentInject;
  const showFinishGame = Boolean(room && room.phase === "gameplay" && room.round >= room.maxRounds && currentInject);
  const deckbuildCountdown = room?.phase === "deckbuild" && room.deckbuildAutoLockAt
    ? formatCountdown(room.deckbuildAutoLockAt)
    : "";
  const selectedPlayer = players.find((player) => player.id === state.facilitatorSelectedPlayerId) ?? players[0];
  const showInjectDiscussionModal = Boolean(
    currentInject &&
    room?.phase === "gameplay" &&
    currentInject.round !== state.facilitatorInjectModalDismissedRound
  );
  const showFinalModal = Boolean(
    room &&
    room.phase === "hotwash" &&
    room.round >= room.maxRounds &&
    !state.facilitatorFinalModalDismissed
  );
  const showPlayerModal = Boolean(selectedPlayer && state.facilitatorModalMode);
  const playersPanel = `
    <div class="panel">
      <div class="eyebrow">Players</div>
      <h3>Readiness Board</h3>
      <div class="players">
        ${players.length ? players.map((player) => `
          <div class="player-row">
            <div>
              <button class="player-name-button ${player.id === selectedPlayer?.id && state.facilitatorModalMode === "deck" ? "active" : ""}" data-player-id="${player.id}" data-player-view="deck">${escapeHtml(player.name)}</button>
              <div class="muted">${player.selectedCards.length} cards selected • ${player.budgetRemaining.toLocaleString()} budget left</div>
            </div>
            <div class="stack">
              <button class="secondary remove-player-button" data-remove-player-id="${player.id}">Remove</button>
              <span class="badge ${player.connected ? "good" : "warn"}">${player.connected ? "Connected" : "Offline"}</span>
              <button class="badge badge-toggle ${player.locked ? "good" : "warn"}" data-toggle-player-lock="${player.id}" type="button">${player.locked ? "Locked" : "Building"}</button>
            </div>
          </div>
        `).join("") : `<div class="muted">No players yet. Share the join URL and room code.</div>`}
      </div>
    </div>
  `;
  const leaderboardPanel = `
    <div class="panel">
      <div class="eyebrow">Leaderboard</div>
      <h3>Team Results</h3>
      <div class="leaderboard">
        ${players.map((player) => `
          <div class="leaderboard-item">
            <button class="player-name-button ${player.id === selectedPlayer?.id && state.facilitatorModalMode === "inject" ? "active" : ""}" data-player-id="${player.id}" data-player-view="inject">${escapeHtml(player.name)}</button>
            <div><span class="muted">Score</span><div>${player.score}</div></div>
            <div><span class="muted">Last</span><div>${player.lastDelta >= 0 ? "+" : ""}${player.lastDelta}</div></div>
            <div><span class="muted">Hits</span><div>${player.criticalHits}</div></div>
            <div><span class="muted">Cards</span><div>${player.selectedCards.length}</div></div>
          </div>
        `).join("") || `<div class="muted">Players will appear here after they join the room.</div>`}
      </div>
    </div>
  `;

  appRoot.innerHTML = `
    <div class="app-shell">
      ${room ? "" : `
        <div class="hero">
          <div>
            <div class="eyebrow">Facilitator Console</div>
            <h1>Run the room and drive the incident</h1>
            <p class="muted">Create the room, let everyone build decks, then move the group into live injects and hotwash.</p>
          </div>
          <div class="controls">
            ${state.adminConfigured ? `<a href="/admin/injects"><button class="secondary" type="button">Admin Injects</button></a>` : ""}
            <button id="create-room">Create Room</button>
          </div>
        </div>
      `}
      ${state.error ? `<div class="panel"><span class="badge bad">${escapeHtml(state.error)}</span></div>` : ""}
      ${room ? `
        <div class="panel room-panel">
          <div class="room-panel-header">
            ${renderRoomJoinSummary()}
            <div class="controls">
              <button class="secondary" id="reset-room">Reset Room</button>
              ${room.phase === "deckbuild" ? `<button class="secondary" id="start-deckbuild-timer" ${room.deckbuildAutoLockAt ? "disabled" : ""}>Start 5 Minute Timer</button>` : ""}
              ${room.phase === "deckbuild" ? `<button id="begin-gameplay" ${canBegin ? "" : "disabled"}>Begin Incident Phase</button>` : ""}
              ${room.phase === "gameplay" && !showFinishGame ? `<button id="draw-inject" ${room.round >= room.maxRounds ? "disabled" : ""}>Draw Inject</button>` : ""}
              ${showFinishGame ? `<button class="success" id="finish-game">Finish Game</button>` : ""}
            </div>
          </div>
          <div class="stat-grid">
            <div class="stat"><span class="muted">Phase</span><span class="value">${room.phase}</span></div>
            <div class="stat"><span class="muted">Players</span><span class="value">${players.length}</span></div>
            <div class="stat"><span class="muted">Locked</span><span class="value">${ready}/${players.length}</span></div>
            <div class="stat"><span class="muted">Round</span><span class="value">${room.round}/${room.maxRounds}</span></div>
          </div>
          ${deckbuildCountdown ? `<div class="spacer"></div><div class="badge warn">Auto-lock and incident start in ${deckbuildCountdown}</div>` : ""}
        </div>
        <div class="layout">
          <div>
            ${room.phase === "deckbuild" ? `${playersPanel}${leaderboardPanel}` : `${leaderboardPanel}${playersPanel}`}
          </div>
          <div>
            <div class="panel">
              <div class="eyebrow">Current Inject</div>
              ${currentInject ? `<div class="controls"><button class="secondary" id="open-inject-discussion-modal">Open Briefing</button></div><div class="spacer"></div>` : ""}
              ${currentInject ? renderInject(currentInject) : `<div class="muted">No inject has been drawn yet.</div>`}
            </div>
          </div>
        </div>
      ` : ""}
      ${showPlayerModal && selectedPlayer ? `
        <div class="modal-backdrop">
          <div class="modal-card">
            ${state.facilitatorModalMode === "deck"
              ? `
                <div class="eyebrow">Locked Deck</div>
                <h2>${escapeHtml(selectedPlayer.name)}</h2>
                ${selectedPlayer.selectedCards.length
                  ? selectedPlayer.selectedCards.map((title) => `<div class="inject-row"><span>${escapeHtml(title)}</span></div>`).join("")
                  : `<div class="muted">No cards selected yet.</div>`}
              `
              : currentInject
                ? renderFacilitatorPlayerInjectModal(currentInject, selectedPlayer)
                : `
                  <div class="eyebrow">Current Round View</div>
                  <h2>${escapeHtml(selectedPlayer.name)}</h2>
                  <div class="muted">No inject has been drawn yet, so there is no current-round player view to display.</div>
                `}
            <div class="controls">
              <button id="close-player-modal">Close</button>
            </div>
          </div>
        </div>
      ` : ""}
      ${showInjectDiscussionModal && currentInject ? `
        <div class="modal-backdrop">
          <div class="modal-card">
            ${renderInjectDiscussionModal(currentInject)}
            <div class="controls">
              <button id="close-inject-discussion-modal">Close</button>
            </div>
          </div>
        </div>
      ` : ""}
      ${showFinalModal && room ? `
        <div class="modal-backdrop">
          <div class="modal-card">
            <div class="eyebrow">Final Scores</div>
            <h2>Round ${room.maxRounds} complete</h2>
            <p class="muted">All five rounds have been resolved. Scores reflect how hard each team was hit over the full exercise.</p>
            <div class="leaderboard">
              ${[...players]
                .sort((a, b) => b.score - a.score)
                .map((player) => `
                  <div class="leaderboard-item">
                    <strong>${escapeHtml(player.name)}</strong>
                    <div><span class="muted">Final Score</span><div>${player.score}</div></div>
                    <div><span class="muted">Critical Hits</span><div>${player.criticalHits}</div></div>
                    <div><span class="muted">Cards</span><div>${player.selectedCards.length}</div></div>
                    <div><span class="muted">Status</span><div>${player.score >= 0 ? "Held" : "Overrun"}</div></div>
                  </div>
                `).join("")}
            </div>
            <div class="controls">
              <button id="close-final-modal">Close</button>
            </div>
          </div>
        </div>
      ` : ""}
    </div>
  `;

  document.getElementById("create-room")?.addEventListener("click", () =>
    send({ type: "create-room", sessionKey: getOrCreateFacilitatorSessionKey() })
  );
  document.getElementById("start-deckbuild-timer")?.addEventListener("click", () => send({ type: "start-deckbuild-timer", roomCode: state.roomCode, durationSeconds: 300 }));
  document.getElementById("begin-gameplay")?.addEventListener("click", () => send({ type: "begin-gameplay", roomCode: state.roomCode }));
  document.getElementById("draw-inject")?.addEventListener("click", () => send({ type: "draw-inject", roomCode: state.roomCode }));
  document.getElementById("finish-game")?.addEventListener("click", () => send({ type: "finish-game", roomCode: state.roomCode }));
  document.getElementById("reset-room")?.addEventListener("click", () => send({ type: "reset-room", roomCode: state.roomCode }));
  document.querySelectorAll("[data-player-id]").forEach((button) => {
    button.addEventListener("click", () => {
      const clickedId = button.getAttribute("data-player-id") ?? "";
      const clickedView = (button.getAttribute("data-player-view") as "" | "deck" | "inject" | null) ?? "";
      const isSame = state.facilitatorSelectedPlayerId === clickedId && state.facilitatorModalMode === clickedView;
      state.facilitatorSelectedPlayerId = isSame ? "" : clickedId;
      state.facilitatorModalMode = isSame ? "" : clickedView;
      render();
    });
  });
  document.querySelectorAll("[data-remove-player-id]").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      const playerId = button.getAttribute("data-remove-player-id") ?? "";
      const player = players.find((entry) => entry.id === playerId);
      if (!playerId || !player) return;
      const confirmed = window.confirm(`Remove ${player.name} from the room?`);
      if (!confirmed) return;
      if (state.facilitatorSelectedPlayerId === playerId) {
        state.facilitatorSelectedPlayerId = "";
        state.facilitatorModalMode = "";
      }
      send({ type: "remove-player", roomCode: state.roomCode, playerId });
    });
  });
  document.querySelectorAll("[data-toggle-player-lock]").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      const playerId = button.getAttribute("data-toggle-player-lock") ?? "";
      if (!playerId) return;
      send({ type: "toggle-player-lock", roomCode: state.roomCode, playerId });
    });
  });
  document.getElementById("close-player-modal")?.addEventListener("click", () => {
    state.facilitatorSelectedPlayerId = "";
    state.facilitatorModalMode = "";
    render();
  });
  document.getElementById("close-inject-discussion-modal")?.addEventListener("click", () => {
    state.facilitatorInjectModalDismissedRound = currentInject?.round ?? 0;
    render();
  });
  document.getElementById("open-inject-discussion-modal")?.addEventListener("click", () => {
    state.facilitatorInjectModalDismissedRound = 0;
    render();
  });
  document.getElementById("close-final-modal")?.addEventListener("click", () => {
    state.facilitatorFinalModalDismissed = true;
    render();
  });
}

function renderAdmin() {
  const injectCount = state.injectLibrary.length;

  appRoot.innerHTML = `
    <div class="app-shell">
      <div class="hero">
        <div>
          <div class="eyebrow">Admin Console</div>
          <h1>Inject Builder</h1>
          <p class="muted">Manage the persistent inject library from a separate protected admin route.</p>
        </div>
        <div class="controls">
          <a href="/facilitator"><button class="secondary" type="button">Back to Facilitator</button></a>
          ${state.adminAuthenticated ? `<button id="admin-logout">Log Out</button>` : ""}
        </div>
      </div>
      ${state.adminChecking ? `
        <div class="panel">
          <div class="muted">Checking admin session...</div>
        </div>
      ` : !state.adminConfigured ? `
        <div class="panel">
          <div class="eyebrow">Not Configured</div>
          <h2>Admin login is disabled</h2>
          <p class="muted">Set <code>ADMIN_PASSWORD_HASH</code> on the server to enable the admin route.</p>
        </div>
      ` : !state.adminAuthenticated ? `
        <div class="panel admin-login-panel">
          <div class="eyebrow">Admin Login</div>
          <h2>Sign in to manage inject cards</h2>
          <p class="muted">This route is separate from the live game and uses a secure admin session.</p>
          ${state.adminLoginError ? `<div class="badge bad">${escapeHtml(state.adminLoginError)}</div>` : ""}
          <div class="join-form">
            <input id="admin-password" type="password" placeholder="Admin password">
            <button id="admin-login">Log In</button>
          </div>
        </div>
      ` : `
        <div class="panel room-panel">
          <div class="room-panel-header">
            <div>
              <div class="eyebrow">Library Status</div>
              <h2>${injectCount} Inject Cards</h2>
            </div>
            <div class="controls">
              <button class="secondary" id="create-new-inject" type="button">New Inject</button>
            </div>
          </div>
          <div class="stat-grid">
            <div class="stat"><span class="muted">Saved Injects</span><span class="value">${injectCount}</span></div>
            <div class="stat"><span class="muted">Status</span><span class="value">Protected</span></div>
            <div class="stat"><span class="muted">Route</span><span class="value">/admin/injects</span></div>
            <div class="stat"><span class="muted">Access</span><span class="value">Cookie Session</span></div>
          </div>
        </div>
        ${renderInjectBuilderContent()}
      `}
    </div>
  `;

  document.getElementById("admin-login")?.addEventListener("click", () => {
    const password = (document.getElementById("admin-password") as HTMLInputElement | null)?.value ?? "";
    void loginAdmin(password);
  });
  document.getElementById("admin-password")?.addEventListener("keydown", (event) => {
    if (event.key !== "Enter") return;
    const password = (document.getElementById("admin-password") as HTMLInputElement | null)?.value ?? "";
    void loginAdmin(password);
  });
  document.getElementById("admin-logout")?.addEventListener("click", () => {
    void logoutAdmin();
  });

  if (!state.adminAuthenticated) return;
  document.getElementById("create-new-inject")?.addEventListener("click", () => selectAdminInject());
  document.querySelectorAll("[data-inject-edit-id]").forEach((button) => {
    button.addEventListener("click", () => selectAdminInject(button.getAttribute("data-inject-edit-id") ?? ""));
  });
  document.querySelectorAll("[data-inject-delete-id]").forEach((button) => {
    button.addEventListener("click", async () => {
      const injectId = button.getAttribute("data-inject-delete-id") ?? "";
      const inject = state.injectLibrary.find((entry) => entry.id === injectId);
      if (!inject) return;
      const confirmed = window.confirm(`Delete inject card "${inject.event}"?`);
      if (!confirmed) return;

      try {
        const response = await adminApiFetch(`/api/admin/injects/${injectId}`, { method: "DELETE" });
        if (!response.ok) {
          const payload = (await response.json()) as { message?: string };
          throw new Error(payload.message ?? "Unable to delete inject.");
        }
        await loadAdminInjectLibrary();
        if (state.injectEditorId === injectId) {
          state.injectEditorId = "";
          state.injectDraft = createEmptyInjectDraft();
        }
        render();
      } catch (error) {
        state.injectBuilderError = error instanceof Error ? error.message : "Unable to delete inject.";
        render();
      }
    });
  });
  document.getElementById("add-impact-row")?.addEventListener("click", () => {
    state.injectDraft.impacts.push({ text: "", mitigatedBy: controlCards[0]?.title ?? "" });
    render();
  });
  document.querySelectorAll("[data-remove-impact-index]").forEach((button) => {
    button.addEventListener("click", () => {
      const index = Number(button.getAttribute("data-remove-impact-index"));
      state.injectDraft.impacts.splice(index, 1);
      render();
    });
  });
  document.querySelectorAll("[data-impact-text-index]").forEach((input) => {
    input.addEventListener("input", () => {
      const index = Number(input.getAttribute("data-impact-text-index"));
      state.injectDraft.impacts[index].text = (input as HTMLInputElement).value;
    });
  });
  document.querySelectorAll("[data-impact-control-index]").forEach((select) => {
    select.addEventListener("change", () => {
      const index = Number(select.getAttribute("data-impact-control-index"));
      state.injectDraft.impacts[index].mitigatedBy = (select as HTMLSelectElement).value;
    });
  });
  document.getElementById("save-inject")?.addEventListener("click", async () => {
    state.injectBuilderError = "";
    state.injectDraft.event = (document.getElementById("inject-event") as HTMLInputElement | null)?.value ?? "";
    state.injectDraft.description = (document.getElementById("inject-description") as HTMLTextAreaElement | null)?.value ?? "";
    state.injectDraft.stats = (document.getElementById("inject-stats") as HTMLTextAreaElement | null)?.value ?? "";
    state.injectDraft.remediation = (document.getElementById("inject-remediation") as HTMLTextAreaElement | null)?.value ?? "";

    try {
      const response = await adminApiFetch(state.injectEditorId ? `/api/admin/injects/${state.injectEditorId}` : "/api/admin/injects", {
        method: state.injectEditorId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(state.injectDraft)
      });
      const payload = (await response.json()) as { inject?: InjectCard; message?: string };
      if (!response.ok) {
        throw new Error(payload.message ?? "Unable to save inject.");
      }
      await loadAdminInjectLibrary();
      if (payload.inject) {
        state.injectEditorId = payload.inject.id;
        state.injectDraft = cloneInjectDraft(payload.inject);
      }
      render();
    } catch (error) {
      state.injectBuilderError = error instanceof Error ? error.message : "Unable to save inject.";
      render();
    }
  });
}

function renderLockedDeck(player: PlayerState) {
  return `
    <div class="panel">
      <div class="eyebrow">Locked Loadout</div>
      <h3>Your Controls</h3>
      ${player.selectedCards.length
        ? player.selectedCards.map((title) => `<div class="inject-row"><span>${escapeHtml(title)}</span></div>`).join("")
        : `<div class="muted">No cards selected.</div>`}
    </div>
  `;
}

function renderPlayerInject(currentInject: CurrentInjectView, playerId: string) {
  const localPlayer = getLocalPlayer();
  const resolution = currentInject.resolutions.find((entry) => entry.playerId === playerId);
  const reportDraft = getReportDraft(currentInject.round);
  return `
    <h3>Round ${currentInject.round}: ${escapeHtml(currentInject.inject.event)}</h3>
    <p class="muted">${escapeHtml(currentInject.inject.description)}</p>
    ${currentInject.inject.impacts.map((impact) => {
      const protectedByPlayer = localPlayer?.selectedCards.includes(impact.mitigatedBy);
      return `
        <div class="inject-impact ${protectedByPlayer ? "good" : "bad"}">
          <strong>${escapeHtml(impact.text)}</strong>
          <div class="muted">${protectedByPlayer ? `Covered by ${escapeHtml(impact.mitigatedBy)}` : `Missing ${escapeHtml(impact.mitigatedBy)}`}</div>
        </div>
      `;
    }).join("")}
    <div class="spacer"></div>
    <div class="inject-row">
      <strong>Your result</strong>
      <div class="stack">
        ${resolution?.reportSubmitted ? `<span class="badge good">Report +${resolution.reportBonus}</span>` : ""}
        <span class="badge ${resolution && resolution.delta >= 0 ? "good" : "bad"}">${resolution ? `${resolution.delta >= 0 ? "+" : ""}${resolution.delta}` : "Pending"}</span>
      </div>
    </div>
    <div class="muted">${escapeHtml(currentInject.inject.remediation)}</div>
    ${resolution && !resolution.reportSubmitted ? `
      <div class="spacer"></div>
      <div class="report-form">
        <div class="eyebrow">Optional Incident Report</div>
        <p class="muted">Submit a short round report for a +5 bonus.</p>
        <textarea id="report-summary" class="report-textarea" placeholder="What happened for your team, and what would you do next?">${escapeHtml(reportDraft.summary)}</textarea>
        <div class="report-checkboxes">
          ${["Law Enforcement", "Management", "Internal Ticketing", "Communications / PR", "Legal / Compliance"].map((label) => `
            <label class="report-check">
              <input type="checkbox" value="${label}" ${reportDraft.notified.includes(label) ? "checked" : ""}>
              <span>${label}</span>
            </label>
          `).join("")}
        </div>
        <button id="submit-report" class="success">Submit Report (+5)</button>
      </div>
    ` : resolution?.reportSubmitted ? `
      <div class="spacer"></div>
      <div class="report-card">
        <strong>Report submitted</strong>
        <div class="muted">Your round report bonus has been applied.</div>
      </div>
    ` : ""}
  `;
}

function renderDeckBuilder(player: PlayerState) {
  const deckbuildCountdown = state.room?.deckbuildAutoLockAt ? formatCountdown(state.room.deckbuildAutoLockAt) : "";
  return `
    <div class="panel">
      <div class="deckbuild-sticky">
        <div class="deckbuild-budget">
          <div>
            <div class="eyebrow">Budget Left</div>
            <strong>$${player.budgetRemaining.toLocaleString()}</strong>
          </div>
          <div class="muted">${player.selectedCards.length} cards selected</div>
        </div>
        <div class="row">
          ${player.locked
            ? `<button class="secondary" id="unlock-deck">Unlock Deck</button>`
            : `<button class="success" id="lock-deck">Lock Deck</button>`}
        </div>
      </div>
      ${deckbuildCountdown ? `<div class="badge warn deckbuild-timer-badge">Auto-lock in ${deckbuildCountdown}</div><div class="spacer"></div>` : ""}
      <div class="spacer"></div>
      <div class="controls-grid">
        ${categoryOrder.map((category) => {
          const cards = controlCards.filter((card) => card.category === category);
          const categoryClass = categoryClassMap[category];
          return `
            <div class="category category-${categoryClass}">
              <div class="eyebrow">${category}</div>
              <h3>${category} Cards</h3>
              ${cards.map((card) => `
                <div class="control-card category-${categoryClass} ${cardSelected(player, card.title) ? "selected" : ""}">
                  <strong>${escapeHtml(card.title)}</strong>
                  <div class="muted">${escapeHtml(card.desc)}</div>
                  <div class="row">
                    <span class="badge warn category-badge-${categoryClass}">$${card.cost.toLocaleString()}</span>
                    ${cardSelected(player, card.title) ? `<span class="badge good">Selected</span>` : ""}
                  </div>
                  <button class="category-button-${categoryClass}" ${player.locked ? "disabled" : ""} data-card-toggle="${escapeHtml(card.title)}">${cardSelected(player, card.title) ? "Remove" : "Add to Deck"}</button>
                </div>
              `).join("")}
            </div>
          `;
        }).join("")}
      </div>
    </div>
  `;
}
function renderPlayer() {
  const room = state.room;
  const player = getLocalPlayer();
  const isDeckbuild = room?.phase === "deckbuild";

  appRoot.innerHTML = `
    <div class="app-shell">
      <div class="hero">
        <div>
          <div class="eyebrow">Player Console</div>
          <h1>${player ? escapeHtml(player.name) : "Join the room"}</h1>
          <p class="muted">${room ? `Room ${room.roomCode} • Phase: ${room.phase}` : "Enter the facilitator's room code and your name to join."}</p>
        </div>
      </div>
      ${state.error ? `<div class="panel"><span class="badge bad">${escapeHtml(state.error)}</span></div>` : ""}
      ${!player ? `
        <div class="panel">
          <div class="join-form">
            <input id="room-code" placeholder="Room code" value="${escapeHtml(state.roomCode)}" maxlength="4">
            <input id="player-name" placeholder="Your name" value="${escapeHtml(state.playerName)}" maxlength="24">
            <button id="join-room">Join Room</button>
            <button class="secondary" id="change-room-link" type="button">Use Different Room</button>
          </div>
        </div>
      ` : `
        ${isDeckbuild ? `
          <div>
            ${renderDeckBuilder(player)}
          </div>
        ` : `
          <div class="layout">
            <div>
              <div class="panel">
                <div class="stat-grid">
                  <div class="stat"><span class="muted">Budget Left</span><span class="value">${player.budgetRemaining.toLocaleString()}</span></div>
                  <div class="stat"><span class="muted">Score</span><span class="value">${player.score}</span></div>
                  <div class="stat"><span class="muted">Critical Hits</span><span class="value">${player.criticalHits}</span></div>
                  <div class="stat"><span class="muted">Deck Status</span><span class="value">${player.locked ? "Locked" : "Open"}</span></div>
                </div>
              </div>
              ${renderLockedDeck(player)}
            </div>
            <div>
              <div class="panel">
                <div class="eyebrow">Current Round</div>
                ${room?.currentInject ? renderPlayerInject(room.currentInject, player.id) : `<div class="muted">Waiting for the facilitator to draw the next inject.</div>`}
              </div>
            </div>
          </div>
        `}
      `}
    </div>
  `;

  document.getElementById("join-room")?.addEventListener("click", () => {
    const roomCode = (document.getElementById("room-code") as HTMLInputElement).value.toUpperCase();
    const playerName = (document.getElementById("player-name") as HTMLInputElement).value;
    state.roomCode = roomCode;
    state.playerName = playerName;
    persistPlayerIdentity(roomCode, playerName);
    setActivePlayerRoomCode(roomCode);
    history.replaceState(null, "", `/player?room=${roomCode}`);
    send({ type: "join-room", roomCode, name: playerName, sessionKey: getOrCreatePlayerSessionKey(roomCode) });
  });

  document.getElementById("room-code")?.addEventListener("input", (event) => {
    state.roomCode = (event.target as HTMLInputElement).value.toUpperCase();
  });
  document.getElementById("player-name")?.addEventListener("input", (event) => {
    state.playerName = (event.target as HTMLInputElement).value;
  });

  document.getElementById("change-room-link")?.addEventListener("click", () => {
    state.roomCode = "";
    state.room = null;
    state.error = "";
    clearActivePlayerRoomCode();
    history.replaceState(null, "", "/player");
    render();
  });

  document.querySelectorAll("[data-card-toggle]").forEach((button) => {
    button.addEventListener("click", () => {
      send({ type: "toggle-card", roomCode: state.roomCode, cardTitle: button.getAttribute("data-card-toggle") ?? "" });
    });
  });

  document.getElementById("lock-deck")?.addEventListener("click", () => send({ type: "lock-deck", roomCode: state.roomCode }));
  document.getElementById("unlock-deck")?.addEventListener("click", () => send({ type: "unlock-deck", roomCode: state.roomCode }));
  document.getElementById("report-summary")?.addEventListener("input", () => {
    const currentRound = room?.currentInject?.round;
    if (!currentRound) return;
    const summary = (document.getElementById("report-summary") as HTMLTextAreaElement | null)?.value ?? "";
    const notified = [...document.querySelectorAll(".report-check input:checked")]
      .map((input) => (input as HTMLInputElement).value);
    updateReportDraft(currentRound, { summary, notified });
  });
  document.querySelectorAll(".report-check input").forEach((input) => {
    input.addEventListener("change", () => {
      const currentRound = room?.currentInject?.round;
      if (!currentRound) return;
      const summary = (document.getElementById("report-summary") as HTMLTextAreaElement | null)?.value ?? "";
      const notified = [...document.querySelectorAll(".report-check input:checked")]
        .map((entry) => (entry as HTMLInputElement).value);
      updateReportDraft(currentRound, { summary, notified });
    });
  });
  document.getElementById("submit-report")?.addEventListener("click", () => {
    const currentRound = room?.currentInject?.round;
    const draft = currentRound ? getReportDraft(currentRound) : { summary: "", notified: [] };
    const summaryInput = (document.getElementById("report-summary") as HTMLTextAreaElement | null)?.value ?? "";
    const summary = draft.summary || summaryInput;
    const notified = draft.notified.length
      ? draft.notified
      : [...document.querySelectorAll(".report-check input:checked")]
          .map((input) => (input as HTMLInputElement).value);
    send({ type: "submit-report", roomCode: state.roomCode, summary, notified });
  });
}

function render() {
  const preservedFields = capturePreservedFields();
  const view = getView();
  if (view === "landing") {
    renderLanding();
    restorePreservedFields(preservedFields);
    return;
  }
  if (view === "facilitator") {
    renderFacilitator();
    restorePreservedFields(preservedFields);
    return;
  }
  if (view === "admin") {
    renderAdmin();
    restorePreservedFields(preservedFields);
    return;
  }
  renderPlayer();
  restorePreservedFields(preservedFields);
}

async function initialize() {
  const view = getView();
  if (view === "facilitator") {
    await loadHostInfo();
  }
  if (view === "admin") {
    await loadAdminSession();
  }
  render();
}

window.setInterval(() => {
  state.currentTime = Date.now();
  if (state.room?.phase === "deckbuild" && state.room.deckbuildAutoLockAt) {
    render();
  }
}, 1000);

connect();
maybeAutoRejoinPlayerRoom();
maybeAutoRejoinFacilitatorRoom();
void initialize();
