import React, { useState, useEffect } from 'react';
import { api } from '../utils/api';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';
import { BarChart3, TrendingUp, PieChart as PieIcon, Download, RefreshCw } from 'lucide-react';

export const AnalyticsPage = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const data = await api.getAnalytics();
      setAnalytics(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  // Format data for Recharts
  const statusPieData = analytics ? [
    { name: 'Submitted', value: analytics.submitted, color: '#3b82f6' },
    { name: 'Assigned', value: analytics.assigned, color: '#f59e0b' },
    { name: 'In Progress', value: analytics.inProgress, color: '#a855f7' },
    { name: 'Resolved', value: analytics.resolved, color: '#10b981' },
    { name: 'Rejected', value: analytics.rejected, color: '#f43f5e' }
  ].filter(d => d.value > 0) : [];

  const categoryBarData = analytics && analytics.categoryCounts
    ? Object.keys(analytics.categoryCounts).map(cat => ({
        name: cat.split(' ')[0], // Short name for X-axis
        fullCategory: cat,
        count: analytics.categoryCounts[cat]
      }))
    : [];

  const deptPerformanceData = analytics?.departmentPerformance || [];

  const handleExportCSV = () => {
    if (!analytics) return;
    let csv = "Department,Total Complaints,Resolved,Pending\n";
    deptPerformanceData.forEach(d => {
      csv += `"${d.name}",${d.total},${d.resolved},${d.pending}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CCMS_Department_Performance_Report.csv`;
    a.click();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-sky-900 text-white rounded-3xl p-8 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-400/30 mb-2">
            <BarChart3 className="w-3.5 h-3.5" /> Public Analytics Engine
          </span>
          <h1 className="text-3xl font-black">City Performance & Grievance Reports</h1>
          <p className="text-slate-300 text-sm mt-1">Interactive data visualizer analyzing resolution speeds and department efficiency.</p>
        </div>

        <button
          onClick={handleExportCSV}
          className="px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg flex items-center space-x-2 transition-all shrink-0"
        >
          <Download className="w-5 h-5" />
          <span>Export CSV Report</span>
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-500 font-semibold">Generating analytics charts...</div>
      ) : (
        <div className="space-y-8">
          
          {/* Top Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Status Breakdown Pie Chart */}
            <div className="bg-white rounded-3xl p-6 shadow-xl border border-slate-200 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-black text-slate-900">Grievance Status Distribution</h3>
                  <p className="text-xs text-slate-500">Live breakdown of complaints by current lifecycle stage</p>
                </div>
                <PieIcon className="w-5 h-5 text-indigo-600" />
              </div>

              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusPieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {statusPieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Department Performance Bar Chart */}
            <div className="bg-white rounded-3xl p-6 shadow-xl border border-slate-200 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-black text-slate-900">Department Resolution Efficiency</h3>
                  <p className="text-xs text-slate-500">Total vs Resolved complaints per department</p>
                </div>
                <TrendingUp className="w-5 h-5 text-emerald-600" />
              </div>

              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={deptPerformanceData}>
                    <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="total" fill="#94a3b8" name="Total Filed" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="resolved" fill="#10b981" name="Resolved" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>

          {/* Detailed Department Performance Table */}
          <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xl border border-slate-200 space-y-6">
            <h3 className="text-xl font-black text-slate-900">Department SLA Audit Table</h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50 text-xs font-bold text-slate-700 uppercase border-b border-slate-200">
                  <tr>
                    <th className="p-4">Department Name</th>
                    <th className="p-4 text-center">Total Received</th>
                    <th className="p-4 text-center">Resolved</th>
                    <th className="p-4 text-center">Pending Action</th>
                    <th className="p-4 text-right">Completion Rate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {deptPerformanceData.map((d) => {
                    const rate = d.total ? Math.round((d.resolved / d.total) * 100) : 0;
                    return (
                      <tr key={d.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="p-4 font-bold text-slate-900">{d.name}</td>
                        <td className="p-4 text-center font-bold text-slate-800">{d.total}</td>
                        <td className="p-4 text-center font-bold text-emerald-600">{d.resolved}</td>
                        <td className="p-4 text-center font-bold text-amber-600">{d.pending}</td>
                        <td className="p-4 text-right">
                          <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                            {rate}%
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
