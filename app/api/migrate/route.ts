import { NextRequest, NextResponse } from 'next/server';
import { collection, getDocs, addDoc, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { calculateOverallPoints } from '@/lib/firestore';

// Old player structure
interface OldPlayer {
  id?: string;
  username: string;
  uuid: string;
  tier: string;
  region: string;
}

export async function POST(request: NextRequest) {
  try {
    // Fetch all players from old collection
    const oldPlayersRef = collection(db, 'players');
    const oldQuerySnapshot = await getDocs(oldPlayersRef);
    
    const oldPlayers: OldPlayer[] = [];
    oldQuerySnapshot.forEach((doc) => {
      oldPlayers.push({
        id: doc.id,
        ...doc.data()
      } as OldPlayer);
    });

    if (oldPlayers.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'No players found in old collection',
      });
    }

    // Fetch all existing players from new collection to check for duplicates
    const newPlayersRef = collection(db, 'updated_players');
    const newQuerySnapshot = await getDocs(newPlayersRef);
    
    const existingUUIDs = new Set<string>();
    const existingUsernames = new Set<string>();
    
    newQuerySnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.uuid) existingUUIDs.add(data.uuid.toLowerCase());
      if (data.username) existingUsernames.add(data.username.toLowerCase());
    });

    // Migrate each player
    const migratedPlayers = [];
    const skippedPlayers = [];
    const errors = [];

    for (const oldPlayer of oldPlayers) {
      try {
        // Check if player already exists by UUID or username
        const uuidExists = existingUUIDs.has(oldPlayer.uuid.toLowerCase());
        const usernameExists = existingUsernames.has(oldPlayer.username.toLowerCase());
        
        if (uuidExists || usernameExists) {
          skippedPlayers.push({
            username: oldPlayer.username,
            reason: 'Already exists in updated_players collection',
          });
          continue;
        }

        // Convert old player to new structure
        const newPlayer = {
          username: oldPlayer.username,
          uuid: oldPlayer.uuid,
          region: oldPlayer.region,
          // Map old tier to sword gamemode
          sword: oldPlayer.tier || '',
          // All other gamemodes start unranked
          vanilla: '',
          uhc: '',
          pot: '',
          nethop: '',
          smp: '',
          axe: '',
          mace: '',
        };

        // Calculate overall points
        const overall = calculateOverallPoints(newPlayer);

        // Add to new collection
        const docRef = await addDoc(newPlayersRef, {
          ...newPlayer,
          overall,
        });

        // Add to existing sets to prevent duplicates within this migration run
        existingUUIDs.add(oldPlayer.uuid.toLowerCase());
        existingUsernames.add(oldPlayer.username.toLowerCase());

        migratedPlayers.push({
          oldId: oldPlayer.id,
          newId: docRef.id,
          username: oldPlayer.username,
        });
      } catch (error) {
        errors.push({
          username: oldPlayer.username,
          error: String(error),
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: `Migration complete: ${migratedPlayers.length} added, ${skippedPlayers.length} skipped, ${errors.length} failed`,
      details: {
        total: oldPlayers.length,
        added: migratedPlayers.length,
        skipped: skippedPlayers.length,
        failed: errors.length,
        addedPlayers: migratedPlayers,
        skippedPlayers: skippedPlayers.length > 0 ? skippedPlayers : undefined,
        errors: errors.length > 0 ? errors : undefined,
      },
    });
  } catch (error) {
    console.error('Migration error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Migration failed',
        error: String(error),
      },
      { status: 500 }
    );
  }
}
