import express from 'express';
import { db } from '../db.js';

const router = express.Router();

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const user = await db.findUserByEmail(email);
    if (!user || user.password !== password) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const { password: _, ...userWithoutPass } = user;
    res.json({ user: userWithoutPass, token: `mock-token-${user.id}` });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Login failed' });
  }
});

// Register Citizen
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required.' });
    }

    const existing = await db.findUserByEmail(email);
    if (existing) {
      return res.status(400).json({ error: 'An account with this email already exists.' });
    }

    const newUser = {
      id: `usr-${Date.now()}`,
      name,
      email,
      password,
      role: 'citizen',
      phone: phone || '',
      address: address || '',
      points: 50,
      badges: ["Civic Pioneer"],
      rewardsRedeemed: []
    };

    const created = await db.addUser(newUser);
    const { password: _, ...userWithoutPass } = created;
    res.status(201).json({ user: userWithoutPass, token: `mock-token-${created.id}` });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Registration failed' });
  }
});

// Switch Demo Role
router.post('/switch-demo-role', async (req, res) => {
  try {
    const { role } = req.body;
    let targetEmail = 'citizen@ccms.gov';
    if (role === 'officer') targetEmail = 'officer.sanitation@ccms.gov';
    if (role === 'admin') targetEmail = 'admin@ccms.gov';

    const user = await db.findUserByEmail(targetEmail);
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const { password: _, ...userWithoutPass } = user;
    res.json({ user: userWithoutPass, token: `mock-token-${user.id}` });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Role switch failed' });
  }
});

// Admin Profile Endpoints
router.get('/admin-profile', async (req, res) => {
  try {
    const profile = await db.getAdminProfile();
    res.json(profile);
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to load admin profile' });
  }
});

router.put('/admin-profile', async (req, res) => {
  try {
    const updates = req.body;
    const updatedProfile = await db.updateAdminProfile(updates);
    res.json(updatedProfile);
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to update admin profile' });
  }
});

export default router;
