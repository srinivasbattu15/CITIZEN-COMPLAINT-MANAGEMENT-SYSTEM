import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../utils/api';
import { InteractiveMap } from '../components/InteractiveMap';
import { StatusBadge } from '../components/StatusBadge';
import { PriorityBadge } from '../components/PriorityBadge';
import {
  ShieldAlert, Search, PlusCircle, CheckCircle2, Clock, MapPin,
  TrendingUp, Building2, ArrowRight, Sparkles, Award
} from 'lucide-react';

export const Home = () => {
  const [trackId, setTrackId] = useState('');
  const [complaints, setComplaints] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    api.getComplaints().then(setComplaints).catch(console.error);
    api.getAnalytics().then(setAnalytics).catch(console.error);
  }, []);

  const handleTrackSubmit = (e) => {
    e.preventDefault();
    if (trackId.trim()) {
      navigate(`/track?id=${trackId.trim()}`);
    }
  };

  return (
    <div className="space-y-12 pb-12">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-slate-900 via-sky-950 to-slate-900 text-white overflow-hidden py-16 lg:py-24">
        {/* Subtle grid pattern background overlay */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 border border-sky-400/30 text-xs font-semibold backdrop-blur-md">
                <Sparkles className="w-4 h-4" />
                <span>Next-Gen Smart Governance & Public Service Portal</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight">
                Empowering Citizens for a <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-indigo-300">Cleaner, Safer City</span>
              </h1>

              <p className="text-lg text-slate-300 max-w-2xl leading-relaxed">
                Report public grievances instantly, track real-time resolution progress on an interactive GIS map, and ensure accountability with verified proof of resolution.
              </p>

              {/* Quick Complaint Tracking Input */}
              <form onSubmit={handleTrackSubmit} className="pt-2 max-w-xl">
                <div className="flex flex-col sm:flex-row items-center bg-white/10 p-2 rounded-2xl border border-white/20 backdrop-blur-md shadow-2xl space-y-2 sm:space-y-0">
                  <div className="relative flex-1 w-full">
                    <Search className="absolute left-3.5 top-3.5 w-5 h-5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Enter Complaint Ref (e.g. CCMS-2026-89412)..."
                      value={trackId}
                      onChange={(e) => setTrackId(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 bg-white text-slate-900 rounded-xl placeholder-slate-400 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-inner"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-6 py-3 bg-sky-500 hover:bg-sky-400 text-white font-bold rounded-xl text-sm shadow-lg flex items-center justify-center space-x-2 transition-all shrink-0"
                  >
                    <span>Track Complaint</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>

              {/* Quick Actions CTA */}
              <div className="flex flex-wrap gap-4 pt-4 justify-center lg:justify-start">
                <Link
                  to="/submit"
                  className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-bold text-sm shadow-xl flex items-center space-x-2 transition-all transform hover:-translate-y-0.5"
                >
                  <PlusCircle className="w-5 h-5" />
                  <span>Submit New Complaint</span>
                </Link>
                <Link
                  to="/track"
                  className="px-6 py-3.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-200 font-semibold text-sm border border-slate-700 shadow-md flex items-center space-x-2 transition-all"
                >
                  <Search className="w-4 h-4" />
                  <span>Public Complaints Directory</span>
                </Link>
              </div>
            </div>

            {/* Live Stats Card Box */}
            <div className="lg:col-span-5">
              <div className="bg-slate-800/80 backdrop-blur-xl p-6 rounded-3xl border border-slate-700/60 shadow-2xl space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-700">
                  <div className="flex items-center space-x-3">
                    <div className="p-2.5 rounded-xl bg-sky-500/20 text-sky-400">
                      <TrendingUp className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-base">City SLA Performance</h3>
                      <p className="text-xs text-slate-400">Real-time resolution metrics</p>
                    </div>
                  </div>
                  <span className="flex h-3 w-3 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-700/50">
                    <div className="text-xs text-slate-400 font-medium">Total Registered</div>
                    <div className="text-3xl font-black text-white mt-1">
                      {analytics ? analytics.total : 4}
                    </div>
                  </div>

                  <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-700/50">
                    <div className="text-xs text-emerald-400 font-medium">Resolved & Verified</div>
                    <div className="text-3xl font-black text-emerald-400 mt-1">
                      {analytics ? analytics.resolved : 1}
                    </div>
                  </div>

                  <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-700/50">
                    <div className="text-xs text-purple-400 font-medium">In Active Progress</div>
                    <div className="text-3xl font-black text-purple-400 mt-1">
                      {analytics ? analytics.inProgress : 1}
                    </div>
                  </div>

                  <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-700/50">
                    <div className="text-xs text-sky-400 font-medium">Avg Resolution SLA</div>
                    <div className="text-2xl font-black text-sky-300 mt-1">
                      18.5 Hrs
                    </div>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-sky-950/60 border border-sky-800/40 text-xs text-sky-200 flex items-center space-x-2">
                  <Award className="w-5 h-5 text-sky-400 shrink-0" />
                  <span>Complaints are automatically routed to municipal officers with strict SLA tracking.</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Interactive Map & Public Complaints Heatmap Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-6 lg:p-8 shadow-xl border border-slate-200 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-sky-100 text-sky-800 text-xs font-bold mb-2">
                <MapPin className="w-3.5 h-3.5 text-sky-600" />
                <span>GIS Location Heatmap</span>
              </div>
              <h2 className="text-2xl font-black text-slate-900">City Grievance Live Map</h2>
              <p className="text-sm text-slate-500">Explore active public service issues across city zones with color-coded status pins.</p>
            </div>
            <div className="flex items-center space-x-3 text-xs font-semibold">
              <span className="flex items-center space-x-1">
                <span className="w-3 h-3 rounded-full bg-sky-600"></span>
                <span>Submitted</span>
              </span>
              <span className="flex items-center space-x-1">
                <span className="w-3 h-3 rounded-full bg-purple-600"></span>
                <span>In Progress</span>
              </span>
              <span className="flex items-center space-x-1">
                <span className="w-3 h-3 rounded-full bg-emerald-600"></span>
                <span>Resolved</span>
              </span>
              <span className="flex items-center space-x-1">
                <span className="w-3 h-3 rounded-full bg-rose-600 animate-pulse"></span>
                <span>Emergency</span>
              </span>
            </div>
          </div>

          <div className="h-[400px] w-full">
            <InteractiveMap complaints={complaints} />
          </div>
        </div>
      </section>

      {/* Recent Public Complaints List */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-black text-slate-900">Recent Public Complaints</h2>
              <p className="text-sm text-slate-500">Transparent listing of grievances registered by citizens.</p>
            </div>
            <Link to="/track" className="text-sm font-bold text-sky-600 hover:text-sky-700 flex items-center space-x-1">
              <span>View All Complaints</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {complaints.slice(0, 4).map((c) => (
              <div key={c.id} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 hover:shadow-md transition-shadow flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-sky-700 bg-sky-50 px-2.5 py-1 rounded-lg border border-sky-100">
                      {c.id}
                    </span>
                    <div className="flex items-center space-x-2">
                      <PriorityBadge priority={c.priority} />
                      <StatusBadge status={c.status} />
                    </div>
                  </div>

                  <h3 className="font-bold text-base text-slate-900 leading-snug line-clamp-1">
                    {c.title}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {c.description}
                  </p>

                  <div className="flex items-center space-x-2 text-xs text-slate-500">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{c.location}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                  <span>{new Date(c.createdAt).toLocaleDateString()}</span>
                  <Link
                    to={`/track?id=${c.id}`}
                    className="font-bold text-sky-600 hover:text-sky-800 flex items-center space-x-1"
                  >
                    <span>View Timeline</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
