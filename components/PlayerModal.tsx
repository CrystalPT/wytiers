'use client';

import { Player } from '@/lib/firestore';
import { GAMEMODES, GamemodeKey, getPlayerTier } from '@/lib/gamemodes';
import { getAchievementTitle } from '@/lib/tiers';
import TierBadge from './TierBadge';
import Image from 'next/image';
import { useEffect } from 'react';

interface PlayerModalProps {
  player: Player;
  rank: number;
  isOpen: boolean;
  onClose: () => void;
}

export default function PlayerModal({ player, rank, isOpen, onClose }: PlayerModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const avatarUrl = `https://render.crafty.gg/3d/bust/${player.uuid}`;
  const nameMCUrl = `https://namemc.com/profile/${player.username}`;
  const achievement = getAchievementTitle(player.overall);

  const getRankStyle = () => {
    if (rank === 1) return {
      bg: 'from-yellow-400 via-yellow-500 to-yellow-600',
      text: 'text-yellow-900',
    };
    if (rank === 2) return {
      bg: 'from-gray-300 via-gray-400 to-gray-500',
      text: 'text-gray-900',
    };
    if (rank === 3) return {
      bg: 'from-orange-400 via-orange-500 to-orange-600',
      text: 'text-orange-900',
    };
    return {
      bg: 'from-bg-light to-bg',
      text: 'text-text',
    };
  };

  const rankStyle = getRankStyle();

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-bg-light border-2 border-border rounded-2xl max-w-2xl w-full p-4 sm:p-8 relative max-h-[90vh] overflow-y-auto scrollbar-hide"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 sm:top-4 sm:right-4 w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg bg-bg hover:bg-border transition-colors text-text text-xl sm:text-2xl"
        >
          ×
        </button>

        {/* Player Avatar */}
        <div className="flex flex-col items-center mb-4 sm:mb-6">
          <div className="relative w-32 h-32 sm:w-40 sm:h-40 flex items-center justify-center mb-3 sm:mb-4">
            <div className="absolute inset-0 rounded-full bg-linear-to-br from-primary/20 to-primary/5 blur-xl" />
            <Image
              src={avatarUrl}
              alt={player.username}
              width={160}
              height={160}
              className="object-contain drop-shadow-2xl relative z-10"
              unoptimized
              style={{
                imageRendering: 'pixelated',
                filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.5))'
              }}
            />
          </div>

          {/* Username */}
          <h2 className="text-2xl sm:text-3xl font-bold text-text mb-3">{player.username}</h2>

          {/* Achievement Title */}
          <div className="flex items-center gap-2 mb-4">
            <Image
              src={achievement.icon}
              alt={achievement.title}
              width={20}
              height={20}
              className="opacity-90"
            />
            <span className="text-sm sm:text-base text-yellow-500 font-semibold">{achievement.title}</span>
          </div>
        </div>

        {/* Region */}
        <div className="mb-1 text-center">
          <div className="text-text-region uppercase font-bold text-sm sm:text-base">
            {player.region === 'EU' ? 'Europe' : player.region === 'NA' ? 'North America' : player.region === 'AS' ? 'Asia' : player.region === 'OCE' ? 'Oceania' : player.region}
          </div>
        </div>

        {/* NameMC Button */}
        <div className="flex justify-center mb-6">
          <a
            href={nameMCUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-bg border border-border-muted hover:border-primary rounded-lg transition-colors text-text hover:text-primary"
          >
            <div className="w-5 h-5 bg-text text-bg flex items-center justify-center rounded font-bold text-xs">
              n
            </div>
            <span className="font-medium">NameMC</span>
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </a>
        </div>

        {/* Position Section */}
        <div className="mb-6">
          <div className="text-text-muted text-xs sm:text-sm uppercase tracking-wider mb-3 text-center font-semibold">Position</div>
          <div className="bg-bg border border-border-muted rounded-xl p-4 flex items-center gap-4">
            {/* Rank Badge */}
            <div className={`w-12 h-12 sm:w-11 sm:h-11 rounded-lg bg-linear-to-br ${rankStyle.bg} flex items-center justify-center shrink-0 shadow-lg`}>
              <span className={`text-2xl sm:text-3xl font-black ${rankStyle.text} drop-shadow-md`}>{rank}</span>
            </div>
            
            {/* Position Info */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Image
                  src="/overall.svg"
                  alt="Sword"
                  width={28}
                  height={28}
                  className="opacity-90"
                />
                <span className="text-lg sm:text-xl font-bold text-text">OVERALL</span>
                <span className="text-sm sm:text-base text-text-muted">({player.overall} points)</span>
              </div>
              
            </div>
          </div>
        </div>

        {/* Gamemode Tiers */}
        <div className="mb-4 sm:mb-6">
          <div className="text-text-muted text-xs sm:text-sm uppercase tracking-wider mb-2 sm:mb-3 text-center">Gamemode Tiers</div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
            {GAMEMODES.filter(gm => gm.key !== 'overall').map((gamemode) => {
              const tier = getPlayerTier(player, gamemode.key);
              const hasRank = tier && tier !== '';
              
              return (
                <div
                  key={gamemode.key}
                  className={`flex flex-col items-center gap-2 p-3 rounded-lg transition-colors ${
                    hasRank ? 'bg-bg' : 'bg-bg/50 opacity-50'
                  }`}
                >
                  <div className="w-10 h-10 flex items-center justify-center">
                    <Image
                      src={gamemode.icon}
                      alt={gamemode.name}
                      width={28}
                      height={28}
                      className="opacity-80"
                    />
                  </div>
                  <div className="text-xs text-text-muted text-center font-medium">
                    {gamemode.name}
                  </div>
                  {hasRank ? (
                    <TierBadge tier={tier} size="sm" />
                  ) : (
                    <div className="text-xs text-text-muted/50">Unranked</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        

        
      </div>
    </div>
  );
}
