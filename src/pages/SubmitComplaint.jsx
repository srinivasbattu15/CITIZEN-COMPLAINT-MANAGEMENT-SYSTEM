import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { api } from '../utils/api';
import { InteractiveMap } from '../components/InteractiveMap';
import { AiAssistantModal } from '../components/AiAssistantModal';
import { PhotoAnnotator } from '../components/PhotoAnnotator';

import {
  PlusCircle, Upload, MapPin, Sparkles, AlertCircle, CheckCircle2,
  FileText, ShieldCheck, Loader2, Camera, Trophy, Tag
} from 'lucide-react';

export const SubmitComplaint = () => {
  const { user } = useAuth();
  const { addToast } = useNotification();
  const navigate = useNavigate();

  const [departments, setDepartments] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [departmentId, setDepartmentId] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [location, setLocation] = useState('Sector 14, Main Market');
  const [lat, setLat] = useState(28.6139);
  const [lng, setLng] = useState(77.2090);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [annotations, setAnnotations] = useState([]);

  const [loading, setLoading] = useState(false);
  const [aiModalOpen, setAiModalOpen] = useState(false);

  useEffect(() => {
    api.getDepartments().then(depts => {
      setDepartments(depts);
      if (depts.length > 0) {
        setCategory(depts[0].name);
        setDepartmentId(depts[0].id);
      }
    }).catch(console.error);
  }, []);

  const handleDepartmentChange = (e) => {
    const selectedId = e.target.value;
    const dept = departments.find(d => d.id === selectedId);
    if (dept) {
      setDepartmentId(dept.id);
      setCategory(dept.name);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setAnnotations([]);
    }
  };

  const handleLocationSelect = (selectedLat, selectedLng) => {
    setLat(selectedLat);
    setLng(selectedLng);
    setLocation(`Geo Location: (${selectedLat.toFixed(4)}, ${selectedLng.toFixed(4)})`);
  };

  const handleApplyAiSuggestion = (suggestion) => {
    setCategory(suggestion.category);
    setDepartmentId(suggestion.departmentId);
    setPriority(suggestion.priority);
    addToast(`Applied AI suggestions: Department '${suggestion.category}', Priority '${suggestion.priority}'`, 'success', 'AI Auto-Routing');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description) {
      addToast('Please provide a title and problem description.', 'error');
      return;
    }

    setLoading(true);
    try {
      let uploadedImageUrl = imagePreview;
      if (imageFile) {
        const uploadRes = await api.uploadImage(imageFile);
        uploadedImageUrl = uploadRes.imageUrl;
      }

      const complaintData = {
        title,
        description,
        category,
        departmentId,
        priority,
        citizenId: user ? user.id : 'usr-101',
        citizenName: user ? user.name : 'Anonymous Citizen',
        citizenEmail: user ? user.email : 'citizen@ccms.gov',
        citizenPhone: user ? user.phone : '+91 9876543210',
        location,
        lat,
        lng,
        imageUrl: uploadedImageUrl,
        photoAnnotations: annotations
      };

      const created = await api.submitComplaint(complaintData);
      addToast(`🎉 Complaint registered! Earned +50 Civic Points! Ref: ${created.id}`, 'success', 'Grievance Registered');
      navigate(`/track?id=${created.id}`);
    } catch (err) {
      addToast(err.message || 'Failed to register complaint.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      
      {/* Banner */}
      <div className="bg-gradient-to-r from-sky-900 via-indigo-900 to-purple-900 text-white rounded-3xl p-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 text-xs font-bold border border-sky-400/30">
              <PlusCircle className="w-3.5 h-3.5 mr-1" /> Snap Street Issue & Earn Rewards
            </span>
            <h1 className="text-3xl font-black">Register Public Grievance</h1>
            <p className="text-slate-300 text-sm max-w-xl">
              Upload photos, click to pinpoint exact problem spots, and earn +50 Civic Reward Points!
            </p>
          </div>

          <div className="bg-amber-500/20 border border-amber-400/40 p-4 rounded-2xl text-center shrink-0">
            <div className="flex items-center space-x-1 text-amber-300 font-bold text-xs">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>Reward Bonus</span>
            </div>
            <div className="text-2xl font-black text-amber-300 mt-0.5">+50 PTS</div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 md:p-8 shadow-xl border border-slate-200 space-y-6">
        
        {/* Title */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Complaint Subject / Short Title *
          </label>
          <input
            type="text"
            required
            placeholder="e.g., Deep Pothole on Sector 14 Main Road..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-300 text-slate-900 font-medium text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none"
          />
        </div>

        {/* Description & AI Assistant */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Detailed Problem Description *
            </label>
            <button
              type="button"
              onClick={() => setAiModalOpen(true)}
              className="inline-flex items-center space-x-1.5 text-xs font-bold text-sky-600 hover:text-sky-700 bg-sky-50 hover:bg-sky-100 px-3 py-1.5 rounded-lg transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-sky-500 animate-pulse" />
              <span>Use AI Auto-Classifier</span>
            </button>
          </div>
          <textarea
            required
            rows={4}
            placeholder="Describe the issue, location landmarks, and impact on citizens..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-300 text-slate-900 font-medium text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none"
          />
        </div>

        {/* Category & Urgency */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Department Category *
            </label>
            <select
              value={departmentId}
              onChange={handleDepartmentChange}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 text-slate-900 font-semibold text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none bg-white"
            >
              {departments.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name} (SLA: {d.slaHours}h)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Urgency / Priority Level *
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 text-slate-900 font-semibold text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none bg-white"
            >
              <option value="Low">Low Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="High">High Priority</option>
              <option value="Emergency">🚨 Emergency Alert</option>
            </select>
          </div>
        </div>

        {/* Location & Map Selector */}
        <div className="space-y-3">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
            Complaint Location & GIS Coordinates
          </label>
          <input
            type="text"
            placeholder="Street address or nearest landmark..."
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-300 text-slate-900 font-medium text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none"
          />
          <div className="h-64 w-full">
            <InteractiveMap
              center={[lat, lng]}
              interactive={true}
              onLocationSelect={handleLocationSelect}
            />
          </div>
        </div>

        {/* Photo Upload & Interactive Photo Spot Annotator */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Upload Problem Photo & Click to Mark Spots
            </label>
            <label className="cursor-pointer inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-sky-50 hover:bg-sky-100 border border-sky-200 text-sky-700 font-bold text-xs transition-colors">
              <Camera className="w-4 h-4 text-sky-600" />
              <span>{imagePreview ? 'Change Photo' : 'Upload Street Photo'}</span>
              <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
            </label>
          </div>

          {imagePreview ? (
            <PhotoAnnotator
              imageUrl={imagePreview}
              annotations={annotations}
              onChange={setAnnotations}
            />
          ) : (
            <div className="p-8 border-2 border-dashed border-slate-300 rounded-2xl text-center space-y-2 bg-slate-50">
              <Camera className="w-10 h-10 text-slate-400 mx-auto" />
              <p className="text-sm font-semibold text-slate-600">Upload a street photo to click and annotate exact problem spots!</p>
              <p className="text-xs text-slate-400">Supports JPG, PNG, WebP up to 10MB</p>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="pt-4 border-t border-slate-200 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-sky-600 via-indigo-600 to-purple-600 hover:from-sky-500 hover:to-purple-500 text-white font-bold text-base shadow-xl flex items-center justify-center space-x-2 transition-all transform hover:-translate-y-0.5"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Registering Complaint...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-5 h-5" />
                <span>Submit Grievance (+50 PTS)</span>
              </>
            )}
          </button>
        </div>

      </form>

      {/* AI Assistant Modal */}
      <AiAssistantModal
        isOpen={aiModalOpen}
        onClose={() => setAiModalOpen(false)}
        title={title}
        description={description}
        onApplySuggestion={handleApplyAiSuggestion}
      />
    </div>
  );
};
