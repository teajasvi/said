import SubmitForm from '@/components/forms/SubmitForm';

export const metadata = {
  title: 'Share Anonymously — What Was Said To You',
  description: 'Anonymously share the worst thing ever said to you — the words that cut, the ones that stayed, the ones you carry. No names, no accounts, complete anonymity.',
  keywords: ['share anonymously', 'anonymous venting', 'safe space', 'anonymous sharing'],
  alternates: { canonical: 'https://theworstsaid.com/share' },
  openGraph: {
    title: 'Share Anonymously — The Worst Said',
    description: 'Anonymously share the worst thing ever said to you. No names, no accounts. A curated sanctuary for catharsis and release.',
  },
};

export default function SharePage() {
  return (
    <section className="section" style={{ paddingTop: '80px' }}>
      <div className="container" style={{ maxWidth: '480px' }}>
        <div style={{ marginBottom: '56px', textAlign: 'center' }}>
          <p className="heading-sm animate-fade-in" style={{ marginBottom: '20px' }}>Share</p>
          <h1 className="heading-lg animate-fade-in-slow stagger-1">What was said<br />to you?</h1>
          <p className="section__subtitle animate-fade-in-up stagger-2" style={{ maxWidth: '320px' }}>
            Write it down. Let it exist somewhere outside of you.
          </p>
        </div>

        <div className="animate-fade-in-up stagger-3">
          <SubmitForm />
        </div>

        {/* Cross-promotion */}
        <div className="animate-fade-in stagger-4" style={{ marginTop: '80px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ height: '1px', background: 'var(--border)', width: '40px', marginBottom: '32px' }} />
          <p style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginBottom: '16px', lineHeight: '1.7', maxWidth: '300px' }}>
            This space is for the worst things said to you.<br />
            For unsent letters and memories:
          </p>
          <a
            href="https://www.ifonlyisentthis.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ghost"
            style={{ fontSize: '0.6875rem', padding: '8px 16px', border: '1px solid var(--text-ghost)', borderRadius: '100px' }}
          >
            ifonlyisentthis.com ↗
          </a>
        </div>
      </div>
    </section>
  );
}
