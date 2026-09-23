#!/usr/bin/env npx tsx
/**
 * AI blog post generator.
 *
 * Usage:
 *   npx tsx scripts/generate-post.ts
 *   npx tsx scripts/generate-post.ts --index 3
 *   npx tsx scripts/generate-post.ts --index 3 --force
 *   npx tsx scripts/generate-post.ts --list
 */

import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import {
  BLOG_IMAGE_MODEL,
  generateAndSave,
  TOPIC_BACKLOG,
  toPostSlug,
} from '../src/lib/blog-ai'
import { generateLinkedInDraft } from '../src/lib/linkedin-draft'

function loadLocalEnvironment(): void {
  const envPath = path.join(process.cwd(), '.env.local')
  if (!fs.existsSync(envPath)) return

  for (const line of fs.readFileSync(envPath, 'utf-8').split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const separator = trimmed.indexOf('=')
    if (separator < 1) continue
    const key = trimmed.slice(0, separator).trim()
    const rawValue = trimmed.slice(separator + 1).trim()
    const value = rawValue.replace(/^(['"])(.*)\1$/, '$2')
    if (!process.env[key]) process.env[key] = value
  }
}

function fail(message: string): never {
  console.error(message)
  process.exit(1)
}

function readExistingPosts(postsDirectory: string): {
  slugs: Set<string>
  titles: Set<string>
} {
  const slugs = new Set<string>()
  const titles = new Set<string>()
  if (!fs.existsSync(postsDirectory)) return { slugs, titles }

  for (const file of fs.readdirSync(postsDirectory).filter((name) => name.endsWith('.mdx'))) {
    slugs.add(file.slice(0, -4))
    try {
      const parsed = matter(fs.readFileSync(path.join(postsDirectory, file), 'utf-8'))
      if (typeof parsed.data.title === 'string') titles.add(parsed.data.title.trim().toLowerCase())
    } catch (error) {
      console.warn(`Skipping malformed frontmatter while selecting a topic: ${file} (${String(error)})`)
    }
  }
  return { slugs, titles }
}

async function main(): Promise<void> {
  const args = process.argv.slice(2)

  if (args.includes('--list')) {
    console.log('\nTopic backlog:\n')
    TOPIC_BACKLOG.forEach((topic, index) => {
      console.log(`  [${index}] ${topic.title}`)
      if (topic.sourceUrls?.length) console.log(`       sources: ${topic.sourceUrls.length}`)
    })
    console.log()
    return
  }

  loadLocalEnvironment()
  const postsDirectory = path.join(process.cwd(), 'content/posts')
  const existing = readExistingPosts(postsDirectory)
  const force = args.includes('--force')
  const indexFlag = args.indexOf('--index')
  let topicIndex: number

  if (indexFlag !== -1) {
    const rawIndex = args[indexFlag + 1]
    if (rawIndex === undefined || !/^\d+$/.test(rawIndex)) {
      fail('--index requires a non-negative integer')
    }
    topicIndex = Number(rawIndex)
    if (!Number.isSafeInteger(topicIndex) || topicIndex >= TOPIC_BACKLOG.length) {
      fail(`Topic index must be between 0 and ${TOPIC_BACKLOG.length - 1}`)
    }
  } else {
    topicIndex = TOPIC_BACKLOG.findIndex((topic) => {
      const slug = toPostSlug(topic.title)
      return !existing.slugs.has(slug) && !existing.titles.has(topic.title.trim().toLowerCase())
    })
    if (topicIndex === -1) {
      console.log('All topics in the current backlog are already published.')
      return
    }
  }

  const topic = TOPIC_BACKLOG[topicIndex]
  const slug = toPostSlug(topic.title)
  const alreadyPublished = existing.slugs.has(slug) || existing.titles.has(topic.title.trim().toLowerCase())
  if (alreadyPublished && !force) {
    fail(`Topic is already published: ${topic.title}. Pass --force only when replacement is intentional.`)
  }

  console.log(`\nGenerating post [${topicIndex}]: "${topic.title}"`)
  console.log(`Keyword: ${topic.keyword}`)
  console.log(`Tags: ${topic.tags.join(', ')}`)
  console.log(`Sources supplied: ${topic.sourceUrls?.length ?? 0}`)
  console.log(`Text models: gpt-6-astra → gpt-5.6-sol (automatic fallback)`)
  console.log(`Image model: ${BLOG_IMAGE_MODEL} (topic-specific compressed WebP)\n`)

  const generatedSlug = await generateAndSave(topic, { force })
  console.log(`✓ Post saved: content/posts/${generatedSlug}.mdx`)
  console.log(`  Preview: http://localhost:3000/blog/${generatedSlug}`)

  const linkedInDraft = await generateLinkedInDraft({ slug: generatedSlug, force })
  console.log(
    `✓ LinkedIn draft saved: content/linkedin-drafts/${generatedSlug}.md ` +
    `(${linkedInDraft.wordCount}/${linkedInDraft.limits.maxWords} words)`
  )

  if (process.env.GITHUB_OUTPUT) {
    fs.appendFileSync(process.env.GITHUB_OUTPUT, `slug=${generatedSlug}\n`, 'utf-8')
  }
  fs.writeFileSync(path.join(process.cwd(), '.generated-slug'), `${generatedSlug}\n`, 'utf-8')
}

main().catch((error) => {
  const message = error instanceof Error ? error.message : String(error)
  console.error(`Generation failed: ${message}`)
  process.exit(1)
})
