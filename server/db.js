import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'database.json');
const UPLOADS_DIR = path.join(__dirname, 'uploads');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

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
      lat: 28.5355,
      lng: 77.2610,
      createdAt: new Date(Date.now() - 3600 * 1000 * 10).toISOString(),
      updatedAt: new Date(Date.now() - 3600 * 1000 * 8).toISOString(),
      slaDeadline: new Date(Date.now() + 3600 * 1000 * 38).toISOString(),
      assignedOfficerId: "usr-104",
      assignedOfficerName: "Suresh Patel",
      imageUrl: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&q=80&w=800",
      resolutionProofUrl: null,
      resolutionNotes: null,
      rewardPointsAwarded: 50,
      photoAnnotations: [
        { id: "pin-2", x: 60, y: 70, label: "2ft Deep Road Trench", note: "Extreme hazard for night commuters & two wheelers." }
      ],
      feedback: null,
      timeline: [
        { status: "Submitted", note: "Complaint registered (+50 Civic Points awarded)", timestamp: new Date(Date.now() - 3600 * 1000 * 10).toISOString(), updatedBy: "Priya Sharma" },
        { status: "Assigned", note: "Flagged as Emergency. Assigned to Road Inspection Officer Suresh Patel.", timestamp: new Date(Date.now() - 3600 * 1000 * 8).toISOString(), updatedBy: "Ananya Roy" }
      ]
    },
    {
      id: "CCMS-2026-10394",
      title: "Non-functional Streetlights in Block B Residential Area",
      description: "All 5 streetlights along Lane 4 are flickering or completely dead, making the lane unsafe for pedestrians at night.",
      category: "Electricity & Street Lighting",
      departmentId: "dept-3",
      priority: "Medium",
      status: "Resolved",
      citizenId: "usr-101",
      citizenName: "Rajesh Kumar",
      citizenEmail: "citizen@ccms.gov",
      citizenPhone: "+91 9876543210",
      location: "Block B, Lane 4, Vasant Kunj",
      lat: 28.5244,
      lng: 77.1588,
      createdAt: new Date(Date.now() - 3600 * 1000 * 72).toISOString(),
      updatedAt: new Date(Date.now() - 3600 * 1000 * 24).toISOString(),
      slaDeadline: new Date(Date.now() - 3600 * 1000 * 60).toISOString(),
      assignedOfficerId: "usr-105",
      assignedOfficerName: "Vikram Singh",
      imageUrl: "https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&q=80&w=800",
      resolutionProofUrl: "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&q=80&w=800",
      resolutionNotes: "Replaced faulty transformer fuse and installed 5 new LED energy-efficient street lamps.",
      rewardPointsAwarded: 175,
      photoAnnotations: [
        { id: "pin-3", x: 30, y: 40, label: "Faulty Lamp Pole", note: "Dead LED bulb requiring fixture replacement." }
      ],
      feedback: {
        rating: 5,
        comment: "Excellent response time! The lane is brightly lit now. Thank you CCMS team!",
        createdAt: new Date(Date.now() - 3600 * 1000 * 12).toISOString()
      },
      timeline: [
        { status: "Submitted", note: "Complaint submitted (+50 Civic Points)", timestamp: new Date(Date.now() - 3600 * 1000 * 72).toISOString(), updatedBy: "Rajesh Kumar" },
        { status: "Assigned", note: "Assigned to Officer Vikram Singh", timestamp: new Date(Date.now() - 3600 * 1000 * 68).toISOString(), updatedBy: "Ananya Roy" },
        { status: "In Progress", note: "Electrical crew dispatched with ladder vehicle.", timestamp: new Date(Date.now() - 3600 * 1000 * 40).toISOString(), updatedBy: "Vikram Singh" },
        { status: "Resolved", note: "LED lamps installed & verified functional (+100 Resolution Bonus Points)", timestamp: new Date(Date.now() - 3600 * 1000 * 24).toISOString(), updatedBy: "Vikram Singh" }
      ]
    }
  ]
};

// Database Store Class
class DBStore {
  constructor() {
    this.data = defaultData;
    this.load();
  }

  load() {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        this.data = JSON.parse(raw);
        // Ensure default properties exist
        if (!this.data.adminProfile) this.data.adminProfile = defaultData.adminProfile;
        if (!this.data.rewardsCatalog) this.data.rewardsCatalog = defaultData.rewardsCatalog;
      } else {
        this.save();
      }
    } catch (err) {
      console.error('Failed loading DB, resetting to defaults:', err);
      this.data = defaultData;
      this.save();
    }
  }

  save() {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed saving DB:', err);
    }
  }

  // Admin Profile Customization
  getAdminProfile() {
    return this.data.adminProfile || defaultData.adminProfile;
  }

  updateAdminProfile(updates) {
    this.data.adminProfile = {
      ...this.getAdminProfile(),
      ...updates
    };

    // Update the admin user record as well
    const adminUser = this.data.users.find(u => u.role === 'admin');
    if (adminUser) {
      if (updates.name) adminUser.name = updates.name;
      if (updates.email) adminUser.email = updates.email;
      if (updates.phone) adminUser.phone = updates.phone;
    }

    this.save();
    return this.data.adminProfile;
  }

  // Users & Rewards
  findUserByEmail(email) {
    return this.data.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  findUserById(id) {
    return this.data.users.find(u => u.id === id);
  }

  addUser(user) {
    const newUser = {
      points: 50, // Welcome Bonus
      badges: ["Civic Starter"],
      rewardsRedeemed: [],
      ...user
    };
    this.data.users.push(newUser);
    this.save();
    return newUser;
  }

  getOfficers() {
    return this.data.users.filter(u => u.role === 'officer');
  }

  awardPoints(userId, amount, badgeName = null) {
    const user = this.findUserById(userId);
    if (!user) return null;

    user.points = (user.points || 0) + amount;
    if (badgeName && !user.badges.includes(badgeName)) {
      user.badges.push(badgeName);
    }

    // Auto level-up badges based on total points
    if (user.points >= 200 && !user.badges.includes("Street Guardian")) {
      user.badges.push("Street Guardian");
    }
    if (user.points >= 400 && !user.badges.includes("Clean City Hero")) {
      user.badges.push("Clean City Hero");
    }

    this.save();
    return user;
  }

  getRewardsCatalog() {
    return this.data.rewardsCatalog || defaultData.rewardsCatalog;
  }

  redeemReward(userId, rewardId) {
    const user = this.findUserById(userId);
    const reward = (this.data.rewardsCatalog || defaultData.rewardsCatalog).find(r => r.id === rewardId);

    if (!user || !reward) throw new Error('Invalid user or reward selected.');
    if ((user.points || 0) < reward.costPoints) throw new Error(`Insufficient points! You need ${reward.costPoints} PTS (Current: ${user.points || 0} PTS).`);

    user.points -= reward.costPoints;
    if (!user.rewardsRedeemed) user.rewardsRedeemed = [];

    const redemptionRecord = {
      id: reward.id,
      title: reward.title,
      code: `${reward.code}-${Math.floor(1000 + Math.random() * 9000)}`,
      redeemedAt: new Date().toISOString()
    };

    user.rewardsRedeemed.unshift(redemptionRecord);
    this.save();
    return { user, redemption: redemptionRecord };
  }

  // Departments
  getDepartments() {
    return this.data.departments;
  }

  getDepartmentById(id) {
    return this.data.departments.find(d => d.id === id);
  }

  // Complaints
  getComplaints(filters = {}) {
    let list = [...this.data.complaints];
    if (filters.citizenId) list = list.filter(c => c.citizenId === filters.citizenId);
    if (filters.assignedOfficerId) list = list.filter(c => c.assignedOfficerId === filters.assignedOfficerId);
    if (filters.departmentId) list = list.filter(c => c.departmentId === filters.departmentId);
    if (filters.status) list = list.filter(c => c.status === filters.status);
    if (filters.priority) list = list.filter(c => c.priority === filters.priority);
    if (filters.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(c => c.id.toLowerCase().includes(q) || c.title.toLowerCase().includes(q) || c.location.toLowerCase().includes(q) || c.category.toLowerCase().includes(q));
    }
    return list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  getComplaintById(id) {
    return this.data.complaints.find(c => c.id.toUpperCase() === id.toUpperCase());
  }

  addComplaint(complaint) {
    this.data.complaints.unshift(complaint);
    // Award citizen 50 reward points for registering street problem!
    if (complaint.citizenId) {
      this.awardPoints(complaint.citizenId, 50, "Civic Inspector");
    }
    this.save();
    return complaint;
  }

  updateComplaint(id, updates) {
    const idx = this.data.complaints.findIndex(c => c.id.toUpperCase() === id.toUpperCase());
    if (idx === -1) return null;

    const oldComplaint = this.data.complaints[idx];
    const updated = {
      ...oldComplaint,
      ...updates,
      updatedAt: new Date().toISOString()
    };

    // If complaint is newly marked as Resolved, award citizen +100 bonus resolution points!
    if (updates.status === 'Resolved' && oldComplaint.status !== 'Resolved') {
      if (oldComplaint.citizenId) {
        this.awardPoints(oldComplaint.citizenId, 100, "Clean City Champion");
      }
    }

    this.data.complaints[idx] = updated;
    this.save();
    return updated;
  }

  addTimelineEntry(complaintId, entry) {
    const complaint = this.getComplaintById(complaintId);
    if (!complaint) return null;
    if (!complaint.timeline) complaint.timeline = [];
    complaint.timeline.push({
      ...entry,
      timestamp: new Date().toISOString()
    });
    this.save();
    return complaint;
  }

  // Analytics
  getAnalytics() {
    const total = this.data.complaints.length;
    const submitted = this.data.complaints.filter(c => c.status === 'Submitted').length;
    const assigned = this.data.complaints.filter(c => c.status === 'Assigned').length;
    const inProgress = this.data.complaints.filter(c => c.status === 'In Progress').length;
    const resolved = this.data.complaints.filter(c => c.status === 'Resolved').length;
    const rejected = this.data.complaints.filter(c => c.status === 'Rejected').length;

    const now = new Date();
    const slaBreaches = this.data.complaints.filter(c => c.status !== 'Resolved' && c.status !== 'Rejected' && new Date(c.slaDeadline) < now).length;

    const categoryCounts = {};
    this.data.complaints.forEach(c => {
      categoryCounts[c.category] = (categoryCounts[c.category] || 0) + 1;
    });

    const departmentPerformance = this.data.departments.map(d => {
      const deptComplaints = this.data.complaints.filter(c => c.departmentId === d.id);
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
}

export const db = new DBStore();
