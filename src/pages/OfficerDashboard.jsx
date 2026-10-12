import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { api } from '../utils/api';
import { StatusBadge } from '../components/StatusBadge';
import { PriorityBadge } from '../components/PriorityBadge';
import { ComplaintTimeline } from '../components/ComplaintTimeline';

import {
  Briefcase, CheckCircle2, AlertTriangle, Clock, Camera, FileText,
  Upload, X, ShieldCheck, ArrowRight, Loader2
} from 'lucide-react';

export const OfficerDashboard = () => {
  const { user } = useAuth();
  const { addToast } = useNotification();

  const [complaints, setComplaints] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Status update form fields
  const [newStatus, setNewStatus] = useState('In Progress');
  const [statusNote, setStatusNote] = useState('');
  const [proofFile, setProofFile] = useState(null);
  const [proofPreview, setProofPreview] = useState(null);
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [updating, setUpdating] = useState(false);

  const fetchOfficerComplaints = async () => {
    try {
      const data = await api.getComplaints();
      // Filter complaints relevant to officer's department or assigned officer
      const officerData = data.filter(c =>
        c.assignedOfficerId === user?.id ||
        c.category === user?.departmentName ||
        user?.role === 'admin'
      );
      setComplaints(officerData.length > 0 ? officerData : data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchOfficerComplaints();
  }, [user]);

  const handleOpenActionModal = (c) => {
    setSelectedComplaint(c);
    setNewStatus(c.status === 'Assigned' ? 'In Progress' : 'Resolved');
    setStatusNote('');
    setProofFile(null);
    setProofPreview(null);
    setResolutionNotes('');
    setModalOpen(true);
  };

  const handleProofChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProofFile(file);
      setProofPreview(URL.createObjectURL(file));
    }
  };

  const handleStatusSubmit = async (e) => {
    e.preventDefault();
    if (!selectedComplaint) return;

    setUpdating(true);
    try {
      let resolutionProofUrl = null;
      if (proofFile) {
        const uploadRes = await api.uploadImage(proofFile);
        resolutionProofUrl = uploadRes.imageUrl;
      }

      await api.updateStatus(selectedComplaint.id, {
        status: newStatus,
        note: statusNote || `Status updated to ${newStatus} by Officer ${user?.name || ''}`,
        updatedBy: user?.name || 'Officer',
        resolutionProofUrl,
        resolutionNotes
      });

      addToast(`Updated complaint ${selectedComplaint.id} to ${newStatus}`, 'success', 'Action Recorded');
      setModalOpen(false);
      fetchOfficerComplaints();
    } catch (err) {
      addToast(err.message || 'Failed updating status', 'error');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white rounded-3xl p-8 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-400/30 mb-2">
            <Briefcase className="w-3.5 h-3.5" /> Department Field Officer Desk
          </span>
          <h1 className="text-3xl font-black">Officer Task Command</h1>
          <p className="text-slate-300 text-sm mt-1">
            Department: <span className="font-bold text-emerald-300">{user?.departmentName || 'Sanitation & Waste Management'}</span> • Officer: {user?.name}
          </p>
        </div>

        <div className="flex space-x-3 text-xs font-bold bg-slate-900/60 p-4 rounded-2xl border border-slate-700">
          <div className="text-center px-3 border-r border-slate-700">
            <div className="text-slate-400">Assigned Queue</div>
            <div className="text-2xl font-black text-emerald-400 mt-0.5">{complaints.length}</div>
          </div>
          <div className="text-center px-3">
            <div className="text-slate-400">Action Pending</div>
            <div className="text-2xl font-black text-amber-400 mt-0.5">
              {complaints.filter(c => c.status !== 'Resolved').length}
            </div>
          </div>
        </div>
      </div>

      {/* Complaints Queue */}
      <div className="bg-white rounded-3xl p-6 shadow-xl border border-slate-200 space-y-6">
        <h2 className="text-xl font-black text-slate-900">Active Task Queue</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {complaints.map((c) => (
            <div key={c.id} className="bg-slate-50 rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded border border-emerald-200">
                    {c.id}
                  </span>
                  <div className="flex items-center space-x-2">
                    <PriorityBadge priority={c.priority} />
                    <StatusBadge status={c.status} />
                  </div>
                </div>

                <h3 className="font-bold text-base text-slate-900">{c.title}</h3>
                <p className="text-xs text-slate-600 line-clamp-2">{c.description}</p>

                <div className="text-xs text-slate-500 space-y-1">
                  <div>📍 Location: <span className="font-medium text-slate-800">{c.location}</span></div>
                  <div>👤 Citizen: <span className="font-medium text-slate-800">{c.citizenName} ({c.citizenPhone})</span></div>
                  <div>⏳ SLA Target: <span className="font-medium text-rose-600">{new Date(c.slaDeadline).toLocaleString()}</span></div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 font-medium">Updated: {new Date(c.updatedAt).toLocaleTimeString()}</span>
                <button
                  onClick={() => handleOpenActionModal(c)}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow flex items-center space-x-1 transition-all"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Update Status & Upload Proof</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Officer Action Modal */}
      {modalOpen && selectedComplaint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200">
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
              <div>
                <span className="text-xs text-emerald-400 font-mono font-bold">{selectedComplaint.id}</span>
                <h3 className="font-bold text-lg leading-snug">Update Investigation Status</h3>
              </div>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleStatusSubmit} className="p-6 space-y-4">
              
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-2">New Lifecycle Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-300 font-bold text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                >
                  <option value="In Progress">In Progress (Work Dispatched)</option>
                  <option value="Resolved">Resolved (Work Inspected & Completed)</option>
                  <option value="Rejected">Rejected (Invalid / Duplicate Complaint)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Status Note / Activity Log</label>
                <input
                  type="text"
                  placeholder="e.g. Crew dispatched with sanitation vehicle..."
                  value={statusNote}
                  onChange={(e) => setStatusNote(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              {newStatus === 'Resolved' && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Resolution Summary</label>
                    <textarea
                      rows={2}
                      placeholder="Explain action taken to resolve the issue..."
                      value={resolutionNotes}
                      onChange={(e) => setResolutionNotes(e.target.value)}
                      className="w-full p-3 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Proof of Resolution Photo (After)</label>
                    <div className="flex items-center space-x-3">
                      <label className="cursor-pointer flex items-center space-x-2 px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 font-semibold text-xs transition-colors">
                        <Camera className="w-4 h-4 text-emerald-600" />
                        <span>Upload Proof Photo</span>
                        <input type="file" accept="image/*" onChange={handleProofChange} className="hidden" />
                      </label>
                      {proofPreview && (
                        <div className="w-12 h-12 rounded-xl overflow-hidden border border-emerald-400">
                          <img src={proofPreview} alt="Proof" className="w-full h-full object-cover" />
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}

              <div className="pt-4 flex items-center space-x-3">
                <button
                  type="submit"
                  disabled={updating}
                  className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow flex items-center justify-center space-x-1"
                >
                  {updating ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Confirm Status Update</span>}
                </button>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
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
