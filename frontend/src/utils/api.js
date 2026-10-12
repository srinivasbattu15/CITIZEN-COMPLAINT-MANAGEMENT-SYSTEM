const API_BASE = import.meta.env.VITE_API_URL || '/api';

export const api = {
  // Auth & Admin Profile
  login: async (email, password) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Login failed');
    }
    return res.json();
  },

  register: async (userData) => {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Registration failed');
    }
    return res.json();
  },

  switchDemoRole: async (role) => {
    const res = await fetch(`${API_BASE}/auth/switch-demo-role`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Demo role switch failed');
    }
    return res.json();
  },

  getAdminProfile: async () => {
    const res = await fetch(`${API_BASE}/auth/admin-profile`);
    if (!res.ok) throw new Error('Failed loading admin profile');
    return res.json();
  },

  updateAdminProfile: async (profileData) => {
    const res = await fetch(`${API_BASE}/auth/admin-profile`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profileData)
    });
    if (!res.ok) throw new Error('Failed updating admin profile');
    return res.json();
  },

  // Rewards & Gamification
  getRewardsCatalog: async (userId) => {
    const params = userId ? `?userId=${userId}` : '';
    const res = await fetch(`${API_BASE}/rewards/catalog${params}`);
    if (!res.ok) throw new Error('Failed loading rewards catalog');
    return res.json();
  },

  redeemReward: async (userId, rewardId) => {
    const res = await fetch(`${API_BASE}/rewards/redeem`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, rewardId })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to redeem reward');
    }
    return res.json();
  },

  // Complaints
  getComplaints: async (filters = {}) => {
    const params = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key]) params.append(key, filters[key]);
    });
    const res = await fetch(`${API_BASE}/complaints?${params.toString()}`);
    if (!res.ok) throw new Error('Failed fetching complaints');
    return res.json();
  },

  getComplaintById: async (id) => {
    const res = await fetch(`${API_BASE}/complaints/${id}`);
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Complaint not found');
    }
    return res.json();
  },

  submitComplaint: async (complaintData) => {
    const res = await fetch(`${API_BASE}/complaints`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(complaintData)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed submitting complaint');
    }
    return res.json();
  },

  assignComplaint: async (id, assignData) => {
    const res = await fetch(`${API_BASE}/complaints/${id}/assign`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(assignData)
    });
    if (!res.ok) throw new Error('Failed to assign complaint');
    return res.json();
  },

  updateStatus: async (id, statusData) => {
    const res = await fetch(`${API_BASE}/complaints/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(statusData)
    });
    if (!res.ok) throw new Error('Failed updating complaint status');
    return res.json();
  },

  submitFeedback: async (id, feedbackData) => {
    const res = await fetch(`${API_BASE}/complaints/${id}/feedback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(feedbackData)
    });
    if (!res.ok) throw new Error('Failed submitting feedback');
    return res.json();
  },

  uploadImage: async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    const res = await fetch(`${API_BASE}/complaints/upload`, {
      method: 'POST',
      body: formData
    });
    if (!res.ok) throw new Error('Image upload failed');
    return res.json();
  },

  aiAnalyze: async (title, description) => {
    const res = await fetch(`${API_BASE}/complaints/ai-analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description })
    });
    if (!res.ok) throw new Error('AI analysis failed');
    return res.json();
  },

  // Departments & Officers
  getDepartments: async () => {
    const res = await fetch(`${API_BASE}/departments`);
    if (!res.ok) throw new Error('Failed to load departments');
    return res.json();
  },

  getOfficers: async () => {
    const res = await fetch(`${API_BASE}/departments/officers`);
    if (!res.ok) throw new Error('Failed to load officers');
    return res.json();
  },

  // Analytics
  getAnalytics: async () => {
    const res = await fetch(`${API_BASE}/analytics`);
    if (!res.ok) throw new Error('Failed to load analytics');
    return res.json();
  }
};
