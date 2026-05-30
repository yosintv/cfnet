import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'CricFoot - Football Live on TV | Live TV Channels',
  description:
    'CricFoot is your ultimate TV guide for live football matches worldwide. Find comprehensive schedules, match fixtures, and channel listings for Premier League, UEFA Champions League, La Liga, Serie A, Bundesliga and more.',
  keywords:
    'live football tv guide, soccer live stream, football tv channels, premier league live tv, champions league tv schedule, la liga live stream, serie a tv channels, bundesliga tv guide, cricfoot',
  authors: [{ name: 'CricFoot' }],
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.cricfoot.net'),
  openGraph: {
    type: 'website',
    siteName: 'CricFoot',
    title: 'CricFoot - Football Live on TV | Live TV Channels',
    description:
      'Find live football TV schedules, match fixtures and channel listings for all major leagues worldwide.',
    images: [{ url: '/og-image.png' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CricFoot - Football Live on TV | Live TV Channels',
    description: 'Live football TV schedules, channel listings and match fixtures for all major leagues worldwide.',
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'CricFoot',
    url: 'https://www.cricfoot.net/',
    description:
      'CricFoot is your ultimate TV guide for live football matches worldwide with comprehensive schedules, match fixtures and channel listings.',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://www.cricfoot.net/?q={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#0f172a" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <Navbar />
        <div className="container">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
