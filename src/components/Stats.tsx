import React from 'react';
import { Clock, Zap, Target, Trophy, AlertCircle } from 'lucide-react';

interface StatsProps {
  timeLeft: number;
  wpm: number;
  accuracy: number;
  phrases: number;
  errors: number;
}

const Stats: React.FC<StatsProps> = ({ timeLeft, wpm, accuracy, phrases, errors }) => {
  return (
    <div className="flex gap-3 justify-center mb-2">
      <div className="group relative bg-white/60 rounded-2xl p-5 w-32 h-32 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col items-center justify-center">
        <Clock className="w-5 h-5 text-red-600 mb-2 group-hover:scale-110 transition-transform" />
        <div className="text-4xl font-bold text-red-700 mb-1">{timeLeft}</div>
        <div className="text-xs text-red-600 font-medium uppercase tracking-wide">Time</div>
      </div>

      <div className="group relative bg-white/60 rounded-2xl p-5 w-32 h-32 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col items-center justify-center">
        <Zap className="w-5 h-5 text-blue-600 mb-2 group-hover:scale-110 transition-transform" />
        <div className="text-4xl font-bold text-blue-700 mb-1">{wpm}</div>
        <div className="text-xs text-blue-600 font-medium uppercase tracking-wide">WPM</div>
      </div>

      <div className="group relative bg-white/60 rounded-2xl p-5 w-32 h-32 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col items-center justify-center">
        <Target className="w-5 h-5 text-green-600 mb-2 group-hover:scale-110 transition-transform" />
        <div className="text-4xl font-bold text-green-700 mb-1">{accuracy}%</div>
        <div className="text-xs text-green-600 font-medium uppercase tracking-wide">Accuracy</div>
      </div>

      <div className="group relative bg-white/60 rounded-2xl p-5 w-32 h-32 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col items-center justify-center">
        <Trophy className="w-5 h-5 text-yellow-600 mb-2 group-hover:scale-110 transition-transform" />
        <div className="text-4xl font-bold text-yellow-700 mb-1">{phrases}</div>
        <div className="text-xs text-yellow-600 font-medium uppercase tracking-wide">Phrases</div>
      </div>

      <div className="group relative bg-white/60 rounded-2xl p-5 w-32 h-32 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col items-center justify-center">
        <AlertCircle className="w-5 h-5 text-rose-600 mb-2 group-hover:scale-110 transition-transform" />
        <div className="text-4xl font-bold text-rose-700 mb-1">{errors}</div>
        <div className="text-xs text-rose-600 font-medium uppercase tracking-wide">Errors</div>
      </div>
    </div>
  );
};

export default Stats;