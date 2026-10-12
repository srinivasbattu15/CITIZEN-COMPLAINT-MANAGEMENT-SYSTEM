import express from 'express';
import { db } from '../db.js';

const router = express.Router();

// Get list of departments
router.get('/', async (req, res) => {
  try {
    const departments = await db.getDepartments();
    res.json(departments);
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to load departments' });
  }
});

// Get list of officers
router.get('/officers', async (req, res) => {
  try {
    const officers = await db.getOfficers();
    res.json(officers);
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to load officers' });
  }
});

export default router;
