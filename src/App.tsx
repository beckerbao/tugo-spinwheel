import React, { useState, useEffect } from 'react';
import { Player, Prize, GameConfig, SpinResponse } from './types';
import { fetchGameConfig } from './config/gameConfig';
import { savePlayHistory } from './utils/gameUtils';
import RegistrationForm from './components/RegistrationForm';
import LuckyWheel from './components/LuckyWheel';
import PrizeNotification from './components/PrizeNotification';
import Footer from './components/Footer';
import { Gift } from 'lucide-react';

function App() {
  const [gameConfig, setGameConfig] = useState<GameConfig | null>(null);
  const [player, setPlayer] = useState<Player | null>(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [hasSpinEnded, setHasSpinEnded] = useState(false);
  const [targetAngle, setTargetAngle] = useState(0);
  const [remainingPlays, setRemainingPlays] = useState(0);
  const [selectedPrize, setSelectedPrize] = useState<Prize | null>(null);
  const [showPrizeModal, setShowPrizeModal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [spinResponse, setSpinResponse] = useState<SpinResponse | null>(null);
  const [isStartingNewSession, setIsStartingNewSession] = useState(false);

  useEffect(() => {
    const initializeGame = async () => {
      try {
        const config = await fetchGameConfig();
        setGameConfig(config);
      } catch (err) {
        setError('Không thể tải cấu hình trò chơi. Vui lòng thử lại sau.');
      }
    };

    initializeGame();
  }, []);

  const startNewSession = async () => {
    if (!player) return null;
    
    try {
      setIsStartingNewSession(true);
      const apiDomain = import.meta.env.VITE_API_DOMAIN;
      const response = await fetch(`${apiDomain}/api/v1/game/start`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: player.name,
          phone: player.phone,
        }),
      });

      if (!response.ok) {
        throw new Error('Không thể bắt đầu phiên mới');
      }

      const result = await response.json();
      
      if (result.status === 'success') {
        setRemainingPlays(result.data.remainingPlays);
        setPlayer({
          ...player,
          sessionId: result.data.session_id
        });
        return result.data.session_id;
      } else {
        throw new Error(result.message || 'Không thể bắt đầu phiên mới');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Đã có lỗi xảy ra');
      return null;
    } finally {
      setIsStartingNewSession(false);
    }
  };

  const handleSpin = async () => {
    if (!gameConfig || isSpinning || remainingPlays <= 0 || isStartingNewSession) return;

    try {
      setIsSpinning(true);
      
      // Get new session for subsequent spins
      let currentSessionId = player?.sessionId;
      if (!currentSessionId) {
        currentSessionId = await startNewSession();
        if (!currentSessionId) {
          throw new Error('Không thể bắt đầu phiên mới');
        }
      }

      const apiDomain = import.meta.env.VITE_API_DOMAIN;
      const response = await fetch(`${apiDomain}/api/v1/game/spin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          session_id: currentSessionId,
        }),
      });

      if (!response.ok) {
        throw new Error('Không thể quay vòng quay');
      }

      const result = await response.json();
      
      if (result.status === 'success') {
        setSpinResponse(result.data);
        setTargetAngle(result.data.angle);
        setSelectedPrize({
          id: parseInt(result.data.prize.id),
          name: result.data.prize.name,
          backgroundColor: result.data.prize.backgroundColor,
          weight: 0,
          quantityLeft: 0,
        });
        setHasSpinEnded(false);
        setShowPrizeModal(false);
      } else {
        throw new Error(result.message || 'Không thể quay vòng quay');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Đã có lỗi xảy ra');
      setIsSpinning(false);
    }
  };

  const handleSpinEnd = async () => {
    if (!spinResponse || !player?.sessionId) return;

    try {
      const apiDomain = import.meta.env.VITE_API_DOMAIN;
      const response = await fetch(`${apiDomain}/api/v1/game/confirm`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          session_id: player.sessionId,
          prize_id: parseInt(spinResponse.prize.id),
          prize_name: spinResponse.prize.name,
          prize_index: spinResponse.index,
          angle: spinResponse.angle,
        }),
      });

      if (!response.ok) {
        throw new Error('Không thể xác nhận kết quả');
      }

      const result = await response.json();
      
      if (result.status === 'success') {
        setIsSpinning(false);
        setHasSpinEnded(true);
        setShowPrizeModal(true);
        
        if (player) {
          savePlayHistory(player, {
            prizeId: parseInt(spinResponse.prize.id),
            timestamp: Date.now(),
          });
        }

        // Start new session to get updated remaining plays
        await startNewSession();
      } else {
        throw new Error(result.message || 'Không thể xác nhận kết quả');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Đã có lỗi xảy ra');
      setIsSpinning(false);
    }
  };

  const handleCloseModal = () => {
    setShowPrizeModal(false);
  };

  const handleRegister = (playerData: Player) => {
    setPlayer(playerData);
    setIsRegistered(true);
    setRemainingPlays(playerData.remainingPlays || 0);
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-purple-50 to-purple-100">
        <div className="text-center p-8">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Lỗi</h2>
          <p className="text-gray-700">{error}</p>
        </div>
      </div>
    );
  }

  if (!gameConfig) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-purple-50 to-purple-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-purple-50 to-purple-100">
      <header className="bg-purple-700 text-white py-6 px-4 shadow-md">
        <div className="container mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2 text-yellow-300">
            Vòng Quay May Mắn
          </h1>
          <p className="text-lg mb-0">Quay để trúng quà hấp dẫn!</p>
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
                  onSpin={handleSpin}
                />
              </div>

              <button
                onClick={handleSpin}
                disabled={isSpinning || remainingPlays <= 0 || isStartingNewSession}
                className={`text-xl font-bold py-3 px-8 rounded-full shadow-lg transform transition-all duration-300 ${
                  isSpinning || remainingPlays <= 0 || isStartingNewSession
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-yellow-500 hover:bg-yellow-600 hover:scale-105'
                } text-white`}
              >
                {isSpinning ? "Đang quay..." : 
                 isStartingNewSession ? "Đang chuẩn bị..." :
                 remainingPlays <= 0 ? "Hết lượt quay" : "QUAY NGAY"}
              </button>
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