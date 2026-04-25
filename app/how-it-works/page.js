import Link from 'next/link';

export const metadata = {
  title: 'How It Works — Submit Your Anonymous Confession',
  description: 'Learn how to share your anonymous confession on The Worst Said. Five simple steps to submit the worst thing ever said — complete anonymity, manual curation, and a safe space for catharsis.',
  keywords: ['how to confess anonymously', 'anonymous submission', 'confessional platform', 'how the worst said works'],
  alternates: { canonical: 'https://theworstsaid.com/how-it-works' },
};

export default function HowItWorksPage() {
  const steps = [
    { title: 'Write your words', desc: 'Share the worst thing that was said — either something you said or something said to you. Keep it under 50 words.' },
    { title: 'Choose a tag', desc: 'Select "I said it" if you spoke the words, or "It was said to me" if you received them.' },
    { title: 'Submit anonymously', desc: 'No account needed. No name, no email. Your submission is completely anonymous.' },
    { title: 'We review it', desc: 'Every submission is manually reviewed before it appears on the site to maintain a safe and respectful space.' },
    { title: 'It appears on The Wall', desc: 'Once approved, your words join the wall — a collective space of shared human experiences.' },
  ];

  return (
    <div className="info-page">
      <p className="heading-sm animate-fade-in">Guide</p>
      <h1 style={{ marginTop: '8px' }} className="animate-fade-in-up">How It Works</h1>
      <p className="subtitle animate-fade-in-up stagger-1">Five simple steps. Complete anonymity. Real words.</p>

      <div>
        {steps.map((step, i) => (
          <div key={i} className={`info-step animate-fade-in-up stagger-${i + 1}`}>
            <div className="info-step__number">{i + 1}</div>
            <div className="info-step__content">
              <h3>{step.title}</h3>
              <p>{step.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="divider" />

      <div className="text-center">
        <h2 className="heading-md" style={{ marginBottom: '12px' }}>Ready?</h2>
        <p className="body-lg" style={{ marginBottom: '24px' }}>Your words are waiting to be shared.</p>
        <Link href="/share" className="btn btn-primary">Share Yours</Link>
      </div>
    </div>
  );
}
