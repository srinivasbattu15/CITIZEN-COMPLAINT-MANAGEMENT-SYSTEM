import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { api } from '../utils/api';
import { StatusBadge } from '../components/StatusBadge';
import { PriorityBadge } from '../components/PriorityBadge';

import {
  ShieldCheck, UserCheck, AlertTriangle, Building2, CheckCircle2,
  Clock, Search, UserPlus, FileText, ArrowRight, Loader2, X, Settings, Camera
} from 'lucide-react';

export const AdminDashboard = () => {
  const { user } = useAuth();
  const { addToast } = useNotification();

  const [complaints, setComplaints] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [officers, setOfficers] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [adminProfile, setAdminProfile] = useState(null);

  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [targetOfficerId, setTargetOfficerId] = useState('');
  const [targetDeptId, setTargetDeptId] = useState('');
  const [assigning, setAssigning] = useState(false);

  const fetchData = async () => {
    try {
      const [cList, dList, oList, aData, aProfile] = await Promise.all([
        api.getComplaints(),
        api.getDepartments(),
        api.getOfficers(),
        api.getAnalytics(),
        api.getAdminProfile()
      ]);
      setComplaints(cList);
      setDepartments(dList);
      setOfficers(oList);
      setAnalytics(aData);
      setAdminProfile(aProfile);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenAssignModal = (c) => {
    setSelectedComplaint(c);
    setTargetDeptId(c.departmentId || departments[0]?.id || 'dept-1');
    setTargetOfficerId(officers[0]?.id || 'usr-103');
    setAssignModalOpen(true);
  };

  const handleAssignSubmit = async (e) => {
    e.preventDefault();
    if (!selectedComplaint) return;

    setAssigning(true);
    try {
      const officer = officers.find(o => o.id === targetOfficerId) || officers[0];
      await api.assignComplaint(selectedComplaint.id, {
        officerId: officer.id,
        officerName: officer.name,
        departmentId: targetDeptId,
        adminName: adminProfile?.name || user?.name || 'Chief Admin'
      });

      addToast(`Assigned ${selectedComplaint.id} to Officer ${officer.name}`, 'success', 'Officer Assigned');
      setAssignModalOpen(false);
      fetchData();
    } catch (err) {
      addToast(err.message || 'Failed assigning officer', 'error');
    } finally {
      setAssigning(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      
      {/* Header Banner with Admin Profile Photo & Info */}
      <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-sky-950 text-white rounded-3xl p-6 md:p-8 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-purple-800/40">
        
        {/* Admin Identity Box */}
        <div className="flex items-center space-x-4">
          <div className="relative group">
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden border-2 border-purple-400 shadow-xl shrink-0 bg-slate-800">
              <img
                src={adminProfile?.avatarUrl || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400'}
                alt="Admin Profile Photo"
                className="w-full h-full object-cover"
              />
            </div>
            <Link
              to="/admin-profile"
              title="Change Profile Photo"
              className="absolute inset-0 bg-slate-900/70 text-white rounded-2xl opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-[10px] font-bold transition-opacity"
            >
              <Camera className="w-4 h-4 mb-0.5" />
              <span>Change Photo</span>
            </Link>
          </div>

          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold border border-purple-400/30">
                <ShieldCheck className="w-3.5 h-3.5" /> {adminProfile?.signatureBadge || 'Verified Admin'}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black">{adminProfile?.name || 'Chief Administrator'}</h1>
            <p className="text-purple-300 text-xs font-bold">{adminProfile?.title || 'Municipal System Director'}</p>
            <p className="text-slate-400 text-xs italic truncate max-w-md">"{adminProfile?.slogan || 'Building a Transparent Digital City'}"</p>
          </div>
        </div>

        {/* Quick Settings CTA Button */}
        <Link
          to="/admin-profile"
          className="px-5 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg flex items-center space-x-2 transition-all border border-purple-400/30 shrink-0"
        >
          <Settings className="w-4 h-4" />
          <span>Customize Profile & Settings</span>
        </Link>
      </div>

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-xs text-slate-500 font-semibold uppercase">Total Grievances</div>
          <div className="text-3xl font-black text-slate-900 mt-1">{analytics?.total || 0}</div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-xs text-blue-600 font-semibold uppercase">Unassigned / Pending</div>
          <div className="text-3xl font-black text-blue-600 mt-1">
            {complaints.filter(c => c.status === 'Submitted').length}
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-xs text-rose-600 font-semibold uppercase">SLA Breaches</div>
          <div className="text-3xl font-black text-rose-600 mt-1">{analytics?.slaBreaches || 0}</div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-xs text-emerald-600 font-semibold uppercase">Resolution Rate</div>
          <div className="text-3xl font-black text-emerald-600 mt-1">
            {analytics?.total ? Math.round((analytics.resolved / analytics.total) * 100) : 0}%
          </div>
        </div>
      </div>

      {/* Main Verification & Assignment Table */}
      <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xl border border-slate-200 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-slate-900">Complaints Oversight Matrix</h2>
            <p className="text-xs text-slate-500">Verify new citizen submissions and assign responsible officers.</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-xs font-bold text-slate-700 uppercase border-b border-slate-200">
              <tr>
                <th className="p-4">Ref ID</th>
                <th className="p-4">Title & Citizen</th>
                <th className="p-4">Category</th>
                <th className="p-4">Priority</th>
                <th className="p-4">Status</th>
                <th className="p-4">Assigned Officer</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {complaints.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-4 font-mono font-bold text-sky-700">{c.id}</td>
                  <td className="p-4">
                    <div className="font-bold text-slate-900">{c.title}</div>
                    <div className="text-xs text-slate-400">{c.citizenName} • {c.location}</div>
                  </td>
                  <td className="p-4 font-medium text-slate-800">{c.category}</td>
                  <td className="p-4"><PriorityBadge priority={c.priority} /></td>
                  <td className="p-4"><StatusBadge status={c.status} /></td>
                  <td className="p-4 font-semibold text-slate-900">
                    {c.assignedOfficerName || <span className="text-rose-500 text-xs font-bold">Unassigned</span>}
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => handleOpenAssignModal(c)}
                      className="px-3 py-1.5 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold text-xs border border-purple-200 transition-colors"
                    >
                      Assign Officer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Admin Assign Officer Modal */}
      {assignModalOpen && selectedComplaint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200">
            <div className="bg-purple-950 text-white p-5 flex items-center justify-between">
              <div>
                <span className="text-xs text-purple-300 font-mono font-bold">{selectedComplaint.id}</span>
                <h3 className="font-bold text-lg leading-snug">Assign Officer & Department</h3>
              </div>
              <button onClick={() => setAssignModalOpen(false)} className="text-purple-300 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAssignSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Target Department</label>
                <select
                  value={targetDeptId}
                  onChange={(e) => setTargetDeptId(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-300 font-bold text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
                >
                  {departments.map((d) => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Designated Municipal Officer</label>
                <select
                  value={targetOfficerId}
                  onChange={(e) => setTargetOfficerId(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-300 font-bold text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
                >
                  {officers.map((o) => (
                    <option key={o.id} value={o.id}>
                      {o.name} ({o.departmentName || 'Officer'})
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-4 flex items-center space-x-3">
                <button
                  type="submit"
                  disabled={assigning}
                  className="flex-1 py-3 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm shadow flex items-center justify-center space-x-1"
                >
                  {assigning ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Confirm Assignment</span>}
                </button>
                <button
                  type="button"
                  onClick={() => setAssignModalOpen(false)}
                  className="py-3 px-4 rounded-xl bg-slate-100 text-slate-700 font-medium text-sm hover:bg-slate-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
