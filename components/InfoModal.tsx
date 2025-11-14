'use client';

import { useState, useEffect } from 'react';
import { GAMEMODES } from '@/lib/gamemodes';
import Image from 'next/image';

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function InfoModal({ isOpen, onClose }: InfoModalProps) {
  const [activeTab, setActiveTab] = useState<'titles' | 'points'>('titles');

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

  const titles = [
    { name: 'Combat Grandmaster', points: '400+', icon: '/combat_grandmaster.webp' },
    { name: 'Combat Master', points: '250+', icon: '/combat_master.webp' },
    { name: 'Combat Ace', points: '100+', icon: '/combat_ace.svg' },
    { name: 'Combat Specialist', points: '50+', icon: '/combat_specialist.svg' },
    { name: 'Combat Cadet', points: '20+', icon: '/combat_cadet.svg' },
    { name: 'Combat Novice', points: '10+', icon: '/combat_novice.svg' },
    { name: 'Rookie', points: '<10', icon: '/rookie.svg' },
  ];

  const tiers = [
    { name: 'Tier 1', ht: 60, lt: 45 },
    { name: 'Tier 2', ht: 30, lt: 20 },
    { name: 'Tier 3', ht: 10, lt: 6 },
    { name: 'Tier 4', ht: 4, lt: 3 },
    { name: 'Tier 5', ht: 2, lt: 1 },
  ];

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-bg-light border-2 border-border rounded-2xl max-w-md w-full relative max-h-[90vh] overflow-y-auto scrollbar-hide"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 sm:top-4 sm:right-4 w-8 h-8 flex items-center justify-center rounded-lg bg-bg hover:bg-border transition-colors text-text text-xl z-10"
        >
          ×
        </button>

        {/* Tabs */}
        <div className="flex border-b border-border sticky top-0 bg-bg-light z-10 rounded-t-2xl">
          <button
            onClick={() => setActiveTab('titles')}
            className={`flex-1 px-4 py-3 sm:px-6 sm:py-4 font-semibold transition-colors text-sm sm:text-base ${
              activeTab === 'titles'
                ? 'text-primary border-b-2 border-primary'
                : 'text-text-muted hover:text-text'
            }`}
          >
            Titles
          </button>
          <button
            onClick={() => setActiveTab('points')}
            className={`flex-1 px-4 py-3 sm:px-6 sm:py-4 font-semibold transition-colors text-sm sm:text-base ${
              activeTab === 'points'
                ? 'text-primary border-b-2 border-primary'
                : 'text-text-muted hover:text-text'
            }`}
          >
            Points
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 max-h-[70vh] overflow-y-auto scrollbar-hide">
          {activeTab === 'titles' ? (
            <div>
              <h3 className="text-base sm:text-lg font-bold text-text mb-3 sm:mb-4">How to obtain Achievement Titles</h3>
              <div className="space-y-2 sm:space-y-3">
                {titles.map((title) => (
                  <div
                    key={title.name}
                    className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-bg rounded-lg border border-border-muted"
                  >
                    <Image
                      src={title.icon}
                      alt={title.name}
                      width={20}
                      height={20}
                      className="opacity-90 sm:w-6 sm:h-6"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-yellow-500 font-semibold text-xs sm:text-sm truncate">{title.name}</div>
                      <div className="text-text-muted text-[10px] sm:text-xs">
                        Obtained {title.points} total points.
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div>
              <h3 className="text-base sm:text-lg font-bold text-text mb-3 sm:mb-4">How ranking points are calculated</h3>
              <div className="space-y-2 sm:space-y-3">
                {tiers.map((tier, idx) => (
                  <div
                    key={tier.name}
                    className="flex items-start gap-2 sm:gap-3 p-2 sm:p-3 bg-bg rounded-lg border border-border-muted"
                  >
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-bg-light flex items-center justify-center shrink-0">
                      <span className="text-yellow-500 font-bold text-sm">{idx + 1}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-text font-semibold text-xs sm:text-sm mb-1 sm:mb-2">{tier.name}</div>
                      <div className="flex gap-3 sm:gap-4 flex-wrap">
                        <div className="flex items-center gap-1 sm:gap-2">
                          <span className="text-[10px] sm:text-xs text-text-muted">HT{idx + 1}</span>
                          <span className="text-xs sm:text-sm font-bold text-primary">{tier.ht} Points</span>
                        </div>
                        <div className="flex items-center gap-1 sm:gap-2">
                          <span className="text-[10px] sm:text-xs text-text-muted">LT{idx + 1}</span>
                          <span className="text-xs sm:text-sm font-bold text-primary">{tier.lt} Points</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

