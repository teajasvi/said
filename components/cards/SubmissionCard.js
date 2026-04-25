import Link from 'next/link';

/** Submission Card — displays a single submission, clickable to detail page */
export default function SubmissionCard({ id, text, tag, createdAt, index = 0 }) {
  const colorClass = index % 2 === 0 ? 'color-a' : 'color-b';
  const tagLabel = tag === 'i_said_it' ? 'I said it' : 'It was said to me';

  const date = new Date(createdAt);
  const formattedDate = date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  const formattedTime = date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  const cardContent = (
    <>
      <div className="submission-card__text">
        <p>{text}</p>
      </div>
      <div className="submission-card__meta">
        <span className="submission-card__tag">{tagLabel}</span>
        <span className="submission-card__date">
          {formattedDate}<br />{formattedTime}
        </span>
      </div>
    </>
  );

  // If id is provided, wrap in a link to the detail page
  if (id) {
    return (
      <Link href={`/wall/${id}`} className={`card submission-card submission-card--clickable ${colorClass} animate-fade-in-up stagger-${(index % 6) + 1}`} aria-label={`Read full submission: ${text.slice(0, 60)}...`}>
        {cardContent}
      </Link>
    );
  }

  return (
    <article className={`card submission-card ${colorClass} animate-fade-in-up stagger-${(index % 6) + 1}`}>
      {cardContent}
    </article>
  );
}
