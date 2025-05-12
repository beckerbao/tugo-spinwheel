import React, { useState, useRef, useEffect } from 'react';
import { Prize } from '../types';

interface LuckyWheelProps {
  prizes: Prize[];
  isSpinning: boolean;
  targetAngle: number;
  onSpinEnd: () => void;
  onSpin: () => void;
}

const LuckyWheel: React.FC<LuckyWheelProps> = ({
  prizes,
  isSpinning,
  targetAngle,
  onSpinEnd,
  onSpin
}) => {
  const [rotation, setRotation] = useState(0);
  const [transition, setTransition] = useState('');
  const wheelRef = useRef<HTMLDivElement>(null);
  const spinEndTriggered = useRef(false);

  useEffect(() => {
    if (!isSpinning) return;

    spinEndTriggered.current = false;

    // Bước 1: reset về 0 không có transition
    setTransition('');
    setRotation(0);

    // Bước 2: apply quay sau 50ms
    const delayTimeout = setTimeout(() => {
      setTransition('transform 3s cubic-bezier(0.25, 0.8, 0.25, 1)');
      setRotation(targetAngle);
    }, 50);

    const wheel = wheelRef.current;

    const handleTransitionEnd = () => {
      if (!spinEndTriggered.current) {
        console.log("✅ Transition ended! Triggering onSpinEnd");
        spinEndTriggered.current = true;
        onSpinEnd();
      }
    };

    if (wheel) {
      wheel.addEventListener('transitionend', handleTransitionEnd);
    }

    const fallback = setTimeout(() => {
      if (!spinEndTriggered.current) {
        console.warn("⚠️ Fallback timeout triggered");
        spinEndTriggered.current = true;
        onSpinEnd();
      }
    }, 3500);

    return () => {
      clearTimeout(delayTimeout);
      clearTimeout(fallback);
      if (wheel) {
        wheel.removeEventListener('transitionend', handleTransitionEnd);
      }
    };
  }, [isSpinning, targetAngle, onSpinEnd]);

  const segmentAngle = 360 / prizes.length;

  return (
    <div className="relative w-full max-w-md mx-auto">
      <div className="relative w-full pt-[100%]">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="absolute w-[102%] h-[102%] rounded-full border-[16px] border-blue-900 -z-1" />

          <div
            ref={wheelRef}
            className="relative w-[95%] h-[95%] rounded-full overflow-hidden shadow-lg"
            style={{
              transform: `rotate(${rotation}deg)`,
              transition: transition
            }}
          >
            {prizes.map((prize, index) => {
              const startAngle = index * segmentAngle;
              return (
                <div
                  key={prize.id}
                  className="absolute top-0 left-0 w-full h-full origin-center"
                  style={{
                    transform: `rotate(${startAngle}deg)`,
                    clipPath: `polygon(50% 0%, 100% 0%, 100% 100%, 50% 100%)`,
                    backgroundColor: prize.backgroundColor
                  }}
                >
                  <div
                    className="absolute top-0 left-[50%] pt-6 w-[50%] h-full flex justify-center origin-left"
                    style={{
                      transform: `translateX(-50%) rotate(${segmentAngle / 2}deg)`
                    }}
                  >
                    <p
                      className="text-base font-bold whitespace-nowrap transform -rotate-90"
                      style={{ color: prize.textColor }}
                    >
                      {prize.name}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Center button */}
          <div
            className="absolute w-[25%] h-[25%] bg-blue-900 rounded-full shadow-lg flex items-center justify-center z-10 cursor-pointer"
            onClick={onSpin}
          >
            <div className="w-[90%] h-[90%] bg-blue-800 rounded-full flex items-center justify-center shadow-inner">
              <span className="text-white font-bold text-xl">SPIN</span>
            </div>
          </div>
        </div>
      </div>

      {/* Pointer */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
        <div className="w-0 h-0 border-l-[20px] border-r-[20px] border-t-[40px] border-l-transparent border-r-transparent border-t-yellow-400"></div>
      </div>
    </div>
  );
};

export default LuckyWheel;
