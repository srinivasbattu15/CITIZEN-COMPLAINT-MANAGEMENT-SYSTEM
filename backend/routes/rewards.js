import express from 'express';
import { db } from '../db.js';

const router = express.Router();

// Get Rewards Catalog & User Points
router.get('/catalog', async (req, res) => {
  try {
    const { userId } = req.query;
    const catalog = await db.getRewardsCatalog();
    let userPoints = 0;
    let userBadges = [];
    let rewardsRedeemed = [];

    if (userId) {
      const u = await db.findUserById(userId);
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
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to load rewards catalog' });
  }
});

// Redeem Reward Item
router.post('/redeem', async (req, res) => {
  const { userId, rewardId } = req.body;
  if (!userId || !rewardId) {
    return res.status(400).json({ error: 'User ID and Reward ID are required.' });
  }

  try {
    const result = await db.redeemReward(userId, rewardId);
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
