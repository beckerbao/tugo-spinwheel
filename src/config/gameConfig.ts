import { GameConfig } from '../types';

export async function fetchGameConfig(): Promise<GameConfig> {
  try {
    const apiDomain = import.meta.env.VITE_API_DOMAIN;
    const response = await fetch(`${apiDomain}/api/v1/game/config`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch game config');
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('Error fetching game config:', error);
    throw error;
  }
}