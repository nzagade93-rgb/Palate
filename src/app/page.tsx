'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Header } from '@/components/Header';
import { HeroSection } from '@/components/HeroSection';
import { SearchBarAndFilters } from '@/components/SearchBarAndFilters';
import { DishCard } from '@/components/DishCard';
import { LogDishModal } from '@/components/LogDishModal';
import { DishDetailModal } from '@/components/DishDetailModal';
import { MethodologyModal } from '@/components/MethodologyModal';
import { Footer } from '@/components/Footer';
import { Dish, FilterState, NaviMumbaiNode, ConsensusVote } from '@/types';
import { INITIAL_DISHES } from '@/lib/mockData';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { Sparkles, UtensilsCrossed, AlertCircle, Plus } from 'lucide-react';

const STORAGE_KEY = 'palate_dishes_v1';

export default function HomePage() {
  const [dishes, setDishes] = useState<Dish[]>(INITIAL_DISHES);
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null);
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [isMethodologyOpen, setIsMethodologyOpen] = useState(false);

  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    selectedNode: 'All',
    consensusFilter: 'all',
    dietaryFilter: 'all',
    sortBy: 'consensus_desc',
  });

  // Load persisted dishes or fetch from Supabase if configured
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // 1. Check local storage first
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setDishes(parsed);
        }
      }
    } catch {
      // ignore
    }

    // 2. If Supabase is configured, fetch live dishes
    if (isSupabaseConfigured && supabase) {
      const client = supabase;
      const fetchSupabaseDishes = async () => {
        try {
          const { data, error } = await client
            .from('dish_consensus_view')
            .select('*');

          if (!error && data && data.length > 0) {
            const mapped: Dish[] = data.map((d: any) => ({
              id: d.dish_id,
              restaurantId: d.restaurant_id,
              restaurantName: d.restaurant_name,
              name: d.dish_name,
              category: d.category || 'Main',
              isVeg: d.is_veg,
              priceInr: d.price_inr,
              photoUrl: d.photo_url,
              mustOrderCount: d.must_order_count || 0,
              skipCount: d.skip_count || 0,
              totalVotes: d.total_votes || 0,
              consensusPercentage: Number(d.consensus_percentage) || 0,
              highlightQuote: d.highlight_quote || '',
              node: d.node as NaviMumbaiNode,
              sector: d.sector || '',
              landmark: d.landmark || '',
              googleMapsUrl: d.google_maps_url || '',
            }));
            setDishes(mapped);
          }
        } catch {
          // fallback to local
        }
      };
      fetchSupabaseDishes();
    }
  }, []);

  // Persist to local storage whenever dishes change
  const saveDishes = (newDishes: Dish[]) => {
    setDishes(newDishes);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newDishes));
    } catch {
      // ignore
    }
  };

  // Node counts calculation
  const nodeCounts = useMemo(() => {
    const counts: Record<string, number> = { All: dishes.length };
    dishes.forEach((dish) => {
      counts[dish.node] = (counts[dish.node] || 0) + 1;
    });
    return counts;
  }, [dishes]);

  // Filtering and Sorting pipeline
  const filteredDishes = useMemo(() => {
    let result = [...dishes];

    // Filter by Node
    if (filters.selectedNode !== 'All') {
      result = result.filter((dish) => dish.node === filters.selectedNode);
    }

    // Filter by Search Query (dish name, restaurant, category, or quote)
    if (filters.searchQuery.trim()) {
      const q = filters.searchQuery.toLowerCase().trim();
      result = result.filter(
        (dish) =>
          dish.name.toLowerCase().includes(q) ||
          dish.restaurantName.toLowerCase().includes(q) ||
          dish.category.toLowerCase().includes(q) ||
          dish.node.toLowerCase().includes(q) ||
          dish.sector.toLowerCase().includes(q) ||
          dish.highlightQuote.toLowerCase().includes(q)
      );
    }

    // Filter by Consensus
    if (filters.consensusFilter === 'must_order') {
      result = result.filter((dish) => dish.consensusPercentage >= 75);
    } else if (filters.consensusFilter === 'safe_to_skip') {
      result = result.filter((dish) => dish.consensusPercentage <= 40);
    }

    // Filter by Dietary
    if (filters.dietaryFilter === 'veg') {
      result = result.filter((dish) => dish.isVeg);
    } else if (filters.dietaryFilter === 'non_veg') {
      result = result.filter((dish) => !dish.isVeg);
    }

    // Sorting
    result.sort((a, b) => {
      switch (filters.sortBy) {
        case 'consensus_desc':
          return b.consensusPercentage - a.consensusPercentage;
        case 'votes_desc':
          return b.totalVotes - a.totalVotes;
        case 'price_asc':
          return a.priceInr - b.priceInr;
        case 'price_desc':
          return b.priceInr - a.priceInr;
        default:
          return 0;
      }
    });

    return result;
  }, [dishes, filters]);

  // Handle Quick-Vote
  const handleVote = (dishId: string, vote: ConsensusVote, quickNote?: string) => {
    const updated = dishes.map((dish) => {
      if (dish.id !== dishId) return dish;

      let mustOrderCount = dish.mustOrderCount;
      let skipCount = dish.skipCount;

      // Reverse previous vote if any
      if (dish.userVote === 'must_order') mustOrderCount = Math.max(0, mustOrderCount - 1);
      if (dish.userVote === 'safe_to_skip') skipCount = Math.max(0, skipCount - 1);

      // Apply new vote
      if (vote === 'must_order') mustOrderCount += 1;
      if (vote === 'safe_to_skip') skipCount += 1;

      const total = mustOrderCount + skipCount;
      const percentage = total > 0 ? Math.round((mustOrderCount / total) * 100) : 0;

      const newLog = quickNote
        ? [
            {
              id: `log-${Date.now()}`,
              dishId: dish.id,
              restaurantId: dish.restaurantId,
              userHandle: 'You (Local Foodie)',
              vote,
              note: quickNote,
              node: dish.node,
              createdAt: 'Just now',
            },
            ...(dish.recentLogs || []),
          ]
        : dish.recentLogs;

      return {
        ...dish,
        mustOrderCount,
        skipCount,
        totalVotes: total,
        consensusPercentage: percentage,
        userVote: vote,
        recentLogs: newLog,
      };
    });

    saveDishes(updated);

    // Update selected dish if open in modal
    if (selectedDish && selectedDish.id === dishId) {
      const fresh = updated.find((d) => d.id === dishId);
      if (fresh) setSelectedDish(fresh);
    }

    // Optional Supabase async sync
    if (isSupabaseConfigured && supabase) {
      const client = supabase;
      client.from('dining_logs').insert([
        {
          dish_id: dishId,
          restaurant_id: dishes.find((d) => d.id === dishId)?.restaurantId,
          vote,
          note: quickNote || null,
          node: dishes.find((d) => d.id === dishId)?.node,
          user_handle: 'Local Foodie',
        },
      ]);
    }
  };

  // Handle Add Dish from 3-Tap Modal
  const handleAddDish = (
    newDishData: Partial<Dish>,
    vote: ConsensusVote,
    note: string
  ) => {
    const dishId = `dish-${Date.now()}`;
    const restaurantId = `res-${Date.now()}`;

    const mustOrderCount = vote === 'must_order' ? 1 : 0;
    const skipCount = vote === 'safe_to_skip' ? 1 : 0;
    const consensusPercentage = vote === 'must_order' ? 100 : 0;

    const newDish: Dish = {
      id: dishId,
      restaurantId,
      restaurantName: newDishData.restaurantName || 'Popular Spot',
      name: newDishData.name || 'Unnamed Dish',
      category: newDishData.category || 'Main',
      isVeg: Boolean(newDishData.isVeg),
      priceInr: newDishData.priceInr || 200,
      photoUrl:
        newDishData.photoUrl ||
        'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=1000&q=80',
      mustOrderCount,
      skipCount,
      totalVotes: 1,
      consensusPercentage,
      highlightQuote:
        note ||
        (vote === 'must_order'
          ? 'Must Order: Unanimous thumbs up from verified locals.'
          : 'Safe to Skip: Did not live up to expectations.'),
      node: newDishData.node || 'Vashi',
      sector: newDishData.sector || 'Sector 17',
      userVote: vote,
      recentLogs: [
        {
          id: `log-${Date.now()}`,
          dishId,
          restaurantId,
          userHandle: 'You (Local Foodie)',
          vote,
          note: note || undefined,
          node: newDishData.node || 'Vashi',
          createdAt: 'Just now',
        },
      ],
    };

    const updated = [newDish, ...dishes];
    saveDishes(updated);

    // If Supabase is configured, also persist remotely
    if (isSupabaseConfigured && supabase) {
      const client = supabase;
      client.from('restaurants').insert([
        {
          name: newDish.restaurantName,
          node: newDish.node,
          sector: newDish.sector,
        },
      ]);
    }
  };

  const handleScrollToSearch = () => {
    const el = document.getElementById('dish-search-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1C1917] flex flex-col selection:bg-[#FEF3C7] selection:text-[#A16207]">
      {/* 1. Header Masthead */}
      <Header
        onOpenLogModal={() => setIsLogModalOpen(true)}
        onOpenMethodology={() => setIsMethodologyOpen(true)}
        selectedNode={filters.selectedNode}
        onSelectNode={(node) => setFilters((prev) => ({ ...prev, selectedNode: node }))}
        totalDishesCount={dishes.length}
      />

      <main className="flex-1">
        {/* 2. Warm Editorial Hero Section */}
        <HeroSection onScrollToSearch={handleScrollToSearch} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 3. Search Bar and Navi Mumbai Node Badges */}
          <SearchBarAndFilters
            filters={filters}
            onUpdateFilters={(updates) => setFilters((prev) => ({ ...prev, ...updates }))}
            nodeCounts={nodeCounts}
            totalResultsCount={filteredDishes.length}
          />

          {/* 4. Dish Consensus Grid */}
          {filteredDishes.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 pb-16">
              {filteredDishes.map((dish) => (
                <DishCard
                  key={dish.id}
                  dish={dish}
                  onVote={handleVote}
                  onSelectDish={(selected) => setSelectedDish(selected)}
                />
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="my-16 p-12 text-center bg-white rounded-3xl border border-[#E7E5E4] max-w-lg mx-auto shadow-sm space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#FEF3C7] text-[#A16207] flex items-center justify-center mx-auto">
                <UtensilsCrossed className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#1C1917]">
                No dishes match your filter
              </h3>
              <p className="text-xs text-[#78716C] leading-relaxed">
                We haven’t indexed a dish matching "{filters.searchQuery || filters.selectedNode}" yet. You can be the first to log it for Navi Mumbai!
              </p>
              <div className="pt-2 flex items-center justify-center space-x-3">
                <button
                  onClick={() =>
                    setFilters({
                      searchQuery: '',
                      selectedNode: 'All',
                      consensusFilter: 'all',
                      dietaryFilter: 'all',
                      sortBy: 'consensus_desc',
                    })
                  }
                  className="px-4 py-2 text-xs font-semibold rounded-xl border border-[#E7E5E4] text-[#44403C] hover:bg-[#FAF8F5]"
                >
                  Reset Filters
                </button>
                <button
                  onClick={() => setIsLogModalOpen(true)}
                  className="px-4 py-2 text-xs font-semibold rounded-xl bg-[#1C1917] text-white hover:bg-[#292524] flex items-center space-x-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Log This Dish</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* 5. Footer */}
      <Footer
        onSelectNode={(node) =>
          setFilters((prev) => ({ ...prev, selectedNode: node }))
        }
        onOpenLogModal={() => setIsLogModalOpen(true)}
      />

      {/* 6. Modals */}
      <LogDishModal
        isOpen={isLogModalOpen}
        onClose={() => setIsLogModalOpen(false)}
        onAddDish={handleAddDish}
        defaultNode={filters.selectedNode}
      />

      <DishDetailModal
        dish={selectedDish}
        onClose={() => setSelectedDish(null)}
        onVote={handleVote}
      />

      <MethodologyModal
        isOpen={isMethodologyOpen}
        onClose={() => setIsMethodologyOpen(false)}
      />
    </div>
  );
}
