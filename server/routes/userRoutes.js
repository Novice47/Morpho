import express from 'express';
import User from '../models/User.js';

const router = express.Router();

// USER WALLET LOGIN & REGISTRY
router.post('/login', async (req, res) => {
  try {
    const { walletAddress } = req.body;
    if (!walletAddress) return res.status(400).json({ message: 'Wallet address required' });

    let user = await User.findOne({ walletAddress: walletAddress.toLowerCase() });
    if (!user) {
      user = new User({ walletAddress: walletAddress.toLowerCase(), savedAssets: [], ownedAssets: [] });
      await user.save();
    }
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: `Login error: ${error.message}` });
  }
});

// GET USER INFO (WITH POPULATED ARRAYS)
router.get('/:address', async (req, res) => {
  try {
    const user = await User.findOne({ walletAddress: req.params.address.toLowerCase() })
      .populate('savedAssets')
      .populate('ownedAssets');
      
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: `Fetching error: ${error.message}` });
  }
});

// TOGGLE SAVE (BOOKMARK) ASSET
router.post('/save', async (req, res) => {
  try {
    const { walletAddress, assetId } = req.body;
    if (!walletAddress || !assetId) return res.status(400).json({ message: 'Missing parameters' });

    const user = await User.findOne({ walletAddress: walletAddress.toLowerCase() });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const index = user.savedAssets.indexOf(assetId);
    if (index > -1) {
      user.savedAssets.splice(index, 1); // Remove if bookmarked
    } else {
      user.savedAssets.push(assetId); // Add if not bookmarked
    }

    await user.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: `Toggle bookmark error: ${error.message}` });
  }
});

// ADD TO OWNED (ACQUIRED) LIST
router.post('/own', async (req, res) => {
  try {
    const { walletAddress, assetId } = req.body;
    if (!walletAddress || !assetId) return res.status(400).json({ message: 'Missing parameters' });

    const user = await User.findOne({ walletAddress: walletAddress.toLowerCase() });
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (!user.ownedAssets.includes(assetId)) {
      user.ownedAssets.push(assetId);
      await user.save();
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: `Acquisition registry error: ${error.message}` });
  }
});

export default router;
