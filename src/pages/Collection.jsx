import React, { useState } from 'react';
import { Folder, FolderPlus, Trash2, Heart, Download, BookOpen, Layers } from 'lucide-react';
import GraphicComposer from '../components/ui/GraphicComposer';

const INITIAL_FOLDERS = [
  { id: 'fold-1', name: 'Website Project', assetIds: ['asset-1', 'asset-5'] },
  { id: 'fold-2', name: 'Branding', assetIds: ['asset-2', 'asset-8'] },
  { id: 'fold-3', name: 'UI Inspiration', assetIds: ['asset-7', 'asset-18'] }
];

export default function Collection({
  morphism,
  savedAssetIds,
  ownedAssetIds,
  onSelectAsset,
  addToast,
  localAssets = []
}) {
  const [activeSubTab, setActiveSubTab] = useState('all'); // all, saved, owned
  const [folders, setFolders] = useState(INITIAL_FOLDERS);
  const [selectedFolderId, setSelectedFolderId] = useState(null);
  const [newFolderName, setNewFolderName] = useState('');
  const [showFolderModal, setShowFolderModal] = useState(false);

  // Filter collections assets
  const collectionAssets = localAssets.filter(asset => {
    const isSaved = savedAssetIds.includes(asset.id);
    const isOwned = ownedAssetIds.includes(asset.id);
    
    // Sub-tab filters
    const matchesTab = 
      activeSubTab === 'all' ? (isSaved || isOwned) :
      activeSubTab === 'saved' ? isSaved :
      activeSubTab === 'owned' ? isOwned : false;

    // Folder filters
    if (selectedFolderId) {
      const folder = folders.find(f => f.id === selectedFolderId);
      const inFolder = folder ? folder.assetIds.includes(asset.id) : false;
      return matchesTab && inFolder;
    }

    return matchesTab;
  });

  const handleAddFolder = (e) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;

    const newFolder = {
      id: `fold-${Date.now()}`,
      name: newFolderName.trim(),
      assetIds: []
    };

    setFolders(prev => [...prev, newFolder]);
    setNewFolderName('');
    setShowFolderModal(false);
    addToast(`Folder '${newFolder.name}' created!`, 'success');
  };

  const handleDeleteFolder = (id, name) => {
    setFolders(prev => prev.filter(f => f.id !== id));
    if (selectedFolderId === id) setSelectedFolderId(null);
    addToast(`Folder '${name}' removed.`, 'info');
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


  return (
    <div className="space-y-8 max-w-7xl mx-auto px-6 py-8">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 reveal-on-scroll">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-zinc-950 dark:text-zinc-50 font-sans">
            My Library
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400 text-xs font-mono mt-1">
            Organize and manage your acquired design assets, folders, and bookmarks.
          </p>
        </div>
      </div>

      {/* FOLDERS OVERVIEW GRID */}
      <div className="space-y-3 reveal-on-scroll">
        <div className="flex justify-between items-center">
          <span className="text-xs font-mono text-zinc-500 font-semibold">FOLDERS & DIRECTORIES</span>
          <button
            onClick={() => setShowFolderModal(true)}
            className="flex items-center gap-1 text-xs text-brand-cyan hover:underline font-bold"
          >
            <FolderPlus size={14} /> New Folder
          </button>
        </div>

        {/* Dynamic creation form dialog overlay */}
        {showFolderModal && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[999] flex items-center justify-center p-4">
            <form onSubmit={handleAddFolder} className={`p-6 rounded-2xl w-full max-w-xs space-y-4 ${getMorphismCard()}`}>
              <h3 className="font-extrabold text-sm text-zinc-950 dark:text-zinc-50">Create Directory</h3>
              <input
                type="text"
                placeholder="Folder name"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                className={`w-full px-3 py-2 text-xs rounded-xl focus:outline-none ${getMorphismInput()}`}
              />
              <div className="flex gap-2">
                <button type="submit" className="flex-1 py-2 bg-brand-cyan text-white text-xs font-bold rounded-lg">Create</button>
                <button type="button" onClick={() => setShowFolderModal(false)} className="px-3 py-2 text-zinc-400 text-xs rounded-lg">Cancel</button>
              </div>
            </form>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {/* Default "All Folders" click selector */}
          <div
            onClick={() => setSelectedFolderId(null)}
            className={`p-4 rounded-xl cursor-pointer transition-all flex items-center gap-3 border ${
              selectedFolderId === null
                ? 'bg-brand-violet/10 border-brand-violet text-brand-violet'
                : 'bg-white/5 border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <Layers size={18} />
            <div className="flex-1 text-xs font-semibold">All Resources</div>
          </div>

          {folders.map((fold) => (
            <div
              key={fold.id}
              className={`p-4 rounded-xl cursor-pointer transition-all flex items-center justify-between gap-3 border ${
                selectedFolderId === fold.id
                  ? 'bg-brand-violet/10 border-brand-violet text-brand-violet'
                  : 'bg-white/5 border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <div onClick={() => setSelectedFolderId(fold.id)} className="flex items-center gap-3 flex-1 min-w-0">
                <Folder size={18} className={selectedFolderId === fold.id ? 'text-brand-violet' : 'text-zinc-500'} />
                <div className="text-xs font-semibold truncate leading-tight">{fold.name}</div>
              </div>
              <button
                onClick={() => handleDeleteFolder(fold.id, fold.name)}
                className="p-1 hover:bg-red-500/10 hover:text-red-400 rounded text-zinc-600"
                aria-label="Delete folder"
              >
                <Trash2 size={12} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* FILTER TABS */}
      <div className="flex border-b border-zinc-200 dark:border-zinc-800/80 reveal-on-scroll">
        {[
          { id: 'all', label: 'All Items' },
          { id: 'saved', label: 'Bookmarks (Saved)' },
          { id: 'owned', label: 'Acquired (Owned)' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id)}
            className={`px-4 py-2 text-xs font-bold transition-all border-b-2 -mb-px ${
              activeSubTab === tab.id
                ? 'border-brand-cyan text-brand-cyan'
                : 'border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* LIBRARY GRID */}
      {collectionAssets.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 animate-fade-in">
          {collectionAssets.map((asset) => {
            const isOwned = ownedAssetIds.includes(asset.id);
            return (
              <div
                key={asset.id}
                onClick={() => onSelectAsset(asset)}
                className={`${getMorphismCard()} rounded-2xl overflow-hidden cursor-pointer flex flex-col group transition-all duration-300 hover:-translate-y-1 hover:shadow-xl`}
              >
                <div className="w-full h-44 relative bg-black/20">
                  <GraphicComposer type={asset.shapeType} gradient={asset.gradient} size="sm" />

                  {/* OWNERSHIP OPTION BADGE */}
                  <div className="absolute top-3 left-3 text-[9px] font-mono font-bold tracking-wider px-2 py-0.5 rounded border bg-black/50 backdrop-blur-md text-zinc-300 border-white/10">
                    {isOwned ? (asset.isFree ? 'DOWNLOADED' : 'OWNED') : 'BOOKMARKED'}
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
                      {asset.format}
                    </span>
                    <span className="text-brand-magenta font-bold">
                      {asset.isFree ? 'FREE' : `$${asset.price}`}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-20 text-zinc-500 font-mono text-xs reveal-on-scroll">
          Your collection library is empty. Discover assets on the Explore tab and download or save them.
        </div>
      )}

    </div>
  );
}
