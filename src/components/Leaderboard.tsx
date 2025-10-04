import React from 'react';
import { Trophy, RotateCcw } from 'lucide-react';
import { LeaderboardEntry, getMedalEmoji } from '@/lib/utils';

interface LeaderboardProps {
  entries: LeaderboardEntry[];
  onPlayAgain: () => void;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ entries, onPlayAgain }) => {
  const getRowStyle = (index: number): string => {
    switch (index) {
      case 0: return 'bg-yellow-100/95 border-2 border-yellow-400';
      case 1: return 'bg-gray-100/95 border-2 border-gray-400';
      case 2: return 'bg-orange-100/95 border-2 border-orange-400';
      default: return 'bg-gray-50/90';
    }
  };

  return (
        <div className="min-h-screen p-8 relative">
      <video 
        className="fixed top-0 left-0 w-full h-full object-cover z-0"
        autoPlay
        muted
        loop
        playsInline
      >
        <source src="/pokemon-in-the-wild.mp4" type="video/mp4" />
      </video>
      
      <div className="fixed top-0 left-0 w-full h-full bg-black/40 z-0"></div>

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl p-4 sm:p-8 border-2 border-white/50">
          <div className="text-center mb-6 sm:mb-8">
            <Trophy className="w-12 h-12 sm:w-20 sm:h-20 mx-auto text-yellow-500 mb-2 sm:mb-4" />
            <h1 className="text-3xl sm:text-5xl font-bold text-gray-900 mb-2">Leaderboard</h1>
            <p className="text-sm sm:text-base text-gray-700 font-semibold">Top Pokemon Trainers</p>
          </div>

          <div className="space-y-2 sm:space-y-3">
            {entries.map((entry, index) => (
              <div
                key={index}
                className={`flex items-center gap-2 sm:gap-4 p-3 sm:p-4 rounded-xl backdrop-blur-sm ${getRowStyle(index)}`}
              >
                <div className="text-xl sm:text-2xl font-bold w-6 sm:w-8">
                  {getMedalEmoji(index)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-base sm:text-lg text-gray-900 truncate">{entry.name}</div>
                  <div className="text-xs sm:text-sm text-gray-700 font-medium">{entry.phrases} phrases</div>
                </div>
                <div className="text-right">
                  <div className="text-lg sm:text-2xl font-bold text-blue-600">{entry.wpm}</div>
                  <div className="text-xs sm:text-sm text-gray-700 font-medium hidden sm:block">{entry.accuracy}%</div>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={onPlayAgain}
            className="w-full mt-6 sm:mt-8 text-blue-600 rounded-xl font-bold text-base sm:text-lg hover:scale-105 transition-transform flex items-center justify-center gap-2 py-3"
          >
            <RotateCcw className="w-5 h-5 text-blue-600" />
            Play Again
          </button>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;