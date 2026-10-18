import React from 'react';
import { Check, X } from 'lucide-react';

interface OrderSkipRowsProps {
  orderNote: string;
  skipNote: string;
}

export const OrderSkipRows: React.FC<OrderSkipRowsProps> = ({
  orderNote,
  skipNote,
}) => {
  return (
    <div className="space-y-2 py-1 text-xs">
      {/* ORDER Row */}
      <div className="flex items-start gap-2.5">
        <span className="inline-flex items-center gap-1 bg-god-tier text-white text-[9.5px] font-extrabold uppercase tracking-overline px-2 py-0.5 rounded-sm shrink-0 mt-0.5 shadow-subtle">
          <Check className="w-2.5 h-2.5 stroke-[3]" />
          <span>Order</span>
        </span>
        <p className="text-espresso font-medium text-[11.5px] leading-relaxed line-clamp-2">
          {orderNote}
        </p>
      </div>

      {/* SKIP Row */}
      <div className="flex items-start gap-2.5">
        <span className="inline-flex items-center gap-1 bg-oxblood text-white text-[9.5px] font-extrabold uppercase tracking-overline px-2 py-0.5 rounded-sm shrink-0 mt-0.5 shadow-subtle">
          <X className="w-2.5 h-2.5 stroke-[3]" />
          <span>Skip</span>
        </span>
        <p className="text-muted font-medium text-[11.5px] leading-relaxed line-clamp-2">
          {skipNote}
        </p>
      </div>
    </div>
  );
};
