import mongoose from 'mongoose';

const departmentSchema = new mongoose.Schema({
  id: { type: String, unique: true, required: true },
  name: { type: String, required: true },
  code: { type: String, required: true },
  slaHours: { type: Number, default: 24 },
  head: { type: String, required: true },
  activeComplaints: { type: Number, default: 0 }
}, { timestamps: true });

export const Department = mongoose.model('Department', departmentSchema);
