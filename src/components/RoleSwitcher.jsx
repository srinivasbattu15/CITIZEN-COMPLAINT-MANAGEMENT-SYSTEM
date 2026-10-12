import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { User, ShieldCheck, Briefcase, Sparkles } from 'lucide-react';

export const RoleSwitcher = () => {
  const { user, switchRole } = useAuth();
  const { addToast } = useNotification();

  const handleRoleChange = async (role) => {
    const updated = await switchRole(role);
    if (updated) {
      addToast(`Switched active view to ${role.toUpperCase()} mode (${updated.name})`, 'success', 'Demo Role Changed');
    }
  };

  return (
    <div className="bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 text-white text-xs py-2 px-4 shadow-inner border-b border-sky-800/40">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-2 font-medium">
          <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 font-semibold border border-sky-400/30">
            <Sparkles className="w-3.5 h-3.5 mr-1 animate-pulse" /> Live Testing Control
          </span>
          <span className="text-slate-300 hidden sm:inline">Active User:</span>
          <span className="font-bold text-sky-200">{user ? user.name : 'Guest'}</span>
          {user && (
            <span className="capitalize text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
              Role: {user.role}
            </span>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-slate-400 font-semibold mr-1">Instant Demo Switcher:</span>
          <button
            onClick={() => handleRoleChange('citizen')}
            className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg font-medium transition-all ${
              user?.role === 'citizen'
                ? 'bg-sky-500 text-white shadow-sm ring-2 ring-sky-300'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Citizen</span>
          </button>

          <button
            onClick={() => handleRoleChange('officer')}
            className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg font-medium transition-all ${
              user?.role === 'officer'
                ? 'bg-emerald-500 text-white shadow-sm ring-2 ring-emerald-300'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Officer</span>
          </button>

          <button
            onClick={() => handleRoleChange('admin')}
            className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg font-medium transition-all ${
              user?.role === 'admin'
                ? 'bg-purple-600 text-white shadow-sm ring-2 ring-purple-300'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Admin</span>
          </button>
        </div>
      </div>
    </div>
  );
};
