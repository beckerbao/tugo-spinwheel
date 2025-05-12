import { GameConfig } from '../types';

export const gameConfig = {
  title: "Vòng Quay May Mắn",
  description: "Quay để trúng quà hấp dẫn!",
  maxPlaysPerDay: 300,
  prizes: [
    { id: '1', name: 'Trúng tour!', backgroundColor: '#4caf50', weight: 1 },
    { id: '2', name: 'Giảm 50k', backgroundColor: '#2196f3', weight: 10 },
    { id: '3', name: 'Freeship', backgroundColor: '#ff9800', weight: 20 },
    { id: '4', name: 'Chúc may mắn lần sau', backgroundColor: '#9e9e9e', weight: 69 },
  ]
};
