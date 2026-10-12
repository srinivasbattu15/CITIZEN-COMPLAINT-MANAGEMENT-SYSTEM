import mongoose from 'mongoose';

const adminProfileSchema = new mongoose.Schema({
  name: { type: String, required: true },
  title: { type: String, default: 'Municipal System Administrator' },
  email: { type: String, required: true },
  phone: { type: String, default: '+91 9554433221' },
  department: { type: String, default: 'City Governance & Operations' },
  avatarUrl: { type: String, default: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400' },
  slogan: { type: String, default: 'Building a Transparent, Citizen-First Digital City' },
  signatureBadge: { type: String, default: 'Verified Chief Administrator' },
  themeColor: { type: String, default: 'indigo' }
}, { timestamps: true });

export const AdminProfile = mongoose.model('AdminProfile', adminProfileSchema);
