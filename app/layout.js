import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export const metadata = {
  metadataBase: new URL('https://theworstsaid.com'),
  title: {
    default: 'The Worst Said — Words That Stayed With Us',
    template: '%s | The Worst Said',
  },
  description: 'An anonymous space for the worst things ever said — the words we spoke and the ones we carry. Share your story.',
  keywords: ['worst things said', 'anonymous confessions', 'hurtful words', 'things people say', 'unsaid words', 'confessional', 'anonymous sharing'],
  authors: [{ name: 'The Worst Said' }],
  creator: 'The Worst Said',
  publisher: 'The Worst Said',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://theworstsaid.com',
    siteName: 'The Worst Said',
    title: 'The Worst Said — Words That Stayed With Us',
    description: 'An anonymous space for the worst things ever said — the words we spoke and the ones we carry.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The Worst Said — Words That Stayed With Us',
    description: 'An anonymous space for the worst things ever said.',
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
    description: 'An anonymous space for the worst things ever said — the words we spoke and the ones we carry.',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://theworstsaid.com/wall?q={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
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
      </head>
      <body>
        <Header />
        <main className="page-wrapper" id="main-content">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
