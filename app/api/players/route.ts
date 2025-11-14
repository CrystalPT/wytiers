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
    const { username, uuid, region, sword, vanilla, uhc, pot, nethop, smp, axe, mace } = body;

    if (!username || !uuid || !region) {
      return NextResponse.json(
        { error: 'Username, UUID, and Region are required', success: false },
        { status: 400 }
      );
    }

    const playerId = await addPlayer({ 
      username, 
      uuid, 
      region,
      sword: sword || '',
      vanilla: vanilla || '',
      uhc: uhc || '',
      pot: pot || '',
      nethop: nethop || '',
      smp: smp || '',
      axe: axe || '',
      mace: mace || '',
    });

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
