import { getAllPosts, getAllTags } from '@/lib/mdx'
import BlogClient from './BlogClient'
import { absoluteUrl, siteConfig, siteUrl } from '@/lib/site'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Field Notes - Salesforce, AI & Customer Success',
  description:
    'Practical Salesforce architecture, Agentforce, Winter ’27 rollout, Dreamforce ’26, AIforce, and customer-success articles from a Salesforce Customer Success Manager and Certified Application Architect.',
  keywords: [
    'Salesforce blog', 'Agentforce tutorial', 'Apex best practices',
    'LWC examples', 'Salesforce AI', 'AI agents Salesforce',
    'Salesforce architect blog', 'Salesforce developer tips',
    'Winter 27 Salesforce', 'Dreamforce 2026', 'AIforce',
    'Salesforce customer success', 'Agentic Enterprise',
  ],
  openGraph: {
    title: 'Field Notes - Salesforce, AI & Customer Success',
    description: 'Practical writing on Salesforce architecture, trusted agents, product releases, and customer outcomes.',
    type: 'website',
    url: absoluteUrl('/blog'),
    images: [{ url: absoluteUrl('/api/og?title=Signal+Log&tags=Salesforce,AI,Architecture'), width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Field Notes - Salesforce, AI & Customer Success',
    description: 'Salesforce architecture, trusted agents, product releases, and customer-success field notes.',
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
    name: 'Salesforce & AI Field Notes',
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
