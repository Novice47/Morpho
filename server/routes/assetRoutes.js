import express from 'express';
import Asset from '../models/Asset.js';
import { upload } from '../config/cloudinary.js';

const router = express.Router();

// GET ALL ASSETS (WITH FILTERING & SORTING)
router.get('/', async (req, res) => {
  try {
    const { search, category, isFree, format, license, sort } = req.query;
    let queryObj = {};

    // 1. Keyword search (title, tags, creator)
    if (search) {
      const regex = new RegExp(search, 'i');
      queryObj.$or = [
        { title: regex },
        { creator: regex },
        { tags: { $in: [regex] } }
      ];
    }

    // 2. Category Filter
    if (category && category !== 'All') {
      queryObj.category = category;
    }

    // 3. Price Filter (Free vs Premium)
    if (isFree) {
      queryObj.isFree = isFree === 'true';
    }

    // 4. File Format Filter
    if (format && format !== 'All') {
      queryObj.format = format;
    }

    // 5. License Filter
    if (license && license !== 'All') {
      queryObj.license = license;
    }

    // Sort setup
    let sortObj = {};
    if (sort === 'Trending') {
      sortObj.likes = -1;
      sortObj.downloads = -1;
    } else if (sort === 'LowHigh') {
      sortObj.price = 1;
    } else if (sort === 'HighLow') {
      sortObj.price = -1;
    } else if (sort === 'Downloads') {
      sortObj.downloads = -1;
    } else if (sort === 'Likes') {
      sortObj.likes = -1;
    } else {
      sortObj.createdAt = -1; // Default: newest
    }

    const assets = await Asset.find(queryObj).sort(sortObj);
    res.json(assets);
  } catch (error) {
    res.status(500).json({ message: `Error fetching assets: ${error.message}` });
  }
});

// GET ASSET BY ID
router.get('/:id', async (req, res) => {
  try {
    const asset = await Asset.findById(req.params.id);
    if (!asset) return res.status(404).json({ message: 'Asset not found' });
    res.json(asset);
  } catch (error) {
    res.status(500).json({ message: `Error fetching asset: ${error.message}` });
  }
});

// UPLOAD ASSET FILE TO CLOUDINARY AND SAVE TO DB
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const { title, creator, category, type, price, isFree, license, tags, dimensions, fileSize, format, shapeType, gradient, description } = req.body;
    
    // Check if Cloudinary upload succeeded
    const url = req.file ? req.file.path : null;

    const tagsArray = tags ? tags.split(',').map(t => t.trim()) : [];

    const newAsset = new Asset({
      title,
      creator,
      category,
      type,
      price: Number(price) || 0,
      isFree: isFree === 'true',
      license,
      tags: tagsArray,
      dimensions,
      fileSize: fileSize || (req.file ? `${(req.file.size / (1024 * 1024)).toFixed(2)} MB` : '1.5 MB'),
      format,
      shapeType,
      gradient,
      url,
      description
    });

    const savedAsset = await newAsset.save();
    res.status(201).json(savedAsset);
  } catch (error) {
    res.status(500).json({ message: `Upload error: ${error.message}` });
  }
});

// METADATA ONLY BACKFALL UPLOAD
router.post('/upload-metadata', async (req, res) => {
  try {
    const assetData = req.body;
    const newAsset = new Asset(assetData);
    const savedAsset = await newAsset.save();
    res.status(201).json(savedAsset);
  } catch (error) {
    res.status(500).json({ message: `Metadata upload error: ${error.message}` });
  }
});

export default router;
