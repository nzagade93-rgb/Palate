import React, { useState } from 'react';
import { 
  Heart, 
  Ban, 
  Bookmark, 
  Trash2, 
  Edit3, 
  PlusCircle, 
  Share2, 
  WifiOff, 
  Sparkles,
  MapPin,
  ArrowRight
} from 'lucide-react';
import type { VaultItem, VaultTab, VerdictType } from '../types';
import { useVault } from '../hooks/useVault';

interface VaultViewProps {
  onBackToRadar: () => void;
}

export const VaultView: React.FC<VaultViewProps> = ({ onBackToRadar }) => {
  const { vaultItems, updateVaultNote, updateVaultStatus, removeVaultItem, addCustomVaultItem } = useVault();
  const [activeTab, setActiveTab] = useState<VaultTab>('LOVED');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editNotesText, setEditNotesText] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [copiedToast, setCopiedToast] = useState(false);

  // Form state for adding custom discovery
  const [customDishName, setCustomDishName] = useState('');
  const [customVenue, setCustomVenue] = useState('');
  const [customPrice, setCustomPrice] = useState('150');
  const [customVerdict, setCustomVerdict] = useState<VerdictType>('GOD_TIER');
  const [customStatus, setCustomStatus] = useState<VaultTab>('LOVED');
  const [customNotes, setCustomNotes] = useState('');

  // Filter items by status tab
  const filteredItems = vaultItems.filter((item) => item.status === activeTab);

  const countLoved = vaultItems.filter((i) => i.status === 'LOVED').length;
  const countAvoid = vaultItems.filter((i) => i.status === 'AVOID').length;
  const countSaved = vaultItems.filter((i) => i.status === 'SAVED').length;

  const handleStartEdit = (item: VaultItem) => {
    setEditingId(item.id);
    setEditNotesText(item.userNotes);
  };

  const handleSaveEdit = (id: string) => {
    updateVaultNote(id, editNotesText);
    setEditingId(null);
  };

  const handleAddCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customDishName || !customVenue) return;

    addCustomVaultItem({
      dishId: `custom-${Date.now()}`,
      dishName: customDishName,
      venueName: customVenue,
      venueArea: 'Navi Mumbai',
      price: Number(customPrice) || 120,
      verdict: customVerdict,
      scorePercent: customVerdict === 'GOD_TIER' ? 95 : customVerdict === 'WORTH_IT' ? 85 : 30,
      imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=900&q=80',
      status: customStatus,
      userNotes: customNotes || 'Personal discovery',
      tags: ['Custom Entry']
    });

    setCustomDishName('');
    setCustomVenue('');
    setCustomNotes('');
    setShowAddModal(false);
  };

  const handleShareVault = () => {
    const textSummary = `🥘 My Navi Mumbai Food Vault (via Palate):\n\n` +
      `🔥 Tried & Loved (${countLoved}):\n` +
      vaultItems
        .filter((i) => i.status === 'LOVED')
        .map((i) => `• ${i.dishName} @ ${i.venueName} — "${i.userNotes}"`)
        .join('\n') +
      `\n\n🚫 Never Again (${countAvoid}):\n` +
      vaultItems
        .filter((i) => i.status === 'AVOID')
        .map((i) => `• ${i.dishName} @ ${i.venueName} — "${i.userNotes}"`)
        .join('\n');

    if (navigator.clipboard) {
      navigator.clipboard.writeText(textSummary);
      setCopiedToast(true);
      setTimeout(() => setCopiedToast(false), 2500);
    }
  };

  return (
    <div className="w-full px-3.5 sm:px-4 py-4 space-y-4 animate-fade-in pb-24">
      {/* Vault Header Bar */}
      <div className="flex items-center justify-between gap-2 border-b border-[#262C36] pb-3.5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-extrabold text-white tracking-tight">My Food Vault</h1>
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
              <WifiOff className="w-2.5 h-2.5" />
              <span>Offline Ready</span>
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Your personal anti-regret notebook. Zero account friction, 100% saved on device.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShareVault}
            title="Export Vault Summary"
            className="min-h-[44px] min-w-[44px] flex items-center justify-center p-2 rounded-xl bg-[#161B22] hover:bg-[#1E242E] text-slate-300 hover:text-white border border-[#262C36] transition-all active:scale-95"
          >
            <Share2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="min-h-[44px] flex items-center gap-1.5 text-xs font-bold bg-brand-orange hover:bg-orange-600 text-white px-3.5 py-2 rounded-xl shadow-glow-orange transition-all active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Log Dish</span>
          </button>
        </div>
      </div>

      {copiedToast && (
        <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs font-bold text-center animate-fade-in">
          ✓ Vault summary copied to clipboard! Ready to send on WhatsApp.
        </div>
      )}

      {/* Tabs Switcher: Tried & Loved | Never Again | Saved for Later */}
      <div className="grid grid-cols-3 gap-1 bg-[#0E1116] p-1.5 rounded-2xl border border-[#262C36]">
        <button
          onClick={() => setActiveTab('LOVED')}
          className={`min-h-[44px] flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-xs font-bold transition-all active:scale-95 ${
            activeTab === 'LOVED'
              ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Heart className="w-3.5 h-3.5" />
          <span>Tried & Loved</span>
          <span className="text-[10px] font-black px-1.5 py-0.5 rounded-full bg-black/30">
            {countLoved}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('AVOID')}
          className={`min-h-[44px] flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-xs font-bold transition-all active:scale-95 ${
            activeTab === 'AVOID'
              ? 'bg-red-500 text-white shadow-md shadow-red-500/20'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Ban className="w-3.5 h-3.5" />
          <span>Never Again</span>
          <span className="text-[10px] font-black px-1.5 py-0.5 rounded-full bg-black/30">
            {countAvoid}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('SAVED')}
          className={`min-h-[44px] flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-xs font-bold transition-all active:scale-95 ${
            activeTab === 'SAVED'
              ? 'bg-brand-orange text-white shadow-md shadow-orange-500/20'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Bookmark className="w-3.5 h-3.5" />
          <span>Saved</span>
          <span className="text-[10px] font-black px-1.5 py-0.5 rounded-full bg-black/30">
            {countSaved}
          </span>
        </button>
      </div>

      {/* Vault Items List */}
      <div className="space-y-3.5">
        {filteredItems.length === 0 ? (
          <div className="p-8 rounded-3xl bg-[#0E1116] border border-[#262C36] text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#161B22] border border-[#262C36] text-slate-400 flex items-center justify-center mx-auto">
              {activeTab === 'LOVED' ? (
                <Heart className="w-6 h-6 text-emerald-400" />
              ) : activeTab === 'AVOID' ? (
                <Ban className="w-6 h-6 text-red-400" />
              ) : (
                <Bookmark className="w-6 h-6 text-amber-400" />
              )}
            </div>
            <h3 className="text-sm font-bold text-white">No dishes logged here yet</h3>
            <p className="text-xs text-slate-400 max-w-xs mx-auto">
              {activeTab === 'LOVED'
                ? 'Save your favorite God-Tier dishes to create your personal hall of fame.'
                : activeTab === 'AVOID'
                ? 'Record meals that let you down so you never repeat the regret.'
                : 'Bookmark spots you want to visit on your next Sector 17 food crawl.'}
            </p>
            <button
              onClick={onBackToRadar}
              className="min-h-[44px] inline-flex items-center gap-1.5 text-xs font-bold text-brand-orange bg-brand-orange/10 hover:bg-brand-orange/20 border border-brand-orange/30 px-4 py-2 rounded-xl transition-all active:scale-95"
            >
              <span>Explore The Food Radar</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          filteredItems.map((item) => {
            const isEditing = editingId === item.id;

            return (
              <div
                key={item.id}
                className="p-4 rounded-2xl bg-[#0E1116] border border-[#262C36] hover:border-neutral-700 transition-all space-y-3 relative group shadow-md"
              >
                {/* Header Row */}
                <div className="flex gap-3.5">
                  <img
                    src={item.imageUrl}
                    alt={item.dishName}
                    className="w-14 h-14 rounded-xl object-cover shrink-0 border border-[#262C36]"
                    loading="lazy"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-sm font-bold text-white leading-tight truncate">
                        {item.dishName}
                      </h3>
                      <button
                        onClick={() => removeVaultItem(item.id)}
                        className="text-slate-500 hover:text-red-400 p-1 rounded-lg transition-colors"
                        title="Remove from vault"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-0.5">
                      <span className="font-medium text-slate-300">{item.venueName}</span>
                      <span>•</span>
                      <span className="flex items-center gap-0.5 text-slate-400">
                        <MapPin className="w-3 h-3 text-brand-orange" />
                        {item.venueArea}
                      </span>
                    </div>

                    {/* Verdict Score Badge */}
                    <div className="flex items-center gap-2 mt-1">
                      <span
                        className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${
                          item.verdict === 'GOD_TIER'
                            ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                            : item.verdict === 'WORTH_IT'
                            ? 'bg-blue-500/15 text-blue-400 border-blue-500/30'
                            : 'bg-red-500/15 text-red-400 border-red-500/30'
                        }`}
                      >
                        {item.scorePercent}% {item.verdict.replace('_', ' ')}
                      </span>
                      <span className="text-xs font-bold text-white">₹{item.price}</span>
                    </div>
                  </div>
                </div>

                {/* Personal Scratchpad Note Box */}
                <div className="bg-[#161B22] rounded-xl p-3 border border-[#262C36] space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-400">
                    <span className="flex items-center gap-1 text-brand-orange">
                      <Edit3 className="w-3 h-3" />
                      Personal Insider Note
                    </span>
                    {!isEditing && (
                      <button
                        onClick={() => handleStartEdit(item)}
                        className="text-slate-400 hover:text-white underline"
                      >
                        Edit
                      </button>
                    )}
                  </div>

                  {isEditing ? (
                    <div className="space-y-2 pt-1">
                      <textarea
                        value={editNotesText}
                        onChange={(e) => setEditNotesText(e.target.value)}
                        className="w-full text-xs p-2.5 rounded-xl bg-[#07090C] border border-[#262C36] text-white focus:outline-none focus:border-brand-orange"
                        rows={2}
                      />
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setEditingId(null)}
                          className="min-h-[36px] text-xs text-slate-400 px-3 py-1"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleSaveEdit(item.id)}
                          className="min-h-[36px] text-xs font-bold bg-brand-orange text-white px-3.5 py-1 rounded-lg active:scale-95 transition-transform"
                        >
                          Save Note
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-neutral-300 leading-relaxed italic">
                      “{item.userNotes || 'No custom notes added yet. Tap edit to jot down preferences!'}”
                    </p>
                  )}
                </div>

                {/* Quick Status Mover Buttons */}
                <div className="flex items-center justify-between pt-1 text-[11px] text-slate-400">
                  <span>Move status:</span>
                  <div className="flex items-center gap-1.5">
                    {item.status !== 'LOVED' && (
                      <button
                        onClick={() => updateVaultStatus(item.id, 'LOVED')}
                        className="px-2.5 py-1 rounded-lg bg-[#161B22] border border-[#262C36] hover:bg-emerald-950/60 hover:text-emerald-300 text-slate-300 transition-all active:scale-95"
                      >
                        Loved
                      </button>
                    )}
                    {item.status !== 'AVOID' && (
                      <button
                        onClick={() => updateVaultStatus(item.id, 'AVOID')}
                        className="px-2.5 py-1 rounded-lg bg-[#161B22] border border-[#262C36] hover:bg-red-950/60 hover:text-red-300 text-slate-300 transition-all active:scale-95"
                      >
                        Never Again
                      </button>
                    )}
                    {item.status !== 'SAVED' && (
                      <button
                        onClick={() => updateVaultStatus(item.id, 'SAVED')}
                        className="px-2.5 py-1 rounded-lg bg-[#161B22] border border-[#262C36] hover:bg-amber-950/60 hover:text-amber-300 text-slate-300 transition-all active:scale-95"
                      >
                        Save for Later
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal: Manually Log Secret Off-Menu Dish */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-sm rounded-3xl bg-[#0E1116] border border-[#262C36] p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-extrabold text-white flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-brand-orange" />
                <span>Log a Secret Discovery</span>
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddCustom} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-300 block mb-1">Dish Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Tawa Pulao extra pav masala"
                  value={customDishName}
                  onChange={(e) => setCustomDishName(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[#161B22] border border-[#262C36] text-white focus:outline-none focus:border-brand-orange"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">Venue / Stall Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Corner cart near Apna Bazar"
                  value={customVenue}
                  onChange={(e) => setCustomVenue(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[#161B22] border border-[#262C36] text-white focus:outline-none focus:border-brand-orange"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Approx Price (₹)</label>
                  <input
                    type="number"
                    value={customPrice}
                    onChange={(e) => setCustomPrice(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-[#161B22] border border-[#262C36] text-white focus:outline-none focus:border-brand-orange"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Verdict</label>
                  <select
                    value={customVerdict}
                    onChange={(e) => setCustomVerdict(e.target.value as VerdictType)}
                    className="w-full p-2.5 rounded-xl bg-[#161B22] border border-[#262C36] text-white focus:outline-none focus:border-brand-orange"
                  >
                    <option value="GOD_TIER">God-Tier</option>
                    <option value="WORTH_IT">Worth It</option>
                    <option value="SKIP">Skip / Avoid</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">Vault Category</label>
                <div className="grid grid-cols-3 gap-1 bg-[#07090C] p-1 rounded-xl border border-[#262C36]">
                  <button
                    type="button"
                    onClick={() => setCustomStatus('LOVED')}
                    className={`py-1.5 rounded-lg font-bold text-center ${
                      customStatus === 'LOVED' ? 'bg-emerald-500 text-white' : 'text-slate-400'
                    }`}
                  >
                    Loved
                  </button>
                  <button
                    type="button"
                    onClick={() => setCustomStatus('AVOID')}
                    className={`py-1.5 rounded-lg font-bold text-center ${
                      customStatus === 'AVOID' ? 'bg-red-500 text-white' : 'text-slate-400'
                    }`}
                  >
                    Avoid
                  </button>
                  <button
                    type="button"
                    onClick={() => setCustomStatus('SAVED')}
                    className={`py-1.5 rounded-lg font-bold text-center ${
                      customStatus === 'SAVED' ? 'bg-brand-orange text-white' : 'text-slate-400'
                    }`}
                  >
                    Saved
                  </button>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">Personal Notes & Custom Orders</label>
                <textarea
                  placeholder="e.g., Ask specifically for crispy edges, cash only..."
                  value={customNotes}
                  onChange={(e) => setCustomNotes(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[#161B22] border border-[#262C36] text-white focus:outline-none focus:border-brand-orange"
                  rows={2}
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 min-h-[44px] py-2.5 rounded-xl bg-[#161B22] border border-[#262C36] text-slate-300 font-bold hover:bg-[#1E242E] active:scale-95 transition-transform"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 min-h-[44px] py-2.5 rounded-xl bg-brand-orange text-white font-bold hover:bg-orange-600 shadow-glow-orange active:scale-95 transition-transform"
                >
                  Save to Vault
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
