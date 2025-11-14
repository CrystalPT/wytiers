'use client';

import { Player } from '@/lib/firestore';
import { GamemodeKey, getPlayerTier, GAMEMODES } from '@/lib/gamemodes';
import { getAchievementTitle, getTierRank } from '@/lib/tiers';
import TierBadge from './TierBadge';
import RegionBadge from './RegionBadge';
import Image from 'next/image';

interface PlayerCardProps {
  player: Player;
  rank: number;
  gamemode: GamemodeKey;
  onClick: () => void;
}

export default function PlayerCard({ player, rank, gamemode, onClick }: PlayerCardProps) {
  const avatarUrl = `https://render.crafty.gg/3d/bust/${player.uuid}`;
  const achievement = getAchievementTitle(player.overall);

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

  // Overall view - show title, points, and all gamemode badges sorted by tier
  if (gamemode === 'overall') {
    // Get all gamemodes with their tiers and sort by tier rank (best to worst)
    const sortedGamemodes = GAMEMODES
      .filter(gm => gm.key !== 'overall')
      .map(gm => ({
        gamemode: gm,
        tier: getPlayerTier(player, gm.key),
        rank: getTierRank(getPlayerTier(player, gm.key))
      }))
      .sort((a, b) => {
        // Sort by rank descending (best first), unranked go to the end
        if (a.rank === 0 && b.rank === 0) return 0;
        if (a.rank === 0) return 1;
        if (b.rank === 0) return -1;
        return b.rank - a.rank;
      });

    return (
      <div
        onClick={onClick}
        className="relative flex flex-col lg:flex-row lg:items-center gap-3 p-2 sm:p-3 bg-linear-to-r from-bg to-bg-light border border-border-muted rounded-xl hover:border-primary hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 cursor-pointer group overflow-hidden"
      >
        {/* Background Accent on Hover */}
        <div className="absolute inset-0 bg-linear-to-r from-transparent via-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Top Row: Rank, Avatar, Info, Region */}
        <div className="flex items-center gap-2 sm:gap-4 z-10 w-full lg:w-auto lg:flex-1">
          {/* Rank Badge */}
          <div className={`relative ${rankStyle.bg} ${rankStyle.shadow} min-w-[40px] sm:min-w-[56px] h-[40px] sm:h-[56px] rounded-lg flex items-center justify-center transform group-hover:scale-105 transition-transform shrink-0`}>
            <span className={`text-lg sm:text-xl font-black ${rankStyle.text} drop-shadow-md`}>
              {rank}.
            </span>
          </div>

          {/* Avatar - 3D Bust */}
          <div className="relative w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center transform group-hover:scale-110 transition-transform shrink-0">
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

          {/* Player Info - Username, Title, Points */}
          <div className="flex-1 min-w-0">
            <h3 className="text-base sm:text-lg font-bold text-text truncate group-hover:text-primary transition-colors">
              {player.username}
            </h3>
            <div className="flex items-center gap-1 sm:gap-2 mt-0.5 sm:mt-1">
              <Image
                src={achievement.icon}
                alt={achievement.title}
                width={12}
                height={12}
                className="opacity-90 sm:w-4 sm:h-4 shrink-0"
              />
              <span className="text-[11px] sm:text-sm text-yellow-500 font-semibold truncate">{achievement.title}</span>
              <span className="text-[11px] sm:text-sm text-text-muted whitespace-nowrap">({player.overall} points)</span>
            </div>
          </div>

          {/* Region Badge */}
          <div className="min-w-[45px] sm:min-w-[50px] flex justify-center shrink-0 pr-3">
            <RegionBadge region={player.region} size="lg" />
          </div>
        </div>

        {/* Bottom Row (Mobile) / Right Side (Desktop): Tiers */}
        <div className="z-10 w-full lg:w-auto">
          {/* Mobile: Show label + horizontal scroll */}
          <div className="lg:hidden">
            <div className="text-[10px] text-text-muted uppercase tracking-wider mb-1.5 font-semibold">Tiers</div>
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide pb-1">
              {sortedGamemodes.map(({ gamemode: gm, tier }) => {
                const hasRank = tier && tier !== '';
                return (
                  <div key={gm.key} className="flex flex-col items-center gap-1 shrink-0 w-[38px]">
                    <div className={`w-[28px] h-[28px] rounded-full flex items-center justify-center border-2 ${
                      hasRank 
                        ? 'border-border bg-bg-light' 
                        : 'border-border-muted/30 bg-transparent'
                    }`}>
                      {hasRank && (
                        <Image
                          src={gm.icon}
                          alt={gm.name}
                          width={14}
                          height={14}
                          className="opacity-80"
                        />
                      )}
                    </div>
                    {hasRank ? (
                      <TierBadge tier={tier} size="xs" />
                    ) : (
                      <div className="w-[38px] h-[16px]"></div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Desktop: Show in a row */}
          <div className="hidden lg:flex items-center gap-1.5">
            {sortedGamemodes.map(({ gamemode: gm, tier }) => {
              const hasRank = tier && tier !== '';
              return (
                <div key={gm.key} className="flex flex-col items-center gap-1 shrink-0 w-[42px]">
                  <div className={`w-[32px] h-[32px] rounded-full flex items-center justify-center border-2 ${
                    hasRank 
                      ? 'border-border bg-bg-light' 
                      : 'border-border-muted/30 bg-transparent'
                  }`}>
                    {hasRank && (
                      <Image
                        src={gm.icon}
                        alt={gm.name}
                        width={18}
                        height={18}
                        className="opacity-80"
                      />
                    )}
                  </div>
                  {hasRank ? (
                    <TierBadge tier={tier} size="xs" />
                  ) : (
                    <div className="w-[42px] h-[18px]"></div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // Gamemode-specific view - show tier badge
  return (
    <div
      onClick={onClick}
      className="relative flex items-center gap-2 sm:gap-4 p-2 sm:p-3 bg-linear-to-r from-bg to-bg-light border border-border-muted rounded-xl hover:border-primary hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 cursor-pointer group overflow-hidden"
    >
      {/* Background Accent on Hover */}
      <div className="absolute inset-0 bg-linear-to-r from-transparent via-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {/* Rank Badge */}
      <div className={`relative ${rankStyle.bg} ${rankStyle.shadow} min-w-[40px] sm:min-w-[56px] h-[40px] sm:h-[56px] rounded-lg flex items-center justify-center z-10 transform group-hover:scale-105 transition-transform shrink-0`}>
        <span className={`text-lg sm:text-xl font-black ${rankStyle.text} drop-shadow-md`}>
          {rank}.
        </span>
      </div>

      {/* Avatar - 3D Bust */}
      <div className="relative w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center z-10 transform group-hover:scale-110 transition-transform shrink-0">
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
        <h3 className="text-base sm:text-lg font-bold text-text truncate group-hover:text-primary transition-colors">
          {player.username}
        </h3>
      </div>

      {/* Region Badge */}
      <div className="z-10 min-w-[45px] sm:min-w-[60px] flex justify-start shrink-0 pl-1">
        <RegionBadge region={player.region} size="lg" />
      </div>

      {/* Gamemode Icon & Tier Badge */}
      <div className="z-10 flex items-center shrink-0 pr-3 pl-2">
        {/* Get current gamemode */}
        {(() => {
          const currentGamemode = GAMEMODES.find(gm => gm.key === gamemode);
          const tier = getPlayerTier(player, gamemode);
          const hasRank = tier && tier !== '';
          
          return (
            <div className="flex flex-col items-center gap-1">
              {/* Circular icon container */}
              <div className={`w-[31px] h-[31px] sm:w-[35px] sm:h-[35px] rounded-full flex items-center justify-center border-2 ${
                hasRank 
                  ? 'border-border bg-bg-light' 
                  : 'border-border-muted/30 bg-transparent'
              }`}>
                {currentGamemode && (
                  <Image
                    src={currentGamemode.icon}
                    alt={currentGamemode.name}
                    width={16}
                    height={16}
                    className="opacity-80 sm:w-[21px] sm:h-[21px]"
                  />
                )}
              </div>
              {/* Tier badge below circle */}
              {hasRank ? (
                <TierBadge tier={tier} size="xs" />
              ) : (
                <div className="w-[38px] h-[16px]"></div>
              )}
            </div>
          );
        })()}
      </div>
    </div>
  );
}
