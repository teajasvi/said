import Link from 'next/link';
import { notFound } from 'next/navigation';
import { fetchSubmissionById } from '@/lib/data';
import { containsExtremeContent } from '@/lib/contentWarning';
import LocalDate from '@/components/ui/LocalDate';
import ContentWarning from '@/components/ui/ContentWarning';

export async function generateMetadata({ params }) {
  const { id } = await params;
  const submission = await fetchSubmissionById(id);

  if (!submission) {
    return { title: 'Submission Not Found' };
  }

  const truncatedText = submission.text.length > 120
    ? submission.text.slice(0, 120) + '…'
    : submission.text;

  return {
    title: `"${truncatedText}" — The Worst Said`,
    description: `An anonymous account of words that cut deep: "${submission.text}" — shared anonymously on The Worst Said.`,
    keywords: ['worst things said', 'hurtful words', 'anonymous archive'],
    alternates: { canonical: `https://theworstsaid.com/wall/${id}` },
    openGraph: {
      title: `"${truncatedText}"`,
      description: `An anonymous submission — The Worst Said.`,
      type: 'article',
      publishedTime: submission.created_at,
      siteName: 'The Worst Said',
    },
    twitter: {
      card: 'summary_large_image',
      title: `"${truncatedText}"`,
      description: `An anonymous submission — The Worst Said.`,
    },
  };
}

export const revalidate = 600;

export default async function SubmissionDetailPage({ params }) {
  const { id } = await params;
  const submission = await fetchSubmissionById(id);

  if (!submission) notFound();

  const sensitive = containsExtremeContent(submission.text);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    text: submission.text,
    datePublished: submission.created_at,
    publisher: { '@type': 'Organization', name: 'The Worst Said' },
    isAccessibleForFree: true,
  };

  const detailCard = (
    <article className="detail-card animate-fade-in-slow">
      <div className="detail-card__text">
        <p>{submission.text}</p>
      </div>
      <div className="detail-card__meta">
        {submission.said_by && (
          <div className="detail-card__said-by">— {submission.said_by}</div>
        )}
        <div className="detail-card__date">
          <LocalDate date={submission.created_at} />
        </div>
      </div>
    </article>
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="section" style={{ paddingTop: '24px' }}>
        <div className="container" style={{ maxWidth: '640px' }}>
          <Link href="/wall" className="detail-back animate-fade-in">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Back to The Wall
          </Link>

          {sensitive ? <ContentWarning>{detailCard}</ContentWarning> : detailCard}

          <div className="detail-actions animate-fade-in-up stagger-3">
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
