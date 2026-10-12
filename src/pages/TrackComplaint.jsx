import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../utils/api';
import { useNotification } from '../context/NotificationContext';
import { exportComplaintPDF } from '../utils/pdfExport';
import { StatusBadge } from '../components/StatusBadge';
import { PriorityBadge } from '../components/PriorityBadge';
import { ComplaintTimeline } from '../components/ComplaintTimeline';
import { ProofViewer } from '../components/ProofViewer';
import { InteractiveMap } from '../components/InteractiveMap';
import { PhotoAnnotator } from '../components/PhotoAnnotator';

import {
  Search, Download, Clock, MapPin, User, Building2, Star, CheckCircle2,
  AlertTriangle, ShieldAlert, FileText, ArrowRight, Loader2, Trophy, Camera
} from 'lucide-react';

export const TrackComplaint = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialId = searchParams.get('id') || 'CCMS-2026-89412';
  
  const [searchId, setSearchId] = useState(initialId);
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submittingFeedback, setSubmittingFeedback] = useState(false);

  const { addToast } = useNotification();

  const fetchComplaint = async (idToFetch) => {
    if (!idToFetch) return;
    setLoading(true);
    setError(null);
    try {
      const data = await api.getComplaintById(idToFetch);
      setComplaint(data);
    } catch (err) {
      setComplaint(null);
      setError(err.message || 'Complaint reference not found.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaint(initialId);
  }, [initialId]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchId.trim()) {
      setSearchParams({ id: searchId.trim() });
      fetchComplaint(searchId.trim());
    }
  };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    if (!complaint) return;
    setSubmittingFeedback(true);
    try {
      const updated = await api.submitFeedback(complaint.id, { rating, comment });
      setComplaint(updated);
      addToast('Thank you for rating! +25 Civic Reward Points awarded!', 'success', 'Feedback & Bonus Claimed');
    } catch (err) {
      addToast(err.message || 'Failed submitting feedback', 'error');
    } finally {
      setSubmittingFeedback(false);
    }
  };

  const getSlaStatus = () => {
    if (!complaint || complaint.status === 'Resolved' || complaint.status === 'Rejected') return null;
    const deadline = new Date(complaint.slaDeadline);
    const now = new Date();
    const diffMs = deadline - now;
    const diffHours = Math.round(diffMs / (1000 * 3600));

    if (diffMs <= 0) {
      return { text: `SLA Overdue by ${Math.abs(diffHours)} hours!`, overdue: true };
    }
    return { text: `${diffHours} hours remaining until SLA deadline`, overdue: false };
  };

  const slaInfo = getSlaStatus();

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      
      {/* Search Header */}
      <div className="bg-white rounded-3xl p-6 shadow-xl border border-slate-200">
        <div className="max-w-xl mx-auto text-center space-y-3">
          <div className="inline-flex items-center space-x-1 text-xs font-bold text-sky-600 bg-sky-50 px-3 py-1 rounded-full">
            <Search className="w-3.5 h-3.5" />
            <span>Citizen Tracking Engine</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900">Track Complaint Dossier</h1>
          <p className="text-xs text-slate-500">Enter your unique Complaint ID to view live status & photo annotations.</p>

          <form onSubmit={handleSearchSubmit} className="pt-2 flex items-center space-x-2">
            <input
              type="text"
              placeholder="e.g. CCMS-2026-89412"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              className="flex-1 px-4 py-3 rounded-xl border border-slate-300 text-slate-900 font-bold uppercase tracking-wider text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none"
            />
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-sm shadow-md transition-all shrink-0 flex items-center space-x-1"
            >
              <span>Search</span>
            </button>
          </form>
        </div>
      </div>

      {loading && (
        <div className="text-center py-12">
          <Loader2 className="w-8 h-8 text-sky-600 animate-spin mx-auto mb-2" />
          <p className="text-sm font-semibold text-slate-600">Fetching complaint record...</p>
        </div>
      )}

      {error && (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 text-center text-rose-800 space-y-2">
          <AlertTriangle className="w-8 h-8 text-rose-600 mx-auto" />
          <h3 className="font-bold text-base">Record Not Found</h3>
          <p className="text-sm text-rose-700">{error}</p>
        </div>
      )}

      {complaint && !loading && (
        <div className="space-y-8 animate-fadeIn">
          
          {/* Main Dossier Header */}
          <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xl border border-slate-200 space-y-6">
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <span className="font-mono text-base font-black text-sky-700 bg-sky-50 px-3 py-1 rounded-lg border border-sky-200">
                    {complaint.id}
                  </span>
                  <PriorityBadge priority={complaint.priority} />
                  <StatusBadge status={complaint.status} />
                </div>
                <h2 className="text-2xl font-black text-slate-900 leading-tight">{complaint.title}</h2>
              </div>

              <button
                onClick={() => exportComplaintPDF(complaint)}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center space-x-2 border border-slate-300 transition-colors shrink-0"
              >
                <Download className="w-4 h-4 text-sky-600" />
                <span>Export Official PDF Report</span>
              </button>
            </div>

            {/* SLA Alert Banner */}
            {slaInfo && (
              <div className={`p-4 rounded-2xl border flex items-center space-x-3 ${
                slaInfo.overdue
                  ? 'bg-rose-50 border-rose-200 text-rose-800'
                  : 'bg-sky-50 border-sky-200 text-sky-900'
              }`}>
                <Clock className={`w-5 h-5 shrink-0 ${slaInfo.overdue ? 'text-rose-600 animate-bounce' : 'text-sky-600'}`} />
                <div className="text-sm font-semibold">
                  <span>{slaInfo.text}</span>
                  <span className="text-xs block font-normal text-slate-500">
                    Target SLA Deadline: {new Date(complaint.slaDeadline).toLocaleString()}
                  </span>
                </div>
              </div>
            )}

            {/* Description & Metadata */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <div className="md:col-span-2 space-y-4">
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Grievance Overview</h4>
                  <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    {complaint.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-slate-400 font-medium">Department</span>
                    <div className="font-bold text-slate-900 mt-0.5">{complaint.category}</div>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-slate-400 font-medium">Assigned Officer</span>
                    <div className="font-bold text-slate-900 mt-0.5">
                      {complaint.assignedOfficerName || 'Pending Assignment'}
                    </div>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-slate-400 font-medium">Citizen Reporter</span>
                    <div className="font-bold text-slate-900 mt-0.5">{complaint.citizenName}</div>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-slate-400 font-medium">Location</span>
                    <div className="font-bold text-slate-900 truncate mt-0.5">{complaint.location}</div>
                  </div>
                </div>
              </div>

              {/* GIS Map Location */}
              <div className="h-full min-h-[200px] flex flex-col justify-between space-y-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Geographic Location</span>
                <div className="flex-1 rounded-2xl overflow-hidden border border-slate-200 min-h-[160px]">
                  <InteractiveMap
                    center={[complaint.lat || 28.6139, complaint.lng || 77.2090]}
                    zoom={14}
                    complaints={[complaint]}
                  />
                </div>
              </div>

            </div>

          </div>

          {/* Photo Annotations Explainer Component */}
          {complaint.imageUrl && (
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xl border border-slate-200 space-y-4">
              <h3 className="text-lg font-black text-slate-900 flex items-center space-x-2">
                <Camera className="w-5 h-5 text-sky-600" />
                <span>Uploaded Problem Photo & Spot Annotations</span>
              </h3>
              <PhotoAnnotator
                imageUrl={complaint.imageUrl}
                annotations={complaint.photoAnnotations || []}
                readOnly={true}
              />
            </div>
          )}

          {/* Proof of Work Comparison if Resolved */}
          {complaint.status === 'Resolved' && (
            <ProofViewer
              originalImage={complaint.imageUrl}
              proofImage={complaint.resolutionProofUrl}
              resolutionNotes={complaint.resolutionNotes}
            />
          )}

          {/* Step-by-Step Interactive Timeline */}
          <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xl border border-slate-200 space-y-4">
            <h3 className="text-lg font-black text-slate-900 flex items-center space-x-2">
              <Clock className="w-5 h-5 text-sky-600" />
              <span>Complaint Progress Timeline</span>
            </h3>
            <ComplaintTimeline timeline={complaint.timeline || []} />
          </div>

          {/* Feedback Form */}
          {complaint.status === 'Resolved' && (
            <div className="bg-gradient-to-r from-sky-50 to-indigo-50 border border-sky-200 rounded-3xl p-6 shadow-md space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900 text-lg flex items-center space-x-2">
                  <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                  <span>Citizen Resolution Feedback</span>
                </h3>
                <span className="text-xs font-bold text-amber-700 bg-amber-100 px-3 py-1 rounded-full border border-amber-200">
                  Earn +25 Bonus Points!
                </span>
              </div>

              {complaint.feedback ? (
                <div className="bg-white p-4 rounded-2xl border border-sky-100 text-sm space-y-1">
                  <div className="flex items-center space-x-1 text-amber-500">
                    {[...Array(complaint.feedback.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                    <span className="font-bold text-slate-700 ml-2">{complaint.feedback.rating} / 5 Stars</span>
                  </div>
                  <p className="italic text-slate-600 mt-2">"{complaint.feedback.comment}"</p>
                </div>
              ) : (
                <form onSubmit={handleFeedbackSubmit} className="space-y-4 bg-white p-5 rounded-2xl border border-sky-100">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Rate Resolution Quality</label>
                    <div className="flex space-x-2">
                      {[1, 2, 3, 4, 5].map((num) => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => setRating(num)}
                          className={`p-2 rounded-xl border text-sm font-bold flex items-center space-x-1 transition-all ${
                            rating >= num
                              ? 'bg-amber-500 text-white border-amber-600 shadow'
                              : 'bg-slate-100 text-slate-400 border-slate-200'
                          }`}
                        >
                          <Star className="w-4 h-4 fill-current" />
                          <span>{num}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Your Comments</label>
                    <textarea
                      rows={2}
                      placeholder="Share your experience with the officer's work..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className="w-full p-3 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submittingFeedback}
                    className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow transition-all flex items-center space-x-2"
                  >
                    <Trophy className="w-4 h-4" />
                    <span>Submit Feedback & Claim +25 PTS</span>
                  </button>
                </form>
              )}
            </div>
          )}

        </div>
      )}

    </div>
  );
};
