import React from 'react';
import { Clock, CheckCircle, AlertCircle, FileText, XCircle } from 'lucide-react';

export const StatusBadge = ({ status }) => {
  switch (status) {
    case 'Submitted':
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200">
          <FileText className="w-3.5 h-3.5 mr-1 text-blue-600" />
          Submitted
        </span>
      );
    case 'Assigned':
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
          <Clock className="w-3.5 h-3.5 mr-1 text-amber-600" />
          Assigned
        </span>
      );
    case 'In Progress':
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-800 border border-purple-200">
          <AlertCircle className="w-3.5 h-3.5 mr-1 text-purple-600 animate-pulse" />
          In Progress
        </span>
      );
    case 'Resolved':
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
          <CheckCircle className="w-3.5 h-3.5 mr-1 text-emerald-600" />
          Resolved
        </span>
      );
    case 'Rejected':
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 border border-rose-200">
          <XCircle className="w-3.5 h-3.5 mr-1 text-rose-600" />
          Rejected
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
          {status}
        </span>
      );
  }
};
