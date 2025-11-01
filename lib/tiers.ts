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

// Get the rank number for a tier
export function getTierRank(tier: string): number {
  return TIER_RANK[tier as Tier] || 0;
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
      return { bg: '#56dcfd', text: '#000000' };
    case 'LT5':
      return { bg: '#81e0ff', text: '#000000' };
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
      return { bg: '#dc2626', text: '#ffffff' };
    case 'EU':
      return { bg: '#16a34a', text: '#ffffff' };
    case 'AS':
      return { bg: '#2563eb', text: '#ffffff' };
    default:
      return { bg: '#4b5563', text: '#ffffff' };
  }
}

