'use client';

import React, { useEffect, useState } from 'react';
import { Clapperboard, Video, Plus, Trash2, Edit2, Play, UploadCloud, CheckCircle2, Star, X } from 'lucide-react';
import { uploadMediaToFirebase } from '@/lib/firebase';

export default function AdminMediaPage() {
  const [settings, setSettings] = useState<any>(null);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Hero form state
  const [heroVideoUrl, setHeroVideoUrl] = useState('');
  const [heroPosterUrl, setHeroPosterUrl] = useState('');
  const [isSavingHero, setIsSavingHero] = useState(false);
  const [isUploadingHero, setIsUploadingHero] = useState(false);

  // Testimonial modal state
  const [testModalOpen, setTestModalOpen] = useState(false);
  const [editingTest, setEditingTest] = useState<any>(null);
  const [testName, setTestName] = useState('');
  const [testUniversity, setTestUniversity] = useState('JECRC University');
  const [testVideoUrl, setTestVideoUrl] = useState('');
  const [testPosterUrl, setTestPosterUrl] = useState('');
  const [testText, setTestText] = useState('');
  const [testRating, setTestRating] = useState(5);
  const [isUploadingTestVideo, setIsUploadingTestVideo] = useState(false);

  const loadMedia = async () => {
    try {
      const [sRes, tRes] = await Promise.all([
        fetch('/api/settings'),
        fetch('/api/testimonials'),
      ]);
      const [sData, tData] = await Promise.all([sRes.json(), tRes.json()]);

      if (sData.settings) {
        setSettings(sData.settings);
        setHeroVideoUrl(sData.settings.heroVideoUrl || '');
        setHeroPosterUrl(sData.settings.heroPosterUrl || '');
      }
      if (tData.testimonials) {
        setTestimonials(tData.testimonials);
      }
    } catch (e) {
      console.error('Error loading media:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMedia();
  }, []);

  const handleSaveHero = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingHero(true);
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          heroVideoUrl: heroVideoUrl.trim(),
          heroPosterUrl: heroPosterUrl.trim(),
        }),
      });
      if (res.ok) {
        alert('Hero Media updated successfully!');
      }
    } catch (e) {
      console.error('Error saving hero media:', e);
    } finally {
      setIsSavingHero(false);
    }
  };

  const handleHeroFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setIsUploadingHero(true);
    try {
      const downloadUrl = await uploadMediaToFirebase(file, 'hero');
      setHeroVideoUrl(downloadUrl);
    } catch (err: any) {
      alert('Upload failed: ' + err.message);
    } finally {
      setIsUploadingHero(false);
    }
  };

  const openCreateTestimonial = () => {
    setEditingTest(null);
    setTestName('');
    setTestUniversity('JECRC University • B.Tech CSE');
    setTestVideoUrl('https://assets.mixkit.co/videos/preview/mixkit-young-woman-taking-notes-on-a-desk-41566-large.mp4');
    setTestPosterUrl('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80');
    setTestText('Living at Sree Kunj Girls PG for the past 2 years has made my college life so peaceful. 2 mins walk to JECRC campus!');
    setTestRating(5);
    setTestModalOpen(true);
  };

  const openEditTestimonial = (item: any) => {
    setEditingTest(item);
    setTestName(item.name);
    setTestUniversity(item.university);
    setTestVideoUrl(item.videoUrl);
    setTestPosterUrl(item.posterUrl || '');
    setTestText(item.text || '');
    setTestRating(item.rating || 5);
    setTestModalOpen(true);
  };

  const handleTestimonialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name: testName,
      university: testUniversity,
      videoUrl: testVideoUrl,
      posterUrl: testPosterUrl,
      text: testText,
      rating: Number(testRating),
      active: true,
    };

    try {
      if (editingTest) {
        await fetch(`/api/testimonials/${editingTest._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        await fetch('/api/testimonials', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }
      await loadMedia();
      setTestModalOpen(false);
    } catch (e) {
      console.error('Error saving testimonial:', e);
    }
  };

  const handleDeleteTestimonial = async (id: string) => {
    if (!confirm('Are you sure you want to remove this testimonial?')) return;
    try {
      await fetch(`/api/testimonials/${id}`, { method: 'DELETE' });
      setTestimonials((prev) => prev.filter((t) => t._id !== id));
    } catch (e) {
      console.error('Delete error:', e);
    }
  };

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Hero Media & Video Testimonials
        </h1>
        <p className="text-xs text-slate-500">
          Control the dynamic hero video background and vertical student video reels.
        </p>
      </div>

      {/* Hero Video Management Section */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-2 text-pink-600 font-bold text-xs uppercase tracking-wider">
          <Clapperboard className="w-4 h-4" />
          <span>Dynamic Hero Video Asset</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Video Preview */}
          <div className="lg:col-span-5 aspect-video bg-black rounded-2xl overflow-hidden shadow-inner relative group">
            <video
              src={heroVideoUrl}
              poster={heroPosterUrl}
              controls
              className="w-full h-full object-cover"
            />
          </div>

          {/* Configuration Form */}
          <form onSubmit={handleSaveHero} className="lg:col-span-7 space-y-4 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Active Hero Video URL (MP4 / WebM)
              </label>
              <input
                type="url"
                required
                value={heroVideoUrl}
                onChange={(e) => setHeroVideoUrl(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Video Poster Fallback Image URL
              </label>
              <input
                type="url"
                value={heroPosterUrl}
                onChange={(e) => setHeroPosterUrl(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <label className="cursor-pointer px-3.5 py-2 rounded-xl bg-pink-100 text-pink-700 font-bold hover:bg-pink-200 transition-colors flex items-center gap-1.5">
                <UploadCloud className="w-4 h-4" />
                <span>{isUploadingHero ? 'Uploading Video...' : 'Upload Video to Firebase'}</span>
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleHeroFileUpload}
                  className="hidden"
                  disabled={isUploadingHero}
                />
              </label>

              <button
                type="submit"
                disabled={isSavingHero}
                className="px-5 py-2 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-bold shadow-md"
              >
                {isSavingHero ? 'Saving...' : 'Update Hero Video'}
              </button>
            </div>
          </form>

        </div>
      </div>

      {/* Student Video Testimonials Deck Manager */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Student Video Testimonials Reel</h2>
            <p className="text-xs text-slate-500">Vertical portrait student reviews shown in the 3D stack</p>
          </div>

          <button
            onClick={openCreateTestimonial}
            className="px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>Add Student Story</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden flex flex-col justify-between"
            >
              <div className="aspect-[4/5] bg-slate-900 relative overflow-hidden">
                <video
                  src={item.videoUrl}
                  poster={item.posterUrl}
                  controls
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 bg-slate-900/80 px-2 py-0.5 rounded-lg text-white font-bold text-[10px]">
                  {item.name}
                </div>
              </div>

              <div className="p-4 space-y-2">
                <p className="text-[11px] font-bold text-pink-600">{item.university}</p>
                <p className="text-xs text-slate-600 line-clamp-2 italic">“{item.text}”</p>
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(item.rating || 5)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-current" />
                  ))}
                </div>
              </div>

              <div className="p-4 pt-0 flex justify-end gap-2 border-t border-slate-100 mt-2">
                <button
                  onClick={() => openEditTestimonial(item)}
                  className="p-1.5 rounded-lg bg-slate-100 text-slate-700 hover:text-pink-600"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteTestimonial(item._id)}
                  className="p-1.5 rounded-lg bg-slate-100 text-slate-700 hover:text-rose-600"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Testimonial Modal */}
      {testModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 relative shadow-2xl border border-slate-200">
            <button
              onClick={() => setTestModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-black text-slate-900">
              {editingTest ? 'Edit Student Testimonial' : 'Add Portrait Video Story'}
            </h3>

            <form onSubmit={handleTestimonialSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Student Name *</label>
                  <input
                    type="text"
                    required
                    value={testName}
                    onChange={(e) => setTestName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">University / Course *</label>
                  <input
                    type="text"
                    required
                    value={testUniversity}
                    onChange={(e) => setTestUniversity(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Portrait Video URL (MP4) *</label>
                <input
                  type="url"
                  required
                  value={testVideoUrl}
                  onChange={(e) => setTestVideoUrl(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Poster Image URL (Optional)</label>
                <input
                  type="url"
                  value={testPosterUrl}
                  onChange={(e) => setTestPosterUrl(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Review Quote</label>
                <textarea
                  rows={2}
                  value={testText}
                  onChange={(e) => setTestText(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setTestModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-pink-600 text-white font-bold"
                >
                  Save Story
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
