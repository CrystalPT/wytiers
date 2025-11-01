'use client';

import { getRegionBadgeStyle } from '@/lib/tiers';

interface RegionBadgeProps {
  region: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function RegionBadge({ region, size = 'md' }: RegionBadgeProps) {
  const style = getRegionBadgeStyle(region);
  
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base'
  };

  return (
    <span
      className={`${sizeClasses[size]} font-semibold rounded inline-block`}
      style={{ backgroundColor: style.bg, color: style.text }}
    >
      {region.toUpperCase()}
    </span>
  );
}

