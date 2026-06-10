import { getAllPosts } from '@/lib/mdx'
import { absoluteUrl, siteConfig } from '@/lib/site'

export const revalidate = 3600

function escapeXml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

export async function GET() {
  const posts = getAllPosts()
  const feedUrl = absoluteUrl('/blog/rss.xml')
  const blogUrl = absoluteUrl('/blog')

  const items = posts.map((post) => {
    const url = absoluteUrl(`/blog/${post.slug}`)
    return `
      <item>
        <title>${escapeXml(post.title)}</title>
        <link>${url}</link>
        <guid isPermaLink="true">${url}</guid>
        <description>${escapeXml(post.excerpt)}</description>
        <pubDate>${new Date(post.date).toUTCString()}</pubDate>
        <author>${escapeXml(`${siteConfig.author.email} (${siteConfig.author.name})`)}</author>
        ${post.tags.map((tag) => `<category>${escapeXml(tag)}</category>`).join('')}
      </item>`
  }).join('')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(siteConfig.name)} - Signal Log</title>
    <link>${blogUrl}</link>
    <atom:link href="${feedUrl}" rel="self" type="application/rss+xml" />
    <description>${escapeXml('Salesforce architecture, Agentforce, Apex, LWC, and AI agent development articles by Bennie Joseph.')}</description>
    <language>en</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    ${items}
  </channel>
</rss>`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 's-maxage=3600, stale-while-revalidate=86400',
    },
  })
}
