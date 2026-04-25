'use client';
import Link from 'next/link';

export default function Pagination({ currentPage, totalPages, basePath, searchParams = {} }) {
  if (totalPages <= 1) return null;

  const buildHref = (page) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', page.toString());
    return `${basePath}?${params.toString()}`;
  };

  const pages = [];
  const delta = 2;
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== '...') {
      pages.push('...');
    }
  }

  return (
    <nav className="pagination" aria-label="Pagination">
      <Link
        href={buildHref(currentPage - 1)}
        className="pagination__btn"
        aria-label="Previous page"
        style={currentPage <= 1 ? { pointerEvents: 'none', opacity: 0.3 } : {}}
      >
        ←
      </Link>
      {pages.map((page, i) =>
        page === '...' ? (
          <span key={`dots-${i}`} className="pagination__dots">…</span>
        ) : (
          <Link
            key={page}
            href={buildHref(page)}
            className={`pagination__btn ${page === currentPage ? 'pagination__btn--active' : ''}`}
            aria-label={`Page ${page}`}
            aria-current={page === currentPage ? 'page' : undefined}
          >
            {page}
          </Link>
        )
      )}
      <Link
        href={buildHref(currentPage + 1)}
        className="pagination__btn"
        aria-label="Next page"
        style={currentPage >= totalPages ? { pointerEvents: 'none', opacity: 0.3 } : {}}
      >
        →
      </Link>
    </nav>
  );
}
