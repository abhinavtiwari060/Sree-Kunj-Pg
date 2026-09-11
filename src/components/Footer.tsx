'use client';

import React from 'react';
import Link from 'next/link';
import { MapPin, Phone, Mail, ShieldCheck, Lock, ExternalLink, Sparkles } from 'lucide-react';

interface FooterProps {
  pgName?: string;
  contactPhone?: string;
  contactEmail?: string;
  address?: string;
}

export const Footer: React.FC<FooterProps> = ({
  pgName = 'Sree Kunj Girls PG',
  contactPhone = '+91 89573 56189',
  contactEmail = 'admissions@sreekunjgirlspg.com',
  address = 'Plot 42, Institutional Corridor, Near JECRC University Gate, Sitapura Industrial Area, Jaipur, Rajasthan 302022',
}) => {
  const developerPortfolioUrl =
    process.env.NEXT_PUBLIC_DEVELOPER_PORTFOLIO_URL || 'https://abhinav-dev-five.vercel.app/';

  return (
    <footer className="bg-white/80 backdrop-blur-xl border-t border-pink-200/90 pt-16 pb-12 text-slate-700 relative overflow-hidden">
      {/* Soft Ambient Glows */}
      <div className="ambient-bg-pink-1 top-0 left-1/4 -translate-y-1/2 opacity-30" />
      <div className="ambient-bg-pink-2 bottom-0 right-10 opacity-30" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-pink-200/80">

          {/* Col 1: Brand & Bio with Logo */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-pink-100 border border-pink-300 p-1 shadow-xs overflow-hidden flex items-center justify-center shrink-0">
                <img src="/logo.svg" alt="Sree Kunj Girls PG Logo" className="w-full h-full object-contain" />
              </div>
              <div>
                <span className="font-extrabold text-xl tracking-tight text-slate-900 block leading-tight">
                  Sree Kunj <span className="text-pink-600">Girls PG</span>
                </span>
                <span className="text-[11px] font-bold text-pink-700 uppercase tracking-wider block mt-0.5">
                  Near JECRC & Poornima University • Jaipur
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed max-w-md">
              Jaipur’s most trusted student residence for women. Providing 4 floors of premium AC and Non-AC rooms, 24/7 CCTV surveillance, biometric security, high-speed Wi-Fi 6, and nutritious pure vegetarian dining.
            </p>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-pink-100/70 border border-pink-200 text-xs font-bold text-pink-800">
              <ShieldCheck className="w-4 h-4 text-pink-600 shrink-0" />
              <span>100% Female Verified & Certified Safe Living</span>
            </div>
          </div>

          {/* Col 2: Nearby Campuses & Proximity */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-black text-xs text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-pink-600" />
              Nearby Campuses
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 font-medium">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-pink-500 shrink-0" />
                <span>JECRC University (450m walking)</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-pink-500 shrink-0" />
                <span>Poornima University (1.2 km)</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-pink-500 shrink-0" />
                <span>Mahatma Gandhi Medical College (2.5 km)</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-pink-500 shrink-0" />
                <span>Sitapura RIICO Institutional Hub</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-pink-500 shrink-0" />
                <span>Jaipur Metro Phase 2 Link</span>
              </li>
            </ul>
          </div>

          {/* Col 3: Reach Admissions & Admin Shortcut */}
          <div className="lg:col-span-4 space-y-3">
            <h4 className="font-black text-xs text-slate-900 uppercase tracking-wider">Admissions & Contact</h4>
            <div className="space-y-2.5 text-xs text-slate-600">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-pink-600 shrink-0 mt-0.5" />
                <span className="leading-snug">{address}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-pink-600 shrink-0" />
                <a href={`tel:${contactPhone}`} className="font-semibold text-slate-800 hover:text-pink-600 transition-colors">
                  {contactPhone}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-pink-600 shrink-0" />
                <a href={`mailto:${contactEmail}`} className="font-semibold text-slate-800 hover:text-pink-600 transition-colors">
                  {contactEmail}
                </a>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/admin/login"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-pink-50 hover:bg-pink-100 text-pink-800 text-xs font-bold transition-all border border-pink-200 shadow-2xs"
              >
                <Lock className="w-3.5 h-3.5 text-pink-600" />
                <span>Admin Portal Login</span>
              </Link>
            </div>
          </div>

        </div>

        {/* Bottom Bar with Developer Portfolio Credit */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-600 gap-3">
          <p>© {new Date().getFullYear()} {pgName}. All rights reserved.</p>

          {/* Professional Developer Credit */}
          <div className="flex items-center gap-1.5 text-slate-600 font-medium">
            <span>Developed by</span>
            <a
              href={developerPortfolioUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-pink-700 hover:text-pink-900 underline underline-offset-2 transition-colors inline-flex items-center gap-0.5"
            >
              <span>Abhinav Tiwari</span>
              <ExternalLink className="w-3 h-3 ml-0.5 text-pink-600" />
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
};
