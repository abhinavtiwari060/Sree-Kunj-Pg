'use client';

import React, { useEffect, useState } from 'react';
import {
  Search,
  Filter,
  CheckCircle2,
  Clock,
  XCircle,
  Eye,
  X,
  Phone,
  User,
  Calendar,
  Layers,
  MessageSquare,
  Sparkles,
  Download
} from 'lucide-react';

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [floorFilter, setFloorFilter] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchBookings = async () => {
    try {
      const res = await fetch('/api/bookings');
      const data = await res.json();
      if (data.bookings) {
        setBookings(data.bookings);
      }
    } catch (e) {
      console.error('Error fetching bookings:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleStatusChange = async (id: string, newStatus: string) => {
    setUpdatingId(id);
    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (res.ok) {
        setBookings((prev) =>
          prev.map((b) => (b._id === id ? { ...b, status: newStatus } : b))
        );
        if (selectedBooking && selectedBooking._id === id) {
          setSelectedBooking((prev: any) => ({ ...prev, status: newStatus }));
        }
      }
    } catch (e) {
      console.error('Error updating status:', e);
    } finally {
      setUpdatingId(null);
    }
  };

  const filtered = bookings.filter((b) => {
    const matchesSearch =
      b.bookingId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.residentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.customerPhone?.includes(searchTerm) ||
      b.residentPhone?.includes(searchTerm) ||
      b.roomNumber?.includes(searchTerm);

    const matchesStatus = statusFilter === 'all' || b.status === statusFilter;
    const matchesFloor = floorFilter === 'all' || String(b.floor) === floorFilter;

    return matchesSearch && matchesStatus && matchesFloor;
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Room Bookings Management
          </h1>
          <p className="text-xs text-slate-500">
            Review resident profiles, change booking statuses, and manage room allocations.
          </p>
        </div>

        <button
          onClick={() => {
            const csvData = filtered.map((b) => ({
              ID: b.bookingId,
              Resident: b.residentName,
              Phone: b.residentPhone,
              Customer: b.customerName,
              Relationship: b.relationship,
              Floor: b.floor,
              Room: b.roomNumber,
              Date: b.preferredMoveInDate,
              Status: b.status,
            }));
            const blob = new Blob([JSON.stringify(csvData, null, 2)], {
              type: 'application/json',
            });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `bookings-${Date.now()}.json`;
            a.click();
          }}
          className="px-3.5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors self-start sm:self-auto"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Data</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col lg:flex-row gap-3 items-center justify-between">
        {/* Search */}
        <div className="relative w-full lg:w-96">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search by ID, Resident, Booker, Phone, Room..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:border-pink-500"
          />
        </div>

        {/* Dropdown Filters */}
        <div className="flex items-center gap-2 w-full lg:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="Waiting">Waiting (Pending)</option>
            <option value="Booked">Booked (Confirmed)</option>
            <option value="Unbooked">Unbooked</option>
            <option value="Cancelled">Cancelled</option>
          </select>

          <select
            value={floorFilter}
            onChange={(e) => setFloorFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none"
          >
            <option value="all">All Floors</option>
            <option value="1">Floor 1</option>
            <option value="2">Floor 2</option>
            <option value="3">Floor 3</option>
            <option value="4">Floor 4</option>
          </select>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3.5">Booking ID</th>
                <th className="px-5 py-3.5">Resident</th>
                <th className="px-5 py-3.5">Booked By</th>
                <th className="px-5 py-3.5">Floor / Room</th>
                <th className="px-5 py-3.5">Move-In Date</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-slate-400">
                    No bookings found matching the selected criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((b) => (
                  <tr key={b._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-5 py-4 font-bold text-slate-900">
                      {b.bookingId}
                    </td>
                    <td className="px-5 py-4">
                      <span className="font-bold text-slate-800 block">{b.residentName}</span>
                      <span className="text-[11px] text-slate-500">{b.residentPhone}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="font-semibold text-slate-700 block">{b.customerName}</span>
                      <span className="text-[10px] text-pink-600 font-bold bg-pink-50 px-1.5 py-0.5 rounded">
                        {b.relationship}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="font-bold text-pink-600">Floor {b.floor}</span>
                      <span className="text-slate-600 block">Room {b.roomNumber}</span>
                    </td>
                    <td className="px-5 py-4 font-medium text-slate-700">
                      {b.preferredMoveInDate}
                    </td>
                    <td className="px-5 py-4">
                      <select
                        value={b.status}
                        disabled={updatingId === b._id}
                        onChange={(e) => handleStatusChange(b._id, e.target.value)}
                        className={`text-xs font-bold rounded-lg px-2.5 py-1 border focus:outline-none cursor-pointer ${
                          b.status === 'Booked'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            : b.status === 'Waiting'
                            ? 'bg-amber-50 text-amber-800 border-amber-300'
                            : 'bg-rose-50 text-rose-800 border-rose-300'
                        }`}
                      >
                        <option value="Waiting">Waiting</option>
                        <option value="Booked">Booked</option>
                        <option value="Unbooked">Unbooked</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() => setSelectedBooking(b)}
                        className="p-1.5 rounded-lg text-slate-600 hover:text-pink-600 hover:bg-pink-50 transition-colors"
                        title="View Full Profile"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Details View Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 relative shadow-2xl border border-slate-200">
            <button
              onClick={() => setSelectedBooking(null)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-pink-600 bg-pink-50 px-2.5 py-0.5 rounded-full">
                Booking Information Dossier
              </span>
              <h3 className="text-xl font-black text-slate-900">
                {selectedBooking.bookingId}
              </h3>
            </div>

            <div className="space-y-4 text-xs">
              
              {/* Resident Card */}
              <div className="p-4 rounded-2xl bg-rose-50/50 border border-pink-100 space-y-2">
                <span className="font-bold text-pink-700 uppercase tracking-wider block text-[10px]">
                  Resident (Staying at PG)
                </span>
                <p className="text-sm font-bold text-slate-900">{selectedBooking.residentName}</p>
                <p className="text-slate-600">Phone: {selectedBooking.residentPhone}</p>
                <p className="text-slate-600">Relationship to Booker: {selectedBooking.relationship}</p>
              </div>

              {/* Booker Card */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="font-bold text-slate-500 uppercase tracking-wider block text-[10px]">
                  Applicant / Booker
                </span>
                <p className="text-sm font-bold text-slate-900">{selectedBooking.customerName}</p>
                <p className="text-slate-600">WhatsApp / Phone: {selectedBooking.customerPhone}</p>
                {selectedBooking.customerEmail && (
                  <p className="text-slate-600">Email: {selectedBooking.customerEmail}</p>
                )}
              </div>

              {/* Room & Dates */}
              <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Room</span>
                  <span className="font-black text-sm text-slate-900">
                    Floor {selectedBooking.floor} • Room {selectedBooking.roomNumber}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Move-In</span>
                  <span className="font-black text-sm text-slate-900">
                    {selectedBooking.preferredMoveInDate}
                  </span>
                </div>
              </div>

              {selectedBooking.message && (
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">
                    Special Notes / Batch
                  </span>
                  <p className="text-slate-700 italic">“{selectedBooking.message}”</p>
                </div>
              )}
            </div>

            {/* Quick Status Bar */}
            <div className="pt-2 flex items-center justify-between border-t border-slate-100">
              <span className="text-xs font-bold text-slate-600">Change Status:</span>
              <div className="flex gap-2">
                {['Waiting', 'Booked', 'Cancelled'].map((st) => (
                  <button
                    key={st}
                    onClick={() => handleStatusChange(selectedBooking._id, st)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      selectedBooking.status === st
                        ? 'bg-pink-600 text-white shadow-md'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
