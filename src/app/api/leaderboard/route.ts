import { NextResponse } from 'next/server';
import { getLeaderboard, addLeaderboardEntry, nameExists, updateLeaderboardEntry } from '@/lib/db';

// GET - Fetch all leaderboard entries
export async function GET() {
  try {
    const entries = getLeaderboard();
    return NextResponse.json({ success: true, data: entries });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch leaderboard' },
      { status: 500 }
    );
  }
}

// POST - Add new leaderboard entry or update existing
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, wpm, accuracy, phrases, timestamp } = body;

    // Validation
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'Name is required' },
        { status: 400 }
      );
    }

    if (name.trim().length < 2) {
      return NextResponse.json(
        { success: false, error: 'Name must be at least 2 characters' },
        { status: 400 }
      );
    }

    if (name.trim().length > 20) {
      return NextResponse.json(
        { success: false, error: 'Name must be 20 characters or less' },
        { status: 400 }
      );
    }

    if (typeof wpm !== 'number' || wpm < 0) {
      return NextResponse.json(
        { success: false, error: 'Valid WPM is required' },
        { status: 400 }
      );
    }

    if (typeof accuracy !== 'number' || accuracy < 0 || accuracy > 100) {
      return NextResponse.json(
        { success: false, error: 'Valid accuracy is required' },
        { status: 400 }
      );
    }

    if (typeof phrases !== 'number' || phrases < 0) {
      return NextResponse.json(
        { success: false, error: 'Valid phrases count is required' },
        { status: 400 }
      );
    }

    const entryData = {
      name: name.trim(),
      wpm,
      accuracy,
      phrases,
      timestamp: timestamp || Date.now()
    };

    // Check if name already exists
    if (nameExists(entryData.name)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'This name is already taken. Please choose a different name.',
          code: 'NAME_EXISTS'
        },
        { status: 409 }
      );
    }

    // Add new entry
    const entry = addLeaderboardEntry(entryData);

    return NextResponse.json({ success: true, data: entry }, { status: 201 });
  } catch (error: any) {
    console.error('Error adding leaderboard entry:', error);
    
    // Check if it's a unique constraint error
    if (error.message && error.message.includes('UNIQUE constraint failed')) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'This name is already taken. Please choose a different name.',
          code: 'NAME_EXISTS'
        },
        { status: 409 }
      );
    }
    
    console.log('Error adding leaderboard entry:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to add entry' },
      { status: 500 }
    );
  }
}