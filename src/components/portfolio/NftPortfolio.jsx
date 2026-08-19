import React, { useState, useEffect, useRef } from 'react';
import { Shield, Sparkles, X, ShoppingCart, User, Check, RefreshCw, Key, HelpCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { nftCreatives } from '../../data/nftCreatives';
import { formatAddress, formatNumber } from '../../utils/formatters';

// GENERATIVE CSS SHAPE COMPOSER FOR NFT ILLUSTRATIONS
function NftArtworkComposer({ type, gradient }) {
  return (
    <div 
      className="w-full h-full rounded-xl relative overflow-hidden flex items-center justify-center border border-white/5"
      style={{ background: gradient }}
    >
      <div className="absolute inset-0 bg-grid-pattern opacity-10" />
      
      {type === 'torus' && (
        <div className="relative w-36 h-36 flex items-center justify-center animate-spin-slow">
          <div className="absolute w-28 h-28 border-[6px] border-brand-violet/40 rounded-full" />
          <div className="absolute w-24 h-24 border-[6px] border-brand-cyan/60 rounded-full" style={{ transform: 'rotateX(50deg)' }} />
          <div className="absolute w-20 h-20 border-[6px] border-brand-magenta/80 rounded-full" style={{ transform: 'rotateY(50deg)' }} />
        </div>
      )}

      {type === 'cubes' && (
        <div className="relative w-40 h-40 flex items-center justify-center" style={{ perspective: '600px' }}>
          <div className="absolute w-16 h-16 bg-brand-cyan/20 border-2 border-brand-cyan animate-float-slow" 
               style={{ transform: 'rotateX(30deg) rotateY(30deg) translateZ(20px)' }} />
          <div className="absolute w-12 h-12 bg-brand-violet/20 border-2 border-brand-violet animate-float-medium" 
               style={{ transform: 'rotateX(10deg) rotateY(40deg) translateZ(-40px)' }} />
          <div className="absolute w-10 h-10 bg-brand-magenta/30 border-2 border-brand-magenta animate-spin-slow" 
               style={{ transform: 'rotateX(-20deg) rotateY(-20deg) translateZ(50px)' }} />
        </div>
      )}

      {type === 'waves' && (
        <div className="w-full h-full flex flex-col justify-end gap-3 p-4">
          <div className="w-3/4 h-2.5 bg-gradient-to-r from-brand-magenta to-transparent rounded-full animate-pulse" />
          <div className="w-5/6 h-2.5 bg-gradient-to-r from-brand-violet via-brand-magenta to-transparent rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
          <div className="w-2/3 h-2.5 bg-gradient-to-r from-brand-cyan to-transparent rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
        </div>
      )}

      {type === 'grid' && (
        <div className="absolute inset-0 flex flex-col justify-between p-6">
          <div className="flex justify-between w-full">
            <span className="w-3 h-3 rounded bg-brand-violet animate-ping" />
            <span className="w-2 h-2 rounded bg-brand-cyan" />
          </div>
          <div className="flex justify-center w-full">
            <div className="w-20 h-20 border border-brand-cyan/50 rounded-full animate-spin-slow flex items-center justify-center">
              <div className="w-14 h-14 border border-brand-violet/40 rounded-full flex items-center justify-center">
                <div className="w-8 h-8 bg-brand-magenta/30 rounded-full" />
              </div>
            </div>
          </div>
          <div className="flex justify-between w-full">
            <span className="w-2 h-2 rounded bg-brand-magenta" />
            <span className="w-3 h-3 rounded bg-brand-violet animate-ping" style={{ animationDelay: '0.8s' }} />
          </div>
        </div>
      )}

      {type === 'neumorph' && (
        <div className="w-24 h-24 rounded-3xl bg-zinc-300 dark:bg-zinc-800 flex items-center justify-center shadow-[6px_6px_12px_rgba(0,0,0,0.4),-6px_-6px_12px_rgba(255,255,255,0.05)]">
          <div className="w-16 h-16 rounded-2xl bg-zinc-300 dark:bg-zinc-800 shadow-[inset_3px_3px_6px_rgba(0,0,0,0.5),inset_-3px_-3px_6px_rgba(255,255,255,0.05)] flex items-center justify-center">
            <div className="w-8 h-8 rounded-xl bg-brand-violet/30 border border-brand-violet/40 animate-pulse" />
          </div>
        </div>
      )}

    </div>
  );
}

// MAIN PORTFOLIO MODULE
export default function NftPortfolio({ morphism, wallet, addToast }) {
  const [selectedNft, setSelectedNft] = useState(null);
  const [purchaseStep, setPurchaseStep] = useState('idle'); // idle, review, confirm, processing, success
  const drawerRef = useRef(null);

  // Close drawer on clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (drawerRef.current && !drawerRef.current.contains(event.target)) {
        handleCloseDrawer();
      }
    }
    
    if (selectedNft) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [selectedNft]);

  // Close drawer on ESC key
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        handleCloseDrawer();
      }
    }
    
    if (selectedNft) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedNft]);

  const handleCloseDrawer = () => {
    setSelectedNft(null);
    setPurchaseStep('idle');
  };

  const handlePurchaseInit = () => {
    if (wallet.status !== 'connected') {
      addToast("Please connect your Web3 wallet first.", "warning");
      return;
    }
    setPurchaseStep('review');
  };

  const handleConfirmPurchase = () => {
    setPurchaseStep('processing');
    
    // Simulate transaction delay
    setTimeout(() => {
      const deductSuccess = wallet.deductADG(selectedNft.licensePrice);
      if (deductSuccess) {
        setPurchaseStep('success');
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.8 },
          colors: ['#8b5cf6', '#d946ef', '#3b82f6']
        });
        addToast(`License for '${selectedNft.title}' successfully acquired!`, "success");
      } else {
        setPurchaseStep('review');
        addToast("Insufficient ADG balance to purchase license.", "error");
      }
    }, 2000);
  };

  const getMorphismCard = () => {
    switch (morphism) {
      case 'glass':
        return 'morphism-glass border border-white/10';
      case 'neu':
        return 'morphism-neu';
      case 'clay':
        return 'morphism-clay';
      default:
        return '';
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-6 py-8 relative">
      
      {/* HEADER */}
      <div className="flex justify-between items-end reveal-on-scroll">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-zinc-950 dark:text-zinc-50">
            Creative Portfolio NFT Marketplace
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm">
            Acquire licensing rights to premium generative banners. Authenticated on chain.
          </p>
        </div>
      </div>

      {/* ASYMMETRIC GRID GALLERY */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 reveal-on-scroll">
        {nftCreatives.map((nft, index) => {
          // Asymmetric column widths based on indexing
          const gridSpan = index % 3 === 0 ? 'lg:col-span-8' : 'lg:col-span-4';
          const cardHeight = index % 3 === 0 ? 'h-96' : 'h-72';
          
          return (
            <div
              key={nft.id}
              onClick={() => setSelectedNft(nft)}
              className={`${gridSpan} ${getMorphismCard()} rounded-2xl overflow-hidden cursor-pointer flex flex-col group relative transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl`}
            >
              {/* Graphic composer */}
              <div className={`w-full ${cardHeight} relative`}>
                <NftArtworkComposer type={nft.shapeType} gradient={nft.gradient} />
                
                {/* Meta details hover overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6 gap-3">
                  <div>
                    <span className={`text-[9px] font-mono font-bold border px-2 py-0.5 rounded ${nft.rarityColor}`}>
                      {nft.rarity}
                    </span>
                    <h3 className="text-white font-extrabold text-xl mt-2">{nft.title}</h3>
                  </div>
                  <div className="flex justify-between items-center text-xs font-mono text-zinc-300 pt-2 border-t border-white/10">
                    <span>License Price:</span>
                    <span className="text-brand-magenta font-bold">{nft.licensePrice} ADG</span>
                  </div>
                </div>
              </div>

              {/* Standard visible details */}
              <div className="p-4 flex justify-between items-center text-sm">
                <div>
                  <h4 className="font-extrabold text-zinc-950 dark:text-zinc-50 leading-tight">
                    {nft.title}
                  </h4>
                  <span className="text-xs text-zinc-500 font-mono">By: {nft.creator}</span>
                </div>
                <span className="font-mono text-zinc-500 text-xs">
                  {nft.tokenId}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* DRAWER BACKGROUND BACKDROP */}
      {selectedNft && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[99] transition-opacity duration-300" />
      )}

      {/* SLIDE OUT DETAILS DRAWER */}
      <div
        ref={drawerRef}
        className={`fixed top-0 right-0 h-full w-full max-w-md z-[100] shadow-2xl transition-transform duration-500 ease-out flex flex-col justify-between ${
          selectedNft ? 'translate-x-0' : 'translate-x-full'
        } ${
          morphism === 'glass'
            ? 'morphism-glass border-l border-white/10 bg-white/95 dark:bg-[#0c0c0f]/95'
            : morphism === 'neu'
              ? 'morphism-neu'
              : 'morphism-clay rounded-l-3xl'
        }`}
      >
        {selectedNft && (
          <>
            {/* DRAWER BODY */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1">
              
              {/* Drawer header */}
              <div className="flex justify-between items-center pb-3 border-b border-zinc-200 dark:border-zinc-800">
                <span className="text-xs font-mono text-brand-violet font-semibold">NFT METADATA</span>
                <button
                  onClick={handleCloseDrawer}
                  className="p-1 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-full text-zinc-500 hover:text-zinc-300"
                  aria-label="Close drawer"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Composition block */}
              <div className="h-60 w-full relative">
                <NftArtworkComposer type={selectedNft.shapeType} gradient={selectedNft.gradient} />
                <span className={`absolute top-3 right-3 text-[9px] font-mono font-bold border px-2.5 py-1 rounded bg-black/60 backdrop-blur-md ${selectedNft.rarityColor}`}>
                  {selectedNft.rarity}
                </span>
              </div>

              {/* Primary details */}
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-zinc-950 dark:text-zinc-50 leading-tight">
                  {selectedNft.title}
                </h3>
                <div className="flex gap-4 text-xs font-mono text-zinc-500">
                  <span>Creator: <span className="text-brand-cyan">{selectedNft.creator}</span></span>
                  <span>Token ID: <span className="text-zinc-800 dark:text-zinc-200">{selectedNft.tokenId}</span></span>
                </div>
              </div>

              {/* Rarity & pricing information */}
              <div className="grid grid-cols-2 gap-4 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white/5 text-xs font-mono">
                <div>
                  <span className="text-zinc-500">Blockchain:</span>
                  <div className="font-bold text-zinc-800 dark:text-zinc-200 mt-0.5">{selectedNft.blockchain}</div>
                </div>
                <div>
                  <span className="text-zinc-500">Dimensions:</span>
                  <div className="font-bold text-zinc-800 dark:text-zinc-200 mt-0.5">{selectedNft.dimensions}</div>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1.5 text-xs">
                <span className="text-zinc-500 font-mono">DESCRIPTION</span>
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed font-sans">{selectedNft.description}</p>
              </div>

              {/* Artist Bios */}
              <div className="space-y-1.5 text-xs">
                <span className="text-zinc-500 font-mono">CREATOR BIOGRAPHY</span>
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed font-sans">{selectedNft.creatorBio}</p>
              </div>

              {/* SIMULATION STEP DETAILS CONTAINER */}
              {purchaseStep === 'review' && (
                <div className="p-4 rounded-xl bg-brand-violet/10 border border-brand-violet/20 space-y-3">
                  <div className="text-xs font-bold text-brand-violet flex items-center gap-1.5">
                    <Shield size={14} /> LICENSE AGREEMENT REVIEW
                  </div>
                  <p className="text-[10px] text-zinc-500 font-mono leading-normal">
                    This license yields commercial publishing rights for display inventory networks for 30 consecutive days. By confirming, you approve token deduction.
                  </p>
                  <div className="flex justify-between text-xs font-mono pt-1">
                    <span>License Price:</span>
                    <span className="text-brand-magenta font-extrabold">{selectedNft.licensePrice} ADG</span>
                  </div>
                </div>
              )}

              {purchaseStep === 'processing' && (
                <div className="flex flex-col items-center justify-center p-8 text-center space-y-4">
                  <RefreshCw size={36} className="text-brand-cyan animate-spin" />
                  <div className="space-y-1">
                    <div className="font-bold text-sm text-zinc-950 dark:text-zinc-50 font-mono">TRANSACTION PENDING</div>
                    <p className="text-[10px] text-zinc-400 font-mono">Simulating block verification details...</p>
                  </div>
                </div>
              )}

              {purchaseStep === 'success' && (
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center space-y-3">
                  <div className="mx-auto w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                    <Check size={18} />
                  </div>
                  <div className="space-y-1">
                    <div className="font-bold text-sm text-emerald-400 font-mono">TRANSACTION CONFIRMED</div>
                    <p className="text-[10px] text-zinc-400 font-mono">Licensing authority assigned to address: {formatAddress(wallet.address)}</p>
                  </div>
                </div>
              )}
            </div>

            {/* DRAWER FOOTER / CTA ACTIONS */}
            <div className="p-6 border-t border-zinc-200 dark:border-zinc-800 flex justify-between items-center bg-black/10 dark:bg-black/20">
              <div className="space-y-0.5">
                <span className="text-[10px] text-zinc-500 font-mono">LICENSE COST</span>
                <div className="font-mono text-zinc-950 dark:text-zinc-50 font-bold text-lg flex items-center gap-1">
                  <ShoppingCart size={16} className="text-brand-magenta" />
                  {formatNumber(selectedNft.licensePrice)} ADG
                </div>
              </div>

              {purchaseStep === 'idle' && (
                <button
                  onClick={handlePurchaseInit}
                  className={`px-5 py-3 rounded-xl text-xs font-bold transition-all ${
                    morphism === 'clay'
                      ? 'bg-brand-violet text-white shadow-clay-dark'
                      : morphism === 'neu'
                        ? 'morphism-neu text-brand-violet font-extrabold'
                        : 'bg-brand-violet hover:bg-brand-violet/90 text-white shadow-glow-violet/20'
                  }`}
                >
                  Acquire License
                </button>
              )}

              {purchaseStep === 'review' && (
                <button
                  onClick={handleConfirmPurchase}
                  className="px-5 py-3 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-600 text-white shadow-glow-cyan/20"
                >
                  Confirm & Pay
                </button>
              )}

              {purchaseStep === 'processing' && (
                <button
                  disabled
                  className="px-5 py-3 rounded-xl text-xs font-bold bg-zinc-800 text-zinc-600 cursor-not-allowed flex items-center gap-1.5"
                >
                  <RefreshCw size={12} className="animate-spin" /> Processing
                </button>
              )}

              {purchaseStep === 'success' && (
                <button
                  onClick={handleCloseDrawer}
                  className="px-5 py-3 rounded-xl text-xs font-bold bg-zinc-900 text-zinc-300 border border-zinc-700 hover:bg-zinc-800"
                >
                  Close Drawer
                </button>
              )}
            </div>
          </>
        )}
      </div>

    </div>
  );
}
