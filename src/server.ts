import { randomUUID, scryptSync, timingSafeEqual } from "node:crypto";
import "dotenv/config";
import express from "express";
import fs from "node:fs";
import http from "node:http";
import os from "node:os";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";
import { WebSocketServer, type WebSocket } from "ws";
import { controlCards, injectCards as seedInjectCards } from "./shared/gameData.js";
import type {
  ClientToServerMessage,
  CurrentInjectView,
  InjectCard,
  InjectCardDraft,
  InjectResolution,
  PlayerState,
  RoomPhase,
  RoomState,
  ServerToClientMessage
} from "./shared/types.js";

interface RoomInternal {
  roomCode: string;
  facilitatorId: string;
  facilitatorSessionKey: string;
  phase: RoomPhase;
  maxRounds: number;
  round: number;
  deckbuildAutoLockAt: number | null;
  deckbuildTimer: ReturnType<typeof setTimeout> | null;
  cards: typeof controlCards;
  injectDeck: InjectCard[];
  currentInject: CurrentInjectView | null;
  players: Map<string, PlayerState & { sessionKey: string }>;
}

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });
const port = Number(process.env.PORT ?? 3000);
const joinBaseUrl = process.env.JOIN_BASE_URL?.trim().replace(/\/+$/, "") ?? "";
const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH?.trim() ?? "";
const adminSessionCookieName = "irtt_admin_session";
const adminSessionTtlMs = 1000 * 60 * 60 * 12;

const rooms = new Map<string, RoomInternal>();
const sockets = new Map<string, WebSocket>();
const socketRoles = new Map<string, "facilitator" | "player">();
const socketRooms = new Map<string, string>();
const adminSessions = new Map<string, { expiresAt: number }>();

const injectStore = createInjectStore();

app.set("trust proxy", 1);
app.use(express.json());
app.use(express.static(path.resolve("public")));

function parseCookies(req: express.Request) {
  const cookieHeader = req.headers.cookie ?? "";
  return cookieHeader
    .split(";")
    .map((entry) => entry.trim())
    .filter(Boolean)
    .reduce<Record<string, string>>((cookies, entry) => {
      const separatorIndex = entry.indexOf("=");
      if (separatorIndex === -1) return cookies;
      const key = entry.slice(0, separatorIndex).trim();
      const value = decodeURIComponent(entry.slice(separatorIndex + 1).trim());
      cookies[key] = value;
      return cookies;
    }, {});
}

function isSecureRequest(req: express.Request) {
  return req.secure || req.headers["x-forwarded-proto"] === "https";
}

function buildAdminSessionCookie(req: express.Request, token: string, maxAgeSeconds: number) {
  const parts = [
    `${adminSessionCookieName}=${encodeURIComponent(token)}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Strict",
    `Max-Age=${maxAgeSeconds}`
  ];
  if (isSecureRequest(req)) {
    parts.push("Secure");
  }
  return parts.join("; ");
}

function clearExpiredAdminSessions() {
  const now = Date.now();
  for (const [token, session] of adminSessions.entries()) {
    if (session.expiresAt <= now) {
      adminSessions.delete(token);
    }
  }
}

function getActiveAdminSessionToken(req: express.Request) {
  clearExpiredAdminSessions();
  const token = parseCookies(req)[adminSessionCookieName];
  if (!token) return "";
  const session = adminSessions.get(token);
  if (!session) return "";
  if (session.expiresAt <= Date.now()) {
    adminSessions.delete(token);
    return "";
  }
  return token;
}

function verifyPasswordAgainstHash(password: string, storedHash: string) {
  const [scheme, saltBase64, hashBase64] = storedHash.split("$");
  if (scheme !== "scrypt" || !saltBase64 || !hashBase64) {
    return false;
  }

  const salt = Buffer.from(saltBase64, "base64");
  const expectedHash = Buffer.from(hashBase64, "base64");
  const derivedHash = scryptSync(password, salt, expectedHash.length);
  return expectedHash.length === derivedHash.length && timingSafeEqual(expectedHash, derivedHash);
}

function requireAdminAuth(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  if (!adminPasswordHash) {
    res.status(503).json({ message: "Admin login is not configured on this server." });
    return;
  }

  const token = getActiveAdminSessionToken(req);
  if (!token) {
    res.status(401).json({ message: "Admin login required." });
    return;
  }

  adminSessions.set(token, { expiresAt: Date.now() + adminSessionTtlMs });
  res.append("Set-Cookie", buildAdminSessionCookie(req, token, Math.floor(adminSessionTtlMs / 1000)));
  next();
}

app.get("/api/info", (_req, res) => {
  const addresses = Object.values(os.networkInterfaces())
    .flat()
    .filter((entry): entry is os.NetworkInterfaceInfo => Boolean(entry && entry.family === "IPv4" && !entry.internal))
    .map((entry) => entry.address);

  res.json({ port, addresses, joinBaseUrl, adminConfigured: Boolean(adminPasswordHash) });
});

app.get("/api/admin/session", (req, res) => {
  if (!adminPasswordHash) {
    res.json({ configured: false, authenticated: false });
    return;
  }

  const token = getActiveAdminSessionToken(req);
  if (token) {
    adminSessions.set(token, { expiresAt: Date.now() + adminSessionTtlMs });
    res.append("Set-Cookie", buildAdminSessionCookie(req, token, Math.floor(adminSessionTtlMs / 1000)));
  }

  res.json({ configured: true, authenticated: Boolean(token) });
});

app.post("/api/admin/login", (req, res) => {
  if (!adminPasswordHash) {
    res.status(503).json({ message: "Admin login is not configured on this server." });
    return;
  }

  const password = typeof req.body?.password === "string" ? req.body.password : "";
  if (!verifyPasswordAgainstHash(password, adminPasswordHash)) {
    res.status(401).json({ message: "Invalid password." });
    return;
  }

  const token = randomUUID();
  adminSessions.set(token, { expiresAt: Date.now() + adminSessionTtlMs });
  res.append("Set-Cookie", buildAdminSessionCookie(req, token, Math.floor(adminSessionTtlMs / 1000)));
  res.json({ authenticated: true });
});

app.post("/api/admin/logout", (req, res) => {
  const token = parseCookies(req)[adminSessionCookieName];
  if (token) {
    adminSessions.delete(token);
  }
  res.append("Set-Cookie", buildAdminSessionCookie(req, "", 0));
  res.status(204).end();
});

app.get("/api/admin/injects", requireAdminAuth, (_req, res) => {
  res.json({ injects: injectStore.list(), controls: controlCards.map((card) => card.title) });
});

app.post("/api/admin/injects", requireAdminAuth, (req, res) => {
  try {
    const inject = injectStore.create(req.body as Partial<InjectCardDraft>);
    res.status(201).json({ inject });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to create inject.";
    res.status(400).json({ message });
  }
});

app.put("/api/admin/injects/:id", requireAdminAuth, (req, res) => {
  try {
    const injectId = Array.isArray(req.params.id) ? req.params.id[0] ?? "" : req.params.id;
    const inject = injectStore.update(injectId, req.body as Partial<InjectCardDraft>);
    res.json({ inject });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to update inject.";
    const status = message === "Inject not found." ? 404 : 400;
    res.status(status).json({ message });
  }
});

app.delete("/api/admin/injects/:id", requireAdminAuth, (req, res) => {
  try {
    const injectId = Array.isArray(req.params.id) ? req.params.id[0] ?? "" : req.params.id;
    injectStore.remove(injectId);
    res.status(204).end();
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to delete inject.";
    const status = message === "Inject not found." ? 404 : 400;
    res.status(status).json({ message });
  }
});

app.use((_req, res) => {
  res.sendFile(path.resolve("public/index.html"));
});

function createInjectStore() {
  const dataDir = path.resolve("data");
  fs.mkdirSync(dataDir, { recursive: true });

  const db = new DatabaseSync(path.join(dataDir, "injects.db"));
  db.exec(`
    CREATE TABLE IF NOT EXISTS injects (
      id TEXT PRIMARY KEY,
      event TEXT NOT NULL,
      description TEXT NOT NULL,
      impacts_json TEXT NOT NULL,
      stats TEXT NOT NULL,
      remediation TEXT NOT NULL,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    )
  `);

  const insertMissingSeed = db.prepare(`
    INSERT OR IGNORE INTO injects (id, event, description, impacts_json, stats, remediation, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const now = Date.now();

  for (const inject of seedInjectCards) {
    insertMissingSeed.run(
      inject.id,
      inject.event,
      inject.description,
      JSON.stringify(inject.impacts),
      inject.stats,
      inject.remediation,
      now,
      now
    );
  }

  const allControlTitles = new Set(controlCards.map((card) => card.title));

  function mapRow(row: {
    id: string;
    event: string;
    description: string;
    impacts_json: string;
    stats: string;
    remediation: string;
  }): InjectCard {
    return {
      id: row.id,
      event: row.event,
      description: row.description,
      impacts: JSON.parse(row.impacts_json) as InjectCard["impacts"],
      stats: row.stats,
      remediation: row.remediation
    };
  }

  function normalizeDraft(input: Partial<InjectCardDraft>): InjectCardDraft {
    const event = (input.event ?? "").trim().slice(0, 120);
    const description = (input.description ?? "").trim().slice(0, 600);
    const stats = (input.stats ?? "").trim().slice(0, 400);
    const remediation = (input.remediation ?? "").trim().slice(0, 500);
    const impacts = Array.isArray(input.impacts)
      ? input.impacts
          .map((impact) => ({
            text: (impact?.text ?? "").trim().slice(0, 140),
            mitigatedBy: (impact?.mitigatedBy ?? "").trim()
          }))
          .filter((impact) => impact.text || impact.mitigatedBy)
      : [];

    if (!event) throw new Error("Inject title is required.");
    if (!description) throw new Error("Inject description is required.");
    if (!stats) throw new Error("Impact or stats text is required.");
    if (!remediation) throw new Error("Remediation guidance is required.");
    if (impacts.length === 0) throw new Error("Add at least one impact row.");

    for (const impact of impacts) {
      if (!impact.text) throw new Error("Each impact needs a short description.");
      if (!impact.mitigatedBy) throw new Error("Each impact must map to a control card.");
      if (!allControlTitles.has(impact.mitigatedBy)) {
        throw new Error(`Unknown control card: ${impact.mitigatedBy}`);
      }
    }

    return { event, description, impacts, stats, remediation };
  }

  const listStatement = db.prepare(`
    SELECT id, event, description, impacts_json, stats, remediation
    FROM injects
    ORDER BY updated_at DESC, event ASC
  `);
  const insertStatement = db.prepare(`
    INSERT INTO injects (id, event, description, impacts_json, stats, remediation, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const updateStatement = db.prepare(`
    UPDATE injects
    SET event = ?, description = ?, impacts_json = ?, stats = ?, remediation = ?, updated_at = ?
    WHERE id = ?
  `);
  const deleteStatement = db.prepare("DELETE FROM injects WHERE id = ?");
  const findStatement = db.prepare(`
    SELECT id, event, description, impacts_json, stats, remediation
    FROM injects
    WHERE id = ?
  `);
  const countStatement = db.prepare("SELECT COUNT(*) AS count FROM injects");

  return {
    list(): InjectCard[] {
      return (listStatement.all() as Array<{
        id: string;
        event: string;
        description: string;
        impacts_json: string;
        stats: string;
        remediation: string;
      }>).map(mapRow);
    },
    create(input: Partial<InjectCardDraft>): InjectCard {
      const inject = normalizeDraft(input);
      const id = randomUUID();
      const now = Date.now();
      insertStatement.run(
        id,
        inject.event,
        inject.description,
        JSON.stringify(inject.impacts),
        inject.stats,
        inject.remediation,
        now,
        now
      );
      return { id, ...inject };
    },
    update(id: string, input: Partial<InjectCardDraft>): InjectCard {
      const existing = findStatement.get(id) as {
        id: string;
        event: string;
        description: string;
        impacts_json: string;
        stats: string;
        remediation: string;
      } | undefined;

      if (!existing) throw new Error("Inject not found.");

      const inject = normalizeDraft(input);
      updateStatement.run(
        inject.event,
        inject.description,
        JSON.stringify(inject.impacts),
        inject.stats,
        inject.remediation,
        Date.now(),
        id
      );
      return { id, ...inject };
    },
    remove(id: string) {
      const countRow = countStatement.get() as { count: number };
      if (countRow.count <= 5) {
        throw new Error("Keep at least five inject cards available so the full game can still run.");
      }
      const result = deleteStatement.run(id);
      if (result.changes === 0) {
        throw new Error("Inject not found.");
      }
    }
  };
}

function send(ws: WebSocket, message: ServerToClientMessage) {
  if (ws.readyState === ws.OPEN) {
    ws.send(JSON.stringify(message));
  }
}

function shuffleInjectDeck(maxRounds: number) {
  const deck = injectStore.list();
  for (let index = deck.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [deck[index], deck[swapIndex]] = [deck[swapIndex], deck[index]];
  }
  return deck.slice(0, Math.min(maxRounds, deck.length));
}

function serializeRoom(room: RoomInternal): RoomState {
  return {
    roomCode: room.roomCode,
    facilitatorId: room.facilitatorId,
    phase: room.phase,
    maxRounds: room.maxRounds,
    round: room.round,
    deckbuildAutoLockAt: room.deckbuildAutoLockAt,
    cards: room.cards,
    injectDeck: room.injectDeck,
    currentInject: room.currentInject,
    players: [...room.players.values()]
      .sort((a, b) => a.joinedAt - b.joinedAt)
      .map(({ sessionKey: _sessionKey, ...player }) => player)
  };
}

function broadcastRoom(roomCode: string) {
  const room = rooms.get(roomCode);
  if (!room) return;
  const payload: ServerToClientMessage = { type: "room-state", room: serializeRoom(room) };

  for (const [clientId, ws] of sockets.entries()) {
    if (socketRooms.get(clientId) === roomCode) {
      send(ws, payload);
    }
  }
}

function createRoom(clientId: string, sessionKey: string) {
  let roomCode = "";
  do {
    roomCode = Math.random().toString(36).slice(2, 6).toUpperCase();
  } while (rooms.has(roomCode));

  const maxRounds = 5;
  const room: RoomInternal = {
    roomCode,
    facilitatorId: clientId,
    facilitatorSessionKey: sessionKey,
    phase: "deckbuild",
    maxRounds,
    round: 0,
    deckbuildAutoLockAt: null,
    deckbuildTimer: null,
    cards: controlCards,
    injectDeck: shuffleInjectDeck(maxRounds),
    currentInject: null,
    players: new Map()
  };

  rooms.set(roomCode, room);
  socketRoles.set(clientId, "facilitator");
  socketRooms.set(clientId, roomCode);
  return room;
}

function getRoomForClient(clientId: string) {
  const roomCode = socketRooms.get(clientId);
  return roomCode ? rooms.get(roomCode) : undefined;
}

function ensureFacilitator(clientId: string, roomCode: string) {
  const room = rooms.get(roomCode);
  return room && room.facilitatorId === clientId ? room : undefined;
}

function reattachFacilitator(clientId: string, roomCode: string, sessionKey: string) {
  const room = rooms.get(roomCode);
  if (!room || room.facilitatorSessionKey !== sessionKey) return undefined;
  room.facilitatorId = clientId;
  socketRoles.set(clientId, "facilitator");
  socketRooms.set(clientId, roomCode);
  return room;
}

function allPlayersLocked(room: RoomInternal) {
  const players = [...room.players.values()];
  return players.length > 0 && players.every((player) => player.locked);
}

function clearDeckbuildTimer(room: RoomInternal) {
  if (room.deckbuildTimer) {
    clearTimeout(room.deckbuildTimer);
    room.deckbuildTimer = null;
  }
  room.deckbuildAutoLockAt = null;
}

function startGameplay(room: RoomInternal, drawImmediately = false) {
  clearDeckbuildTimer(room);
  room.injectDeck = shuffleInjectDeck(room.maxRounds);
  room.phase = "gameplay";
  room.round = 0;
  room.currentInject = null;

  if (drawImmediately) {
    drawNextInject(room);
  }
}

function drawNextInject(room: RoomInternal) {
  if (room.phase !== "gameplay" || room.round >= room.injectDeck.length) return false;

  const inject = room.injectDeck[room.round];
  room.round += 1;
  const resolutions = [...room.players.values()].map((player) => resolveInjectForPlayer(player, inject));
  room.currentInject = { round: room.round, inject, resolutions, reports: [] };
  return true;
}

function scheduleDeckbuildAutoStart(room: RoomInternal, durationSeconds: number) {
  clearDeckbuildTimer(room);
  room.deckbuildAutoLockAt = Date.now() + durationSeconds * 1000;
  room.deckbuildTimer = setTimeout(() => {
    room.deckbuildTimer = null;
    room.deckbuildAutoLockAt = null;
    for (const player of room.players.values()) {
      player.locked = true;
    }
    startGameplay(room, true);
    broadcastRoom(room.roomCode);
  }, durationSeconds * 1000);
}

function remapCurrentInjectPlayer(room: RoomInternal, previousPlayerId: string, nextPlayerId: string, playerName: string) {
  if (!room.currentInject) return;

  for (const resolution of room.currentInject.resolutions) {
    if (resolution.playerId === previousPlayerId) {
      resolution.playerId = nextPlayerId;
      resolution.playerName = playerName;
    }
  }

  for (const report of room.currentInject.reports) {
    if (report.playerId === previousPlayerId) {
      report.playerId = nextPlayerId;
      report.playerName = playerName;
    }
  }
}

function playerOwnsCategory(player: PlayerState, category: string, cards: typeof controlCards) {
  return cards.some((card) => card.category === category && player.selectedCards.includes(card.title));
}

function resolveInjectForPlayer(player: PlayerState, inject: InjectCard): InjectResolution {
  let delta = 0;
  let protectedCount = 0;
  let missedCount = 0;
  const selected = new Set(player.selectedCards);

  for (const impact of inject.impacts) {
    if (selected.has(impact.mitigatedBy)) {
      delta += 5;
      protectedCount += 1;
    } else {
      delta -= 15;
      missedCount += 1;
    }
  }

  player.score = player.score + delta;
  if (delta <= -20) {
    player.criticalHits += 1;
  }
  player.lastDelta = delta;

  return {
    playerId: player.id,
    playerName: player.name,
    delta,
    protectedCount,
    missedCount,
    score: player.score,
    criticalHits: player.criticalHits,
    reportSubmitted: false,
    reportBonus: 0
  };
}

function resetRoom(room: RoomInternal) {
  clearDeckbuildTimer(room);
  room.phase = "deckbuild";
  room.round = 0;
  room.currentInject = null;
  room.injectDeck = shuffleInjectDeck(room.maxRounds);
  for (const player of room.players.values()) {
    player.locked = false;
    player.selectedCards = [];
    player.budgetRemaining = 500000;
    player.score = 65;
    player.criticalHits = 0;
    player.lastDelta = 0;
  }
}

wss.on("connection", (ws) => {
  const clientId = randomUUID();
  sockets.set(clientId, ws);
  send(ws, { type: "welcome", clientId, role: "player" });

  ws.on("message", (raw) => {
    let message: ClientToServerMessage;
    try {
      message = JSON.parse(String(raw)) as ClientToServerMessage;
    } catch {
      send(ws, { type: "error", message: "Invalid message payload." });
      return;
    }

    if (message.type === "create-room") {
      const room = createRoom(clientId, message.sessionKey);
      send(ws, { type: "room-created", roomCode: room.roomCode });
      send(ws, { type: "welcome", clientId, role: "facilitator" });
      broadcastRoom(room.roomCode);
      return;
    }

    if (message.type === "rejoin-facilitator") {
      const room = reattachFacilitator(clientId, message.roomCode.toUpperCase(), message.sessionKey);
      if (!room) {
        send(ws, { type: "error", message: "That facilitator room is no longer available." });
        return;
      }
      send(ws, { type: "room-created", roomCode: room.roomCode });
      send(ws, { type: "welcome", clientId, role: "facilitator" });
      broadcastRoom(room.roomCode);
      return;
    }
    if (message.type === "join-room") {
      const room = rooms.get(message.roomCode.toUpperCase());
      if (!room) {
        send(ws, { type: "error", message: "Room not found." });
        return;
      }

      const trimmedName = message.name.trim().slice(0, 24);
      if (!trimmedName) {
        send(ws, { type: "error", message: "Enter a player name to join." });
        return;
      }

      socketRoles.set(clientId, "player");
      socketRooms.set(clientId, room.roomCode);
      const existingPlayer = [...room.players.values()].find((player) => player.sessionKey === message.sessionKey);

      if (existingPlayer) {
        const previousPlayerId = existingPlayer.id;
        room.players.delete(existingPlayer.id);
        existingPlayer.id = clientId;
        existingPlayer.name = trimmedName;
        existingPlayer.connected = true;
        remapCurrentInjectPlayer(room, previousPlayerId, clientId, trimmedName);
        room.players.set(clientId, existingPlayer);
      } else {
        room.players.set(clientId, {
          id: clientId,
          name: trimmedName,
          joinedAt: Date.now(),
          locked: false,
          selectedCards: [],
          budgetRemaining: 500000,
          score: 65,
          criticalHits: 0,
          lastDelta: 0,
          connected: true,
          sessionKey: message.sessionKey
        });
      }

      send(ws, { type: "welcome", clientId, role: "player" });
      broadcastRoom(room.roomCode);
      return;
    }

    if (message.type === "toggle-player-lock") {
      const room = ensureFacilitator(clientId, message.roomCode);
      const player = room?.players.get(message.playerId);
      if (!room || !player || room.phase !== "deckbuild") return;

      player.locked = !player.locked;
      broadcastRoom(room.roomCode);
      return;
    }

    if (message.type === "toggle-card") {
      const room = getRoomForClient(clientId);
      const player = room?.players.get(clientId);
      const card = room?.cards.find((entry) => entry.title === message.cardTitle);
      if (!room || !player || !card || room.phase !== "deckbuild" || player.locked) return;

      const hasCard = player.selectedCards.includes(card.title);
      if (hasCard) {
        player.selectedCards = player.selectedCards.filter((title) => title !== card.title);
        player.budgetRemaining += card.cost;
      } else if (player.budgetRemaining >= card.cost) {
        player.selectedCards.push(card.title);
        player.budgetRemaining -= card.cost;
      }

      broadcastRoom(room.roomCode);
      return;
    }

    if (message.type === "lock-deck" || message.type === "unlock-deck") {
      const room = getRoomForClient(clientId);
      const player = room?.players.get(clientId);
      if (!room || !player || room.phase !== "deckbuild") return;

      const hasCoverage = ["Identify", "Protect", "Detect", "Respond"].every((category) =>
        playerOwnsCategory(player, category, room.cards)
      );
      if (message.type === "lock-deck" && !hasCoverage) {
        send(ws, { type: "error", message: "Pick at least one card from every category before locking." });
        return;
      }

      player.locked = message.type === "lock-deck";
      broadcastRoom(room.roomCode);
      return;
    }

    if (message.type === "start-deckbuild-timer") {
      const room = ensureFacilitator(clientId, message.roomCode);
      if (!room || room.phase !== "deckbuild") return;

      scheduleDeckbuildAutoStart(room, Math.max(5, Math.min(60 * 30, Math.floor(message.durationSeconds))));
      broadcastRoom(room.roomCode);
      return;
    }

    if (message.type === "begin-gameplay") {
      const room = ensureFacilitator(clientId, message.roomCode);
      if (!room) return;
      if (!allPlayersLocked(room)) {
        send(ws, { type: "error", message: "Every player must lock a deck before gameplay begins." });
        return;
      }
      startGameplay(room, false);
      broadcastRoom(room.roomCode);
      return;
    }

    if (message.type === "draw-inject") {
      const room = ensureFacilitator(clientId, message.roomCode);
      if (!room || room.phase !== "gameplay") return;
      if (room.round >= room.maxRounds) return;
      drawNextInject(room);
      broadcastRoom(room.roomCode);
      return;
    }

    if (message.type === "finish-game") {
      const room = ensureFacilitator(clientId, message.roomCode);
      if (!room || room.phase !== "gameplay" || room.round < room.maxRounds || !room.currentInject) return;
      room.phase = "hotwash";
      broadcastRoom(room.roomCode);
      return;
    }

    if (message.type === "submit-report") {
      const room = getRoomForClient(clientId);
      const player = room?.players.get(clientId);
      if (!room || !player || !room.currentInject) return;

      const resolution = room.currentInject.resolutions.find((entry) => entry.playerId === clientId);
      if (!resolution || resolution.reportSubmitted) return;

      const summary = message.summary.trim().slice(0, 500);
      const notified = [...new Set(message.notified.map((entry) => entry.trim()).filter(Boolean))].slice(0, 8);

      resolution.reportSubmitted = true;
      resolution.reportBonus = 5;
      player.score += 5;
      resolution.score = player.score;

      room.currentInject.reports.push({
        playerId: clientId,
        playerName: player.name,
        summary,
        notified,
        submittedAt: Date.now()
      });

      broadcastRoom(room.roomCode);
      return;
    }

    if (message.type === "reset-room") {
      const room = ensureFacilitator(clientId, message.roomCode);
      if (!room) return;
      resetRoom(room);
      broadcastRoom(room.roomCode);
      return;
    }

    if (message.type === "remove-player") {
      const room = ensureFacilitator(clientId, message.roomCode);
      if (!room) return;

      const player = room.players.get(message.playerId);
      if (!player) return;

      room.players.delete(message.playerId);
      socketRooms.delete(message.playerId);
      socketRoles.delete(message.playerId);

      const playerSocket = sockets.get(message.playerId);
      if (playerSocket) {
        send(playerSocket, { type: "error", message: "You were removed from the room by the facilitator." });
        try {
          playerSocket.close();
        } catch {}
      }

      broadcastRoom(room.roomCode);
      return;
    }
  });

  ws.on("close", () => {
    sockets.delete(clientId);
    const role = socketRoles.get(clientId);
    const roomCode = socketRooms.get(clientId);
    if (!roomCode) return;

    const room = rooms.get(roomCode);
    if (!room) return;

    socketRoles.delete(clientId);
    socketRooms.delete(clientId);

    if (role === "player") {
      const player = room.players.get(clientId);
      if (player) {
        player.connected = false;
      }
      broadcastRoom(roomCode);
      return;
    }

    if (role === "facilitator") {
      const roomStillOwnedBySocket = room.facilitatorId === clientId;
      if (roomStillOwnedBySocket) {
        room.facilitatorId = "";
      }
      broadcastRoom(roomCode);
    }
  });
});

server.listen(port, () => {
  console.log(`Incident Response Tabletop server running on http://localhost:${port}`);
});









