'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Clock, Utensils, Award, Check, Sparkles } from 'lucide-react';

export const WhyChooseUs: React.FC = () => {
  const points = [
    {
      title: 'Parent-Trusted 4-Tier Security',
      description:
        'Continuous female warden supervision, biometric smart access, and 32+ CCTV cameras in common areas ensure peace of mind.',
      icon: <ShieldCheck className="w-5 h-5 text-pink-600" />,
      badge: 'Safety First',
    },
    {
      title: '2-Minute Walking Distance',
      description:
        'Walk directly to JECRC University campus or take a quick 4-minute shuttle to Poornima University.',
      icon: <Clock className="w-5 h-5 text-pink-600" />,
      badge: 'Zero Commute',
    },
    {
      title: 'Hygienic Homely Meals',
      description:
        '4 freshly prepared vegetarian meals daily using purified RO water and farm-fresh ingredients. High-tea snacks and special Sunday menu included.',
      icon: <Utensils className="w-5 h-5 text-pink-600" />,
      badge: 'Pure Vegetarian',
    },
    {
      title: 'Academic Focused Ambiance',
      description:
        'A dedicated quiet reading library on the 4th floor, high-speed 300 Mbps campus fiber, and respectful study hours.',
      icon: <Award className="w-5 h-5 text-pink-600" />,
      badge: 'Quiet Study',
    },
  ];

  return (
    <section id="why-us" className="py-20 relative bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Text Pitch */}
          <div className="lg:col-span-5 space-y-5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full solid-badge-pink text-xs font-bold tracking-wider uppercase">
              <Sparkles className="w-3.5 h-3.5 text-pink-600" />
              The Sree Kunj Advantage
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              Why Jaipur’s Students <span className="text-pink-600">Choose Us</span>
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              We understand the transition of moving to Jaipur for higher education. Sree Kunj Girls PG is designed from the ground up to offer warmth, uncompromising safety, and an empowering study atmosphere.
            </p>

            <div className="space-y-2.5 pt-1">
              {[
                '100% verified female-only residence with strict visitor policy',
                'Transparent pricing — electricity and Wi-Fi clearly managed',
                'Daily sanitized washrooms & automated laundry support',
                'Immediate emergency medical assistance & on-call doctor',
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-800">
                  <div className="w-5 h-5 rounded-full bg-pink-100 text-pink-700 flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right 4 Pillars Glass Grid */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {points.map((p, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08, duration: 0.4 }}
                className="glass-card glass-card-hover rounded-3xl p-5 space-y-3 relative"
              >
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-2xl bg-pink-50 border border-pink-200 flex items-center justify-center">
                    {p.icon}
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-pink-50 text-pink-700 text-[10px] font-bold uppercase tracking-wider border border-pink-200">
                    {p.badge}
                  </span>
                </div>

                <h3 className="text-sm sm:text-base font-bold text-slate-900">{p.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{p.description}</p>
              </motion.div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
};
