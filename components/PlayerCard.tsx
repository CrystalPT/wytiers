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
    if (rank === 1) return 'bg-gradient-to-r from-yellow-500 to-yellow-600';
    if (rank === 2) return 'bg-gradient-to-r from-gray-400 to-gray-500';
    if (rank === 3) return 'bg-gradient-to-r from-orange-600 to-orange-700';
    return 'bg-bg';
  };

  return (
    <div
      onClick={onClick}
      className="flex items-center gap-4 p-4 bg-bg border border-border-muted rounded-2xl hover:border-primary transition-all cursor-pointer group"
    >
      {/* Rank */}
      <div className={`${getRankBgColor()} min-w-[60px] h-[60px] rounded-2xl flex items-center justify-center`}>
        <span className="text-2xl font-bold text-white">{rank}.</span>
      </div>

      {/* Avatar */}
      <div className="relative w-14 h-14 rounded-2xl overflow-hidden border-2 border-border group-hover:border-primary transition-colors">
        <Image
          src={avatarUrl}
          alt={player.username}
          fill
          className="object-cover"
          unoptimized
        />
      </div>

      {/* Player Info */}
      <div className="flex-1 min-w-0">
        <h3 className="text-lg font-semibold text-text truncate">{player.username}</h3>
      </div>

      {/* Region */}
      <div>
        <RegionBadge region={player.region} />
      </div>

      {/* Tiers */}
      <div className="flex gap-2">
        <TierBadge tier={player.tier} />
      </div>
    </div>
  );
}

