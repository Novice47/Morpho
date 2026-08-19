import React, { useState } from 'react';
import { ArrowRight, Compass, FolderOpen, Heart, Eye } from 'lucide-react';
import { assets } from '../data/assets';
import GraphicComposer from '../components/ui/GraphicComposer';

// DYNAMIC ART COMPOSER FOR HERO CARD
function HeroArtworkComposer() {
  return (
    <div className="w-full h-full relative overflow-hidden flex items-center justify-center bg-gradient-to-br from-[#120a2a] via-[#090b15] to-[#041b1e]">
      <div className="absolute inset-0 bg-grid-pattern opacity-20" />
      
      {/* Glow Center Sphere */}
      <div className="absolute w-44 h-44 rounded-full bg-gradient-to-tr from-brand-violet via-brand-magenta to-brand-cyan opacity-35 blur-2xl animate-pulse" />
      
      {/* 3D Wireframe ring structures */}
      <div className="absolute w-64 h-64 border-2 border-brand-violet/40 rounded-full animate-spin-slow" style={{ transform: 'rotateX(60deg) rotateY(15deg)' }} />
      <div className="absolute w-56 h-56 border border-brand-cyan/30 rounded-full animate-spin-reverse" style={{ transform: 'rotateX(-45deg) rotateY(-20deg)' }} />
      
      {/* Floating solid card shapes */}
      <div className="absolute w-24 h-24 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md shadow-xl flex items-center justify-center animate-float-slow" style={{ transform: 'translateZ(50px)' }}>
        <span className="text-brand-cyan font-mono font-bold text-4xl select-none">M</span>
      </div>
      
      <div className="absolute bottom-10 right-10 p-3 rounded-xl border border-white/5 bg-black/40 backdrop-blur-md shadow-md text-[10px] font-mono text-zinc-400 animate-float-medium">
        <div className="text-zinc-500">FORMAT</div>
        <div className="text-white font-bold">3D VECTOR / GLB</div>
      </div>
    </div>
  );
}

// MAIN PAGE
export default function Home({ activeTab, setActiveTab, morphism, onSelectAsset }) {
  // Select 4 trending assets for the asymmetric grid
  const trendingAssets = assets.slice(0, 4);

  // 3D Tilt state for mouse movement on the hero card
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const card = e.currentTarget;
    const box = card.getBoundingClientRect();
    const x = e.clientX - box.left - (box.width / 2);
    const y = e.clientY - box.top - (box.height / 2);
    // Limit rotation to 12 degrees
    const factor = 12;
    setTilt({
      x: (y / (box.height / 2)) * factor,
      y: -(x / (box.width / 2)) * factor
    });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

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
    <div className="space-y-16 py-8">
      
      {/* HERO SECTION */}
      <section className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* TEXT LEFT */}
        <div className="lg:col-span-7 space-y-6 text-left reveal-on-scroll">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono border border-zinc-200 dark:border-zinc-800 bg-white/10 dark:bg-black/10 text-zinc-500 dark:text-zinc-400">
            <span className="w-2 h-2 rounded-full bg-brand-cyan animate-ping" />
            ASSET INFRASTRUCTURE v1.2
          </div>

          <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-none text-zinc-950 dark:text-zinc-50 font-sans uppercase">
            CREATE WITHOUT
            <span className="block mt-2 bg-gradient-to-r from-brand-violet via-brand-magenta to-brand-cyan bg-clip-text text-transparent">
              LIMITS.
            </span>
          </h1>

          <p className="text-zinc-500 dark:text-zinc-400 text-base md:text-lg max-w-lg leading-relaxed font-sans">
            Find premium digital graphics, 3D meshes, scalable patterns, and UI resources. Preview compatibility in real-time, collect assets, and accelerate your creative workflow.
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            <button
              onClick={() => setActiveTab('explore')}
              className={`flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-300 ${
                morphism === 'clay'
                  ? 'bg-brand-violet text-white shadow-clay-dark'
                  : morphism === 'neu'
                    ? 'morphism-neu text-brand-violet'
                    : 'bg-brand-violet hover:bg-brand-violet/90 text-white shadow-glow-violet/20 hover:scale-[1.02]'
              }`}
            >
              <Compass size={16} /> Explore Assets
            </button>
            <button
              onClick={() => {
                // We'll route to explore with "Free" price pre-selected
                setActiveTab('explore');
              }}
              className={`flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-300 ${
                morphism === 'clay'
                  ? 'bg-zinc-800 text-white shadow-clay-dark'
                  : morphism === 'neu'
                    ? 'morphism-neu text-zinc-400 hover:text-zinc-100'
                    : 'bg-zinc-900/50 hover:bg-zinc-900 border border-zinc-800 text-zinc-300'
              }`}
            >
              <FolderOpen size={16} /> Browse Free
            </button>
          </div>
        </div>

        {/* 3D TILT INTERACTIVE GRAPHIC (RIGHT) */}
        <div className="lg:col-span-5 flex items-center justify-center min-h-[380px] reveal-on-scroll">
          <div 
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className={`w-[320px] h-[380px] rounded-3xl overflow-hidden cursor-pointer shadow-2xl transition-all duration-200 relative`}
            style={{
              transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale3d(1.02, 1.02, 1.02)`,
              transformStyle: 'preserve-3d'
            }}
          >
            <HeroArtworkComposer />
          </div>
        </div>

      </section>

      {/* TRENDING NOW VISUAL GRID */}
      <section className="max-w-7xl mx-auto px-4 space-y-8">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-zinc-950 dark:text-zinc-50 font-sans">
            TRENDING NOW
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400 text-xs font-mono mt-1">
            Curated collections based on download activity and aesthetic fidelity.
          </p>
        </div>

        {/* ASYMMETRIC GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 animate-fade-in">
          {trendingAssets.map((asset, index) => {
            // Asymmetric widths: #1 and #4 take 7 cols, #2 and #3 take 5 cols
            const colsClass = index === 0 || index === 3 ? 'lg:col-span-7' : 'lg:col-span-5';
            const heightClass = index === 0 || index === 3 ? 'h-80' : 'h-72';

            return (
              <div
                key={asset.id}
                onClick={() => onSelectAsset(asset)}
                className={`${colsClass} ${getMorphismCard()} rounded-2xl overflow-hidden cursor-pointer flex flex-col group transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl`}
              >
                <div className={`w-full ${heightClass} relative overflow-hidden`}>
                  <GraphicComposer type={asset.shapeType} gradient={asset.gradient} />

                  {/* Hover Meta Overlay */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6 gap-3">
                    <div>
                      <span className="text-[9px] font-mono font-bold bg-white/10 text-brand-cyan border border-brand-cyan/20 px-2.5 py-1 rounded">
                        {asset.type}
                      </span>
                      <h3 className="text-white font-extrabold text-lg mt-2">{asset.title}</h3>
                    </div>
                    <div className="flex justify-between items-center text-xs font-mono text-zinc-300 pt-2 border-t border-white/10">
                      <span>Creator: @{asset.creator}</span>
                      <span className="text-brand-magenta font-extrabold">
                        {asset.isFree ? 'FREE' : `$${asset.price}`}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-4 flex justify-between items-center text-xs font-mono">
                  <div>
                    <h4 className="font-extrabold text-sm text-zinc-950 dark:text-zinc-50 leading-tight">
                      {asset.title}
                    </h4>
                    <span className="text-zinc-500">By: @{asset.creator}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-zinc-400">
                    <Heart size={14} />
                    <span>{asset.likes}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

    </div>
  );
}
