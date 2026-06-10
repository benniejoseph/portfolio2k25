import { getAllPosts, getAllTags } from '@/lib/mdx'
import BlogClient from './BlogClient'
import { absoluteUrl, siteConfig, siteUrl } from '@/lib/site'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Signal Log - Salesforce & AI Blog',
  description:
    'Salesforce architecture, Agentforce, Apex, LWC, and AI agent development articles from a Certified Application Architect with 9+ years of enterprise work.',
  keywords: [
    'Salesforce blog', 'Agentforce tutorial', 'Apex best practices',
    'LWC examples', 'Salesforce AI', 'AI agents Salesforce',
    'Salesforce architect blog', 'Salesforce developer tips',
  ],
  openGraph: {
    title: 'Signal Log - Salesforce & AI Blog',
    description: 'Salesforce architecture, Agentforce, AI agents, Apex, and LWC articles from a Certified Application Architect.',
    type: 'website',
    url: absoluteUrl('/blog'),
    images: [{ url: absoluteUrl('/api/og?title=Signal+Log&tags=Salesforce,AI,Architecture'), width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Signal Log - Salesforce & AI Blog',
    description: 'Salesforce architecture, Agentforce, Apex, LWC, and AI agent development articles.',
    images: [absoluteUrl('/api/og?title=Signal+Log&tags=Salesforce,AI,Architecture')],
  },
  alternates: {
    canonical: '/blog',
    types: {
      'application/rss+xml': absoluteUrl('/blog/rss.xml'),
    },
  },
}

export default function BlogPage() {
  const posts = getAllPosts()
  const tags = getAllTags()
  const blogSchema = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    '@id': `${siteUrl}/blog#blog`,
    name: 'Signal Log',
    url: absoluteUrl('/blog'),
    description: metadata.description,
    inLanguage: 'en',
    author: { '@type': 'Person', '@id': `${siteUrl}/#person`, name: siteConfig.author.name },
    blogPost: posts.slice(0, 12).map((post) => ({
      '@type': 'BlogPosting',
      headline: post.title,
      description: post.excerpt,
      url: absoluteUrl(`/blog/${post.slug}`),
      datePublished: post.date,
      image: post.coverImage ? absoluteUrl(post.coverImage) : absoluteUrl(`/api/og?title=${encodeURIComponent(post.title)}`),
      keywords: [post.keyword, ...post.tags].filter(Boolean).join(', '),
    })),
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }} />
      <BlogClient posts={posts} tags={tags} />
    </>
  )
}
