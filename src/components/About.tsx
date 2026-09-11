'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Sparkles, GraduationCap, Award, MapPin, BookOpen, Coffee } from 'lucide-react';

interface AboutProps {
  pgName?: string;
  description?: string;
  nearbyColleges?: Array<{
    name: string;
    distance: string;
    travelTime: string;
  }>;
}

export const About: React.FC<AboutProps> = ({
  pgName = 'Sree Kunj Girls PG',
  description = 'Sree Kunj Girls PG offers premium student living tailored for scholars and young professionals attending JECRC University, Poornima University, and surrounding institutions in Jaipur. Designed with 24/7 security, high-speed Wi-Fi 6, chef-prepared hygienic meals, and pristine air-conditioned living spaces across 4 dedicated floors.',
  nearbyColleges = [
    { name: 'JECRC University', distance: '450 meters', travelTime: '2 mins walk' },
    { name: 'Poornima University', distance: '1.2 km', travelTime: '4 mins drive' },
    { name: 'Mahatma Gandhi Hospital', distance: '2.5 km', travelTime: '7 mins drive' },
    { name: 'Sitapura RIICO Hub', distance: '1.8 km', travelTime: '5 mins drive' },
  ],
}) => {
  return (
    <section id="about" className="py-20 relative bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full solid-badge-pink text-xs font-bold tracking-wider uppercase">
            <Sparkles className="w-3.5 h-3.5 text-pink-600" />
            Elegance & Protection
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Designed Exclusively for <span className="text-pink-600">Female Scholars</span>
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            More than just a PG — we provide a nurturing, high-security ecosystem where young women thrive academically and personally.
          </p>
        </div>

        {/* Main Glass Overview Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="glass-card rounded-3xl p-6 sm:p-10 relative overflow-hidden"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-7 space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-pink-100 flex items-center justify-center text-pink-700">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-900">{pgName}</h3>
                  <p className="text-xs text-pink-700 font-bold tracking-wide uppercase">Premier Student Residence • Jaipur</p>
                </div>
              </div>

              <p className="text-slate-700 leading-relaxed text-sm sm:text-base">
                {description}
              </p>

              {/* 3 Pillars Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-2">
                <div className="p-4 rounded-2xl bg-pink-50/60 border border-pink-100 space-y-1.5">
                  <div className="w-7 h-7 rounded-lg bg-pink-100 text-pink-700 flex items-center justify-center">
                    <Shield className="w-4 h-4" />
                  </div>
                  <h4 className="font-bold text-xs text-slate-900">4-Tier Security</h4>
                  <p className="text-[11px] text-slate-600">Biometric scanner, CCTV coverage & live-in female warden.</p>
                </div>

                <div className="p-4 rounded-2xl bg-pink-50/60 border border-pink-100 space-y-1.5">
                  <div className="w-7 h-7 rounded-lg bg-pink-100 text-pink-700 flex items-center justify-center">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <h4 className="font-bold text-xs text-slate-900">Academic Focus</h4>
                  <p className="text-[11px] text-slate-600">4th-floor quiet library lounge & high-speed Wi-Fi 6.</p>
                </div>

                <div className="p-4 rounded-2xl bg-pink-50/60 border border-pink-100 space-y-1.5">
                  <div className="w-7 h-7 rounded-lg bg-pink-100 text-pink-700 flex items-center justify-center">
                    <Coffee className="w-4 h-4" />
                  </div>
                  <h4 className="font-bold text-xs text-slate-900">Homely Nutrition</h4>
                  <p className="text-[11px] text-slate-600">4 hygienic vegetarian meals daily prepared with RO water.</p>
                </div>
              </div>
            </div>

            {/* University Proximity Card (Solid Pink Tint, No Gradient) */}
            <div className="lg:col-span-5 bg-pink-50/80 p-6 rounded-3xl border border-pink-200">
              <div className="flex items-center gap-2 text-pink-700 font-extrabold text-sm mb-3">
                <GraduationCap className="w-5 h-5" />
                <span>Prime Institutional Location</span>
              </div>
              <p className="text-xs text-slate-600 mb-5">
                Save commuting hours every day. Walk or take a 3-minute ride to your lecture halls:
              </p>

              <div className="space-y-2.5">
                {nearbyColleges.map((college, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-white rounded-2xl border border-pink-200 shadow-2xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-pink-100 text-pink-700 flex items-center justify-center text-xs font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900">{college.name}</p>
                        <p className="text-[10px] text-slate-500 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-pink-500" /> {college.distance}
                        </p>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-pink-100 text-pink-800 text-[11px] font-bold">
                      {college.travelTime}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </motion.div>
      </div>
    </section>
  );
};
