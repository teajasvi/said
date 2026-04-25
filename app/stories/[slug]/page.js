import { fetchStoryBySlug } from '@/lib/data';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const story = await fetchStoryBySlug(slug);
  if (!story) return { title: 'Story Not Found' };

  return {
    title: story.title,
    description: story.meta_description || story.excerpt || `Read "${story.title}" on The Worst Said.`,
    alternates: { canonical: `https://theworstsaid.com/stories/${slug}` },
    openGraph: {
      title: story.title,
      description: story.meta_description || story.excerpt,
      type: 'article',
      publishedTime: story.created_at,
      modifiedTime: story.updated_at,
    },
  };
}

export const revalidate = 3600;

export default async function StoryPage({ params }) {
  const { slug } = await params;
  const story = await fetchStoryBySlug(slug);
  if (!story) notFound();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: story.title,
    datePublished: story.created_at,
    dateModified: story.updated_at,
    publisher: { '@type': 'Organization', name: 'The Worst Said' },
    description: story.meta_description || story.excerpt,
  };

  return (
    <section className="section" style={{ paddingTop: '40px' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="container">
        <article className="prose">
          <p className="caption" style={{ marginBottom: '16px' }}>
            {new Date(story.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
          <h1>{story.title}</h1>
          <div dangerouslySetInnerHTML={{ __html: story.content }} />
        </article>
      </div>
    </section>
  );
}
