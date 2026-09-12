'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sparkles, CalendarCheck } from 'lucide-react';

interface HeaderProps {
  pgName?: string;
  onOpenBooking: () => void;
  onOpenVisit: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  pgName = 'Shri Kunj Girls PG',
  onOpenBooking,
  onOpenVisit,
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('Home');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#hero' },
    { name: 'About', href: '#about' },
    { name: 'Rooms', href: '#rooms' },
    { name: 'Facilities', href: '#facilities' },
    { name: 'Testimonials', href: '#testimonials' },
    { name: 'Location', href: '#location' },
    { name: 'Contact', href: '#inquiry' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'py-2.5 bg-white/95 backdrop-blur-xl border-b border-pink-200/90 shadow-sm'
          : 'py-3.5 bg-white/80 backdrop-blur-lg border-b border-pink-100'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3">
        
        {/* Left: Brand Logo Mascot & Title */}
        <Link href="#hero" className="flex items-center gap-2.5 shrink-0 group">
          <div className="w-10 h-10 rounded-full bg-pink-100 border border-pink-300 p-0.5 shadow-xs overflow-hidden flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <img src="/logo.svg" alt="Shri Kunj Logo" className="w-full h-full object-contain" />
          </div>

          <div className="flex flex-col">
            <span className="font-black text-lg sm:text-xl tracking-tight text-slate-900 group-hover:text-pink-600 transition-colors whitespace-nowrap leading-none">
              Shri Kunj <span className="text-pink-600 font-extrabold">Girls PG</span>
            </span>
            <span className="text-[10px] font-bold text-pink-700 tracking-wider uppercase flex items-center gap-1 whitespace-nowrap mt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-pink-600 inline-block" />
              Near JECRC & Poornima • Jaipur
            </span>
          </div>
        </Link>

        {/* Center: Liquid Capsule Navigation Bar */}
        <nav className="hidden lg:flex items-center space-x-1.5 bg-pink-50/80 backdrop-blur-xl px-2.5 py-1.5 rounded-full border border-pink-200/90 shadow-xs whitespace-nowrap shrink-0">
          {navLinks.map((link) => {
            const isActive = activeSection === link.name;
            return (
              <motion.div
                key={link.name}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.96 }}
                className="relative"
              >
                <Link
                  href={link.href}
                  onClick={() => setActiveSection(link.name)}
                  className={`relative block px-3.5 py-1.5 rounded-full text-[14px] font-bold tracking-tight transition-all duration-200 whitespace-nowrap ${
                    isActive
                      ? 'bg-pink-600 text-white shadow-xs'
                      : 'text-slate-700 hover:text-pink-800 hover:bg-white/80'
                  }`}
                >
                  {link.name}
                </Link>
              </motion.div>
            );
          })}
        </nav>

        {/* Right: Primary CTAs (Book Visit & Book Room) */}
        <div className="hidden sm:flex items-center space-x-2.5 whitespace-nowrap shrink-0">
          {/* Book Visit Button */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={onOpenVisit}
            className="glass-button-secondary px-3.5 py-1.5 text-xs sm:text-sm font-bold rounded-full flex items-center gap-1.5 shadow-xs"
          >
            <CalendarCheck className="w-4 h-4 text-pink-600" />
            <span>Book Visit</span>
          </motion.button>

          {/* Book a Room CTA */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={onOpenBooking}
            className="glass-button-primary px-4 py-1.5 text-xs sm:text-sm font-bold rounded-full flex items-center gap-1.5 shadow-xs"
          >
            <Sparkles className="w-4 h-4" />
            <span>Book a Room</span>
          </motion.button>
        </div>

        {/* Mobile Header Controls */}
        <div className="flex lg:hidden items-center space-x-2">
          <button
            onClick={onOpenBooking}
            className="glass-button-primary px-3 py-1.5 text-xs font-bold rounded-full"
          >
            Book Room
          </button>
          
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-2xl bg-white border border-pink-200 text-slate-700 hover:text-pink-600 focus:outline-none shadow-2xs"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden bg-white/95 backdrop-blur-xl border-b border-pink-200 px-6 py-5 shadow-xl space-y-4"
          >
            <div className="grid grid-cols-2 gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => {
                    setActiveSection(link.name);
                    setMobileMenuOpen(false);
                  }}
                  className="text-xs font-bold text-slate-800 hover:text-pink-600 py-2.5 px-3.5 rounded-full bg-pink-50/70 border border-pink-200/60 text-center hover:bg-pink-100/80 transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>

            <div className="pt-2 flex flex-col gap-2.5 border-t border-pink-100">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenBooking();
                }}
                className="w-full glass-button-primary py-2.5 rounded-full font-bold text-xs flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                Book a Room
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenVisit();
                }}
                className="w-full glass-button-secondary py-2.5 rounded-full font-bold text-xs flex items-center justify-center gap-2"
              >
                <CalendarCheck className="w-4 h-4 text-pink-600" />
                Schedule Visit
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
