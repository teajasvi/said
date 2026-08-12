import Link from 'next/link';

export const metadata = {
  title: 'How It Works — Share Anonymously',
  description: 'Learn how to share the worst thing said to you on The Worst Said. Four simple steps. Complete anonymity. A safe space for release.',
  keywords: ['how to share anonymously', 'anonymous submission', 'anonymous sharing platform'],
  alternates: { canonical: 'https://theworstsaid.com/how-it-works' },
};

export default function HowItWorksPage() {
  const steps = [
    { title: 'Write your words', desc: 'Share the worst thing that was said to you — the words that stayed, the ones that cut. Keep it under 50 words.' },
    { title: 'Submit anonymously', desc: 'No account needed. No name, no email. Your submission is completely anonymous.' },
    { title: 'We review it', desc: 'Every submission is manually reviewed to maintain a safe, respectful space.' },
    { title: 'It joins The Wall', desc: 'Once approved, your words join the wall — a collective archive of shared human experience.' },
  ];

  return (
    <div className="info-page">
      <p className="heading-sm animate-fade-in">Guide</p>
      <h1 style={{ marginTop: '12px' }} className="animate-fade-in-slow stagger-1">How It Works</h1>
      <p className="subtitle animate-fade-in-up stagger-2">Four steps. Complete anonymity.</p>

      <div>
        {steps.map((step, i) => (
          <div key={i} className={`info-step animate-fade-in-up stagger-${i + 2}`}>
            <div className="info-step__number">{i + 1}</div>
            <div className="info-step__content">
              <h3>{step.title}</h3>
              <p>{step.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="divider" />

      <div className="text-center animate-fade-in-up stagger-6">
        <h2 className="heading-md" style={{ marginBottom: '16px' }}>Ready?</h2>
        <p className="body-sm" style={{ marginBottom: '32px' }}>Your words are waiting to be shared.</p>
        <Link href="/share" className="btn btn-primary">Share Yours</Link>
      </div>
    </div>
  );
}
