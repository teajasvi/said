import Link from 'next/link';

import ContentWarning from '@/components/ui/ContentWarning';

/**
 * Submission Card — a submission floating in the void.
 * No backgrounds, no borders. Just text emerging from darkness.
 */
export default function SubmissionCard({ id, text, saidBy, index = 0, sensitive = false }) {
  const cardContent = (
    <>
      <div className="submission-card__text">
        <p>{text}</p>
      </div>
      {saidBy && (
        <div className="submission-card__meta">
          <span className="submission-card__said-by">said by a {saidBy}</span>
        </div>
      )}
    </>
  );

  if (id) {
    const card = (
      <Link
        href={`/wall/${id}`}
        className="submission-card submission-card--clickable"
        aria-label={`Read full submission: ${text.slice(0, 60)}...`}
      >
        {cardContent}
      </Link>
    );
    return sensitive ? <ContentWarning>{card}</ContentWarning> : card;
  }

  const card = (
    <article className="submission-card">
      {cardContent}
    </article>
  );

  return sensitive ? <ContentWarning>{card}</ContentWarning> : card;
}
