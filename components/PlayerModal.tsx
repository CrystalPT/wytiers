'use client';

import { Player } from '@/lib/firestore';
import TierBadge from './TierBadge';
import RegionBadge from './RegionBadge';
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

  const avatarUrl = `https://mc-heads.net/avatar/${player.uuid}/128`;
  const nameMCUrl = `https://namemc.com/profile/${player.username}`;

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-bg-light border-2 border-border rounded-2xl max-w-lg w-full p-8 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-lg bg-bg hover:bg-border transition-colors text-text text-2xl"
        >
          ×
        </button>

        {/* Player Avatar */}
        <div className="flex flex-col items-center mb-6">
          <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-primary mb-4">
            <Image
              src={avatarUrl}
              alt={player.username}
              fill
              className="object-cover"
              unoptimized
            />
          </div>

          {/* Username */}
          <h2 className="text-3xl font-bold text-text mb-2">{player.username}</h2>
        </div>

        {/* Position Section */}
        <div className="mb-6 text-center">
          <div className="text-text-muted text-sm uppercase tracking-wider mb-1">Position</div>
          <div className="flex items-center justify-center gap-2">
            <span className="text-4xl font-bold text-primary">#{rank}</span>
            <span className="text-2xl text-text-muted">OVERALL</span>
          </div>
        </div>

        {/* Tiers Section */}
        <div className="mb-6">
          <div className="text-text-muted text-sm uppercase tracking-wider mb-3 text-center">Tiers</div>
          <div className="flex justify-center gap-3">
            <div className="flex flex-col items-center gap-2 p-4 bg-bg rounded-lg">
              <div className="w-12 h-12 flex items-center justify-center">
                <Image
                  src="/sword.svg"
                  alt="Sword"
                  width={32}
                  height={32}
                  className="opacity-80"
                />
              </div>
              <TierBadge tier={player.tier} size="lg" />
            </div>
          </div>
        </div>

        {/* Region */}
        <div className="mb-6 text-center">
          <div className="text-text-muted text-sm uppercase tracking-wider mb-2">Region</div>
          <div className="flex justify-center">
            <RegionBadge region={player.region} size="lg" />
          </div>
        </div>

        {/* NameMC Link */}
        <div className="flex justify-center">
          <a
            href={nameMCUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 bg-primary hover:bg-highlight text-white font-semibold rounded-lg transition-colors inline-flex items-center gap-2"
          >
            <span>NameMC</span>
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
      </div>
    </div>
  );
}

