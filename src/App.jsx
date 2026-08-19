import React, { useState, useEffect } from 'react';
import Navbar from './components/navigation/Navbar';
import Home from './pages/Home';
import Explore from './pages/Explore';
import AssetDetails from './pages/AssetDetails';
import Collection from './pages/Collection';
import Creators from './pages/Creators';
import UploadAsset from './pages/UploadAsset';

import { useTheme } from './hooks/useTheme';
import { useMorphism } from './hooks/useMorphism';
import { useWallet } from './hooks/useWallet';
import { useScrollAnimation } from './hooks/useScrollAnimation';
import { assets as initialAssets } from './data/assets';
import { creators as initialCreators } from './data/creators';
import { api } from './utils/api';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';

export default function App() {
  const { isDark, toggleTheme } = useTheme();
  const { morphism, setMorphism } = useMorphism();
  const wallet = useWallet();
  
  // Views navigation router
  const [activeTab, setActiveTab] = useState('home'); // home, explore, collections, creators, upload
  const [selectedAsset, setSelectedAsset] = useState(null);
  
  // Global search input synchronized with the navbar search field
  const [searchQuery, setSearchQuery] = useState('');

  // Local assets & creators states synchronized with the database
  const [localAssets, setLocalAssets] = useState(initialAssets);
  const [localCreators, setLocalCreators] = useState(initialCreators);

  // Saved (bookmarked) and Owned (downloaded/purchased) libraries
  const [savedAssetIds, setSavedAssetIds] = useState(['asset-1', 'asset-5', 'asset-9', 'asset-24']);
  const [ownedAssetIds, setOwnedAssetIds] = useState(['asset-7', 'asset-13', 'asset-20']);

  // Dynamic notification toast queue
  const [toasts, setToasts] = useState([]);

  // Register scroll observes on tab changes
  useScrollAnimation(activeTab);

  // Initialize assets and creators from backend database on mount
  useEffect(() => {
    const initData = async () => {
      try {
        const assetsData = await api.getAssets();
        setLocalAssets(assetsData);
        
        const creatorsData = await api.getCreators();
        setLocalCreators(creatorsData);
      } catch (err) {
        console.warn("Express backend offline or seeding not complete. Loading fallback mock database.");
      }
    };
    initData();
  }, []);

  // Sync wallet user bookmarks and downloads from MongoDB Atlas when wallet changes
  useEffect(() => {
    const syncWalletProfile = async () => {
      if (wallet.isConnected && wallet.address) {
        try {
          const profile = await api.loginUser(wallet.address);
          if (profile.savedAssets && profile.savedAssets.length > 0) {
            setSavedAssetIds(profile.savedAssets.map(a => typeof a === 'object' ? a.id : a));
          }
          if (profile.ownedAssets && profile.ownedAssets.length > 0) {
            setOwnedAssetIds(profile.ownedAssets.map(a => typeof a === 'object' ? a.id : a));
          }
          addToast(`Synced user profile for wallet: ${wallet.address.slice(0,6)}...`, 'success');
        } catch (err) {
          console.error("Wallet profile sync error:", err);
        }
      }
    };
    syncWalletProfile();
  }, [wallet.isConnected, wallet.address]);

  const addToast = (message, type = 'info') => {
    const id = `toast-${Date.now()}`;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const handleToggleSave = async (assetId) => {
    const isSaved = savedAssetIds.includes(assetId);
    setSavedAssetIds(prev => 
      isSaved
        ? prev.filter(id => id !== assetId)
        : [...prev, assetId]
    );

    // Sync database if wallet is active
    if (wallet.isConnected && wallet.address) {
      try {
        await api.toggleSaveAsset(wallet.address, assetId);
      } catch (err) {
        console.error("Failed to sync bookmark:", err);
      }
    }
  };

  const handleAddOwned = async (assetId) => {
    setOwnedAssetIds(prev => 
      prev.includes(assetId) ? prev : [...prev, assetId]
    );

    // Sync database if wallet is active
    if (wallet.isConnected && wallet.address) {
      try {
        await api.ownAsset(wallet.address, assetId);
      } catch (err) {
        console.error("Failed to sync downloads:", err);
      }
    }
  };

  const handleUploadAsset = (newAsset) => {
    setLocalAssets(prev => [newAsset, ...prev]);
  };


  const getToastIcon = (type) => {
    switch (type) {
      case 'success': return <CheckCircle size={16} className="text-emerald-400" />;
      case 'error': return <AlertCircle size={16} className="text-rose-400" />;
      case 'warning': return <AlertTriangle size={16} className="text-amber-400" />;
      default: return <Info size={16} className="text-brand-cyan" />;
    }
  };

  const getToastStyles = (type) => {
    switch (type) {
      case 'success': return 'bg-emerald-500/10 border-emerald-500/20 text-emerald-100';
      case 'error': return 'bg-rose-500/10 border-rose-500/20 text-rose-100';
      case 'warning': return 'bg-amber-500/10 border-amber-500/20 text-amber-100';
      default: return 'bg-zinc-900/90 border-zinc-800 text-zinc-100';
    }
  };

  const getPageContainerStyles = () => {
    switch (morphism) {
      case 'glass':
        return scrolled => scrolled 
          ? 'border border-white/5 bg-white/5 dark:bg-[#0c0c0f]/35 backdrop-blur-md shadow-2xl'
          : 'border border-white/5 bg-white/5 dark:bg-[#0c0c0f]/15 backdrop-blur-sm';
      case 'neu':
        return () => 'morphism-neu';
      case 'clay':
        return () => 'morphism-clay rounded-3xl';
      default:
        return () => '';
    }
  };

  const getMorphismContainer = getPageContainerStyles();

  return (
    <div 
      className="min-h-screen bg-brand-bg-light dark:bg-brand-bg-dark text-zinc-900 dark:text-zinc-100 relative pb-16 flex flex-col items-center overflow-x-hidden"
      data-morphism={morphism}
    >
      
      {/* BACKGROUND GRAPHICAL ACCENTS */}
      <div className="absolute inset-0 bg-grid-pattern pointer-events-none opacity-20" />
      <div className="glow-blob w-[500px] h-[500px] bg-brand-violet/10 top-0 left-10" />
      <div className="glow-blob w-[600px] h-[600px] bg-brand-cyan/10 top-1/3 right-10" style={{ animationDelay: '2s' }} />
      <div className="glow-blob w-[500px] h-[500px] bg-brand-magenta/10 bottom-10 left-1/4" style={{ animationDelay: '4s' }} />

      {/* FLOATING NAVBAR */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          setSelectedAsset(null); // Reset detail page on menu switches
        }}
        morphism={morphism}
        setMorphism={setMorphism}
        isDark={isDark}
        toggleTheme={toggleTheme}
        wallet={wallet}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        savedCount={savedAssetIds.length}
        ownedCount={ownedAssetIds.length}
      />

      {/* PAGE CONTAINER MARGIN WRAPPER */}
      <main className="w-full max-w-7xl mx-auto px-4 mt-28">
        <div className={`p-1.5 md:p-6 rounded-3xl transition-all duration-500 ${getMorphismContainer()} min-h-[550px]`}>
          
          {/* ASSET DETAIL DETAILS PAGE OVERRIDE VIEW */}
          {selectedAsset ? (
            <div className="animate-fade-in">
              <AssetDetails
                asset={selectedAsset}
                onBack={() => setSelectedAsset(null)}
                morphism={morphism}
                wallet={wallet}
                addToast={addToast}
                isSaved={savedAssetIds.includes(selectedAsset.id)}
                onToggleSave={handleToggleSave}
                onAddOwned={handleAddOwned}
              />
            </div>
          ) : (
            <>
              {/* ROUTE TAB CONTENT */}
              {activeTab === 'home' && (
                <div className="animate-fade-in">
                  <Home 
                    activeTab={activeTab} 
                    setActiveTab={setActiveTab} 
                    morphism={morphism} 
                    onSelectAsset={setSelectedAsset} 
                  />
                </div>
              )}

              {activeTab === 'explore' && (
                <div className="animate-fade-in">
                  <Explore
                    morphism={morphism}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    onSelectAsset={setSelectedAsset}
                  />
                </div>
              )}

              {activeTab === 'collections' && (
                <div className="animate-fade-in">
                  <Collection
                    morphism={morphism}
                    savedAssetIds={savedAssetIds}
                    ownedAssetIds={ownedAssetIds}
                    onSelectAsset={setSelectedAsset}
                    addToast={addToast}
                    localAssets={localAssets}
                  />
                </div>
              )}

              {activeTab === 'creators' && (
                <div className="animate-fade-in">
                  <Creators 
                    morphism={morphism} 
                    onSelectAsset={setSelectedAsset} 
                    localAssets={localAssets}
                    localCreators={localCreators}
                  />
                </div>
              )}

              {activeTab === 'upload' && (
                <div className="animate-fade-in">
                  <UploadAsset
                    morphism={morphism}
                    onUploadAsset={handleUploadAsset}
                    addToast={addToast}
                    setActiveTab={setActiveTab}
                  />
                </div>
              )}
            </>
          )}

        </div>
      </main>

      {/* FLOATING TOAST LIST */}
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 max-w-sm w-full">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`flex items-center justify-between p-4 rounded-2xl border backdrop-blur-md shadow-2xl text-xs font-mono transition-all duration-300 animate-slide-in ${getToastStyles(toast.type)}`}
          >
            <div className="flex items-center gap-2.5">
              {getToastIcon(toast.type)}
              <span>{toast.message}</span>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="p-0.5 hover:bg-white/10 rounded-full transition-colors ml-4 text-zinc-400 hover:text-zinc-100"
              aria-label="Dismiss toast"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>

    </div>
  );
}
