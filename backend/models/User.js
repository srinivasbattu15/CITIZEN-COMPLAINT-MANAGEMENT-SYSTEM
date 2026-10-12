import mongoose from 'mongoose';

const rewardRedeemedSchema = new mongoose.Schema({
  id: String,
  title: String,
  code: String,
  redeemedAt: { type: Date, default: Date.now }
}, { _id: false });

const userSchema = new mongoose.Schema({
  id: { type: String, unique: true, required: true },
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['citizen', 'officer', 'admin'], default: 'citizen' },
  phone: { type: String, default: '' },
  address: { type: String, default: '' },
  departmentId: { type: String, default: '' },
  departmentName: { type: String, default: '' },
  points: { type: Number, default: 0 },
  badges: { type: [String], default: [] },
  rewardsRedeemed: { type: [rewardRedeemedSchema], default: [] }
}, { timestamps: true });

export const User = mongoose.model('User', userSchema);
