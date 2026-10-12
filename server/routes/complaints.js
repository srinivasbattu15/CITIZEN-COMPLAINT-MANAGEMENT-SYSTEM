import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { db } from '../db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// AI Smart Analyzer
router.post('/ai-analyze', (req, res) => {
  const { description, title } = req.body;
  const text = ((title || '') + ' ' + (description || '')).toLowerCase();

  let category = "Sanitation & Waste Management";
  let departmentId = "dept-1";
  let priority = "Medium";
  let confidence = "96%";

  if (text.includes('pothole') || text.includes('road') || text.includes('bridge') || text.includes('crack') || text.includes('flyover')) {
    category = "Public Works & Roads";
    departmentId = "dept-2";
    if (text.includes('deep') || text.includes('accident') || text.includes('highway') || text.includes('damage')) {
      priority = "High";
    }
  } else if (text.includes('light') || text.includes('electricity') || text.includes('power') || text.includes('wire') || text.includes('lamp') || text.includes('spark')) {
    category = "Electricity & Street Lighting";
    departmentId = "dept-3";
    if (text.includes('spark') || text.includes('fire') || text.includes('hanging')) {
      priority = "Emergency";
    }
  } else if (text.includes('water') || text.includes('sewage') || text.includes('pipe') || text.includes('leak') || text.includes('drain') || text.includes('tap')) {
    category = "Water Supply & Sewage";
    departmentId = "dept-4";
    if (text.includes('dirty') || text.includes('contaminate') || text.includes('overflow')) {
      priority = "High";
    }
  } else if (text.includes('traffic') || text.includes('signal') || text.includes('parked') || text.includes('jam') || text.includes('encroach')) {
    category = "Traffic & Public Safety";
    departmentId = "dept-5";
  } else if (text.includes('garbage') || text.includes('trash') || text.includes('dump') || text.includes('odor') || text.includes('waste')) {
    category = "Sanitation & Waste Management";
    departmentId = "dept-1";
  }

  if (text.includes('urgent') || text.includes('emergency') || text.includes('immediate') || text.includes('danger')) {
    priority = "Emergency";
  }

  res.json({
    category,
    departmentId,
    priority,
    confidence,
    summary: `Complaint classified under '${category}' with suggested priority '${priority}'.`
  });
});

// Image Upload Endpoint
router.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No image file uploaded.' });
  }
  const fileUrl = `/uploads/${req.file.filename}`;
  res.json({ imageUrl: fileUrl });
});

// Get Complaints List
router.get('/', (req, res) => {
  const { citizenId, assignedOfficerId, departmentId, status, priority, search } = req.query;
  const complaints = db.getComplaints({ citizenId, assignedOfficerId, departmentId, status, priority, search });
  res.json(complaints);
});

// Track / Get Single Complaint
router.get('/:id', (req, res) => {
  const complaint = db.getComplaintById(req.params.id);
  if (!complaint) {
    return res.status(404).json({ error: 'Complaint not found with provided ID.' });
  }
  res.json(complaint);
});

// Submit New Complaint
router.post('/', (req, res) => {
  const {
    title,
    description,
    category,
    departmentId,
    priority,
    citizenId,
    citizenName,
    citizenEmail,
    citizenPhone,
    location,
    lat,
    lng,
    imageUrl,
    photoAnnotations
  } = req.body;

  if (!title || !description || !category) {
    return res.status(400).json({ error: 'Title, description, and category are required.' });
  }

  const randomCode = Math.floor(10000 + Math.random() * 90000);
  const complaintId = `CCMS-2026-${randomCode}`;

  const dept = db.getDepartmentById(departmentId) || db.getDepartments()[0];
  const slaHours = dept ? dept.slaHours : 24;
  const slaDeadline = new Date(Date.now() + slaHours * 3600 * 1000).toISOString();

  const newComplaint = {
    id: complaintId,
    title,
    description,
    category,
    departmentId: departmentId || dept.id,
    priority: priority || 'Medium',
    status: 'Submitted',
    citizenId: citizenId || 'usr-101',
    citizenName: citizenName || 'Anonymous Citizen',
    citizenEmail: citizenEmail || 'citizen@ccms.gov',
    citizenPhone: citizenPhone || '',
    location: location || 'City Central',
    lat: lat || 28.6139,
    lng: lng || 77.2090,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    slaDeadline,
    assignedOfficerId: null,
    assignedOfficerName: null,
    imageUrl: imageUrl || null,
    photoAnnotations: photoAnnotations || [],
    resolutionProofUrl: null,
    resolutionNotes: null,
    rewardPointsAwarded: 50,
    feedback: null,
    timeline: [
      {
        status: 'Submitted',
        note: `Grievance registered with photo annotations (+50 Civic Reward Points awarded)`,
        timestamp: new Date().toISOString(),
        updatedBy: citizenName || 'Citizen'
      }
    ]
  };

  db.addComplaint(newComplaint);
  res.status(201).json(newComplaint);
});

// Admin Assign Officer
router.patch('/:id/assign', (req, res) => {
  const { id } = req.params;
  const { officerId, officerName, departmentId, adminName } = req.body;

  const complaint = db.getComplaintById(id);
  if (!complaint) return res.status(404).json({ error: 'Complaint not found.' });

  const updates = {
    assignedOfficerId: officerId,
    assignedOfficerName: officerName,
    departmentId: departmentId || complaint.departmentId,
    status: complaint.status === 'Submitted' ? 'Assigned' : complaint.status
  };

  db.updateComplaint(id, updates);
  db.addTimelineEntry(id, {
    status: 'Assigned',
    note: `Assigned to Officer ${officerName}`,
    updatedBy: adminName || 'Admin'
  });

  res.json(db.getComplaintById(id));
});

// Update Status
router.patch('/:id/status', (req, res) => {
  const { id } = req.params;
  const { status, note, updatedBy, resolutionProofUrl, resolutionNotes } = req.body;

  const complaint = db.getComplaintById(id);
  if (!complaint) return res.status(404).json({ error: 'Complaint not found.' });

  const updates = { status };
  if (resolutionProofUrl) updates.resolutionProofUrl = resolutionProofUrl;
  if (resolutionNotes) updates.resolutionNotes = resolutionNotes;

  db.updateComplaint(id, updates);
  db.addTimelineEntry(id, {
    status,
    note: note || `Status changed to ${status}`,
    updatedBy: updatedBy || 'System Officer'
  });

  res.json(db.getComplaintById(id));
});

// Submit Feedback
router.post('/:id/feedback', (req, res) => {
  const { id } = req.params;
  const { rating, comment } = req.body;

  const complaint = db.getComplaintById(id);
  if (!complaint) return res.status(404).json({ error: 'Complaint not found.' });

  const feedbackObj = {
    rating: Number(rating) || 5,
    comment: comment || '',
    createdAt: new Date().toISOString()
  };

  db.updateComplaint(id, { feedback: feedbackObj });
  db.addTimelineEntry(id, {
    status: 'Feedback Received',
    note: `Citizen rated ${rating}/5 stars: "${comment}" (+25 Civic Bonus Points)`,
    updatedBy: complaint.citizenName
  });

  // Award citizen +25 bonus points for feedback!
  if (complaint.citizenId) {
    db.awardPoints(complaint.citizenId, 25, "Civic Evaluator");
  }

  res.json(db.getComplaintById(id));
});

export default router;
