import Link from 'next/link';

export const metadata = {
  title: 'About — The Story Behind The Worst Said',
  description: 'The Worst Said is an anonymous platform — a curated digital sanctuary for the worst things ever said to us. Learn about the psychology of anonymous catharsis.',
  keywords: ['about the worst said', 'anonymous sharing platform', 'psychology of anonymous sharing', 'healing through words'],
  alternates: { canonical: 'https://theworstsaid.com/about' },
  openGraph: {
    title: 'About — The Story Behind The Worst Said',
    description: 'A curated archive of the worst things ever said. A digital sanctuary for catharsis, introspection, and the permanent residue of words.',
  },
};

export default function AboutPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: 'About The Worst Said',
    description: 'The Worst Said is an anonymous platform — a curated archive of the worst things ever said to us.',
    mainEntity: {
      '@type': 'Organization',
      name: 'The Worst Said',
      url: 'https://theworstsaid.com',
    },
  };

  return (
    <div className="info-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <p className="heading-sm animate-fade-in">About</p>
      <h1 style={{ marginTop: '12px' }} className="animate-fade-in-slow stagger-1">The Worst Said</h1>
      <p className="subtitle animate-fade-in-up stagger-2">A curated archive of the words that stayed with us.</p>

      <div className="prose animate-fade-in-up stagger-3">
        <p>Some words don&apos;t leave. They stay with us — replaying in quiet moments, reshaping how we see ourselves, lingering as the permanent residue of relationships that changed us forever. They were spoken to us by people we trusted, people we loved, or sometimes by strangers. Either way, they mattered more than anyone expected.</p>

        <h2>Why This Exists</h2>
        <p>In an era of digital fatigue and performative social media, genuine vulnerability has become rare. People carry the weight of <strong>hurtful words said during breakups</strong>, the trauma of <strong>verbal abuse in relationships</strong>, and the lingering sting of <strong>cruel things said by family members</strong> — all in silence.</p>
        <p>The Worst Said exists because those words deserve a place to live outside of us. This platform is built on the psychological principle known as the <strong>&quot;stranger on the train&quot; phenomenon</strong> — the idea that people feel more comfortable disclosing deeply intimate truths to unknown entities than to close friends or family.</p>
        <p>This is not a gossip site. This is not a place for drama. This is a space for the words that stayed.</p>

        <h2>The Need for Validation</h2>
        <p>Individuals subjected to cruel words often experience profound disorientation. Publishing the cruelties inflicted upon them in a curated space externalizes their pain. Reading similar stories from others fulfills a fundamental human need for peer empathy and social validation.</p>
        <p>When you see your own experience reflected in someone else&apos;s submission, the isolation breaks. You realise that the cruelty inflicted upon you was not unique, and therefore, neither is your pain.</p>

        <h2>How We Keep It Safe</h2>
        <p>Every single submission is <strong>manually reviewed</strong> before it appears on the site. We don&apos;t collect personal information. We don&apos;t require accounts. We don&apos;t use tracking cookies.</p>

        <h2>The Rules</h2>
        <ul>
          <li>Keep it under 50 words</li>
          <li>No names or identifying details</li>
          <li>Only share what was said to you</li>
          <li>Be honest</li>
        </ul>

        <div className="divider" />
        <div className="text-center">
          <h2 className="heading-md" style={{ marginBottom: '16px' }}>Ready to unburden?</h2>
          <p className="body-sm" style={{ marginBottom: '32px' }}>Your words are waiting to exist outside of you.</p>
          <Link href="/share" className="btn btn-primary">Share Your Words</Link>
        </div>
      </div>
    </div>
  );
}
