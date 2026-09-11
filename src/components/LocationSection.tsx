'use client';

import React from 'react';
import { MapPin, Navigation, Sparkles, Phone, Mail, ExternalLink } from 'lucide-react';

interface LocationSectionProps {
  address?: string;
  contactPhone?: string;
  contactEmail?: string;
  googleMapsEmbedUrl?: string;
  googleMapsDirectionsUrl?: string;
  nearbyColleges?: Array<{
    name: string;
    distance: string;
    travelTime: string;
  }>;
}

export const LocationSection: React.FC<LocationSectionProps> = ({
  address = 'Plot 42, Institutional Corridor, Near JECRC University Gate, Sitapura Industrial Area, Jaipur, Rajasthan 302022',
  contactPhone = '+91 89573 56189',
  contactEmail = 'admissions@sreekunjgirlspg.com',
  googleMapsEmbedUrl = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3561.427771746247!2d75.8761168!3d26.7945037!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396dc9bd0b3eb2b3%3A0x7d6fcf4a572c65a4!2sJECRC%20University!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin',
  googleMapsDirectionsUrl = 'https://maps.google.com/?q=JECRC+University+Jaipur',
  nearbyColleges = [
    { name: 'JECRC University', distance: '450 meters', travelTime: '2 mins walk' },
    { name: 'Poornima University', distance: '1.2 km', travelTime: '4 mins drive' },
    { name: 'Mahatma Gandhi Hospital', distance: '2.5 km', travelTime: '7 mins drive' },
  ],
}) => {
  return (
    <section id="location" className="py-20 relative bg-[#FFF5F7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full solid-badge-pink text-xs font-bold tracking-wider uppercase">
            <Sparkles className="w-3.5 h-3.5 text-pink-600" />
            Sitapura Institutional Hub
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
            Prime Campus Location in <span className="text-pink-600">Jaipur</span>
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            Centrally situated right next to JECRC University campus with quick connectivity to Poornima University, cafes, pharmacies, and Sitapura RIICO zone.
          </p>
        </div>

        {/* Glass Map Card */}
        <div className="glass-card rounded-3xl p-4 sm:p-6 shadow-xl border border-pink-200 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            
            {/* Embedded Google Map */}
            <div className="lg:col-span-7 rounded-2xl overflow-hidden aspect-[16/10] sm:aspect-[16/9] lg:aspect-auto lg:h-[400px] bg-pink-100 relative shadow-inner">
              <iframe
                src={googleMapsEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Sree Kunj Girls PG Location Map"
                className="w-full h-full"
              />
            </div>

            {/* Address & Direct Directions Box */}
            <div className="lg:col-span-5 p-3 sm:p-5 space-y-5">
              
              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5 text-pink-700 font-bold text-xs uppercase tracking-wider">
                  <MapPin className="w-4 h-4" />
                  <span>Residence Address</span>
                </div>
                <p className="text-xs sm:text-sm font-semibold text-slate-800 leading-relaxed">
                  {address}
                </p>
              </div>

              {/* Landmark Distances */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide block">
                  Nearby Key Landmarks:
                </span>
                {nearbyColleges.map((col, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-white border border-pink-100 shadow-2xs"
                  >
                    <span className="font-bold text-slate-800">{col.name}</span>
                    <span className="font-bold text-pink-700 bg-pink-50 px-2 py-0.5 rounded-md text-[11px]">
                      {col.distance} ({col.travelTime})
                    </span>
                  </div>
                ))}
              </div>

              {/* Contact summary */}
              <div className="space-y-1.5 pt-2 border-t border-pink-100 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-pink-600" />
                  <span>Helpline: <strong className="text-slate-900">{contactPhone}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-pink-600" />
                  <span>Email: <strong className="text-slate-900">{contactEmail}</strong></span>
                </div>
              </div>

              {/* Get Directions CTA (Solid Button) */}
              <div className="pt-1">
                <a
                  href={googleMapsDirectionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full glass-button-primary py-3 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md"
                >
                  <Navigation className="w-4 h-4" />
                  <span>Get Driving & Walking Directions</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
