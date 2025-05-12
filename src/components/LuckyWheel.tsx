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

    // Reset về 0 không transition
    setTransition('');
    setRotation(0);

    const delayTimeout = setTimeout(() => {
      setTransition('transform 3s cubic-bezier(0.25, 0.8, 0.25, 1)');
      setRotation(targetAngle);
    }, 50);

    const wheel = wheelRef.current;

    const handleTransitionEnd = () => {
      if (!spinEndTriggered.current) {
        spinEndTriggered.current = true;
        onSpinEnd();
      }
    };

    if (wheel) {
      wheel.addEventListener('transitionend', handleTransitionEnd);
    }

    const fallback = setTimeout(() => {
      if (!spinEndTriggered.current) {
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

  const gradientSegments: string[] = [];
  const angleStep = 360 / prizes.length;

  // const randomColor = () => '#' + Math.floor(Math.random()*16777215).toString(16);
  prizes.forEach((p, i) => {
    // const color = randomColor();
    const start = i * angleStep;
    const end = (i + 1) * angleStep;
    // gradientSegments.push(`${color} ${start}deg`, `${color} ${end}deg`);
    gradientSegments.push(`${p.backgroundColor} ${start}deg`, `${p.backgroundColor} ${end}deg`);
  });
  gradientSegments.push(`${gradientSegments[0].split(' ')[0]} 360deg`);

  return (
    <div className="relative w-full max-w-md mx-auto">
      <div className="relative w-full pt-[100%]">
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Outer border */}
          <div className="absolute w-[102%] h-[102%] rounded-full border-[16px] border-blue-900 -z-1" />

          {/* Vòng quay */}
          <div
            ref={wheelRef}
            className="relative w-[95%] h-[95%] rounded-full shadow-lg"
            style={{
              background: `conic-gradient(${gradientSegments.join(', ')})`,
              transform: `rotate(${rotation}deg)`,
              transition
            }}
          />
          {/* Lớp hiển thị tên giải thưởng */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {prizes.map((prize, index) => {
              const segmentAngle = 360 / prizes.length;
              const rotate = index * segmentAngle + segmentAngle / 2;

              return (
                <div
                  key={prize.id}
                  className="absolute top-[50%] left-[50%] text-[10px] font-semibold text-white"
                  style={{
                    width: '42%',
                    transform: `rotate(${rotate}deg) translateY(-155%) rotate(-${rotate}deg)`,
                    transformOrigin: 'center',
                    textAlign: 'center',
                    lineHeight: '1.1rem',
                    display: 'block',
                    textShadow: '0 0 3px rgba(0,0,0,0.5)',
                    padding: '0 2px',
                    whiteSpace: 'normal',
                    wordBreak: 'break-word',
                    overflow: 'hidden'
                  }}
                >
                  <span style={{
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {prize.name}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Nút SPIN ở giữa */}
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

      {/* Kim chỉ (pointer) */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
        <div className="w-0 h-0 border-l-[20px] border-r-[20px] border-t-[40px] border-l-transparent border-r-transparent border-t-yellow-400"></div>
      </div>
    </div>
  );
};

export default LuckyWheel;
