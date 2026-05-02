import Link from 'next/link';
import LocalDate from '@/components/ui/LocalDate';
import ContentWarning from '@/components/ui/ContentWarning';

/** Submission Card — displays a single submission, clickable to detail page */
export default function SubmissionCard({ id, text, tag, createdAt, index = 0, sensitive = false }) {
  const colorClass = index % 2 === 0 ? 'color-a' : 'color-b';
  const tagLabel = tag === 'i_said_it' ? 'I said it' : 'It was said to me';

  const cardContent = (
    <>
      <div className="submission-card__text">
        <p>{text}</p>
      </div>
      <div className="submission-card__meta">
        <span className="submission-card__tag">{tagLabel}</span>
        <span className="submission-card__date">
          <LocalDate date={createdAt} />
        </span>
      </div>
    </>
  );

  // If id is provided, wrap in a link to the detail page
  if (id) {
    const card = (
      <Link href={`/wall/${id}`} className={`card submission-card submission-card--clickable ${colorClass}`} aria-label={`Read full submission: ${text.slice(0, 60)}...`}>
        {cardContent}
      </Link>
    );

    return sensitive ? <ContentWarning>{card}</ContentWarning> : card;
  }

  const card = (
    <article className={`card submission-card ${colorClass}`}>
      {cardContent}
    </article>
  );

  return sensitive ? <ContentWarning>{card}</ContentWarning> : card;
}
