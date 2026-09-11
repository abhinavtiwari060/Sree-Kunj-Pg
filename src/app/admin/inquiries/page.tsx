'use client';

import React, { useEffect, useState } from 'react';
import { MessageSquare, Search, Phone, Mail, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchInquiries = async () => {
    try {
      const res = await fetch('/api/inquiries');
      const data = await res.json();
      if (data.inquiries) setInquiries(data.inquiries);
    } catch (e) {
      console.error('Error fetching inquiries:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/inquiries/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setInquiries((prev) =>
          prev.map((i) => (i._id === id ? { ...i, status: newStatus } : i))
        );
      }
    } catch (e) {
      console.error('Error updating inquiry status:', e);
    }
  };

  const filtered = inquiries.filter((i) => {
    const matchesSearch =
      i.inquiryId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      i.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      i.phone?.includes(searchTerm) ||
      i.message?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || i.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Inquiries Inbox</h1>
        <p className="text-xs text-slate-500">
          Track admissions questions, price queries, and student requests from the website.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search inquiries..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3 py-2 text-xs font-medium text-slate-800 focus:outline-none"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 w-full sm:w-auto"
        >
          <option value="all">All Statuses</option>
          <option value="New">New</option>
          <option value="Contacted">Contacted</option>
          <option value="Resolved">Resolved</option>
          <option value="Closed">Closed</option>
        </select>
      </div>

      {/* Inquiries Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3.5">Inquiry ID</th>
                <th className="px-5 py-3.5">Name & Phone</th>
                <th className="px-5 py-3.5">Category & Room</th>
                <th className="px-5 py-3.5">Message</th>
                <th className="px-5 py-3.5 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-slate-400">
                    No inquiries found.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr key={item._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-5 py-4 font-bold text-slate-900">{item.inquiryId}</td>
                    <td className="px-5 py-4">
                      <span className="font-bold text-slate-800 block">{item.name}</span>
                      <span className="text-[11px] text-slate-500">{item.phone}</span>
                      {item.email && <span className="text-[10px] text-slate-400 block">{item.email}</span>}
                    </td>
                    <td className="px-5 py-4">
                      <span className="font-semibold text-pink-600 block">{item.inquiryType}</span>
                      {item.room && <span className="text-[11px] text-slate-500">{item.room}</span>}
                    </td>
                    <td className="px-5 py-4 text-slate-700 max-w-sm">
                      <p className="line-clamp-2">{item.message}</p>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <select
                        value={item.status}
                        onChange={(e) => handleStatusChange(item._id, e.target.value)}
                        className={`text-xs font-bold rounded-lg px-2.5 py-1 border focus:outline-none cursor-pointer ${
                          item.status === 'New'
                            ? 'bg-amber-50 text-amber-800 border-amber-300'
                            : item.status === 'Contacted'
                            ? 'bg-blue-50 text-blue-800 border-blue-300'
                            : 'bg-emerald-50 text-emerald-800 border-emerald-300'
                        }`}
                      >
                        <option value="New">New</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Resolved">Resolved</option>
                        <option value="Closed">Closed</option>
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
