import Link from 'next/link';
import SubmissionCard from '@/components/cards/SubmissionCard';
import { fetchApprovedSubmissions } from '@/lib/data';

export const revalidate = 300;

export default async function HomePage() {
  const { submissions } = await fetchApprovedSubmissions({ limit: 6 });

  return (
    <>
      {/* Recent Submissions — cards first */}
      <section className="section" style={{ paddingTop: '40px' }}>
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
              {/* Desktop: 3 columns × 2 rows */}
              <div className="desktop-only">
                <div className="card-grid-home">
                  {submissions.map((sub, i) => (
                    <SubmissionCard key={sub.id} id={sub.id} text={sub.text} tag={sub.tag} createdAt={sub.created_at} index={i} />
                  ))}
                </div>
              </div>

              {/* Mobile: all 6 cards stacked */}
              <div className="mobile-only">
                <div className="card-grid-mobile">
                  {submissions.map((sub, i) => (
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

      {/* Hero text + buttons — below the cards */}
      <section className="section--hero">
        <div className="container">
          <h1 className="heading-xl">
            Words that stayed<br />with us.
          </h1>
          <p className="section__subtitle">
            An anonymous archive for the worst things ever said — the ones we spoke and the ones we carry.
          </p>
          <div style={{ marginTop: '40px', display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/share" className="btn btn-primary">Share Your Words</Link>
            <Link href="/wall" className="btn btn-secondary">Explore The Wall</Link>
          </div>
        </div>
      </section>
    </>
  );
}
