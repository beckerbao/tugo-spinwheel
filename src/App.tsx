import React, { useState, useEffect } from 'react';
import { Player, Prize } from './types';
import { gameConfig } from './config/gameConfig';
import { 
  selectPrize, 
  calculateTargetAngle, 
  savePlayHistory, 
  getRemainingPlays
} from './utils/gameUtils';
import RegistrationForm from './components/RegistrationForm';
import LuckyWheel from './components/LuckyWheel';
import PrizeNotification from './components/PrizeNotification';
import SocialShare from './components/SocialShare';
import Footer from './components/Footer';
import { Gift } from 'lucide-react';

function App() {
  const [player, setPlayer] = useState<Player | null>(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [hasSpinEnded, setHasSpinEnded] = useState(false);
  const [targetAngle, setTargetAngle] = useState(0);
  const [remainingPlays, setRemainingPlays] = useState(gameConfig.maxPlaysPerDay);
  const [selectedPrize, setSelectedPrize] = useState<Prize | null>(null);
  const [showPrizeModal, setShowPrizeModal] = useState(false);

  useEffect(() => {
    const remaining = getRemainingPlays(gameConfig.maxPlaysPerDay);
    setRemainingPlays(remaining);
  }, []);

  const handleRegister = (playerData: Player) => {
    setPlayer(playerData);
    setIsRegistered(true);
  };

  const handleSpin = () => {
    if (isSpinning || remainingPlays <= 0 || !player) return;
  
    const prize = selectPrize(gameConfig.prizes); // random theo tỉ lệ nếu có
    const index = gameConfig.prizes.findIndex(p => p.id === prize.id);
    const anglePerPrize = 360 / gameConfig.prizes.length;
  
    const targetIndexAngle = index * anglePerPrize;
    const fullSpins = 360 * 3;
    const randomOffset = Math.random() * anglePerPrize * 0.8 - anglePerPrize * 0.4;
    const angle = fullSpins + targetIndexAngle + randomOffset;
  
    console.log("🎯 Random target:", prize.name, "| Final angle:", angle);
  
    setTargetAngle(angle);
    setSelectedPrize(prize); // set ngay để hiển thị
    setIsSpinning(true);
    setHasSpinEnded(false);
    setShowPrizeModal(false);
  
    savePlayHistory(player, {
      prizeId: prize.id,
      timestamp: Date.now(),
    });
  
    setRemainingPlays(prev => prev - 1);
  };
  

  const handleSpinEnd = () => {
    const normalizedAngle = (360 - (targetAngle % 360)) % 360;
    const anglePerPrize = 360 / gameConfig.prizes.length;
    const index = Math.floor(normalizedAngle / anglePerPrize);
    const actualPrize = gameConfig.prizes[index];
  
    console.log("🎯 Prize at pointer:", actualPrize.name, "| Angle:", normalizedAngle);
  
    setSelectedPrize(actualPrize);
    setIsSpinning(false);
    setHasSpinEnded(true);
    setShowPrizeModal(true);
  };

  const handleCloseModal = () => {
    setShowPrizeModal(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-purple-50 to-purple-100">
      <header className="bg-purple-700 text-white py-6 px-4 shadow-md">
        <div className="container mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2 text-yellow-300">
            {gameConfig.title}
          </h1>
          <p className="text-lg mb-0">{gameConfig.description}</p>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {!isRegistered ? (
            <RegistrationForm onRegister={handleRegister} />
          ) : (
            <div className="text-center">
              <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <div className="flex items-center justify-center mb-4">
                  <Gift size={24} className="text-purple-600 mr-2" />
                  <h2 className="text-2xl font-bold text-purple-800">
                    Chào {player?.name}!
                  </h2>
                </div>
                <p className="text-gray-600 mb-4">
                  Quay vòng quay để nhận quà ngay! Bạn còn{' '}
                  <span className="font-bold text-purple-600">{remainingPlays}</span> lượt quay hôm nay.
                </p>
              </div>

              <div className="mb-8">
                <LuckyWheel 
                  prizes={gameConfig.prizes}
                  isSpinning={isSpinning}
                  targetAngle={targetAngle}
                  onSpinEnd={handleSpinEnd}
                  onSpin={handleSpin}  // truyền thêm prop này
                />
              </div>

              <button
                onClick={handleSpin}
                disabled={isSpinning || remainingPlays <= 0}
                className={`text-xl font-bold py-3 px-8 rounded-full shadow-lg transform transition-all duration-300 ${
                  isSpinning || remainingPlays <= 0
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-yellow-500 hover:bg-yellow-600 hover:scale-105'
                } text-white`}
              >
                {isSpinning ? "Đang quay..." : remainingPlays <= 0 ? "Hết lượt quay" : "QUAY NGAY"}
              </button>

              <SocialShare message="Tôi vừa tham gia vòng quay may mắn và nhận được phần quà hấp dẫn! Bạn cũng thử ngay nhé!" />
            </div>
          )}
        </div>
      </main>

      <Footer />

      <PrizeNotification 
        prize={selectedPrize}
        isOpen={showPrizeModal}
        onClose={handleCloseModal}
      />
    </div>
  );
}

export default App;
