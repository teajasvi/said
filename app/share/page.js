import SubmitForm from '@/components/forms/SubmitForm';

export const metadata = {
  title: 'Share Anonymously — Confess What Was Said',
  description: 'Anonymously share the worst thing ever said — whether you said something unforgivable during a fight or cruel words were spoken to you. No names, no accounts, complete anonymity. A safe space for catharsis.',
  keywords: ['anonymous confession', 'share anonymously', 'confess online', 'anonymous venting', 'safe space to confess', 'relationship confession'],
  alternates: { canonical: 'https://theworstsaid.com/share' },
  openGraph: {
    title: 'Share Anonymously — The Worst Said',
    description: 'Anonymously confess the worst thing ever said. No names, no accounts. A curated sanctuary for catharsis and release.',
  },
};

export default function SharePage() {
  return (
    <section className="section" style={{ paddingTop: '60px' }}>
      <div className="container" style={{ maxWidth: '520px' }}>
        <div className="section__header--center" style={{ marginBottom: '48px' }}>
          <h1 className="heading-lg animate-fade-in-up">What was said?</h1>
          <p className="section__subtitle animate-fade-in-up stagger-1" style={{ maxWidth: '360px' }}>
            Write it down. Let it go. No names, no accounts, just words.
          </p>
        </div>

        <div className="animate-fade-in-up stagger-2">
          <SubmitForm />
        </div>

        {/* Disclaimer for unsent memories */}
        <div className="animate-fade-in-up stagger-3" style={{ marginTop: '56px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ height: '1px', background: 'var(--border)', width: '40px', marginBottom: '24px' }} />
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: '16px', lineHeight: '1.6', maxWidth: '320px' }}>
            This space is exclusively for the worst things ever said. No off-topic entries.<br />
            For unsent memories and letters, please visit:
          </p>
          <a 
            href="https://www.ifonlyisentthis.com/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="btn btn-ghost"
            style={{ fontSize: '0.75rem', padding: '8px 16px', border: '1px solid var(--border)', borderRadius: '100px', letterSpacing: '0.04em' }}
          >
            ifonlyisentthis.com ↗
          </a>
        </div>
      </div>
    </section>
  );
}
