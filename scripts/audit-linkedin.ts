#!/usr/bin/env npx tsx

import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'
import {
  countLinkedInCharacters,
  countLinkedInWords,
  getCanonicalSiteUrl,
  validateLinkedInPost,
  type LinkedInDraftLimits,
} from '../src/lib/linkedin-draft'

const draftsDirectory = path.join(process.cwd(), 'content/linkedin-drafts')
const postsDirectory = path.join(process.cwd(), 'content/posts')
const draftRequiredFrom = '2026-09-23'
const slugFlagIndex = process.argv.indexOf('--slug')
const selectedSlug = slugFlagIndex >= 0 ? process.argv[slugFlagIndex + 1] : undefined

if (slugFlagIndex >= 0 && (!selectedSlug || !/^[a-z0-9][a-z0-9-]*$/u.test(selectedSlug))) {
  console.error('--slug requires a lowercase post slug containing only letters, numbers, and hyphens')
  process.exit(1)
}

const allFiles = fs.existsSync(draftsDirectory)
  ? fs.readdirSync(draftsDirectory).filter((file) => file.endsWith('.md')).sort()
  : []
const files = selectedSlug ? allFiles.filter((file) => file === `${selectedSlug}.md`) : allFiles
if (selectedSlug && files.length === 0) {
  console.error(`LinkedIn draft not found: content/linkedin-drafts/${selectedSlug}.md`)
  process.exit(1)
}

const errors: string[] = []
const report = (file: string, message: string) => errors.push(`${file}: ${message}`)

if (!selectedSlug && fs.existsSync(postsDirectory)) {
  const postFiles = fs.readdirSync(postsDirectory).filter((file) => file.endsWith('.mdx')).sort()
  for (const postFile of postFiles) {
    try {
      const parsed = matter(fs.readFileSync(path.join(postsDirectory, postFile), 'utf8'))
      const publicationDate = String(parsed.data.date || '').slice(0, 10)
      const slug = postFile.slice(0, -4)
      if (publicationDate >= draftRequiredFrom && !allFiles.includes(`${slug}.md`)) {
        report(postFile, `posts dated ${draftRequiredFrom} or later require content/linkedin-drafts/${slug}.md`)
      }
    } catch {
      // The blog audit owns malformed article reporting. Avoid duplicating it here.
    }
  }
}

for (const file of files) {
  const filePath = path.join(draftsDirectory, file)
  const expectedSlug = file.slice(0, -3)
  let parsed: matter.GrayMatterFile<string>
  try {
    parsed = matter(fs.readFileSync(filePath, 'utf8'))
  } catch (error) {
    report(file, `invalid frontmatter: ${error instanceof Error ? error.message : String(error)}`)
    continue
  }

  const post = parsed.content.trim()
  const sourceUrl = typeof parsed.data.sourceUrl === 'string' ? parsed.data.sourceUrl : ''
  const maxWords = Number(parsed.data.maxWords)
  const maxCharacters = Number(parsed.data.maxCharacters)
  const storedWordCount = Number(parsed.data.wordCount)
  const storedCharacterCount = Number(parsed.data.characterCount)
  const expectedSourceUrl = `${getCanonicalSiteUrl()}/blog/${expectedSlug}`

  if (parsed.data.slug !== expectedSlug) report(file, `slug must match the filename (${expectedSlug})`)
  if (sourceUrl !== expectedSourceUrl) report(file, `sourceUrl must be ${expectedSourceUrl}`)
  if (!Number.isSafeInteger(maxWords) || maxWords <= 0) report(file, 'maxWords must be a positive integer')
  if (!Number.isSafeInteger(maxCharacters) || maxCharacters <= 0 || maxCharacters > 3000) {
    report(file, 'maxCharacters must be a positive integer no greater than 3000')
  }
  if (typeof parsed.data.model !== 'string' || !parsed.data.model.trim()) report(file, 'model is required')
  if (parsed.data.humanReviewRequired !== true) report(file, 'humanReviewRequired must be true')
  if (Number.isNaN(Date.parse(String(parsed.data.generatedAt)))) report(file, 'generatedAt must be a valid date')
  if (!fs.existsSync(path.join(postsDirectory, `${expectedSlug}.mdx`))) {
    report(file, `matching article is missing: content/posts/${expectedSlug}.mdx`)
  }

  const actualWordCount = countLinkedInWords(post)
  const actualCharacterCount = countLinkedInCharacters(post)
  if (storedWordCount !== actualWordCount) {
    report(file, `wordCount metadata is ${storedWordCount}; actual count is ${actualWordCount}`)
  }
  if (storedCharacterCount !== actualCharacterCount) {
    report(file, `characterCount metadata is ${storedCharacterCount}; actual count is ${actualCharacterCount}`)
  }

  if (
    sourceUrl &&
    Number.isSafeInteger(maxWords) && maxWords > 0 &&
    Number.isSafeInteger(maxCharacters) && maxCharacters > 0 && maxCharacters <= 3000
  ) {
    const limits: LinkedInDraftLimits = { maxWords, maxCharacters }
    for (const message of validateLinkedInPost(post, sourceUrl, limits)) report(file, message)
  }
}

for (const error of errors) console.error(`ERROR ${error}`)
console.log(`Audited ${files.length} LinkedIn draft(s): ${errors.length} error(s).`)
if (errors.length > 0) process.exit(1)
