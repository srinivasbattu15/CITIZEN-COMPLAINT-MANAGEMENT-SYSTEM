import React, { useState } from 'react';
import { Sparkles, Bot, ArrowRight, Check, Loader2, X } from 'lucide-react';
import { api } from '../utils/api';

export const AiAssistantModal = ({ isOpen, onClose, title, description, onApplySuggestion }) => {
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);

  if (!isOpen) return null;

  const handleAnalyze = async () => {
    setAnalyzing(true);
    try {
      const res = await api.aiAnalyze(title, description);
      setResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-sky-100">
        <div className="bg-gradient-to-r from-sky-600 to-indigo-700 text-white p-5 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-white/10 rounded-lg">
              <Bot className="w-6 h-6 text-sky-200" />
            </div>
            <div>
              <h3 className="font-bold text-lg leading-snug">AI Complaint Assistant</h3>
              <p className="text-xs text-sky-100">Smart Category Routing & Urgency Classifier</p>
            </div>
          </div>
          <button onClick={onClose} className="text-sky-200 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {!result ? (
            <div className="text-center py-4 space-y-4">
              <div className="mx-auto w-12 h-12 rounded-full bg-sky-100 flex items-center justify-center text-sky-600">
                <Sparkles className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-base">Analyze Complaint Details</h4>
                <p className="text-sm text-slate-500 max-w-xs mx-auto mt-1">
                  Our AI engine will analyze your problem description to suggest the exact municipal department and urgency level.
                </p>
              </div>

              <button
                onClick={handleAnalyze}
                disabled={analyzing}
                className="w-full py-3 px-4 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-semibold text-sm shadow-md flex items-center justify-center space-x-2 transition-all"
              >
                {analyzing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Analyzing text patterns...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Run Smart Classification</span>
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-sky-50 border border-sky-200 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-sky-700">Analysis Result</span>
                  <span className="text-xs font-extrabold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full">
                    {result.confidence} Match
                  </span>
                </div>
                <p className="text-sm text-slate-700">{result.summary}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <span className="text-xs text-slate-500 font-medium">Suggested Department</span>
                  <div className="font-bold text-slate-900 mt-0.5">{result.category}</div>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <span className="text-xs text-slate-500 font-medium">Suggested Priority</span>
                  <div className="font-bold text-rose-600 mt-0.5">{result.priority}</div>
                </div>
              </div>

              <div className="flex items-center space-x-3 pt-2">
                <button
                  onClick={() => {
                    onApplySuggestion(result);
                    onClose();
                  }}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow flex items-center justify-center space-x-1"
                >
                  <Check className="w-4 h-4" />
                  <span>Apply AI Suggestions</span>
                </button>
                <button
                  onClick={onClose}
                  className="py-2.5 px-4 rounded-xl bg-slate-100 text-slate-700 font-medium text-sm hover:bg-slate-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
