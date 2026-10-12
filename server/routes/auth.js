import express from 'express';
import { db } from '../db.js';

const router = express.Router();

// Login
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  const user = db.findUserByEmail(email);
  if (!user || user.password !== password) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  const { password: _, ...userWithoutPass } = user;
  res.json({ user: userWithoutPass, token: `mock-token-${user.id}` });
});

// Register Citizen
router.post('/register', (req, res) => {
  const { name, email, password, phone, address } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required.' });
  }

  const existing = db.findUserByEmail(email);
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

  db.addUser(newUser);
  const { password: _, ...userWithoutPass } = newUser;
  res.status(201).json({ user: userWithoutPass, token: `mock-token-${newUser.id}` });
});

// Switch Demo Role
router.post('/switch-demo-role', (req, res) => {
  const { role } = req.body;
  let targetEmail = 'citizen@ccms.gov';
  if (role === 'officer') targetEmail = 'officer.sanitation@ccms.gov';
  if (role === 'admin') targetEmail = 'admin@ccms.gov';

  const user = db.findUserByEmail(targetEmail);
  if (!user) {
    return res.status(404).json({ error: 'Demo user not found.' });
  }

  const { password: _, ...userWithoutPass } = user;
  res.json({ user: userWithoutPass, token: `mock-token-${user.id}` });
});

// Admin Profile Endpoints
router.get('/admin-profile', (req, res) => {
  res.json(db.getAdminProfile());
});

router.put('/admin-profile', (req, res) => {
  const updates = req.body;
  const updatedProfile = db.updateAdminProfile(updates);
  res.json(updatedProfile);
});

export default router;
