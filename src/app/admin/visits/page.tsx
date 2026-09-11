'use client';

import React, { useEffect, useState } from 'react';
import { Video, MapPin, Search, CheckCircle2, Clock, XCircle, Phone, Calendar, User, Mail } from 'lucide-react';

export default function AdminVisitsPage() {
  const [visits, setVisits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  const fetchVisits = async () => {
    try {
      const res = await fetch('/api/visits');
      const data = await res.json();
      if (data.visits) setVisits(data.visits);
    } catch (e) {
      console.error('Error fetching visits:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVisits();
  }, []);

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/visits/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setVisits((prev) =>
          prev.map((v) => (v._id === id ? { ...v, status: newStatus } : v))
        );
      }
    } catch (e) {
      console.error('Error updating visit status:', e);
    }
  };

  const filtered = visits.filter((v) => {
    const matchesSearch =
      v.visitId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.phone?.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || v.status === statusFilter;
    const matchesType = typeFilter === 'all' || v.visitType === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Visit Appointments</h1>
        <p className="text-xs text-slate-500">
          Manage in-person campus walkthroughs and WhatsApp live video tour bookings.
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search by Visitor Name, Phone, Visit ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3 py-2 text-xs font-medium text-slate-800 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700"
          >
            <option value="all">All Modes</option>
            <option value="Physical Visit">Physical In-Person</option>
            <option value="Video Call Visit">Video Call</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700"
          >
            <option value="all">All Statuses</option>
            <option value="Waiting">Waiting</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Visits Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3.5">Visit ID</th>
                <th className="px-5 py-3.5">Visitor</th>
                <th className="px-5 py-3.5">Mode</th>
                <th className="px-5 py-3.5">Date & Slot</th>
                <th className="px-5 py-3.5">Message / Requirements</th>
                <th className="px-5 py-3.5 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-slate-400">
                    No visit requests found.
                  </td>
                </tr>
              ) : (
                filtered.map((v) => (
                  <tr key={v._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-5 py-4 font-bold text-slate-900">{v.visitId}</td>
                    <td className="px-5 py-4">
                      <span className="font-bold text-slate-800 block">{v.name}</span>
                      <span className="text-[11px] text-slate-500 flex items-center gap-1">
                        <Phone className="w-3 h-3 text-pink-500" /> {v.phone}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                          v.visitType === 'Video Call Visit'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {v.visitType === 'Video Call Visit' ? (
                          <Video className="w-3 h-3" />
                        ) : (
                          <MapPin className="w-3 h-3" />
                        )}
                        {v.visitType}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="font-bold text-slate-800 block">{v.preferredDate}</span>
                      <span className="text-slate-500 font-semibold">{v.preferredTime}</span>
                    </td>
                    <td className="px-5 py-4 text-slate-600 max-w-xs truncate">
                      {v.message || '—'}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <select
                        value={v.status}
                        onChange={(e) => handleStatusChange(v._id, e.target.value)}
                        className={`text-xs font-bold rounded-lg px-2.5 py-1 border focus:outline-none cursor-pointer ${
                          v.status === 'Confirmed'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            : v.status === 'Waiting'
                            ? 'bg-amber-50 text-amber-800 border-amber-300'
                            : v.status === 'Completed'
                            ? 'bg-blue-50 text-blue-800 border-blue-300'
                            : 'bg-rose-50 text-rose-800 border-rose-300'
                        }`}
                      >
                        <option value="Waiting">Waiting</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
