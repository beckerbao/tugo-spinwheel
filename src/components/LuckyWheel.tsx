import React, { useState, useRef, useEffect } from 'react';
import { Prize } from '../types';

interface LuckyWheelProps {
  prizes: Prize[];
  isSpinning: boolean;
  targetAngle: number;
  onSpinEnd: () => void;
}

const LuckyWheel: React.FC<LuckyWheelProps> = ({ 
  prizes, 
  isSpinning, 
  targetAngle,
  onSpinEnd
}) => {
  const [rotation, setRotation] = useState(0);
  const [previousTargetAngle, setPreviousTargetAngle] = useState(0);
  const [transition, setTransition] = useState('');
  const wheelRef = useRef<HTMLDivElement>(null);
  const spinEndTriggered = useRef(false);
  
  useEffect(() => {
    if (isSpinning && targetAngle !== previousTargetAngle) {
      spinEndTriggered.current = false;
      setTransition('transform 5s cubic-bezier(0.17, 0.67, 0.21, 0.99)');
      setRotation(prevRotation => prevRotation + targetAngle);
      setPreviousTargetAngle(targetAngle);
      
      const wheel = wheelRef.current;
      if (wheel) {
        const handleTransitionEnd = () => {
          if (!spinEndTriggered.current) {
            spinEndTriggered.current = true;
            onSpinEnd();
          }
        };
        
        wheel.addEventListener('transitionend', handleTransitionEnd);
        return () => wheel.removeEventListener('transitionend', handleTransitionEnd);
      }
    }
  }, [isSpinning, targetAngle, previousTargetAngle, onSpinEnd]);
  
  const segmentAngle = 360 / prizes.length;
  const lights = Array.from({ length: 16 }, (_, i) => i);
  
  return (
    <div className="relative w-full max-w-md mx-auto">
      <div className="relative w-full pt-[100%]">
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Outer ring with lights */}
          <div className="absolute w-[102%] h-[102%] rounded-full border-[16px] border-blue-900 -z-1">
            {lights.map((_, index) => (
              <div
                key={index}
                className="absolute w-3 h-3 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.8)] animate-pulse"
                style={{
                  left: '50%',
                  top: '50%',
                  transform: `rotate(${index * (360 / lights.length)}deg) translateY(-160%)`,
                  transformOrigin: '50% 50%'
                }}
              />
            ))}
          </div>

          {/* Wheel */}
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
                    backgroundColor: prize.backgroundColor,
                    zIndex: index
                  }}
                >
                  <div 
                    className="absolute top-0 left-[50%] pt-6 w-[50%] h-full flex justify-center origin-left"
                    style={{
                      transform: `translateX(-50%) rotate(${segmentAngle / 2}deg)`,
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
          <div className="absolute w-[25%] h-[25%] bg-blue-900 rounded-full shadow-lg flex items-center justify-center z-10">
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