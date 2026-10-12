import express from 'express';
import { db } from '../db.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const analytics = await db.getAnalytics();
    res.json(analytics);
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to load analytics' });
  }
});

export default router;
