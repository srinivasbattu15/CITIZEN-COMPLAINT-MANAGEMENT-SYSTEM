import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';

import { ProtectedRoute } from './components/ProtectedRoute';
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
            {/* Header Navigation */}
            <Navbar />

            {/* Main Application Body */}
            <main className="flex-1">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/track" element={<TrackComplaint />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Citizen-Only Routes */}
                <Route
                  path="/submit"
                  element={
                    <ProtectedRoute allowedRoles={['citizen']}>
                      <SubmitComplaint />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/rewards"
                  element={
                    <ProtectedRoute allowedRoles={['citizen']}>
                      <RewardsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/citizen-dashboard"
                  element={
                    <ProtectedRoute allowedRoles={['citizen']}>
                      <CitizenDashboard />
                    </ProtectedRoute>
                  }
                />

                {/* Officer-Only Routes */}
                <Route
                  path="/officer-dashboard"
                  element={
                    <ProtectedRoute allowedRoles={['officer']}>
                      <OfficerDashboard />
                    </ProtectedRoute>
                  }
                />

                {/* Admin-Only Routes */}
                <Route
                  path="/admin-dashboard"
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin-profile"
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <AdminProfilePage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/analytics"
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <AnalyticsPage />
                    </ProtectedRoute>
                  }
                />
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
