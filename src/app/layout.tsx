import type { Metadata, Viewport } from 'next';
import { Outfit } from 'next/font/google';
import './globals.css';

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  display: 'swap',
  variable: '--font-outfit',
});

export const metadata: Metadata = {
  title: 'Sree Kunj Girls PG Jaipur | Premium Accommodation Near JECRC & Poornima University',
  description:
    'Sree Kunj Girls PG in Sitapura, Jaipur. 4 floors of AC & Non-AC luxury rooms near JECRC & Poornima University. 24/7 female security, Wi-Fi 6, chef meals & video visit booking.',
  keywords: [
    'Sree Kunj Girls PG',
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
    'Sitapura Girls PG',
  ],
  authors: [{ name: 'Sree Kunj Girls PG' }],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://sreekunjgirlspg.com',
    title: 'Sree Kunj Girls PG Jaipur | Near JECRC & Poornima University',
    description:
      'Premier 4-floor student residence for girls in Sitapura, Jaipur. 24/7 biometric security, AC rooms, high-speed Wi-Fi 6, and organic vegetarian dining.',
    siteName: 'Sree Kunj Girls PG',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1200&q=80',
        width: 1200,
        height: 630,
        alt: 'Sree Kunj Girls PG Jaipur',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sree Kunj Girls PG Jaipur | Near JECRC & Poornima',
    description: 'Safe, Serene & Luxurious Accommodation for Women in Jaipur.',
    images: ['https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1200&q=80'],
  },
};

export const viewport: Viewport = {
  themeColor: '#FFF5F7',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`scroll-smooth ${outfit.variable}`}>
      <head>
        {/* JSON-LD Structured Data Schema for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': ['LodgingBusiness', 'LocalBusiness'],
              name: 'Sree Kunj Girls PG',
              image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1200&q=80',
              telephone: '+91 89573 56189',
              email: 'admissions@sreekunjgirlspg.com',
              address: {
                '@type': 'PostalAddress',
                streetAddress: 'Plot 42, Institutional Corridor, Sitapura Industrial Area',
                addressLocality: 'Jaipur',
                addressRegion: 'Rajasthan',
                postalCode: '302022',
                addressCountry: 'IN',
              },
              geo: {
                '@type': 'GeoCoordinates',
                latitude: 26.7945037,
                longitude: 75.8761168,
              },
              url: 'https://sreekunjgirlspg.com',
              priceRange: '₹7,000 - ₹15,500',
              amenityFeature: [
                { '@type': 'LocationFeatureSpecification', name: '24/7 Biometric Security', value: true },
                { '@type': 'LocationFeatureSpecification', name: 'Air Conditioning', value: true },
                { '@type': 'LocationFeatureSpecification', name: 'Wi-Fi 6 Internet', value: true },
                { '@type': 'LocationFeatureSpecification', name: 'Hygienic 4 Meals Daily', value: true },
                { '@type': 'LocationFeatureSpecification', name: '4-Floor Residential Layout', value: true },
              ],
            }),
          }}
        />
      </head>
      <body className="antialiased selection:bg-pink-600 selection:text-white font-sans text-slate-900 bg-[#FFF5F7]">
        {children}
      </body>
    </html>
  );
}
