import Link from 'next/link';
import SubmissionCard from '@/components/cards/SubmissionCard';
import { fetchApprovedSubmissions } from '@/lib/data';

export const revalidate = 60;

export default async function HomePage() {
  const { submissions } = await fetchApprovedSubmissions({ limit: 6 });
  const mobileSubmissions = submissions.slice(0, 3);

  return (
    <>
      {/* Hero Section */}
      <section className="section--hero">
        <div className="container">
          <p className="heading-sm animate-fade-in" style={{ marginBottom: '16px' }}>The Worst Said</p>
          <h1 className="heading-xl animate-fade-in-up">
            Words that stayed<br />with us.
          </h1>
          <p className="section__subtitle animate-fade-in-up stagger-2">
            A curated sanctuary for the worst things ever said — the words we spoke and the ones we carry. No names. No judgement. Just the permanent residue of truth.
          </p>
          <div className="animate-fade-in-up stagger-3" style={{ marginTop: '32px', display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/share" className="btn btn-primary">Share Your Words</Link>
            <Link href="/wall" className="btn btn-secondary">Explore The Wall</Link>
          </div>
        </div>
      </section>

      {/* Recent Submissions */}
      <section className="section">
        <div className="container">
          <div className="section__header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <p className="heading-sm">Recent</p>
              <h2 className="heading-lg" style={{ marginTop: '8px' }}>From The Wall</h2>
              <p className="body-sm" style={{ marginTop: '4px', color: 'var(--text-tertiary)' }}>Anonymous confessions of guilt, regret, and the words that altered everything.</p>
            </div>
            <Link href="/wall" className="btn btn-ghost" style={{ marginBottom: '4px' }}>
              View All →
            </Link>
          </div>

          {submissions.length > 0 ? (
            <>
              {/* Desktop: 6 cards */}
              <div className="desktop-only">
                <div className="card-grid-desktop">
                  {submissions.map((sub, i) => (
                    <SubmissionCard key={sub.id} id={sub.id} text={sub.text} tag={sub.tag} createdAt={sub.created_at} index={i} />
                  ))}
                </div>
              </div>

              {/* Mobile: 3 cards */}
              <div className="mobile-only">
                <div className="card-grid-mobile">
                  {mobileSubmissions.map((sub, i) => (
                    <SubmissionCard key={sub.id} id={sub.id} text={sub.text} tag={sub.tag} createdAt={sub.created_at} index={i} />
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="text-center" style={{ padding: '64px 0' }}>
              <p className="heading-md" style={{ marginBottom: '12px' }}>The wall is empty</p>
              <p className="body-lg" style={{ marginBottom: '24px' }}>Be the first to share what was said.</p>
              <Link href="/share" className="btn btn-primary">Share Yours</Link>
            </div>
          )}
        </div>
      </section>

      {/* Why Section — SEO-rich content block */}
      <section className="section" style={{ background: 'var(--bg-secondary)', padding: '80px 0' }}>
        <div className="container" style={{ maxWidth: '720px' }}>
          <div className="text-center" style={{ marginBottom: '40px' }}>
            <h2 className="heading-lg" style={{ marginBottom: '16px' }}>Everyone carries words.</h2>
            <p className="section__subtitle">
              Whether you said it or someone said it to you — you are not alone. This is a sanctuary for the words that altered everything.
            </p>
          </div>
          <div className="prose" style={{ maxWidth: '100%' }}>
            <p>Some words don&apos;t leave. They replay in quiet moments, reshape how we see ourselves, and linger as the permanent residue of relationships that changed us. Sometimes we were the ones who said something unforgivable during a fight. Sometimes cruel words were spoken to us — during a breakup, in a moment of anger, or in a relationship we trusted.</p>
            <p>The Worst Said is an anonymous confessional archive — a space where the worst things ever said can finally exist outside of us. No accounts. No names. No judgement. Just words, shared anonymously and curated with care. Whether you are processing the guilt of words you regret or healing from the cruelty someone inflicted upon you, this archive exists as a collective act of catharsis.</p>
            <p>Every confession is manually reviewed before appearing on The Wall, ensuring this remains a space of profound introspection — not gossip, not drama, but a curated reflection of the human condition.</p>
          </div>
          <div className="text-center" style={{ marginTop: '40px' }}>
            <Link href="/share" className="btn btn-primary">Share Your Words</Link>
          </div>
        </div>
      </section>
    </>
  );
}
