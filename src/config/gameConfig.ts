import { GameConfig } from '../types';

export const gameConfig = {
  title: "Vòng Quay May Mắn",
  description: "Quay để trúng quà hấp dẫn!",
  maxPlaysPerDay: 300,
  prizes: [
    { id: '1', name: 'Freeship', backgroundColor: '#f44336' },
    { id: '2', name: 'Giảm 50k', backgroundColor: '#2196f3' },
    { id: '3', name: 'Voucher 100k', backgroundColor: '#4caf50' },
    { id: '4', name: 'Chúc may mắn', backgroundColor: '#ff9800' },
    { id: '5', name: 'Thêm lượt', backgroundColor: '#9c27b0' },
    { id: '6', name: 'Trúng tour!', backgroundColor: '#00bcd4' },
  ]
};
