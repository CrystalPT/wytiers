import { NextRequest, NextResponse } from 'next/server';
import { getPlayer, updatePlayer, deletePlayer } from '@/lib/firestore';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const player = await getPlayer(id);

    if (!player) {
      return NextResponse.json(
        { error: 'Player not found', success: false },
        { status: 404 }
      );
    }

    return NextResponse.json({ player, success: true });
  } catch (error) {
    console.error('Error fetching player:', error);
    return NextResponse.json(
      { error: 'Failed to fetch player', success: false },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const success = await updatePlayer(id, body);

    if (!success) {
      return NextResponse.json(
        { error: 'Failed to update player', success: false },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true,
      message: 'Player updated successfully'
    });
  } catch (error) {
    console.error('Error updating player:', error);
    return NextResponse.json(
      { error: 'Failed to update player', success: false },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const success = await deletePlayer(id);

    if (!success) {
      return NextResponse.json(
        { error: 'Failed to delete player', success: false },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true,
      message: 'Player deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting player:', error);
    return NextResponse.json(
      { error: 'Failed to delete player', success: false },
      { status: 500 }
    );
  }
}

