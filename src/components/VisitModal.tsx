'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  X,
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  Video,
  MapPin,
  CheckCircle2,
  MessageSquare,
  Sparkles,
  ArrowRight,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { buildWhatsAppVisitUrl } from '@/lib/whatsapp';

interface VisitModalProps {
  isOpen: boolean;
  onClose: () => void;
  whatsappNumber: string;
  defaultVisitType?: 'Physical Visit' | 'Video Call Visit';
}

export const VisitModal: React.FC<VisitModalProps> = ({
  isOpen,
  onClose,
  whatsappNumber,
  defaultVisitType = 'Physical Visit',
}) => {
  const [visitType, setVisitType] = useState<'Physical Visit' | 'Video Call Visit'>(defaultVisitType);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [preferredTime, setPreferredTime] = useState('11:00 AM');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [confirmedVisit, setConfirmedVisit] = useState<any>(null);

  useEffect(() => {
    setVisitType(defaultVisitType);
  }, [defaultVisitType]);

  useEffect(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setPreferredDate(tomorrow.toISOString().split('T')[0]);
  }, []);

  if (!isOpen) return null;

  const timeSlots = [
    '10:00 AM',
    '11:30 AM',
    '02:00 PM',
    '04:30 PM',
    '06:00 PM',
    '07:30 PM',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name.trim() || !phone.trim()) {
      setErrorMsg('Please provide your name and contact phone number');
      return;
    }

    if (!preferredDate) {
      setErrorMsg('Please choose a date for the visit');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/visits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          email: email.trim(),
          visitType,
          preferredDate,
          preferredTime,
          message: message.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to schedule visit');
      }

      setConfirmedVisit(data.visit);
      try {
        confetti({
          particleCount: 60,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#f43f72', '#fb7185', '#38bdf8'],
        });
      } catch (err) {}
    } catch (err: any) {
      setErrorMsg(err.message || 'Error booking visit. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setConfirmedVisit(null);
    setErrorMsg('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-md flex items-center justify-center p-3 sm:p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="glass-panel bg-white/95 rounded-3xl max-w-xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-pink-200 relative my-auto"
      >
        <button
          onClick={handleReset}
          className="absolute top-5 right-5 p-2 rounded-full bg-rose-50 text-gray-500 hover:text-gray-800 hover:bg-rose-100 transition-colors z-20"
        >
          <X className="w-5 h-5" />
        </button>

        {confirmedVisit ? (
          <div className="p-8 sm:p-10 text-center space-y-6">
            <div className="w-20 h-20 rounded-3xl bg-pink-100 text-pink-600 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black uppercase tracking-wider">
                Visit Slot Requested
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-gray-900">
                {confirmedVisit.visitType === 'Video Call Visit' ? 'Video Tour' : 'Campus Visit'} Scheduled!
              </h3>
              <p className="text-sm text-gray-600 max-w-sm mx-auto">
                We have registered your appointment. Our team will connect with you to confirm the timing.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-rose-50/70 border border-pink-100 text-left space-y-2 text-xs sm:text-sm">
              <div className="flex justify-between border-b border-pink-100 pb-2">
                <span className="text-gray-500">Visit ID:</span>
                <span className="font-bold text-pink-700">{confirmedVisit.visitId}</span>
              </div>
              <div className="flex justify-between border-b border-pink-100 pb-2">
                <span className="text-gray-500">Mode:</span>
                <span className="font-bold text-gray-900">{confirmedVisit.visitType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Date & Slot:</span>
                <span className="font-bold text-gray-900">
                  {confirmedVisit.preferredDate} at {confirmedVisit.preferredTime}
                </span>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <a
                href={buildWhatsAppVisitUrl(whatsappNumber, {
                  visitId: confirmedVisit.visitId,
                  name: confirmedVisit.name,
                  phone: confirmedVisit.phone,
                  visitType: confirmedVisit.visitType,
                  preferredDate: confirmedVisit.preferredDate,
                  preferredTime: confirmedVisit.preferredTime,
                  message: confirmedVisit.message,
                })}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-6 rounded-2xl bg-[#25D366] text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 hover:bg-[#20bd5a] transition-colors shadow-lg"
              >
                <MessageSquare className="w-5 h-5 fill-current" />
                <span>Confirm Visit on WhatsApp</span>
              </a>

              <button
                onClick={handleReset}
                className="w-full py-2 text-xs font-bold text-gray-500 hover:text-gray-800"
              >
                Close Window
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5">
            <div className="space-y-1 pr-8">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-pink-600 uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                Book A PG Experience
              </div>
              <h2 className="text-2xl font-black text-gray-900">Schedule PG Tour</h2>
              <p className="text-xs text-gray-500">
                Choose between a physical campus walkthrough or an interactive WhatsApp video tour from home.
              </p>
            </div>

            {errorMsg && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Visit Type Toggle */}
            <div className="grid grid-cols-2 gap-3 p-1.5 bg-rose-50/70 rounded-2xl border border-pink-100">
              <button
                type="button"
                onClick={() => setVisitType('Physical Visit')}
                className={`py-3 px-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
                  visitType === 'Physical Visit'
                    ? 'bg-white text-gray-900 shadow-md border border-pink-200'
                    : 'text-gray-600 hover:text-pink-600'
                }`}
              >
                <MapPin className="w-4 h-4 text-pink-500" />
                <span>Physical In-Person Visit</span>
              </button>

              <button
                type="button"
                onClick={() => setVisitType('Video Call Visit')}
                className={`py-3 px-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
                  visitType === 'Video Call Visit'
                    ? 'bg-white text-gray-900 shadow-md border border-pink-200'
                    : 'text-gray-600 hover:text-pink-600'
                }`}
              >
                <Video className="w-4 h-4 text-pink-500" />
                <span>Live Video Tour</span>
              </button>
            </div>

            {/* Visitor Contact Info */}
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
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full glass-input rounded-xl pl-9 pr-3 py-2 text-xs font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-gray-600 block mb-1">
                  WhatsApp Mobile Number *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
                  <input
                    type="tel"
                    required
                    placeholder="10-digit mobile"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full glass-input rounded-xl pl-9 pr-3 py-2 text-xs font-medium"
                />
              </div>
            </div>

            {/* Date and Time Slot */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold text-gray-600 block mb-1">
                  Preferred Date *
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
                  Preferred Time Slot *
                </label>
                <div className="relative">
                  <Clock className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
                  <select
                    value={preferredTime}
                    onChange={(e) => setPreferredTime(e.target.value)}
                    className="w-full glass-input rounded-xl pl-9 pr-3 py-2 text-xs font-medium"
                  >
                    {timeSlots.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-gray-600 block mb-1">
                Specific Room Interest / Questions
              </label>
              <input
                type="text"
                placeholder="e.g. Want to see 2nd floor twin sharing room"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full glass-input rounded-xl px-3 py-2 text-xs font-medium"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full glass-button-primary py-3.5 rounded-2xl font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-xl"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Scheduling Slot...
                  </span>
                ) : (
                  <>
                    <Calendar className="w-4 h-4" />
                    <span>Confirm Visit Appointment</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>

          </form>
        )}
      </motion.div>
    </div>
  );
};
