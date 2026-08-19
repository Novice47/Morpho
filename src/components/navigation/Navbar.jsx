import React, { useState, useEffect } from 'react';
import { Sun, Moon, Wallet, Menu, X, Compass, FolderOpen, Users, Upload, Search, User } from 'lucide-react';
import { formatAddress } from '../../utils/formatters';

export default function Navbar({
  activeTab,
  setActiveTab,
  morphism,
  setMorphism,
  isDark,
  toggleTheme,
  wallet,
  searchQuery,
  setSearchQuery,
  savedCount,
  ownedCount
}) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [walletDropdownOpen, setWalletDropdownOpen] = useState(false);

  // Scroll listener to shrink navbar and add frosted blur
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'explore', label: 'Explore', icon: Compass },
    { id: 'collections', label: 'Collections', icon: FolderOpen },
    { id: 'creators', label: 'Creators', icon: Users },
    { id: 'upload', label: 'Publish', icon: Upload }
  ];

  const morphismOptions = [
    { id: 'glass', label: 'Glass' },
    { id: 'neu', label: 'Neu' },
    { id: 'clay', label: 'Clay' }
  ];

  const getMorphismClass = () => {
    if (morphism === 'clay') return 'morphism-clay rounded-2xl mx-4 mt-2 shadow-md';
    if (morphism === 'neu') return scrolled ? 'morphism-neu border-none shadow-md' : 'bg-transparent border-none';
    return scrolled ? 'morphism-glass border-b border-white/10' : 'bg-transparent border-transparent';
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    if (activeTab !== 'explore') {
      setActiveTab('explore');
    }
  };

  const handleWalletConnectClick = () => {
    if (wallet.status === 'connected') {
      setWalletDropdownOpen(!walletDropdownOpen);
    } else {
      wallet.connect('MetaMask');
    }
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'py-2' : 'py-4'
    } ${getMorphismClass()}`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between gap-4">
        
        {/* LOGO */}
        <div className="flex items-center gap-2 cursor-pointer shrink-0" onClick={() => setActiveTab('home')}>
          <div className="relative w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-violet to-brand-cyan flex items-center justify-center shadow-md">
            <span className="text-white font-mono font-bold text-base">M</span>
          </div>
          <span className="font-sans font-black text-2xl tracking-tight bg-gradient-to-r from-brand-violet via-brand-magenta to-brand-cyan bg-clip-text text-transparent">
            MORPH
          </span>
        </div>

        {/* SEARCH BAR (SYNCED TO EXPLORE TAB) */}
        <div className="hidden md:flex items-center relative max-w-xs w-full">
          <Search className="absolute left-3 text-zinc-400" size={16} />
          <input
            type="text"
            placeholder="Search graphics, creators..."
            value={searchQuery}
            onChange={handleSearchChange}
            className={`w-full pl-9 pr-4 py-1.5 text-xs rounded-xl focus:outline-none transition-all duration-200 ${
              morphism === 'glass'
                ? 'morphism-glass-input'
                : morphism === 'neu'
                  ? 'morphism-neu-input'
                  : 'morphism-clay-input'
            }`}
          />
        </div>

        {/* DESKTOP NAV ITEMS */}
        <div className="hidden lg:flex items-center gap-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`relative px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 text-xs font-semibold transition-all duration-300 
                  ${isActive 
                    ? morphism === 'clay'
                      ? 'bg-brand-violet text-white shadow-clay-dark'
                      : morphism === 'neu'
                        ? 'morphism-neu-inset text-brand-violet'
                        : 'bg-white/10 dark:bg-white/5 text-brand-cyan border border-brand-cyan/20'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100'
                  }`}
              >
                <Icon size={14} />
                {item.label}
              </button>
            );
          })}
        </div>

        {/* THEME, MORPH, WALLET CONTROLS */}
        <div className="hidden sm:flex items-center gap-3">
          
          {/* MORPH SELECTION */}
          <div className={`flex p-0.5 rounded-lg text-[10px] font-bold ${
            morphism === 'neu' ? 'morphism-neu-inset' : 'bg-black/10 dark:bg-white/5 border border-zinc-200 dark:border-zinc-800'
          }`}>
            {morphismOptions.map((opt) => (
              <button
                key={opt.id}
                onClick={() => setMorphism(opt.id)}
                className={`px-2 py-1 rounded transition-all duration-150 ${
                  morphism === opt.id 
                    ? morphism === 'clay' 
                      ? 'bg-brand-violet text-white shadow-clay-dark' 
                      : morphism === 'neu'
                        ? 'morphism-neu text-brand-violet' 
                        : 'bg-white/20 dark:bg-white/10 text-brand-cyan shadow-sm'
                    : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* LIGHT / DARK TOGGLE */}
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-lg transition-colors ${
              morphism === 'neu' ? 'morphism-neu' : 'bg-black/10 dark:bg-white/5 hover:bg-white/10 border border-zinc-200 dark:border-zinc-800'
            } text-zinc-500 dark:text-zinc-400`}
            aria-label="Toggle Theme"
          >
            {isDark ? <Sun size={15} /> : <Moon size={15} />}
          </button>

          {/* MOCK WALLET CONNECTOR */}
          <div className="relative">
            <button
              onClick={handleWalletConnectClick}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg font-bold text-xs transition-all duration-300 ${
                wallet.status === 'connected'
                  ? morphism === 'clay'
                    ? 'bg-emerald-500 text-white shadow-clay-dark'
                    : morphism === 'neu'
                      ? 'morphism-neu text-emerald-500'
                      : 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
                  : wallet.status === 'connecting'
                    ? 'opacity-85 pointer-events-none'
                    : morphism === 'clay'
                      ? 'bg-brand-violet text-white shadow-clay-dark'
                      : morphism === 'neu'
                        ? 'morphism-neu text-brand-violet'
                        : 'bg-brand-violet/10 border border-brand-violet/30 text-brand-violet hover:bg-brand-violet/20'
              }`}
            >
              <Wallet size={14} className={wallet.status === 'connecting' ? 'animate-spin' : ''} />
              {wallet.status === 'connected' 
                ? formatAddress(wallet.address)
                : wallet.status === 'connecting'
                  ? 'Connecting...'
                  : 'Connect'
              }
            </button>

            {/* MOCK WEB3 ACCOUNT DETAILS */}
            {walletDropdownOpen && wallet.status === 'connected' && (
              <div className={`absolute right-0 mt-2 w-60 p-4 rounded-xl shadow-xl z-50 text-xs font-mono ${
                morphism === 'glass' ? 'morphism-glass' : morphism === 'neu' ? 'morphism-neu' : 'morphism-clay'
              }`}>
                <div className="flex justify-between items-center pb-2 border-b border-zinc-200 dark:border-zinc-800 mb-2">
                  <span className="text-[10px] text-zinc-500">DIGITAL OWNERSHIP</span>
                  <button onClick={() => wallet.disconnect()} className="text-red-500 hover:underline">
                    Disconnect
                  </button>
                </div>
                <div className="space-y-1.5">
                  <div className="flex justify-between"><span className="text-zinc-500">Address:</span><span>{formatAddress(wallet.address)}</span></div>
                  <div className="flex justify-between"><span className="text-zinc-500">Network:</span><span className="text-brand-cyan font-bold">{wallet.network}</span></div>
                  <div className="flex justify-between"><span className="text-zinc-500">Owned Assets:</span><span className="text-brand-magenta font-bold">{ownedCount} Owned</span></div>
                  <div className="flex justify-between"><span className="text-zinc-500">Saved Assets:</span><span className="text-zinc-800 dark:text-zinc-200 font-bold">{savedCount} Saved</span></div>
                </div>
                <div className="mt-3 pt-2 border-t border-zinc-200 dark:border-zinc-800">
                  <span className="text-[9px] text-zinc-500 uppercase">Switch Network</span>
                  <div className="grid grid-cols-2 gap-1 mt-1 text-[9px]">
                    {['Ethereum', 'Polygon', 'Arbitrum', 'Solana'].map((net) => (
                      <button
                        key={net}
                        onClick={() => wallet.switchNetwork(net)}
                        className={`px-1 py-0.5 rounded border transition-all ${
                          wallet.network === net
                            ? 'bg-brand-violet/20 border-brand-violet text-brand-violet font-bold'
                            : 'border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500'
                        }`}
                      >
                        {net}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* MOBILE MENU CONTROLLER */}
        <div className="flex items-center lg:hidden gap-1.5">
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-zinc-500">
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

      </div>

      {/* MOBILE DRAWER */}
      {mobileMenuOpen && (
        <div className={`mt-2 lg:hidden p-4 rounded-xl flex flex-col gap-4 shadow-xl border border-zinc-200/50 dark:border-zinc-800/50 mx-4 ${
          morphism === 'glass' ? 'morphism-glass bg-white/95 dark:bg-[#0c0c0f]/95' : morphism === 'neu' ? 'morphism-neu' : 'morphism-clay'
        }`}>
          {/* SEARCH BAR (MOBILE) */}
          <div className="flex items-center relative w-full">
            <Search className="absolute left-3 text-zinc-400" size={14} />
            <input
              type="text"
              placeholder="Search graphics..."
              value={searchQuery}
              onChange={handleSearchChange}
              className={`w-full pl-9 pr-4 py-2 text-xs rounded-xl focus:outline-none ${
                morphism === 'glass' ? 'morphism-glass-input' : morphism === 'neu' ? 'morphism-neu-input' : 'morphism-clay-input'
              }`}
            />
          </div>

          {/* MENU LINKS */}
          <div className="flex flex-col gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                    isActive 
                      ? 'bg-brand-violet/10 text-brand-cyan border-l-4 border-brand-cyan' 
                      : 'text-zinc-600 dark:text-zinc-400'
                  }`}
                >
                  <Icon size={16} />
                  {item.label}
                </button>
              );
            })}
          </div>

          {/* MORPH SYSTEM (MOBILE) */}
          <div className="flex flex-col gap-1 font-mono">
            <span className="text-[10px] text-zinc-400">MORPHISM ENGINE</span>
            <div className="flex gap-2 p-1 rounded-lg bg-black/5 dark:bg-white/5">
              {morphismOptions.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setMorphism(opt.id)}
                  className={`flex-1 text-center py-1.5 rounded text-xs transition-all ${
                    morphism === opt.id ? 'bg-brand-violet text-white' : 'text-zinc-500'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* WALLET (MOBILE) */}
          <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800">
            {wallet.status === 'connected' ? (
              <div className="space-y-2 font-mono text-xs">
                <div className="flex justify-between"><span className="text-zinc-400">Address:</span><span>{wallet.address}</span></div>
                <div className="flex justify-between"><span className="text-zinc-400">Network:</span><span>{wallet.network}</span></div>
                <button onClick={() => wallet.disconnect()} className="w-full mt-2 py-2 rounded bg-rose-500 text-white font-bold text-xs text-center">
                  Disconnect Wallet
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  wallet.connect('MetaMask');
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-brand-violet text-white font-bold text-xs shadow-md"
              >
                <Wallet size={16} /> Connect Wallet
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
