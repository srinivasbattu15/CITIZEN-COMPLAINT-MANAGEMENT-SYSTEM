import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { User } from './models/User.js';
import { Complaint } from './models/Complaint.js';
import { Department } from './models/Department.js';
import { Reward } from './models/Reward.js';
import { AdminProfile } from './models/AdminProfile.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'database.json');
const UPLOADS_DIR = path.join(__dirname, 'uploads');

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });

// Initial Seed Data
const defaultData = {
  adminProfile: {
    name: "Chief Admin Ananya Roy",
    title: "Municipal System Administrator",
    email: "admin@ccms.gov",
    phone: "+91 9554433221",
    department: "City Governance & Operations",
    avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400",
    slogan: "Building a Transparent, Citizen-First Digital City",
    signatureBadge: "Verified Chief Administrator",
    themeColor: "indigo"
  },
  rewardsCatalog: [
    {
      id: "rw-1",
      title: "10% City Metro Transport Pass",
      category: "Public Transit",
      costPoints: 100,
      icon: "Subway",
      description: "Get 10% discount on monthly municipal metro train and bus passes.",
      code: "METRO-CIVIC-10"
    },
    {
      id: "rw-2",
      title: "Free Annual City Library Membership",
      category: "Education & Culture",
      costPoints: 150,
      icon: "BookOpen",
      description: "Full digital & physical access to all municipal central libraries.",
      code: "LIB-HERO-2026"
    },
    {
      id: "rw-3",
      title: "Rs. 500 Property Tax Rebate Voucher",
      category: "Civic Perks",
      costPoints: 300,
      icon: "Ticket",
      description: "Direct discount voucher applicable on annual municipal property tax.",
      code: "TAX-REBATE-500"
    },
    {
      id: "rw-4",
      title: "Official Civic Hero Certificate",
      category: "Recognition",
      costPoints: 50,
      icon: "Award",
      description: "Digital signed Certificate of Appreciation from Mayor & City Admin.",
      code: "CERT-CIVIC-HERO"
    }
  ],
  users: [
    {
      id: "usr-101",
      name: "Rajesh Kumar",
      email: "citizen@ccms.gov",
      password: "password123",
      role: "citizen",
      phone: "+91 9876543210",
      address: "Sector 14, Main Market, City Central",
      points: 275,
      badges: ["Civic Pioneer", "Street Guardian", "Clean City Hero"],
      rewardsRedeemed: [
        { id: "rw-4", title: "Official Civic Hero Certificate", code: "CERT-CIVIC-HERO", redeemedAt: new Date(Date.now() - 86400000).toISOString() }
      ]
    },
    {
      id: "usr-102",
      name: "Priya Sharma",
      email: "priya@ccms.gov",
      password: "password123",
      role: "citizen",
      phone: "+91 9812345678",
      address: "Green Park Colony, Ward 5",
      points: 150,
      badges: ["Vigilant Inspector"],
      rewardsRedeemed: []
    },
    {
      id: "usr-103",
      name: "Amit Verma",
      email: "officer.sanitation@ccms.gov",
      password: "password123",
      role: "officer",
      phone: "+91 9988776655",
      departmentId: "dept-1",
      departmentName: "Sanitation & Waste Management",
      points: 400,
      badges: ["Top Field Officer"]
    },
    {
      id: "usr-104",
      name: "Suresh Patel",
      email: "officer.roads@ccms.gov",
      password: "password123",
      role: "officer",
      phone: "+91 9776655443",
      departmentId: "dept-2",
      departmentName: "Public Works & Roads",
      points: 350,
      badges: ["Road Safety Shield"]
    },
    {
      id: "usr-105",
      name: "Vikram Singh",
      email: "officer.electrical@ccms.gov",
      password: "password123",
      role: "officer",
      phone: "+91 9665544332",
      departmentId: "dept-3",
      departmentName: "Electricity & Street Lighting",
      points: 500,
      badges: ["Speedy Resolver"]
    },
    {
      id: "usr-106",
      name: "Chief Admin Ananya Roy",
      email: "admin@ccms.gov",
      password: "password123",
      role: "admin",
      phone: "+91 9554433221",
      departmentName: "System Administration",
      points: 1000,
      badges: ["System Director"]
    }
  ],
  departments: [
    { id: "dept-1", name: "Sanitation & Waste Management", code: "SWM", slaHours: 24, head: "Officer Amit Verma", activeComplaints: 3 },
    { id: "dept-2", name: "Public Works & Roads", code: "PWR", slaHours: 48, head: "Officer Suresh Patel", activeComplaints: 2 },
    { id: "dept-3", name: "Electricity & Street Lighting", code: "ESL", slaHours: 12, head: "Officer Vikram Singh", activeComplaints: 1 },
    { id: "dept-4", name: "Water Supply & Sewage", code: "WSS", slaHours: 24, head: "Engineer R. Sharma", activeComplaints: 1 },
    { id: "dept-5", name: "Traffic & Public Safety", code: "TPS", slaHours: 6, head: "Inspector M. Khan", activeComplaints: 0 },
    { id: "dept-6", name: "Health & Environmental Services", code: "HES", slaHours: 36, head: "Dr. K. Swaminathan", activeComplaints: 0 }
  ],
  complaints: [
    {
      id: "CCMS-2026-89412",
      title: "Overflowing Garbage Bin near Central Park Gate 2",
      description: "The commercial waste bin near the main gate of Central Park hasn't been emptied for 3 days. It is causing severe foul odor and attracting stray animals.",
      category: "Sanitation & Waste Management",
      departmentId: "dept-1",
      priority: "High",
      status: "In Progress",
      citizenId: "usr-101",
      citizenName: "Rajesh Kumar",
      citizenEmail: "citizen@ccms.gov",
      citizenPhone: "+91 9876543210",
      location: "Gate 2, Central Park, MG Road",
      lat: 28.6139,
      lng: 77.2090,
      createdAt: new Date(Date.now() - 3600 * 1000 * 18).toISOString(),
      updatedAt: new Date(Date.now() - 3600 * 1000 * 4).toISOString(),
      slaDeadline: new Date(Date.now() + 3600 * 1000 * 6).toISOString(),
      assignedOfficerId: "usr-103",
      assignedOfficerName: "Amit Verma",
      imageUrl: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&q=80&w=800",
      resolutionProofUrl: null,
      resolutionNotes: null,
      rewardPointsAwarded: 50,
      photoAnnotations: [
        { id: "pin-1", x: 45, y: 55, label: "Overflowing Waste", note: "Trash spilling onto public footpath causing blockage." }
      ],
      feedback: null,
      timeline: [
        { status: "Submitted", note: "Complaint registered with photo annotation (+50 Civic Points awarded)", timestamp: new Date(Date.now() - 3600 * 1000 * 18).toISOString(), updatedBy: "Rajesh Kumar" },
        { status: "Assigned", note: "Verified by Admin Ananya Roy and assigned to Sanitation Department (Officer Amit Verma)", timestamp: new Date(Date.now() - 3600 * 1000 * 14).toISOString(), updatedBy: "Ananya Roy" },
        { status: "In Progress", note: "Municipal Sanitation truck dispatched to location.", timestamp: new Date(Date.now() - 3600 * 1000 * 4).toISOString(), updatedBy: "Amit Verma" }
      ]
    },
    {
      id: "CCMS-2026-47120",
      title: "Hazardous Deep Pothole on Main Highway Flyover",
      description: "A 2-foot deep pothole has formed right at the end of the flyover ramp. Two motorbikes were damaged yesterday night. Requires urgent patch work.",
      category: "Public Works & Roads",
      departmentId: "dept-2",
      priority: "Emergency",
      status: "Assigned",
      citizenId: "usr-102",
      citizenName: "Priya Sharma",
      citizenEmail: "priya@ccms.gov",
      citizenPhone: "+91 9812345678",
      location: "Outer Ring Road Flyover Ramp, South Exit",
      lat: 28.6210,
      lng: 77.2150,
      createdAt: new Date(Date.now() - 3600 * 1000 * 8).toISOString(),
      updatedAt: new Date(Date.now() - 3600 * 1000 * 6).toISOString(),
      slaDeadline: new Date(Date.now() + 3600 * 1000 * 40).toISOString(),
      assignedOfficerId: "usr-104",
      assignedOfficerName: "Suresh Patel",
      imageUrl: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&q=80&w=800",
      resolutionProofUrl: null,
      resolutionNotes: null,
      rewardPointsAwarded: 50,
      photoAnnotations: [
        { id: "pin-2", x: 50, y: 60, label: "Deep Crater", note: "Crater depth exceeding 20cm posing immediate accident hazard." }
      ],
      feedback: null,
      timeline: [
        { status: "Submitted", note: "Emergency complaint logged by citizen.", timestamp: new Date(Date.now() - 3600 * 1000 * 8).toISOString(), updatedBy: "Priya Sharma" },
        { status: "Assigned", note: "Priority escalated to EMERGENCY. Assigned to Road Inspection Squad.", timestamp: new Date(Date.now() - 3600 * 1000 * 6).toISOString(), updatedBy: "Ananya Roy" }
      ]
    },
    {
      id: "CCMS-2026-31890",
      title: "Non-functional Streetlights along School Zone",
      description: "Streetlights from Pole #14 to #22 have been flickering and completely dark for the past two days, causing safety concerns for students attending evening tuition.",
      category: "Electricity & Street Lighting",
      departmentId: "dept-3",
      priority: "Medium",
      status: "Resolved",
      citizenId: "usr-101",
      citizenName: "Rajesh Kumar",
      citizenEmail: "citizen@ccms.gov",
      citizenPhone: "+91 9876543210",
      location: "St. Mary School Lane, Ward 8",
      lat: 28.6080,
      lng: 77.2020,
      createdAt: new Date(Date.now() - 3600 * 1000 * 48).toISOString(),
      updatedAt: new Date(Date.now() - 3600 * 1000 * 10).toISOString(),
      slaDeadline: new Date(Date.now() - 3600 * 1000 * 36).toISOString(),
      assignedOfficerId: "usr-105",
      assignedOfficerName: "Vikram Singh",
      imageUrl: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&q=80&w=800",
      resolutionProofUrl: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&q=80&w=800",
      resolutionNotes: "Transformer fuse replaced and 8 LED bulbs upgraded with weatherproof luminaires.",
      rewardPointsAwarded: 150,
      photoAnnotations: [],
      feedback: {
        rating: 5,
        satisfaction: "Excellent",
        comment: "Fixed very quickly! The entire road is brightly lit now. Great service!",
        submittedAt: new Date(Date.now() - 3600 * 1000 * 8).toISOString()
      },
      timeline: [
        { status: "Submitted", note: "Complaint logged.", timestamp: new Date(Date.now() - 3600 * 1000 * 48).toISOString(), updatedBy: "Rajesh Kumar" },
        { status: "Assigned", note: "Assigned to Electrical maintenance team.", timestamp: new Date(Date.now() - 3600 * 1000 * 44).toISOString(), updatedBy: "Ananya Roy" },
        { status: "In Progress", note: "Field engineers on-site testing substation junction.", timestamp: new Date(Date.now() - 3600 * 1000 * 20).toISOString(), updatedBy: "Vikram Singh" },
        { status: "Resolved", note: "Lights restored and verified with operational proof photo.", timestamp: new Date(Date.now() - 3600 * 1000 * 10).toISOString(), updatedBy: "Vikram Singh" }
      ]
    }
  ]
};

class MongoDBStore {
  constructor() {
    this.isConnected = false;
    this.fallbackData = null;
    this.loadFallbackData();
  }

  loadFallbackData() {
    try {
      if (fs.existsSync(DB_FILE)) {
        this.fallbackData = JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
      } else {
        this.fallbackData = JSON.parse(JSON.stringify(defaultData));
        fs.writeFileSync(DB_FILE, JSON.stringify(this.fallbackData, null, 2));
      }
    } catch {
      this.fallbackData = JSON.parse(JSON.stringify(defaultData));
    }
  }

  saveFallbackData() {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(this.fallbackData, null, 2));
    } catch (err) {
      console.error('Failed saving fallback data:', err);
    }
  }

  formatMongoUri(rawUri) {
    if (!rawUri) return rawUri;
    const match = rawUri.match(/^(mongodb(?:\+srv)?:\/\/)([^:]+):(.*)@([^/?#]+)(.*)$/);
    if (match) {
      const [, protocol, user, pass, host, rest] = match;
      const decodedPass = decodeURIComponent(pass);
      const encodedPass = encodeURIComponent(decodedPass);
      return `${protocol}${user}:${encodedPass}@${host}${rest}`;
    }
    return rawUri;
  }

  async connect(uri) {
    const rawUri = uri || process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ccms';
    const mongoUri = this.formatMongoUri(rawUri);
    try {
      await mongoose.connect(mongoUri, {
        serverSelectionTimeoutMS: 8000
      });
      this.isConnected = true;
      console.log(`🍃 MongoDB Connected Successfully to: ${mongoUri.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@')}`);
      await this.seedInitialData();
    } catch (err) {
      this.isConnected = false;
      console.warn(`⚠️ MongoDB connection unavailable (${err.message}). Using persistent local fallback storage.`);
      console.warn(`👉 To connect to MongoDB, ensure MongoDB is running or provide MONGODB_URI in backend/.env`);
    }
  }

  async seedInitialData() {
    if (!this.isConnected) return;
    try {
      const userCount = await User.countDocuments();
      if (userCount === 0) {
        console.log('🌱 Seeding initial MongoDB users...');
        await User.insertMany(defaultData.users);
      }

      const deptCount = await Department.countDocuments();
      if (deptCount === 0) {
        console.log('🌱 Seeding initial MongoDB departments...');
        await Department.insertMany(defaultData.departments);
      }

      const complaintCount = await Complaint.countDocuments();
      if (complaintCount === 0) {
        console.log('🌱 Seeding initial MongoDB complaints...');
        await Complaint.insertMany(defaultData.complaints);
      }

      const rewardCount = await Reward.countDocuments();
      if (rewardCount === 0) {
        console.log('🌱 Seeding initial MongoDB rewards catalog...');
        await Reward.insertMany(defaultData.rewardsCatalog);
      }

      const profileCount = await AdminProfile.countDocuments();
      if (profileCount === 0) {
        console.log('🌱 Seeding initial MongoDB admin profile...');
        await AdminProfile.create(defaultData.adminProfile);
      }
    } catch (seedErr) {
      console.error('Error seeding initial MongoDB collections:', seedErr);
    }
  }

  // --- Users ---
  async findUserByEmail(email) {
    if (this.isConnected) {
      return await User.findOne({ email: email.toLowerCase() }).lean();
    }
    return this.fallbackData.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  async findUserById(id) {
    if (this.isConnected) {
      return await User.findOne({ id }).lean();
    }
    return this.fallbackData.users.find(u => u.id === id);
  }

  async addUser(userData) {
    if (this.isConnected) {
      const created = await User.create(userData);
      return created.toObject();
    }
    this.fallbackData.users.push(userData);
    this.saveFallbackData();
    return userData;
  }

  async awardPoints(userId, pts, badgeName) {
    if (this.isConnected) {
      const user = await User.findOne({ id: userId });
      if (!user) return null;
      user.points = (user.points || 0) + pts;
      if (badgeName && !user.badges.includes(badgeName)) {
        user.badges.push(badgeName);
      }
      if (user.points >= 200 && !user.badges.includes("Street Guardian")) {
        user.badges.push("Street Guardian");
      }
      if (user.points >= 400 && !user.badges.includes("Clean City Hero")) {
        user.badges.push("Clean City Hero");
      }
      await user.save();
      return user.toObject();
    }

    const u = this.fallbackData.users.find(u => u.id === userId);
    if (!u) return null;
    u.points = (u.points || 0) + pts;
    if (badgeName && !u.badges.includes(badgeName)) u.badges.push(badgeName);
    if (u.points >= 200 && !u.badges.includes("Street Guardian")) u.badges.push("Street Guardian");
    if (u.points >= 400 && !u.badges.includes("Clean City Hero")) u.badges.push("Clean City Hero");
    this.saveFallbackData();
    return u;
  }

  // --- Rewards ---
  async getRewardsCatalog() {
    if (this.isConnected) {
      return await Reward.find().lean();
    }
    return this.fallbackData.rewardsCatalog || defaultData.rewardsCatalog;
  }

  async redeemReward(userId, rewardId) {
    const user = await this.findUserById(userId);
    const catalog = await this.getRewardsCatalog();
    const reward = catalog.find(r => r.id === rewardId);

    if (!user || !reward) throw new Error('Invalid user or reward selected.');
    if ((user.points || 0) < reward.costPoints) {
      throw new Error(`Insufficient points! You need ${reward.costPoints} PTS (Current: ${user.points || 0} PTS).`);
    }

    const redemptionRecord = {
      id: reward.id,
      title: reward.title,
      code: `${reward.code}-${Math.floor(1000 + Math.random() * 9000)}`,
      redeemedAt: new Date().toISOString()
    };

    if (this.isConnected) {
      const dbUser = await User.findOne({ id: userId });
      dbUser.points -= reward.costPoints;
      dbUser.rewardsRedeemed.unshift(redemptionRecord);
      await dbUser.save();
      return { user: dbUser.toObject(), redemption: redemptionRecord };
    }

    user.points -= reward.costPoints;
    if (!user.rewardsRedeemed) user.rewardsRedeemed = [];
    user.rewardsRedeemed.unshift(redemptionRecord);
    this.saveFallbackData();
    return { user, redemption: redemptionRecord };
  }

  // --- Departments ---
  async getDepartments() {
    if (this.isConnected) {
      return await Department.find().lean();
    }
    return this.fallbackData.departments;
  }

  async getDepartmentById(id) {
    if (this.isConnected) {
      return await Department.findOne({ id }).lean();
    }
    return this.fallbackData.departments.find(d => d.id === id);
  }

  async getOfficers() {
    if (this.isConnected) {
      return await User.find({ role: 'officer' }, '-password').lean();
    }
    return this.fallbackData.users
      .filter(u => u.role === 'officer')
      .map(({ password, ...rest }) => rest);
  }

  // --- Complaints ---
  async getComplaints(filters = {}) {
    if (this.isConnected) {
      const query = {};
      if (filters.citizenId) query.citizenId = filters.citizenId;
      if (filters.assignedOfficerId) query.assignedOfficerId = filters.assignedOfficerId;
      if (filters.departmentId) query.departmentId = filters.departmentId;
      if (filters.status) query.status = filters.status;
      if (filters.priority) query.priority = filters.priority;
      if (filters.search) {
        const q = new RegExp(filters.search, 'i');
        query.$or = [{ id: q }, { title: q }, { location: q }, { category: q }];
      }
      return await Complaint.find(query).sort({ createdAt: -1 }).lean();
    }

    let list = [...this.fallbackData.complaints];
    if (filters.citizenId) list = list.filter(c => c.citizenId === filters.citizenId);
    if (filters.assignedOfficerId) list = list.filter(c => c.assignedOfficerId === filters.assignedOfficerId);
    if (filters.departmentId) list = list.filter(c => c.departmentId === filters.departmentId);
    if (filters.status) list = list.filter(c => c.status === filters.status);
    if (filters.priority) list = list.filter(c => c.priority === filters.priority);
    if (filters.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(c =>
        c.id.toLowerCase().includes(q) ||
        c.title.toLowerCase().includes(q) ||
        c.location.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q)
      );
    }
    return list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  async getComplaintById(id) {
    if (this.isConnected) {
      return await Complaint.findOne({ id: new RegExp(`^${id}$`, 'i') }).lean();
    }
    return this.fallbackData.complaints.find(c => c.id.toUpperCase() === id.toUpperCase());
  }

  async addComplaint(complaintData) {
    if (this.isConnected) {
      const created = await Complaint.create(complaintData);
      if (complaintData.citizenId) {
        await this.awardPoints(complaintData.citizenId, 50, "Civic Inspector");
      }
      return created.toObject();
    }

    this.fallbackData.complaints.unshift(complaintData);
    if (complaintData.citizenId) {
      this.awardPoints(complaintData.citizenId, 50, "Civic Inspector");
    }
    this.saveFallbackData();
    return complaintData;
  }

  async updateComplaint(id, updates) {
    if (this.isConnected) {
      const oldComplaint = await Complaint.findOne({ id: new RegExp(`^${id}$`, 'i') });
      if (!oldComplaint) return null;

      // Award bonus points on resolution
      if (updates.status === 'Resolved' && oldComplaint.status !== 'Resolved') {
        if (oldComplaint.citizenId) {
          await this.awardPoints(oldComplaint.citizenId, 100, "Clean City Champion");
        }
      }

      const updated = await Complaint.findOneAndUpdate(
        { id: new RegExp(`^${id}$`, 'i') },
        { $set: { ...updates, updatedAt: new Date() } },
        { new: true }
      ).lean();
      return updated;
    }

    const idx = this.fallbackData.complaints.findIndex(c => c.id.toUpperCase() === id.toUpperCase());
    if (idx === -1) return null;
    const oldComplaint = this.fallbackData.complaints[idx];
    const updated = { ...oldComplaint, ...updates, updatedAt: new Date().toISOString() };
    if (updates.status === 'Resolved' && oldComplaint.status !== 'Resolved') {
      if (oldComplaint.citizenId) {
        this.awardPoints(oldComplaint.citizenId, 100, "Clean City Champion");
      }
    }
    this.fallbackData.complaints[idx] = updated;
    this.saveFallbackData();
    return updated;
  }

  async addTimelineEntry(complaintId, entry) {
    const fullEntry = { ...entry, timestamp: new Date() };
    if (this.isConnected) {
      await Complaint.updateOne(
        { id: new RegExp(`^${complaintId}$`, 'i') },
        { $push: { timeline: fullEntry } }
      );
      return await this.getComplaintById(complaintId);
    }

    const complaint = this.getComplaintById(complaintId);
    if (!complaint) return null;
    if (!complaint.timeline) complaint.timeline = [];
    complaint.timeline.push({ ...entry, timestamp: new Date().toISOString() });
    this.saveFallbackData();
    return complaint;
  }

  // --- Analytics ---
  async getAnalytics() {
    const complaints = await this.getComplaints();
    const departments = await this.getDepartments();

    const total = complaints.length;
    const submitted = complaints.filter(c => c.status === 'Submitted').length;
    const assigned = complaints.filter(c => c.status === 'Assigned').length;
    const inProgress = complaints.filter(c => c.status === 'In Progress').length;
    const resolved = complaints.filter(c => c.status === 'Resolved').length;
    const rejected = complaints.filter(c => c.status === 'Rejected').length;

    const now = new Date();
    const slaBreaches = complaints.filter(
      c => c.status !== 'Resolved' && c.status !== 'Rejected' && new Date(c.slaDeadline) < now
    ).length;

    const categoryCounts = {};
    complaints.forEach(c => {
      categoryCounts[c.category] = (categoryCounts[c.category] || 0) + 1;
    });

    const departmentPerformance = departments.map(d => {
      const deptComplaints = complaints.filter(c => c.departmentId === d.id);
      const totalDept = deptComplaints.length;
      const resolvedDept = deptComplaints.filter(c => c.status === 'Resolved').length;
      return {
        id: d.id,
        name: d.name,
        total: totalDept,
        resolved: resolvedDept,
        pending: totalDept - resolvedDept
      };
    });

    return {
      total,
      submitted,
      assigned,
      inProgress,
      resolved,
      rejected,
      slaBreaches,
      categoryCounts,
      departmentPerformance
    };
  }

  // --- Admin Profile ---
  async getAdminProfile() {
    if (this.isConnected) {
      const profile = await AdminProfile.findOne().lean();
      return profile || defaultData.adminProfile;
    }
    return this.fallbackData.adminProfile || defaultData.adminProfile;
  }

  async updateAdminProfile(updates) {
    if (this.isConnected) {
      const updated = await AdminProfile.findOneAndUpdate({}, updates, { new: true, upsert: true }).lean();
      return updated;
    }
    this.fallbackData.adminProfile = { ...this.fallbackData.adminProfile, ...updates };
    this.saveFallbackData();
    return this.fallbackData.adminProfile;
  }
}

export const db = new MongoDBStore();
export { User, Complaint, Department, Reward, AdminProfile };
