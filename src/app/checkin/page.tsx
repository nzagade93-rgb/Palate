'use client';

// ==============================================================================
// PALATE: Dedicated Food Check-In Screen (Tab 3)
// Clean native application food logging flow:
// - Step-by-step dish & restaurant input with Navi Mumbai presets
// - 5-star taste score & flavor tags
// - Receipt photo verification (+50 CP bonus)
// - Real-time Community Bite Radar
// ==============================================================================

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Star,
  Receipt,
  Camera,
  CheckCircle2,
  Sparkles,
  MapPin,
  Clock,
  ShieldCheck,
  ChevronRight,
  UploadCloud,
  Check,
} from 'lucide-react';
import { addCrestPoints } from '@/lib/crestSystem';
import confetti from 'canvas-confetti';

const POPULAR_DISHES = [
  'Crispy Butter Vada Pav',
  'Mutton Dum Biryani',
  'Kolhapuri Teekha Misal',
  'Chicken Shawarma Roll',
  'Mysore Masala Dosa',
  'Pani Puri Platter',
];

const NAVI_MUMBAI_NODES = ['Vashi', 'Nerul', 'Belapur', 'Kharghar', 'Seawoods', 'Sanpada'];

const FLAVOR_TAGS = [
  '🔥 Fiery Thecha',
  '🧈 Rich Butter',
  '🌿 Authentic Spices',
  '💥 Super Crispy',
  '🍗 Melt-in-Mouth',
  '💰 Great Value',
  '⭐ Must Try',
];

// Initial mock community bites stream
const COMMUNITY_BITES = [
  {
    id: 'bite-1',
    user: 'Pooja K.',
    dish: 'Kolhapuri Teekha Misal',
    restaurant: 'Mamledar Misal',
    node: 'Nerul',
    rating: 5,
    verifiedReceipt: true,
    timeAgo: '4m ago',
    avatar: '👩🏻',
  },
  {
    id: 'bite-2',
    user: 'Aditya S.',
    dish: 'Mutton Dum Biryani',
    restaurant: 'Persian Darbar',
    node: 'Belapur',
    rating: 5,
    verifiedReceipt: true,
    timeAgo: '18m ago',
    avatar: '👨🏽',
  },
  {
    id: 'bite-3',
    user: 'Rohan M.',
    dish: 'Sector 17 Vada Pav',
    restaurant: 'Famous Tapri',
    node: 'Vashi',
    rating: 4,
    verifiedReceipt: false,
    timeAgo: '42m ago',
    avatar: '🧑🏻',
  },
];

function CheckinFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [dishName, setDishName] = useState('');
  const [restaurantName, setRestaurantName] = useState('');
  const [node, setNode] = useState('Vashi');
  const [rating, setRating] = useState(5);
  const [selectedTags, setSelectedTags] = useState<string[]>(['🔥 Fiery Thecha', '💥 Super Crispy']);
  const [receiptUploaded, setReceiptUploaded] = useState(false);
  const [receiptFileName, setReceiptFileName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successCelebration, setSuccessCelebration] = useState(false);
  const [earnedPoints, setEarnedPoints] = useState(25);

  // Prefill from query params if coming from Explore or Battle
  useEffect(() => {
    const qDish = searchParams.get('dish');
    const qRest = searchParams.get('rest');
    const qNode = searchParams.get('node');
    if (qDish) setDishName(qDish);
    if (qRest) setRestaurantName(qRest);
    if (qNode && NAVI_MUMBAI_NODES.includes(qNode)) setNode(qNode);
  }, [searchParams]);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleReceiptUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setReceiptUploaded(true);
      setReceiptFileName(file.name);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dishName.trim() || !restaurantName.trim()) return;

    setIsSubmitting(true);

    const points = receiptUploaded ? 75 : 25;
    setEarnedPoints(points);

    // Credit Crest Points
    addCrestPoints(
      points,
      `Logged ${dishName} at ${restaurantName}${receiptUploaded ? ' (Verified Receipt)' : ''}`
    );

    try {
      confetti({
        particleCount: 70,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#0F5132', '#EF4E3A', '#F6B21A'],
      });
    } catch {}

    setTimeout(() => {
      setIsSubmitting(false);
      setSuccessCelebration(true);
    }, 600);
  };

  const resetForm = () => {
    setDishName('');
    setRestaurantName('');
    setReceiptUploaded(false);
    setReceiptFileName('');
    setSuccessCelebration(false);
  };

  return (
    <div className="min-h-full pb-28">
      {/* Top Banner Card */}
      <div className="p-4 pb-1">
        <div className="rounded-2xl bg-gradient-to-br from-[#0F5132] via-[#14532D] to-[#0A331E] text-white p-4 shadow-sm">
          <div className="flex items-center space-x-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20">
              <Sparkles className="h-4 w-4 text-[#F6B21A]" />
            </span>
            <div>
              <h1 className="text-base font-extrabold tracking-tight">Log Your Food Bite</h1>
              <p className="text-[11px] text-white/80">
                Rate your meal & build Navi Mumbai&apos;s culinary consensus
              </p>
            </div>
          </div>

          {/* Bonus Point Bar */}
          <div className="mt-3 flex items-center justify-between bg-black/20 rounded-xl px-3 py-2 border border-white/10 text-xs">
            <span className="font-semibold text-emerald-100 flex items-center space-x-1.5">
              <Receipt className="h-3.5 w-3.5 text-[#F6B21A]" />
              <span>Verify with receipt:</span>
            </span>
            <span className="font-black text-[#F6B21A] bg-black/30 px-2 py-0.5 rounded-md">
              +50 Bonus CP
            </span>
          </div>
        </div>
      </div>

      {/* Main Check-In Form Container */}
      <div className="px-4 py-4">
        {successCelebration ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl p-6 text-center border border-emerald-200 shadow-md"
          >
            <div className="h-16 w-16 bg-emerald-50 text-[#0F5132] rounded-full flex items-center justify-center mx-auto mb-3 border border-emerald-200">
              <Check className="h-8 w-8 stroke-[3]" />
            </div>

            <h2 className="text-lg font-black text-[#02060C]">Bite Logged Successfully!</h2>
            <p className="text-xs text-[#686B78] mt-1">
              Your authentic review has been recorded on the Navi Mumbai consensus radar.
            </p>

            <div className="my-4 bg-emerald-50 rounded-2xl p-3 border border-emerald-200/60 inline-flex items-center space-x-2 text-sm font-extrabold text-[#0F5132]">
              <Sparkles className="h-4 w-4 text-[#F6B21A]" />
              <span>+{earnedPoints} Crest Points Earned</span>
            </div>

            <div className="flex flex-col space-y-2 mt-2">
              <button
                onClick={resetForm}
                className="w-full py-2.5 bg-[#0F5132] text-white rounded-xl text-xs font-bold hover:bg-[#0B3D26] shadow-sm transition-all"
              >
                Log Another Bite
              </button>
              <button
                onClick={() => router.push('/passport')}
                className="w-full py-2.5 bg-gray-100 text-[#02060C] rounded-xl text-xs font-bold hover:bg-gray-200 transition-all"
              >
                View in Foodie Passport
              </button>
            </div>
          </motion.div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl border border-black/[0.06] p-4 shadow-xs space-y-4"
          >
            {/* Field 1: Dish Name */}
            <div>
              <label className="block text-xs font-extrabold text-[#02060C] mb-1">
                What did you eat? *
              </label>
              <input
                type="text"
                required
                value={dishName}
                onChange={(e) => setDishName(e.target.value)}
                placeholder="e.g. Crispy Butter Vada Pav"
                className="w-full bg-[#F4F5F8] text-[#02060C] text-xs font-semibold px-3 py-2.5 rounded-xl border border-black/[0.06] focus:outline-none focus:ring-2 focus:ring-[#0F5132]/30 focus:bg-white"
              />

              {/* Quick Dish Suggestions */}
              <div className="flex items-center space-x-1.5 overflow-x-auto scrollbar-none mt-2">
                {POPULAR_DISHES.slice(0, 4).map((d) => (
                  <button
                    type="button"
                    key={d}
                    onClick={() => setDishName(d)}
                    className="shrink-0 text-[10px] font-bold bg-gray-50 border border-gray-200 hover:border-[#0F5132] text-[#686B78] px-2 py-0.5 rounded-full"
                  >
                    + {d}
                  </button>
                ))}
              </div>
            </div>

            {/* Field 2: Restaurant & Node */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-extrabold text-[#02060C] mb-1">
                  Restaurant / Joint *
                </label>
                <input
                  type="text"
                  required
                  value={restaurantName}
                  onChange={(e) => setRestaurantName(e.target.value)}
                  placeholder="e.g. Famous Tapri"
                  className="w-full bg-[#F4F5F8] text-[#02060C] text-xs font-semibold px-3 py-2.5 rounded-xl border border-black/[0.06] focus:outline-none focus:ring-2 focus:ring-[#0F5132]/30 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-[#02060C] mb-1">
                  Node *
                </label>
                <select
                  value={node}
                  onChange={(e) => setNode(e.target.value)}
                  className="w-full bg-[#F4F5F8] text-[#02060C] text-xs font-semibold px-3 py-2.5 rounded-xl border border-black/[0.06] focus:outline-none focus:ring-2 focus:ring-[#0F5132]/30 focus:bg-white"
                >
                  {NAVI_MUMBAI_NODES.map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Field 3: Star Rating */}
            <div>
              <label className="block text-xs font-extrabold text-[#02060C] mb-1.5">
                Taste Score: {rating} / 5 Stars
              </label>
              <div className="flex items-center justify-center space-x-4 py-2.5 bg-[#F4F5F8] rounded-xl border border-black/[0.04]">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setRating(star)}
                    className="p-1 transition-transform active:scale-125 focus:outline-none"
                  >
                    <Star
                      className={`h-7 w-7 ${
                        star <= rating
                          ? 'fill-[#F6B21A] text-[#F6B21A]'
                          : 'fill-gray-200 text-gray-200'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Field 4: Flavor & Texture Tags */}
            <div>
              <label className="block text-xs font-extrabold text-[#02060C] mb-1.5">
                Flavor & Texture Highlights
              </label>
              <div className="flex flex-wrap gap-1.5">
                {FLAVOR_TAGS.map((tag) => {
                  const isSelected = selectedTags.includes(tag);
                  return (
                    <button
                      type="button"
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-all ${
                        isSelected
                          ? 'bg-emerald-50 text-[#0F5132] border-[#0F5132]'
                          : 'bg-[#F4F5F8] text-[#686B78] border-black/[0.04]'
                      }`}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Field 5: Receipt Verification Box (Highlight) */}
            <div className="border border-dashed border-[#0F5132]/40 rounded-2xl p-3.5 bg-emerald-50/40">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2">
                  <div className="h-8 w-8 rounded-full bg-[#0F5132] text-white flex items-center justify-center shrink-0">
                    <Receipt className="h-4 w-4" />
                  </div>
                  <div>
                    <h2 className="text-xs font-black text-[#02060C]">
                      Attach Bill / Receipt Photo
                    </h2>
                    <p className="text-[10px] text-[#686B78]">
                      Unlocks +50 Bonus CP & Verified Badge
                    </p>
                  </div>
                </div>

                <span className="text-[10px] font-black bg-[#F6B21A]/20 text-[#0F5132] px-2 py-0.5 rounded-full border border-[#F6B21A]/40">
                  +50 CP
                </span>
              </div>

              <div className="mt-2.5">
                <label className="flex items-center justify-center space-x-2 w-full py-2 bg-white rounded-xl border border-gray-200 text-xs font-bold text-[#02060C] cursor-pointer hover:bg-gray-50 transition-all shadow-xs">
                  <Camera className="h-3.5 w-3.5 text-[#0F5132]" />
                  <span>{receiptUploaded ? receiptFileName : 'Choose Photo or Take Picture'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleReceiptUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {receiptUploaded && (
                <div className="mt-2 flex items-center space-x-1.5 text-[11px] text-[#0F5132] font-bold">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>Receipt attached! Bonus +50 CP will be credited.</span>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-[#0F5132] text-white rounded-xl text-xs font-extrabold tracking-wide uppercase shadow-md hover:bg-[#0B3D26] active:scale-[0.98] transition-all flex items-center justify-center space-x-2"
            >
              <span>{isSubmitting ? 'Posting...' : `Post Bite (+${receiptUploaded ? 75 : 25} CP)`}</span>
              <Sparkles className="h-4 w-4 text-[#F6B21A]" />
            </button>
          </form>
        )}

        {/* Live Community Bite Radar */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-2.5">
            <h2 className="text-xs font-extrabold text-[#02060C] flex items-center space-x-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
              <span>Live Community Bite Radar</span>
            </h2>
            <span className="text-[10px] font-semibold text-[#686B78]">
              Navi Mumbai Feed
            </span>
          </div>

          <div className="space-y-2">
            {COMMUNITY_BITES.map((bite) => (
              <div
                key={bite.id}
                className="bg-white rounded-xl border border-black/[0.04] p-2.5 shadow-xs flex items-center justify-between"
              >
                <div className="flex items-center space-x-2.5 min-w-0">
                  <span className="text-lg shrink-0">{bite.avatar}</span>
                  <div className="min-w-0">
                    <div className="flex items-center space-x-1.5">
                      <span className="text-xs font-bold text-[#02060C] truncate">
                        {bite.user}
                      </span>
                      {bite.verifiedReceipt && (
                        <span className="inline-flex items-center text-[9px] font-bold text-[#0F5132] bg-emerald-50 px-1.5 py-0.2 rounded-xs border border-emerald-200/50">
                          Verified
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-[#686B78] font-medium truncate">
                      {bite.dish} @ {bite.restaurant} ({bite.node})
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-end shrink-0 pl-2">
                  <div className="flex items-center space-x-0.5 text-amber-500">
                    <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                    <span className="text-xs font-black">{bite.rating}</span>
                  </div>
                  <span className="text-[9px] text-[#94A3B8] font-medium">{bite.timeAgo}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckinPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs font-bold text-gray-400">Loading check-in radar...</div>}>
      <CheckinFormContent />
    </Suspense>
  );
}
