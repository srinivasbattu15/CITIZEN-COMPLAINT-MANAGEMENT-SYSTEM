import React, { useState } from 'react';
import { MapPin, Plus, Trash2, Tag, Eye } from 'lucide-react';

export const PhotoAnnotator = ({
  imageUrl,
  annotations = [],
  onChange = null, // If provided, user can click image to add/edit pins
  readOnly = false
}) => {
  const [activePin, setActivePin] = useState(null);
  const [newPinPos, setNewPinPos] = useState(null);
  const [pinLabel, setPinLabel] = useState('');
  const [pinNote, setPinNote] = useState('');

  const handleImageClick = (e) => {
    if (readOnly || !onChange) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);

    setNewPinPos({ x, y });
    setPinLabel('');
    setPinNote('');
  };

  const handleAddPin = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!newPinPos || !pinLabel.trim()) return;
    const newAnnotation = {
      id: `pin-${Date.now()}`,
      x: newPinPos.x,
      y: newPinPos.y,
      label: pinLabel,
      note: pinNote
    };

    if (onChange) {
      onChange([...annotations, newAnnotation]);
    }
    setNewPinPos(null);
    setPinLabel('');
    setPinNote('');
  };

  const handleRemovePin = (id) => {
    if (readOnly || !onChange) return;
    if (onChange) {
      onChange(annotations.filter(a => a.id !== id));
    }
    setActivePin(null);
  };

  return (
    <div className="space-y-4">
      <div className="relative rounded-2xl overflow-hidden border border-slate-300 bg-slate-950 shadow-inner group">
        {/* Main Image */}
        <div className="relative cursor-crosshair select-none" onClick={handleImageClick}>
          <img
            src={imageUrl}
            alt="Problem Spot Visual"
            className="w-full h-auto max-h-[450px] object-contain mx-auto block"
          />

          {/* Render Existing Pin Markers */}
          {annotations.map((ann, idx) => (
            <div
              key={ann.id || idx}
              style={{ left: `${ann.x}%`, top: `${ann.y}%` }}
              onClick={(e) => {
                e.stopPropagation();
                setActivePin(activePin === ann.id ? null : ann.id);
              }}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-20 group/pin cursor-pointer"
            >
              <div className="relative flex items-center justify-center">
                <span className="animate-ping absolute inline-flex h-6 w-6 rounded-full bg-rose-400 opacity-75"></span>
                <div className="relative w-8 h-8 rounded-full bg-gradient-to-tr from-rose-600 to-amber-500 text-white font-black text-xs shadow-lg border-2 border-white flex items-center justify-center transform transition-transform group-hover/pin:scale-110">
                  {idx + 1}
                </div>

                {/* Popover Card */}
                <div className={`absolute bottom-10 left-1/2 -translate-x-1/2 w-52 bg-slate-900/95 text-white p-3 rounded-xl shadow-2xl border border-slate-700 backdrop-blur-md z-30 text-xs space-y-1 transition-all ${
                  activePin === ann.id ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none group-hover/pin:opacity-100 group-hover/pin:scale-100 group-hover/pin:pointer-events-auto'
                }`}>
                  <div className="flex items-center justify-between font-bold text-sky-400">
                    <span>#{idx + 1} {ann.label}</span>
                    {!readOnly && onChange && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemovePin(ann.id);
                        }}
                        className="text-rose-400 hover:text-rose-200"
                        title="Delete spot"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                  <p className="text-slate-300 leading-snug">{ann.note || 'No detailed note provided'}</p>
                </div>
              </div>
            </div>
          ))}

          {/* Render Temp New Pin Position */}
          {newPinPos && (
            <div
              style={{ left: `${newPinPos.x}%`, top: `${newPinPos.y}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-20 animate-bounce"
            >
              <div className="w-8 h-8 rounded-full bg-sky-500 text-white font-bold text-xs shadow-lg border-2 border-white flex items-center justify-center">
                📍
              </div>
            </div>
          )}
        </div>

        {!readOnly && onChange && (
          <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md text-white px-3 py-1.5 rounded-lg text-xs font-medium border border-slate-700/60 shadow">
            💡 Click anywhere on the photo to tag an exact problem spot!
          </div>
        )}
      </div>

      {/* Temp Pin Card */}
      {newPinPos && !readOnly && onChange && (
        <div className="bg-sky-50 border border-sky-200 p-4 rounded-2xl shadow-sm space-y-3 animate-fadeIn">
          <div className="flex items-center space-x-2 text-sky-900 font-bold text-xs uppercase tracking-wider">
            <Tag className="w-4 h-4 text-sky-600" />
            <span>Tag Spot Location ({newPinPos.x}%, {newPinPos.y}%)</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="text"
              required
              placeholder="Spot Label (e.g., Deep Trench, Loose Wire)..."
              value={pinLabel}
              onChange={(e) => setPinLabel(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddPin(e);
                }
              }}
              className="px-3 py-2 rounded-xl border border-sky-200 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
            <input
              type="text"
              placeholder="Detail note explaining the issue at this spot..."
              value={pinNote}
              onChange={(e) => setPinNote(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddPin(e);
                }
              }}
              className="px-3 py-2 rounded-xl border border-sky-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <div className="flex items-center space-x-2 justify-end">
            <button
              type="button"
              onClick={() => setNewPinPos(null)}
              className="px-3 py-1.5 rounded-lg bg-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-300"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleAddPin}
              className="px-4 py-1.5 rounded-lg bg-sky-600 text-white text-xs font-bold shadow hover:bg-sky-700 flex items-center space-x-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Spot Pin</span>
            </button>
          </div>
        </div>
      )}

      {/* List of Annotations */}
      {annotations.length > 0 && (
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2">
          <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center space-x-1">
            <Eye className="w-4 h-4 text-sky-600" />
            <span>Annotated Spot Explanations ({annotations.length})</span>
          </h5>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {annotations.map((ann, idx) => (
              <div key={ann.id || idx} className="bg-white p-2.5 rounded-xl border border-slate-200 flex items-start space-x-2">
                <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-700 font-bold flex items-center justify-center shrink-0">
                  {idx + 1}
                </span>
                <div>
                  <span className="font-bold text-slate-900">{ann.label}</span>
                  <p className="text-slate-600 text-[11px] leading-tight">{ann.note}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
