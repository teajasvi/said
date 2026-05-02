import { Suspense } from 'react';
import FilterTabs from '@/components/ui/FilterTabs';
import { fetchApprovedSubmissions } from '@/lib/data';
import { containsExtremeContent } from '@/lib/contentWarning';
import NativeBanner from '@/components/ads/NativeBanner';
import InfiniteWall from '@/components/ui/InfiniteWall';

export const metadata = {
  title: 'The Wall — Anonymous Confessions Archive',
  description: 'Browse a curated archive of anonymous confessions — the worst things said in relationships, words of regret, breakup trauma, and the truths that stayed. Filter by guilt or pain.',
  keywords: ['anonymous confessions archive', 'worst things said in relationships', 'breakup confessions', 'hurtful words', 'relationship regrets', 'verbal abuse stories'],
  alternates: { canonical: 'https://theworstsaid.com/wall' },
  openGraph: {
    title: 'The Wall — Anonymous Confessions Archive',
    description: 'A curated archive of the worst things ever said. Browse anonymous confessions of regret, guilt, and the words that altered lives.',
    type: 'website',
  },
};

export const revalidate = 120;

const INITIAL_LIMIT = 18;

export default async function WallPage({ searchParams }) {
  const params = await searchParams;
  const filter = params?.filter || 'all';

  const { submissions, total } = await fetchApprovedSubmissions({
    limit: INITIAL_LIMIT,
    page: 1,
    tag: filter,
  });

  // Pre-compute which submissions need content warnings (server-side)
  const sensitiveIds = submissions
    .filter(sub => containsExtremeContent(sub.text))
    .map(sub => sub.id);

  return (
    <section className="section" style={{ paddingTop: '40px' }}>
      <div className="container">
        <div className="section__header">
          <h1 className="heading-lg">The Wall</h1>
          <p className="body-lg" style={{ marginTop: '8px', maxWidth: '480px' }}>
            {total > 0 ? `${total.toLocaleString()} confessions and counting.` : 'No submissions yet.'}
          </p>
        </div>

        <div style={{ marginBottom: '32px' }}>
          <Suspense fallback={null}>
            <FilterTabs />
          </Suspense>
        </div>

        <InfiniteWall
          initialSubmissions={submissions}
          initialTotal={total}
          filter={filter}
          sensitiveIds={sensitiveIds}
        />

        <NativeBanner />
      </div>
    </section>
  );
}
