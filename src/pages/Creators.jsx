import React, { useState } from 'react';
import { ArrowLeft, Users, Folder, Download, Star, CheckCircle, ExternalLink } from 'lucide-react';
import GraphicComposer from '../components/ui/GraphicComposer';

// CREATOR PROFILE COMPONENT WRAPPER
function CreatorProfile({ creatorId, onBack, morphism, onSelectAsset, localAssets = [], localCreators = [] }) {
  const creator = localCreators.find(c => c.id === creatorId);
  const [profileTab, setProfileTab] = useState('all'); // all, free, premium

  if (!creator) return null;

  // Filter assets owned by this specific creator
  const creatorAssets = localAssets.filter(asset => {
    if (asset.creator !== creator.username) return false;
    if (profileTab === 'free') return asset.isFree;
    if (profileTab === 'premium') return !asset.isFree;
    return true;
  });

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



  return (
    <div className="space-y-8 max-w-7xl mx-auto px-6 py-8">
      {/* BACK NAVIGATION */}
      <div className="reveal-on-scroll">
        <button
          onClick={onBack}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
            morphism === 'clay' ? 'bg-zinc-800 text-white shadow-clay-dark' : morphism === 'neu' ? 'morphism-neu text-zinc-400' : 'bg-zinc-900/50 border border-zinc-800 text-zinc-300 hover:bg-zinc-900'
          }`}
        >
          <ArrowLeft size={14} /> Back to creators
        </button>
      </div>

      {/* CREATOR PROFILE STATS JUMBOTRON */}
      <div className={`p-6 rounded-3xl relative overflow-hidden flex flex-col md:flex-row justify-between gap-6 reveal-on-scroll ${getMorphismCard()}`}>
        
        {/* Banner decorations */}
        <div className="absolute inset-0 bg-grid-pattern opacity-10 -z-10" />
        <div className="absolute w-[200px] h-[200px] rounded-full bg-brand-violet/10 blur-xl top-0 right-0 -z-10" />

        <div className="flex items-center gap-4 flex-1">
          {/* Avatar */}
          <div className={`w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-tr ${creator.avatarColor} flex items-center justify-center text-white font-extrabold text-2xl md:text-3xl shrink-0 shadow-md`}>
            {creator.displayName[0]}
          </div>

          <div className="space-y-1 text-left min-w-0">
            <div className="flex items-center gap-1.5">
              <h3 className="text-xl md:text-2xl font-black text-zinc-950 dark:text-zinc-50 font-sans leading-tight">
                {creator.displayName}
              </h3>
              <CheckCircle size={16} className="text-brand-cyan shrink-0" />
            </div>
            <div className="text-xs font-mono text-zinc-500">@{creator.username}</div>
            <div className="text-xs font-semibold text-brand-violet">{creator.specialty}</div>
            <p className="text-zinc-500 dark:text-zinc-400 text-xs max-w-md leading-relaxed pt-1">
              {creator.bio}
            </p>
          </div>
        </div>

        {/* METRIC BADGES */}
        <div className="grid grid-cols-3 md:flex md:flex-col justify-center gap-4 border-t md:border-t-0 md:border-l border-zinc-200 dark:border-zinc-800/80 pt-4 md:pt-0 md:pl-6 text-xs font-mono shrink-0">
          <div>
            <div className="text-zinc-500">FOLLOWERS</div>
            <div className="text-zinc-800 dark:text-zinc-200 font-extrabold text-sm flex items-center gap-1 mt-0.5">
              <Users size={14} className="text-brand-cyan" />
              {new Intl.NumberFormat().format(creator.followers)}
            </div>
          </div>
          <div>
            <div className="text-zinc-500">DOWNLOADS</div>
            <div className="text-zinc-800 dark:text-zinc-200 font-extrabold text-sm flex items-center gap-1 mt-0.5">
              <Download size={14} className="text-brand-magenta" />
              {new Intl.NumberFormat().format(creator.downloads)}
            </div>
          </div>
          <div>
            <div className="text-zinc-500">ASSETS</div>
            <div className="text-zinc-800 dark:text-zinc-200 font-extrabold text-sm flex items-center gap-1 mt-0.5">
              <Folder size={14} className="text-brand-violet" />
              {creator.assetCount} Items
            </div>
          </div>
        </div>

      </div>

      {/* FILTER TABS FOR CREATOR ASSETS */}
      <div className="flex border-b border-zinc-200 dark:border-zinc-800/80 reveal-on-scroll">
        {[
          { id: 'all', label: 'All Portfolio' },
          { id: 'free', label: 'Free Vectors' },
          { id: 'premium', label: 'Premium meshing' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setProfileTab(tab.id)}
            className={`px-4 py-2 text-xs font-bold transition-all border-b-2 -mb-px ${
              profileTab === tab.id
                ? 'border-brand-cyan text-brand-cyan'
                : 'border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* PORTFOLIO GRID */}
      {creatorAssets.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 animate-fade-in">
          {creatorAssets.map((asset) => (
            <div
              key={asset.id}
              onClick={() => onSelectAsset(asset)}
              className={`${getMorphismCard()} rounded-2xl overflow-hidden cursor-pointer flex flex-col group transition-all duration-300 hover:-translate-y-1 hover:shadow-xl`}
            >
              <div className="w-full h-44 relative bg-black/20">
                <GraphicComposer type={asset.shapeType} gradient={asset.gradient} size="sm" />
                
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
                  <span className="text-[9px] text-zinc-500 bg-zinc-200 dark:bg-zinc-800 px-2 py-0.5 rounded">
                    {asset.category}
                  </span>
                  <span className="text-brand-magenta font-bold">
                    {asset.isFree ? 'FREE' : `$${asset.price}`}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-zinc-500 font-mono text-xs reveal-on-scroll">
          This creator hasn't published any assets under this category yet.
        </div>
      )}

    </div>
  );
}

// PRIMARY COMPONENT ROUTER
export default function Creators({ morphism, onSelectAsset, localAssets = [], localCreators = [] }) {
  const [selectedCreatorId, setSelectedCreatorId] = useState(null);

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

  if (selectedCreatorId) {
    return (
      <CreatorProfile
        creatorId={selectedCreatorId}
        onBack={() => setSelectedCreatorId(null)}
        morphism={morphism}
        onSelectAsset={onSelectAsset}
        localAssets={localAssets}
        localCreators={localCreators}
      />
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-6 py-8">
      
      {/* HEADER */}
      <div className="flex justify-between items-end reveal-on-scroll">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-zinc-950 dark:text-zinc-50 font-sans">
            Creators Directory
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400 text-xs font-mono mt-1">
            Discover and collaborate with the world's leading generative and spatial design artists.
          </p>
        </div>
      </div>

      {/* CREATORS LIST GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
        {localCreators.map((creator) => (
          <div
            key={creator.id}
            onClick={() => setSelectedCreatorId(creator.id)}
            className={`p-5 rounded-2xl cursor-pointer transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl flex flex-col justify-between h-full ${getMorphismCard()}`}
          >
            <div className="flex items-start gap-4">
              {/* Avatar */}
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${creator.avatarColor} flex items-center justify-center text-white font-extrabold text-xl shadow-inner shrink-0`}>
                {creator.displayName[0]}
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-1">
                  <h4 className="font-extrabold text-sm text-zinc-950 dark:text-zinc-50 leading-tight truncate">
                    {creator.displayName}
                  </h4>
                  <CheckCircle size={12} className="text-brand-cyan shrink-0" />
                </div>
                <div className="text-[10px] text-zinc-500 font-mono">@{creator.username}</div>
                <div className="text-[10px] font-semibold text-brand-violet mt-1 truncate">{creator.specialty}</div>
              </div>
            </div>

            {/* Micro details panel */}
            <div className="grid grid-cols-3 border-t border-zinc-200/50 dark:border-zinc-800/40 pt-3 mt-4 text-[10px] font-mono text-zinc-500">
              <div>
                <div>FOLLOWERS</div>
                <div className="font-bold text-zinc-800 dark:text-zinc-200 mt-0.5">
                  {new Intl.NumberFormat().format(creator.followers)}
                </div>
              </div>
              <div>
                <div>DOWNLOADS</div>
                <div className="font-bold text-zinc-800 dark:text-zinc-200 mt-0.5">
                  {new Intl.NumberFormat().format(creator.downloads)}
                </div>
              </div>
              <div>
                <div>ASSETS</div>
                <div className="font-bold text-zinc-800 dark:text-zinc-200 mt-0.5">
                  {creator.assetCount}
                </div>
              </div>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}
