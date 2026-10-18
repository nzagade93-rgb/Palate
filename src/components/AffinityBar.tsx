import React from 'react';

interface AffinityBarProps {
  label: string;
  sublabel: string;
  percentage: number; // 0 - 100
  color?: string;
}

export const AffinityBar: React.FC<AffinityBarProps> = ({
  label,
  sublabel,
  percentage,
}) => {
  return (
    <div className="space-y-1.5 py-1">
      <div className="flex items-baseline justify-between text-xs">
        <div>
          <span className="font-semibold text-espresso">{label}</span>
          <span className="text-[10px] text-muted ml-2">({sublabel})</span>
        </div>
        <span className="font-serif font-bold text-sm text-espresso">
          {percentage}%
        </span>
      </div>

      <div className="h-2 w-full bg-ivory rounded-full overflow-hidden border border-hairline p-[1px]">
        <div 
          className="h-full bg-gradient-to-r from-gold to-gold-light rounded-full transition-all duration-700"
          style={{ width: `${Math.min(100, Math.max(0, percentage))}%` }}
        />
      </div>
    </div>
  );
};
