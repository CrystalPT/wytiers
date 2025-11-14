import { NextRequest } from 'next/server';
import { getPlayerByUsername, getPlayerByUUID } from '@/lib/firestore';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params;
    
    // Decode the identifier in case it has special characters
    const decodedIdentifier = decodeURIComponent(username);
    
    // Try to find player by username first (case-insensitive)
    let player = await getPlayerByUsername(decodedIdentifier);
    
    // If not found by username, try by UUID
    if (!player) {
      player = await getPlayerByUUID(decodedIdentifier);
    }

    if (!player) {
      return new Response(
        JSON.stringify(
          { error: 'Player not found', success: false },
          null,
          2
        ),
        {
          status: 404,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    return new Response(
      JSON.stringify(
        { 
          player, 
          success: true 
        },
        null,
        2
      ),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Error fetching player:', error);
    return new Response(
      JSON.stringify(
        { error: 'Failed to fetch player', success: false },
        null,
        2
      ),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
}

