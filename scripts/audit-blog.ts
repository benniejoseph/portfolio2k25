#!/usr/bin/env npx tsx

import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'

const postsDir = path.join(process.cwd(), 'content/posts')
const strictImages = process.argv.includes('--strict-images')
const slugFlagIndex = process.argv.indexOf('--slug')
const selectedSlug = slugFlagIndex >= 0 ? process.argv[slugFlagIndex + 1] : undefined

if (slugFlagIndex >= 0 && (!selectedSlug || !/^[a-z0-9][a-z0-9-]*$/u.test(selectedSlug))) {
  console.error('--slug requires a lowercase post slug containing only letters, numbers, and hyphens')
  process.exit(1)
}

type AuditMessage = {
  level: 'error' | 'warning'
  file: string
  message: string
}

const messages: AuditMessage[] = []
const titles = new Map<string, string>()

const report = (level: AuditMessage['level'], file: string, message: string) => {
  messages.push({ level, file, message })
}

const checkPublicAsset = (file: string, assetPath: string, label: string) => {
  if (!assetPath.startsWith('/')) {
    report('error', file, `${label} must use an absolute public path: ${assetPath}`)
    return
  }

  const diskPath = path.join(process.cwd(), 'public', assetPath.replace(/^\//, ''))
  if (!fs.existsSync(diskPath)) {
    report(strictImages ? 'error' : 'warning', file, `${label} is missing: ${assetPath}`)
  }
}

if (!fs.existsSync(postsDir)) {
  console.error(`Blog directory not found: ${postsDir}`)
  process.exit(1)
}

const allFiles = fs.readdirSync(postsDir).filter((file) => file.endsWith('.mdx')).sort()
const files = selectedSlug ? allFiles.filter((file) => file === `${selectedSlug}.mdx`) : allFiles

if (selectedSlug && files.length === 0) {
  console.error(`Blog post not found: ${selectedSlug}`)
  process.exit(1)
}

for (const file of files) {
  const filePath = path.join(postsDir, file)
  const raw = fs.readFileSync(filePath, 'utf8')

  let data: Record<string, unknown>
  let content: string
  try {
    const parsed = matter(raw)
    data = parsed.data
    content = parsed.content
  } catch (error) {
    report('error', file, `invalid frontmatter: ${error instanceof Error ? error.message : String(error)}`)
    continue
  }

  for (const field of ['title', 'excerpt', 'date']) {
    if (typeof data[field] !== 'string' || !String(data[field]).trim()) {
      report('error', file, `missing required string field: ${field}`)
    }
  }

  if (!Array.isArray(data.tags) || data.tags.length === 0 || data.tags.some((tag) => typeof tag !== 'string')) {
    report('error', file, 'tags must be a non-empty string array')
  }

  if (typeof data.title === 'string') {
    const normalized = data.title.trim().toLowerCase()
    const duplicate = titles.get(normalized)
    if (duplicate) report('error', file, `duplicates the title in ${duplicate}`)
    titles.set(normalized, file)
  }

  if (typeof data.excerpt === 'string' && data.excerpt.length > 220) {
    report('warning', file, `excerpt is ${data.excerpt.length} characters; keep it at 220 or fewer`)
  }

  if (typeof data.date === 'string') {
    const timestamp = Date.parse(data.date)
    if (Number.isNaN(timestamp)) {
      report('error', file, `date is not valid: ${data.date}`)
    } else if (timestamp > Date.now() + 24 * 60 * 60 * 1000) {
      report('error', file, `date is in the future: ${data.date}`)
    }
  }

  if (data.lastVerified !== undefined && (typeof data.lastVerified !== 'string' || Number.isNaN(Date.parse(data.lastVerified)))) {
    report('error', file, 'lastVerified must be a valid date when provided')
  }

  if (/\{(?:COVER|IMAGE)_PROMPT:/u.test(content)) {
    report('error', file, 'contains an unresolved image-generation directive')
  }

  if (Array.isArray(data.tags) && data.tags.some((tag) => String(tag).toUpperCase() === 'CTA')) {
    report('error', file, 'CTA certification/study tags are outside the blog editorial scope')
  }

  if (typeof data.coverImage === 'string' && data.coverImage) {
    checkPublicAsset(file, data.coverImage, 'coverImage')
    if (data.coverAlt !== undefined && (typeof data.coverAlt !== 'string' || !data.coverAlt.trim())) {
      report('error', file, 'coverAlt must be a non-empty string when provided')
    }
  } else {
    report('warning', file, 'has no coverImage')
  }

  for (const match of content.matchAll(/!\[[^\]]*\]\((\/images\/[^)\s]+)\)/gu)) {
    checkPublicAsset(file, match[1], 'inline image')
  }

  const wordCount = content.trim().split(/\s+/u).filter(Boolean).length
  if (wordCount < 900) report('warning', file, `article is thin at approximately ${wordCount} words`)
}

const errors = messages.filter((message) => message.level === 'error')
const warnings = messages.filter((message) => message.level === 'warning')

for (const message of messages) {
  const prefix = message.level === 'error' ? 'ERROR' : 'WARN '
  console.log(`${prefix} ${message.file}: ${message.message}`)
}

console.log(`\nAudited ${files.length} posts: ${errors.length} error(s), ${warnings.length} warning(s).`)

if (errors.length > 0) process.exit(1)
