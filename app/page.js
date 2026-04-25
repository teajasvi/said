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
            An anonymous space for the worst things ever said — the ones we spoke and the ones we carry. No names. No judgement. Just words.
          </p>
          <div className="animate-fade-in-up stagger-3" style={{ marginTop: '32px', display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/share" className="btn btn-primary">Share Yours</Link>
            <Link href="/wall" className="btn btn-secondary">Read The Wall</Link>
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

      {/* CTA Section */}
      <section className="section" style={{ background: 'var(--bg-secondary)', padding: '80px 0' }}>
        <div className="container text-center">
          <h2 className="heading-lg" style={{ marginBottom: '16px' }}>Everyone carries words.</h2>
          <p className="section__subtitle">
            Whether you said it or someone said it to you — you are not alone. Share anonymously, heal collectively.
          </p>
          <div style={{ marginTop: '32px' }}>
            <Link href="/share" className="btn btn-primary">Share Your Words</Link>
          </div>
        </div>
      </section>
    </>
  );
}
