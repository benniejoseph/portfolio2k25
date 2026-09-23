import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'
import OpenAI from 'openai'

const DEFAULT_TEXT_MODELS = ['gpt-6-astra', 'gpt-5.6-sol'] as const
const DEFAULT_MAX_WORDS = 180
const DEFAULT_MAX_CHARACTERS = 2600
const LINKEDIN_CHARACTER_LIMIT = 3000

export interface LinkedInDraftLimits {
  maxWords: number
  maxCharacters: number
}

interface ArticleContext {
  slug: string
  title: string
  excerpt: string
  keyword: string
  tags: string[]
  intro: string[]
  tldr: string[]
  headings: string[]
  body: string
  postUrl: string
}

export interface GenerateLinkedInDraftOptions {
  slug: string
  force?: boolean
  limits?: Partial<LinkedInDraftLimits>
}

export interface LinkedInDraftResult {
  slug: string
  draftPath: string
  post: string
  model: string
  wordCount: number
  characterCount: number
  limits: LinkedInDraftLimits
  postUrl: string
}

function positiveInteger(value: string | undefined, fallback: number, label: string): number {
  if (value === undefined || value.trim() === '') return fallback
  const parsed = Number(value)
  if (!Number.isSafeInteger(parsed) || parsed <= 0) {
    throw new Error(`${label} must be a positive integer`)
  }
  return parsed
}

export function getLinkedInDraftLimits(
  overrides: Partial<LinkedInDraftLimits> = {}
): LinkedInDraftLimits {
  const maxWords = overrides.maxWords ?? positiveInteger(
    process.env.LINKEDIN_MAX_WORDS,
    DEFAULT_MAX_WORDS,
    'LINKEDIN_MAX_WORDS'
  )
  const maxCharacters = overrides.maxCharacters ?? positiveInteger(
    process.env.LINKEDIN_MAX_CHARACTERS,
    DEFAULT_MAX_CHARACTERS,
    'LINKEDIN_MAX_CHARACTERS'
  )

  if (!Number.isSafeInteger(maxWords) || maxWords <= 0) {
    throw new Error('LinkedIn maxWords must be a positive integer')
  }
  if (!Number.isSafeInteger(maxCharacters) || maxCharacters <= 0) {
    throw new Error('LinkedIn maxCharacters must be a positive integer')
  }
  if (maxCharacters > LINKEDIN_CHARACTER_LIMIT) {
    throw new Error(`LinkedIn maxCharacters cannot exceed the platform limit of ${LINKEDIN_CHARACTER_LIMIT}`)
  }

  return { maxWords, maxCharacters }
}

export function countLinkedInWords(value: string): number {
  return value.trim().match(/\S+/gu)?.length ?? 0
}

export function countLinkedInCharacters(value: string): number {
  return Array.from(value).length
}

function countMatches(value: string, pattern: RegExp): number {
  return [...value.matchAll(pattern)].length
}

const UNNATURAL_PHRASES: Array<[RegExp, string]> = [
  [/\b(?:thrilled|excited) to (?:announce|share)\b/iu, 'generic announcement language'],
  [/\bgame[ -]?changer\b/iu, 'the phrase “game changer”'],
  [/\bin today[’']s (?:rapidly )?evolving world\b/iu, 'a generic trend opener'],
  [/\bhere[’']s the gist\b/iu, 'the phrase “here’s the gist”'],
  [/\bdrop a comment\b/iu, 'engagement-bait wording'],
  [/\blet[’']s dive in\b/iu, 'the phrase “let’s dive in”'],
  [/\bunlock the power\b/iu, 'the phrase “unlock the power”'],
  [/\bat Salesforce,? we\b/iu, 'an unsupported Salesforce-insider claim'],
  [/\b(?:my|our) clients?\b/iu, 'an unsupported client claim'],
]

export function validateLinkedInPost(
  post: string,
  postUrl: string,
  limits: LinkedInDraftLimits
): string[] {
  const errors: string[] = []
  const wordCount = countLinkedInWords(post)
  const characterCount = countLinkedInCharacters(post)
  const urlCount = post.split(postUrl).length - 1
  const allUrls = post.match(/https?:\/\/\S+/gu) ?? []
  const hashtagCount = countMatches(post, /(^|\s)#[A-Za-z0-9_]+/gu)
  const emojiCount = countMatches(post, /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu)

  if (!post.trim()) errors.push('draft is empty')
  if (wordCount > limits.maxWords) {
    errors.push(`draft has ${wordCount} words; limit is ${limits.maxWords}`)
  }
  if (characterCount > limits.maxCharacters) {
    errors.push(`draft has ${characterCount} characters; limit is ${limits.maxCharacters}`)
  }
  if (urlCount !== 1) errors.push(`article URL must appear exactly once; found ${urlCount}`)
  if (allUrls.length !== 1 || allUrls[0].replace(/[),.;]+$/u, '') !== postUrl) {
    errors.push('draft must contain only the canonical article URL')
  }
  if (hashtagCount > 3) errors.push(`draft has ${hashtagCount} hashtags; limit is 3`)
  if (emojiCount > 1) errors.push(`draft has ${emojiCount} emoji; limit is 1`)
  if (/^#{1,6}\s/mu.test(post)) errors.push('draft contains a Markdown heading')
  if (/\[[^\]]+\]\([^)]+\)/u.test(post)) errors.push('draft contains a Markdown link')
  if (/```/u.test(post)) errors.push('draft contains a code fence')

  for (const [pattern, description] of UNNATURAL_PHRASES) {
    if (pattern.test(post)) errors.push(`draft contains ${description}`)
  }

  return errors
}

function plainText(markdown: string): string {
  return markdown
    .replace(/```[\s\S]*?```/gu, ' ')
    .replace(/!\[[^\]]*\]\([^)]+\)/gu, ' ')
    .replace(/\[([^\]]+)\]\([^)]+\)/gu, '$1')
    .replace(/^#{1,6}\s+/gmu, '')
    .replace(/^>\s?/gmu, '')
    .replace(/^[-*+]\s+/gmu, '')
    .replace(/`([^`]+)`/gu, '$1')
    .replace(/[*_~]/gu, '')
    .replace(/<[^>]+>/gu, ' ')
    .replace(/\s+/gu, ' ')
    .trim()
}

function extractTldr(markdown: string): string[] {
  const match = markdown.match(/##\s*TL;?DR\s*\n([\s\S]*?)(?:\n##\s|$)/iu)
  if (!match) return []
  return match[1]
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => /^[-*+]\s+/u.test(line))
    .map((line) => plainText(line.replace(/^[-*+]\s+/u, '')))
    .filter(Boolean)
    .slice(0, 3)
}

function extractIntro(markdown: string): string[] {
  return markdown
    .split(/\n\s*\n/gu)
    .map((paragraph) => paragraph.trim())
    .filter((paragraph) => (
      paragraph.length > 0 &&
      !/^(?:#|!\[|```|[-*+]\s|\||---)/u.test(paragraph) &&
      !paragraph.includes('{IMAGE_PROMPT:')
    ))
    .map(plainText)
    .filter(Boolean)
    .slice(0, 4)
}

export function getCanonicalSiteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || 'https://www.bennierichard.com')
    .replace(/\/$/u, '')
}

function readArticle(slug: string): ArticleContext {
  if (!/^[a-z0-9][a-z0-9-]*$/u.test(slug)) {
    throw new Error('LinkedIn draft slug must contain only lowercase letters, numbers, and hyphens')
  }

  const postPath = path.join(process.cwd(), 'content/posts', `${slug}.mdx`)
  if (!fs.existsSync(postPath)) throw new Error(`Blog post not found: content/posts/${slug}.mdx`)

  const parsed = matter(fs.readFileSync(postPath, 'utf8'))
  const title = typeof parsed.data.title === 'string' ? parsed.data.title.trim() : slug
  const excerpt = typeof parsed.data.excerpt === 'string' ? parsed.data.excerpt.trim() : ''
  const keyword = typeof parsed.data.keyword === 'string' ? parsed.data.keyword.trim() : ''
  const tags = Array.isArray(parsed.data.tags)
    ? parsed.data.tags.filter((tag): tag is string => typeof tag === 'string' && Boolean(tag.trim()))
    : []
  const headings = [...parsed.content.matchAll(/^##\s+(.+)$/gmu)]
    .map((match) => plainText(match[1]))
    .filter((heading) => heading.toLowerCase() !== 'tl;dr')

  return {
    slug,
    title,
    excerpt,
    keyword,
    tags,
    intro: extractIntro(parsed.content),
    tldr: extractTldr(parsed.content),
    headings: headings.slice(0, 8),
    body: plainText(parsed.content).slice(0, 14000),
    postUrl: `${getCanonicalSiteUrl()}/blog/${slug}`,
  }
}

function configuredTextModels(): string[] {
  return [...new Set([
    process.env.LINKEDIN_PRIMARY_TEXT_MODEL || process.env.BLOG_PRIMARY_TEXT_MODEL || DEFAULT_TEXT_MODELS[0],
    process.env.LINKEDIN_FALLBACK_TEXT_MODEL || process.env.BLOG_FALLBACK_TEXT_MODEL || DEFAULT_TEXT_MODELS[1],
  ])]
}

function normalizeModelOutput(value: string): string {
  return value
    .trim()
    .replace(/^```(?:text|markdown)?\s*\n/iu, '')
    .replace(/\n```\s*$/u, '')
    .replace(/^LinkedIn (?:post )?draft:\s*/iu, '')
    .trim()
}

function buildGenerationPrompt(article: ArticleContext, limits: LinkedInDraftLimits): string {
  return `Write a paste-ready LinkedIn post for Bennie Joseph based only on the supplied article.

VOICE AND SHAPE
- Sound like a thoughtful technical practitioner, not a marketing team or an AI assistant.
- Use natural first-person voice only for writing or evaluating the public article. Never invent customer work, private Salesforce knowledge, personal outcomes, metrics, or first-hand participation.
- Open with a specific technical observation. Use varied sentence lengths and short paragraphs.
- Aim for 120–160 words. Hard maximum: ${limits.maxWords} words and ${limits.maxCharacters} characters.
- Use zero or one emoji. Use two or three relevant hashtags, all at the end.
- Include the exact article URL once on its own line: ${article.postUrl}
- End the prose with one sincere, topic-specific question before the URL.
- Avoid hype, generic engagement bait, keyword stuffing, “new post”, “excited to share”, “game changer”, “here’s the gist”, “drop a comment”, and “let’s dive in”.
- Do not use a title label, Markdown heading, Markdown link, code fence, or any URL other than the article URL.
- Return only the post copy.

ARTICLE
Title: ${article.title}
Excerpt: ${article.excerpt}
Primary keyword: ${article.keyword}
Tags: ${article.tags.join(', ')}
Opening: ${article.intro.join(' ')}
TL;DR: ${article.tldr.join(' | ')}
Sections: ${article.headings.join(' | ')}
Body context: ${article.body}`
}

function errorSummary(error: unknown): string {
  return error instanceof Error ? error.message : String(error)
}

async function generateWithOpenAI(
  article: ArticleContext,
  limits: LinkedInDraftLimits
): Promise<{ post: string; model: string } | undefined> {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    console.warn('[linkedin] OPENAI_API_KEY is not set; using the deterministic article-grounded fallback')
    return undefined
  }

  const client = new OpenAI({
    apiKey,
    baseURL: process.env.OPENAI_BASE_URL || 'https://us.api.openai.com/v1',
    maxRetries: 1,
    timeout: 2 * 60 * 1000,
  })
  const models = configuredTextModels()

  for (let index = 0; index < models.length; index += 1) {
    const model = models[index]
    console.log(`[linkedin] Draft attempt ${index + 1}/${models.length}: ${model}`)
    try {
      const response = await client.responses.create({
        model,
        instructions: 'You are a careful social editor. Never add facts or personal experiences that are absent from the source material.',
        input: buildGenerationPrompt(article, limits),
        max_output_tokens: 900,
        store: false,
      })
      const post = normalizeModelOutput(response.output_text || '')
      const errors = validateLinkedInPost(post, article.postUrl, limits)
      const wordCount = countLinkedInWords(post)
      if (wordCount < 80) errors.push(`draft has only ${wordCount} words; expected at least 80`)

      if (errors.length > 0) {
        throw new Error(errors.join('; '))
      }
      console.log(`[linkedin] ✓ Draft generated and validated with ${model}`)
      return { post, model }
    } catch (error) {
      console.warn(`[linkedin] ✗ ${model} failed: ${errorSummary(error)}`)
      if (index < models.length - 1) {
        console.warn(`[linkedin] ↻ Falling back automatically to ${models[index + 1]}`)
      }
    }
  }

  console.warn('[linkedin] All configured text models failed; using the deterministic article-grounded fallback')
  return undefined
}

function firstSentence(value: string, maxLength = 260): string {
  const normalized = plainText(value)
  const match = normalized.match(/^.+?[.!?](?:\s|$)/u)
  const sentence = (match?.[0] || normalized).trim()
  if (sentence.length <= maxLength) return sentence
  const shortened = sentence.slice(0, maxLength - 1).replace(/\s+\S*$/u, '')
  return `${shortened}…`
}

function safeFallbackLine(value: string): string {
  const line = firstSentence(value)
  return UNNATURAL_PHRASES.some(([pattern]) => pattern.test(line)) ? '' : line
}

const FALLBACK_STOP_WORDS = new Set([
  'about', 'after', 'also', 'and', 'before', 'but', 'does', 'every', 'for', 'from',
  'have', 'into', 'not', 'only', 'that', 'the', 'their', 'then', 'this', 'through',
  'with', 'your',
])

function meaningfulWords(value: string): Set<string> {
  return new Set(
    value
      .toLowerCase()
      .replace(/[^a-z0-9\s]/gu, ' ')
      .split(/\s+/gu)
      .filter((word) => word.length > 2 && !FALLBACK_STOP_WORDS.has(word))
  )
}

function substantiallyOverlaps(left: string, right: string): boolean {
  if (!left || !right) return false
  const leftWords = meaningfulWords(left)
  const rightWords = meaningfulWords(right)
  const smallerSize = Math.min(leftWords.size, rightWords.size)
  if (smallerSize === 0) return left.trim().toLowerCase() === right.trim().toLowerCase()
  const shared = [...leftWords].filter((word) => rightWords.has(word)).length
  return shared / smallerSize >= 0.5
}

function firstDistinctLine(values: string[], existing: string[]): string {
  for (const value of values) {
    const line = safeFallbackLine(value)
    if (line && existing.every((current) => !substantiallyOverlaps(line, current))) return line
  }
  return ''
}

function distinctFallbackLines(values: string[], existing: string[]): string[] {
  const selected: string[] = []
  for (const value of values) {
    const line = safeFallbackLine(value)
    if (!line) continue
    if ([...existing, ...selected].some((current) => substantiallyOverlaps(line, current))) continue
    selected.push(line)
  }
  return selected
}

function stableVariant(value: string, variantCount: number): number {
  return [...value].reduce((total, character) => total + character.codePointAt(0)!, 0) % variantCount
}

function hashtags(tags: string[]): string {
  const values = tags
    .map((tag) => tag.replace(/[^A-Za-z0-9]/gu, ''))
    .filter(Boolean)
    .filter((tag, index, all) => all.findIndex((item) => item.toLowerCase() === tag.toLowerCase()) === index)
  if (!values.some((tag) => tag.toLowerCase() === 'salesforce')) values.unshift('Salesforce')
  return values.slice(0, 3).map((tag) => `#${tag}`).join(' ')
}

function discussionQuestion(article: ArticleContext): string {
  if (article.tags.some((tag) => tag.toLowerCase() === 'winter27')) {
    return 'What is your team validating first for Winter ’27?'
  }
  if (article.tags.some((tag) => tag.toLowerCase() === 'dreamforce26')) {
    return 'Which Dreamforce ’26 announcement are you pressure-testing first?'
  }
  const topic = article.tags.find((tag) => tag.toLowerCase() !== 'salesforce')
  return topic
    ? `How is your team approaching ${topic} in production?`
    : 'What would you validate first before taking this into production?'
}

function buildFallbackDraft(article: ArticleContext, limits: LinkedInDraftLimits): string {
  const hook = safeFallbackLine(article.intro[0] || article.excerpt || article.title)
  const context = firstDistinctLine(
    [article.intro[1] || '', article.excerpt, article.intro[2] || ''],
    [hook]
  )
  const bullets = distinctFallbackLines(article.tldr, [hook, context])
  const takeaway = firstDistinctLine([article.excerpt, ...article.tldr], [hook, context, ...bullets])
  const tagLine = hashtags(article.tags)
  const question = discussionQuestion(article)
  const bulletIntroductions = [
    'I turned the article into a practical checklist:',
    'The guide focuses on the decisions behind the headline:',
    'These are the implementation checks I would make first:',
  ]
  const bulletIntroduction = bulletIntroductions[stableVariant(article.slug, bulletIntroductions.length)]
  const bulletSets = [bullets.slice(0, 3), bullets.slice(0, 2), bullets.slice(0, 1), []]

  for (const selectedBullets of bulletSets) {
    const paragraphs = [hook]
    if (context) paragraphs.push(context)
    if (selectedBullets.length > 0) {
      paragraphs.push(`${bulletIntroduction}\n\n${selectedBullets.map((item) => `• ${item}`).join('\n')}`)
    } else if (takeaway) {
      paragraphs.push(`The practical takeaway: ${takeaway.replace(/^[A-Z]/u, (letter) => letter.toLowerCase())}`)
    }
    paragraphs.push(question, article.postUrl, tagLine)
    const candidate = paragraphs.filter(Boolean).join('\n\n').trim()
    if (validateLinkedInPost(candidate, article.postUrl, limits).length === 0) return candidate
  }

  const minimal = `${hook || article.title}\n\n${question}\n\n${article.postUrl}\n\n${tagLine}`.trim()
  const errors = validateLinkedInPost(minimal, article.postUrl, limits)
  if (errors.length > 0) throw new Error(`Could not build a valid LinkedIn fallback: ${errors.join('; ')}`)
  return minimal
}

function writeFileAtomic(filePath: string, value: string): void {
  const temporaryPath = `${filePath}.tmp-${process.pid}`
  fs.writeFileSync(temporaryPath, value, 'utf8')
  fs.renameSync(temporaryPath, filePath)
}

function appendActionsSummary(result: LinkedInDraftResult): void {
  const summaryFile = process.env.GITHUB_STEP_SUMMARY
  if (!summaryFile) return
  const shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(result.postUrl)}`
  const summary = `\n## LinkedIn Post Draft — ${result.wordCount}/${result.limits.maxWords} words\n\n` +
    `Model: \`${result.model}\` · ${result.characterCount}/${result.limits.maxCharacters} characters · ` +
    `[open LinkedIn](${shareUrl}) · [preview article](${result.postUrl})\n\n` +
    `\`\`\`text\n${result.post}\n\`\`\`\n\n` +
    `> Human review required: make sure the phrasing sounds like you and that every claim still matches the article.\n`
  fs.appendFileSync(summaryFile, summary, 'utf8')
}

export async function generateLinkedInDraft(
  options: GenerateLinkedInDraftOptions
): Promise<LinkedInDraftResult> {
  const article = readArticle(options.slug)
  const limits = getLinkedInDraftLimits(options.limits)
  const draftsDirectory = path.join(process.cwd(), 'content/linkedin-drafts')
  const draftPath = path.join(draftsDirectory, `${article.slug}.md`)

  if (fs.existsSync(draftPath) && !options.force) {
    throw new Error(`LinkedIn draft already exists at content/linkedin-drafts/${article.slug}.md (use --force to replace it)`)
  }

  const generated = await generateWithOpenAI(article, limits)
  const post = generated?.post ?? buildFallbackDraft(article, limits)
  const errors = validateLinkedInPost(post, article.postUrl, limits)
  if (errors.length > 0) throw new Error(`LinkedIn draft validation failed: ${errors.join('; ')}`)

  const result: LinkedInDraftResult = {
    slug: article.slug,
    draftPath,
    post,
    model: generated?.model ?? 'deterministic-fallback',
    wordCount: countLinkedInWords(post),
    characterCount: countLinkedInCharacters(post),
    limits,
    postUrl: article.postUrl,
  }

  const document = matter.stringify(`${post}\n`, {
    slug: result.slug,
    sourceUrl: result.postUrl,
    generatedAt: new Date().toISOString(),
    model: result.model,
    maxWords: result.limits.maxWords,
    maxCharacters: result.limits.maxCharacters,
    wordCount: result.wordCount,
    characterCount: result.characterCount,
    humanReviewRequired: true,
  })
  fs.mkdirSync(draftsDirectory, { recursive: true })
  writeFileAtomic(draftPath, document)
  appendActionsSummary(result)

  console.log(`[linkedin] ✓ Saved ${result.wordCount}/${limits.maxWords}-word draft to content/linkedin-drafts/${article.slug}.md`)
  return result
}
