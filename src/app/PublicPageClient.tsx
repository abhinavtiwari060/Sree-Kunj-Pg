'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { About } from '@/components/About';
import { RoomsSection, RoomItem } from '@/components/RoomsSection';
import { FacilitiesSection, FacilityItem } from '@/components/FacilitiesSection';
import { WhyChooseUs } from '@/components/WhyChooseUs';
import { TestimonialStack, TestimonialItem } from '@/components/TestimonialStack';
import { LocationSection } from '@/components/LocationSection';
import { InquirySection } from '@/components/InquirySection';
import { Footer } from '@/components/Footer';

// Code-split heavy interactive modals & floating widget to reduce initial JS payload
const BookingModal = dynamic(
  () => import('@/components/BookingModal').then((mod) => mod.BookingModal),
  { ssr: false }
);

const VisitModal = dynamic(
  () => import('@/components/VisitModal').then((mod) => mod.VisitModal),
  { ssr: false }
);

const FloatingWhatsApp = dynamic(
  () => import('@/components/FloatingWhatsApp').then((mod) => mod.FloatingWhatsApp),
  { ssr: false }
);

interface PublicPageClientProps {
  initialRooms: RoomItem[];
  initialFacilities: FacilityItem[];
  initialTestimonials: TestimonialItem[];
  settings: any;
}

export const PublicPageClient: React.FC<PublicPageClientProps> = ({
  initialRooms,
  initialFacilities,
  initialTestimonials,
  settings,
}) => {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isVisitOpen, setIsVisitOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<RoomItem | null>(null);
  const [visitType, setVisitType] = useState<'Physical Visit' | 'Video Call Visit'>('Physical Visit');

  const handleOpenBooking = (room?: RoomItem) => {
    if (room) {
      setSelectedRoom(room);
    } else {
      setSelectedRoom(initialRooms[0] || null);
    }
    setIsBookingOpen(true);
  };

  const handleOpenVisit = (type: 'Physical Visit' | 'Video Call Visit' = 'Physical Visit') => {
    setVisitType(type);
    setIsVisitOpen(true);
  };

  const whatsappNum = settings?.whatsappNumber || '918957356189';

  return (
    <main className="min-h-screen relative overflow-x-hidden">
      {/* Sticky Liquid Glass Header */}
      <Header
        pgName={settings?.pgName}
        onOpenBooking={() => handleOpenBooking()}
        onOpenVisit={() => handleOpenVisit('Physical Visit')}
      />

      {/* Dynamic Hero Section */}
      <Hero
        heading={settings?.heroHeading}
        subheading={settings?.heroSubheading}
        badge={settings?.heroBadge}
        videoUrl={settings?.heroVideoUrl}
        posterUrl={settings?.heroPosterUrl}
        onOpenBooking={() => handleOpenBooking()}
        onOpenVisit={() => handleOpenVisit('Video Call Visit')}
      />

      {/* About Section */}
      <About
        pgName={settings?.pgName}
        description={settings?.description}
        nearbyColleges={settings?.nearbyColleges}
      />

      {/* 4-Floor Room Explorer */}
      <RoomsSection
        rooms={initialRooms}
        onSelectRoomToBook={(room) => handleOpenBooking(room)}
      />

      {/* Unified Facilities Section */}
      <FacilitiesSection facilities={initialFacilities} />

      {/* Why Choose Us Safety & Living Pillars */}
      <WhyChooseUs />

      {/* Stacked 3D Video Testimonial Deck */}
      <TestimonialStack testimonials={initialTestimonials} />

      {/* Google Maps & Campus Proximity Section */}
      <LocationSection
        address={settings?.address}
        contactPhone={settings?.contactPhone}
        contactEmail={settings?.contactEmail}
        googleMapsEmbedUrl={settings?.googleMapsEmbedUrl}
        googleMapsDirectionsUrl={settings?.googleMapsDirectionsUrl}
        nearbyColleges={settings?.nearbyColleges}
      />

      {/* Inquiry System (Direct WhatsApp + Form) */}
      <InquirySection whatsappNumber={whatsappNum} />

      {/* SEO-Rich Footer */}
      <Footer
        pgName={settings?.pgName}
        address={settings?.address}
        contactPhone={settings?.contactPhone}
        contactEmail={settings?.contactEmail}
      />

      {/* Floating WhatsApp Action Widget (Deferred client-side) */}
      <FloatingWhatsApp whatsappNumber={whatsappNum} />

      {/* Interactive Booking Modal (Loaded on demand) */}
      {isBookingOpen && (
        <BookingModal
          isOpen={isBookingOpen}
          onClose={() => setIsBookingOpen(false)}
          selectedRoom={selectedRoom}
          allRooms={initialRooms}
          whatsappNumber={whatsappNum}
        />
      )}

      {/* Interactive Visit Scheduler Modal (Loaded on demand) */}
      {isVisitOpen && (
        <VisitModal
          isOpen={isVisitOpen}
          onClose={() => setIsVisitOpen(false)}
          whatsappNumber={whatsappNum}
          defaultVisitType={visitType}
        />
      )}
    </main>
  );
};
