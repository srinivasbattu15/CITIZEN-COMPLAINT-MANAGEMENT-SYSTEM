export const BACKEND_URL = 'https://citizen-complaint-management-system.onrender.com';

const getApiBase = () => {
  // 1. Explicit env variable takes top priority
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL.replace(/\/+$/, '');
  }

  // 2. In browser, automatically use deployed Render backend if not on local machine
  if (typeof window !== 'undefined') {
    const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    if (!isLocal) {
      return `${BACKEND_URL}/api`;
    }
  }

  // 3. Vite production bundle fallback
  if (import.meta.env.PROD) {
    return `${BACKEND_URL}/api`;
  }

  // 4. Local Vite proxy during dev
  return '/api';
};

export const API_BASE = getApiBase();

/**
 * Normalizes an image or asset URL so that relative paths (/uploads/...)
 * resolve to the live Render backend host when hosted on Vercel or external domains.
 */
export const getImageUrl = (url) => {
  if (!url) return '';
  if (
    url.startsWith('http://') ||
    url.startsWith('https://') ||
    url.startsWith('data:') ||
    url.startsWith('blob:')
  ) {
    return url;
  }
  const cleanPath = url.startsWith('/') ? url : `/${url}`;
  return `${BACKEND_URL}${cleanPath}`;
};

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
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Image upload failed');
    }
    const data = await res.json();
    return {
      ...data,
      imageUrl: getImageUrl(data.imageUrl)
    };
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
