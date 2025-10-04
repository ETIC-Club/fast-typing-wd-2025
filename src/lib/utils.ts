export interface GameStats {
  correctChars: number;
  totalChars: number;
  timeElapsed: number;
}

export interface LeaderboardEntry {
  name: string;
  wpm: number;
  accuracy: number;
  phrases: number;
  timestamp: number;
}

export const calculateWPM = (correctChars: number, timeElapsed: number): number => {
  const minutes = timeElapsed / 60;
  return minutes > 0 ? Math.round((correctChars / 5) / minutes) : 0;
};

export const calculateAccuracy = (correctChars: number, totalChars: number): number => {
  return totalChars > 0 ? Math.round((correctChars / totalChars) * 100) : 100;
};

export const sortLeaderboard = (leaderboard: LeaderboardEntry[]): LeaderboardEntry[] => {
  return [...leaderboard]
    .sort((a, b) => b.wpm - a.wpm)
    .slice(0, 10);
};

export const getMedalEmoji = (position: number): string => {
  switch (position) {
    case 0: return '🥇';
    case 1: return '🥈';
    case 2: return '🥉';
    default: return `#${position + 1}`;
  }
};