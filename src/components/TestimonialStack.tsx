'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Star,
  ChevronLeft,
  ChevronRight,
  Play,
  Volume2,
  VolumeX,
  GraduationCap,
  Quote,
  BadgeInfo
} from 'lucide-react';
import { defaultTestimonials } from '@/lib/sampleData';

export interface TestimonialItem {
  _id?: string;
  name: string;
  university: string;
  course?: string;
  videoUrl: string;
  posterUrl?: string;
  text?: string;
  rating: number;
  order?: number;
  active?: boolean;
}

interface TestimonialStackProps {
  testimonials?: TestimonialItem[];
}

export const TestimonialStack: React.FC<TestimonialStackProps> = ({ testimonials }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Fallback to rich demo testimonials if empty
  const rawList = testimonials && testimonials.length > 0 ? testimonials : defaultTestimonials;
  const activeTestimonials: TestimonialItem[] = rawList.filter((t) => t.active !== false);

  if (activeTestimonials.length === 0) return null;

  const current = activeTestimonials[currentIndex % activeTestimonials.length];

  const handleNext = () => {
    setIsPlaying(false);
    setCurrentIndex((prev) => (prev + 1) % activeTestimonials.length);
  };

  const handlePrev = () => {
    setIsPlaying(false);
    setCurrentIndex((prev) => (prev - 1 + activeTestimonials.length) % activeTestimonials.length);
  };

  const toggleVideoPlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current
          .play()
          .then(() => setIsPlaying(true))
          .catch(() => setIsPlaying(false));
      }
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <section id="testimonials" className="py-20 relative overflow-hidden bg-white">
      {/* Solid Ambient Background Shapes */}
      <div className="ambient-bg-pink-1 top-1/3 left-10 opacity-30 pointer-events-none" />
      <div className="ambient-bg-pink-2 bottom-10 right-10 opacity-30 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full solid-badge-pink text-xs font-bold tracking-wider uppercase">
            <Sparkles className="w-3.5 h-3.5 text-pink-600" />
            Resident Video Stories & Reviews
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
            Hear From Girls Living Near <span className="text-pink-600">JECRC & Poornima</span>
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            Explore preview video tours and student experiences representing life at Sree Kunj Girls PG Jaipur.
          </p>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-50 border border-pink-200 text-[11px] font-semibold text-pink-800">
            <BadgeInfo className="w-3.5 h-3.5 text-pink-600" />
            <span>Sample resident experiences shown for preview during admission cycle</span>
          </div>
        </div>

        {/* Stack Deck Carousel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* 3D Stack Deck on Left */}
          <div className="lg:col-span-6 flex items-center justify-center relative min-h-[500px]">
            <div className="relative w-[280px] sm:w-[310px] h-[470px] sm:h-[500px]">
              {activeTestimonials.map((item, idx) => {
                const total = activeTestimonials.length;
                const position = (idx - (currentIndex % total) + total) % total;

                // Only render the top 3 cards in DOM to save memory & repaint cost
                if (position > 2 && position < total - 1) return null;

                const isFront = position === 0;
                const isSecond = position === 1;

                return (
                  <motion.div
                    key={item._id || `test_${idx}`}
                    drag={isFront ? 'x' : false}
                    dragConstraints={{ left: -100, right: 100 }}
                    onDragEnd={(_, info) => {
                      if (info.offset.x < -50) handleNext();
                      if (info.offset.x > 50) handlePrev();
                    }}
                    initial={false}
                    animate={{
                      scale: isFront ? 1 : isSecond ? 0.93 : 0.86,
                      y: isFront ? 0 : isSecond ? -16 : -30,
                      x: isFront ? 0 : isSecond ? 12 : -12,
                      rotateZ: isFront ? 0 : isSecond ? 3 : -3,
                      zIndex: isFront ? 30 : isSecond ? 20 : 10,
                      opacity: isFront ? 1 : isSecond ? 0.88 : 0.65,
                    }}
                    transition={{ type: 'spring', stiffness: 280, damping: 24 }}
                    className="absolute inset-0 rounded-3xl overflow-hidden glass-card shadow-xl border border-pink-200 cursor-grab active:cursor-grabbing bg-slate-950"
                  >
                    {isFront ? (
                      <div className="relative w-full h-full bg-black">
                        {/* Only front card mounts video stream */}
                        <video
                          ref={videoRef}
                          src={item.videoUrl}
                          poster={item.posterUrl}
                          playsInline
                          loop
                          preload="none"
                          muted={isMuted}
                          className="w-full h-full object-cover"
                        />

                        {/* Instant Poster Fallback Overlay */}
                        {item.posterUrl && !isPlaying && (
                          <img
                            src={item.posterUrl}
                            alt={item.name}
                            loading="eager"
                            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                          />
                        )}

                        {/* Top Resident Badge */}
                        <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between z-20">
                          <span className="px-3 py-1 rounded-full bg-black/65 backdrop-blur-xs text-white text-xs font-bold border border-white/20">
                            {item.name}
                          </span>

                          <button
                            onClick={toggleMute}
                            className="p-1.5 rounded-full bg-black/65 backdrop-blur-xs text-white hover:bg-black/85 transition-colors"
                            aria-label="Toggle mute"
                          >
                            {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-pink-400" />}
                          </button>
                        </div>

                        {/* Center Play/Pause Overlay */}
                        <div
                          onClick={toggleVideoPlay}
                          className="absolute inset-0 flex items-center justify-center z-10 cursor-pointer"
                        >
                          {!isPlaying && (
                            <motion.div
                              whileHover={{ scale: 1.1 }}
                              className="w-14 h-14 rounded-full bg-pink-600 text-white flex items-center justify-center shadow-lg shadow-pink-600/50"
                            >
                              <Play className="w-6 h-6 translate-x-0.5 fill-current" />
                            </motion.div>
                          )}
                        </div>

                        {/* Bottom Info Bar (Solid overlay, zero gradient) */}
                        <div className="absolute bottom-0 inset-x-0 p-4 bg-black/75 z-20 text-white space-y-1 pointer-events-none">
                          <p className="text-xs text-pink-300 font-bold uppercase tracking-wider">
                            {item.university}
                          </p>
                          <div className="flex items-center gap-1 text-amber-400">
                            {[...Array(item.rating || 5)].map((_, i) => (
                              <Star key={i} className="w-3.5 h-3.5 fill-current" />
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* Stacked cards only load lightweight poster images */
                      <div className="relative w-full h-full bg-slate-900">
                        {item.posterUrl ? (
                          <img
                            src={item.posterUrl}
                            alt={item.name}
                            loading="lazy"
                            decoding="async"
                            className="w-full h-full object-cover brightness-75"
                          />
                        ) : (
                          <div className="w-full h-full bg-pink-950" />
                        )}
                        <div className="absolute inset-0 bg-black/40" />
                        <div className="absolute bottom-4 left-4 text-white">
                          <p className="font-bold text-sm">{item.name}</p>
                          <p className="text-xs text-pink-200">{item.university}</p>
                        </div>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Review Quote & Controls on Right */}
          <div className="lg:col-span-6 space-y-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={current._id || current.name}
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                transition={{ duration: 0.25 }}
                className="glass-card rounded-3xl p-6 sm:p-8 space-y-5 relative border border-pink-200"
              >
                <Quote className="w-10 h-10 text-pink-200 absolute top-6 right-6" />

                {/* Rating Stars */}
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(current.rating || 5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                  <span className="text-xs font-bold text-pink-700 bg-pink-50 px-2.5 py-0.5 rounded-full border border-pink-200 ml-2">
                    Resident Experience
                  </span>
                </div>

                {/* Testimonial Quote */}
                <p className="text-base sm:text-lg font-medium text-slate-800 leading-relaxed italic">
                  “{current.text || 'Living at Sree Kunj Girls PG has been a peaceful and secure experience close to university.'}”
                </p>

                {/* Student Bio */}
                <div className="flex items-center gap-3.5 pt-4 border-t border-pink-100">
                  <div className="w-10 h-10 rounded-2xl bg-pink-600 text-white flex items-center justify-center font-black text-base shadow-xs">
                    {current.name[0]}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">{current.name}</h4>
                    <p className="text-xs text-pink-700 font-semibold flex items-center gap-1">
                      <GraduationCap className="w-3.5 h-3.5" />
                      {current.university}
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                {activeTestimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setIsPlaying(false);
                      setCurrentIndex(i);
                    }}
                    className={`h-2 rounded-full transition-all ${
                      i === currentIndex % activeTestimonials.length
                        ? 'w-7 bg-pink-600'
                        : 'w-2 bg-pink-200 hover:bg-pink-300'
                    }`}
                    aria-label={`Go to slide ${i + 1}`}
                  />
                ))}
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  onClick={handlePrev}
                  className="p-3 rounded-2xl bg-white border border-pink-200 text-slate-700 hover:text-pink-600 shadow-xs hover:border-pink-300 transition-all"
                  aria-label="Previous story"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={handleNext}
                  className="p-3 rounded-2xl bg-white border border-pink-200 text-slate-700 hover:text-pink-600 shadow-xs hover:border-pink-300 transition-all"
                  aria-label="Next story"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <p className="text-xs text-slate-500 font-medium">
              💡 Swipe or drag the front video card to transition to the next resident story.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
};
