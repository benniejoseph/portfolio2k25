#!/usr/bin/env npx tsx
/**
 * LinkedIn Publisher
 * Reads a generated post's frontmatter and publishes an article link post
 * to LinkedIn via the REST API.
 *
 * Usage:
 *   npx tsx scripts/publish-linkedin.ts --slug my-post-slug
 *
 * Required env vars:
 *   LINKEDIN_ACCESS_TOKEN  — OAuth 2.0 bearer token (w_member_social scope)
 *   LINKEDIN_PERSON_URN    — e.g. urn:li:person:XXXXXXXXXX
 */

import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const args = process.argv.slice(2)
const slugIdx = args.indexOf('--slug')
if (slugIdx === -1 || !args[slugIdx + 1]) {
  console.error('Usage: publish-linkedin.ts --slug <post-slug>')
  process.exit(1)
}

const slug = args[slugIdx + 1]
const accessToken = process.env.LINKEDIN_ACCESS_TOKEN
const personUrn = process.env.LINKEDIN_PERSON_URN

if (!accessToken) {
  console.error('Missing LINKEDIN_ACCESS_TOKEN env var')
  process.exit(1)
}
if (!personUrn) {
  console.error('Missing LINKEDIN_PERSON_URN env var')
  process.exit(1)
}

const postPath = path.join(process.cwd(), 'content/posts', `${slug}.mdx`)
if (!fs.existsSync(postPath)) {
  console.error(`Post file not found: ${postPath}`)
  process.exit(1)
}

const { data } = matter(fs.readFileSync(postPath, 'utf-8'))

const title   = (data.title   as string) ?? slug
const excerpt = (data.excerpt as string) ?? ''
const tags    = (data.tags    as string[]) ?? []

const postUrl = `https://benniejoseph.dev/blog/${slug}`

// Build hashtags — capitalise, strip spaces/special chars
const hashtags = tags
  .map(t => `#${t.replace(/[^a-zA-Z0-9]/g, '')}`)
  .join(' ')

const commentary = `📝 New post: ${title}

${excerpt}

${hashtags} #SalesforceDeveloper #AIBuilder #TechBlog

Full post 👇
${postUrl}`

const body = {
  author: personUrn,
  commentary,
  visibility: 'PUBLIC',
  distribution: {
    feedDistribution: 'MAIN_FEED',
    targetEntities: [],
    thirdPartyDistributionChannels: [],
  },
  content: {
    article: {
      source: postUrl,
      title,
      description: excerpt,
    },
  },
  lifecycleState: 'PUBLISHED',
  isReshareDisabledByAuthor: false,
}

async function publish() {
  console.log(`\nPublishing to LinkedIn: "${title}"`)
  console.log(`URL: ${postUrl}\n`)

  const response = await fetch('https://api.linkedin.com/rest/posts', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      'LinkedIn-Version': '202501',
      'X-Restli-Protocol-Version': '2.0.0',
    },
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    const errorBody = await response.text()
    console.error(`LinkedIn API error ${response.status}: ${errorBody}`)
    process.exit(1)
  }

  const postId = response.headers.get('x-restli-id') ?? response.headers.get('location') ?? 'unknown'
  console.log(`✓ Published to LinkedIn (post ID: ${postId})`)
}

publish().catch(err => {
  console.error('LinkedIn publish failed:', err.message)
  process.exit(1)
})
