import React from 'react';
import { Trophy, RotateCcw } from 'lucide-react';
import { getMedalEmoji } from '@/lib/utils';
import ComicTheme from './PokemonTheme';

export interface LeaderboardEntry {
  id?: number;
  name: string;
  wpm: number;
  accuracy: number;
  phrases: number;
  timestamp: number;
}

interface LeaderboardProps {
  entries: LeaderboardEntry[];
  onPlayAgain: () => void;
}

const Leaderboard: React.FC<{
  entries: LeaderboardEntry[];
  onPlayAgain: () => void;
}> = ({ entries, onPlayAgain }) => {
  const getRowStyle = (index: number): string => {
    switch (index) {
      case 0: return 'bg-yellow-300 border-yellow-600';
      case 1: return 'bg-gray-300 border-gray-600';
      case 2: return 'bg-orange-300 border-orange-600';
      default: return 'bg-white border-gray-700';
    }
  };

  return (
    <ComicTheme>
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/60 border-8 border-black p-4 sm:p-8 relative
                       shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
          
          <div className="text-center mb-6 sm:mb-8 relative">
            <div className="inline-block bg-yellow-400 border-4 border-black px-6 py-3 
                           transform shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
              <Trophy className="w-10 h-10 sm:w-16 sm:h-16 mx-auto text-black mb-2" strokeWidth={3} />
              <h2 className="text-3xl sm:text-5xl font-black text-black  tracking-tighter"
                  style={{ textShadow: '3px 3px 0px rgba(255,255,255,0.5)' }}>
                Leaderboard!
              </h2>
            </div>
          </div>

          <div className="space-y-2 sm:space-y-3">
            {entries.map((entry, index) => (
              <div
                key={index}
                className={`flex items-center gap-2 sm:gap-4 p-3 sm:p-4 border-4 ${getRowStyle(index)}
                           transform hover:translate-x-1 hover:-translate-y-1 transition-transform
                           shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)]`}
              >
                <div className="text-xl sm:text-3xl font-black w-8 sm:w-12 text-black">
                  {getMedalEmoji(index)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-black text-base sm:text-xl text-black uppercase truncate tracking-tight">
                    {entry.name}
                  </div>
                  <div className="text-xs sm:text-sm text-black font-bold">
                    {entry.phrases} phrases
                  </div>
                </div>
                <div className="text-righ px-3 py-1 transform ">
                  <div className="text-xl sm:text-3xl font-black text-blue-600"
                       style={{ textShadow: '2px 2px 0px rgba(0,0,0,0.2)' }}>
                    {entry.wpm}
                  </div>
                  <div className="text-xs sm:text-sm text-black font-black hidden sm:block">
                    WPM
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={onPlayAgain}
            className="w-full mt-6 sm:mt-8 bg-gradient-to-r from-red-500 to-red-600 border-4 border-black 
                     py-4 font-black text-lg sm:text-2xl text-white
                     transform hover:scale-105 transition-transform hover:-rotate-1
                     shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center gap-3"
            style={{ textShadow: '2px 2px 0px rgba(0,0,0,0.5)' }}
          >
            <RotateCcw className="w-6 h-6" strokeWidth={3} />
            Play again!
          </button>
        </div>
      </div>
    </ComicTheme>
  );
};

export default Leaderboard;