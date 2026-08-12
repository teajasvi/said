import Link from 'next/link';
import SubmissionCard from '@/components/cards/SubmissionCard';
import { fetchApprovedSubmissions } from '@/lib/data';
import { containsExtremeContent } from '@/lib/contentWarning';

export const revalidate = 300;

export default async function HomePage() {
  const { submissions } = await fetchApprovedSubmissions({ limit: 5 });

  return (
    <>
      {/* Recent submissions first — users see content immediately */}
      {submissions.length > 0 && (
        <section className="section" style={{ paddingTop: '32px' }}>
          <div className="container">
            <div className="confession-list">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <p className="heading-sm animate-fade-in">Recent</p>
                <Link href="/wall" className="btn btn-ghost animate-fade-in" style={{ fontSize: '0.6875rem' }}>
                  View All →
                </Link>
              </div>

              {submissions.map((sub, i) => (
                <div key={sub.id} className="animate-fade-in-up" style={{ animationDelay: `${i * 0.1}s` }}>
                  <SubmissionCard
                    id={sub.id}
                    text={sub.text}
                    createdAt={sub.created_at}
                    index={i}
                    sensitive={containsExtremeContent(sub.text)}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Quiet end-of-page prompt */}
      <div className="animate-fade-in stagger-4" style={{ maxWidth: 'var(--content-width)', margin: '80px auto 0', padding: '0 24px', textAlign: 'center' }}>
        <p style={{ fontSize: '0.8125rem', color: 'var(--text-tertiary)', lineHeight: '1.8', fontStyle: 'italic' }}>
          Carrying something too?{' '}
          <Link href="/share" style={{ color: 'var(--text-secondary)', borderBottom: '1px solid var(--text-ghost)' }}>
            Leave it here.
          </Link>
        </p>
      </div>
    </>
  );
}
