import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'leaderboard.db');
const db = new Database(dbPath);

// Initialize database with table and UNIQUE constraint on name
db.exec(`
  CREATE TABLE IF NOT EXISTS leaderboard (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    wpm INTEGER NOT NULL,
    accuracy INTEGER NOT NULL,
    phrases INTEGER NOT NULL,
    timestamp INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

export interface LeaderboardEntry {
  id?: number;
  name: string;
  wpm: number;
  accuracy: number;
  phrases: number;
  timestamp: number;
  created_at?: string;
}

// Get all leaderboard entries
export function getLeaderboard(): LeaderboardEntry[] {
  const stmt = db.prepare(`
    SELECT id, name, wpm, accuracy, phrases, timestamp, created_at
    FROM leaderboard
    ORDER BY wpm DESC
  `);
  return stmt.all() as LeaderboardEntry[];
}

// Check if name exists
export function nameExists(name: string): boolean {
  const stmt = db.prepare(`
    SELECT COUNT(*) as count FROM leaderboard WHERE name = ?
  `);
  const result = stmt.get(name) as { count: number };
  return result.count > 0;
}

// Add new entry (will throw error if name exists)
export function addLeaderboardEntry(entry: Omit<LeaderboardEntry, 'id' | 'created_at'>): LeaderboardEntry {
  const stmt = db.prepare(`
    INSERT INTO leaderboard (name, wpm, accuracy, phrases, timestamp)
    VALUES (?, ?, ?, ?, ?)
  `);
  
  const info = stmt.run(
    entry.name,
    entry.wpm,
    entry.accuracy,
    entry.phrases,
    entry.timestamp
  );
  
  return {
    id: info.lastInsertRowid as number,
    ...entry
  };
}

// Update existing entry if new score is better
export function updateLeaderboardEntry(entry: Omit<LeaderboardEntry, 'id' | 'created_at'>): LeaderboardEntry {
  const stmt = db.prepare(`
    UPDATE leaderboard 
    SET wpm = ?, accuracy = ?, phrases = ?, timestamp = ?
    WHERE name = ?
  `);
  
  stmt.run(
    entry.wpm,
    entry.accuracy,
    entry.phrases,
    entry.timestamp,
    entry.name
  );
  
  // Get the updated entry
  const getStmt = db.prepare(`
    SELECT id, name, wpm, accuracy, phrases, timestamp, created_at
    FROM leaderboard WHERE name = ?
  `);
  
  return getStmt.get(entry.name) as LeaderboardEntry;
}

export default db;