import { Prize, SpinResult, PlayHistory, Player } from '../types';

const STORAGE_KEY = 'luckyWheelGame';

// Select a prize based on probability
export function selectPrize(prizes: Prize[]): Prize {
  const totalWeight = prizes.reduce((sum, p) => sum + (p.weight || 1), 0);
  const rand = Math.random() * totalWeight;
  let acc = 0;

  for (const prize of prizes) {
    acc += prize.weight || 1;
    if (rand < acc) return prize;
  }

  return prizes[prizes.length - 1]; // fallback
}

// Calculate the rotation angle for the wheel to land on a specific prize
export const calculateTargetAngle = (prizes: Prize[], selectedPrize: Prize): number => {
  const segmentAngle = 360 / prizes.length;
  const prizeIndex = prizes.findIndex(prize => prize.id === selectedPrize.id);
  
  // Calculate the middle angle of the prize segment (to center it)
  const baseAngle = prizeIndex * segmentAngle;
  const middleAngle = baseAngle + segmentAngle / 2;
  
  // Add extra rotations (2-5 full rotations) for more dramatic effect
  const extraRotations = 2 + Math.floor(Math.random() * 4);
  const extraAngle = extraRotations * 360;
  
  // Final angle is the middle of the segment plus extra rotations
  // We subtract from 360 because the wheel rotates clockwise
  return extraAngle + (360 - middleAngle);
};

// Save play history to local storage
export const savePlayHistory = (player: Player, spinResult: SpinResult): void => {
  const existingDataString = localStorage.getItem(STORAGE_KEY);
  let history: PlayHistory;
  
  if (existingDataString) {
    const existingData: PlayHistory = JSON.parse(existingDataString);
    history = {
      player,
      spins: [...existingData.spins, spinResult]
    };
  } else {
    history = {
      player,
      spins: [spinResult]
    };
  }
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
};

// Get remaining plays for today
export const getRemainingPlays = (maxPlaysPerDay: number): number => {
  const existingDataString = localStorage.getItem(STORAGE_KEY);
  
  if (!existingDataString) {
    return maxPlaysPerDay;
  }
  
  const existingData: PlayHistory = JSON.parse(existingDataString);
  const today = new Date().setHours(0, 0, 0, 0);
  
  const playsToday = existingData.spins.filter(spin => {
    const spinDate = new Date(spin.timestamp).setHours(0, 0, 0, 0);
    return spinDate === today;
  }).length;
  
  return Math.max(0, maxPlaysPerDay - playsToday);
};

// Check if player has registered before
export const getStoredPlayer = (): Player | null => {
  const existingDataString = localStorage.getItem(STORAGE_KEY);
  
  if (!existingDataString) {
    return null;
  }
  
  const existingData: PlayHistory = JSON.parse(existingDataString);
  return existingData.player;
};