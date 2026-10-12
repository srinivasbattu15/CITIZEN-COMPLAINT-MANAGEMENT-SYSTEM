import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';
import {
  ShieldAlert, PlusCircle, Search, LayoutDashboard, BarChart3, LogOut,
  User, Bell, Trophy, Sparkles, Menu, X, Settings
} from 'lucide-react';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [userPoints, setUserPoints] = useState(user?.points || 0);

  useEffect(() => {
    if (user?.id) {
      api.getRewardsCatalog(user.id)
        .then(d => setUserPoints(d.userPoints))
        .catch(() => {});
    }
  }, [user, location.pathname]);

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          
          {/* Logo & Brand */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <span className="font-black text-xl text-slate-900 tracking-tight block leading-tight">
                  CCMS<span className="text-sky-600">.gov</span>
                </span>
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                  Citizen Complaint System
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            {/* Desktop Navigation Links */}
            <div className="hidden md:flex ml-8 space-x-1">
              <Link
                to="/"
                className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  isActive('/') ? 'bg-sky-50 text-sky-700' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                Home
              </Link>

              <Link
                to="/track"
                className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center space-x-1 ${
                  isActive('/track') ? 'bg-sky-50 text-sky-700' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Search className="w-4 h-4 text-slate-500" />
                <span>Track Status</span>
              </Link>

              {/* Citizen-Only Links */}
              {(!user || user.role === 'citizen') && (
                <Link
                  to="/submit"
                  className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center space-x-1 ${
                    isActive('/submit') ? 'bg-sky-50 text-sky-700' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <PlusCircle className="w-4 h-4 text-sky-600" />
                  <span>Submit Complaint</span>
                </Link>
              )}

              {user?.role === 'citizen' && (
                <>
                  <Link
                    to="/rewards"
                    className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center space-x-1 ${
                      isActive('/rewards') ? 'bg-amber-50 text-amber-700 font-bold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <Trophy className="w-4 h-4 text-amber-500" />
                    <span>Civic Rewards</span>
                  </Link>

                  <Link
                    to="/citizen-dashboard"
                    className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center space-x-1 ${
                      isActive('/citizen-dashboard') ? 'bg-sky-50 text-sky-700' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <LayoutDashboard className="w-4 h-4 text-sky-600" />
                    <span>My Complaints</span>
                  </Link>
                </>
              )}

              {/* Officer-Only Links */}
              {user?.role === 'officer' && (
                <Link
                  to="/officer-dashboard"
                  className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center space-x-1 ${
                    isActive('/officer-dashboard') ? 'bg-emerald-50 text-emerald-700' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4 text-emerald-600" />
                  <span>Officer Queue</span>
                </Link>
              )}

              {/* Admin-Only Links */}
              {user?.role === 'admin' && (
                <>
                  <Link
                    to="/admin-dashboard"
                    className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center space-x-1 ${
                      isActive('/admin-dashboard') ? 'bg-purple-50 text-purple-700' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <LayoutDashboard className="w-4 h-4 text-purple-600" />
                    <span>Admin Control</span>
                  </Link>

                  <Link
                    to="/admin-profile"
                    className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center space-x-1 ${
                      isActive('/admin-profile') ? 'bg-purple-100 text-purple-800 font-bold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <Settings className="w-4 h-4 text-purple-600" />
                    <span>Admin Settings</span>
                  </Link>

                  <Link
                    to="/analytics"
                    className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center space-x-1 ${
                      isActive('/analytics') ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <BarChart3 className="w-4 h-4 text-indigo-600" />
                    <span>Analytics</span>
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Right User Bar & Points Pill */}
          <div className="hidden md:flex items-center space-x-4">
            
            {/* Live Citizen Points Counter Pill */}
            {user?.role === 'citizen' && (
              <Link
                to="/rewards"
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 text-white shadow-sm hover:scale-105 transition-transform"
                title="Your Civic Points Balance"
              >
                <Sparkles className="w-4 h-4 text-white animate-pulse" />
                <span className="font-black text-xs">{userPoints} PTS</span>
              </Link>
            )}

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setNotifOpen(!notifOpen)}
                className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-full relative"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white"></span>
              </button>

              {notifOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-fadeIn">
                  <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                    <h4 className="font-bold text-sm text-slate-900">Notifications</h4>
                    <span className="text-[10px] font-bold bg-sky-100 text-sky-700 px-2 py-0.5 rounded-full">2 New</span>
                  </div>
                  <div className="divide-y divide-slate-100 text-xs">
                    <div className="p-3 hover:bg-slate-50">
                      <div className="font-semibold text-amber-600 flex items-center space-x-1">
                        <Trophy className="w-3.5 h-3.5" />
                        <span>+50 Civic Points Awarded!</span>
                      </div>
                      <div className="text-slate-600 mt-0.5">Your street grievance report was registered with photo annotations!</div>
                      <div className="text-slate-400 text-[10px] mt-1">10 minutes ago</div>
                    </div>
                    <div className="p-3 hover:bg-slate-50">
                      <div className="font-semibold text-emerald-600">Complaint Resolved!</div>
                      <div className="text-slate-600 mt-0.5">CCMS-2026-10394 marked as Resolved. Click to rate & earn +25 bonus points!</div>
                      <div className="text-slate-400 text-[10px] mt-1">Yesterday</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {user ? (
              <div className="flex items-center space-x-3 border-l border-slate-200 pl-4">
                <div className="text-right">
                  <div className="text-sm font-bold text-slate-900 leading-tight">{user.name}</div>
                  <div className="text-xs text-slate-500 capitalize">{user.role} Account</div>
                </div>
                <button
                  onClick={() => {
                    logout();
                    navigate('/login');
                  }}
                  title="Logout"
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-white bg-sky-600 hover:bg-sky-700 shadow-sm transition-all"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-4 space-y-2">
          <Link to="/" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-50">Home</Link>
          <Link to="/track" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-50">Track Complaint</Link>

          {/* Citizen Links */}
          {(!user || user.role === 'citizen') && (
            <Link to="/submit" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-50">Submit Complaint</Link>
          )}
          {user?.role === 'citizen' && (
            <>
              <Link to="/rewards" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-amber-700 bg-amber-50">Civic Rewards Marketplace</Link>
              <Link to="/citizen-dashboard" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-50">Citizen Dashboard</Link>
            </>
          )}

          {/* Officer Links */}
          {user?.role === 'officer' && (
            <Link to="/officer-dashboard" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-emerald-700 bg-emerald-50">Officer Queue</Link>
          )}

          {/* Admin Links */}
          {user?.role === 'admin' && (
            <>
              <Link to="/admin-dashboard" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-purple-700 bg-purple-50">Admin Control</Link>
              <Link to="/admin-profile" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-purple-700 hover:bg-slate-50">Admin Profile Settings</Link>
              <Link to="/analytics" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-indigo-700 hover:bg-slate-50">Analytics & Reports</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};
