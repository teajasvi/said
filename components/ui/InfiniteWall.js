'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import SubmissionCard from '@/components/cards/SubmissionCard';
import NativeBanner from '@/components/ads/NativeBanner';
import BannerAd from '@/components/ads/BannerAd';

const BATCH_SIZE = 18;
const NATIVE_AD_AFTER_CARD = 6; // Show native ad after the 6th card
const BANNER_AD_AFTER_CARD = 12; // Show banner ad after the 12th card

/**
 * InfiniteWall — client component that auto-loads more cards
 * as the user scrolls down. Gets the initial batch from SSR props.
 * Injects a Native Banner ad after 6th card, and Banner ad after 12th card.
 */
export default function InfiniteWall({ initialSubmissions, initialTotal, filter, sensitiveIds }) {
  const [submissions, setSubmissions] = useState(initialSubmissions);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialSubmissions.length < initialTotal);
  const sentinelRef = useRef(null);

  // Reset when filter changes
  useEffect(() => {
    setSubmissions(initialSubmissions);
    setPage(1);
    setHasMore(initialSubmissions.length < initialTotal);
  }, [filter, initialSubmissions, initialTotal]);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);

    try {
      const nextPage = page + 1;
      const params = new URLSearchParams({ page: nextPage, limit: BATCH_SIZE });
      if (filter !== 'all') params.set('tag', filter);

      const res = await fetch(`/api/submissions?${params}`);
      if (!res.ok) throw new Error('Failed to fetch');

      const data = await res.json();
      const newSubs = data.submissions || [];

      if (newSubs.length === 0) {
        setHasMore(false);
      } else {
        setSubmissions(prev => [...prev, ...newSubs]);
        setPage(nextPage);
        setHasMore(nextPage < data.totalPages);
      }
    } catch (err) {
      console.error('[InfiniteWall] Load error:', err.message);
    } finally {
      setLoading(false);
    }
  }, [page, loading, hasMore, filter]);

  // IntersectionObserver — triggers loadMore when sentinel enters viewport
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { rootMargin: '400px' }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [loadMore]);

  const isSensitive = (id) => sensitiveIds.includes(id);

  // Split submissions into: before native ad + between ads + after banner ad
  const chunk1 = submissions.slice(0, NATIVE_AD_AFTER_CARD);
  const chunk2 = submissions.slice(NATIVE_AD_AFTER_CARD, BANNER_AD_AFTER_CARD);
  const chunk3 = submissions.slice(BANNER_AD_AFTER_CARD);

  const showNativeAd = submissions.length > NATIVE_AD_AFTER_CARD;
  const showBannerAd = submissions.length > BANNER_AD_AFTER_CARD;

  return (
    <>
      {/* Chunk 1 — first 6 cards */}
      <div className="desktop-only">
        <div className="card-grid-desktop">
          {chunk1.map((sub, i) => (
            <SubmissionCard
              key={sub.id}
              id={sub.id}
              text={sub.text}
              tag={sub.tag}
              createdAt={sub.created_at}
              index={i}
              sensitive={isSensitive(sub.id)}
            />
          ))}
        </div>
      </div>
      <div className="mobile-only">
        <div className="card-grid-mobile">
          {chunk1.map((sub, i) => (
            <SubmissionCard
              key={sub.id}
              id={sub.id}
              text={sub.text}
              tag={sub.tag}
              createdAt={sub.created_at}
              index={i}
              sensitive={isSensitive(sub.id)}
            />
          ))}
        </div>
      </div>

      {/* Ad 1 — Native Banner */}
      {showNativeAd && <NativeBanner />}

      {/* Chunk 2 — cards 7 to 12 */}
      {chunk2.length > 0 && (
        <>
          <div className="desktop-only">
            <div className="card-grid-desktop">
              {chunk2.map((sub, i) => (
                <SubmissionCard
                  key={sub.id}
                  id={sub.id}
                  text={sub.text}
                  tag={sub.tag}
                  createdAt={sub.created_at}
                  index={i + NATIVE_AD_AFTER_CARD}
                  sensitive={isSensitive(sub.id)}
                />
              ))}
            </div>
          </div>
          <div className="mobile-only">
            <div className="card-grid-mobile">
              {chunk2.map((sub, i) => (
                <SubmissionCard
                  key={sub.id}
                  id={sub.id}
                  text={sub.text}
                  tag={sub.tag}
                  createdAt={sub.created_at}
                  index={i + NATIVE_AD_AFTER_CARD}
                  sensitive={isSensitive(sub.id)}
                />
              ))}
            </div>
          </div>
        </>
      )}

      {/* Ad 2 — 300x250 Banner */}
      {showBannerAd && <BannerAd />}

      {/* Chunk 3 — cards 13+ */}
      {chunk3.length > 0 && (
        <>
          <div className="desktop-only">
            <div className="card-grid-desktop">
              {chunk3.map((sub, i) => (
                <SubmissionCard
                  key={sub.id}
                  id={sub.id}
                  text={sub.text}
                  tag={sub.tag}
                  createdAt={sub.created_at}
                  index={i + BANNER_AD_AFTER_CARD}
                  sensitive={isSensitive(sub.id)}
                />
              ))}
            </div>
          </div>
          <div className="mobile-only">
            <div className="card-grid-mobile">
              {chunk3.map((sub, i) => (
                <SubmissionCard
                  key={sub.id}
                  id={sub.id}
                  text={sub.text}
                  tag={sub.tag}
                  createdAt={sub.created_at}
                  index={i + BANNER_AD_AFTER_CARD}
                  sensitive={isSensitive(sub.id)}
                />
              ))}
            </div>
          </div>
        </>
      )}

      {submissions.length === 0 && (
        <div className="text-center" style={{ padding: '64px 0' }}>
          <p className="heading-md">Nothing here yet</p>
          <p className="body-lg" style={{ marginTop: '8px' }}>
            {filter !== 'all' ? 'No submissions found for this filter.' : 'Be the first to share.'}
          </p>
        </div>
      )}

      {/* Sentinel — triggers auto-load when scrolled into view */}
      <div ref={sentinelRef} style={{ height: '1px' }} />

      {loading && (
        <div className="text-center" style={{ padding: '32px 0' }}>
          <div className="spinner" style={{ margin: '0 auto' }} />
        </div>
      )}

      {!hasMore && submissions.length > 0 && (
        <p className="text-center caption" style={{ padding: '32px 0' }}>
          You've reached the end.
        </p>
      )}
    </>
  );
}
