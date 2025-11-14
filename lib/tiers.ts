export type Tier = 'LT5' | 'HT5' | 'LT4' | 'HT4' | 'LT3' | 'HT3' | 'LT2' | 'HT2' | 'LT1' | 'HT1';

export const TIERS: Tier[] = ['LT5', 'HT5', 'LT4', 'HT4', 'LT3', 'HT3', 'LT2', 'HT2', 'LT1', 'HT1'];

// Tier ranking (lower number = worse rank, higher number = better rank)
const TIER_RANK: Record<Tier, number> = {
  'LT5': 1,
  'HT5': 2,
  'LT4': 3,
  'HT4': 4,
  'LT3': 5,
  'HT3': 6,
  'LT2': 7,
  'HT2': 8,
  'LT1': 9,
  'HT1': 10,
};

// Tier points system for overall ranking
const TIER_POINTS: Record<Tier, number> = {
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

// Get the rank number for a tier
export function getTierRank(tier: string): number {
  return TIER_RANK[tier as Tier] || 0;
}

// Get points for a tier
export function getTierPoints(tier: string): number {
  if (!tier) return 0;
  return TIER_POINTS[tier.toUpperCase() as Tier] || 0;
}

// Get achievement title based on overall points
export function getAchievementTitle(points: number): { title: string; icon: string } {
  if (points >= 400) {
    return { title: 'Combat Grandmaster', icon: '/combat_grandmaster.webp' };
  } else if (points >= 250) {
    return { title: 'Combat Master', icon: '/combat_master.webp' };
  } else if (points >= 100) {
    return { title: 'Combat Ace', icon: '/combat_ace.svg' };
  } else if (points >= 50) {
    return { title: 'Combat Specialist', icon: '/combat_specialist.svg' };
  } else if (points >= 20) {
    return { title: 'Combat Cadet', icon: '/combat_cadet.svg' };
  } else if (points >= 10) {
    return { title: 'Combat Novice', icon: '/combat_novice.svg' };
  } else {
    return { title: 'Rookie', icon: '/rookie.svg' };
  }
}

// Sort players by tier (best to worst)
export function sortPlayersByTier<T extends { tier: string }>(players: T[]): T[] {
  return [...players].sort((a, b) => {
    const rankA = getTierRank(a.tier);
    const rankB = getTierRank(b.tier);
    return rankB - rankA; // Higher rank first (best to worst)
  });
}

// Get tier display name
export function getTierDisplay(tier: string): string {
  return tier;
}

// Get tier color class based on tier level
export function getTierColor(tier: string): string {
  const rank = getTierRank(tier);
  
  // Best tiers (HT1, LT1) - purple/pink
  if (rank >= 9) return 'bg-[oklch(0.5_0.11_305)] text-white';
  // High tiers (HT2, LT2) - blue
  if (rank >= 7) return 'bg-[oklch(0.5_0.11_260)] text-white';
  // Mid-high tiers (HT3, LT3) - cyan
  if (rank >= 5) return 'bg-[oklch(0.5_0.11_200)] text-white';
  // Mid tiers (HT4, LT4) - green
  if (rank >= 3) return 'bg-[oklch(0.5_0.11_160)] text-white';
  // Low tiers (HT5, LT5) - yellow/orange
  return 'bg-[oklch(0.6_0.11_100)] text-black';
}

// Get tier badge style
export function getTierBadgeStyle(tier: string): { bg: string; text: string } {
  switch (tier.toUpperCase()) {
    case 'HT1':
      return { bg: '#ffbb00', text: '#000000' };
    case 'LT1':
      return { bg: '#ffea30', text: '#000000' };
    case 'HT2':
      return { bg: '#000000', text: '#ffffff' };
    case 'LT2':
      return { bg: '#6d6d6d', text: '#ffffff' };
    case 'HT3':
      return { bg: '#ff8b00', text: '#000000' };
    case 'LT3':
      return { bg: '#773b00', text: '#ffffff' };
    case 'HT4':
      return { bg: '#009dff', text: '#ffffff' };
    case 'LT4':
      return { bg: '#32d3ff', text: '#000000' };
    case 'HT5':
      return { bg: '#A0AFB0', text: '#000000' };
    case 'LT5':
      return { bg: '#737C7D', text: '#000000' };
    default:
      return { bg: '#4b5563', text: '#ffffff' };
  }
}

// Get region color
export function getRegionColor(region: string): string {
  switch (region.toUpperCase()) {
    case 'NA':
      return 'bg-red-600/80 text-white';
    case 'EU':
      return 'bg-green-600/80 text-white';
    case 'OCE':
      return 'bg-blue-600/80 text-white';
    default:
      return 'bg-gray-600/80 text-white';
  }
}

// Get region badge style
export function getRegionBadgeStyle(region: string): { bg: string; text: string } {
  switch (region.toUpperCase()) {
    case 'NA':
      return { bg: '#d95c6a', text: '#ffffff' };
    case 'EU':
      return { bg: '#89f19c', text: '#1c3e20' };
    case 'AS':
      return { bg: '#2563eb', text: '#ffffff' };
    default:
      return { bg: '#4b5563', text: '#ffffff' };
  }
}

// Sort players by overall points (best to worst)
export function sortPlayersByOverall<T extends { overall: number; username: string }>(players: T[]): T[] {
  return [...players].sort((a, b) => {
    // First sort by overall points (higher first)
    if (b.overall !== a.overall) {
      return b.overall - a.overall;
    }
    // If points are equal, sort alphabetically by username
    return a.username.localeCompare(b.username);
  });
}

// Sort players by gamemode tier (best to worst)
export function sortPlayersByGamemodeTier<T extends { username: string }>(
  players: T[],
  getTierFunc: (player: T) => string
): T[] {
  return [...players].sort((a, b) => {
    const tierA = getTierFunc(a);
    const tierB = getTierFunc(b);
    const rankA = getTierRank(tierA);
    const rankB = getTierRank(tierB);
    
    // First sort by tier rank (higher first)
    if (rankB !== rankA) {
      return rankB - rankA;
    }
    // If ranks are equal, sort alphabetically by username
    return a.username.localeCompare(b.username);
  });
}

