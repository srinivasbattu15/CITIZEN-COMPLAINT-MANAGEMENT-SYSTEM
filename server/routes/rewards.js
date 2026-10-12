import express from 'express';
import { db } from '../db.js';

const router = express.Router();

// Get Rewards Catalog & User Points
router.get('/catalog', (req, res) => {
  const { userId } = req.query;
  const catalog = db.getRewardsCatalog();
  let userPoints = 0;
  let userBadges = [];
  let rewardsRedeemed = [];

  if (userId) {
    const u = db.findUserById(userId);
    if (u) {
      userPoints = u.points || 0;
      userBadges = u.badges || [];
      rewardsRedeemed = u.rewardsRedeemed || [];
    }
  }

  res.json({
    catalog,
    userPoints,
    userBadges,
    rewardsRedeemed
  });
});

// Redeem Reward Item
router.post('/redeem', (req, res) => {
  const { userId, rewardId } = req.body;
  if (!userId || !rewardId) {
    return res.status(400).json({ error: 'User ID and Reward ID are required.' });
  }

  try {
    const result = db.redeemReward(userId, rewardId);
    res.json({
      message: 'Reward redeemed successfully!',
      userPoints: result.user.points,
      redemption: result.redemption
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
