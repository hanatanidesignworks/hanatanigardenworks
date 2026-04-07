import { supabase } from '@/lib/supabaseClient'
import type { MetadataRoute } from 'next'

const siteUrl = 'https://www.hanatanigardenworks.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { data: articles } = await supabase
    .from('articles')
    .select('slug, updated_at')
    .eq('published', true)
    .order('updated_at', { ascending: false })

  const posts: MetadataRoute.Sitemap = (articles ?? []).map((a) => ({
    url: `${siteUrl}/posts/${encodeURIComponent(a.slug)}`,
    lastModified: new Date(a.updated_at),
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    ...posts,
  ]
}
