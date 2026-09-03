import React, { useState, useMemo } from 'react';
import { Search, Filter, Compass, Sparkles, Tag, DollarSign, MapPin, SlidersHorizontal } from 'lucide-react';
import { Site, Category, BudgetTier } from '../types';
import { SiteCard } from './SiteCard';

interface SiteExplorerProps {
  sites: Site[];
  currency: 'XAF' | 'USD';
  pinnedSiteIds: string[];
  onTogglePin: (siteId: string) => void;
  onSelectSite: (site: Site) => void;
  onAddToItinerary: (site: Site) => void;
}

export const SiteExplorer: React.FC<SiteExplorerProps> = ({
  sites,
  currency,
  pinnedSiteIds,
  onTogglePin,
  onSelectSite,
  onAddToItinerary
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedBudget, setSelectedBudget] = useState<string>('All');
  const [selectedQuarter, setSelectedQuarter] = useState<string>('All');
  const [selectedTag, setSelectedTag] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'rating' | 'time' | 'priceAsc' | 'priceDesc'>('rating');

  // Extract unique quarters
  const quarters = useMemo(() => {
    const qSet = new Set(sites.map((s) => s.quarter));
    return ['All', ...Array.from(qSet).sort()];
  }, [sites]);

  // Extract unique tags/interests
  const interestTags = ['All', 'culture', 'nature', 'history', 'art', 'cuisine', 'sacred', 'sports', 'academic', 'nightlife', 'monument'];

  // Categories list
  const categories = [
    'All',
    'Monuments',
    'Museums',
    'Nature & Parks',
    'Cuisine & Markets',
    'Culture & Heritage',
    'Sacred & Religion',
    'Nightlife & Entertainment',
    'Academic & Tech',
    'Architecture',
    'Sports & Leisure'
  ];

  // Filter and sort logic
  const filteredSites = useMemo(() => {
    return sites.filter((s) => {
      const matchesSearch = 
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.frenchName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.historicalContext.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.quarter.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = selectedCategory === 'All' || s.category === selectedCategory;
      const matchesBudget = selectedBudget === 'All' || s.budgetTier === selectedBudget;
      const matchesQuarter = selectedQuarter === 'All' || s.quarter === selectedQuarter;
      const matchesTag = selectedTag === 'All' || s.interests.includes(selectedTag);

      return matchesSearch && matchesCategory && matchesBudget && matchesQuarter && matchesTag;
    }).sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'time') return a.estimatedTimeMinutes - b.estimatedTimeMinutes;
      if (sortBy === 'priceAsc') return a.priceEstimateXAF - b.priceEstimateXAF;
      if (sortBy === 'priceDesc') return b.priceEstimateXAF - a.priceEstimateXAF;
      return 0;
    });
  }, [sites, searchQuery, selectedCategory, selectedBudget, selectedQuarter, selectedTag, sortBy]);

  return (
    <div className="space-y-4">
      {/* Hero Welcome Banner */}
      <div className="relative rounded-2xl overflow-hidden bg-white p-5 md:p-6 border border-slate-200 shadow-xs">
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-200">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>50+ Verified Sites & Historical Backstories in Yaoundé</span>
          </div>

          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Discover the Seven Hills of <span className="text-blue-600">Yaoundé</span>
          </h1>

          <p className="text-xs md:text-sm text-slate-600 leading-relaxed">
            Explore authentic historical monuments, lush nature reserves, vibrant markets, street cuisine, and cultural heritage across Cameroon’s capital city.
          </p>
        </div>
      </div>

      {/* Main Search & Control Bar */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-2.5">
          {/* Main Search Input */}
          <div className="md:col-span-6 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by site name, quarter (e.g. Bastos, Messassi), or history..."
              className="w-full bg-slate-50 text-slate-900 placeholder-slate-400 text-xs rounded-lg pl-9 pr-3 py-2 border border-slate-200 focus:outline-none focus:border-blue-600 focus:bg-white transition-colors"
            />
          </div>

          {/* Budget Filter */}
          <div className="md:col-span-3">
            <select
              value={selectedBudget}
              onChange={(e) => setSelectedBudget(e.target.value)}
              className="w-full bg-slate-50 text-slate-800 text-xs rounded-lg px-2.5 py-2 border border-slate-200 focus:outline-none focus:border-blue-600"
            >
              <option value="All">All Budgets (FCFA / $)</option>
              <option value="Budget-friendly">🌱 Budget-friendly</option>
              <option value="Moderate">⭐ Moderate</option>
              <option value="Luxury">💎 Luxury</option>
            </select>
          </div>

          {/* Quarter Filter */}
          <div className="md:col-span-3">
            <select
              value={selectedQuarter}
              onChange={(e) => setSelectedQuarter(e.target.value)}
              className="w-full bg-slate-50 text-slate-800 text-xs rounded-lg px-2.5 py-2 border border-slate-200 focus:outline-none focus:border-blue-600"
            >
              <option value="All">All Quarters ({quarters.length - 1})</option>
              {quarters.filter((q) => q !== 'All').map((q) => (
                <option key={q} value={q}>📍 {q}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Category Horizontal Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          <span className="text-xs font-semibold text-slate-500 shrink-0 mr-1 flex items-center gap-1">
            <SlidersHorizontal className="w-3.5 h-3.5" /> Category:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Interest Theme Tags */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
            <span className="text-slate-500 font-medium shrink-0 text-[11px]">Themes:</span>
            {interestTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`px-2 py-0.5 rounded text-[11px] capitalize transition-colors ${
                  selectedTag === tag
                    ? 'bg-amber-500 text-white font-bold'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                }`}
              >
                #{tag}
              </button>
            ))}
          </div>

          {/* Sort By Dropdown */}
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-slate-500 font-medium text-[11px]">Sort:</span>
            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="bg-slate-50 text-slate-800 text-[11px] font-medium rounded-md px-2 py-1 border border-slate-200 focus:outline-none"
            >
              <option value="rating">Highest Rating</option>
              <option value="time">Travel Time (Fastest)</option>
              <option value="priceAsc">Price (Lowest)</option>
              <option value="priceDesc">Price (Highest)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Count Bar */}
      <div className="flex items-center justify-between text-xs text-slate-600 px-1 font-medium">
        <span>Showing <strong className="text-slate-900">{filteredSites.length}</strong> sites found in Yaoundé</span>
        {pinnedSiteIds.length > 0 && (
          <span className="text-amber-700 font-bold">
            📌 {pinnedSiteIds.length} location{pinnedSiteIds.length > 1 ? 's' : ''} pinned to map
          </span>
        )}
      </div>

      {/* Sites Grid */}
      {filteredSites.length === 0 ? (
        <div className="p-10 text-center bg-white rounded-2xl border border-slate-200 text-slate-600 space-y-3 shadow-xs">
          <Compass className="w-8 h-8 text-slate-400 mx-auto animate-spin" />
          <h3 className="text-base font-bold text-slate-800">No matching sites found</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Try adjusting your search criteria or resetting filters to explore all 52 sites in Yaoundé.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
              setSelectedBudget('All');
              setSelectedQuarter('All');
              setSelectedTag('All');
            }}
            className="px-3.5 py-1.5 rounded-lg bg-blue-600 text-white font-bold text-xs shadow-xs"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSites.map((site) => (
            <SiteCard
              key={site.id}
              site={site}
              currency={currency}
              isPinned={pinnedSiteIds.includes(site.id)}
              onTogglePin={onTogglePin}
              onSelectSite={onSelectSite}
              onAddToItinerary={onAddToItinerary}
            />
          ))}
        </div>
      )}
    </div>
  );
};
