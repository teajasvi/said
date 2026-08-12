'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import SubmissionCard from '@/components/cards/SubmissionCard';

const BATCH_SIZE = 12;

/**
 * InfiniteWall — single-column stream of submissions
 * that auto-loads as the user scrolls into the void.
 */
export default function InfiniteWall({ initialSubmissions, initialTotal, sensitiveIds }) {
  const [submissions, setSubmissions] = useState(initialSubmissions);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialSubmissions.length < initialTotal);
  const sentinelRef = useRef(null);

  useEffect(() => {
    setSubmissions(initialSubmissions);
    setPage(1);
    setHasMore(initialSubmissions.length < initialTotal);
  }, [initialSubmissions, initialTotal]);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);

    try {
      const nextPage = page + 1;
      const params = new URLSearchParams({ page: nextPage, limit: BATCH_SIZE });
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
  }, [page, loading, hasMore]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => { if (entries[0].isIntersecting) loadMore(); },
      { rootMargin: '600px' }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [loadMore]);

  const isSensitive = (id) => sensitiveIds.includes(id);

  return (
    <div className="confession-list">
      {submissions.map((sub, i) => (
        <div key={sub.id} className="animate-fade-in-up" style={{ animationDelay: `${Math.min(i * 0.15, 1.2)}s` }}>
          <SubmissionCard
            id={sub.id}
            text={sub.text}
            createdAt={sub.created_at}
            saidBy={sub.said_by}
            index={i}
            sensitive={isSensitive(sub.id)}
          />
        </div>
      ))}

      {submissions.length === 0 && (
        <div className="text-center" style={{ padding: '100px 0' }}>
          <p className="heading-md animate-fade-in-slow">Nothing here yet.</p>
          <p className="body-lg animate-fade-in-slow stagger-1" style={{ marginTop: '12px' }}>
            The void awaits its first words.
          </p>
        </div>
      )}

      <div ref={sentinelRef} style={{ height: '1px' }} />

      {loading && (
        <div className="text-center" style={{ padding: '48px 0' }}>
          <div className="spinner" style={{ margin: '0 auto' }} />
        </div>
      )}

      {!hasMore && submissions.length > 0 && (
        <p className="text-center caption animate-fade-in" style={{ padding: '64px 0', letterSpacing: '0.1em' }}>
          · · ·
        </p>
      )}
    </div>
  );
}
