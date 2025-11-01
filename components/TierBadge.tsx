'use client';

import { getTierBadgeStyle } from '@/lib/tiers';

interface TierBadgeProps {
  tier: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function TierBadge({ tier, size = 'md' }: TierBadgeProps) {
  const style = getTierBadgeStyle(tier);
  
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  return (
    <span
      className={`${sizeClasses[size]} font-bold rounded-md inline-block`}
      style={{ backgroundColor: style.bg, color: style.text }}
    >
      {tier}
    </span>
  );
}

