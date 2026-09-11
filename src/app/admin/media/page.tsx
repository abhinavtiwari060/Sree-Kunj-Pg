'use client';

import React, { useEffect, useState } from 'react';
import {
  Clapperboard,
  Video,
  Plus,
  Trash2,
  Edit2,
  Play,
  UploadCloud,
  CheckCircle2,
  Star,
  X,
  Save,
  Image as ImageIcon,
  Film,
  Sparkles,
} from 'lucide-react';
import { MediaUploader } from '@/components/admin/MediaUploader';

export default function AdminMediaPage() {
  const [settings, setSettings] = useState<any>(null);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Hero form state
  const [heroVideoUrl, setHeroVideoUrl] = useState('');
  const [heroPosterUrl, setHeroPosterUrl] = useState('');
  const [isSavingHero, setIsSavingHero] = useState(false);
  const [heroSaveSuccess, setHeroSaveSuccess] = useState(false);

  // Testimonial modal state
  const [testModalOpen, setTestModalOpen] = useState(false);
  const [editingTest, setEditingTest] = useState<any>(null);
  const [testName, setTestName] = useState('');
  const [testUniversity, setTestUniversity] = useState('JECRC University');
  const [testVideoUrl, setTestVideoUrl] = useState('');
  const [testPosterUrl, setTestPosterUrl] = useState('');
  const [testText, setTestText] = useState('');
  const [testRating, setTestRating] = useState(5);
  const [isSavingTest, setIsSavingTest] = useState(false);

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

  const handleSaveHero = async (overrideVideo?: string, overridePoster?: string) => {
    setIsSavingHero(true);
    setHeroSaveSuccess(false);
    try {
      const videoToSave = overrideVideo !== undefined ? overrideVideo : heroVideoUrl;
      const posterToSave = overridePoster !== undefined ? overridePoster : heroPosterUrl;

      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          heroVideoUrl: videoToSave.trim(),
          heroPosterUrl: posterToSave.trim(),
        }),
      });
      if (res.ok) {
        setHeroSaveSuccess(true);
        setTimeout(() => setHeroSaveSuccess(false), 3500);
      } else {
        const err = await res.json();
        alert('Failed to save Hero Media to database: ' + (err.error || 'Server error'));
      }
    } catch (e: any) {
      console.error('Error saving hero media:', e);
      alert('Error saving hero media: ' + e.message);
    } finally {
      setIsSavingHero(false);
    }
  };

  const handleHeroVideoUploaded = async (downloadUrl: string) => {
    setHeroVideoUrl(downloadUrl);
    await handleSaveHero(downloadUrl, undefined);
  };

  const handleHeroCoverUploaded = async (downloadUrl: string) => {
    setHeroPosterUrl(downloadUrl);
    await handleSaveHero(undefined, downloadUrl);
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
    if (!testVideoUrl) {
      alert('Please upload or provide a video URL for the testimonial.');
      return;
    }

    setIsSavingTest(true);
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
    } catch (e: any) {
      console.error('Error saving testimonial:', e);
      alert('Error saving testimonial: ' + e.message);
    } finally {
      setIsSavingTest(false);
    }
  };

  const handleDeleteTestimonial = async (id: string) => {
    if (!confirm('Are you sure you want to remove this student testimonial?')) return;
    try {
      await fetch(`/api/testimonials/${id}`, { method: 'DELETE' });
      setTestimonials((prev) => prev.filter((t) => t._id !== id));
    } catch (e) {
      console.error('Delete error:', e);
    }
  };

  return (
    <div className="space-y-10">
      
      {/* Page Title & Status */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Hero Media & Video Testimonials
          </h1>
          <p className="text-xs text-slate-500">
            Control the dynamic hero background video, poster cover image, and vertical student video reels with real-time ImageKit CDN upload tracking.
          </p>
        </div>

        {heroSaveSuccess && (
          <div className="px-4 py-2 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-xs animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>MongoDB Database Synchronized!</span>
          </div>
        )}
      </div>

      {/* SECTION 1: HERO MEDIA (Video + Cover Image) */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 text-pink-600 font-bold text-xs uppercase tracking-wider">
          <Clapperboard className="w-4 h-4" />
          <span>Hero Media Configuration</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* 1. Hero Video Uploader */}
          <MediaUploader
            mediaType="video"
            label="Hero Background Video"
            sublabel="MP4 or WebM video displayed in the hero section background. Maximum recommended size: 100 MB."
            storageFolder="hero/video"
            currentUrl={heroVideoUrl}
            maxSizeBytes={100 * 1024 * 1024}
            aspectRatio="video"
            placeholderText="Upload or preview active Hero Video (MP4/WebM)"
            onUploadSuccess={handleHeroVideoUploaded}
            onDelete={() => {
              setHeroVideoUrl('');
              handleSaveHero('', undefined);
            }}
          />

          {/* 2. Hero Cover Image Uploader */}
          <MediaUploader
            mediaType="image"
            label="Hero Cover / Poster Image"
            sublabel="Lightweight JPG/WebP image displayed immediately on page load before the video streams. Prevents blank/black screen."
            storageFolder="hero/cover"
            currentUrl={heroPosterUrl}
            maxSizeBytes={10 * 1024 * 1024}
            aspectRatio="video"
            placeholderText="Upload or preview Hero Poster / Cover Image (JPG/PNG/WebP)"
            onUploadSuccess={handleHeroCoverUploaded}
            onDelete={() => {
              setHeroPosterUrl('');
              handleSaveHero(undefined, '');
            }}
          />

        </div>

        {/* Manual URL Overrides & Quick Database Save */}
        <div className="bg-white rounded-2xl border border-pink-200 p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold text-slate-900">Direct Media URLs & Fallbacks</h3>
              <p className="text-[11px] text-slate-500">ImageKit CDN URLs are automatically populated on upload. You can also manually paste existing URLs.</p>
            </div>

            <button
              type="button"
              onClick={() => handleSaveHero()}
              disabled={isSavingHero}
              className="px-5 py-2 rounded-xl bg-pink-600 hover:bg-pink-700 text-white text-xs font-bold shadow-md shadow-pink-600/20 transition-all flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSavingHero ? 'Saving to Database...' : 'Save Media Settings'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Active Hero Video URL
              </label>
              <input
                type="url"
                value={heroVideoUrl}
                onChange={(e) => setHeroVideoUrl(e.target.value)}
                placeholder="https://..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Active Hero Poster / Cover Image URL
              </label>
              <input
                type="url"
                value={heroPosterUrl}
                onChange={(e) => setHeroPosterUrl(e.target.value)}
                placeholder="https://..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono"
              />
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: STUDENT VIDEO TESTIMONIALS DECK */}
      <div className="space-y-6 pt-4 border-t border-slate-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Student Video Testimonials Reel</h2>
            <p className="text-xs text-slate-500">Vertical portrait student reviews shown in the 3D stack on the homepage</p>
          </div>

          <button
            onClick={openCreateTestimonial}
            className="px-4 py-2.5 bg-pink-600 hover:bg-pink-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-pink-600/20"
          >
            <Plus className="w-4 h-4" />
            <span>Add Student Story</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-2xl border border-pink-200 shadow-xs overflow-hidden flex flex-col justify-between"
            >
              <div className="aspect-[4/5] bg-slate-900 relative overflow-hidden group">
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
                  title="Edit Story"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteTestimonial(item._id)}
                  className="p-1.5 rounded-lg bg-slate-100 text-slate-700 hover:text-rose-600"
                  title="Delete Story"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Testimonial Creation / Edit Modal with Progress Uploader */}
      {testModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-5 relative shadow-2xl border border-slate-200 my-auto max-h-[92vh] overflow-y-auto">
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

              {/* Portrait Video Upload Component */}
              <div>
                <MediaUploader
                  mediaType="video"
                  label="Portrait Video (9:16 vertical)"
                  sublabel="Upload MP4 vertical reel to ImageKit CDN"
                  storageFolder="testimonials"
                  currentUrl={testVideoUrl}
                  maxSizeBytes={50 * 1024 * 1024}
                  aspectRatio="portrait"
                  placeholderText="Upload Portrait Video"
                  onUploadSuccess={(url) => setTestVideoUrl(url)}
                  onDelete={() => setTestVideoUrl('')}
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Portrait Video URL (Direct / Fallback)</label>
                <input
                  type="url"
                  required
                  value={testVideoUrl}
                  onChange={(e) => setTestVideoUrl(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-mono"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Poster Image URL (Optional)</label>
                <input
                  type="url"
                  value={testPosterUrl}
                  onChange={(e) => setTestPosterUrl(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-mono"
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
                  disabled={isSavingTest}
                  className="px-5 py-2 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-bold shadow-md"
                >
                  {isSavingTest ? 'Saving Story...' : 'Save Story'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
