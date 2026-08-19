import React, { useState, useEffect } from 'react';
import { ArrowLeft, Heart, Download, CreditCard, ShieldCheck, Maximize2, Minimize2, ZoomIn, ZoomOut, RotateCcw, Check, RefreshCw, AlertTriangle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { formatAddress, formatNumber } from '../utils/formatters';
import GraphicComposer from '../components/ui/GraphicComposer';

// ART COMPO COMPOSER WITH ZOOM AND BACKGROUND OPTIONS
function InterativeViewer({ type, gradient, zoom, bgType, isFullscreen }) {
  const getBgStyle = () => {
    switch (bgType) {
      case 'dark': return 'bg-[#09090b] text-white';
      case 'light': return 'bg-white text-zinc-900';
      case 'grid': return 'bg-grid-pattern bg-zinc-100 dark:bg-black/35 border border-zinc-200 dark:border-zinc-800';
      case 'transparent': return 'bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px] bg-white/5';
      default: return 'bg-black/20';
    }
  };

  return (
    <div className={`w-full h-full rounded-2xl relative overflow-hidden flex items-center justify-center transition-all duration-300 ${getBgStyle()}`}>
      
      {/* Zoom and scale container */}
      <div 
        className="w-full h-full flex items-center justify-center transition-transform duration-200"
        style={{ transform: `scale(${zoom})` }}
      >
        <div className="w-64 h-64 rounded-xl overflow-hidden shadow-2xl">
          <GraphicComposer type={type} gradient={gradient} size="lg" />
        </div>
      </div>

    </div>
  );
}


// MAIN PAGE
export default function AssetDetails({
  asset,
  onBack,
  morphism,
  wallet,
  addToast,
  isSaved,
  onToggleSave,
  onAddOwned
}) {
  const [zoom, setZoom] = useState(1);
  const [bgType, setBgType] = useState('grid'); // grid, dark, light, transparent
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [dlState, setDlState] = useState('idle'); // idle, processing, success
  const [purchaseStep, setPurchaseStep] = useState('idle'); // idle, review, processing, success
  const [validationError, setValidationError] = useState(null);

  // ESC key to close fullscreen
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen]);

  const handleZoomIn = () => setZoom((z) => Math.min(z + 0.2, 2.5));
  const handleZoomOut = () => setZoom((z) => Math.max(z - 0.2, 0.5));
  const handleZoomReset = () => setZoom(1);

  const handleDownload = () => {
    setDlState('processing');
    setTimeout(() => {
      setDlState('success');
      onAddOwned(asset.id);
      addToast(`Downloaded '${asset.title}' vector template!`, 'success');
      
      confetti({
        particleCount: 50,
        spread: 40,
        origin: { y: 0.8 },
        colors: ['#06b6d4', '#8b5cf6']
      });

      // Reset button after 3s
      setTimeout(() => setDlState('idle'), 3000);
    }, 2000);
  };

  const handlePurchaseInit = () => {
    if (wallet.status !== 'connected') {
      addToast("Please connect your wallet to purchase premium assets.", "warning");
      return;
    }
    setValidationError(null);
    setPurchaseStep('review');
  };

  const handleConfirmPurchase = () => {
    setValidationError(null);
    setPurchaseStep('processing');

    setTimeout(() => {
      // Simulate price deduction
      const success = wallet.deductADG(asset.price * 10); // $1 = 10 ADG mock rate
      if (success) {
        setPurchaseStep('success');
        onAddOwned(asset.id);
        addToast(`Successfully acquired ownership of '${asset.title}'!`, 'success');

        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.8 },
          colors: ['#8b5cf6', '#d946ef', '#06b6d4']
        });
      } else {
        setPurchaseStep('review');
        setValidationError("Insufficient token balance. Please switch networks or fund wallet.");
      }
    }, 2500);
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
      
      {/* BACK NAVIGATION */}
      <div className="flex items-center justify-between animate-fade-in">
        <button
          onClick={onBack}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
            morphism === 'clay' ? 'bg-zinc-800 text-white shadow-clay-dark' : morphism === 'neu' ? 'morphism-neu text-zinc-400' : 'bg-zinc-900/50 border border-zinc-800 text-zinc-300 hover:bg-zinc-900'
          }`}
        >
          <ArrowLeft size={14} /> Back to explore
        </button>

        {/* BOOKMARK ICON */}
        <button
          onClick={() => {
            onToggleSave(asset.id);
            addToast(isSaved ? "Removed from your collections" : "Added to your collections", "info");
          }}
          className={`p-2.5 rounded-full transition-all ${
            isSaved 
              ? 'bg-rose-500/10 text-rose-500 border border-rose-500/30'
              : morphism === 'neu' ? 'morphism-neu text-zinc-500' : 'bg-black/5 dark:bg-white/5 border border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:text-zinc-300'
          }`}
          aria-label={isSaved ? "Remove bookmark" : "Add bookmark"}
        >
          <Heart size={16} fill={isSaved ? 'currentColor' : 'none'} className="transition-transform duration-300 active:scale-125" />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* INTERACTIVE WORKSPACE (LEFT 7 COLS) */}
        <div className={`lg:col-span-7 flex flex-col gap-4 animate-fade-in`}>
          <div className={`relative h-96 w-full ${getMorphismCard()} overflow-hidden`}>
            <InterativeViewer
              type={asset.shapeType}
              gradient={asset.gradient}
              zoom={zoom}
              bgType={bgType}
              isFullscreen={isFullscreen}
            />

            {/* FULLSCREEN PREVIEW INJECT */}
            {isFullscreen && (
              <div className="fixed inset-0 z-[999] bg-[#09090b] flex flex-col justify-between p-6">
                <div className="flex justify-between items-center text-xs font-mono text-zinc-400">
                  <span>{asset.title} - Zoom {Math.round(zoom * 100)}%</span>
                  <button
                    onClick={() => setIsFullscreen(false)}
                    className="p-1 rounded-full bg-white/10 hover:bg-white/20 text-white"
                  >
                    Close Preview (ESC)
                  </button>
                </div>
                <div className="flex-1 flex items-center justify-center overflow-hidden">
                  <InterativeViewer
                    type={asset.shapeType}
                    gradient={asset.gradient}
                    zoom={zoom + 0.4}
                    bgType={bgType}
                    isFullscreen={true}
                  />
                </div>
              </div>
            )}
          </div>

          {/* VIEW CONTROLS */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl border border-zinc-200/50 dark:border-zinc-800/50 bg-white/5 text-xs font-mono">
            {/* Background switcher */}
            <div className="flex items-center gap-2">
              <span className="text-zinc-500 font-bold uppercase tracking-wider text-[10px]">PREVIEW STYLING:</span>
              <div className="flex gap-1.5 font-bold">
                {['grid', 'dark', 'light', 'transparent'].map((bg) => (
                  <button
                    key={bg}
                    onClick={() => setBgType(bg)}
                    className={`px-2.5 py-1 rounded-lg border transition-all ${
                      bgType === bg
                        ? 'bg-brand-cyan/20 border-brand-cyan text-brand-cyan'
                        : 'border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:text-zinc-300'
                    }`}
                  >
                    {bg}
                  </button>
                ))}
              </div>
            </div>

            {/* Canvas actions */}
            <div className="flex items-center gap-2">
              <button onClick={handleZoomOut} className="p-1.5 rounded bg-zinc-200 dark:bg-zinc-800 text-zinc-500 hover:text-zinc-300" aria-label="Zoom out"><ZoomOut size={14} /></button>
              <button onClick={handleZoomReset} className="p-1.5 rounded bg-zinc-200 dark:bg-zinc-800 text-zinc-500 hover:text-zinc-300" aria-label="Reset zoom"><RotateCcw size={14} /></button>
              <button onClick={handleZoomIn} className="p-1.5 rounded bg-zinc-200 dark:bg-zinc-800 text-zinc-500 hover:text-zinc-300" aria-label="Zoom in"><ZoomIn size={14} /></button>
              <span className="w-px h-4 bg-zinc-700 mx-1" />
              <button onClick={() => setIsFullscreen(true)} className="p-1.5 rounded bg-zinc-200 dark:bg-zinc-800 text-zinc-500 hover:text-zinc-300" aria-label="Fullscreen"><Maximize2 size={14} /></button>
            </div>
          </div>
        </div>

        {/* METADATA & ACQUISITION (RIGHT 5 COLS) */}
        <div className="lg:col-span-5 space-y-6 animate-fade-in">
          
          {/* Main Info */}
          <div className={`p-5 rounded-2xl space-y-4 ${getMorphismCard()}`}>
            <div>
              <span className="text-[10px] text-brand-cyan font-mono font-bold bg-brand-cyan/10 border border-brand-cyan/20 px-2 py-0.5 rounded uppercase">
                {asset.category}
              </span>
              <h3 className="text-2xl font-black tracking-tight text-zinc-950 dark:text-zinc-50 font-sans mt-2">
                {asset.title}
              </h3>
              <span className="text-xs text-zinc-500 font-mono">Published by: @{asset.creator}</span>
            </div>

            <p className="text-zinc-500 dark:text-zinc-400 text-xs leading-relaxed">
              {asset.description}
            </p>

            {/* Technical Metadata grid */}
            <div className="grid grid-cols-2 gap-3 p-4 rounded-xl border border-zinc-200/50 dark:border-zinc-800/50 bg-white/5 text-xs font-mono">
              <div>
                <div className="text-zinc-500">FORMAT</div>
                <div className="font-bold text-zinc-800 dark:text-zinc-200 mt-0.5">{asset.format}</div>
              </div>
              <div>
                <div className="text-zinc-500">DIMENSIONS</div>
                <div className="font-bold text-zinc-800 dark:text-zinc-200 mt-0.5">{asset.dimensions}</div>
              </div>
              <div>
                <div className="text-zinc-500">FILE SIZE</div>
                <div className="font-bold text-zinc-800 dark:text-zinc-200 mt-0.5">{asset.fileSize}</div>
              </div>
              <div>
                <div className="text-zinc-500">LICENSE TIER</div>
                <div className="font-bold text-brand-cyan mt-0.5">{asset.license}</div>
              </div>
            </div>

            {/* CTA ACTIONS & MODALS */}
            <div className="pt-2">
              {asset.isFree ? (
                /* FREE DOWNLOAD BUTTON */
                dlState === 'idle' ? (
                  <button
                    onClick={handleDownload}
                    className="w-full py-3 rounded-xl bg-brand-cyan hover:bg-brand-cyan/90 text-white font-extrabold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 shadow-glow-cyan/20"
                  >
                    <Download size={14} /> Download Free Asset
                  </button>
                ) : dlState === 'processing' ? (
                  <button
                    disabled
                    className="w-full py-3 rounded-xl bg-zinc-800 text-zinc-600 cursor-not-allowed font-mono text-xs flex items-center justify-center gap-1.5"
                  >
                    <RefreshCw size={14} className="animate-spin" /> Compiling Vector nodes...
                  </button>
                ) : (
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-center text-xs font-mono rounded-xl flex items-center justify-center gap-2">
                    <Check size={16} /> Asset Saved to Local Directory!
                  </div>
                )
              ) : (
                /* PREMIUM PURCHASE FLOW BUTTONS */
                purchaseStep === 'idle' ? (
                  <button
                    onClick={handlePurchaseInit}
                    className="w-full py-3 rounded-xl bg-brand-violet hover:bg-brand-violet/90 text-white font-extrabold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 shadow-glow-violet/20"
                  >
                    <CreditCard size={14} /> Buy Asset (${asset.price})
                  </button>
                ) : purchaseStep === 'review' ? (
                  <div className="p-4 rounded-xl bg-brand-violet/10 border border-brand-violet/20 space-y-4">
                    <div className="text-xs font-bold text-brand-violet flex items-center gap-1">
                      <ShieldCheck size={14} /> SECURITY CHECK & CONFIRM
                    </div>
                    <p className="text-[10px] text-zinc-500 font-mono leading-relaxed">
                      Confirming will deduct mock funds equivalent to ${asset.price} ({asset.price * 10} ADG) from your connected wallet.
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={handleConfirmPurchase}
                        className="flex-1 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs"
                      >
                        Confirm Purchase
                      </button>
                      <button
                        onClick={() => setPurchaseStep('idle')}
                        className="px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-400 text-xs"
                      >
                        Cancel
                      </button>
                    </div>
                    {validationError && (
                      <div className="text-[9px] text-rose-500 font-mono flex items-center gap-1">
                        <AlertTriangle size={10} /> {validationError}
                      </div>
                    )}
                  </div>
                ) : purchaseStep === 'processing' ? (
                  <button
                    disabled
                    className="w-full py-3 rounded-xl bg-zinc-800 text-zinc-600 cursor-not-allowed font-mono text-xs flex items-center justify-center gap-1.5"
                  >
                    <RefreshCw size={14} className="animate-spin" /> Verifying ownership signature...
                  </button>
                ) : (
                  <div className="space-y-3">
                    <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-center text-xs font-mono rounded-xl flex items-center justify-center gap-2">
                      <Check size={16} /> Asset Ownership Validated!
                    </div>
                    <button
                      onClick={() => setPurchaseStep('idle')}
                      className="w-full py-2 border border-zinc-200 dark:border-zinc-800 text-[10px] font-mono text-zinc-500 hover:text-zinc-300 rounded-xl"
                    >
                      Buy Again / Extend License
                    </button>
                  </div>
                )
              )}
            </div>
          </div>

          {/* DIGITAL PROVENANCE (OPTIONAL WEB3 DETAILS) */}
          {(wallet.status === 'connected' || !asset.isFree) && (
            <div className={`p-5 rounded-2xl space-y-3 font-mono text-xs ${getMorphismCard()}`}>
              <h4 className="font-bold text-sm text-zinc-950 dark:text-zinc-50 pb-2 border-b border-zinc-200 dark:border-zinc-800 flex items-center gap-1.5">
                <ShieldCheck size={16} className="text-brand-cyan" /> Digital Ownership Registry
              </h4>

              <div className="space-y-1.5 text-[10px]">
                <div className="flex justify-between">
                  <span className="text-zinc-500">Asset Identity ID:</span>
                  <span className="text-zinc-800 dark:text-zinc-200 font-bold truncate max-w-[150px]">MORPH-{asset.id.toUpperCase()}-REG</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Creator Royalties:</span>
                  <span className="text-zinc-800 dark:text-zinc-200 font-bold">10% Secondary</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Registry Network:</span>
                  <span className="text-brand-cyan font-bold">{wallet.status === 'connected' ? wallet.network : 'Polygon Mainnet'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Registry Status:</span>
                  <span className={`font-bold ${asset.isFree ? 'text-zinc-400' : 'text-brand-magenta'}`}>
                    {asset.isFree ? 'FREE PUBLIC VECTOR' : 'COMMERCIAL LICENSE REGISTERED'}
                  </span>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
