import React, { useEffect, useState } from 'react';
import { Prize } from '../types';
import confetti from '../utils/confetti';

interface PrizeNotificationProps {
  prize: Prize | null;
  isOpen: boolean;
  onClose: () => void;
}

const PrizeNotification: React.FC<PrizeNotificationProps> = ({ prize, isOpen, onClose }) => {
  const [animate, setAnimate] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    if (isOpen && prize) {
      setMounted(true);
      requestAnimationFrame(() => {
        setAnimate(true);
        if (prize.name !== "Chúc may mắn lần sau") {
          confetti.start();
          setTimeout(() => {
            confetti.stop();
          }, 5000);
        }
      });
    } else {
      setAnimate(false);
      const timer = setTimeout(() => {
        setMounted(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen, prize]);
  
  if (!mounted || !prize) return null;
  
  const isWinner = prize.name !== "Chúc may mắn lần sau";
  
  return (
    <div 
      className={`fixed inset-0 transition-opacity duration-300 flex items-center justify-center p-4 z-50 ${
        animate ? 'bg-black bg-opacity-50' : 'bg-black bg-opacity-0'
      }`}
      onClick={onClose}
    >
      <div 
        className={`bg-white rounded-lg shadow-lg max-w-md w-full p-6 transform transition-all duration-300 ${
          animate ? 'scale-100 opacity-100' : 'scale-90 opacity-0'
        }`}
        onClick={e => e.stopPropagation()}
      >
        <div className="text-center">
          <h3 className={`text-2xl font-bold mb-4 ${isWinner ? 'text-green-600' : 'text-gray-600'}`}>
            {isWinner ? 'Chúc mừng! 🎉' : 'Kết quả'}
          </h3>
          
          <div 
            className={`w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center ${isWinner ? 'bg-green-100' : 'bg-gray-100'}`}
          >
            <div 
              className={`text-4xl ${isWinner ? 'animate-bounce' : ''}`}
            >
              {isWinner ? '🎁' : '😊'}
            </div>
          </div>
          
          <div 
            className={`text-lg font-medium p-4 mb-6 rounded-md ${
              isWinner 
                ? 'bg-green-100 text-green-800 border border-green-200' 
                : 'bg-gray-100 text-gray-800 border border-gray-200'
            }`}
          >
            {isWinner 
              ? `Bạn đã trúng "${prize.name}"!` 
              : prize.name
            }
          </div>
          
          {isWinner && (
            <p className="text-gray-600 mb-6">
              Chúng tôi sẽ liên hệ với bạn qua số điện thoại đã đăng ký để trao giải trong thời gian sớm nhất.
            </p>
          )}
          
          <button
            onClick={onClose}
            className={`w-full py-3 px-4 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              isWinner 
                ? 'bg-purple-600 hover:bg-purple-700 text-white focus:ring-purple-500' 
                : 'bg-gray-600 hover:bg-gray-700 text-white focus:ring-gray-500'
            } transition duration-200`}
          >
            {isWinner ? 'Tuyệt vời!' : 'Thử lại may mắn'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrizeNotification;