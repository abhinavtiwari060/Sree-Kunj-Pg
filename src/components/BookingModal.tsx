'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Sparkles,
  Calendar,
  User,
  Phone,
  Mail,
  HeartHandshake,
  CheckCircle2,
  MessageSquare,
  ArrowRight,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { RoomItem } from './RoomsSection';
import { buildWhatsAppBookingUrl } from '@/lib/whatsapp';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedRoom: RoomItem | null;
  allRooms: RoomItem[];
  whatsappNumber: string;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  selectedRoom,
  allRooms,
  whatsappNumber,
}) => {
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [relationship, setRelationship] = useState<
    'Self' | 'Sister' | 'Daughter' | 'Friend' | 'Relative' | 'Other'
  >('Self');
  const [residentName, setResidentName] = useState('');
  const [residentPhone, setResidentPhone] = useState('');
  const [selectedFloor, setSelectedFloor] = useState<number>(selectedRoom?.floor || 1);
  const [selectedRoomNumber, setSelectedRoomNumber] = useState<string>(
    selectedRoom?.roomNumber || '101'
  );
  const [preferredDate, setPreferredDate] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [confirmedBooking, setConfirmedBooking] = useState<any>(null);

  // Sync state when selectedRoom changes
  useEffect(() => {
    if (selectedRoom) {
      setSelectedFloor(selectedRoom.floor);
      setSelectedRoomNumber(selectedRoom.roomNumber);
    }
  }, [selectedRoom]);

  // When relationship is Self, auto populate resident fields
  useEffect(() => {
    if (relationship === 'Self') {
      setResidentName(customerName);
      setResidentPhone(customerPhone);
    }
  }, [relationship, customerName, customerPhone]);

  // Set default preferred date to 3 days from now
  useEffect(() => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    setPreferredDate(d.toISOString().split('T')[0]);
  }, []);

  if (!isOpen) return null;

  const currentFloorRooms = allRooms.filter((r) => r.floor === selectedFloor);
  const activeRoomObj = allRooms.find((r) => r.roomNumber === selectedRoomNumber);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!customerName.trim() || !customerPhone.trim()) {
      setErrorMsg('Please enter your name and phone number');
      return;
    }

    if (!residentName.trim() || !residentPhone.trim()) {
      setErrorMsg('Please enter the resident’s name and contact number');
      return;
    }

    if (!preferredDate) {
      setErrorMsg('Please choose a preferred move-in date');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: customerName.trim(),
          customerPhone: customerPhone.trim(),
          customerEmail: customerEmail.trim(),
          residentName: residentName.trim(),
          residentPhone: residentPhone.trim(),
          relationship,
          floor: selectedFloor,
          room: activeRoomObj?._id,
          roomNumber: selectedRoomNumber,
          preferredMoveInDate: preferredDate,
          message: message.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Booking submission failed');
      }

      setConfirmedBooking(data.booking);
      // Trigger festive confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#f43f72', '#fb7185', '#fda4af', '#fbbf24'],
        });
      } catch (err) {}
    } catch (err: any) {
      setErrorMsg(err.message || 'Network error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setConfirmedBooking(null);
    setErrorMsg('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-md flex items-center justify-center p-3 sm:p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="glass-panel bg-white/95 rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-pink-200 relative my-auto"
      >
        {/* Close Button */}
        <button
          onClick={handleReset}
          className="absolute top-5 right-5 p-2 rounded-full bg-rose-50 text-gray-500 hover:text-gray-800 hover:bg-rose-100 transition-colors z-20"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Confirmation Screen */}
        {confirmedBooking ? (
          <div className="p-8 sm:p-10 text-center space-y-6">
            <div className="w-20 h-20 rounded-3xl bg-pink-100 text-pink-600 flex items-center justify-center mx-auto shadow-inner shadow-pink-500/20">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-black uppercase tracking-wider">
                Status: Pending Admin Confirmation
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-gray-900">
                Booking Request Submitted!
              </h3>
              <p className="text-sm text-gray-600 max-w-md mx-auto">
                Thank you! Your room request has been recorded. Our warden will review availability and confirm your booking shortly.
              </p>
            </div>

            {/* Booking Details Card */}
            <div className="p-5 rounded-2xl bg-rose-50/70 border border-pink-100 text-left space-y-2.5 text-xs sm:text-sm">
              <div className="flex justify-between border-b border-pink-100/80 pb-2">
                <span className="text-gray-500 font-medium">Booking Reference ID:</span>
                <span className="font-extrabold text-pink-700 tracking-wider">
                  {confirmedBooking.bookingId}
                </span>
              </div>
              <div className="flex justify-between border-b border-pink-100/80 pb-2">
                <span className="text-gray-500 font-medium">Selected Room:</span>
                <span className="font-bold text-gray-900">
                  Floor {confirmedBooking.floor} • Room {confirmedBooking.roomNumber}
                </span>
              </div>
              <div className="flex justify-between border-b border-pink-100/80 pb-2">
                <span className="text-gray-500 font-medium">Resident:</span>
                <span className="font-bold text-gray-900">
                  {confirmedBooking.residentName} ({confirmedBooking.relationship})
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 font-medium">Preferred Move-in Date:</span>
                <span className="font-bold text-gray-900">
                  {confirmedBooking.preferredMoveInDate}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3 pt-2">
              <a
                href={buildWhatsAppBookingUrl(whatsappNumber, {
                  bookingId: confirmedBooking.bookingId,
                  customerName: confirmedBooking.customerName,
                  residentName: confirmedBooking.residentName,
                  residentPhone: confirmedBooking.residentPhone,
                  relationship: confirmedBooking.relationship,
                  floor: confirmedBooking.floor,
                  roomNumber: confirmedBooking.roomNumber,
                  preferredDate: confirmedBooking.preferredMoveInDate,
                  message: confirmedBooking.message,
                })}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-6 rounded-2xl bg-[#25D366] text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 hover:bg-[#20bd5a] transition-colors shadow-lg shadow-emerald-500/20"
              >
                <MessageSquare className="w-5 h-5 fill-current" />
                <span>Continue on WhatsApp For Instant Confirmation</span>
              </a>

              <button
                onClick={handleReset}
                className="w-full py-3 text-xs font-bold text-gray-500 hover:text-gray-800"
              >
                ← Back to Room Explorer
              </button>
            </div>
          </div>
        ) : (
          /* Form Step */
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
            
            {/* Modal Title */}
            <div className="space-y-1 pr-8">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-600 uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                Direct PG Booking
              </div>
              <h2 className="text-2xl font-black text-gray-900">Reserve Your Room</h2>
              <p className="text-xs text-gray-500">
                Transparent accommodation booking near JECRC & Poornima. No broker fees.
              </p>
            </div>

            {errorMsg && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Room & Floor Selector */}
            <div className="p-4 rounded-2xl bg-rose-50/50 border border-pink-100 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-700 uppercase tracking-wide">
                  1. Room Selection
                </span>
                {activeRoomObj && (
                  <span className="text-xs font-black text-pink-600">
                    ₹{activeRoomObj.price.toLocaleString('en-IN')}/mo
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-gray-600 block mb-1">
                    Select Floor
                  </label>
                  <select
                    value={selectedFloor}
                    onChange={(e) => {
                      const flr = Number(e.target.value);
                      setSelectedFloor(flr);
                      const matching = allRooms.filter((r) => r.floor === flr);
                      if (matching.length > 0) setSelectedRoomNumber(matching[0].roomNumber);
                    }}
                    className="w-full glass-input rounded-xl px-3 py-2 text-xs font-semibold text-gray-800"
                  >
                    {[1, 2, 3, 4].map((f) => (
                      <option key={f} value={f}>
                        Floor {f}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-gray-600 block mb-1">
                    Select Room Number
                  </label>
                  <select
                    value={selectedRoomNumber}
                    onChange={(e) => setSelectedRoomNumber(e.target.value)}
                    className="w-full glass-input rounded-xl px-3 py-2 text-xs font-semibold text-gray-800"
                  >
                    {currentFloorRooms.map((r) => (
                      <option key={r.roomNumber} value={r.roomNumber}>
                        Room {r.roomNumber} ({r.type} - ₹{r.price}/mo)
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Who is booking (Relationship) */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wide block">
                2. Whose Accommodation Are You Booking?
              </label>

              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {(['Self', 'Sister', 'Daughter', 'Friend', 'Relative', 'Other'] as const).map(
                  (rel) => (
                    <button
                      type="button"
                      key={rel}
                      onClick={() => setRelationship(rel)}
                      className={`py-2 px-1 rounded-xl text-xs font-bold text-center border transition-all ${
                        relationship === rel
                          ? 'bg-pink-500 text-white border-pink-500 shadow-sm'
                          : 'bg-white/80 text-gray-700 border-pink-100 hover:bg-pink-50'
                      }`}
                    >
                      {rel}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Booked By Details */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-gray-700 uppercase tracking-wide block">
                3. Your Information (Booker)
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-gray-600 block mb-1">
                    Your Full Name *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ramesh Sharma"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full glass-input rounded-xl pl-9 pr-3 py-2 text-xs font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-gray-600 block mb-1">
                    Your WhatsApp Phone Number *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
                    <input
                      type="tel"
                      required
                      placeholder="10-digit mobile number"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full glass-input rounded-xl pl-9 pr-3 py-2 text-xs font-medium"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-gray-600 block mb-1">
                  Email Address (Optional)
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
                  <input
                    type="email"
                    placeholder="name@example.com"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full glass-input rounded-xl pl-9 pr-3 py-2 text-xs font-medium"
                  />
                </div>
              </div>
            </div>

            {/* Resident Details (If relationship != Self) */}
            {relationship !== 'Self' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="p-4 rounded-2xl bg-rose-50/70 border border-pink-200 space-y-3"
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-rose-700 uppercase tracking-wide">
                  <HeartHandshake className="w-4 h-4" />
                  <span>Resident’s Details ({relationship})</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-gray-600 block mb-1">
                      Resident’s Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ananya Sharma"
                      value={residentName}
                      onChange={(e) => setResidentName(e.target.value)}
                      className="w-full glass-input bg-white rounded-xl px-3 py-2 text-xs font-medium"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-gray-600 block mb-1">
                      Resident’s Contact Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="Student's mobile number"
                      value={residentPhone}
                      onChange={(e) => setResidentPhone(e.target.value)}
                      className="w-full glass-input bg-white rounded-xl px-3 py-2 text-xs font-medium"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Move-in Date & Message */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold text-gray-600 block mb-1">
                  Preferred Move-in Date *
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
                  <input
                    type="date"
                    required
                    value={preferredDate}
                    onChange={(e) => setPreferredDate(e.target.value)}
                    className="w-full glass-input rounded-xl pl-9 pr-3 py-2 text-xs font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-gray-600 block mb-1">
                  Special Notes / College Batch
                </label>
                <input
                  type="text"
                  placeholder="e.g. JECRC B.Tech CSE 1st Year"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full glass-input rounded-xl px-3 py-2 text-xs font-medium"
                />
              </div>
            </div>

            {/* Submit Action Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full glass-button-primary py-3.5 rounded-2xl font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-xl"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Submitting Booking Request...
                  </span>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Submit Booking Request</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
              <p className="text-[11px] text-center text-gray-400 mt-2 flex items-center justify-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-pink-500" />
                No payment collected today. Room is confirmed after warden verification.
              </p>
            </div>

          </form>
        )}
      </motion.div>
    </div>
  );
};
