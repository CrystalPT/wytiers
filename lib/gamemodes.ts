import { Player } from './firestore';

export type GamemodeKey = 'sword' | 'vanilla' | 'uhc' | 'pot' | 'nethop' | 'smp' | 'axe' | 'mace' | 'overall';

export interface Gamemode {
  key: GamemodeKey;
  name: string;
  icon: string;
  displayName: string;
}

export const GAMEMODES: Gamemode[] = [
  { key: 'overall', name: 'Overall', icon: '/overall.svg', displayName: 'Overall Rankings' },
  { key: 'sword', name: 'Sword', icon: '/sword.svg', displayName: 'Sword PVP' },
  { key: 'vanilla', name: 'Vanilla', icon: '/vanilla.svg', displayName: 'Vanilla PVP' },
  { key: 'uhc', name: 'UHC', icon: '/uhc.svg', displayName: 'UHC' },
  { key: 'pot', name: 'Pot', icon: '/pot.svg', displayName: 'Pot PVP' },
  { key: 'nethop', name: 'NethOP', icon: '/nethop.svg', displayName: 'NethOP' },
  { key: 'smp', name: 'SMP', icon: '/smp.svg', displayName: 'SMP PVP' },
  { key: 'axe', name: 'Axe', icon: '/axe.svg', displayName: 'Axe PVP' },
  { key: 'mace', name: 'Mace', icon: '/mace.svg', displayName: 'Mace PVP' },
];

export function getGamemode(key: GamemodeKey): Gamemode | undefined {
  return GAMEMODES.find(gm => gm.key === key);
} 

export function getGamemodeDisplayName(key: GamemodeKey): string {
  const gamemode = getGamemode(key);
  return gamemode?.displayName || key;
}

export function getGamemodeIcon(key: GamemodeKey): string {
  const gamemode = getGamemode(key);
  return gamemode?.icon || '/sword.svg';
}

// Get player's tier for a specific gamemode
export function getPlayerTier(player: Player, gamemode: GamemodeKey): string {
  if (gamemode === 'overall') return '';
  return player[gamemode] || '';
}

// Check if player has a rank in a specific gamemode
export function hasRankInGamemode(player: Player, gamemode: GamemodeKey): boolean {
  if (gamemode === 'overall') {
    return player.overall > 0;
  }
  const tier = player[gamemode];
  return tier !== null && tier !== undefined && tier !== '';
}

// Get all gamemodes where player has a rank
export function getPlayerGamemodes(player: Player): GamemodeKey[] {
  const modes: GamemodeKey[] = [];
  const gamemodeKeys: GamemodeKey[] = ['sword', 'vanilla', 'uhc', 'pot', 'nethop', 'smp', 'axe', 'mace'];
  
  for (const key of gamemodeKeys) {
    if (hasRankInGamemode(player, key)) {
      modes.push(key);
    }
  }
  
  return modes;
}

// Filter players by gamemode (only show players with rank in that gamemode)
export function filterPlayersByGamemode(players: Player[], gamemode: GamemodeKey): Player[] {
  if (gamemode === 'overall') {
    return players.filter(p => p.overall > 0);
  }
  return players.filter(p => hasRankInGamemode(p, gamemode));
}

