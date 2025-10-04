'use client';
import React, { useState, useEffect, useRef } from 'react';
import { Award, RotateCcw } from 'lucide-react';
import  POKEMON_PHRASES  from '@/lib/phrases';
import { calculateWPM, calculateAccuracy, LeaderboardEntry } from '@/lib/utils';
import Stats from './Stats';
import Leaderboard from './Leaderboard';
import PokemonTheme from './PokemonTheme';

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
  const inputRef = useRef<HTMLInputElement>(null);

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

    if (!gameStarted) {
      startGame();
    }

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
      setCompletedPhrases(completedPhrases + 1);
      const nextIndex = completedPhrases + 1;
      if (nextIndex < POKEMON_PHRASES.length) {
        setCurrentPhrase(POKEMON_PHRASES[nextIndex]);
      } else {
        // Handle the case when we've used all phrases
        endGame();
      }
      setUserInput('');
    }
  };

  const saveScore = () => {
    if (!playerName.trim()) return;

    const newScore: LeaderboardEntry = {
      name: playerName.trim(),
      wpm: getWPM(),
      accuracy: getAccuracy(),
      phrases: completedPhrases,
      timestamp: Date.now()
    };

    const updatedLeaderboard = [...leaderboard, newScore]
      .sort((a, b) => b.wpm - a.wpm)
      .slice(0, 10);

    setLeaderboard(updatedLeaderboard);
    setShowLeaderboard(true);
    setShowNameInput(false);
  };

  const renderPhrase = () => {
    return currentPhrase.split('').map((char, index) => {
      let className = 'text-2xl font-medium ';

      if (index < userInput.length) {
        className += userInput[index] === char ? 'text-green-500 bg-green-100' : 'text-red-500 bg-red-100';
      } else if (index === userInput.length) {
        className += 'text-gray-800 border-b-4 border-yellow-400';
      } else {
        className += 'text-gray-400';
      }

      return (
        <span key={index} className={className + ' px-0.5'}>
          {char}
        </span>
      );
    });
  };

  if (showLeaderboard) {
    return <Leaderboard entries={leaderboard} onPlayAgain={initGame} />;
  }

  if (showNameInput) {
    return (
      <PokemonTheme>
        <div className="min-h-screen flex items-center justify-center p-8 ">
          <div className="bg-white/60 rounded-3xl shadow-2xl p-12 max-w-3xl w-full">
            <h2 className="text-4xl font-bold text-center mb-8 text-gray-800">
              {getWPM() > 60
                ? "Amazing Speed, Master Trainer!"
                : getWPM() > 40
                  ? "Great Job, Trainer!"
                  : getWPM() != 0 ? "Nice Effort, Trainer!" : "No Effort, Trainer!"}
            </h2>
            <p className="text-xl text-center mb-6 text-gray-600">
              {getWPM() > 50 && getAccuracy() > 95
                ? "You're typing faster than a Rapidash!"
                : getWPM() > 30 && getAccuracy() > 85
                  ? "You're as precise as a Scyther!"
                  : "Keep practicing to evolve your typing skills!"}
            </p>

            <Stats
              timeLeft={timeLeft}
              wpm={getWPM()}
              accuracy={getAccuracy()}
              phrases={completedPhrases}
              errors={errors}
            />

            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Enter your name..."
              className="w-full p-4 mt-10 border-2 border-gray-300 rounded-xl mb-4 text-lg focus:border-blue-500 focus:outline-none"
              onKeyPress={(e) => e.key === 'Enter' && saveScore()}
              autoFocus
            />

            <div className="flex gap-4">
              <button
                onClick={saveScore}
                disabled={!playerName.trim()}
                className="flex-1 bg-gradient-to-r from-red-500 to-yellow-500 text-white py-4 rounded-xl font-bold text-lg hover:scale-105 transition-transform disabled:opacity-50"
              >
                Save Score
              </button>
              <button
                onClick={initGame}
                className="flex-1 bg-gray-500 text-white py-4 rounded-xl font-bold text-lg hover:scale-105 transition-transform"
              >
                Skip
              </button>
            </div>
          </div>
        </div>
      </PokemonTheme>
    );
  }

  return (
    <PokemonTheme>
      <div className=" flex items-center justify-center">
        <div className="px-10 py-4 max-w-3xl w-full">
          <Stats
            timeLeft={timeLeft}
            wpm={getWPM()}
            accuracy={getAccuracy()}
            phrases={completedPhrases}
            errors={errors}
          />
        </div>
      </div>

      <div className={`bg-white/60 ${gameStarted ? 'backdrop-blur-md' : ''} rounded-3xl shadow-2xl p-12 border-2 border-white/50`}>
        {!gameStarted ? (
          <div className="text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-4 font-tokyo">Ready to Catch 'Em All?</h2>
            <p className="text-xl text-gray-700 mb-8">Type the Pokemon phrases as fast as you can!</p>
            <button
              onClick={startGame}
              className="bg-gradient-to-r from-red-500 to-yellow-500 text-white px-12 py-6 rounded-2xl text-2xl font-bold hover:scale-110 transition-transform shadow-lg"
            >
              START TYPING
            </button>
          </div>
        ) : (
          <div>
            <div className="bg-gray-100 rounded-2xl p-8 mb-6 min-h-[120px] flex items-center justify-center">
              <div className="text-center leading-relaxed">
                {renderPhrase()}
              </div>
            </div>

            <input
              ref={inputRef}
              type="text"
              value={userInput}
              onChange={handleInput}
              className="w-full p-6 text-2xl border-4 border-blue-300 rounded-2xl focus:border-blue-500 focus:outline-none"
              placeholder="Start typing..."
              disabled={gameEnded}
            />

            <div className="mt-6 flex justify-center">
              <button
                onClick={initGame}
                className="bg-gray-500 text-white px-8 py-3 rounded-xl font-bold hover:bg-gray-600 transition-colors flex items-center gap-2"
              >
                <RotateCcw className="w-5 h-5" />
                Restart
              </button>
            </div>
          </div>
        )}
      </div>

      {leaderboard.length > 0 && !gameStarted && (
        <div className="mt-8 bg-white/60 rounded-3xl shadow-2xl p-8">
          <h3 className="text-3xl font-bold text-gray-800 mb-4 text-center">Top Trainers</h3>
          <div className="space-y-2">
            {leaderboard.slice(0, 5).map((entry, index) => (
              <div key={index} className="flex justify-between items-center p-3 rounded-xl">
                <span className="font-bold text-lg">{index + 1}. {entry.name}</span>
                <span className="text-blue-600 font-bold">{entry.wpm} WPM</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </PokemonTheme>
  );
};

export default TypingGame;