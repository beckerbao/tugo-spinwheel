import { GameConfig } from '../types';

export const gameConfig: GameConfig = {
  title: "Vòng Quay May Mắn",
  description: "Hãy quay vòng quay để có cơ hội nhận những phần quà hấp dẫn! Mỗi người chơi có thể quay tối đa 3 lần mỗi ngày.",
  maxPlaysPerDay: 30,
  maxPlaysTotal: 100,
  prizes: [
    {
      id: 1,
      name: "Freeship",
      probability: 20,
      backgroundColor: "#FF9A76",
      textColor: "#FFFFFF"
    },
    {
      id: 2,
      name: "Chúc may mắn lần sau",
      probability: 15,
      backgroundColor: "#FFE66D",
      textColor: "#000000"
    },
    {
      id: 3,
      name: "Freeship",
      probability: 20,
      backgroundColor: "#FF9A76",
      textColor: "#FFFFFF"
    },
    {
      id: 4,
      name: "Voucher 50.000đ",
      probability: 10,
      backgroundColor: "#FF6B6B",
      textColor: "#FFFFFF"
    },
    {
      id: 5,
      name: "Freeship",
      probability: 20,
      backgroundColor: "#FF9A76",
      textColor: "#FFFFFF"
    },
    {
      id: 6,
      name: "Chúc may mắn lần sau",
      probability: 15,
      backgroundColor: "#FFE66D",
      textColor: "#000000"
    },
    {
      id: 7,
      name: "Voucher 100.000đ",
      probability: 10,
      backgroundColor: "#4ECDC4",
      textColor: "#FFFFFF"
    },
    {
      id: 8,
      name: "Freeship",
      probability: 20,
      backgroundColor: "#FF9A76",
      textColor: "#FFFFFF"
    }
  ]
};