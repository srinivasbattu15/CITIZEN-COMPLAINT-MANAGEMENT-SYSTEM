import React from 'react';
import { Camera, CheckCircle, ArrowRight } from 'lucide-react';

export const ProofViewer = ({ originalImage, proofImage, resolutionNotes }) => {
  return (
    <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-5 shadow-sm">
      <div className="flex items-center space-x-2 text-emerald-800 font-bold text-base mb-4">
        <CheckCircle className="w-5 h-5 text-emerald-600" />
        <span>Verified Resolution & Proof of Work</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {/* Before / Original Complaint Photo */}
        <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center">
              <Camera className="w-3.5 h-3.5 mr-1 text-rose-500" /> Initial Issue (Before)
            </span>
          </div>
          <div className="aspect-video bg-slate-100 rounded-lg overflow-hidden flex items-center justify-center">
            {originalImage ? (
              <img
                src={originalImage}
                alt="Initial Complaint Issue"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-xs text-slate-400">No initial image uploaded</span>
            )}
          </div>
        </div>

        {/* After / Officer Resolution Proof Photo */}
        <div className="bg-white p-3 rounded-xl border border-emerald-300 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700 flex items-center">
              <CheckCircle className="w-3.5 h-3.5 mr-1 text-emerald-600" /> Verified Resolution (After)
            </span>
          </div>
          <div className="aspect-video bg-emerald-50 rounded-lg overflow-hidden flex items-center justify-center">
            {proofImage ? (
              <img
                src={proofImage}
                alt="Resolution Proof"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-xs text-emerald-600 font-medium">Resolution inspected & confirmed</span>
            )}
          </div>
        </div>
      </div>

      {resolutionNotes && (
        <div className="bg-white p-4 rounded-xl border border-emerald-200 text-slate-700 text-sm">
          <h5 className="font-semibold text-slate-900 mb-1">Officer Resolution Summary:</h5>
          <p className="italic text-slate-600">"{resolutionNotes}"</p>
        </div>
      )}
    </div>
  );
};
