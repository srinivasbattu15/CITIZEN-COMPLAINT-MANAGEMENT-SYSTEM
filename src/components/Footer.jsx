import React from 'react';
import { ShieldCheck, PhoneCall, Mail, MapPin } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 text-sm mt-auto border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-white font-black text-xl">
              <ShieldCheck className="w-6 h-6 text-sky-400" />
              <span>CCMS<span className="text-sky-400">.gov</span></span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              Empowering citizens with transparent public service resolution, real-time complaint tracking, and smart department management.
            </p>
          </div>

          <div>
            <h4 className="text-white font-bold text-sm mb-3">Quick Services</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="/submit" className="hover:text-white transition-colors">Submit New Grievance</a></li>
              <li><a href="/track" className="hover:text-white transition-colors">Public Complaint Tracker</a></li>
              <li><a href="/citizen-dashboard" className="hover:text-white transition-colors">Citizen Dashboard</a></li>
              <li><a href="/analytics" className="hover:text-white transition-colors">Public Performance Analytics</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold text-sm mb-3">Municipal Departments</h4>
            <ul className="space-y-2 text-xs">
              <li>Sanitation & Waste Management</li>
              <li>Public Works & Roads Repair</li>
              <li>Electricity & Street Lighting</li>
              <li>Water Supply & Sewage Services</li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold text-sm mb-3">Emergency & Helpline</h4>
            <ul className="space-y-2.5 text-xs">
              <li className="flex items-center space-x-2">
                <PhoneCall className="w-4 h-4 text-sky-400" />
                <span>Toll-Free Helpline: 1800-11-2026</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-sky-400" />
                <span>support@ccms.gov.in</span>
              </li>
              <li className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-sky-400" />
                <span>Municipal Headquarters, Civic Center</span>
              </li>
            </ul>
          </div>

        </div>

        <div className="pt-6 border-t border-slate-800 text-center text-xs text-slate-500 flex flex-col sm:flex-row justify-between items-center gap-2">
          <div>© 2026 Citizen Complaint Management System (CCMS). All rights reserved.</div>
          <div className="flex space-x-4">
            <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-400 cursor-pointer">Terms of Governance</span>
            <span className="hover:text-slate-400 cursor-pointer">SLA Commitment</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
