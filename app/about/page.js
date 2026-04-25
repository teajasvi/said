export const metadata = {
  title: 'About',
  description: 'The Worst Said is a space for words that stayed — an anonymous platform for the things we said and the things said to us.',
  alternates: { canonical: 'https://theworstsaid.com/about' },
};

export default function AboutPage() {
  return (
    <div className="info-page">
      <p className="heading-sm animate-fade-in">About</p>
      <h1 style={{ marginTop: '8px' }} className="animate-fade-in-up">The Worst Said</h1>
      <p className="subtitle animate-fade-in-up stagger-1">A space for the words that stayed with us.</p>

      <div className="prose" style={{ maxWidth: '100%' }}>
        <p>Some words don&apos;t leave. They stay with us — replaying, reshaping, reminding. Sometimes we were the ones who spoke them. Sometimes they were spoken to us. Either way, they mattered.</p>
        <p>The Worst Said is an anonymous platform where people share the worst things ever said — no names, no context, just the raw weight of words. It&apos;s not about blame. It&apos;s about acknowledgment.</p>

        <h2>Why This Exists</h2>
        <p>Words carry more weight than we often realize. A single sentence can change a relationship, alter someone&apos;s self-image, or stay lodged in memory for decades. This project exists because those words deserve a place to live outside of us.</p>

        <h2>How We Keep It Safe</h2>
        <p>Every submission is manually reviewed before it appears on the site. We don&apos;t collect personal information. We don&apos;t require accounts. The goal is a space that feels safe enough to be honest.</p>

        <h2>The Rules Are Simple</h2>
        <ul>
          <li>Keep it under 50 words</li>
          <li>No names or identifying details</li>
          <li>Tag it — &quot;I said it&quot; or &quot;It was said to me&quot;</li>
          <li>Be honest</li>
        </ul>
      </div>
    </div>
  );
}
