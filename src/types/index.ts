export interface Prize {
  id: number;
  name: string;
  backgroundColor: string;
  weight: number;
  quantityLeft: number;
}

export interface GameConfig {
  maxPlaysPerDay: number;
  prizes: Prize[];
}

export interface Player {
  name: string;
  phone: string;
  sessionId?: string;
  remainingPlays?: number;
}

export interface SpinResult {
  prizeId: number;
  timestamp: number;
}

export interface PlayHistory {
  player: Player;
  spins: SpinResult[];
}

export interface ApiResponse<T> {
  status: string;
  message: string;
  data: T;
}

export interface StartGameResponse {
  session_id: string;
  maxPlaysPerDay: number;
  playsToday: number;
  remainingPlays: number;
}

export interface SpinResponse {
  angle: number;
  index: number;
  prize: {
    id: string;
    name: string;
    backgroundColor: string;
  };
  session_id: string;
}