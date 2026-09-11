'use client';

import React, { useEffect, useState } from 'react';
import { Settings, Save, CheckCircle2, Phone, Mail, MapPin, Globe, Sparkles } from 'lucide-react';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<any>({
    pgName: '',
    tagline: '',
    description: '',
    whatsappNumber: '',
    contactPhone: '',
    contactEmail: '',
    address: '',
    googleMapsEmbedUrl: '',
    googleMapsDirectionsUrl: '',
    heroHeading: '',
    heroSubheading: '',
    heroBadge: '',
    seoTitle: '',
    seoDescription: '',
    seoKeywords: [],
  });
  const [keywordsStr, setKeywordsStr] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch('/api/settings');
        const data = await res.json();
        if (data.settings) {
          setSettings(data.settings);
          setKeywordsStr(
            Array.isArray(data.settings.seoKeywords)
              ? data.settings.seoKeywords.join(', ')
              : ''
          );
        }
      } catch (e) {
        console.error('Error fetching settings:', e);
      } finally {
        setLoading(false);
      }
    }

    loadSettings();
  }, []);

  const handleChange = (field: string, value: any) => {
    setSettings((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);

    const seoKeywords = keywordsStr
      .split(',')
      .map((k) => k.trim())
      .filter(Boolean);

    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...settings, seoKeywords }),
      });

      if (res.ok) {
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 4000);
      }
    } catch (e) {
      console.error('Save settings error:', e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            PG Branding, Contact & SEO Settings
          </h1>
          <p className="text-xs text-slate-500">
            Configure contact info, WhatsApp dispatch number, address, and Google SEO tags.
          </p>
        </div>

        {savedSuccess && (
          <div className="px-4 py-2 bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Settings Saved Live!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 text-xs">
        
        {/* Section 1: Branding & Description */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
          <div className="flex items-center gap-2 text-pink-600 font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>Brand Identity</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-slate-700 block mb-1">PG Name (Brand Text) *</label>
              <input
                type="text"
                required
                value={settings.pgName}
                onChange={(e) => handleChange('pgName', e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Hero Pill Badge</label>
              <input
                type="text"
                value={settings.heroBadge}
                onChange={(e) => handleChange('heroBadge', e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Hero Subheading</label>
            <textarea
              rows={2}
              value={settings.heroSubheading}
              onChange={(e) => handleChange('heroSubheading', e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Detailed About Description</label>
            <textarea
              rows={3}
              value={settings.description}
              onChange={(e) => handleChange('description', e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
            />
          </div>
        </div>

        {/* Section 2: Contact & WhatsApp */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
          <div className="flex items-center gap-2 text-pink-600 font-bold uppercase tracking-wider">
            <Phone className="w-4 h-4" />
            <span>WhatsApp & Communication Numbers</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                WhatsApp Dispatch Number * (e.g. 919876543210)
              </label>
              <input
                type="text"
                required
                value={settings.whatsappNumber}
                onChange={(e) => handleChange('whatsappNumber', e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-pink-700 font-mono font-bold"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Direct country code + 10 digits without + sign
              </span>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Display Helpline Phone *</label>
              <input
                type="text"
                required
                value={settings.contactPhone}
                onChange={(e) => handleChange('contactPhone', e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Admissions Email *</label>
              <input
                type="email"
                required
                value={settings.contactEmail}
                onChange={(e) => handleChange('contactEmail', e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Location & Google Maps */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
          <div className="flex items-center gap-2 text-pink-600 font-bold uppercase tracking-wider">
            <MapPin className="w-4 h-4" />
            <span>Address & Google Maps Embed</span>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Full PG Address *</label>
            <input
              type="text"
              required
              value={settings.address}
              onChange={(e) => handleChange('address', e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Google Maps Embed URL</label>
              <input
                type="url"
                value={settings.googleMapsEmbedUrl}
                onChange={(e) => handleChange('googleMapsEmbedUrl', e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Google Maps Get Directions URL
              </label>
              <input
                type="url"
                value={settings.googleMapsDirectionsUrl}
                onChange={(e) => handleChange('googleMapsDirectionsUrl', e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
              />
            </div>
          </div>
        </div>

        {/* Section 4: SEO Metadata */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
          <div className="flex items-center gap-2 text-pink-600 font-bold uppercase tracking-wider">
            <Globe className="w-4 h-4" />
            <span>Search Engine Optimization (SEO)</span>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Meta Title Tag</label>
            <input
              type="text"
              value={settings.seoTitle}
              onChange={(e) => handleChange('seoTitle', e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Meta Description Tag</label>
            <textarea
              rows={2}
              value={settings.seoDescription}
              onChange={(e) => handleChange('seoDescription', e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">
              Target SEO Keywords (comma-separated)
            </label>
            <textarea
              rows={2}
              value={keywordsStr}
              onChange={(e) => setKeywordsStr(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
            />
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3 bg-pink-600 hover:bg-pink-700 text-white rounded-xl font-bold shadow-lg shadow-pink-600/30 flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving Changes...' : 'Save Configuration'}</span>
          </button>
        </div>

      </form>
    </div>
  );
}
