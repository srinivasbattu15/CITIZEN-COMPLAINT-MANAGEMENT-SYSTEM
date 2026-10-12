import mongoose from 'mongoose';

const rewardSchema = new mongoose.Schema({
  id: { type: String, unique: true, required: true },
  title: { type: String, required: true },
  category: { type: String, required: true },
  costPoints: { type: Number, required: true },
  icon: { type: String, default: 'Award' },
  description: { type: String, required: true },
  code: { type: String, required: true }
}, { timestamps: true });

export const Reward = mongoose.model('Reward', rewardSchema);
