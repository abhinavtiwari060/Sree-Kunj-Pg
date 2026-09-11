'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Wind,
  Users,
  AlertCircle,
  XCircle,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  X,
  Layers,
  ArrowRight
} from 'lucide-react';

export interface RoomItem {
  _id: string;
  roomNumber: string;
  floor: number;
  type: string;
  isAc: boolean;
  price: number;
  capacity: number;
  description: string;
  facilities: string[];
  images: string[];
  availability: 'Available' | 'Pending' | 'Booked' | 'Unavailable';
  featured?: boolean;
}

interface RoomsSectionProps {
  rooms: RoomItem[];
  onSelectRoomToBook: (room: RoomItem) => void;
}

import { defaultRooms } from '@/lib/sampleData';

export const RoomsSection: React.FC<RoomsSectionProps> = ({
  rooms,
  onSelectRoomToBook,
}) => {
  const [selectedFloor, setSelectedFloor] = useState<number>(1);
  const [filterType, setFilterType] = useState<'all' | 'ac' | 'non-ac'>('all');
  const [lightboxImages, setLightboxImages] = useState<{ images: string[]; activeIdx: number } | null>(null);

  const roomList: RoomItem[] = rooms && rooms.length > 0 ? rooms : (defaultRooms as any);

  const filteredRooms = roomList.filter((room: RoomItem) => {
    if (room.floor !== selectedFloor) return false;
    if (filterType === 'ac' && !room.isAc) return false;
    if (filterType === 'non-ac' && room.isAc) return false;
    return true;
  });

  const getStatusBadge = (status: RoomItem['availability']) => {
    switch (status) {
      case 'Available':
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
            Available
          </span>
        );
      case 'Pending':
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-300 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            Booking Pending
          </span>
        );
      case 'Booked':
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-300 flex items-center gap-1">
            <XCircle className="w-3 h-3" />
            Occupied
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-300">
            Unavailable
          </span>
        );
    }
  };

  return (
    <section id="rooms" className="py-20 relative bg-[#FFF5F7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full solid-badge-pink text-xs font-bold tracking-wider uppercase">
            <Layers className="w-3.5 h-3.5 text-pink-600" />
            4-Floor Residential Layout
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
            Explore Rooms Across <span className="text-pink-600">All 4 Floors</span>
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            Select your preferred floor to view live occupancy, photo galleries, and amenities. Every room includes attached bathrooms and daily housekeeping.
          </p>
        </div>

        {/* 4 Floors Interactive Selector Tabs (Solid Pink Active State) */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          
          {/* Floor Tabs */}
          <div className="flex items-center p-1.5 bg-white rounded-2xl border border-pink-200 shadow-xs">
            {[1, 2, 3, 4].map((floorNum) => (
              <button
                key={floorNum}
                onClick={() => setSelectedFloor(floorNum)}
                className={`relative px-4 sm:px-5 py-2 rounded-xl font-bold text-xs sm:text-sm transition-all ${
                  selectedFloor === floorNum
                    ? 'text-white'
                    : 'text-slate-600 hover:text-pink-600'
                }`}
              >
                {selectedFloor === floorNum && (
                  <motion.div
                    layoutId="activeFloorTab"
                    className="absolute inset-0 bg-pink-600 rounded-xl"
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-1.5">
                  Floor {floorNum}
                  <span className="text-[10px] opacity-85 font-normal">
                    ({roomList.filter((r: any) => r.floor === floorNum).length} Rooms)
                  </span>
                </span>
              </button>
            ))}
          </div>

          {/* AC / Non-AC Filter */}
          <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-pink-200 shadow-xs">
            <span className="text-xs font-bold text-slate-500 mr-1">Filter:</span>
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                filterType === 'all'
                  ? 'bg-pink-600 text-white'
                  : 'text-slate-600 hover:bg-pink-50'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterType('ac')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                filterType === 'ac'
                  ? 'bg-pink-600 text-white'
                  : 'text-slate-600 hover:bg-pink-50'
              }`}
            >
              AC
            </button>
            <button
              onClick={() => setFilterType('non-ac')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                filterType === 'non-ac'
                  ? 'bg-pink-600 text-white'
                  : 'text-slate-600 hover:bg-pink-50'
              }`}
            >
              Non-AC
            </button>
          </div>
        </div>

        {/* Floor Context Summary Banner */}
        <div className="mb-8 p-3.5 rounded-2xl bg-white border border-pink-200 flex flex-wrap items-center justify-between text-xs text-slate-600 gap-3">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-slate-900 text-xs">
              Floor {selectedFloor} Features:
            </span>
            <span>
              {selectedFloor === 1 && 'Ground floor with easy dining hall access, reception desk, and courtyard views.'}
              {selectedFloor === 2 && 'First residential tier with wide sunlit corridors and dual laundry stations.'}
              {selectedFloor === 3 && 'Quiet study zone floor with acoustic noise dampening and panoramic balconies.'}
              {selectedFloor === 4 && 'Top floor tier with direct rooftop gazebo access and peaceful reading library.'}
            </span>
          </div>
          <span className="font-bold text-pink-700 bg-pink-50 px-2.5 py-0.5 rounded-md">
            Showing {filteredRooms.length} room{filteredRooms.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Room Cards Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${selectedFloor}-${filterType}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredRooms.length === 0 ? (
              <div className="col-span-full py-16 text-center bg-white rounded-3xl border border-pink-200">
                <p className="text-slate-500 font-bold text-sm">No rooms match the selected filter on Floor {selectedFloor}.</p>
                <button
                  onClick={() => setFilterType('all')}
                  className="mt-2 text-xs font-bold text-pink-600 underline"
                >
                  Reset filters
                </button>
              </div>
            ) : (
              filteredRooms.map((room) => (
                <RoomCard
                  key={room._id}
                  room={room}
                  onOpenBooking={() => onSelectRoomToBook(room)}
                  onOpenLightbox={(idx) => setLightboxImages({ images: room.images, activeIdx: idx })}
                  getStatusBadge={getStatusBadge}
                />
              ))
            )}
          </motion.div>
        </AnimatePresence>

      </div>

      {/* Lightbox Modal */}
      {lightboxImages && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <button
            onClick={() => setLightboxImages(null)}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/20 text-white hover:bg-white/40"
          >
            <X className="w-6 h-6" />
          </button>
          
          <div className="relative max-w-4xl w-full flex items-center justify-center">
            <img
              src={lightboxImages.images[lightboxImages.activeIdx]}
              alt="Room view"
              className="max-h-[80vh] w-auto rounded-2xl object-contain shadow-2xl"
            />

            {lightboxImages.images.length > 1 && (
              <>
                <button
                  onClick={() =>
                    setLightboxImages((prev) =>
                      prev
                        ? {
                            ...prev,
                            activeIdx:
                              (prev.activeIdx - 1 + prev.images.length) % prev.images.length,
                          }
                        : null
                    )
                  }
                  className="absolute left-2 p-3 rounded-full bg-white/30 text-white hover:bg-white/60"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={() =>
                    setLightboxImages((prev) =>
                      prev
                        ? {
                            ...prev,
                            activeIdx: (prev.activeIdx + 1) % prev.images.length,
                          }
                        : null
                    )
                  }
                  className="absolute right-2 p-3 rounded-full bg-white/30 text-white hover:bg-white/60"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

interface RoomCardProps {
  room: RoomItem;
  onOpenBooking: () => void;
  onOpenLightbox: (idx: number) => void;
  getStatusBadge: (status: RoomItem['availability']) => React.ReactNode;
}

const RoomCard: React.FC<RoomCardProps> = ({
  room,
  onOpenBooking,
  onOpenLightbox,
  getStatusBadge,
}) => {
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  const images = room.images && room.images.length > 0
    ? room.images
    : ['https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=800&q=80'];

  const nextImg = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImageIdx((prev) => (prev + 1) % images.length);
  };

  const prevImg = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImageIdx((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="glass-card glass-card-hover rounded-3xl overflow-hidden flex flex-col justify-between group">
      <div>
        {/* Room Image Carousel Header */}
        <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
          <img
            src={images[activeImageIdx]}
            alt={`Room ${room.roomNumber}`}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />

          {/* Top Badges */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
            <span className="px-2.5 py-1 rounded-full text-xs font-black bg-white text-slate-900 border border-pink-200 shadow-sm">
              Room {room.roomNumber}
            </span>
            {getStatusBadge(room.availability)}
          </div>

          {/* Carousel Arrows */}
          {images.length > 1 && (
            <div className="absolute inset-y-0 inset-x-2 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={prevImg}
                className="w-7 h-7 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={nextImg}
                className="w-7 h-7 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Photo Dots & Lightbox trigger */}
          <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between z-10">
            <div className="flex gap-1 bg-black/40 px-2 py-1 rounded-full">
              {images.map((_, i) => (
                <span
                  key={i}
                  className={`w-1.5 h-1.5 rounded-full ${
                    i === activeImageIdx ? 'bg-white' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={() => onOpenLightbox(activeImageIdx)}
              className="px-2 py-0.5 rounded-full bg-black/50 text-white text-[10px] font-bold flex items-center gap-1 hover:bg-black/70"
            >
              <Maximize2 className="w-2.5 h-2.5" />
              {images.length} Photos
            </button>
          </div>
        </div>

        {/* Room Content */}
        <div className="p-5 space-y-3">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2 text-[11px] font-bold text-pink-700 uppercase tracking-wider">
              <span>Floor {room.floor}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                {room.capacity === 1
                  ? 'Single'
                  : room.capacity === 2
                  ? 'Twin Sharing'
                  : `${room.capacity} Sharing`}
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 group-hover:text-pink-600 transition-colors">
              {room.type}
            </h3>
          </div>

          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
            {room.description}
          </p>

          {/* Amenity Pills */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            <span
              className={`px-2 py-0.5 rounded-md text-[10px] font-bold flex items-center gap-1 ${
                room.isAc
                  ? 'bg-pink-100 text-pink-800 border border-pink-200'
                  : 'bg-slate-100 text-slate-700'
              }`}
            >
              <Wind className="w-3 h-3" />
              {room.isAc ? 'Air Conditioned' : 'Ventilated Non-AC'}
            </span>
            {room.facilities.slice(0, 3).map((f, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-white text-slate-700 border border-pink-100 shadow-2xs"
              >
                {f}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Card Footer with Price and Book CTA */}
      <div className="p-5 pt-0">
        <div className="pt-3 border-t border-pink-100 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-500 block font-medium">Monthly Rent</span>
            <div className="flex items-baseline gap-0.5">
              <span className="text-xl font-black text-slate-900">
                ₹{room.price.toLocaleString('en-IN')}
              </span>
              <span className="text-[11px] text-slate-500">/mo</span>
            </div>
          </div>

          <button
            onClick={onOpenBooking}
            disabled={room.availability === 'Booked' || room.availability === 'Unavailable'}
            className={`px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-1 transition-all ${
              room.availability === 'Booked' || room.availability === 'Unavailable'
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                : 'glass-button-primary'
            }`}
          >
            <span>Book Room</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
