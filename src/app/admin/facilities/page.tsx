'use client';

import React, { useEffect, useState } from 'react';
import { Sparkles, Plus, Edit2, Trash2, X, CheckCircle2 } from 'lucide-react';

export default function AdminFacilitiesPage() {
  const [facilities, setFacilities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingFac, setEditingFac] = useState<any>(null);

  const [name, setName] = useState('');
  const [category, setCategory] = useState('Essential');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [icon, setIcon] = useState('Sparkles');
  const [order, setOrder] = useState(1);

  const fetchFacilities = async () => {
    try {
      const res = await fetch('/api/facilities');
      const data = await res.json();
      if (data.facilities) setFacilities(data.facilities);
    } catch (e) {
      console.error('Error fetching facilities:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFacilities();
  }, []);

  const openCreate = () => {
    setEditingFac(null);
    setName('');
    setCategory('Comfort');
    setDescription('');
    setImageUrl('');
    setIcon('Sparkles');
    setOrder(facilities.length + 1);
    setModalOpen(true);
  };

  const openEdit = (fac: any) => {
    setEditingFac(fac);
    setName(fac.name);
    setCategory(fac.category || 'Essential');
    setDescription(fac.description);
    setImageUrl(fac.imageUrl || '');
    setIcon(fac.icon || 'Sparkles');
    setOrder(fac.order || 1);
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name,
      category,
      description,
      imageUrl,
      icon,
      order: Number(order),
      active: true,
    };

    try {
      if (editingFac) {
        await fetch(`/api/facilities/${editingFac._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        await fetch('/api/facilities', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }
      await fetchFacilities();
      setModalOpen(false);
    } catch (e) {
      console.error('Error saving facility:', e);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to remove this facility?')) return;
    try {
      await fetch(`/api/facilities/${id}`, { method: 'DELETE' });
      setFacilities((prev) => prev.filter((f) => f._id !== id));
    } catch (e) {
      console.error('Delete error:', e);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Facilities & Amenities Manager
          </h1>
          <p className="text-xs text-slate-500">
            Customize PG features, dining menu perks, and student services.
          </p>
        </div>

        <button
          onClick={openCreate}
          className="px-4 py-2.5 bg-pink-600 hover:bg-pink-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Facility</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {facilities.map((fac) => (
          <div
            key={fac._id}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between space-y-4"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-pink-600 bg-pink-50 px-2 py-0.5 rounded-full uppercase">
                  {fac.category}
                </span>
                <span className="text-xs text-slate-400 font-bold">Order #{fac.order}</span>
              </div>
              <h3 className="font-bold text-base text-slate-900">{fac.name}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{fac.description}</p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
              <button
                onClick={() => openEdit(fac)}
                className="p-1.5 rounded-lg bg-slate-100 text-slate-700 hover:text-pink-600"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(fac._id)}
                className="p-1.5 rounded-lg bg-slate-100 text-slate-700 hover:text-rose-600"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 relative shadow-2xl border border-slate-200">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-black text-slate-900">
              {editingFac ? 'Edit Facility' : 'Add Facility'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Facility Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Category</label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Display Order</label>
                  <input
                    type="number"
                    value={order}
                    onChange={(e) => setOrder(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Description *</label>
                <textarea
                  required
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Image URL (Optional)</label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-pink-600 text-white font-bold"
                >
                  Save Facility
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
