import './globals.css';
import Script from 'next/script';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import AgeGate from '@/components/ui/AgeGate';

export const metadata = {
  metadataBase: new URL('https://theworstsaid.com'),
  title: {
    default: 'The Worst Said — A Curated Archive of Unspoken Truths',
    template: '%s | The Worst Said',
  },
  description: 'Explore a curated archive of anonymous confessions — the worst things ever said and the words that stayed. A premium sanctuary for catharsis, healing, and the permanent residue of the human condition.',
  keywords: [
    'anonymous confessions',
    'worst things said in relationships',
    'hurtful words in a relationship',
    'relationship regrets',
    'verbal abuse in relationships',
    'breakup trauma',
    'unsaid words',
    'anonymous venting',
    'confessional platform',
    'healing from hurtful words',
    'things people say during breakups',
    'toxic relationship confessions',
    'emotional abuse confessions',
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
    description: 'A premium anonymous sanctuary for the worst things ever said. Explore confessions of guilt, regret, and the words that altered lives forever.',
    images: [{ url: '/opengraph-image.png', width: 512, height: 512, alt: 'The Worst Said' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The Worst Said — A Curated Archive of Unspoken Truths',
    description: 'A premium anonymous sanctuary for the worst things ever said. Explore confessions of guilt, regret, and the words that stayed.',
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
  themeColor: '#F7F5F2',
};

export default function RootLayout({ children }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'The Worst Said',
    url: 'https://theworstsaid.com',
    description: 'A curated archive of anonymous confessions — the worst things ever said, the words that stayed, and the truths we carry. A premium sanctuary for catharsis and healing.',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://theworstsaid.com/wall?q={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
    publisher: {
      '@type': 'Organization',
      name: 'The Worst Said',
      url: 'https://theworstsaid.com',
      description: 'An anonymous confessional platform curating the worst things ever said — a digital sanctuary for catharsis, reflection, and collective healing.',
    },
  };

  const organizationLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'The Worst Said',
    url: 'https://theworstsaid.com',
    description: 'A premium anonymous confessional platform exploring the permanent residue of words — the cruelties inflicted and the guilt carried.',
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
        <Script
          src="https://pl29322190.profitablecpmratenetwork.com/92/de/1c/92de1ceeb387546e7f3c26bd5ecff785.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
