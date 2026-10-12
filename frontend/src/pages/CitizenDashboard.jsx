import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';
import { StatusBadge } from '../components/StatusBadge';
import { PriorityBadge } from '../components/PriorityBadge';

import {
  User, PlusCircle, Search, Clock, CheckCircle2, AlertCircle, FileText,
  ArrowRight, ShieldCheck, MapPin, RefreshCw
} from 'lucide-react';

export const CitizenDashboard = () => {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [loading, setLoading] = useState(true);

  const fetchCitizenComplaints = async () => {
    setLoading(true);
    try {
      const data = await api.getComplaints({ citizenId: user ? user.id : 'usr-101' });
      setComplaints(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCitizenComplaints();
  }, [user]);

  const filtered = filterStatus === 'ALL'
    ? complaints
    : complaints.filter(c => c.status === filterStatus);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-sky-900 via-indigo-900 to-slate-900 text-white rounded-3xl p-8 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 text-xs font-bold border border-sky-400/30 mb-2">
            <User className="w-3.5 h-3.5" /> Citizen Portal
          </span>
          <h1 className="text-3xl font-black">Welcome, {user ? user.name : 'Citizen'}</h1>
          <p className="text-slate-300 text-sm mt-1">Manage and track your submitted public grievances in real time.</p>
        </div>

        <Link
          to="/submit"
          className="px-6 py-3.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-bold text-sm shadow-lg flex items-center space-x-2 transition-all shrink-0"
        >
          <PlusCircle className="w-5 h-5" />
          <span>New Complaint</span>
        </Link>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-xs text-slate-500 font-semibold uppercase">Total Complaints</div>
          <div className="text-3xl font-black text-slate-900 mt-1">{complaints.length}</div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-xs text-amber-600 font-semibold uppercase">In Progress / Assigned</div>
          <div className="text-3xl font-black text-amber-600 mt-1">
            {complaints.filter(c => c.status === 'In Progress' || c.status === 'Assigned').length}
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-xs text-emerald-600 font-semibold uppercase">Resolved</div>
          <div className="text-3xl font-black text-emerald-600 mt-1">
            {complaints.filter(c => c.status === 'Resolved').length}
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-xs text-blue-600 font-semibold uppercase">Pending Verification</div>
          <div className="text-3xl font-black text-blue-600 mt-1">
            {complaints.filter(c => c.status === 'Submitted').length}
          </div>
        </div>
      </div>

      {/* Filter Tabs & Refresh */}
      <div className="bg-white rounded-3xl p-6 shadow-xl border border-slate-200 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {['ALL', 'Submitted', 'Assigned', 'In Progress', 'Resolved'].map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  filterStatus === st
                    ? 'bg-sky-600 text-white shadow'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          <button
            onClick={fetchCitizenComplaints}
            className="p-2 text-slate-500 hover:text-slate-900 rounded-xl hover:bg-slate-100 flex items-center space-x-1 text-xs font-semibold"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </button>
        </div>

        {/* Complaints Table / List */}
        {loading ? (
          <div className="text-center py-8 text-slate-500 font-medium">Loading complaints...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 text-slate-400 space-y-2">
            <FileText className="w-10 h-10 mx-auto text-slate-300" />
            <p className="font-semibold text-sm">No complaints found under filter '{filterStatus}'</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filtered.map((c) => (
              <div key={c.id} className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/80 px-4 rounded-2xl transition-colors">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs font-bold text-sky-700 bg-sky-50 px-2.5 py-0.5 rounded border border-sky-200">
                      {c.id}
                    </span>
                    <PriorityBadge priority={c.priority} />
                    <StatusBadge status={c.status} />
                  </div>
                  <h3 className="font-bold text-base text-slate-900">{c.title}</h3>
                  <div className="flex items-center space-x-3 text-xs text-slate-500">
                    <span className="flex items-center space-x-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{c.location}</span>
                    </span>
                    <span>•</span>
                    <span>Category: {c.category}</span>
                    <span>•</span>
                    <span>Date: {new Date(c.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <Link
                  to={`/track?id=${c.id}`}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-sky-50 text-slate-700 hover:text-sky-700 font-bold text-xs flex items-center space-x-1 border border-slate-200 transition-colors shrink-0 self-start md:self-center"
                >
                  <span>View Dossier & Timeline</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};
