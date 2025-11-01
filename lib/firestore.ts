import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy,
  DocumentData 
} from 'firebase/firestore';
import { db } from './firebase';

export interface Player {
  id?: string;
  username: string;
  uuid: string;
  tier: string;
  region: string;
}

const PLAYERS_COLLECTION = 'players';

// Get all players
export async function getAllPlayers(): Promise<Player[]> {
  try {
    const playersRef = collection(db, PLAYERS_COLLECTION);
    const querySnapshot = await getDocs(playersRef);
    
    const players: Player[] = [];
    querySnapshot.forEach((doc) => {
      players.push({
        id: doc.id,
        ...doc.data()
      } as Player);
    });
    
    return players;
  } catch (error) {
    console.error('Error getting players:', error);
    return [];
  }
}

// Get a single player by ID
export async function getPlayer(id: string): Promise<Player | null> {
  try {
    const playerRef = doc(db, PLAYERS_COLLECTION, id);
    const playerSnap = await getDoc(playerRef);
    
    if (playerSnap.exists()) {
      return {
        id: playerSnap.id,
        ...playerSnap.data()
      } as Player;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting player:', error);
    return null;
  }
}

// Add a new player
export async function addPlayer(player: Omit<Player, 'id'>): Promise<string | null> {
  try {
    const playersRef = collection(db, PLAYERS_COLLECTION);
    const docRef = await addDoc(playersRef, player);
    return docRef.id;
  } catch (error) {
    console.error('Error adding player:', error);
    return null;
  }
}

// Update a player
export async function updatePlayer(id: string, player: Partial<Player>): Promise<boolean> {
  try {
    const playerRef = doc(db, PLAYERS_COLLECTION, id);
    await updateDoc(playerRef, player as DocumentData);
    return true;
  } catch (error) {
    console.error('Error updating player:', error);
    return false;
  }
}

// Delete a player
export async function deletePlayer(id: string): Promise<boolean> {
  try {
    const playerRef = doc(db, PLAYERS_COLLECTION, id);
    await deleteDoc(playerRef);
    return true;
  } catch (error) {
    console.error('Error deleting player:', error);
    return false;
  }
}

