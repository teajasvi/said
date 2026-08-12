import './globals.css';

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import AgeGate from '@/components/ui/AgeGate';

export const metadata = {
  metadataBase: new URL('https://theworstsaid.com'),
  title: {
    default: 'The Worst Said — A Curated Archive of Unspoken Truths',
    template: '%s | The Worst Said',
  },
  description: 'Explore a curated archive of the worst things ever said to us — the words that cut, the ones that stayed, and the ones we still carry. A sanctuary for catharsis, healing, and release.',
  keywords: [
    'anonymous submissions',
    'worst things said in relationships',
    'hurtful words in a relationship',
    'relationship regrets',
    'verbal abuse in relationships',
    'breakup trauma',
    'unsaid words',
    'anonymous venting',
    'anonymous sharing platform',
    'healing from hurtful words',
    'things people say during breakups',
    'toxic relationship stories',
    'emotional abuse experiences',
    'words that hurt',
    'relationship closure',
    'micro-hurts in relationships',
    'ghostlighting',
    'post-breakup grief',
    'anonymous sharing platform',
  ],
  authors: [{ name: 'The Worst Said' }],
  creator: 'The Worst Said',
  publisher: 'The Worst Said',
  category: 'Mental Health & Relationships',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://theworstsaid.com',
    siteName: 'The Worst Said',
    title: 'The Worst Said — A Curated Archive of Unspoken Truths',
    description: 'An anonymous sanctuary for the worst things ever said to us. The words that cut, the regret that stayed, and the truths we still carry.',
    images: [{ url: '/opengraph-image.png', width: 512, height: 512, alt: 'The Worst Said' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The Worst Said — A Curated Archive of Unspoken Truths',
    description: 'An anonymous sanctuary for the worst things ever said to us. The words that cut, the ones that stayed.',
    creator: '@theworstsaid',
    images: ['/opengraph-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-video-preview': -1, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
  alternates: { canonical: 'https://theworstsaid.com' },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#131211',
};

export default function RootLayout({ children }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'The Worst Said',
    url: 'https://theworstsaid.com',
    description: 'A curated archive of the worst things ever said to us — the words that stayed, and the truths we carry. A sanctuary for catharsis and healing.',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://theworstsaid.com/wall?q={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
    publisher: {
      '@type': 'Organization',
      name: 'The Worst Said',
      url: 'https://theworstsaid.com',
      description: 'An anonymous platform archiving the worst things ever said to us — a digital sanctuary for catharsis, reflection, and collective healing.',
    },
  };

  const organizationLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'The Worst Said',
    url: 'https://theworstsaid.com',
    description: 'An anonymous platform exploring the permanent residue of words — the cruelties said to us and the weight they carry.',
    sameAs: [],
  };

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd) }}
        />
      </head>
      <body>
        <script dangerouslySetInnerHTML={{ __html: `
          document.addEventListener('contextmenu', e => e.preventDefault());
          document.addEventListener('keydown', e => {
            if ((e.ctrlKey || e.metaKey) && ['c','u','s','a','p'].includes(e.key.toLowerCase())) e.preventDefault();
            if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && ['i','j','c'].includes(e.key.toLowerCase()))) e.preventDefault();
          });
          document.addEventListener('dragstart', e => e.preventDefault());
        `}} />
        <AgeGate />
        <Header />
        <main className="page-wrapper" id="main-content">
          {children}
        </main>
        <Footer />

      </body>
    </html>
  );
}
