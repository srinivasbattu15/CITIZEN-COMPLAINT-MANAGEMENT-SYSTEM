import React from 'react';
import { CheckCircle2, Clock, UserCheck, ShieldCheck, AlertCircle, MessageSquare } from 'lucide-react';

export const ComplaintTimeline = ({ timeline = [] }) => {
  const getIcon = (status) => {
    switch (status) {
      case 'Submitted':
        return <Clock className="w-4 h-4 text-blue-600" />;
      case 'Assigned':
        return <UserCheck className="w-4 h-4 text-amber-600" />;
      case 'In Progress':
        return <AlertCircle className="w-4 h-4 text-purple-600 animate-spin" />;
      case 'Resolved':
        return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
      case 'Feedback Received':
        return <MessageSquare className="w-4 h-4 text-sky-600" />;
      default:
        return <ShieldCheck className="w-4 h-4 text-slate-600" />;
    }
  };

  return (
    <div className="flow-root py-2">
      <ul className="-mb-8">
        {timeline.map((item, idx) => (
          <li key={idx}>
            <div className="relative pb-8">
              {idx !== timeline.length - 1 ? (
                <span
                  className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-slate-200"
                  aria-hidden="true"
                />
              ) : null}
              <div className="relative flex space-x-3 items-start">
                <div>
                  <span className="h-8 w-8 rounded-full bg-slate-100 border border-slate-300 flex items-center justify-center ring-8 ring-white shadow-sm">
                    {getIcon(item.status)}
                  </span>
                </div>
                <div className="flex-1 min-w-0 pt-0.5">
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-bold text-slate-900">{item.status}</span>
                    <span className="text-xs text-slate-500">
                      {new Date(item.timestamp).toLocaleString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 mt-1">{item.note}</p>
                  {item.updatedBy && (
                    <span className="inline-block mt-1 text-xs text-slate-400 font-medium">
                      Updated by: {item.updatedBy}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
