import React, { useState, useEffect } from 'react';
import { api } from '../utils/api';
import { useNotification } from '../context/NotificationContext';

import {
  ShieldCheck, User, Mail, Phone, Building2, Sparkles, Save, Camera,
  CheckCircle2, Loader2, Palette, Globe, Megaphone, Sliders
} from 'lucide-react';

export const AdminProfilePage = () => {
  const { addToast } = useNotification();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Admin Account Settings State
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [department, setDepartment] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [slogan, setSlogan] = useState('');
  const [signatureBadge, setSignatureBadge] = useState('');
  const [portalName, setPortalName] = useState('Anurag Municipal Corporation CCMS');
  const [helplineNumber, setHelplineNumber] = useState('1800-11-2026');
  const [themeColor, setThemeColor] = useState('indigo');
  const [avatarFile, setAvatarFile] = useState(null);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const data = await api.getAdminProfile();
      setName(data.name || 'Chief Admin Ananya Roy');
      setTitle(data.title || 'Municipal System Administrator');
      setEmail(data.email || 'admin@ccms.gov');
      setPhone(data.phone || '+91 9554433221');
      setDepartment(data.department || 'City Governance & Operations');
      setAvatarUrl(data.avatarUrl || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400');
      setSlogan(data.slogan || 'Building a Transparent, Citizen-First Digital City');
      setSignatureBadge(data.signatureBadge || 'Verified Chief Administrator');
      setPortalName(data.portalName || 'Anurag Municipal Corporation CCMS');
      setHelplineNumber(data.helplineNumber || '1800-11-2026');
      setThemeColor(data.themeColor || 'indigo');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleAvatarFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      try {
        const uploadRes = await api.uploadImage(file);
        setAvatarUrl(uploadRes.imageUrl);
        addToast('Avatar uploaded successfully!', 'success');
      } catch (err) {
        addToast('Failed uploading avatar image', 'error');
      }
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const updated = await api.updateAdminProfile({
        name,
        title,
        email,
        phone,
        department,
        avatarUrl,
        slogan,
        signatureBadge,
        portalName,
        helplineNumber,
        themeColor
      });

      addToast('Admin account & system settings saved successfully!', 'success', 'Settings Customized');
    } catch (err) {
      addToast(err.message || 'Failed updating profile', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-purple-950 to-indigo-950 text-white rounded-3xl p-8 shadow-2xl space-y-2">
        <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold border border-purple-400/30">
          <ShieldCheck className="w-4 h-4 text-purple-400" />
          <span>Municipal Administrator Control Center</span>
        </span>
        <h1 className="text-3xl font-black">Admin Account & System Customizer</h1>
        <p className="text-slate-300 text-sm max-w-xl">
          Change your admin name, title, profile avatar, email, phone, city slogan, portal name, and emergency helpline anytime.
        </p>
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-500 font-semibold">Loading admin configuration...</div>
      ) : (
        <form onSubmit={handleSave} className="bg-white rounded-3xl p-6 md:p-8 shadow-xl border border-slate-200 space-y-8">
          
          {/* Live Admin Profile Preview Box */}
          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-2xl p-6 flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <div className="relative group/avatar">
              <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-purple-500 shadow-md shrink-0 bg-white">
                <img
                  src={avatarUrl || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400'}
                  alt="Admin Avatar"
                  className="w-full h-full object-cover"
                />
              </div>
              <label className="absolute inset-0 bg-slate-900/60 text-white rounded-2xl opacity-0 group-hover/avatar:opacity-100 flex flex-col items-center justify-center text-[10px] font-bold cursor-pointer transition-opacity">
                <Camera className="w-5 h-5 mb-1" />
                <span>Upload</span>
                <input type="file" accept="image/*" onChange={handleAvatarFileChange} className="hidden" />
              </label>
            </div>

            <div className="space-y-1 text-center sm:text-left flex-1">
              <div className="flex items-center justify-center sm:justify-start space-x-2">
                <h3 className="font-black text-xl text-slate-900">{name || 'Chief Administrator'}</h3>
                <span className="text-[10px] uppercase font-bold bg-purple-600 text-white px-2.5 py-0.5 rounded-full shadow-sm">
                  {signatureBadge || 'Verified Admin'}
                </span>
              </div>
              <p className="text-xs font-bold text-purple-700">{title || 'Municipal System Administrator'}</p>
              <p className="text-xs text-slate-500 font-medium">{department || 'City Governance & Operations'}</p>
              <p className="text-xs text-slate-600 italic pt-1">"{slogan || 'Building a Transparent Digital City'}"</p>
            </div>
          </div>

          {/* Section 1: Admin Account Information */}
          <div className="space-y-4">
            <h3 className="font-black text-lg text-slate-900 flex items-center space-x-2 border-b pb-2 border-slate-200">
              <User className="w-5 h-5 text-purple-600" />
              <span>1. Admin Account Information</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Admin Full Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-300 text-sm font-bold focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Official Designation Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-300 text-sm font-bold focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Admin Email Address *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-300 text-sm font-medium focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Admin Contact Phone</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-300 text-sm font-medium focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Department Name</label>
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-300 text-sm font-semibold focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Signature Badge Label</label>
                <input
                  type="text"
                  value={signatureBadge}
                  onChange={(e) => setSignatureBadge(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-300 text-sm font-bold focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Avatar Image Photo URL</label>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  placeholder="https://..."
                  className="flex-1 p-3 rounded-xl border border-slate-300 text-sm font-medium focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
                <label className="cursor-pointer px-4 py-3 bg-purple-100 hover:bg-purple-200 text-purple-800 font-bold text-xs rounded-xl border border-purple-200 transition-colors shrink-0">
                  Choose Photo File
                  <input type="file" accept="image/*" onChange={handleAvatarFileChange} className="hidden" />
                </label>
              </div>
            </div>
          </div>

          {/* Section 2: Website Branding & System Settings */}
          <div className="space-y-4">
            <h3 className="font-black text-lg text-slate-900 flex items-center space-x-2 border-b pb-2 border-slate-200">
              <Globe className="w-5 h-5 text-indigo-600" />
              <span>2. Website Branding & City Broadcast Settings</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Portal Brand / City Name</label>
                <input
                  type="text"
                  value={portalName}
                  onChange={(e) => setPortalName(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-300 text-sm font-bold focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Emergency Toll-Free Helpline</label>
                <input
                  type="text"
                  value={helplineNumber}
                  onChange={(e) => setHelplineNumber(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-300 text-sm font-bold focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">City System Slogan / Homepage Announcement Banner</label>
              <textarea
                rows={2}
                value={slogan}
                onChange={(e) => setSlogan(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-300 text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Save Button */}
          <div className="pt-4 border-t border-slate-200 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-base shadow-xl flex items-center justify-center space-x-2 transition-all transform hover:-translate-y-0.5"
            >
              {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
              <span>Save & Apply Admin Customizations</span>
            </button>
          </div>

        </form>
      )}

    </div>
  );
};
