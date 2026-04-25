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
    <section className="section" style={{ paddingTop: '40px' }}>
      <div className="container" style={{ maxWidth: '560px' }}>
        <div className="section__header section__header--center">
          <p className="heading-sm">Contribute</p>
          <h1 className="heading-lg" style={{ marginTop: '8px' }}>Share Your Words</h1>
          <p className="body-lg" style={{ marginTop: '8px' }}>
            Write what was said. Choose who said it. That&apos;s all.
          </p>
        </div>

        <div style={{ background: 'var(--bg-surface)', padding: '32px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
          <SubmitForm />
        </div>
      </div>
    </section>
  );
}
