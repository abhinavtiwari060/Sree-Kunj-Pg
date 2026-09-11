'use client';

import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Shield, MapPin, Play, Pause, ChevronRight, Video, CheckCircle2 } from 'lucide-react';

interface HeroProps {
  heading?: string;
  subheading?: string;
  badge?: string;
  videoUrl?: string;
  posterUrl?: string;
  onOpenBooking: () => void;
  onOpenVisit: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  heading = 'Sree Kunj Girls PG',
  subheading = 'A comfortable, secure and modern student residence located right near JECRC University and Poornima University. 4 dedicated floors with 24/7 female security, Wi-Fi 6, and chef-curated vegetarian meals.',
  badge = 'Girls PG in Jaipur • Near JECRC & Poornima',
  videoUrl = 'https://assets.mixkit.co/videos/preview/mixkit-modern-apartment-living-room-with-a-view-41484-large.mp4',
  posterUrl = 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1920&q=80',
  onOpenBooking,
  onOpenVisit,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <section id="hero" className="relative min-h-[90vh] pt-28 pb-16 flex items-center justify-center overflow-hidden bg-[#FFF5F7]">
      {/* Solid background ambient shapes (Zero gradients) */}
      <div className="ambient-bg-pink-1 -top-20 -left-20" />
      <div className="ambient-bg-pink-2 top-1/2 -right-24" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Hero Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 space-y-6"
          >
            {/* Proximity Eyebrow Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full solid-badge-pink text-xs font-bold tracking-wide">
              <span className="w-2 h-2 rounded-full bg-pink-600" />
              <span>{badge}</span>
            </div>

            {/* Main Headline */}
            <div className="space-y-2">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-[1.1]">
                Sree Kunj <span className="text-pink-600">Girls PG</span>
              </h1>
              <p className="text-lg sm:text-xl font-bold text-slate-700">
                Safe, Serene & Modern Student Accommodation in Jaipur
              </p>
            </div>

            {/* Supporting Paragraph */}
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl">
              {subheading}
            </p>

            {/* Quick Highlights Pill Badges */}
            <div className="flex flex-wrap gap-2 pt-1">
              <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full border border-pink-200 text-xs font-semibold text-slate-800 shadow-xs">
                <CheckCircle2 className="w-3.5 h-3.5 text-pink-600" />
                4 Dedicated Residential Floors
              </div>
              <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full border border-pink-200 text-xs font-semibold text-slate-800 shadow-xs">
                <Shield className="w-3.5 h-3.5 text-pink-600" />
                24/7 Female Warden & CCTV
              </div>
              <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full border border-pink-200 text-xs font-semibold text-slate-800 shadow-xs">
                <MapPin className="w-3.5 h-3.5 text-pink-600" />
                2 Mins to JECRC & Poornima
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
              <a
                href="#rooms"
                className="glass-button-primary px-7 py-3.5 rounded-2xl font-bold text-sm shadow-md flex items-center justify-center gap-2 group text-center"
              >
                <span>Explore 4-Floor Rooms</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>

              <button
                onClick={onOpenVisit}
                className="glass-button-secondary px-6 py-3.5 rounded-2xl font-bold text-sm shadow-xs flex items-center justify-center gap-2 hover:shadow-sm transition-all"
              >
                <Video className="w-4 h-4 text-pink-600" />
                <span>Book a Visit (Physical / Video Call)</span>
              </button>
            </div>

            {/* Social Trust Metrics */}
            <div className="pt-3 flex items-center gap-6 text-xs text-slate-500">
              <div>
                <span className="font-extrabold text-base text-slate-900 block">100%</span>
                <span>All-Girls Verified</span>
              </div>
              <div className="h-7 w-px bg-pink-200" />
              <div>
                <span className="font-extrabold text-base text-slate-900 block">4.9 / 5</span>
                <span>Student Satisfaction</span>
              </div>
              <div className="h-7 w-px bg-pink-200" />
              <div>
                <span className="font-extrabold text-base text-slate-900 block">Zero</span>
                <span>Brokerage Fees</span>
              </div>
            </div>
          </motion.div>

          {/* Right Hero Video Glass Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="lg:col-span-5 relative"
          >
            <div className="relative rounded-3xl p-3 bg-white/90 backdrop-blur-xl border border-pink-200 shadow-xl shadow-pink-600/5">
              
              {/* Floating Top Badge */}
              <div className="absolute -top-3.5 -right-2 z-20 bg-white px-3.5 py-1.5 rounded-full border border-pink-300 shadow-md flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-[11px] font-bold text-slate-900">Live Campus Walkthrough</span>
              </div>

              {/* Video Player */}
              <div className="relative rounded-2xl overflow-hidden aspect-[4/5] bg-slate-950 shadow-inner group">
                <video
                  ref={videoRef}
                  src={videoUrl}
                  poster={posterUrl}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                />

                {/* Bottom Video Badge & Playback Toggle */}
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between z-10 bg-black/60 backdrop-blur-sm p-3 rounded-xl">
                  <div className="text-white space-y-0.5">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-pink-300">Sree Kunj Girls PG</p>
                    <p className="text-xs font-semibold text-white">Furnished AC Rooms • Sitapura</p>
                  </div>

                  <button
                    onClick={togglePlay}
                    className="w-8 h-8 rounded-full bg-white/20 text-white flex items-center justify-center hover:bg-white/40 transition-colors"
                    aria-label={isPlaying ? 'Pause video' : 'Play video'}
                  >
                    {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 translate-x-0.5" />}
                  </button>
                </div>
              </div>

              {/* Bottom Floating trust card */}
              <div className="absolute -bottom-4 -left-3 z-20 bg-white p-3 rounded-2xl border border-pink-200 shadow-lg flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-pink-100 text-pink-700 flex items-center justify-center font-bold text-xs">
                  🛡️
                </div>
                <div>
                  <p className="text-xs font-extrabold text-slate-900">Parent Approved Safety</p>
                  <p className="text-[10px] text-slate-500">Biometric & 24/7 Female Warden</p>
                </div>
              </div>

            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
