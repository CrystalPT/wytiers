import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where,
  orderBy,
  DocumentData 
} from 'firebase/firestore';
import { db } from './firebase';

export interface Player {
  id?: string;
  username: string;
  uuid: string;
  region: string;
  
  // Gamemode tiers (tier codes like "HT1", "LT4", or empty string for unranked)
  sword: string;
  vanilla: string;
  uhc: string;
  pot: string;
  nethop: string;
  smp: string;
  axe: string;
  mace: string;
  
  // Calculated field (sum of all gamemode points)
  overall: number;
}

const PLAYERS_COLLECTION = 'updated_players';

// Calculate overall points from all gamemode tiers
export function calculateOverallPoints(player: Omit<Player, 'id' | 'overall'>): number {
  const tierPoints: Record<string, number> = {
    'HT1': 60,
    'LT1': 45,
    'HT2': 30,
    'LT2': 20,
    'HT3': 10,
    'LT3': 6,
    'HT4': 4,
    'LT4': 3,
    'HT5': 2,
    'LT5': 1,
  };

  const gamemodes: Array<keyof Omit<Player, 'id' | 'username' | 'uuid' | 'region' | 'overall'>> = [
    'sword', 'vanilla', 'uhc', 'pot', 'nethop', 'smp', 'axe', 'mace'
  ];

  let totalPoints = 0;
  for (const mode of gamemodes) {
    const tier = player[mode];
    if (tier && tierPoints[tier]) {
      totalPoints += tierPoints[tier];
    }
  }

  return totalPoints;
}

// Get all players
export async function getAllPlayers(): Promise<Player[]> {
  try {
    const playersRef = collection(db, PLAYERS_COLLECTION);
    const querySnapshot = await getDocs(playersRef);
    
    const players: Player[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      players.push({
        id: doc.id,
        username: data.username || '',
        uuid: data.uuid || '',
        region: data.region || '',
        sword: data.sword || '',
        vanilla: data.vanilla || '',
        uhc: data.uhc || '',
        pot: data.pot || '',
        nethop: data.nethop || '',
        smp: data.smp || '',
        axe: data.axe || '',
        mace: data.mace || '',
        overall: data.overall || 0,
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
      const data = playerSnap.data();
      return {
        id: playerSnap.id,
        username: data.username || '',
        uuid: data.uuid || '',
        region: data.region || '',
        sword: data.sword || '',
        vanilla: data.vanilla || '',
        uhc: data.uhc || '',
        pot: data.pot || '',
        nethop: data.nethop || '',
        smp: data.smp || '',
        axe: data.axe || '',
        mace: data.mace || '',
        overall: data.overall || 0,
      } as Player;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting player:', error);
    return null;
  }
}

// Get a single player by username (case-insensitive)
export async function getPlayerByUsername(username: string): Promise<Player | null> {
  try {
    const playersRef = collection(db, PLAYERS_COLLECTION);
    const querySnapshot = await getDocs(playersRef);
    
    // Case-insensitive search
    const lowerUsername = username.toLowerCase();
    const playerDoc = querySnapshot.docs.find(
      doc => doc.data().username?.toLowerCase() === lowerUsername
    );
    
    if (playerDoc) {
      const data = playerDoc.data();
      return {
        id: playerDoc.id,
        username: data.username || '',
        uuid: data.uuid || '',
        region: data.region || '',
        sword: data.sword || '',
        vanilla: data.vanilla || '',
        uhc: data.uhc || '',
        pot: data.pot || '',
        nethop: data.nethop || '',
        smp: data.smp || '',
        axe: data.axe || '',
        mace: data.mace || '',
        overall: data.overall || 0,
      } as Player;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting player by username:', error);
    return null;
  }
}

// Get a single player by UUID
export async function getPlayerByUUID(uuid: string): Promise<Player | null> {
  try {
    const playersRef = collection(db, PLAYERS_COLLECTION);
    const q = query(playersRef, where('uuid', '==', uuid));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const playerDoc = querySnapshot.docs[0];
      const data = playerDoc.data();
      return {
        id: playerDoc.id,
        username: data.username || '',
        uuid: data.uuid || '',
        region: data.region || '',
        sword: data.sword || '',
        vanilla: data.vanilla || '',
        uhc: data.uhc || '',
        pot: data.pot || '',
        nethop: data.nethop || '',
        smp: data.smp || '',
        axe: data.axe || '',
        mace: data.mace || '',
        overall: data.overall || 0,
      } as Player;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting player by UUID:', error);
    return null;
  }
}

// Add a new player
export async function addPlayer(player: Omit<Player, 'id' | 'overall'>): Promise<string | null> {
  try {
    // Calculate overall points before adding
    const overall = calculateOverallPoints(player);
    
    const playersRef = collection(db, PLAYERS_COLLECTION);
    const docRef = await addDoc(playersRef, {
      ...player,
      overall,
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding player:', error);
    return null;
  }
}

// Update a player
export async function updatePlayer(id: string, playerData: Partial<Omit<Player, 'id' | 'overall'>>): Promise<boolean> {
  try {
    // If updating tiers, recalculate overall points
    const playerRef = doc(db, PLAYERS_COLLECTION, id);
    const playerSnap = await getDoc(playerRef);
    
    if (!playerSnap.exists()) {
      return false;
    }
    
    const currentData = playerSnap.data();
    const updatedData = { ...currentData, ...playerData };
    const overall = calculateOverallPoints(updatedData as Omit<Player, 'id' | 'overall'>);
    
    await updateDoc(playerRef, {
      ...playerData,
      overall,
    } as DocumentData);
    
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
