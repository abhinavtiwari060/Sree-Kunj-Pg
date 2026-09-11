'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send } from 'lucide-react';
import { buildWhatsAppGeneralUrl } from '@/lib/whatsapp';

interface FloatingWhatsAppProps {
  whatsappNumber: string;
}

export const FloatingWhatsApp: React.FC<FloatingWhatsAppProps> = ({ whatsappNumber }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [quickMsg, setQuickMsg] = useState('');

  const sendQuickChat = (e: React.FormEvent) => {
    e.preventDefault();
    const url = buildWhatsAppGeneralUrl(whatsappNumber, {
      name: 'Website Visitor',
      phone: '',
      inquiryType: 'Instant WhatsApp Inquiry',
      message: quickMsg || 'Hi, I would like to check room availability and schedule a PG tour.',
    });
    window.open(url, '_blank');
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 15 }}
            className="mb-3 w-80 bg-white rounded-3xl p-5 shadow-2xl border border-pink-200 space-y-3"
          >
            <div className="flex items-center justify-between border-b border-pink-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#25D366] text-white flex items-center justify-center">
                  <MessageSquare className="w-4 h-4 fill-current" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-slate-900">Sree Kunj Helpline</h4>
                  <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Online • Replies in ~2 mins
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-pink-50 p-3 rounded-2xl text-xs text-slate-700 leading-relaxed border border-pink-200">
              👋 Hello! Looking for accommodation near <strong>JECRC</strong> or <strong>Poornima University</strong>? Type your question below to start an instant WhatsApp chat!
            </div>

            <form onSubmit={sendQuickChat} className="space-y-2">
              <input
                type="text"
                placeholder="Type your question..."
                value={quickMsg}
                onChange={(e) => setQuickMsg(e.target.value)}
                className="w-full glass-input rounded-xl px-3 py-2 text-xs font-medium"
              />
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-sm"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Chat on WhatsApp</span>
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="p-4 rounded-full bg-[#25D366] hover:bg-[#1EBE5D] text-white shadow-xl flex items-center justify-center transition-colors"
        aria-label="Open WhatsApp Chat"
      >
        <MessageSquare className="w-6 h-6 fill-current" />
      </motion.button>
    </div>
  );
};
