'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles,
  MessageSquare,
  Send,
  CheckCircle2,
  Phone,
  User,
  Mail,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { buildWhatsAppGeneralUrl } from '@/lib/whatsapp';

interface InquirySectionProps {
  whatsappNumber: string;
}

export const InquirySection: React.FC<InquirySectionProps> = ({ whatsappNumber }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [room, setRoom] = useState('');
  const [inquiryType, setInquiryType] = useState<
    'Room availability' | 'Pricing' | 'Physical visit' | 'Video call visit' | 'General inquiry'
  >('General inquiry');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedInquiry, setSubmittedInquiry] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const inquiryTypes = [
    'Room availability',
    'Pricing',
    'Physical visit',
    'Video call visit',
    'General inquiry',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name.trim() || !phone.trim() || !message.trim()) {
      setErrorMsg('Please fill in your name, phone number, and message');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          email: email.trim(),
          room: room.trim(),
          inquiryType,
          message: message.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit inquiry');
      }

      setSubmittedInquiry(data.inquiry);
      try {
        confetti({
          particleCount: 40,
          spread: 50,
          origin: { y: 0.7 },
        });
      } catch (e) {}
    } catch (err: any) {
      setErrorMsg(err.message || 'Error sending inquiry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="inquiry" className="py-20 relative bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full solid-badge-pink text-xs font-bold tracking-wider uppercase">
            <Sparkles className="w-3.5 h-3.5 text-pink-600" />
            Instant Assistance
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
            Have Questions? <span className="text-pink-600">We’re Here To Help</span>
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            Reach out via direct WhatsApp or submit an inquiry below for admissions, fee structure, and room availability.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Option 1: WhatsApp Instant Card (Solid emerald, no gradient) */}
          <div className="lg:col-span-5 bg-[#E8F8EE] rounded-3xl p-6 sm:p-8 flex flex-col justify-between space-y-5 border border-emerald-300 shadow-sm">
            <div className="space-y-3">
              <span className="px-3 py-1 rounded-full bg-white text-[#128C7E] text-[11px] font-black uppercase tracking-wider inline-block border border-emerald-200">
                Option 1 • Direct WhatsApp
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900">
                Inquire Directly On WhatsApp
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Connect instantly with our warden or admissions team. Get immediate room photos, mess menu schedule, and fee breakdown on WhatsApp.
              </p>

              <div className="p-3.5 rounded-2xl bg-white border border-emerald-200 space-y-2 text-xs">
                <div className="flex items-center gap-2 text-emerald-900 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Typical Response Time: Under 5 Minutes</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-900 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Receive Live Room Tour Videos</span>
                </div>
              </div>
            </div>

            <a
              href={buildWhatsAppGeneralUrl(whatsappNumber, {
                name: 'Student / Parent',
                phone: '',
                inquiryType: 'Room Availability near JECRC & Poornima',
                message: 'Hello Sree Kunj Girls PG, I would like to inquire about room availability and fee structure.',
              })}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 px-5 rounded-2xl bg-[#25D366] hover:bg-[#1EBE5D] text-white font-black text-sm flex items-center justify-center gap-2 transition-colors shadow-md"
            >
              <MessageSquare className="w-4 h-4 fill-current" />
              <span>Open WhatsApp Chat Now</span>
            </a>
          </div>

          {/* Option 2: Website Inquiry Form */}
          <div className="lg:col-span-7 glass-card rounded-3xl p-6 sm:p-8 shadow-xl border border-pink-200 relative">
            <div className="mb-5 space-y-1">
              <span className="px-3 py-1 rounded-full bg-pink-100 text-pink-800 text-[11px] font-black uppercase tracking-wider inline-block">
                Option 2 • Web Inquiry Form
              </span>
              <h3 className="text-xl font-black text-slate-900">
                Send Inquiry Through Website
              </h3>
            </div>

            {submittedInquiry ? (
              <div className="py-10 text-center space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-pink-100 text-pink-700 flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h4 className="text-lg font-bold text-slate-900">Inquiry Received!</h4>
                <p className="text-xs text-slate-600 max-w-md mx-auto">
                  Thank you, <strong>{submittedInquiry.name}</strong>. Your reference ID is{' '}
                  <strong className="text-pink-700">{submittedInquiry.inquiryId}</strong>. We will contact you at {submittedInquiry.phone}.
                </p>
                <button
                  onClick={() => setSubmittedInquiry(null)}
                  className="glass-button-secondary px-5 py-2 rounded-xl text-xs font-bold"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
                {errorMsg && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 font-semibold flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      Your Full Name *
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                      <input
                        type="text"
                        required
                        placeholder="e.g. Priya Sharma"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full glass-input rounded-xl pl-9 pr-3 py-2 text-xs font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      Phone Number *
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      Email Address (Optional)
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                      <input
                        type="email"
                        placeholder="name@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full glass-input rounded-xl pl-9 pr-3 py-2 text-xs font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      Inquiry Category *
                    </label>
                    <select
                      value={inquiryType}
                      onChange={(e) => setInquiryType(e.target.value as any)}
                      className="w-full glass-input rounded-xl px-3 py-2 text-xs font-medium"
                    >
                      {inquiryTypes.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Interested Room / Floor
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Floor 2 Twin Sharing AC"
                    value={room}
                    onChange={(e) => setRoom(e.target.value)}
                    className="w-full glass-input rounded-xl px-3 py-2 text-xs font-medium"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Your Message / Questions *
                  </label>
                  <textarea
                    required
                    rows={2}
                    placeholder="Tell us your questions, college batch, or move-in timeline..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full glass-input rounded-xl px-3 py-2 text-xs font-medium"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full glass-button-primary py-3 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md"
                >
                  {isSubmitting ? (
                    'Sending Inquiry...'
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Send Website Inquiry</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

        </div>

      </div>
    </section>
  );
};
