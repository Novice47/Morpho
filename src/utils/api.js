import { assets as localAssets } from '../data/assets';
import { creators as localCreators } from '../data/creators';

const API_BASE_URL = 'http://127.0.0.1:5000/api';

// Utility helper to check if backend is online
const checkServerHealth = async () => {
  try {
    const res = await fetch('http://127.0.0.1:5000/health');
    return res.ok;
  } catch (e) {
    return false;
  }
};

export const api = {
  // ASSETS PIPELINE
  getAssets: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.category && filters.category !== 'All') params.append('category', filters.category);
      if (filters.priceFilter && filters.priceFilter !== 'All') {
        params.append('isFree', filters.priceFilter === 'Free' ? 'true' : 'false');
      }
      if (filters.formatFilter && filters.formatFilter !== 'All') params.append('format', filters.formatFilter);
      if (filters.licenseFilter && filters.licenseFilter !== 'All') params.append('license', filters.licenseFilter);
      if (filters.sortOption) params.append('sort', filters.sortOption);

      const res = await fetch(`${API_BASE_URL}/assets?${params.toString()}`);
      if (!res.ok) throw new Error(`HTTP Error Status: ${res.status}`);
      const data = await res.json();
      console.log(`[MORPH API] successfully loaded ${data.length} assets from database.`);
      return data;
    } catch (e) {
      console.warn(`[MORPH API] Express connection fallback triggered: ${e.message}. Serving local mock assets.`);
      
      // Perform local search/filter mock fallback
      let result = [...localAssets];
      if (filters.search) {
        const q = filters.search.toLowerCase();
        result = result.filter(a => 
          a.title.toLowerCase().includes(q) || 
          a.creator.toLowerCase().includes(q) ||
          a.tags.some(t => t.toLowerCase().includes(q))
        );
      }
      if (filters.category && filters.category !== 'All') {
        result = result.filter(a => a.category === filters.category);
      }
      if (filters.priceFilter && filters.priceFilter !== 'All') {
        result = result.filter(a => filters.priceFilter === 'Free' ? a.isFree : !a.isFree);
      }
      if (filters.formatFilter && filters.formatFilter !== 'All') {
        result = result.filter(a => a.format === filters.formatFilter);
      }
      if (filters.licenseFilter && filters.licenseFilter !== 'All') {
        result = result.filter(a => a.license === filters.licenseFilter);
      }
      
      // Sorting
      if (filters.sortOption === 'Trending') result.sort((a,b) => (b.likes+b.downloads) - (a.likes+a.downloads));
      else if (filters.sortOption === 'LowHigh') result.sort((a,b) => a.price - b.price);
      else if (filters.sortOption === 'HighLow') result.sort((a,b) => b.price - a.price);
      else if (filters.sortOption === 'Downloads') result.sort((a,b) => b.downloads - a.downloads);
      else if (filters.sortOption === 'Likes') result.sort((a,b) => b.likes - a.likes);

      return result;
    }
  },

  getAssetById: async (id) => {
    try {
      const res = await fetch(`${API_BASE_URL}/assets/${id}`);
      if (!res.ok) throw new Error('Asset not found');
      return await res.json();
    } catch (e) {
      const local = localAssets.find(a => a.id === id);
      if (local) return local;
      throw new Error("Asset not found locally or on server");
    }
  },

  uploadAsset: async (assetData, file = null) => {
    try {
      const isOnline = await checkServerHealth();
      if (!isOnline) throw new Error("Backend offline");

      if (file) {
        // If a file is uploaded, use FormData for Cloudinary integration
        const formData = new FormData();
        Object.keys(assetData).forEach(key => {
          formData.append(key, assetData[key]);
        });
        formData.append('file', file);

        const res = await fetch(`${API_BASE_URL}/assets/upload`, {
          method: 'POST',
          body: formData
        });
        if (!res.ok) throw new Error('Cloudinary Upload Failed');
        return await res.json();
      } else {
        // Otherwise, send JSON metadata
        const res = await fetch(`${API_BASE_URL}/assets/upload-metadata`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(assetData)
        });
        if (!res.ok) throw new Error('Metadata Upload Failed');
        return await res.json();
      }
    } catch (e) {
      console.warn("Backend offline. Simulating local mock asset publishing.");
      return {
        ...assetData,
        id: `asset-${Date.now()}`,
        downloads: 0,
        likes: 0,
        createdAt: new Date().toISOString().split('T')[0]
      };
    }
  },

  // USERS PROFILE DATA SYNC
  loginUser: async (walletAddress) => {
    try {
      const res = await fetch(`${API_BASE_URL}/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ walletAddress })
      });
      if (!res.ok) throw new Error('Login failed');
      return await res.json();
    } catch (e) {
      // Local fallback profile
      return { walletAddress: walletAddress.toLowerCase(), savedAssets: [], ownedAssets: [] };
    }
  },

  getUserProfile: async (walletAddress) => {
    try {
      const res = await fetch(`${API_BASE_URL}/users/${walletAddress}`);
      if (!res.ok) throw new Error('Profile fetch failed');
      return await res.json();
    } catch (e) {
      return { walletAddress: walletAddress.toLowerCase(), savedAssets: [], ownedAssets: [] };
    }
  },

  toggleSaveAsset: async (walletAddress, assetId) => {
    try {
      const res = await fetch(`${API_BASE_URL}/users/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ walletAddress, assetId })
      });
      return res.ok;
    } catch (e) {
      return true; // Return true to indicate client-side update only
    }
  },

  ownAsset: async (walletAddress, assetId) => {
    try {
      const res = await fetch(`${API_BASE_URL}/users/own`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ walletAddress, assetId })
      });
      return res.ok;
    } catch (e) {
      return true;
    }
  },

  // CREATORS ENDPOINTS
  getCreators: async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/creators`);
      if (!res.ok) throw new Error('Creators fetch failed');
      return await res.json();
    } catch (e) {
      return localCreators;
    }
  },

  getCreatorByUsername: async (username) => {
    try {
      const res = await fetch(`${API_BASE_URL}/creators/${username}`);
      if (!res.ok) throw new Error('Creator fetch failed');
      return await res.json();
    } catch (e) {
      return localCreators.find(c => c.username === username);
    }
  }
};
