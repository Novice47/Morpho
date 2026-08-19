import React, { useState } from 'react';
import { Upload, Info, Check, RefreshCw, AlertTriangle, Image as ImageIcon } from 'lucide-react';
import confetti from 'canvas-confetti';
import { categories } from '../data/categories';
import { api } from '../utils/api';

export default function UploadAsset({ morphism, onUploadAsset, addToast, setActiveTab }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Abstract');
  const [format, setFormat] = useState('SVG');
  const [priceType, setPriceType] = useState('Free'); // Free, Premium
  const [priceValue, setPriceValue] = useState('12');
  const [license, setLicense] = useState('Commercial');
  const [tagsInput, setTagsInput] = useState('');
  
  const [fileSelected, setFileSelected] = useState(false);
  const [fileObject, setFileObject] = useState(null);
  const [fileName, setFileName] = useState('');
  const [fileSizeStr, setFileSizeStr] = useState('');
  const [uploadStep, setUploadStep] = useState('idle'); // idle, processing, success
  const [error, setError] = useState(null);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileObject(file);
      setFileName(file.name);
      setFileSelected(true);
      // Generate a mock readable file size
      const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
      setFileSizeStr(`${sizeMB} MB`);
      
      // Attempt auto-detect format from extension
      const ext = file.name.split('.').pop().toUpperCase();
      if (['SVG', 'GLB', 'PNG', 'JPG'].includes(ext)) {
        setFormat(ext);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!fileSelected) {
      setError("Please select a graphic asset file to upload.");
      return;
    }

    if (!title.trim()) {
      setError("Asset Title is required.");
      return;
    }

    // Set simulated packaging step
    setUploadStep('processing');

    const tagsArray = tagsInput
      .split(',')
      .map(t => t.trim().toLowerCase())
      .filter(t => t !== '');

    const isFree = priceType === 'Free';
    const parsedPrice = isFree ? 0 : Number(priceValue) || 12;

    // Select a CSS gradient color schema for composting
    const gradients = [
      "linear-gradient(135deg, #6d28d9 0%, #4f46e5 100%)",
      "linear-gradient(135deg, #0891b2 0%, #0369a1 100%)",
      "linear-gradient(135deg, #db2777 0%, #c026d3 100%)",
      "linear-gradient(135deg, #059669 0%, #047857 100%)",
      "linear-gradient(135deg, #e11d48 0%, #be123c 100%)"
    ];
    const randomGradient = gradients[Math.floor(Math.random() * gradients.length)];

    const shapeTypes = ['torus', 'cubes', 'waves', 'grid', 'neumorph'];
    const randomShape = shapeTypes[Math.floor(Math.random() * shapeTypes.length)];

    const assetPayload = {
      title: title.trim(),
      creator: "VoidStudio", // Simulate publishing as VoidStudio (default wallet user)
      category: selectedCategory,
      type: selectedCategory === '3D Objects' ? '3D Mesh' : 'Vector Graphic',
      price: parsedPrice,
      isFree: isFree,
      license: license,
      tags: tagsArray.length > 0 ? tagsArray.join(',') : 'published,vector',
      dimensions: format === 'GLB' ? '3D Vector' : '4096 x 4096 px',
      fileSize: fileSizeStr || '1.5 MB',
      format: format,
      shapeType: randomShape,
      gradient: randomGradient,
      description: description.trim() || `Generative design asset formatted as ${format}.`
    };

    try {
      const response = await api.uploadAsset(assetPayload, fileObject);
      onUploadAsset(response);
      setUploadStep('success');
      
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#8b5cf6', '#06b6d4', '#d946ef']
      });

      addToast(`Asset '${response.title}' successfully published to explore feed!`, 'success');
    } catch (err) {
      setError(`Publishing failed: ${err.message}`);
      setUploadStep('idle');
    }
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
    <div className="space-y-8 max-w-4xl mx-auto px-6 py-8">
      
      {/* HEADER */}
      <div className="reveal-on-scroll">
        <h2 className="text-3xl font-extrabold tracking-tight text-zinc-950 dark:text-zinc-50 font-sans">
          Upload Digital Asset
        </h2>
        <p className="text-zinc-500 dark:text-zinc-400 text-xs font-mono mt-1">
          Publish vectors or 3D meshes to the MORPH asset library. Secure provenance attributes automatically.
        </p>
      </div>

      <div className={`p-6 rounded-3xl reveal-on-scroll ${getMorphismCard()}`}>
        
        {uploadStep === 'idle' && (
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* DROPZONE MOCK */}
            <div className="space-y-2">
              <span className="text-xs text-zinc-500 font-semibold uppercase tracking-wider block">
                Select Graphic File
              </span>
              
              <div className="border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl p-8 text-center relative hover:bg-white/5 transition-colors cursor-pointer">
                <input
                  type="file"
                  onChange={handleFileSelect}
                  accept=".svg,.glb,.png,.jpg"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <div className="space-y-3">
                  <div className="mx-auto w-10 h-10 rounded-full bg-brand-violet/10 text-brand-violet flex items-center justify-center">
                    <Upload size={18} />
                  </div>
                  {fileSelected ? (
                    <div>
                      <div className="font-bold text-sm text-brand-cyan">{fileName}</div>
                      <div className="text-[10px] text-zinc-400 font-mono mt-0.5">SIZE: {fileSizeStr} | Detected Format: {format}</div>
                    </div>
                  ) : (
                    <div>
                      <div className="font-bold text-sm text-zinc-800 dark:text-zinc-200">
                        Drag and drop your graphic vector here
                      </div>
                      <div className="text-[10px] text-zinc-400 font-mono mt-1">
                        SUPPORTED FORMATS: PNG, SVG, JPG, GLB (Max 50MB)
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* FIELDS ROW */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Title */}
              <div className="space-y-1.5">
                <label className="text-xs text-zinc-500 font-semibold uppercase tracking-wider">Asset Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className={`w-full px-3 py-2 text-xs rounded-xl focus:outline-none ${getMorphismInput()}`}
                  placeholder="e.g. Chrome Helix wireframe"
                />
              </div>

              {/* Category selector */}
              <div className="space-y-1.5">
                <label className="text-xs text-zinc-500 font-semibold uppercase tracking-wider">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className={`w-full px-3 py-2 text-xs rounded-xl focus:outline-none font-bold ${
                    morphism === 'glass' ? 'morphism-glass border border-white/10' : morphism === 'neu' ? 'morphism-neu' : 'morphism-clay'
                  } text-zinc-700 dark:text-zinc-300`}
                >
                  {categories.filter(c => c !== 'All').map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Price Selector */}
              <div className="space-y-1.5">
                <label className="text-xs text-zinc-500 font-semibold uppercase tracking-wider block">Price Category</label>
                <div className="flex gap-2">
                  {['Free', 'Premium'].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setPriceType(val)}
                      className={`flex-1 py-2 text-xs font-bold rounded-xl border transition-all ${
                        priceType === val ? 'bg-brand-cyan/20 border-brand-cyan text-brand-cyan' : 'border-zinc-200 dark:border-zinc-800 text-zinc-500'
                      }`}
                    >
                      {val}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dynamic Price Value or License */}
              {priceType === 'Premium' ? (
                <div className="space-y-1.5">
                  <label className="text-xs text-zinc-500 font-semibold uppercase tracking-wider">License Price (USD)</label>
                  <input
                    type="number"
                    value={priceValue}
                    onChange={(e) => setPriceValue(e.target.value)}
                    className={`w-full px-3 py-2 text-xs rounded-xl focus:outline-none ${getMorphismInput()}`}
                    placeholder="12"
                  />
                </div>
              ) : (
                <div className="space-y-1.5">
                  <label className="text-xs text-zinc-500 font-semibold uppercase tracking-wider">License Tier</label>
                  <select
                    value={license}
                    onChange={(e) => setLicense(e.target.value)}
                    className={`w-full px-3 py-2 text-xs rounded-xl focus:outline-none font-bold ${
                      morphism === 'glass' ? 'morphism-glass border border-white/10' : morphism === 'neu' ? 'morphism-neu' : 'morphism-clay'
                    } text-zinc-700 dark:text-zinc-300`}
                  >
                    <option value="Personal">Personal (Non-commercial)</option>
                    <option value="Commercial">Commercial publishing</option>
                  </select>
                </div>
              )}

              {/* Tags Input */}
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs text-zinc-500 font-semibold uppercase tracking-wider block">Asset Tags (Comma separated)</label>
                <input
                  type="text"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  className={`w-full px-3 py-2 text-xs rounded-xl focus:outline-none ${getMorphismInput()}`}
                  placeholder="e.g. metallic, geometric, background, minimal"
                />
              </div>

              {/* Description */}
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs text-zinc-500 font-semibold uppercase tracking-wider block">Asset Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows="3"
                  className={`w-full px-3 py-2 text-xs rounded-xl focus:outline-none ${getMorphismInput()}`}
                  placeholder="Describe your design structure, color presets, or project compatibility details..."
                />
              </div>
            </div>

            {/* BUTTON SUBMIT */}
            <div className="pt-4 flex gap-4">
              <button
                type="submit"
                className="px-6 py-3 bg-brand-violet hover:bg-brand-violet/90 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-glow-violet/20"
              >
                Publish Design Asset
              </button>
            </div>

            {error && (
              <div className="flex items-center gap-1.5 text-xs text-rose-500 font-mono">
                <AlertTriangle size={14} />
                {error}
              </div>
            )}

          </form>
        )}

        {uploadStep === 'processing' && (
          <div className="flex flex-col items-center justify-center p-12 text-center space-y-4 font-mono">
            <RefreshCw size={36} className="text-brand-cyan animate-spin" />
            <div className="space-y-1">
              <div className="font-extrabold text-sm text-zinc-950 dark:text-zinc-50">COMPRESSING VECTOR NODES & ENCRYPTING</div>
              <p className="text-[10px] text-zinc-500 leading-normal">
                Packaging file formats into decentralized buffers and broadcasting registry parameters...
              </p>
            </div>
          </div>
        )}

        {uploadStep === 'success' && (
          <div className="flex flex-col items-center justify-center p-12 text-center space-y-6">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shadow-md">
              <Check size={24} />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-black text-zinc-950 dark:text-zinc-50 uppercase font-sans">
                Asset Successfully Published!
              </h3>
              <p className="text-xs text-zinc-500 max-w-sm font-mono mx-auto">
                Ownership certificate registered. The graphic card has been successfully appended to the Explore directory feed.
              </p>
            </div>

            <div className="flex gap-3 text-xs font-bold pt-2">
              <button
                onClick={() => setActiveTab('explore')}
                className="px-4 py-2.5 bg-brand-violet text-white rounded-xl shadow-glow-violet/10"
              >
                Go to Explore Feed
              </button>
              <button
                onClick={() => {
                  setTitle('');
                  setDescription('');
                  setFileSelected(false);
                  setFileName('');
                  setTagsInput('');
                  setUploadStep('idle');
                }}
                className="px-4 py-2.5 border border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:text-zinc-300 rounded-xl"
              >
                Upload Another Graphic
              </button>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
