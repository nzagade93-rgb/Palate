'use client';

import React from 'react';
import { Search, X, SlidersHorizontal, MapPin, Check, ArrowUpDown } from 'lucide-react';
import { NaviMumbaiNode, FilterState } from '@/types';
import { NAVI_MUMBAI_NODES } from '@/lib/mockData';

interface SearchBarAndFiltersProps {
  filters: FilterState;
  onUpdateFilters: (updates: Partial<FilterState>) => void;
  nodeCounts: Record<string, number>;
  totalResultsCount: number;
}

const POPULAR_DISH_TAGS = [
  'Pav Bhaji',
  'Kerala Beef Fry',
  'Misal Pav',
  'Surmai Neer Dosa',
  'Sev Tameta',
  'Chicken Sizzler',
  'Mysore Masala Dosa',
  'Batata Vada Pav',
  'Biryani',
];

export const SearchBarAndFilters: React.FC<SearchBarAndFiltersProps> = ({
  filters,
  onUpdateFilters,
  nodeCounts,
  totalResultsCount,
}) => {
  return (
    <div id="dish-search-section" className="py-8 space-y-6">
      {/* 1. Dish-First Search Bar */}
      <div className="relative">
        <div className="relative flex items-center">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#78716C]">
            <Search className="w-5 h-5" />
          </div>

          <input
            id="dish-search-input"
            type="text"
            value={filters.searchQuery}
            onChange={(e) => onUpdateFilters({ searchQuery: e.target.value })}
            placeholder="Search specific dishes: Pav Bhaji, Beef Fry, Misal, Surmai, Biryani, Dosa..."
            className="w-full pl-12 pr-10 py-4 rounded-2xl bg-white border border-[#E7E5E4] text-[#1C1917] placeholder:text-[#A8A29E] text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-[#A16207]/20 focus:border-[#A16207] transition-all"
          />

          {filters.searchQuery && (
            <button
              onClick={() => onUpdateFilters({ searchQuery: '' })}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-[#78716C] hover:text-[#1C1917]"
              title="Clear search"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Quick Suggestion Pills */}
        <div className="flex items-center space-x-2 mt-3 overflow-x-auto pb-1 scrollbar-none text-xs text-[#78716C]">
          <span className="shrink-0 font-medium text-[#A8A29E] uppercase tracking-wider text-[10px]">
            Trending Bites:
          </span>
          {POPULAR_DISH_TAGS.map((tag) => (
            <button
              key={tag}
              onClick={() =>
                onUpdateFilters({
                  searchQuery: filters.searchQuery === tag ? '' : tag,
                })
              }
              className={`shrink-0 px-2.5 py-1 rounded-full text-xs transition-all border ${
                filters.searchQuery === tag
                  ? 'bg-[#1C1917] text-white border-[#1C1917]'
                  : 'bg-white hover:bg-[#FAF8F5] text-[#44403C] border-[#E7E5E4]'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Navi Mumbai Node Filter Buttons */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center space-x-1.5 text-[#1C1917] font-semibold tracking-wide uppercase text-[11px]">
            <MapPin className="w-3.5 h-3.5 text-[#A16207]" />
            <span>Select Navi Mumbai Node</span>
          </div>
          <span className="text-[#78716C]">
            Showing <strong className="text-[#1C1917]">{totalResultsCount}</strong> dishes
          </span>
        </div>

        <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
          {/* All Nodes Pill */}
          <button
            id="node-filter-all"
            onClick={() => onUpdateFilters({ selectedNode: 'All' })}
            className={`shrink-0 px-4 py-2.5 rounded-xl font-medium text-xs tracking-wide transition-all border flex items-center space-x-2 ${
              filters.selectedNode === 'All'
                ? 'bg-[#1C1917] text-white border-[#1C1917] shadow-sm'
                : 'bg-white text-[#44403C] border-[#E7E5E4] hover:border-[#D6D3D1] hover:bg-stone-50'
            }`}
          >
            <span>All Nodes</span>
            <span
              className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono ${
                filters.selectedNode === 'All'
                  ? 'bg-white/20 text-white'
                  : 'bg-[#FAF8F5] text-[#78716C] border border-[#E7E5E4]'
              }`}
            >
              {nodeCounts['All'] || 0}
            </span>
          </button>

          {/* Individual Municipal Nodes */}
          {NAVI_MUMBAI_NODES.map((node) => {
            const isSelected = filters.selectedNode === node;
            const count = nodeCounts[node] || 0;

            return (
              <button
                key={node}
                id={`node-filter-${node.toLowerCase()}`}
                onClick={() => onUpdateFilters({ selectedNode: node })}
                className={`shrink-0 px-4 py-2.5 rounded-xl font-medium text-xs tracking-wide transition-all border flex items-center space-x-2 ${
                  isSelected
                    ? 'bg-[#A16207] text-white border-[#A16207] shadow-sm ring-2 ring-[#A16207]/20'
                    : 'bg-white text-[#44403C] border-[#E7E5E4] hover:border-[#D6D3D1] hover:bg-stone-50'
                }`}
              >
                <span>{node}</span>
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono ${
                    isSelected
                      ? 'bg-white/20 text-white'
                      : 'bg-[#FAF8F5] text-[#78716C] border border-[#E7E5E4]'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Secondary Filter Bar: Consensus, Dietary, Sorting */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#E7E5E4]/80 text-xs">
        {/* Consensus Filter Pills */}
        <div className="flex items-center space-x-1.5">
          <span className="text-[#A8A29E] text-[11px] uppercase font-semibold mr-1">
            Verdict:
          </span>
          <button
            onClick={() => onUpdateFilters({ consensusFilter: 'all' })}
            className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
              filters.consensusFilter === 'all'
                ? 'bg-[#1C1917] text-white border-[#1C1917]'
                : 'bg-white text-[#78716C] border-[#E7E5E4] hover:text-[#1C1917]'
            }`}
          >
            All Verdicts
          </button>
          <button
            onClick={() => onUpdateFilters({ consensusFilter: 'must_order' })}
            className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-all flex items-center space-x-1.5 ${
              filters.consensusFilter === 'must_order'
                ? 'bg-[#15803D] text-white border-[#15803D]'
                : 'bg-white text-[#15803D] border-[#BBF7D0] hover:bg-[#F0FDF4]'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#15803D]" />
            <span>Must Order (&ge;75%)</span>
          </button>
          <button
            onClick={() => onUpdateFilters({ consensusFilter: 'safe_to_skip' })}
            className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-all flex items-center space-x-1.5 ${
              filters.consensusFilter === 'safe_to_skip'
                ? 'bg-[#B91C1C] text-white border-[#B91C1C]'
                : 'bg-white text-[#B91C1C] border-[#FECACA] hover:bg-[#FEF2F2]'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#B91C1C]" />
            <span>Safe to Skip (&le;40%)</span>
          </button>
        </div>

        {/* Dietary & Sorting Controls */}
        <div className="flex items-center space-x-2">
          {/* Dietary Toggle */}
          <div className="inline-flex p-0.5 rounded-lg bg-white border border-[#E7E5E4]">
            <button
              onClick={() => onUpdateFilters({ dietaryFilter: 'all' })}
              className={`px-2.5 py-1 text-xs rounded-md transition-all ${
                filters.dietaryFilter === 'all'
                  ? 'bg-[#FAF8F5] text-[#1C1917] font-semibold border border-[#E7E5E4]'
                  : 'text-[#78716C] hover:text-[#1C1917]'
              }`}
            >
              All
            </button>
            <button
              onClick={() => onUpdateFilters({ dietaryFilter: 'veg' })}
              className={`px-2.5 py-1 text-xs rounded-md transition-all flex items-center space-x-1 ${
                filters.dietaryFilter === 'veg'
                  ? 'bg-[#F0FDF4] text-[#15803D] font-semibold border border-[#BBF7D0]'
                  : 'text-[#78716C] hover:text-[#1C1917]'
              }`}
            >
              <span className="w-2 h-2 rounded-sm border border-[#15803D] p-0.5 flex items-center justify-center">
                <span className="w-1 h-1 rounded-full bg-[#15803D]" />
              </span>
              <span>Veg</span>
            </button>
            <button
              onClick={() => onUpdateFilters({ dietaryFilter: 'non_veg' })}
              className={`px-2.5 py-1 text-xs rounded-md transition-all flex items-center space-x-1 ${
                filters.dietaryFilter === 'non_veg'
                  ? 'bg-[#FFFBEB] text-[#B45309] font-semibold border border-[#FDE68A]'
                  : 'text-[#78716C] hover:text-[#1C1917]'
              }`}
            >
              <span className="w-2 h-2 rounded-sm border border-[#B45309] p-0.5 flex items-center justify-center">
                <span className="w-1 h-1 rounded-full bg-[#B45309]" />
              </span>
              <span>Non-Veg</span>
            </button>
          </div>

          {/* Sort Selector */}
          <div className="relative">
            <select
              value={filters.sortBy}
              onChange={(e) =>
                onUpdateFilters({
                  sortBy: e.target.value as FilterState['sortBy'],
                })
              }
              className="appearance-none bg-white border border-[#E7E5E4] rounded-lg px-3 py-1.5 pr-8 text-xs font-medium text-[#1C1917] focus:outline-none focus:border-[#A16207]"
            >
              <option value="consensus_desc">Highest Consensus %</option>
              <option value="votes_desc">Most Votes</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
            <ArrowUpDown className="w-3.5 h-3.5 text-[#78716C] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>
    </div>
  );
};
