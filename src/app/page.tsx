import React from 'react';
import { getRooms, getFacilities, getTestimonials, getSettings } from '@/lib/dataService';
import { PublicPageClient } from './PublicPageClient';

// Force dynamic server rendering to guarantee real-time updates from database
export const dynamic = 'force-dynamic';
export const revalidate = 0;


export default async function HomePage() {
  const [rooms, facilities, testimonials, settings] = await Promise.all([
    getRooms(),
    getFacilities(),
    getTestimonials(),
    getSettings(),
  ]);

  // Convert Mongoose/Objects to pure JSON for client component
  const cleanRooms = JSON.parse(JSON.stringify(rooms));
  const cleanFacilities = JSON.parse(JSON.stringify(facilities));
  const cleanTestimonials = JSON.parse(JSON.stringify(testimonials));
  const cleanSettings = JSON.parse(JSON.stringify(settings));

  return (
    <PublicPageClient
      initialRooms={cleanRooms}
      initialFacilities={cleanFacilities}
      initialTestimonials={cleanTestimonials}
      settings={cleanSettings}
    />
  );
}
