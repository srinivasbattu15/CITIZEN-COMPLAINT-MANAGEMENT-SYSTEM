import React from 'react';
import { Flame, AlertTriangle, Info } from 'lucide-react';

export const PriorityBadge = ({ priority }) => {
  switch (priority) {
    case 'Emergency':
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-rose-600 text-white shadow-sm animate-pulse">
          <Flame className="w-3.5 h-3.5 mr-1" />
          Emergency
        </span>
      );
    case 'High':
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-700 border border-rose-200">
          <AlertTriangle className="w-3.5 h-3.5 mr-1 text-rose-600" />
          High
        </span>
      );
    case 'Medium':
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700 border border-amber-200">
          <Info className="w-3.5 h-3.5 mr-1 text-amber-600" />
          Medium
        </span>
      );
    case 'Low':
    default:
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
          Low
        </span>
      );
  }
};
