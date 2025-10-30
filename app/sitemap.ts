import type { MetadataRoute } from 'next'
import { supabase } from '@/lib/supabase'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.styragon.com'

  // Static routes
  const routes: MetadataRoute.Sitemap = [
    '',
    '/blog',
    '/blog-section',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: route === '' ? 1 : 0.7,
  }))

  // Blog detail routes (published only)
  const { data: posts } = await supabase
    .from('blog_posts')
    .select('slug, updated_at, created_at, published')
    .eq('published', true)

  const postRoutes: MetadataRoute.Sitemap = (posts || []).map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.updated_at ? new Date(post.updated_at) : new Date(post.created_at),
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  return [...routes, ...postRoutes]
}


