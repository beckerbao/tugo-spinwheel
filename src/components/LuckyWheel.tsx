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
  onSpin,
}) => {
  const [rotation, setRotation] = useState(0);
  const [transition, setTransition] = useState('');
  const wheelRef = useRef<SVGSVGElement>(null);
  const spinEndTriggered = useRef(false);

  useEffect(() => {
    if (!isSpinning) return;

    spinEndTriggered.current = false;
    setTransition('');
    setRotation(0);

    const delayTimeout = setTimeout(() => {
      setTransition('transform 3s cubic-bezier(0.25, 0.8, 0.25, 1)');
      setRotation(targetAngle);
    }, 50);

    const handleTransitionEnd = () => {
      if (!spinEndTriggered.current) {
        spinEndTriggered.current = true;
        onSpinEnd();
      }
    };

    const wheel = wheelRef.current;
    wheel?.addEventListener('transitionend', handleTransitionEnd);

    const fallback = setTimeout(() => {
      if (!spinEndTriggered.current) {
        spinEndTriggered.current = true;
        onSpinEnd();
      }
    }, 3500);

    return () => {
      clearTimeout(delayTimeout);
      clearTimeout(fallback);
      wheel?.removeEventListener('transitionend', handleTransitionEnd);
    };
  }, [isSpinning, targetAngle, onSpinEnd]);

  const radius = 100;
  const center = 100;
  const anglePerSegment = 360 / prizes.length;

  const describeArc = (startAngle: number, endAngle: number) => {
    const start = polarToCartesian(center, center, radius, endAngle);
    const end = polarToCartesian(center, center, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';

    return [
      `M ${center},${center}`,
      `L ${start.x},${start.y}`,
      `A ${radius},${radius} 0 ${largeArcFlag} 0 ${end.x},${end.y}`,
      'Z',
    ].join(' ');
  };

  const polarToCartesian = (cx: number, cy: number, r: number, angle: number) => {
    const rad = (angle - 90) * (Math.PI / 180);
    return {
      x: cx + r * Math.cos(rad),
      y: cy + r * Math.sin(rad),
    };
  };

  return (
    <div className="relative w-full max-w-md mx-auto">
      <div className="relative pt-[100%]">
        <div className="absolute inset-0 flex items-center justify-center">
          <svg
            ref={wheelRef}
            viewBox="0 0 200 200"
            className="w-[95%] h-[95%] rounded-full"
            style={{
              transform: `rotate(${-rotation}deg)`,
              transition,
            }}
          >
            {prizes.map((prize, i) => {
              const startAngle = i * anglePerSegment;
              const endAngle = (i + 1) * anglePerSegment;
              const path = describeArc(startAngle, endAngle);
              const labelAngle = startAngle + anglePerSegment / 2;
              const labelPos = polarToCartesian(center, center, radius * 0.65, labelAngle);

              return (
                <g key={prize.id}>
                  <path d={path} fill={prize.backgroundColor} />
                  <text
                    x={labelPos.x}
                    y={labelPos.y}
                    textAnchor="middle"
                    alignmentBaseline="middle"
                    fontSize="8"
                    fill="#fff"
                    transform={`rotate(${labelAngle}, ${labelPos.x}, ${labelPos.y})`}
                  >
                    {prize.name}
                  </text>
                </g>
              );
            })}
          </svg>

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
