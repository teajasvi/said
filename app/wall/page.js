import { Suspense } from 'react';
import SubmissionCard from '@/components/cards/SubmissionCard';
import FilterTabs from '@/components/ui/FilterTabs';
import Pagination from '@/components/ui/Pagination';
import { fetchApprovedSubmissions } from '@/lib/data';

export const metadata = {
  title: 'The Wall',
  description: 'Browse anonymous submissions of the worst things ever said — words spoken and words received. Filter by category and read real confessions.',
  alternates: { canonical: 'https://theworstsaid.com/wall' },
};

export const revalidate = 30;

const DESKTOP_LIMIT = 21;
const MOBILE_LIMIT = 10;

export default async function WallPage({ searchParams }) {
  const params = await searchParams;
  const page = Math.max(1, parseInt(params?.page || '1', 10));
  const filter = params?.filter || 'all';

  // Fetch enough for desktop (mobile will slice)
  const { submissions, totalPages, total } = await fetchApprovedSubmissions({
    limit: DESKTOP_LIMIT,
    page,
    tag: filter,
  });

  const mobileSubmissions = submissions.slice(0, MOBILE_LIMIT);
  const searchParamsObj = {};
  if (filter !== 'all') searchParamsObj.filter = filter;

  return (
    <section className="section" style={{ paddingTop: '40px' }}>
      <div className="container">
        <div className="section__header">
          <p className="heading-sm">Archive</p>
          <h1 className="heading-lg" style={{ marginTop: '8px' }}>The Wall</h1>
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
            {mobileSubmissions.map((sub, i) => (
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
