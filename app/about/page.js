import Link from 'next/link';

export const metadata = {
  title: 'About — The Story Behind The Worst Said',
  description: 'The Worst Said is a premium anonymous confessional platform — a curated digital sanctuary for the worst things ever said. Learn about the psychology of anonymous catharsis, the healing power of shared human experience, and why this archive exists.',
  keywords: ['about the worst said', 'anonymous confessional platform', 'psychology of anonymous confessions', 'healing through words', 'digital catharsis'],
  alternates: { canonical: 'https://theworstsaid.com/about' },
  openGraph: {
    title: 'About — The Story Behind The Worst Said',
    description: 'A premium anonymous confessional platform curating the worst things ever said. A digital sanctuary for catharsis, introspection, and the permanent residue of words.',
  },
};

export default function AboutPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: 'About The Worst Said',
    description: 'The Worst Said is an anonymous confessional platform — a curated archive of the worst things ever said, designed as a digital sanctuary for catharsis and healing.',
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
      <h1 style={{ marginTop: '8px' }} className="animate-fade-in-up">The Worst Said</h1>
      <p className="subtitle animate-fade-in-up stagger-1">A curated archive of the words that stayed with us.</p>

      <div className="prose" style={{ maxWidth: '100%' }}>
        <p>Some words don&apos;t leave. They stay with us — replaying in quiet moments, reshaping how we see ourselves, lingering as the permanent residue of relationships that changed us forever. Sometimes we were the ones who spoke them. Sometimes they were spoken to us. Either way, they mattered more than we expected.</p>

        <h2>Why This Exists</h2>
        <p>In an era of digital fatigue and performative social media, genuine vulnerability has become rare. People carry the weight of <strong>hurtful words said during breakups</strong>, the guilt of <strong>saying something unforgivable during a fight</strong>, and the lingering trauma of <strong>verbal abuse in relationships</strong> — all in silence.</p>
        <p>The Worst Said exists because those words deserve a place to live outside of us. This platform is built on the psychological principle known as the <strong>&quot;stranger on the train&quot; phenomenon</strong> — the idea that people feel more comfortable disclosing deeply intimate truths to unknown entities than to close friends or family. By externalizing pain into written form, the intensity of the emotion diminishes, providing profound emotional release without interpersonal consequence.</p>
        <p>This is not a gossip site. This is not a place for drama. The Worst Said is a <strong>curated digital sanctuary</strong> — a space for introspection, catharsis, and the collective acknowledgment that everyone carries words.</p>

        <h2>The Dual Focus</h2>
        <p>Every confession on The Worst Said falls into one of two emotional pathways:</p>
        <ul>
          <li><strong>&quot;I said it&quot; — The Need for Catharsis and Absolution.</strong> Confessing to hurtful behavior is a mechanism for relieving guilt. Anonymous digital spaces allow what Freud termed the &quot;talking cure&quot; — converting negative affect into written cognition to reduce the intensity of the emotion.</li>
          <li><strong>&quot;It was said to me&quot; — The Need for Validation and Healing.</strong> Individuals subjected to cruel words often experience profound disorientation. Publishing the cruelties inflicted upon them in a beautifully curated, elevated space externalizes their pain. Reading similar stories from others fulfills a fundamental human need for peer empathy and social validation.</li>
        </ul>

        <h2>How We Keep It Safe</h2>
        <p>Every single submission is <strong>manually reviewed</strong> before it appears on the site. We don&apos;t collect personal information. We don&apos;t require accounts. We don&apos;t use tracking cookies. The goal is a space that feels safe enough to be truly honest.</p>
        <p>Our platform architecture is specifically designed to filter out sadism and invite genuine self-expression — through aesthetic restraint, thoughtful curation, and a commitment to treating every submission as a valid piece of human experience.</p>

        <h2>The Rules Are Simple</h2>
        <ul>
          <li>Keep it under 50 words</li>
          <li>No names or identifying details</li>
          <li>Tag it — &quot;I said it&quot; or &quot;It was said to me&quot;</li>
          <li>Be honest</li>
        </ul>

        <div className="divider" />
        <div className="text-center">
          <h2 className="heading-md" style={{ marginBottom: '12px' }}>Ready to unburden?</h2>
          <p className="body-lg" style={{ marginBottom: '24px' }}>Your words are waiting to exist outside of you.</p>
          <Link href="/share" className="btn btn-primary">Share Your Words</Link>
        </div>
      </div>
    </div>
  );
}
