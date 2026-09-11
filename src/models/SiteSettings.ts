import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISiteSettings extends Document {
  pgName: string;
  tagline: string;
  description: string;
  whatsappNumber: string;
  contactPhone: string;
  contactEmail: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  nearbyColleges: Array<{
    name: string;
    distance: string;
    travelTime: string;
  }>;
  googleMapsEmbedUrl: string;
  googleMapsDirectionsUrl: string;
  heroVideoUrl: string;
  heroPosterUrl: string;
  heroHeading: string;
  heroSubheading: string;
  heroBadge: string;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string[];
  updatedAt: Date;
}

const SiteSettingsSchema = new Schema<ISiteSettings>(
  {
    pgName: { type: String, default: 'Sree Kunj Girls PG' },
    tagline: { type: String, default: 'Safe, Serene & Luxurious Accommodation for Women' },
    description: {
      type: String,
      default:
        'Sree Kunj Girls PG is a premier accommodation in Jaipur, strategically located near JECRC University and Poornima University. Fully furnished AC rooms, 4-tier security, hygienic meals, high-speed Wi-Fi 6, and a serene community.',
    },
    whatsappNumber: { type: String, default: '918957356189' },
    contactPhone: { type: String, default: '+91 89573 56189' },
    contactEmail: { type: String, default: 'admissions@sreekunjgirlspg.com' },
    address: {
      type: String,
      default: 'Plot 42, Institutional Corridor, Near JECRC University Gate, Sitapura Industrial Area, Jaipur, Rajasthan 302022',
    },
    city: { type: String, default: 'Jaipur' },
    state: { type: String, default: 'Rajasthan' },
    pincode: { type: String, default: '302022' },
    nearbyColleges: [
      {
        name: { type: String, required: true },
        distance: { type: String, required: true },
        travelTime: { type: String, required: true },
      },
    ],
    googleMapsEmbedUrl: {
      type: String,
      default:
        'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3561.427771746247!2d75.8761168!3d26.7945037!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396dc9bd0b3eb2b3%3A0x7d6fcf4a572c65a4!2sJECRC%20University!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin',
    },
    googleMapsDirectionsUrl: {
      type: String,
      default: 'https://maps.google.com/?q=JECRC+University+Jaipur',
    },
    heroVideoUrl: {
      type: String,
      default: 'https://assets.mixkit.co/videos/preview/mixkit-modern-apartment-living-room-with-a-view-41484-large.mp4',
    },
    heroPosterUrl: {
      type: String,
      default: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1920&q=80',
    },
    heroHeading: { type: String, default: 'Sree Kunj Girls PG' },
    heroSubheading: {
      type: String,
      default:
        'Experience modern comfort, 24/7 dedicated biometric security, chef-curated meals, and high-speed campus internet just 2 minutes from JECRC & Poornima University.',
    },
    heroBadge: { type: String, default: 'Girls PG in Jaipur • Near JECRC & Poornima' },
    seoTitle: {
      type: String,
      default: 'Sree Kunj Girls PG Jaipur | Luxury Girls PG Near JECRC & Poornima University',
    },
    seoDescription: {
      type: String,
      default:
        'Best Girls PG near JECRC University & Poornima University Jaipur. 4 floors of AC & Non-AC luxury rooms, 24/7 security, Wi-Fi 6, homely meals, and direct video visit booking.',
    },
    seoKeywords: [
      'Girls PG near JECRC',
      'Girls PG near JECRC University',
      'Girls PG near Poornima University',
      'Girls PG Jaipur',
      'Girls hostel near JECRC',
      'PG near JECRC Jaipur',
      'PG near Poornima University',
      'Female PG near JECRC',
      'Student accommodation near JECRC',
      'Girls accommodation near Poornima',
      'Girls PG near me in Jaipur',
    ],
  },
  { timestamps: true }
);

export const SiteSettings: Model<ISiteSettings> =
  mongoose.models.SiteSettings || mongoose.model<ISiteSettings>('SiteSettings', SiteSettingsSchema);
