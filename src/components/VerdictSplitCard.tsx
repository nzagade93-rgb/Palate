import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  Navigation, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle, 
  Bookmark, 
  BookmarkCheck, 
  ExternalLink,
  Flame,
  Ticket,
  Clock,
  HeartHandshake
} from 'lucide-react';
import type { Venue, Dish } from '../types';
import { DISHES } from '../data/mockData';
import { useVault } from '../hooks/useVault';

interface VerdictSplitCardProps {
  venue: Venue;
  isOpen: boolean;
  onClose: () => void;
  onOpenVoucher: (venue: Venue) => void;
}

export const VerdictSplitCard: React.FC<VerdictSplitCardProps> = ({
  venue,
  isOpen,
  onClose,
  onOpenVoucher,
}) => {
  const { isDishSaved, saveDishToVault } = useVault();
  const [activeNoteDishId, setActiveNoteDishId] = useState<string | null>(null);
  const [noteText, setNoteText] = useState('');

  if (!isOpen) return null;

  // Resolve full dish objects for this venue's top dishes
  const topDishes = venue.topDishIds
    .map((id) => DISHES.find((d) => d.id === id))
    .filter((d): d is Dish => Boolean(d));

  const handleSaveWithNote = (dish: Dish) => {
    saveDishToVault(dish, 'SAVED', noteText);
    setActiveNoteDishId(null);
    setNoteText('');
  };

  return (
    <div className="fixed inset-0 z-40 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in overflow-hidden">
      <div 
        className="w-full max-w-lg max-h-[92vh] sm:max-h-[85vh] bg-[#12141A] border-t sm:border border-[#282C3C] rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Bar */}
        <div className="p-4 sm:p-5 bg-gradient-to-b from-[#191B24] to-[#12141A] border-b border-[#232737] shrink-0">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-brand-orange uppercase tracking-wider mb-1">
                <Flame className="w-3.5 h-3.5" />
                <span>The Verdict Split-Card</span>
              </div>
              <h2 className="text-2xl font-extrabold text-white tracking-tight">{venue.name}</h2>
              <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
                <span className="flex items-center gap-1 text-gray-300">
                  <MapPin className="w-3.5 h-3.5 text-brand-orange" />
                  {venue.area}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 text-gray-400">
                  <Navigation className="w-3 h-3 text-emerald-400" />
                  {venue.distanceMeters}m ({venue.walkingMinutes} min walk)
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full bg-[#202432] text-gray-400 hover:text-white hover:bg-[#2B3042] transition-colors"
              aria-label="Close card"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Vibe Tags */}
          <div className="flex flex-wrap gap-1.5 mt-3">
            {venue.vibeTags.map((tag, idx) => (
              <span
                key={idx}
                className="text-[11px] font-medium bg-[#1B1E29] text-gray-300 border border-[#2B3042] px-2.5 py-0.5 rounded-full"
              >
                {tag}
              </span>
            ))}
            <a
              href={venue.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-2.5 py-0.5 rounded-full hover:bg-emerald-900/50 transition-colors ml-auto"
            >
              <Navigation className="w-3 h-3" />
              <span>Directions</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </a>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-5 flex-1 overscroll-contain">
          
          {/* Action Banner: Secret Counter Perk */}
          <div className="relative rounded-2xl overflow-hidden border border-amber-500/40 bg-gradient-to-r from-amber-950/40 via-[#1C160F] to-[#161821] p-4 shadow-lg shadow-amber-950/20">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 uppercase tracking-wider">
                  <Ticket className="w-4 h-4 text-amber-400 animate-bounce" />
                  <span>Exclusive Counter Perk</span>
                </div>
                <h4 className="text-sm font-bold text-white">{venue.counterPerk.title}</h4>
                <p className="text-xs text-gray-300 leading-snug">
                  {venue.counterPerk.description}
                </p>
              </div>
            </div>
            
            <button
              onClick={() => onOpenVoucher(venue)}
              className="mt-3.5 w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-brand-orange hover:from-amber-400 hover:to-orange-500 text-black font-extrabold text-xs tracking-wide shadow-md flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
            >
              <Sparkles className="w-4 h-4 text-black" />
              <span>Show Digital Voucher to Cashier</span>
            </button>
          </div>

          {/* Section 1: The Must-Orders */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 pb-1 border-b border-emerald-900/40">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <h3 className="text-sm font-extrabold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4" />
                <span>🟢 Section 1: The Must-Orders (Non-Negotiable)</span>
              </h3>
            </div>

            <div className="space-y-3">
              {topDishes.map((dish) => {
                const { saved, item } = isDishSaved(dish.id);
                const isWritingNote = activeNoteDishId === dish.id;

                return (
                  <div
                    key={dish.id}
                    className="p-3.5 rounded-2xl bg-[#161822] border border-[#262A3B] hover:border-emerald-500/40 transition-all space-y-2.5 relative"
                  >
                    <div className="flex gap-3">
                      <img
                        src={dish.imageUrl}
                        alt={dish.name}
                        className="w-16 h-16 rounded-xl object-cover shrink-0 border border-white/10"
                        loading="lazy"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-1">
                          <h4 className="text-sm font-bold text-white leading-snug truncate">
                            {dish.name}
                          </h4>
                          <span className="text-xs font-extrabold text-white bg-[#222736] px-2 py-0.5 rounded-md border border-white/10 shrink-0">
                            ₹{dish.price}
                          </span>
                        </div>

                        {/* Score Badge */}
                        <div className="flex items-center gap-2 mt-1">
                          <span className="inline-flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                            <Sparkles className="w-2.5 h-2.5" />
                            {dish.scorePercent}% {dish.verdict === 'GOD_TIER' ? 'God-Tier' : 'Worth It'}
                          </span>
                          <span className="text-[11px] text-gray-400">{dish.category}</span>
                        </div>
                      </div>
                    </div>

                    {/* Micro Verdict */}
                    <p className="text-xs text-gray-200 bg-[#1D202D] p-2.5 rounded-xl border border-white/5 leading-relaxed font-medium">
                      “{dish.microVerdict}”
                    </p>

                    {/* Flavor Tags & Insider Tip */}
                    <div className="flex flex-wrap gap-1 pt-0.5">
                      {dish.flavorTags.map((tag, i) => (
                        <span key={i} className="text-[10px] bg-[#222634] text-gray-300 px-2 py-0.5 rounded-md">
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="text-[11px] text-amber-300/90 bg-amber-950/20 border border-amber-900/30 p-2 rounded-lg flex items-start gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                      <span><strong>Insider Order Tip:</strong> {dish.insiderTip}</span>
                    </div>

                    {/* Action Row */}
                    <div className="flex items-center justify-between pt-1">
                      <button
                        onClick={() => {
                          if (saved) {
                            saveDishToVault(dish, 'LOVED');
                          } else {
                            saveDishToVault(dish, 'SAVED');
                          }
                        }}
                        className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl transition-all ${
                          saved
                            ? 'bg-brand-orange text-white shadow-sm shadow-orange-500/20'
                            : 'bg-[#222736] text-gray-300 hover:text-white hover:bg-[#2B3145]'
                        }`}
                      >
                        {saved ? <BookmarkCheck className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
                        <span>{saved ? 'In Vault' : 'Save to Vault'}</span>
                      </button>

                      <button
                        onClick={() => {
                          setActiveNoteDishId(isWritingNote ? null : dish.id);
                          setNoteText(item?.userNotes || '');
                        }}
                        className="text-xs text-gray-400 hover:text-gray-200 underline underline-offset-4"
                      >
                        {item?.userNotes ? 'Edit Personal Note' : '+ Add Note'}
                      </button>
                    </div>

                    {/* Inline Note Box */}
                    {isWritingNote && (
                      <div className="pt-2 space-y-2 animate-fade-in">
                        <textarea
                          value={noteText}
                          onChange={(e) => setNoteText(e.target.value)}
                          placeholder="E.g., Ask for less salt, or extra kadak pav..."
                          className="w-full text-xs p-2.5 rounded-xl bg-[#0F1015] border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-brand-orange"
                          rows={2}
                        />
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => setActiveNoteDishId(null)}
                            className="text-xs text-gray-400 px-2 py-1"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleSaveWithNote(dish)}
                            className="text-xs bg-brand-orange text-white font-bold px-3 py-1 rounded-lg"
                          >
                            Save Note to Vault
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 2: The Skip List */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-2 pb-1 border-b border-red-900/40">
              <div className="w-2 h-2 rounded-full bg-red-500" />
              <h3 className="text-sm font-extrabold text-red-400 uppercase tracking-wider flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" />
                <span>🔴 Section 2: The Skip List (Do Not Order)</span>
              </h3>
            </div>

            <div className="space-y-2.5">
              {venue.skipDishes.map((skip) => (
                <div
                  key={skip.id}
                  className="p-3.5 rounded-2xl bg-[#1B1316] border border-red-900/40 hover:border-red-700/60 transition-all space-y-2"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black uppercase tracking-wider bg-red-950 text-red-300 border border-red-800/60 px-2 py-0.5 rounded-full">
                          AVOID • SKIP
                        </span>
                        <h4 className="text-sm font-bold text-red-100">{skip.name}</h4>
                      </div>
                      <span className="text-xs text-gray-400 mt-0.5 block">Price: ₹{skip.price}</span>
                    </div>
                  </div>

                  <p className="text-xs text-red-200/90 leading-relaxed bg-black/40 p-2 rounded-xl border border-red-900/30">
                    <strong className="text-red-400">Why to Avoid:</strong> {skip.reason}
                  </p>

                  <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium pt-0.5">
                    <HeartHandshake className="w-3.5 h-3.5 shrink-0" />
                    <span><strong>Order Instead:</strong> {skip.alternativeRecommendation}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer sticky bar */}
        <div className="p-3 sm:p-4 bg-[#14161F] border-t border-[#232737] flex items-center justify-between text-xs text-gray-400 shrink-0">
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-gray-400" />
            Verified by Palate Field Scouts • 2026
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#232838] text-white font-bold hover:bg-[#2D3347] transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
