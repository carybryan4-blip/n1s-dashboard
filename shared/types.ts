// Shared types between frontend and backend

export interface Player {
  userId: string;
  counterSpin: boolean;
  wins: number;
  spinnerId: string;
  bits: number;
  clan: string;
  unlocks: string[];
}

export interface LeaderboardEntry {
  rank: number;
  player: Player;
}

export interface GameState {
  currentMap: string | null;
  currentGamemode: GameMode | null;
  currentEvent: string | null;
  isLive: boolean;
}

export type GameMode = 'FreeForAll' | 'Oddball' | 'TeamDeathmatch' | 'Infection';

export interface ServerStatus {
  connected: boolean;
  playerCount: number;
  lastUpdate: string;
}

// WebSocket event types
export type WSEventType = 'players_update' | 'status_update';

export interface WSMessage<T = unknown> {
  type: WSEventType;
  data: T;
  timestamp: string;
}
