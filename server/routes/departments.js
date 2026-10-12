import express from 'express';
import { db } from '../db.js';

const router = express.Router();

// Get list of departments
router.get('/', (req, res) => {
  res.json(db.getDepartments());
});

// Get list of officers
router.get('/officers', (req, res) => {
  res.json(db.getOfficers());
});

export default router;
