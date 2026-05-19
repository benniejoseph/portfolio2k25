#!/usr/bin/env npx ts-node
/**
 * AI Blog Post Generator
 * Usage:
 *   npx ts-node scripts/generate-post.ts                  ← picks next topic from backlog
 *   npx ts-node scripts/generate-post.ts --index 3        ← specific topic by index
 *   npx ts-node scripts/generate-post.ts --list            ← list all topics
 *
 * Requires: OPENAI_API_KEY in .env.local
 */

import path from 'path'
import { generateAndSave, TOPIC_BACKLOG } from '../src/lib/blog-ai'
import fs from 'fs'

const args = process.argv.slice(2)

if (args.includes('--list')) {
  console.log('\nTopic backlog:\n')
  TOPIC_BACKLOG.forEach((t, i) => console.log(`  [${i}] ${t.title}`))
  console.log()
  process.exit(0)
}

// Find which topics already have posts
const postsDir = path.join(process.cwd(), 'content/posts')
const existing = fs.existsSync(postsDir)
  ? new Set(fs.readdirSync(postsDir).map((f) => f.replace('.mdx', '')))
  : new Set<string>()

let topicIndex: number

const idxArg = args.indexOf('--index')
if (idxArg !== -1) {
  topicIndex = parseInt(args[idxArg + 1], 10)
} else {
  // Pick first topic not yet published
  topicIndex = TOPIC_BACKLOG.findIndex((t) => {
    const slug = t.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .slice(0, 60)
    return !existing.has(slug)
  })
  if (topicIndex === -1) {
    console.log('All topics in backlog are already published.')
    process.exit(0)
  }
}

const topic = TOPIC_BACKLOG[topicIndex]
if (!topic) {
  console.error(`No topic at index ${topicIndex}`)
  process.exit(1)
}

console.log(`\nGenerating post: "${topic.title}"`)
console.log(`Keyword: ${topic.keyword}`)
console.log(`Tags: ${topic.tags.join(', ')}`)
console.log('Calling OpenAI API (gpt-5.5-2026-04-23)...\n')

generateAndSave(topic)
  .then((slug) => {
    console.log(`✓ Post saved: content/posts/${slug}.mdx`)
    console.log(`  Preview: http://localhost:3000/blog/${slug}`)

    // Write slug for downstream workflow steps
    // 1. GitHub Actions output variable
    if (process.env.GITHUB_OUTPUT) {
      fs.appendFileSync(process.env.GITHUB_OUTPUT, `slug=${slug}\n`)
    }
    // 2. Fallback file (also used locally)
    fs.writeFileSync(path.join(process.cwd(), '.generated-slug'), slug, 'utf-8')
  })
  .catch((err) => {
    console.error('Generation failed:', err.message)
    process.exit(1)
  })
