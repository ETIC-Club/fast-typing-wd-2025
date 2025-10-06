import React from 'react';
import { Clock, Zap, Target, Trophy, AlertCircle } from 'lucide-react';

interface StatsProps {
  timeLeft: number;
  wpm: number;
  accuracy: number;
  phrases: number;
  errors: number;
}

const Stats: React.FC<StatsProps> = ({
  timeLeft,
  wpm,
  accuracy,
  phrases,
  errors
}) => {
  const stats = [
    { icon: Clock, value: timeLeft, label: 'TIME', color: 'bg-red-400/60', borderColor: 'border-red-600' },
    { icon: Zap, value: wpm, label: 'WPM', color: 'bg-blue-400/60', borderColor: 'border-blue-600' },
    { icon: Target, value: `${accuracy}%`, label: 'ACCURACY', color: 'bg-green-400/60', borderColor: 'border-green-600' },
    { icon: Trophy, value: phrases, label: 'PHRASES', color: 'bg-yellow-400/60', borderColor: 'border-yellow-600' },
    { icon: AlertCircle, value: errors, label: 'ERRORS', color: 'bg-rose-400/60', borderColor: 'border-rose-600' }
  ];

  return (
    <div className="flex flex-wrap gap-2 sm:gap-3 justify-center mb-4">
      {stats.map((stat, idx) => (
        <div
          key={idx}
          className={`relative ${stat.color} border-4 ${stat.borderColor} w-20 h-20 sm:w-32 sm:h-32 
                     transform hover:scale-105 transition-transform hover:rotate-1
                     shadow-[6px_6px_0px_0px_rgba(0,0,0,0.9)]`}
          style={{
            clipPath: 'polygon(8% 0%, 100% 0%, 100% 85%, 92% 100%, 0% 100%, 0% 15%)'
          }}
        >
          {/* Speed lines effect */}
          <div className="absolute inset-0 opacity-20"
              ></div>
          
          <div className="relative flex flex-col items-center justify-center h-full p-2">
            <stat.icon className="w-5 h-5 sm:w-7 sm:h-7 text-black mb-1" strokeWidth={3} />
            <div className="text-xl sm:text-4xl font-black text-black leading-none"
                 style={{ textShadow: '2px 2px 0px rgba(255,255,255,0.5)' }}>
              {stat.value}
            </div>
            <div className="text-[8px] sm:text-xs font-black text-black uppercase tracking-wider mt-0.5"
                 style={{ textShadow: '1px 1px 0px rgba(255,255,255,0.5)' }}>
              {stat.label}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Stats;