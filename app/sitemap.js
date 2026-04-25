import { getSupabaseAdmin } from '@/lib/supabase/server';

export default async function sitemap() {
  const baseUrl = 'https://theworstsaid.com';

  const staticPages = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${baseUrl}/wall`, lastModified: new Date(), changeFrequency: 'hourly', priority: 0.9 },
    { url: `${baseUrl}/share`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/stories`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/how-it-works`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/terms`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.2 },
    { url: `${baseUrl}/privacy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.2 },
  ];

  // Dynamically add approved submission URLs for indexing
  let submissionPages = [];
  try {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      const { data } = await supabase
        .from('submissions')
        .select('id, approved_at')
        .eq('status', 'approved')
        .order('approved_at', { ascending: false })
        .limit(500);

      if (data) {
        submissionPages = data.map((sub) => ({
          url: `${baseUrl}/wall/${sub.id}`,
          lastModified: new Date(sub.approved_at || Date.now()),
          changeFrequency: 'monthly',
          priority: 0.6,
        }));
      }
    }
  } catch (err) {
    console.warn('[Sitemap] Failed to fetch submissions:', err.message);
  }

  // Dynamically add published story URLs
  let storyPages = [];
  try {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      const { data } = await supabase
        .from('stories')
        .select('slug, updated_at')
        .eq('published', true)
        .order('created_at', { ascending: false });

      if (data) {
        storyPages = data.map((story) => ({
          url: `${baseUrl}/stories/${story.slug}`,
          lastModified: new Date(story.updated_at || Date.now()),
          changeFrequency: 'weekly',
          priority: 0.7,
        }));
      }
    }
  } catch (err) {
    console.warn('[Sitemap] Failed to fetch stories:', err.message);
  }

  return [...staticPages, ...submissionPages, ...storyPages];
}
