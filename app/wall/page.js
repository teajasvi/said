import { fetchApprovedSubmissions } from '@/lib/data';
import { containsExtremeContent } from '@/lib/contentWarning';
import InfiniteWall from '@/components/ui/InfiniteWall';

export const metadata = {
  title: 'The Wall — Anonymous Archive',
  description: 'Browse a curated archive of the worst things ever said to us. Words of pain, breakup trauma, and the truths that stayed.',
  keywords: ['anonymous archive', 'worst things said in relationships', 'hurtful words', 'relationship regrets', 'verbal abuse stories'],
  alternates: { canonical: 'https://theworstsaid.com/wall' },
  openGraph: {
    title: 'The Wall — Anonymous Archive',
    description: 'A curated archive of the worst things ever said to us. Anonymous stories of regret, guilt, and the words that altered lives.',
    type: 'website',
  },
};

export const revalidate = 120;

const INITIAL_LIMIT = 12;

export default async function WallPage() {
  const { submissions, total } = await fetchApprovedSubmissions({
    limit: INITIAL_LIMIT,
    page: 1,
  });

  const sensitiveIds = submissions
    .filter(sub => containsExtremeContent(sub.text))
    .map(sub => sub.id);

  return (
    <section className="section" style={{ paddingTop: '48px' }}>
      <div className="container">
        <div className="confession-list">
          <div className="section__header animate-fade-in" style={{ textAlign: 'center', paddingBottom: '32px', borderBottom: '1px solid var(--border)' }}>
            <h1 className="heading-lg">The Wall</h1>
            {total > 0 && (
              <p className="caption" style={{ marginTop: '12px', letterSpacing: '0.1em' }}>
                {total.toLocaleString()} submissions
              </p>
            )}
          </div>

          <InfiniteWall
            initialSubmissions={submissions}
            initialTotal={total}
            sensitiveIds={sensitiveIds}
          />
        </div>
      </div>
    </section>
  );
}
