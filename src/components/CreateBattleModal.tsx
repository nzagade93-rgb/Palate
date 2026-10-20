'use client';

// ==============================================================================
// PALATE: Create a Food Battle Modal
// Allows community foodies to launch new food battles with live preview
// ==============================================================================

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Swords, Eye, Send, CheckCircle2, Image as ImageIcon } from 'lucide-react';
import confetti from 'canvas-confetti';

interface CreateBattleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateBattle: (battleData: {
    title: string;
    battle_type: 'dish' | 'restaurant' | 'debate';
    dish_name: string;
    category: string;
    city: string;
    neighborhood: string;
    contestant_a_name: string;
    contestant_a_restaurant?: string;
    contestant_a_image?: string;
    contestant_b_name: string;
    contestant_b_restaurant?: string;
    contestant_b_image?: string;
    description?: string;
  }) => Promise<boolean>;
}

export default function CreateBattleModal({
  isOpen,
  onClose,
  onCreateBattle,
}: CreateBattleModalProps) {
  const [title, setTitle] = useState('');
  const [battleType, setBattleType] = useState<'dish' | 'restaurant' | 'debate'>('dish');
  const [dishName, setDishName] = useState('');
  const [category, setCategory] = useState('Street Food');
  const [neighborhood, setNeighborhood] = useState('Vashi');
  const [contestantAName, setContestantAName] = useState('');
  const [contestantAImage, setContestantAImage] = useState('https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&auto=format&fit=crop&q=80');
  const [contestantBName, setContestantBName] = useState('');
  const [contestantBImage, setContestantBImage] = useState('https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&auto=format&fit=crop&q=80');
  const [description, setDescription] = useState('');

  const [isPreview, setIsPreview] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!title.trim() || !contestantAName.trim() || !contestantBName.trim()) {
      setErrorMsg('Please enter a battle title and both contestants.');
      return;
    }

    setIsSubmitting(true);
    const success = await onCreateBattle({
      title: title.trim(),
      battle_type: battleType,
      dish_name: dishName.trim() || title.trim(),
      category,
      city: 'Navi Mumbai',
      neighborhood,
      contestant_a_name: contestantAName.trim(),
      contestant_a_image: contestantAImage,
      contestant_b_name: contestantBName.trim(),
      contestant_b_image: contestantBImage,
      description: description.trim(),
    });
    setIsSubmitting(false);

    if (success) {
      setIsSuccess(true);
      try {
        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#FFD11A', '#2748FF', '#FF5C9A'],
        });
      } catch {}

      setTimeout(() => {
        setIsSuccess(false);
        setTitle('');
        setContestantAName('');
        setContestantBName('');
        setDescription('');
        setIsPreview(false);
        onClose();
      }, 2000);
    } else {
      setErrorMsg('Could not publish battle. Check your parameters.');
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#121212]/80 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 16 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 16 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="relative z-10 max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-2xl border-[3px] border-[#121212] bg-[#F6EFE2] p-5 sm:p-6 shadow-[8px_8px_0px_#121212]"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-full border-2 border-[#121212] bg-[#FFFFFF] p-1.5 text-[#121212] shadow-[2px_2px_0px_#121212] hover:bg-[#FFD11A] transition-colors"
          >
            <X className="h-4 w-4" />
          </button>

          {isSuccess ? (
            <div className="py-8 text-center space-y-3">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-[#121212] bg-[#FFD11A] shadow-[3px_3px_0px_#121212]">
                <CheckCircle2 className="h-8 w-8 text-[#121212]" />
              </div>
              <h3 className="text-xl font-black text-[#121212] uppercase">
                Food Battle Published!
              </h3>
              <p className="text-xs text-[#121212]/75 max-w-xs mx-auto font-medium">
                Your battle is now live in the Navi Mumbai arena. Share the battle link on WhatsApp to get the community voting!
              </p>
            </div>
          ) : (
            <div>
              {/* Header */}
              <div className="flex items-center space-x-3 mb-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border-2 border-[#121212] bg-[#FFD11A] shadow-[2px_2px_0px_#121212]">
                  <Swords className="h-5 w-5 text-[#121212]" />
                </div>
                <div>
                  <span className="stamp-tag text-[9px] py-0.5 px-2">
                    COMMUNITY INITIATIVE
                  </span>
                  <h3 className="text-xl font-black tracking-tight text-[#121212] uppercase leading-tight">
                    Create A Food Battle
                  </h3>
                </div>
              </div>

              {/* Mode Toggle (Edit vs Preview) */}
              <div className="mb-4 flex space-x-2">
                <button
                  type="button"
                  onClick={() => setIsPreview(false)}
                  className={`flex-1 py-1.5 rounded-lg border-2 border-[#121212] text-xs font-black uppercase transition-all ${
                    !isPreview ? 'bg-[#FFD11A] shadow-[2px_2px_0px_#121212]' : 'bg-[#FFFFFF]'
                  }`}
                >
                  Edit Details
                </button>
                <button
                  type="button"
                  onClick={() => setIsPreview(true)}
                  className={`flex-1 py-1.5 rounded-lg border-2 border-[#121212] text-xs font-black uppercase transition-all ${
                    isPreview ? 'bg-[#FFD11A] shadow-[2px_2px_0px_#121212]' : 'bg-[#FFFFFF]'
                  }`}
                >
                  <span className="inline-flex items-center space-x-1">
                    <Eye className="h-3.5 w-3.5" />
                    <span>Card Preview</span>
                  </span>
                </button>
              </div>

              {errorMsg && (
                <div className="mb-3 rounded-lg border-2 border-[#121212] bg-red-100 p-2 text-xs font-bold text-red-700">
                  {errorMsg}
                </div>
              )}

              {isPreview ? (
                /* LIVE CARD PREVIEW */
                <div className="space-y-4">
                  <div className="poster-card p-4">
                    <span className="stamp-tag mb-2">PREVIEW MODE</span>
                    <h4 className="text-lg font-black uppercase text-[#121212]">
                      {title || 'Your Battle Title Here'}
                    </h4>
                    <p className="text-xs text-[#121212]/70 font-semibold mb-3">
                      Dish: {dishName || 'Contested Dish'} • {neighborhood}
                    </p>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="rounded-lg border-2 border-[#121212] bg-[#2748FF]/10 p-2 text-center">
                        <span className="font-mono text-[10px] font-black text-[#2748FF] block">
                          TEAM BLUE
                        </span>
                        <p className="text-xs font-black text-[#121212] line-clamp-1">
                          {contestantAName || 'Contestant A'}
                        </p>
                      </div>

                      <div className="rounded-lg border-2 border-[#121212] bg-[#FF5C9A]/10 p-2 text-center">
                        <span className="font-mono text-[10px] font-black text-[#FF5C9A] block">
                          TEAM PINK
                        </span>
                        <p className="text-xs font-black text-[#121212] line-clamp-1">
                          {contestantBName || 'Contestant B'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="w-full btn-yellow py-3 text-xs font-black uppercase tracking-wider"
                  >
                    Confirm & Publish Battle
                  </button>
                </div>
              ) : (
                /* FORM INPUTS */
                <form onSubmit={handleSubmit} className="space-y-3">
                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-[#121212] mb-1 font-mono">
                      Battle Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. Vashi vs Nerul: Best Vada Pav"
                      className="w-full rounded-xl border-2 border-[#121212] bg-[#FFFFFF] px-3.5 py-2 text-xs text-[#121212] placeholder-[#888888] focus:outline-none focus:ring-2 focus:ring-[#FFD11A]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-black uppercase tracking-wider text-[#121212] mb-1 font-mono">
                        Battle Type *
                      </label>
                      <select
                        value={battleType}
                        onChange={(e) => setBattleType(e.target.value as any)}
                        className="w-full rounded-xl border-2 border-[#121212] bg-[#FFFFFF] px-3 py-2 text-xs font-bold text-[#121212] focus:outline-none"
                      >
                        <option value="dish">Dish Battle (2 Vendors)</option>
                        <option value="restaurant">Restaurant Battle</option>
                        <option value="debate">Food Debate (E.g. Dish vs Dish)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-black uppercase tracking-wider text-[#121212] mb-1 font-mono">
                        Neighbourhood *
                      </label>
                      <select
                        value={neighborhood}
                        onChange={(e) => setNeighborhood(e.target.value)}
                        className="w-full rounded-xl border-2 border-[#121212] bg-[#FFFFFF] px-3 py-2 text-xs font-bold text-[#121212] focus:outline-none"
                      >
                        <option value="Vashi">Vashi</option>
                        <option value="Nerul">Nerul</option>
                        <option value="Belapur">CBD Belapur</option>
                        <option value="Kharghar">Kharghar</option>
                        <option value="Seawoods">Seawoods</option>
                        <option value="Sanpada">Sanpada</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-[#121212] mb-1 font-mono">
                      Contested Dish Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={dishName}
                      onChange={(e) => setDishName(e.target.value)}
                      placeholder="e.g. Crispy Batata Vada Pav"
                      className="w-full rounded-xl border-2 border-[#121212] bg-[#FFFFFF] px-3.5 py-2 text-xs text-[#121212] placeholder-[#888888] focus:outline-none focus:ring-2 focus:ring-[#FFD11A]"
                    />
                  </div>

                  {/* Contestants Split */}
                  <div className="grid grid-cols-2 gap-2.5 pt-1">
                    {/* Contestant A */}
                    <div className="rounded-xl border-2 border-[#121212] bg-[#2748FF]/10 p-2.5">
                      <span className="font-mono text-[10px] font-black text-[#2748FF] block mb-1">
                        TEAM BLUE (Contender A) *
                      </span>
                      <input
                        type="text"
                        required
                        value={contestantAName}
                        onChange={(e) => setContestantAName(e.target.value)}
                        placeholder="Contender A Name"
                        className="w-full rounded-lg border-2 border-[#121212] bg-[#FFFFFF] px-2.5 py-1.5 text-xs text-[#121212] font-bold mb-1.5"
                      />
                    </div>

                    {/* Contestant B */}
                    <div className="rounded-xl border-2 border-[#121212] bg-[#FF5C9A]/10 p-2.5">
                      <span className="font-mono text-[10px] font-black text-[#FF5C9A] block mb-1">
                        TEAM PINK (Contender B) *
                      </span>
                      <input
                        type="text"
                        required
                        value={contestantBName}
                        onChange={(e) => setContestantBName(e.target.value)}
                        placeholder="Contender B Name"
                        className="w-full rounded-lg border-2 border-[#121212] bg-[#FFFFFF] px-2.5 py-1.5 text-xs text-[#121212] font-bold mb-1.5"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-[#121212] mb-1 font-mono">
                      Battle Context / Description
                    </label>
                    <textarea
                      rows={2}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Why is this rivalry heated? Who serves the real deal?"
                      className="w-full rounded-xl border-2 border-[#121212] bg-[#FFFFFF] px-3.5 py-2 text-xs text-[#121212] placeholder-[#888888] focus:outline-none focus:ring-2 focus:ring-[#FFD11A]"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full btn-yellow py-3 text-xs font-black uppercase tracking-wider flex items-center justify-center space-x-1.5"
                    >
                      <Send className="h-4 w-4" />
                      <span>{isSubmitting ? 'Publishing Battle...' : 'Enter Battle Into The Arena'}</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
