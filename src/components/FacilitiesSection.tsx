'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Utensils,
  ShieldCheck,
  Wifi,
  Wind,
  BookOpen,
  Droplets,
  HeartHandshake,
  CheckCircle2
} from 'lucide-react';

export interface FacilityItem {
  _id: string;
  name: string;
  category: string;
  description: string;
  imageUrl?: string;
  icon?: string;
  order: number;
  active: boolean;
}

interface FacilitiesSectionProps {
  facilities: FacilityItem[];
}

const getFacilityIcon = (iconName?: string) => {
  switch (iconName) {
    case 'Utensils':
      return <Utensils className="w-5 h-5" />;
    case 'ShieldCheck':
      return <ShieldCheck className="w-5 h-5" />;
    case 'Wifi':
      return <Wifi className="w-5 h-5" />;
    case 'Wind':
      return <Wind className="w-5 h-5" />;
    case 'BookOpen':
      return <BookOpen className="w-5 h-5" />;
    case 'Droplets':
      return <Droplets className="w-5 h-5" />;
    case 'HeartHandshake':
      return <HeartHandshake className="w-5 h-5" />;
    default:
      return <Sparkles className="w-5 h-5" />;
  }
};

import { defaultFacilities } from '@/lib/sampleData';

export const FacilitiesSection: React.FC<FacilitiesSectionProps> = ({ facilities }) => {
  const rawList: FacilityItem[] = facilities && facilities.length > 0 ? facilities : (defaultFacilities as any);
  const activeFacilities: FacilityItem[] = rawList.filter((f) => f.active !== false).sort((a, b) => (a.order || 0) - (b.order || 0));

  return (
    <section id="facilities" className="py-20 relative bg-[#FFF5F7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full solid-badge-pink text-xs font-bold tracking-wider uppercase">
            <Sparkles className="w-3.5 h-3.5 text-pink-600" />
            Uncompromised Amenities
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
            Curated For Modern <span className="text-pink-600">Student Well-Being</span>
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            Every convenience thoughtfully arranged under one roof so you can focus entirely on your academics and campus life.
          </p>
        </div>

        {/* Facilities Grid (Solid Liquid Glass Cards) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {activeFacilities.map((fac: FacilityItem, idx: number) => (
            <motion.div
              key={fac._id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05, duration: 0.4 }}
              className="glass-card glass-card-hover rounded-3xl p-5 flex flex-col justify-between group"
            >
              {fac.imageUrl && (
                <div className="aspect-[16/9] -mx-5 -mt-5 mb-4 overflow-hidden rounded-t-3xl bg-pink-100">
                  <img
                    src={fac.imageUrl}
                    alt={fac.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}

              <div className="space-y-2.5">
                <div className="w-10 h-10 rounded-2xl bg-pink-600 text-white flex items-center justify-center shadow-xs">
                  {getFacilityIcon(fac.icon)}
                </div>

                <div>
                  <span className="text-[10px] font-bold text-pink-700 uppercase tracking-wider block">
                    {fac.category}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-pink-600 transition-colors">
                    {fac.name}
                  </h3>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {fac.description}
                </p>
              </div>

              <div className="pt-3 mt-3 border-t border-pink-100 flex items-center gap-1.5 text-[11px] font-bold text-pink-700">
                <CheckCircle2 className="w-3.5 h-3.5 text-pink-600" />
                <span>Included in monthly rent</span>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};
