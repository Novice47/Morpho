import express from 'express';
import Creator from '../models/Creator.js';

const router = express.Router();

// GET ALL CREATORS
router.get('/', async (req, res) => {
  try {
    const creatorsList = await Creator.find({});
    res.json(creatorsList);
  } catch (error) {
    res.status(500).json({ message: `Fetching creators list error: ${error.message}` });
  }
});

// GET CREATOR BY USERNAME
router.get('/:username', async (req, res) => {
  try {
    const creator = await Creator.findOne({ username: req.params.username });
    if (!creator) return res.status(404).json({ message: 'Creator not found' });
    res.json(creator);
  } catch (error) {
    res.status(500).json({ message: `Fetching creator profile error: ${error.message}` });
  }
});

export default router;
