import React, { useState, useEffect, useMemo } from 'react';
import { Search, SlidersHorizontal, ArrowUpDown, Heart, Check, HelpCircle, Loader2 } from 'lucide-react';
import { categories } from '../data/categories';
import GraphicComposer from '../components/ui/GraphicComposer';
import { api } from '../utils/api';

export default function Explore({ morphism, searchQuery, setSearchQuery, onSelectAsset }) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showFilters, setShowFilters] = useState(false);
  
  // Advanced filter states
  const [priceFilter, setPriceFilter] = useState('All'); // All, Free, Premium
  const [formatFilter, setFormatFilter] = useState('All'); // All, SVG, GLB, PNG, JPG
  const [licenseFilter, setLicenseFilter] = useState('All'); // All, Personal, Commercial, Extended
  const [sortOption, setSortOption] = useState('Trending'); // Trending, LowHigh, HighLow, Downloads, Likes

  const [filteredAssets, setFilteredAssets] = useState([]);
  const [totalAssetCount, setTotalAssetCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const getMorphismCard = () => {
    switch (morphism) {
      case 'glass':
        return 'morphism-glass border border-white/10';
      case 'neu':
        return 'morphism-neu shadow-md';
      case 'clay':
        return 'morphism-clay rounded-2xl shadow-lg';
      default:
        return '';
    }
  };

  const getMorphismInput = () => {
    switch (morphism) {
      case 'glass':
        return 'morphism-glass-input';
      case 'neu':
        return 'morphism-neu-input';
      case 'clay':
        return 'morphism-clay-input';
      default:
        return '';
    }
  };

  // Fetch filtered assets from backend API
  useEffect(() => {
    let active = true;
    const fetchAssets = async () => {
      setLoading(true);
      try {
        const data = await api.getAssets({
          search: searchQuery,
          category: selectedCategory,
          priceFilter,
          formatFilter,
          licenseFilter,
          sortOption
        });
        if (active) {
          setFilteredAssets(data);
          setTotalAssetCount(data.length);
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchAssets();
    return () => {
      active = false;
    };
  }, [searchQuery, selectedCategory, priceFilter, formatFilter, licenseFilter, sortOption]);



  return (
    <div className="space-y-8 max-w-7xl mx-auto px-6 py-8">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 reveal-on-scroll">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-zinc-950 dark:text-zinc-50 font-sans">
            Explore Assets
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400 text-xs font-mono mt-1">
            Browse and filter through high-fidelity digital vectors, 3D meshes, and mock templates.
          </p>
        </div>
        <span className="text-xs font-mono text-zinc-400">
          Showing {filteredAssets.length} assets
        </span>
      </div>

      {/* FILTER BUTTONS & SORT ROW */}
      <div className="flex flex-wrap items-center justify-between gap-4 reveal-on-scroll">
        
        {/* TEXT SEARCH INPUT */}
        <div className="relative flex-1 max-w-sm">
          <input
            type="text"
            placeholder="Search graphics, styles, creators..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-4 pr-4 py-2 text-xs rounded-xl focus:outline-none ${getMorphismInput()}`}
          />
        </div>

        <div className="flex items-center gap-2">
          {/* ADVANCED FILTER TOGGLE */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              showFilters
                ? 'bg-brand-cyan/20 border-brand-cyan text-brand-cyan'
                : morphism === 'clay' ? 'bg-zinc-800 text-white shadow-clay-dark' : morphism === 'neu' ? 'morphism-neu text-zinc-400' : 'bg-zinc-900/50 border border-zinc-800 text-zinc-300'
            }`}
          >
            <SlidersHorizontal size={14} /> Filters
          </button>

          {/* SORTING SELECTOR */}
          <div className="relative flex items-center">
            <ArrowUpDown size={14} className="absolute left-3 text-zinc-400" />
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className={`pl-9 pr-6 py-2.5 text-xs rounded-xl focus:outline-none appearance-none cursor-pointer ${
                morphism === 'glass' ? 'morphism-glass border border-white/10' : morphism === 'neu' ? 'morphism-neu' : 'morphism-clay'
              } text-zinc-700 dark:text-zinc-300 font-bold`}
            >
              <option value="Trending">Trending Now</option>
              <option value="Downloads">Most Downloaded</option>
              <option value="Likes">Most Liked</option>
              <option value="LowHigh">Price: Low to High</option>
              <option value="HighLow">Price: High to Low</option>
            </select>
          </div>
        </div>

      </div>

      {/* HORIZONTAL CATEGORY SCROLLER */}
      <div className="overflow-x-auto pb-2 scrollbar-none reveal-on-scroll">
        <div className="flex gap-2 min-w-max">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedCategory === cat
                  ? morphism === 'clay'
                    ? 'bg-brand-violet text-white shadow-clay-dark'
                    : morphism === 'neu'
                      ? 'morphism-neu-inset text-brand-violet font-extrabold'
                      : 'bg-white/15 dark:bg-white/10 text-brand-cyan border border-brand-cyan/30'
                  : morphism === 'neu'
                    ? 'morphism-neu text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300'
                    : 'bg-black/5 dark:bg-white/5 border border-zinc-200 dark:border-zinc-800 hover:bg-white/10 text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* DYNAMIC FILTER EXTENSION PANEL */}
      {showFilters && (
        <div className={`p-5 rounded-2xl grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in reveal-on-scroll ${getMorphismCard()}`}>
          {/* Price Category */}
          <div className="space-y-2">
            <span className="text-[10px] text-zinc-500 font-mono tracking-wider block">PRICE TYPE</span>
            <div className="flex gap-2 text-xs font-bold">
              {['All', 'Free', 'Premium'].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setPriceFilter(val)}
                  className={`flex-1 py-2 rounded-xl border transition-all ${
                    priceFilter === val ? 'bg-brand-cyan/20 border-brand-cyan text-brand-cyan' : 'border-zinc-200 dark:border-zinc-800 text-zinc-500'
                  }`}
                >
                  {val}
                </button>
              ))}
            </div>
          </div>

          {/* Format Selection */}
          <div className="space-y-2">
            <span className="text-[10px] text-zinc-500 font-mono tracking-wider block">FORMAT TYPE</span>
            <div className="flex gap-1.5 text-[10px] font-bold">
              {['All', 'SVG', 'GLB', 'PNG', 'JPG'].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setFormatFilter(val)}
                  className={`flex-1 py-2 rounded-xl border transition-all ${
                    formatFilter === val ? 'bg-brand-violet/20 border-brand-violet text-brand-violet' : 'border-zinc-200 dark:border-zinc-800 text-zinc-500'
                  }`}
                >
                  {val}
                </button>
              ))}
            </div>
          </div>

          {/* License filters */}
          <div className="space-y-2">
            <span className="text-[10px] text-zinc-500 font-mono tracking-wider block">LICENSE TIER</span>
            <div className="flex gap-1.5 text-[10px] font-bold">
              {['All', 'Personal', 'Commercial', 'Extended'].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setLicenseFilter(val)}
                  className={`flex-1 py-2 rounded-xl border transition-all ${
                    licenseFilter === val ? 'bg-brand-magenta/20 border-brand-magenta text-brand-magenta' : 'border-zinc-200 dark:border-zinc-800 text-zinc-500'
                  }`}
                >
                  {val}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* FILTERED ASSETS GRID */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3 font-mono text-zinc-500">
          <Loader2 className="animate-spin text-brand-cyan" size={32} />
          <span className="text-xs">Querying database...</span>
        </div>
      ) : filteredAssets.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fade-in">
          {filteredAssets.map((asset) => (
            <div
              key={asset.id}
              onClick={() => onSelectAsset(asset)}
              className={`${getMorphismCard()} rounded-2xl overflow-hidden cursor-pointer flex flex-col group transition-all duration-300 hover:-translate-y-1 hover:shadow-xl`}
            >
              <div className="w-full h-48 relative overflow-hidden bg-black/20">
                <GraphicComposer type={asset.shapeType} gradient={asset.gradient} />
                
                {/* Price indicators overlay */}
                <div className="absolute top-3 right-3 text-[9px] font-mono font-bold bg-black/50 backdrop-blur-md text-zinc-300 border border-white/10 px-2 py-0.5 rounded">
                  {asset.format}
                </div>
              </div>

              <div className="p-4 flex flex-col justify-between flex-1">
                <div>
                  <h4 className="font-extrabold text-sm text-zinc-950 dark:text-zinc-50 leading-tight">
                    {asset.title}
                  </h4>
                  <span className="text-[10px] text-zinc-500 font-mono">By: @{asset.creator}</span>
                </div>
                
                <div className="flex justify-between items-center text-xs font-mono pt-3 border-t border-zinc-200/50 dark:border-zinc-800/40 mt-3">
                  <span className="text-[10px] text-zinc-500 font-bold bg-zinc-200 dark:bg-zinc-800 px-2 py-0.5 rounded uppercase">
                    {asset.category}
                  </span>
                  <span className="text-brand-magenta font-extrabold">
                    {asset.isFree ? 'FREE' : `$${asset.price}`}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-zinc-500 font-mono text-xs reveal-on-scroll">
          No assets match your search parameters. Try adjusting your query or filters.
        </div>
      )}

    </div>
  );
}
