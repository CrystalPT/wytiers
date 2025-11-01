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

  const getRankStyle = () => {
    if (rank === 1) return {
      bg: 'bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600',
      text: 'text-yellow-900',
      shadow: 'shadow-lg shadow-yellow-500/50'
    };
    if (rank === 2) return {
      bg: 'bg-gradient-to-br from-gray-300 via-gray-400 to-gray-500',
      text: 'text-gray-900',
      shadow: 'shadow-lg shadow-gray-500/50'
    };
    if (rank === 3) return {
      bg: 'bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600',
      text: 'text-orange-900',
      shadow: 'shadow-lg shadow-orange-500/50'
    };
    return {
      bg: 'bg-gradient-to-br from-bg-light to-bg',
      text: 'text-text',
      shadow: 'shadow-md'
    };
  };

  const rankStyle = getRankStyle();

  return (
    <div
      onClick={onClick}
      className="relative flex items-center gap-4 p-3 bg-gradient-to-r from-bg to-bg-light border border-border-muted rounded-xl hover:border-primary hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 cursor-pointer group overflow-hidden"
    >
      {/* Background Accent on Hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {/* Rank Badge */}
      <div className={`relative ${rankStyle.bg} ${rankStyle.shadow} min-w-[56px] h-[56px] rounded-lg flex items-center justify-center z-10 transform group-hover:scale-105 transition-transform`}>
        <span className={`text-xl font-black ${rankStyle.text} drop-shadow-md`}>
          {rank}.
        </span>
      </div>

      {/* Avatar - 3D Bust */}
      <div className="relative w-16 h-16 flex items-center justify-center z-10 transform group-hover:scale-110 transition-transform">
        <Image
          src={avatarUrl}
          alt={player.username}
          width={80}
          height={80}
          className="object-contain drop-shadow-lg"
          unoptimized
          style={{
            imageRendering: 'pixelated',
            filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.4))'
          }}
        />
      </div>

      {/* Player Info */}
      <div className="flex-1 min-w-0 z-10">
        <h3 className="text-lg font-bold text-text truncate group-hover:text-primary transition-colors">
          {player.username}
        </h3>
      </div>

      {/* Region Badge */}
      <div className="z-10 min-w-[60px] flex justify-center">
        <RegionBadge region={player.region} />
      </div>

      {/* Tier Badge */}
      <div className="z-10 min-w-[60px] flex justify-center">
        <TierBadge tier={player.tier} />
      </div>
    </div>
  );
}
