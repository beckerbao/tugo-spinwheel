export interface Prize {
  id: number;
  name: string;
  probability: number;
  backgroundColor: string;
  textColor: string;
}

export interface GameConfig {
  title: string;
  description: string;
  maxPlaysPerDay: number;
  maxPlaysTotal: number;
  prizes: Prize[];
}

export interface Player {
  name: string;
  phone: string;
}

export interface SpinResult {
  prizeId: number;
  timestamp: number;
}

export interface PlayHistory {
  player: Player;
  spins: SpinResult[];
}