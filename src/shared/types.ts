export type ControlCategory = "Identify" | "Protect" | "Detect" | "Respond";

export interface ControlCard {
  title: string;
  category: ControlCategory;
  cost: number;
  desc: string;
}

export interface InjectImpact {
  text: string;
  mitigatedBy: string;
}

export interface InjectCard {
  id: string;
  event: string;
  description: string;
  impacts: InjectImpact[];
  stats: string;
  remediation: string;
}

export type RoomPhase = "lobby" | "deckbuild" | "gameplay" | "hotwash";

export interface PlayerState {
  id: string;
  name: string;
  joinedAt: number;
  locked: boolean;
  selectedCards: string[];
  budgetRemaining: number;
  score: number;
  criticalHits: number;
  lastDelta: number;
  connected: boolean;
}

export interface InjectResolution {
  playerId: string;
  playerName: string;
  delta: number;
  protectedCount: number;
  missedCount: number;
  score: number;
  criticalHits: number;
  reportSubmitted: boolean;
  reportBonus: number;
}

export interface IncidentReport {
  playerId: string;
  playerName: string;
  summary: string;
  notified: string[];
  submittedAt: number;
}

export interface CurrentInjectView {
  round: number;
  inject: InjectCard;
  resolutions: InjectResolution[];
  reports: IncidentReport[];
}

export interface RoomState {
  roomCode: string;
  facilitatorId: string;
  phase: RoomPhase;
  maxRounds: number;
  round: number;
  cards: ControlCard[];
  injectDeck: InjectCard[];
  currentInject: CurrentInjectView | null;
  players: PlayerState[];
}

export interface InjectCardDraft {
  event: string;
  description: string;
  impacts: InjectImpact[];
  stats: string;
  remediation: string;
}

export type ServerToClientMessage =
  | { type: "welcome"; clientId: string; role: "facilitator" | "player" }
  | { type: "room-created"; roomCode: string }
  | { type: "room-state"; room: RoomState }
  | { type: "error"; message: string };

export type ClientToServerMessage =
  | { type: "create-room"; sessionKey: string }
  | { type: "join-room"; roomCode: string; name: string; sessionKey: string }
  | { type: "rejoin-facilitator"; roomCode: string; sessionKey: string }
  | { type: "toggle-card"; roomCode: string; cardTitle: string }
  | { type: "lock-deck"; roomCode: string }
  | { type: "unlock-deck"; roomCode: string }
  | { type: "begin-gameplay"; roomCode: string }
  | { type: "draw-inject"; roomCode: string }
  | { type: "submit-report"; roomCode: string; summary: string; notified: string[] }
  | { type: "remove-player"; roomCode: string; playerId: string }
  | { type: "reset-room"; roomCode: string };


