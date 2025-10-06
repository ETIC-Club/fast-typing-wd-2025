'use client';
import React, { useState, useEffect, useRef } from 'react';
import { RotateCcw } from 'lucide-react';
import POKEMON_PHRASES from '@/lib/phrases';
import { calculateWPM, calculateAccuracy } from '@/lib/utils';
import ComicStats from './Stats';
import ComicLeaderboard from './Leaderboard';
import ComicTheme from './PokemonTheme';

export interface LeaderboardEntry {
  id?: number;
  name: string;
  wpm: number;
  accuracy: number;
  phrases: number;
  timestamp: number;
}

const TypingGame: React.FC = () => {
  const [currentPhrase, setCurrentPhrase] = useState('');
  const [userInput, setUserInput] = useState('');
  const [gameStarted, setGameStarted] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [correctChars, setCorrectChars] = useState(0);
  const [totalChars, setTotalChars] = useState(0);
  const [completedPhrases, setCompletedPhrases] = useState(0);
  const [errors, setErrors] = useState(0);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [playerName, setPlayerName] = useState('');
  const [showNameInput, setShowNameInput] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);

  // Fetch leaderboard from API
  const fetchLeaderboard = async () => {
    try {
      const response = await fetch('/api/leaderboard');
      const data = await response.json();
      if (data.success) {
        setLeaderboard(data.data);
      }
    } catch (err) {
      console.error('Error fetching leaderboard:', err);
    }
  };

  const initGame = () => {
    setCurrentPhrase(POKEMON_PHRASES[0]);
    setUserInput('');
    setGameStarted(false);
    setGameEnded(false);
    setTimeLeft(60);
    setCorrectChars(0);
    setTotalChars(0);
    setCompletedPhrases(0);
    setErrors(0);
    setShowNameInput(false);
    setShowLeaderboard(false);
    setPlayerName('');
    setError(null);
    fetchLeaderboard();
  };

  useEffect(() => {
    initGame();
  }, []);

  useEffect(() => {
    if (gameStarted && !gameEnded && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && gameStarted) {
      endGame();
    }
  }, [timeLeft, gameStarted, gameEnded]);

  useEffect(() => {
    if (showNameInput && nameInputRef.current) {
      nameInputRef.current.focus();
    }
  }, [showNameInput]);

  const startGame = () => {
    setGameStarted(true);
    inputRef.current?.focus();
  };

  const endGame = () => {
    setGameEnded(true);
    setShowNameInput(true);
  };

  const getWPM = () => calculateWPM(correctChars, 60 - timeLeft);
  const getAccuracy = () => calculateAccuracy(correctChars, totalChars);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (!gameStarted) startGame();

    setUserInput(value);
    setTotalChars(totalChars + 1);

    const currentChar = currentPhrase[value.length - 1];
    const typedChar = value[value.length - 1];

    if (currentChar === typedChar) {
      setCorrectChars(correctChars + 1);
    } else if (typedChar) {
      setErrors(errors + 1);
    }

    if (value === currentPhrase) {
      const newCompletedCount = completedPhrases + 1;
      setCompletedPhrases(newCompletedCount);
      
      if (newCompletedCount < POKEMON_PHRASES.length) {
        setCurrentPhrase(POKEMON_PHRASES[newCompletedCount]);
        setUserInput('');
      } else {
        setUserInput('');
        endGame();
      }
    }
  };

  const saveScore = async () => {
    if (!playerName.trim()) {
      setError('Please enter your name');
      return;
    }

    if (playerName.trim().length < 2) {
      setError('Name must be at least 2 characters');
      return;
    }

    if (playerName.trim().length > 20) {
      setError('Name must be 20 characters or less');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/leaderboard', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: playerName.trim(),
          wpm: getWPM(),
          accuracy: getAccuracy(),
          phrases: completedPhrases,
          timestamp: Date.now()
        }),
      });

      const data = await response.json();

      if (data.success) {
        await fetchLeaderboard();
        setShowLeaderboard(true);
        setShowNameInput(false);
      } else {
        setError(data.error || 'Failed to save score');
      }
    } catch (err) {
      console.error('Error saving score:', err);
      setError('Failed to save score. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderPhrase = () => {
    return currentPhrase.split('').map((char, index) => {
      let className = 'text-xl sm:text-3xl font-black px-1 ';

      if (index < userInput.length) {
        if (userInput[index] === char) {
          className += 'text-green-500 ';
        } else {
          className += 'text-red-500';
        }
      } else if (index === userInput.length) {
        className += 'text-black border-b-8 border-yellow-400 animate-pulse';
      } else {
        className += 'text-gray-600';
      }

      return (
        <span key={index} className={className}
          style={{ textShadow: index < userInput.length ? '2px 2px 0px rgba(0,0,0,0.3)' : 'none' }}>
          {char}
        </span>
      );
    });
  };

  if (showLeaderboard) {
    return <ComicLeaderboard entries={leaderboard} onPlayAgain={initGame} />;
  }

  if (showNameInput) {
    return (
      <ComicTheme>
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="bg-white/60 border-8 border-black p-6 max-w-3xl w-full relative
                         shadow-[16px_16px_0px_0px_rgba(0,0,0,1)]">
            <h2 className="text-3xl sm:text-5xl font-black text-center mb-4 uppercase tracking-tighter"
              style={{ textShadow: '3px 3px 0px rgba(0,0,0,0.2)' }}>
              {getWPM() > 60
                ? "Amazing Speed, Master Trainer!"
                : getWPM() > 40
                  ? "Great Job, Trainer!"
                  : getWPM() != 0 ? "Nice Effort, Trainer!" : "No Effort, Trainer!"}
            </h2>

            <p className="text-sm sm:text-2xl text-center mb-6 sm:mb-8 text-black">
              {getWPM() > 50 && getAccuracy() > 95
                ? "You're typing faster than a Rapidash!"
                : getWPM() > 30 && getAccuracy() > 85
                  ? "You're as precise as a Scyther!"
                  : "Keep practicing to evolve your typing skills!"}
            </p>

            <ComicStats
              timeLeft={timeLeft}
              wpm={getWPM()}
              accuracy={getAccuracy()}
              phrases={completedPhrases}
              errors={errors}
            />

            <div className="mt-6">
              <input
                ref={nameInputRef}
                type="text"
                value={playerName}
                onChange={(e) => {
                  setPlayerName(e.target.value);
                  setError(null);
                }}
                placeholder="Enter your name..."
                className="w-full p-4 border-4 border-black text-lg font-bold
                         focus:outline-none focus:border-blue-600 bg-white"
                onKeyPress={(e) => e.key === 'Enter' && saveScore()}
                maxLength={20}
              />
              {error && (
                <div className="mt-2 p-3 bg-red-100 border-4 border-red-500 text-red-700 font-bold text-sm">
                  {error}
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <button
                onClick={saveScore}
                disabled={!playerName.trim() || isLoading}
                className="flex-1 bg-gradient-to-r from-yellow-400 to-red-500 border-4 border-black
                         text-black py-4 font-black text-lg uppercase
                         transform hover:scale-105 transition-transform hover:rotate-1
                         shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Saving...' : 'Save Score!'}
              </button>
              <button
                onClick={initGame}
                className="flex-1 bg-gray-400 border-4 border-black text-black py-4 
                         font-black text-lg uppercase
                         transform hover:scale-105 transition-transform hover:-rotate-1
                         shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
              >
                Skip
              </button>
            </div>
          </div>
        </div>
      </ComicTheme>
    );
  }

  return (
    <ComicTheme>
      <div className="flex items-center justify-center px-4">
        <div className="w-full max-w-3xl">
          <ComicStats
            timeLeft={timeLeft}
            wpm={getWPM()}
            accuracy={getAccuracy()}
            phrases={completedPhrases}
            errors={errors}
          />
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4">
        <div className={`bg-white/60 border-8 border-black p-6 sm:p-12 relative
                        shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]`}>
          {!gameStarted ? (
            <div className="text-center relative">
              <div className="relative">
                <h2 className="text-3xl sm:text-5xl font-black text-black mb-4 tracking-tighter">
                  Ready to catch 'em all?
                </h2>
                <p className="text-lg sm:text-2xl font-bold text-black/80 mb-8">
                  type the pokemon phrases as fast as you can!
                </p>
                <button
                  onClick={startGame}
                  className="bg-gradient-to-r from-red-500 to-yellow-400 border-6 border-black
                           text-white px-12 py-6 text-2xl sm:text-3xl uppercase font-black
                           transform hover:scale-110 transition-transform hover:rotate-2
                           shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
                  style={{ textShadow: '3px 3px 0px rgba(0,0,0,0.5)' }}
                >
                  Start!
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div className="bg-yellow-100 border-4 border-black p-12 sm:p-8 mb-6 min-h-screen sm:min-h-[120px]
                            flex items-center justify-center relative
                            shadow-[inset_0px_4px_0px_0px_rgba(0,0,0,0.2)]">
                <div className="text-center leading-relaxed break-words relative z-10">
                  {renderPhrase()}
                </div>
              </div>

              <input
                ref={inputRef}
                type="text"
                value={userInput}
                onChange={handleInput}
                className="w-full p-5 sm:p-7 text-xl sm:text-2xl border-4 border-black 
                         focus:outline-none focus:border-blue-600 bg-white
                         shadow-[inset_0px_4px_0px_0px_rgba(0,0,0,0.1)]"
                placeholder="Start typing..."
                disabled={gameEnded}
              />

              <div className="mt-6 flex justify-center">
                <button
                  onClick={initGame}
                  className="bg-gray-600 border-4 border-black text-white px-8 py-3 
                           font-black hover:bg-gray-700 transition-colors uppercase
                           flex items-center gap-2 text-base
                           shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
                           transform hover:translate-x-0.5 hover:translate-y-0.5"
                >
                  <RotateCcw className="w-5 h-5" strokeWidth={3} />
                  Restart
                </button>
              </div>
            </div>
          )}
        </div>
        {leaderboard.length > 0 && !gameStarted && (
          <div className="max-w-4xl mx-auto px-4 mt-10">
            <div className={`bg-white/60 border-8 border-black p-6 sm:p-10 relative
                        shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]`}>
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-800 text-center mb-4">Top Trainers</h3>
              <div className="space-y-1">
                {leaderboard.slice(0, 10).map((entry, index) => (
                  <div key={index} className="flex justify-between items-center p-3 rounded-xl">
                    <span className="font-bold text-base sm:text-lg truncate mr-2">{index + 1}. {entry.name}</span>
                    <span className="text-blue-600 font-bold text-sm sm:text-base whitespace-nowrap">{entry.wpm} WPM</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </ComicTheme>
  );
};

export default TypingGame;