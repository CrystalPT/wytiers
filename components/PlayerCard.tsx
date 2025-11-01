'use client';

import { Player } from '@/lib/firestore';
import TierBadge from './TierBadge';
import RegionBadge from './RegionBadge';
import Image from 'next/image';

interface PlayerCardProps {
  player: Player;
  rank: number;
  onClick: () => void;
}

export default function PlayerCard({ player, rank, onClick }: PlayerCardProps) {
  const avatarUrl = `https://mc-heads.net/avatar/${player.uuid}/128`;

  const getRankBgColor = () => {
    if (rank === 1) return 'from-yellow-500 to-yellow-600';
    if (rank === 2) return 'from-gray-400 to-gray-500';
    if (rank === 3) return 'from-orange-600 to-orange-700';
    return 'from-bg-light to-bg-light';
  };

  return (
    <div
      onClick={onClick}
      className="flex items-center gap-0 bg-bg border border-border-muted rounded-lg hover:border-primary transition-all cursor-pointer group overflow-hidden"
    >
      {/* Rank Badge with Diagonal Edge */}
      <div className="relative flex items-center">
        <div 
          className={`bg-gradient-to-r ${getRankBgColor()} h-20 pl-6 pr-8 flex items-center justify-center`}
          style={{ clipPath: 'polygon(0 0, calc(100% - 20px) 0, 100% 50%, calc(100% - 20px) 100%, 0 100%)' }}
        >
          <span className="text-3xl font-bold text-white">{rank}.</span>
        </div>
      </div>

      {/* Avatar - Overlapping the diagonal edge */}
      <div className="relative -ml-4 w-16 h-16 rounded-lg overflow-hidden border-2 border-border group-hover:border-primary transition-colors z-10 bg-bg-dark">
        <Image
          src={avatarUrl}
          alt={player.username}
          fill
          className="object-cover"
          unoptimized
        />
      </div>

      {/* Player Info */}
      <div className="flex-1 min-w-0 px-4">
        <h3 className="text-lg font-semibold text-text truncate">{player.username}</h3>
      </div>

      {/* Region */}
      <div className="px-2">
        <RegionBadge region={player.region} />
      </div>

      {/* Tiers */}
      <div className="flex gap-2 pr-4">
        <TierBadge tier={player.tier} />
      </div>
    </div>
  );
}

