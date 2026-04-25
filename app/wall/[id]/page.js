import Link from 'next/link';
import { notFound } from 'next/navigation';
import { fetchSubmissionById } from '@/lib/data';

export async function generateMetadata({ params }) {
  const { id } = await params;
  const submission = await fetchSubmissionById(id);

  if (!submission) {
    return { title: 'Submission Not Found' };
  }

  const tagLabel = submission.tag === 'i_said_it' ? 'I said it' : 'It was said to me';
  const truncatedText = submission.text.length > 120
    ? submission.text.slice(0, 120) + '…'
    : submission.text;

  return {
    title: `"${truncatedText}" — ${tagLabel}`,
    description: `${tagLabel}: "${submission.text}" — An anonymous confession on The Worst Said.`,
    alternates: { canonical: `https://theworstsaid.com/wall/${id}` },
    openGraph: {
      title: `"${truncatedText}"`,
      description: `${tagLabel} — shared anonymously on The Worst Said.`,
      type: 'article',
      publishedTime: submission.created_at,
    },
    twitter: {
      card: 'summary',
      title: `"${truncatedText}"`,
      description: `${tagLabel} — The Worst Said.`,
    },
  };
}

export const revalidate = 300;

export default async function SubmissionDetailPage({ params }) {
  const { id } = await params;
  const submission = await fetchSubmissionById(id);

  if (!submission) notFound();

  const tagLabel = submission.tag === 'i_said_it' ? 'I said it' : 'It was said to me';
  const colorClass = submission.tag === 'i_said_it' ? 'color-a' : 'color-b';

  const date = new Date(submission.created_at);
  const formattedDate = date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
  const formattedTime = date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    text: submission.text,
    datePublished: submission.created_at,
    publisher: { '@type': 'Organization', name: 'The Worst Said' },
    isAccessibleForFree: true,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="section" style={{ paddingTop: '24px' }}>
        <div className="container" style={{ maxWidth: '720px' }}>
          {/* Back link */}
          <Link href="/wall" className="detail-back animate-fade-in">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Back to The Wall
          </Link>

          {/* The card — large, centered */}
          <article className={`detail-card ${colorClass} animate-fade-in-up`}>
            <div className="detail-card__text">
              <p>{submission.text}</p>
            </div>
            <div className="detail-card__divider" />
            <div className="detail-card__meta">
              <div>
                <span className="detail-card__tag">{tagLabel}</span>
              </div>
              <div className="detail-card__date">
                <span>{formattedDate}</span>
                <span>{formattedTime}</span>
              </div>
            </div>
          </article>

          {/* Actions */}
          <div className="detail-actions animate-fade-in-up stagger-2">
            <Link href="/share" className="btn btn-primary">
              Share Your Words
            </Link>
            <Link href="/wall" className="btn btn-secondary">
              Read More
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
