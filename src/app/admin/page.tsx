'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  CalendarCheck,
  Video,
  MessageSquare,
  Layers,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Users,
  Sparkles
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalBookings: 0,
    waitingBookings: 0,
    confirmedBookings: 0,
    cancelledBookings: 0,
    totalVisits: 0,
    waitingVisits: 0,
    totalInquiries: 0,
    newInquiries: 0,
    availableRooms: 0,
    totalRooms: 0,
  });
  const [recentBookings, setRecentBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [bRes, vRes, iRes, rRes] = await Promise.all([
          fetch('/api/bookings'),
          fetch('/api/visits'),
          fetch('/api/inquiries'),
          fetch('/api/rooms'),
        ]);

        const [bData, vData, iData, rData] = await Promise.all([
          bRes.json(),
          vRes.json(),
          iRes.json(),
          rRes.json(),
        ]);

        const bookings = bData.bookings || [];
        const visits = vData.visits || [];
        const inquiries = iData.inquiries || [];
        const rooms = rData.rooms || [];

        setRecentBookings(bookings.slice(0, 5));

        setStats({
          totalBookings: bookings.length,
          waitingBookings: bookings.filter((b: any) => b.status === 'Waiting').length,
          confirmedBookings: bookings.filter((b: any) => b.status === 'Booked').length,
          cancelledBookings: bookings.filter((b: any) => b.status === 'Cancelled').length,
          totalVisits: visits.length,
          waitingVisits: visits.filter((v: any) => v.status === 'Waiting').length,
          totalInquiries: inquiries.length,
          newInquiries: inquiries.filter((i: any) => i.status === 'New').length,
          availableRooms: rooms.filter((r: any) => r.availability === 'Available').length,
          totalRooms: rooms.length,
        });
      } catch (e) {
        console.error('Error fetching admin stats:', e);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  return (
    <div className="space-y-8">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-xs text-slate-500">
            Real-time accommodation status, pending reservations, and campus visits.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/bookings"
            className="px-4 py-2 rounded-xl bg-pink-600 text-white text-xs font-bold hover:bg-pink-700 transition-colors shadow-md shadow-pink-600/20 flex items-center gap-1.5"
          >
            <span>Manage Bookings</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Card 1: Pending Bookings */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Pending Bookings
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-black text-slate-900">
              {stats.waitingBookings}
            </span>
            <span className="text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
              Requires Action
            </span>
          </div>
          <p className="text-[11px] text-slate-400">
            Total Requests: {stats.totalBookings}
          </p>
        </div>

        {/* Card 2: Confirmed Bookings */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Confirmed Bookings
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-black text-slate-900">
              {stats.confirmedBookings}
            </span>
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              Occupied
            </span>
          </div>
          <p className="text-[11px] text-slate-400">
            Cancelled: {stats.cancelledBookings}
          </p>
        </div>

        {/* Card 3: Room Availability */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Available Rooms
            </span>
            <div className="w-8 h-8 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-black text-slate-900">
              {stats.availableRooms} / {stats.totalRooms}
            </span>
            <span className="text-xs font-semibold text-pink-600 bg-pink-50 px-2 py-0.5 rounded-full">
              4 Floors
            </span>
          </div>
          <p className="text-[11px] text-slate-400">
            Occupancy Rate: {stats.totalRooms ? Math.round(((stats.totalRooms - stats.availableRooms) / stats.totalRooms) * 100) : 0}%
          </p>
        </div>

        {/* Card 4: Visit & Inquiries */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Visit Requests
            </span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Video className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-black text-slate-900">
              {stats.waitingVisits}
            </span>
            <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
              {stats.newInquiries} Inquiries
            </span>
          </div>
          <p className="text-[11px] text-slate-400">
            Total Inquiries: {stats.totalInquiries}
          </p>
        </div>

      </div>

      {/* Recent Bookings Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Recent Booking Submissions</h3>
            <p className="text-xs text-slate-500">Latest student room requests from website</p>
          </div>
          <Link
            href="/admin/bookings"
            className="text-xs font-bold text-pink-600 hover:text-pink-700 flex items-center gap-1"
          >
            <span>View All Bookings</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase">
              <tr>
                <th className="px-5 py-3">Booking ID</th>
                <th className="px-5 py-3">Resident Name</th>
                <th className="px-5 py-3">Floor & Room</th>
                <th className="px-5 py-3">Relationship</th>
                <th className="px-5 py-3">Move-In Date</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentBookings.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-8 text-center text-slate-400">
                    No bookings recorded yet.
                  </td>
                </tr>
              ) : (
                recentBookings.map((b) => (
                  <tr key={b._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-5 py-3.5 font-bold text-slate-900">{b.bookingId}</td>
                    <td className="px-5 py-3.5">
                      <span className="font-semibold text-slate-800 block">{b.residentName}</span>
                      <span className="text-[11px] text-slate-400">{b.residentPhone}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="font-bold text-pink-600">Floor {b.floor}</span> • Room {b.roomNumber}
                    </td>
                    <td className="px-5 py-3.5 text-slate-600">{b.relationship}</td>
                    <td className="px-5 py-3.5 text-slate-600">{b.preferredMoveInDate}</td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold ${
                          b.status === 'Booked'
                            ? 'bg-emerald-100 text-emerald-800'
                            : b.status === 'Waiting'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {b.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <Link
                        href="/admin/bookings"
                        className="text-pink-600 hover:text-pink-800 font-bold"
                      >
                        Review →
                      </Link>
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
