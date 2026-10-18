import React from 'react';

interface ChipProps {
  label: string;
  isSelected?: boolean;
  onClick: () => void;
  count?: number;
}

export const Chip: React.FC<ChipProps> = ({
  label,
  isSelected = false,
  onClick,
  count,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`text-xs px-3.5 py-1.5 rounded-full transition-all shrink-0 active:scale-95 flex items-center gap-1.5 cursor-pointer ${
        isSelected
          ? 'bg-espresso text-card border border-espresso font-semibold shadow-subtle'
          : 'bg-card text-muted hover:text-espresso border border-hairline hover:border-gold-light/60 font-medium'
      }`}
    >
      <span>{label}</span>
      {count !== undefined && (
        <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
          isSelected ? 'bg-gold text-card' : 'bg-ivory text-muted'
        }`}>
          {count}
        </span>
      )}
    </button>
  );
};
