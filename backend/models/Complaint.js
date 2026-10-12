import mongoose from 'mongoose';

const photoAnnotationSchema = new mongoose.Schema({
  id: String,
  x: Number,
  y: Number,
  label: String,
  note: String
}, { _id: false });

const timelineEntrySchema = new mongoose.Schema({
  status: String,
  note: String,
  timestamp: { type: Date, default: Date.now },
  updatedBy: String
}, { _id: false });

const feedbackSchema = new mongoose.Schema({
  rating: Number,
  satisfaction: String,
  comment: String,
  submittedAt: { type: Date, default: Date.now }
}, { _id: false });

const complaintSchema = new mongoose.Schema({
  id: { type: String, unique: true, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  departmentId: { type: String, required: true },
  priority: { type: String, enum: ['Low', 'Medium', 'High', 'Emergency'], default: 'Medium' },
  status: {
    type: String,
    enum: ['Submitted', 'Assigned', 'In Progress', 'Resolved', 'Rejected'],
    default: 'Submitted'
  },
  citizenId: { type: String, required: true },
  citizenName: { type: String, required: true },
  citizenEmail: { type: String, required: true },
  citizenPhone: { type: String, default: '' },
  location: { type: String, required: true },
  lat: { type: Number, default: 28.6139 },
  lng: { type: Number, default: 77.2090 },
  slaDeadline: { type: Date },
  assignedOfficerId: { type: String, default: null },
  assignedOfficerName: { type: String, default: null },
  imageUrl: { type: String, default: null },
  resolutionProofUrl: { type: String, default: null },
  resolutionNotes: { type: String, default: null },
  rewardPointsAwarded: { type: Number, default: 50 },
  photoAnnotations: { type: [photoAnnotationSchema], default: [] },
  feedback: { type: feedbackSchema, default: null },
  timeline: { type: [timelineEntrySchema], default: [] }
}, { timestamps: true });

export const Complaint = mongoose.model('Complaint', complaintSchema);
