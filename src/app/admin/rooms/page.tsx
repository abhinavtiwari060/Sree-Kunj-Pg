'use client';

import React, { useEffect, useState } from 'react';
import {
  Layers,
  Plus,
  Edit2,
  Trash2,
  Wind,
  Users,
  Image as ImageIcon,
  CheckCircle2,
  X,
  UploadCloud,
  AlertCircle
} from 'lucide-react';
import { uploadMediaToFirebase } from '@/lib/firebase';

export default function AdminRoomsPage() {
  const [rooms, setRooms] = useState<any[]>([]);
  const [activeFloor, setActiveFloor] = useState<number>(1);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<any>(null);

  // Form states
  const [roomNumber, setRoomNumber] = useState('');
  const [floor, setFloor] = useState(1);
  const [type, setType] = useState('Deluxe Twin Sharing AC');
  const [isAc, setIsAc] = useState(true);
  const [price, setPrice] = useState(9500);
  const [capacity, setCapacity] = useState(2);
  const [description, setDescription] = useState('');
  const [facilitiesStr, setFacilitiesStr] = useState('Split AC, Attached Washroom, Wi-Fi 6, Wardrobe');
  const [images, setImages] = useState<string[]>([]);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [availability, setAvailability] = useState<'Available' | 'Pending' | 'Booked' | 'Unavailable'>('Available');
  const [isUploading, setIsUploading] = useState(false);

  const fetchRooms = async () => {
    try {
      const res = await fetch('/api/rooms');
      const data = await res.json();
      if (data.rooms) setRooms(data.rooms);
    } catch (e) {
      console.error('Error loading rooms:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const openCreateModal = () => {
    setEditingRoom(null);
    setRoomNumber(`${activeFloor}0${rooms.filter((r) => r.floor === activeFloor).length + 1}`);
    setFloor(activeFloor);
    setType('Deluxe Twin Sharing AC');
    setIsAc(true);
    setPrice(9500);
    setCapacity(2);
    setDescription('Fully furnished modern room with attached washroom, study desks, and high-speed Wi-Fi.');
    setFacilitiesStr('Split AC, Attached Washroom, Wi-Fi 6, Wardrobe, Daily Housekeeping');
    setImages(['https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1000&q=80']);
    setAvailability('Available');
    setModalOpen(true);
  };

  const openEditModal = (room: any) => {
    setEditingRoom(room);
    setRoomNumber(room.roomNumber);
    setFloor(room.floor);
    setType(room.type);
    setIsAc(room.isAc);
    setPrice(room.price);
    setCapacity(room.capacity);
    setDescription(room.description || '');
    setFacilitiesStr(room.facilities ? room.facilities.join(', ') : '');
    setImages(room.images || []);
    setAvailability(room.availability || 'Available');
    setModalOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setIsUploading(true);
    try {
      const downloadUrl = await uploadMediaToFirebase(file, 'rooms');
      setImages((prev) => [...prev, downloadUrl]);
    } catch (err) {
      alert('Upload failed: ' + (err as any).message);
    } finally {
      setIsUploading(false);
    }
  };

  const addImageUrl = () => {
    if (newImageUrl.trim()) {
      setImages((prev) => [...prev, newImageUrl.trim()]);
      setNewImageUrl('');
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const facilities = facilitiesStr
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const payload = {
      roomNumber,
      floor: Number(floor),
      type,
      isAc,
      price: Number(price),
      capacity: Number(capacity),
      description,
      facilities,
      images,
      availability,
    };

    try {
      if (editingRoom) {
        const res = await fetch(`/api/rooms/${editingRoom._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          await fetchRooms();
          setModalOpen(false);
        }
      } else {
        const res = await fetch('/api/rooms', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          await fetchRooms();
          setModalOpen(false);
        }
      }
    } catch (e) {
      console.error('Save room error:', e);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this room?')) return;
    try {
      const res = await fetch(`/api/rooms/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setRooms((prev) => prev.filter((r) => r._id !== id));
      }
    } catch (e) {
      console.error('Delete error:', e);
    }
  };

  const floorRooms = rooms.filter((r) => r.floor === activeFloor);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            4-Floor Room Catalog
          </h1>
          <p className="text-xs text-slate-500">
            Manage inventory across all 4 floors, update rental rates, and upload room galleries.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-4 py-2.5 bg-pink-600 hover:bg-pink-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-pink-600/20 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Room on Floor {activeFloor}</span>
        </button>
      </div>

      {/* 4 Floors Tab Selector */}
      <div className="flex items-center gap-2 p-1.5 bg-white rounded-2xl border border-slate-200 shadow-xs">
        {[1, 2, 3, 4].map((f) => (
          <button
            key={f}
            onClick={() => setActiveFloor(f)}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all ${
              activeFloor === f
                ? 'bg-pink-600 text-white shadow-md'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <span>Floor {f}</span>
            <span className="ml-1.5 opacity-80 text-[10px]">
              ({rooms.filter((r) => r.floor === f).length} Rooms)
            </span>
          </button>
        ))}
      </div>

      {/* Room Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {floorRooms.length === 0 ? (
          <div className="col-span-full py-16 text-center bg-white rounded-2xl border border-slate-200">
            <Layers className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-sm font-bold text-slate-700">No rooms created on Floor {activeFloor} yet.</p>
            <button
              onClick={openCreateModal}
              className="mt-3 text-xs font-bold text-pink-600 underline"
            >
              + Create First Room on Floor {activeFloor}
            </button>
          </div>
        ) : (
          floorRooms.map((room) => (
            <div
              key={room._id}
              className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-[16/10] bg-slate-100 overflow-hidden">
                  <img
                    src={
                      room.images?.[0] ||
                      'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=800&q=80'
                    }
                    alt={`Room ${room.roomNumber}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-lg text-white font-black text-xs">
                    Room {room.roomNumber}
                  </div>
                  <div className="absolute top-3 right-3">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                        room.availability === 'Available'
                          ? 'bg-emerald-500 text-white'
                          : room.availability === 'Booked'
                          ? 'bg-rose-500 text-white'
                          : 'bg-amber-500 text-white'
                      }`}
                    >
                      {room.availability}
                    </span>
                  </div>
                </div>

                <div className="p-5 space-y-3">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-pink-600 uppercase tracking-wider block">
                      Floor {room.floor} • {room.capacity} Sharing • {room.isAc ? 'AC' : 'Non-AC'}
                    </span>
                    <h3 className="font-bold text-base text-slate-900">{room.type}</h3>
                  </div>

                  <p className="text-xs text-slate-500 line-clamp-2">{room.description}</p>

                  <div className="flex flex-wrap gap-1">
                    {room.facilities?.slice(0, 3).map((f: string, i: number) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-medium"
                      >
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0">
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-lg font-black text-slate-900">
                      ₹{room.price?.toLocaleString('en-IN')}
                    </span>
                    <span className="text-xs text-slate-400">/mo</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEditModal(room)}
                      className="p-2 rounded-xl bg-slate-100 text-slate-700 hover:text-pink-600 hover:bg-pink-50 transition-colors"
                      title="Edit Room"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(room._id)}
                      className="p-2 rounded-xl bg-slate-100 text-slate-700 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Delete Room"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-5 relative shadow-2xl border border-slate-200 my-auto max-h-[92vh] overflow-y-auto">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-pink-600 bg-pink-50 px-2.5 py-0.5 rounded-full">
                {editingRoom ? 'Modify Room' : 'Add New Inventory'}
              </span>
              <h3 className="text-xl font-black text-slate-900 mt-1">
                {editingRoom ? `Edit Room ${editingRoom.roomNumber}` : `Create Room on Floor ${floor}`}
              </h3>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Room Number *</label>
                  <input
                    type="text"
                    required
                    value={roomNumber}
                    onChange={(e) => setRoomNumber(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Floor (1-4) *</label>
                  <select
                    value={floor}
                    onChange={(e) => setFloor(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
                  >
                    {[1, 2, 3, 4].map((f) => (
                      <option key={f} value={f}>
                        Floor {f}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Availability</label>
                  <select
                    value={availability}
                    onChange={(e) => setAvailability(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
                  >
                    <option value="Available">Available</option>
                    <option value="Pending">Pending</option>
                    <option value="Booked">Booked</option>
                    <option value="Unavailable">Unavailable</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Room Type Name *</label>
                  <input
                    type="text"
                    required
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Monthly Rent (₹) *</label>
                  <input
                    type="number"
                    required
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Capacity (Persons)</label>
                  <input
                    type="number"
                    min={1}
                    max={6}
                    value={capacity}
                    onChange={(e) => setCapacity(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="isAcCheck"
                  checked={isAc}
                  onChange={(e) => setIsAc(e.target.checked)}
                  className="rounded text-pink-600 focus:ring-pink-500 w-4 h-4"
                />
                <label htmlFor="isAcCheck" className="font-bold text-slate-800 cursor-pointer">
                  Air Conditioned (AC Room)
                </label>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Facilities (comma-separated)
                </label>
                <input
                  type="text"
                  value={facilitiesStr}
                  onChange={(e) => setFacilitiesStr(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
                />
              </div>

              {/* Photo Manager */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <span className="font-bold text-slate-800 block">Room Photogallery</span>

                <div className="flex flex-wrap gap-2">
                  {images.map((img, idx) => (
                    <div key={idx} className="relative w-16 h-16 rounded-xl overflow-hidden border border-slate-300">
                      <img src={img} alt="preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="absolute top-1 right-1 p-0.5 rounded-full bg-black/60 text-white hover:bg-rose-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <input
                    type="url"
                    placeholder="Paste image URL..."
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-1.5"
                  />
                  <button
                    type="button"
                    onClick={addImageUrl}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 text-white font-bold"
                  >
                    Add URL
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <label className="cursor-pointer px-3 py-1.5 rounded-xl bg-pink-100 text-pink-700 font-bold hover:bg-pink-200 transition-colors flex items-center gap-1.5">
                    <UploadCloud className="w-4 h-4" />
                    <span>{isUploading ? 'Uploading to Firebase...' : 'Upload Image File'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                      disabled={isUploading}
                    />
                  </label>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-bold shadow-md shadow-pink-600/20"
                >
                  {editingRoom ? 'Save Changes' : 'Create Room'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
