import { Suspense } from 'react';
import SubmissionCard from '@/components/cards/SubmissionCard';
import FilterTabs from '@/components/ui/FilterTabs';
import Pagination from '@/components/ui/Pagination';
import { fetchApprovedSubmissions } from '@/lib/data';

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

const DESKTOP_LIMIT = 18;

export default async function WallPage({ searchParams }) {
  const params = await searchParams;
  const page = Math.max(1, parseInt(params?.page || '1', 10));
  const filter = params?.filter || 'all';

  const { submissions, totalPages, total } = await fetchApprovedSubmissions({
    limit: DESKTOP_LIMIT,
    page,
    tag: filter,
  });

  const searchParamsObj = {};
  if (filter !== 'all') searchParamsObj.filter = filter;

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

        {/* Desktop Grid */}
        <div className="desktop-only">
          <div className="card-grid-desktop">
            {submissions.map((sub, i) => (
              <SubmissionCard
                key={sub.id}
                id={sub.id}
                text={sub.text}
                tag={sub.tag}
                createdAt={sub.created_at}
                index={i}
              />
            ))}
          </div>
        </div>

        {/* Mobile Grid */}
        <div className="mobile-only">
          <div className="card-grid-mobile">
            {submissions.map((sub, i) => (
              <SubmissionCard
                key={sub.id}
                id={sub.id}
                text={sub.text}
                tag={sub.tag}
                createdAt={sub.created_at}
                index={i}
              />
            ))}
          </div>
        </div>

        {submissions.length === 0 && (
          <div className="text-center" style={{ padding: '64px 0' }}>
            <p className="heading-md">Nothing here yet</p>
            <p className="body-lg" style={{ marginTop: '8px' }}>
              {filter !== 'all' ? 'No submissions found for this filter.' : 'Be the first to share.'}
            </p>
          </div>
        )}

        <Pagination
          currentPage={page}
          totalPages={totalPages}
          basePath="/wall"
          searchParams={searchParamsObj}
        />
      </div>
    </section>
  );
}
