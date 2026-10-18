import React from 'react';

interface ScoreNumeralProps {
  score: number;
  vouchCount: number;
  size?: 'normal' | 'large';
}

export const ScoreNumeral: React.FC<ScoreNumeralProps> = ({
  score,
  vouchCount,
  size = 'normal',
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center pl-3 border-l border-hairline shrink-0 min-w-[76px]">
      <div className="flex items-baseline">
        <span className={`font-serif font-bold text-espresso leading-none ${size === 'large' ? 'text-4xl' : 'text-3xl'}`}>
          {score}
        </span>
        <span className="font-serif text-sm font-semibold text-gold ml-0.5">%</span>
      </div>
      
      <span className="text-[9.5px] uppercase tracking-overline text-god-tier font-bold mt-1">
        God-Tier
      </span>

      <span className="text-[10px] text-muted font-medium mt-0.5 whitespace-nowrap">
        ({vouchCount} vouches)
      </span>
    </div>
  );
};
