import React from 'react';
import { Users } from 'lucide-react';

interface TrustLineProps {
  vouchCount: number;
  vouchesThisMonth: number;
  sharedTasteCount: number;
}

export const TrustLine: React.FC<TrustLineProps> = ({
  vouchCount,
  vouchesThisMonth,
  sharedTasteCount,
}) => {
  return (
    <div className="flex items-center gap-1.5 text-[11px] text-muted py-1.5 px-2.5 rounded-lg bg-ivory/80 border border-hairline/60">
      <Users className="w-3.5 h-3.5 text-gold shrink-0" />
      <span className="font-medium truncate">
        <strong className="text-espresso font-semibold">{vouchCount}</strong> vouches
        <span className="mx-1 text-gold">·</span>
        <strong className="text-espresso font-semibold">{vouchesThisMonth}</strong> this month
        <span className="mx-1 text-gold">·</span>
        <span className="text-gold font-semibold">{sharedTasteCount} share your taste</span>
      </span>
    </div>
  );
};
