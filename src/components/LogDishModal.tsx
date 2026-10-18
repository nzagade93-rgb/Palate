'use client';

import React, { useState, useRef } from 'react';
import {
  X,
  Upload,
  ThumbsUp,
  ThumbsDown,
  MapPin,
  Check,
  Sparkles,
  Camera,
  Image as ImageIcon,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { NaviMumbaiNode, ConsensusVote, Dish } from '@/types';
import { NAVI_MUMBAI_NODES, PRESET_PHOTO_OPTIONS, INITIAL_RESTAURANTS } from '@/lib/mockData';

interface LogDishModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddDish: (newDish: Partial<Dish>, vote: ConsensusVote, note: string) => void;
  defaultNode?: NaviMumbaiNode | 'All';
}

export const LogDishModal: React.FC<LogDishModalProps> = ({
  isOpen,
  onClose,
  onAddDish,
  defaultNode,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const initialNode: NaviMumbaiNode =
    defaultNode && defaultNode !== 'All' ? defaultNode : 'Vashi';

  const [node, setNode] = useState<NaviMumbaiNode>(initialNode);
  const [restaurantName, setRestaurantName] = useState('');
  const [sector, setSector] = useState('');
  const [dishName, setDishName] = useState('');
  const [priceInr, setPriceInr] = useState('220');
  const [isVeg, setIsVeg] = useState(false);
  const [photoUrl, setPhotoUrl] = useState(PRESET_PHOTO_OPTIONS[0].url);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [vote, setVote] = useState<ConsensusVote>('must_order');
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  // Handle custom photo upload
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPhotoPreview(result);
        setPhotoUrl(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dishName.trim()) {
      alert('Please enter a dish name.');
      return;
    }

    setSubmitting(true);

    // Fire celebratory confetti!
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: vote === 'must_order' ? ['#15803D', '#A16207', '#FEF3C7'] : ['#B91C1C', '#1C1917'],
      });
    } catch {
      // ignore
    }

    const price = parseInt(priceInr, 10) || 150;
    const resolvedSpotName = restaurantName.trim() || `Popular Spot (${node})`;
    const resolvedSector = sector.trim() || `Sector 17, ${node}`;

    onAddDish(
      {
        name: dishName.trim(),
        restaurantName: resolvedSpotName,
        node,
        sector: resolvedSector,
        priceInr: price,
        isVeg,
        photoUrl: photoPreview || photoUrl,
        highlightQuote: note.trim() || (vote === 'must_order' ? 'A crowd-favorite must order.' : 'Overhyped and safe to skip.'),
      },
      vote,
      note.trim()
    );

    setTimeout(() => {
      setSubmitting(false);
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-fade-in">
      <div
        className="relative w-full max-w-xl bg-white rounded-3xl border border-[#E7E5E4] shadow-2xl overflow-hidden transition-all text-[#1C1917]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-[#E7E5E4] flex items-center justify-between bg-[#FAF8F5]/80">
          <div>
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-[#A16207]" />
              <h3 className="text-lg font-bold tracking-tight text-[#1C1917]">
                Log a Navi Mumbai Dish
              </h3>
            </div>
            <p className="text-xs text-[#78716C] mt-0.5">
              Frictionless 3-tap community consensus. No lengthy essays.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-[#78716C] hover:text-[#1C1917] hover:bg-white transition-all border border-transparent hover:border-[#E7E5E4]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* TAP 1: Select Node & Spot */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-[#1C1917] flex items-center space-x-1.5">
                <span className="w-5 h-5 rounded-full bg-[#1C1917] text-white inline-flex items-center justify-center text-[10px] font-mono">
                  1
                </span>
                <span>Select Navi Mumbai Node</span>
              </label>
              <span className="text-[11px] text-[#A16207] font-medium">
                Tap node
              </span>
            </div>

            {/* Node Pills */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
              {NAVI_MUMBAI_NODES.map((n) => {
                const active = node === n;
                return (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setNode(n)}
                    className={`py-2 px-2 text-xs font-semibold rounded-xl border text-center transition-all ${
                      active
                        ? 'bg-[#1C1917] text-white border-[#1C1917] shadow-sm'
                        : 'bg-[#FAF8F5] text-[#44403C] border-[#E7E5E4] hover:bg-white'
                    }`}
                  >
                    {n}
                  </button>
                );
              })}
            </div>

            {/* Restaurant & Sector Input */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <input
                  type="text"
                  value={restaurantName}
                  onChange={(e) => setRestaurantName(e.target.value)}
                  placeholder="Restaurant / Spot Name (e.g. Kerala Cafe)"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E7E5E4] text-xs focus:outline-none focus:ring-1 focus:ring-[#A16207] focus:border-[#A16207]"
                  required
                />
              </div>
              <div>
                <input
                  type="text"
                  value={sector}
                  onChange={(e) => setSector(e.target.value)}
                  placeholder="Sector or Area (e.g. Sector 8)"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E7E5E4] text-xs focus:outline-none focus:ring-1 focus:ring-[#A16207] focus:border-[#A16207]"
                />
              </div>
            </div>
          </div>

          {/* TAP 2: Dish Name, Price in INR & Photo */}
          <div className="space-y-3 pt-2 border-t border-[#E7E5E4]">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-[#1C1917] flex items-center space-x-1.5">
                <span className="w-5 h-5 rounded-full bg-[#1C1917] text-white inline-flex items-center justify-center text-[10px] font-mono">
                  2
                </span>
                <span>Dish Details & Photo</span>
              </label>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setIsVeg(!isVeg)}
                  className={`text-xs px-2.5 py-1 rounded-md border flex items-center space-x-1.5 font-medium transition-all ${
                    isVeg
                      ? 'bg-[#F0FDF4] text-[#15803D] border-[#BBF7D0]'
                      : 'bg-white text-[#78716C] border-[#E7E5E4]'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${isVeg ? 'bg-[#15803D]' : 'bg-[#78716C]'}`} />
                  <span>{isVeg ? 'Veg Only' : 'Non-Veg'}</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <input
                  type="text"
                  value={dishName}
                  onChange={(e) => setDishName(e.target.value)}
                  placeholder="Exact Dish Name (e.g. Malabar Beef Fry, Pav Bhaji)"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E7E5E4] text-xs focus:outline-none focus:ring-1 focus:ring-[#A16207] focus:border-[#A16207] font-medium"
                  required
                />
              </div>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-xs text-[#78716C] font-mono">
                  ₹
                </span>
                <input
                  type="number"
                  value={priceInr}
                  onChange={(e) => setPriceInr(e.target.value)}
                  placeholder="Price"
                  className="w-full pl-7 pr-3 py-2.5 rounded-xl border border-[#E7E5E4] text-xs focus:outline-none focus:ring-1 focus:ring-[#A16207] focus:border-[#A16207] font-mono"
                  min="0"
                  required
                />
              </div>
            </div>

            {/* Photo Selection: Upload or Pick Preset */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[11px] text-[#78716C]">
                <span>Choose a photo or upload your shot:</span>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-[#A16207] hover:underline flex items-center space-x-1 font-medium"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>Upload Custom File</span>
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </div>

              {/* Preset Thumbnails */}
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {PRESET_PHOTO_OPTIONS.map((opt, i) => {
                  const selected = (photoPreview || photoUrl) === opt.url;
                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => {
                        setPhotoPreview(null);
                        setPhotoUrl(opt.url);
                      }}
                      className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all group ${
                        selected
                          ? 'border-[#A16207] ring-2 ring-[#A16207]/30 scale-102'
                          : 'border-[#E7E5E4] hover:border-[#D6D3D1] opacity-75 hover:opacity-100'
                      }`}
                      title={opt.label}
                    >
                      <img
                        src={opt.url}
                        alt={opt.label}
                        className="w-full h-full object-cover"
                      />
                      {selected && (
                        <div className="absolute inset-0 bg-[#A16207]/20 flex items-center justify-center">
                          <Check className="w-4 h-4 text-white drop-shadow" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* TAP 3: Binary Consensus Vote (Crucial Feature) */}
          <div className="space-y-3 pt-2 border-t border-[#E7E5E4]">
            <label className="text-xs font-bold uppercase tracking-wider text-[#1C1917] flex items-center space-x-1.5">
              <span className="w-5 h-5 rounded-full bg-[#1C1917] text-white inline-flex items-center justify-center text-[10px] font-mono">
                3
              </span>
              <span>Your Binary Consensus Vote</span>
            </label>

            <div className="grid grid-cols-2 gap-3">
              {/* MUST ORDER */}
              <button
                type="button"
                onClick={() => setVote('must_order')}
                className={`p-4 rounded-2xl border-2 text-left transition-all flex flex-col justify-between ${
                  vote === 'must_order'
                    ? 'border-[#15803D] bg-[#F0FDF4] shadow-md ring-2 ring-[#15803D]/20'
                    : 'border-[#E7E5E4] bg-white hover:bg-[#FAF8F5]'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 rounded-lg bg-[#15803D] text-white flex items-center justify-center shadow-sm">
                    <ThumbsUp className="w-4 h-4" />
                  </div>
                  {vote === 'must_order' && (
                    <span className="w-2 h-2 rounded-full bg-[#15803D]" />
                  )}
                </div>
                <div>
                  <div className="font-bold text-sm text-[#15803D]">Must Order</div>
                  <div className="text-[11px] text-[#44403C] mt-0.5">
                    Unforgettable flavor. Order it every time.
                  </div>
                </div>
              </button>

              {/* SAFE TO SKIP */}
              <button
                type="button"
                onClick={() => setVote('safe_to_skip')}
                className={`p-4 rounded-2xl border-2 text-left transition-all flex flex-col justify-between ${
                  vote === 'safe_to_skip'
                    ? 'border-[#B91C1C] bg-[#FEF2F2] shadow-md ring-2 ring-[#B91C1C]/20'
                    : 'border-[#E7E5E4] bg-white hover:bg-[#FAF8F5]'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 rounded-lg bg-[#B91C1C] text-white flex items-center justify-center shadow-sm">
                    <ThumbsDown className="w-4 h-4" />
                  </div>
                  {vote === 'safe_to_skip' && (
                    <span className="w-2 h-2 rounded-full bg-[#B91C1C]" />
                  )}
                </div>
                <div>
                  <div className="font-bold text-sm text-[#B91C1C]">Safe to Skip</div>
                  <div className="text-[11px] text-[#44403C] mt-0.5">
                    Overhyped or mediocre. Save your ₹.
                  </div>
                </div>
              </button>
            </div>

            {/* Optional 1-sentence note */}
            <div>
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Quick tip for fellow diners (e.g. 'Ask for extra garlic chura', 'Gravy was watery')"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E7E5E4] text-xs focus:outline-none focus:ring-1 focus:ring-[#A16207] focus:border-[#A16207] placeholder:text-[#A8A29E]"
                maxLength={140}
              />
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 rounded-2xl bg-[#1C1917] hover:bg-[#292524] text-white font-semibold text-sm tracking-wide shadow-md hover:shadow-lg active:scale-[0.99] transition-all flex items-center justify-center space-x-2"
            >
              <Sparkles className="w-4 h-4 text-[#FEF3C7]" />
              <span>
                {submitting ? 'Publishing Consensus...' : 'Publish Dish to Palate'}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
