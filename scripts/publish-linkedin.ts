#!/usr/bin/env npx tsx
/**
 * LinkedIn Draft Generator
 *
 * Reads a generated post's frontmatter and writes a ready-to-paste
 * LinkedIn post to:
 *   1. stdout (visible in Actions logs)
 *   2. $GITHUB_STEP_SUMMARY (rendered as Markdown in the Actions UI)
 *
 * Usage:
 *   npx tsx scripts/publish-linkedin.ts --slug my-post-slug
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
const postPath = path.join(process.cwd(), 'content/posts', `${slug}.mdx`)

if (!fs.existsSync(postPath)) {
  console.error(`Post file not found: ${postPath}`)
  process.exit(1)
}

const { data, content } = matter(fs.readFileSync(postPath, 'utf-8'))

const title   = (data.title   as string) ?? slug
const excerpt = (data.excerpt as string) ?? ''
const tags    = (data.tags    as string[]) ?? []

const postUrl    = `https://www.bennierichard.com/blog/${slug}`
const shareUrl   = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(postUrl)}`
const hashtags   = tags.map(t => `#${t.replace(/[^a-zA-Z0-9]/g, '')}`).join(' ')

// ── Strip markdown formatting so it reads cleanly as plain LinkedIn text ──
function toPlainText(md: string): string {
  return md
    .replace(/^>\s?/gm, '')             // > blockquote -> plain line
    .replace(/\*\*(.+?)\*\*/g, '$1')   // **bold** -> bold
    .replace(/\*(.+?)\*/g, '$1')       // *italic* -> italic
    .replace(/`([^`]+)`/g, '$1')       // `code` -> code
    .replace(/\[(.+?)\]\(.+?\)/g, '$1') // [text](link) -> text
    .trim()
}

// ── Pull the TL;DR bullets out of the post body for a quick gist ──────────
function extractTldr(body: string): string[] {
  const match = body.match(/##\s*TL;?DR\s*\n([\s\S]*?)(?:\n##\s|$)/i)
  if (!match) return []
  return match[1]
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.startsWith('-') || l.startsWith('*'))
    .map((l) => toPlainText(l.replace(/^[-*]\s*/, '')))
    .filter(Boolean)
}

// ── Pull the opening hook paragraph (first non-empty line of the body) ────
function extractHook(body: string): string {
  const firstParagraph = body
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .find(
      (p) =>
        p &&
        !p.startsWith('#') &&
        !p.startsWith('!') &&
        !p.startsWith('---') &&
        !p.startsWith('`') &&
        !p.endsWith(':') // skip lead-ins to code blocks/lists
    )
  return firstParagraph ? toPlainText(firstParagraph) : ''
}

const tldrBullets = extractTldr(content)
const hook = extractHook(content)

const tldrSection = tldrBullets.length
  ? `\nHere's the gist 👇\n${tldrBullets.map((b) => `✅ ${b}`).join('\n')}\n`
  : ''

// ── The actual LinkedIn post copy ──────────────────────────────────────────
const linkedInPost = `🚀 New post: ${title}

${excerpt}
${hook && hook !== excerpt ? `\n${hook}\n` : ''}${tldrSection}
Full breakdown with real code examples 👇
${postUrl}

${hashtags} #SalesforceDeveloper #AIBuilder #TechBlog`

// ── 1. stdout ──────────────────────────────────────────────────────────────
console.log('\n' + '─'.repeat(60))
console.log('LINKEDIN DRAFT — copy and paste this into LinkedIn:')
console.log('─'.repeat(60))
console.log(linkedInPost)
console.log('─'.repeat(60) + '\n')

// ── 2. GitHub Actions step summary ────────────────────────────────────────
const summaryFile = process.env.GITHUB_STEP_SUMMARY
if (summaryFile) {
  const summary = `## 📝 LinkedIn Draft Ready to Post

Copy the text below into [LinkedIn → Start a post](${shareUrl}).

---

\`\`\`
${linkedInPost}
\`\`\`

---

### Quick actions
| Action | Link |
|--------|------|
| 🔗 Open LinkedIn share dialog (URL pre-filled) | [Share on LinkedIn](${shareUrl}) |
| 📖 Preview post on site | [bennierichard.com/blog/${slug}](${postUrl}) |

> **Tip:** Open the share link → paste the text above → post. Takes ~30 seconds.
`
  fs.appendFileSync(summaryFile, summary, 'utf-8')
  console.log('✓ Draft written to GitHub Actions job summary')
}
