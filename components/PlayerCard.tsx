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
  const avatarUrl = `https://render.crafty.gg/3d/bust/${player.uuid}`;

  const getRankBgColor = () => {
    if (rank === 1) return 'from-yellow-500 to-yellow-600';
    if (rank === 2) return 'from-gray-400 to-gray-500';
    if (rank === 3) return 'from-orange-600 to-orange-700';
    return 'from-bg-light to-bg-light';
  };

  return (
    <div
      onClick={onClick}
      className="flex items-center gap-0 bg-bg-light border border-border-muted rounded-xl hover:border-primary transition-all cursor-pointer group overflow-hidden shadow-lg hover:shadow-xl hover:shadow-primary/20"
    >
      {/* Rank Badge with Diagonal Edge */}
      <div className="relative flex items-center shrink-0">
        <div 
          className={`bg-gradient-to-br ${getRankBgColor()} h-20 pl-7 pr-10 flex items-center justify-center shadow-md`}
          style={{ clipPath: 'polygon(0 0, calc(100% - 18px) 0, 100% 50%, calc(100% - 18px) 100%, 0 100%)' }}
        >
          <span className="text-3xl font-bold text-white drop-shadow-lg">{rank}.</span>
        </div>
      </div>

      {/* Avatar - Overlapping the diagonal edge */}
      <div className="relative -ml-5 w-[72px] h-[72px] rounded-xl overflow-hidden border-[3px] border-bg group-hover:border-primary transition-all z-10 bg-bg-dark shadow-xl">
        <Image
          src={avatarUrl}
          alt={player.username}
          fill
          className="object-cover scale-110"
          unoptimized
        />
      </div>

      {/* Player Info */}
      <div className="flex-1 min-w-0 px-5 py-4">
        <h3 className="text-xl font-bold text-text truncate group-hover:text-primary transition-colors">{player.username}</h3>
      </div>

      {/* Region */}
      <div className="px-2">
        <RegionBadge region={player.region} />
      </div>

      {/* Tiers */}
      <div className="flex gap-2 pr-6">
        <TierBadge tier={player.tier} />
      </div>
    </div>
  );
}

