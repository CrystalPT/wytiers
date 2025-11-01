import { NextRequest, NextResponse } from 'next/server';
import { getAllPlayers, addPlayer } from '@/lib/firestore';

export async function GET(request: NextRequest) {
  try {
    const players = await getAllPlayers();
    return NextResponse.json({ players, success: true });
  } catch (error) {
    console.error('Error fetching players:', error);
    return NextResponse.json(
      { error: 'Failed to fetch players', success: false },
      { status: 500 }
    );
  }
}


export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, uuid, tier, region } = body;

    if (!username || !uuid || !tier || !region) {
      return NextResponse.json(
        { error: 'Missing required fields', success: false },
        { status: 400 }
      );
    }

    const playerId = await addPlayer({ username, uuid, tier, region });

    if (!playerId) {
      return NextResponse.json(
        { error: 'Failed to add player', success: false },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      id: playerId, 
      success: true,
      message: 'Player added successfully'
    });
  } catch (error) {
    console.error('Error adding player:', error);
    return NextResponse.json(
      { error: 'Failed to add player', success: false },
      { status: 500 }
    );
  }
}

