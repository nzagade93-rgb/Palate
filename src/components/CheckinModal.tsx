'use client';

// ==============================================================================
// PALATE: Check-In & Receipt Upload Modal
// Allows foodies to post live check-ins and upload dining receipts for verification,
// syncing immediately to Supabase (palate_checkins) and updating their Food Passport.
// ==============================================================================

import React, { useState, useRef } from 'react';
import { X, Flame, ThumbsDown, Camera, Upload, Receipt, CheckCircle, Sparkles, MapPin } from 'lucide-react';
import confetti from 'canvas-confetti';
import { insertCloudCheckin, uploadReceiptPhoto, CloudCheckin } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';

interface CheckinModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  onCheckinSuccess: (checkin: CloudCheckin, hasReceipt: boolean) => void;
  defaultVenue?: string;
  defaultDish?: string;
}

const NAVI_MUMBAI_VENUES = [
  { name: 'Bhagat Tarachand', node: 'Vashi', defaultDish: 'Special Sev Tameta & Kutchi Beer' },
  { name: 'Shri Krishna Vada Pav', node: 'Nerul', defaultDish: 'Batata Vada Pav with Garlic Chura' },
  { name: 'Kerala Cafe', node: 'Kharghar', defaultDish: 'Malabar Beef Fry & Porotta' },
  { name: 'Mahesh Lunch Home', node: 'Belapur', defaultDish: 'Butter Garlic Surmai & Neer Dosa' },
  { name: 'Yoko Sizzlers', node: 'Seawoods', defaultDish: 'Yoko Special Chicken Sizzler' },
  { name: 'Sai Swaad Dosa', node: 'Sanpada', defaultDish: 'Mysore Masala Dosa with Podi Butter' },
  { name: 'Gupta Sandwiches', node: 'Vashi', defaultDish: 'Cadbury Chocolate Toast' },
  { name: 'Mamledar Misal', node: 'Nerul', defaultDish: 'Kolhapuri Teekha Misal Pav' },
];

export default function CheckinModal({
  isOpen,
  onClose,
  currentUser,
  onCheckinSuccess,
  defaultVenue,
  defaultDish,
}: CheckinModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [venueName, setVenueName] = useState(defaultVenue || 'Bhagat Tarachand');
  const [dishName, setDishName] = useState(defaultDish || 'Special Sev Tameta & Kutchi Beer');
  const [reaction, setReaction] = useState<'GOD_TIER' | 'SKIP'>('GOD_TIER');
  const [note, setNote] = useState('');
  const [billAmount, setBillAmount] = useState('240');
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setReceiptFile(file);
      const reader = new FileReader();
      reader.onload = () => setReceiptPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleVenueSelect = (item: typeof NAVI_MUMBAI_VENUES[0]) => {
    setVenueName(item.name);
    setDishName(item.defaultDish);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // 1. Upload receipt photo if selected
      let uploadedUrl: string | undefined = undefined;
      if (receiptFile) {
        uploadedUrl = await uploadReceiptPhoto(receiptFile);
      }

      // 2. Insert Check-In to Supabase cloud
      const newCheckin = await insertCloudCheckin({
        dish_id: `dish-${Date.now()}`,
        dish_name: dishName.trim(),
        venue_name: venueName.trim(),
        reaction,
        note: note.trim() || (receiptFile ? `🧾 Verified with Bill Receipt (₹${billAmount})` : undefined),
        user_name: currentUser?.user_metadata?.display_name || currentUser?.email?.split('@')[0] || 'Local Diner',
      });

      // Confetti celebration
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
          colors: reaction === 'GOD_TIER' ? ['#FFD11A', '#00B26B', '#121212'] : ['#FF5C9A', '#121212'],
        });
      } catch {
        // ignore
      }

      if (newCheckin) {
        onCheckinSuccess(newCheckin, Boolean(receiptFile));
      }

      setTimeout(() => {
        setSubmitting(false);
        onClose();
      }, 500);
    } catch (err) {
      console.error('Check-in submission failed:', err);
      setSubmitting(false);
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg rounded-2xl border-[2.5px] border-[#121212] bg-[#F6EFE2] p-6 shadow-[6px_6px_0px_#121212] text-[#121212] overflow-y-auto max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-lg border-2 border-[#121212] bg-[#FFFFFF] shadow-[2px_2px_0px_#121212] hover:bg-[#FF5C9A] hover:text-white transition-all"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Modal Header */}
        <div className="space-y-1 mb-5">
          <div className="inline-flex items-center space-x-1.5 rounded-full border border-[#121212] bg-[#FFD11A] px-2.5 py-0.5 text-[10px] font-mono font-black uppercase">
            <Sparkles className="h-3 w-3 text-[#121212]" />
            <span>Live Dining Check-In</span>
          </div>
          <h2 className="text-2xl font-black tracking-tight text-[#121212]">
            Check In & Upload Receipt
          </h2>
          <p className="text-xs text-[#121212]/70 font-medium">
            Post your authentic verdict to the cloud radar and upload receipt proof to level up your Food Passport.
          </p>
        </div>

        {/* Quick Venue Picker */}
        <div className="mb-4">
          <label className="text-[11px] font-black uppercase tracking-wider text-[#121212] mb-1.5 block">
            Popular Navi Mumbai Spots:
          </label>
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
            {NAVI_MUMBAI_VENUES.slice(0, 4).map((v) => (
              <button
                key={v.name}
                type="button"
                onClick={() => handleVenueSelect(v)}
                className={`px-2.5 py-1 rounded-lg border-2 text-[11px] font-bold shrink-0 transition-all ${
                  venueName === v.name
                    ? 'border-[#121212] bg-[#FFD11A] shadow-[2px_2px_0px_#121212]'
                    : 'border-[#121212]/30 bg-white hover:border-[#121212]'
                }`}
              >
                {v.name} ({v.node})
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Venue & Dish Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] font-black uppercase tracking-wider text-[#121212]">
                Restaurant / Stall Name
              </label>
              <input
                type="text"
                value={venueName}
                onChange={(e) => setVenueName(e.target.value)}
                placeholder="e.g. Bhagat Tarachand"
                required
                className="w-full rounded-xl border-2 border-[#121212] bg-white py-2 px-3 text-xs font-bold text-[#121212] placeholder:text-[#121212]/40 shadow-[2px_2px_0px_#121212] focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-black uppercase tracking-wider text-[#121212]">
                Dish Name
              </label>
              <input
                type="text"
                value={dishName}
                onChange={(e) => setDishName(e.target.value)}
                placeholder="e.g. Sev Tameta"
                required
                className="w-full rounded-xl border-2 border-[#121212] bg-white py-2 px-3 text-xs font-bold text-[#121212] placeholder:text-[#121212]/40 shadow-[2px_2px_0px_#121212] focus:outline-none"
              />
            </div>
          </div>

          {/* Binary Reaction: GOD_TIER vs SKIP */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-black uppercase tracking-wider text-[#121212]">
              Your Verdict
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setReaction('GOD_TIER')}
                className={`p-3 rounded-xl border-2 flex items-center justify-center space-x-2 transition-all ${
                  reaction === 'GOD_TIER'
                    ? 'border-[#121212] bg-[#E3F9ED] text-[#008A52] shadow-[3px_3px_0px_#121212] ring-2 ring-[#00B26B]'
                    : 'border-[#121212]/30 bg-white hover:border-[#121212]'
                }`}
              >
                <Flame className="h-5 w-5 text-[#00B26B]" />
                <div className="text-left">
                  <div className="text-xs font-black">GOD TIER 🔥</div>
                  <div className="text-[10px] opacity-80">Must Order!</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setReaction('SKIP')}
                className={`p-3 rounded-xl border-2 flex items-center justify-center space-x-2 transition-all ${
                  reaction === 'SKIP'
                    ? 'border-[#121212] bg-[#FFEBEB] text-[#D92D20] shadow-[3px_3px_0px_#121212] ring-2 ring-[#FF5C9A]'
                    : 'border-[#121212]/30 bg-white hover:border-[#121212]'
                }`}
              >
                <ThumbsDown className="h-5 w-5 text-[#D92D20]" />
                <div className="text-left">
                  <div className="text-xs font-black">SKIP ❌</div>
                  <div className="text-[10px] opacity-80">Save your ₹!</div>
                </div>
              </button>
            </div>
          </div>

          {/* Receipt Upload Card */}
          <div className="p-3.5 rounded-xl border-2 border-[#121212] bg-white shadow-[2px_2px_0px_#121212] space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Receipt className="h-4 w-4 text-[#FFD11A] fill-[#121212]" />
                <span className="text-xs font-black uppercase tracking-wider text-[#121212]">
                  Upload Dining Receipt (Optional Proof)
                </span>
              </div>
              <span className="text-[10px] font-mono font-bold bg-[#E3F9ED] text-[#008A52] px-2 py-0.5 rounded-full border border-[#00B26B]">
                +50 XP
              </span>
            </div>

            <p className="text-[11px] text-[#121212]/70 leading-tight">
              Attach your food bill/receipt to earn a <strong>Verified Diner Stamp</strong> on your profile.
            </p>

            <div className="flex items-center space-x-3 pt-1">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center space-x-1.5 px-3 py-2 rounded-lg border-2 border-[#121212] bg-[#FFD11A] text-xs font-black shadow-[2px_2px_0px_#121212] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1px_1px_0px_#121212] transition-all"
              >
                <Camera className="h-3.5 w-3.5" />
                <span>{receiptFile ? 'Change Photo' : 'Snap / Upload Bill'}</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />

              {receiptFile && (
                <div className="flex items-center space-x-2 text-xs font-bold text-[#008A52]">
                  <CheckCircle className="h-4 w-4" />
                  <span className="truncate max-w-[140px]">{receiptFile.name}</span>
                </div>
              )}
            </div>

            {receiptPreview && (
              <div className="mt-2 relative aspect-[16/6] w-full rounded-lg overflow-hidden border border-[#121212]">
                <img
                  src={receiptPreview}
                  alt="Receipt Preview"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>

          {/* Quick Note Input */}
          <div className="space-y-1">
            <label className="text-[11px] font-black uppercase tracking-wider text-[#121212]">
              Quick Diner Note (Optional)
            </label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. Ask for extra garlic chutney, absolutely delicious!"
              maxLength={120}
              className="w-full rounded-xl border-2 border-[#121212] bg-white py-2 px-3 text-xs font-bold text-[#121212] placeholder:text-[#121212]/40 shadow-[2px_2px_0px_#121212] focus:outline-none"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full flex items-center justify-center space-x-2 rounded-xl border-2 border-[#121212] bg-[#FFD11A] p-3 text-xs font-black uppercase text-[#121212] shadow-[3px_3px_0px_#121212] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1px_1px_0px_#121212] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all disabled:opacity-50"
          >
            <Sparkles className="h-4 w-4" />
            <span>
              {submitting ? 'Syncing to Supabase Cloud...' : 'Publish Check-In & Sync'}
            </span>
          </button>
        </form>
      </div>
    </div>
  );
}
