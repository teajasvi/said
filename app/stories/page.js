import Link from 'next/link';
import { fetchPublishedStories } from '@/lib/data';

export const metadata = {
  title: 'Stories — Essays on Words, Relationships & Healing',
  description: 'Read editorial essays exploring the psychology of hurtful words, breakup trauma, micro-hurts in relationships, ghostlighting, and the neuroscience behind why cruel words break us. Curated long-form content on The Worst Said.',
  keywords: ['psychology of hurtful words', 'breakup essays', 'micro-hurts in relationships', 'ghostlighting dating', 'verbal abuse psychology', 'healing from cruel words', 'relationship essays'],
  alternates: { canonical: 'https://theworstsaid.com/stories' },
  openGraph: {
    title: 'Stories — Essays on Words, Relationships & Healing',
    description: 'Profound editorial essays exploring micro-hurts, ghostlighting, breakup trauma, and the permanent residue of cruel words.',
    type: 'website',
  },
};

export const revalidate = 300;

export default async function StoriesPage() {
  const { stories } = await fetchPublishedStories({ limit: 20 });

  return (
    <section className="section" style={{ paddingTop: '40px' }}>
      <div className="container" style={{ maxWidth: '800px' }}>
        <div className="section__header">
          <p className="heading-sm">Read</p>
          <h1 className="heading-lg" style={{ marginTop: '8px' }}>Stories</h1>
          <p className="body-lg" style={{ marginTop: '8px' }}>
            Reflections on the words that shaped us — essays and perspectives on what was said.
          </p>
        </div>

        {stories.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {stories.map((story) => (
              <Link key={story.id} href={`/stories/${story.slug}`}>
                <article className="story-card">
                  <p className="story-card__date">
                    {new Date(story.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </p>
                  <h2 className="story-card__title">{story.title}</h2>
                  {story.excerpt && <p className="story-card__excerpt">{story.excerpt}</p>}
                </article>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center" style={{ padding: '64px 0' }}>
            <p className="heading-md">Coming soon</p>
            <p className="body-lg" style={{ marginTop: '8px' }}>We are working on stories that explore the weight of words.</p>
          </div>
        )}
      </div>
    </section>
  );
}
