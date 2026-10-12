import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';

import { RoleSwitcher } from './components/RoleSwitcher';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

import { Home } from './pages/Home';
import { SubmitComplaint } from './pages/SubmitComplaint';
import { TrackComplaint } from './pages/TrackComplaint';
import { CitizenDashboard } from './pages/CitizenDashboard';
import { OfficerDashboard } from './pages/OfficerDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { AdminProfilePage } from './pages/AdminProfilePage';
import { RewardsPage } from './pages/RewardsPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { Login } from './pages/Login';
import { Register } from './pages/Register';

export default function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <Router>
          <div className="min-h-screen flex flex-col bg-slate-50 font-sans antialiased text-slate-900">
            {/* Top Demo Bar */}
            <RoleSwitcher />

            {/* Header Navigation */}
            <Navbar />

            {/* Main Application Body */}
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/submit" element={<SubmitComplaint />} />
                <Route path="/track" element={<TrackComplaint />} />
                <Route path="/rewards" element={<RewardsPage />} />
                <Route path="/citizen-dashboard" element={<CitizenDashboard />} />
                <Route path="/officer-dashboard" element={<OfficerDashboard />} />
                <Route path="/admin-dashboard" element={<AdminDashboard />} />
                <Route path="/admin-profile" element={<AdminProfilePage />} />
                <Route path="/analytics" element={<AnalyticsPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
              </Routes>
            </main>

            {/* Footer */}
            <Footer />
          </div>
        </Router>
      </NotificationProvider>
    </AuthProvider>
  );
}
