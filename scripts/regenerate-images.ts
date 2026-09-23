#!/usr/bin/env npx tsx
/**
 * Regenerate blog artwork with OpenAI GPT Image 2.
 *
 * Examples:
 *   npx tsx scripts/regenerate-images.ts --slug my-post
 *   npx tsx scripts/regenerate-images.ts --slug my-post --cover-only
 *   npx tsx scripts/regenerate-images.ts --all --confirm-all
 *
 * Regenerating every post is intentionally guarded because it can create
 * hundreds of paid image requests.
 */

import OpenAI from 'openai'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import {
  buildFallbackImageBrief,
  buildTopicImagePrompt,
  type BlogPillar,
  type ImagePurpose,
} from '../src/lib/image-styles'

const IMAGE_MODEL = 'gpt-image-2'
const IMAGE_FORMAT = 'webp'
const IMAGE_COMPRESSION = 86
// Accept historical slugs with a trailing hyphen while still excluding path
// separators, dots, whitespace, shell syntax, and traversal sequences.
const SAFE_SLUG_RE = /^[a-z0-9][a-z0-9-]*$/

interface ImageConfig {
  title: string
  keyword: string
  pillar: BlogPillar
  cover: string
  coverAlt: string
  images: string[]
  imageAlts: string[]
}

interface SidecarData {
  version?: number
  title?: string
  keyword?: string
  pillar?: BlogPillar
  textModel?: string
  cover?: string
  coverAlt?: string
  images?: unknown
  imageAlts?: unknown
}

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

loadLocalEnvironment()

function getOpenAIClient(): OpenAI {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is required to regenerate blog images')
  }
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    maxRetries: 1,
    timeout: 10 * 60 * 1000,
  })
}

function assertSafeSlug(slug: string | undefined): asserts slug is string {
  if (!slug || !SAFE_SLUG_RE.test(slug)) {
    throw new Error('Slug must contain only lowercase letters, numbers, and hyphens')
  }
}

function inferPillar(tags: unknown, title: string): BlogPillar {
  const values = Array.isArray(tags) ? tags.map(String) : []
  const searchable = `${values.join(' ')} ${title}`.toLowerCase()
  if (/career|roadmap|leadership/.test(searchable)) return 'career'
  if (/architecture|integration|governance|multi-org/.test(searchable)) return 'architecture'
  if (/agent|artificial intelligence|\bai\b|rag|llm|mcp/.test(searchable)) return 'ai-agentic'
  return 'salesforce'
}

function postPathForSlug(slug: string): string {
  const postsDirectory = path.resolve(process.cwd(), 'content/posts')
  const postPath = path.resolve(postsDirectory, `${slug}.mdx`)
  if (path.dirname(postPath) !== postsDirectory) {
    throw new Error(`Unsafe post path for slug: ${slug}`)
  }
  return postPath
}

function extractHeadings(content: string): string[] {
  return [...content.matchAll(/^##\s+(.+)$/gm)]
    .map((match) => match[1].replace(/[*_`]/g, '').trim())
    .filter((heading) => heading.toLowerCase() !== 'tl;dr')
    .slice(0, 7)
}

function semanticBrief(
  title: string,
  keyword: string,
  excerpt: string,
  headings: string[],
  purpose: ImagePurpose,
  index = 0
): string {
  const fallback = buildFallbackImageBrief(title, keyword, purpose, index)
  const sectionNames = headings.length ? headings.join('; ') : 'the article’s core implementation sections'

  if (purpose === 'cover') {
    return `${fallback} Article thesis: ${excerpt}. Draw concrete subject matter from these sections: ${sectionNames}.`
  }
  if (purpose === 'concept') {
    return `${fallback} Use the concepts behind these sections: ${headings.slice(0, 4).join('; ') || sectionNames}. Article thesis: ${excerpt}.`
  }
  return `${fallback} Build the flow from these implementation sections: ${headings.slice(2, 7).join('; ') || sectionNames}. Show validation and a recoverable failure path.`
}

function stringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string' && item.trim().length > 0) : []
}

function loadImageConfig(slug: string): ImageConfig {
  const postPath = postPathForSlug(slug)
  if (!fs.existsSync(postPath)) {
    throw new Error(`No post exists for slug: ${slug}`)
  }

  const rawPost = fs.readFileSync(postPath, 'utf-8')
  const parsedPost = matter(rawPost)
  const title = String(parsedPost.data.title || slug.replace(/-/g, ' '))
  const keyword = String(parsedPost.data.keyword || title)
  const excerpt = String(parsedPost.data.excerpt || title)
  const pillar = inferPillar(parsedPost.data.tags, title)
  const headings = extractHeadings(parsedPost.content)
  const sidecarPath = path.join(process.cwd(), 'content/posts', `${slug}.images.json`)
  const sidecar: SidecarData = fs.existsSync(sidecarPath)
    ? JSON.parse(fs.readFileSync(sidecarPath, 'utf-8')) as SidecarData
    : {}

  // Version 2 sidecars already contain full, topic-aware GPT Image prompts.
  if (
    sidecar.version === 2 &&
    typeof sidecar.cover === 'string' &&
    stringArray(sidecar.images).length > 0
  ) {
    const prompts = stringArray(sidecar.images)
    const alts = stringArray(sidecar.imageAlts)
    return {
      title: sidecar.title || title,
      keyword: sidecar.keyword || keyword,
      pillar: sidecar.pillar || pillar,
      cover: sidecar.cover,
      coverAlt: sidecar.coverAlt || `${title} technical cover illustration`,
      images: prompts,
      imageAlts: prompts.map((_, index) => alts[index] || `${title} technical diagram ${index + 1}`),
    }
  }

  // Older sidecars encoded rigid visual templates. Rebuild their prompts from
  // the post semantics so regeneration genuinely changes composition by topic.
  const existingImageCount = Math.max(
    stringArray(sidecar.images).length,
    [...rawPost.matchAll(new RegExp(`/images/blog/${slug}/image-(\\d+)\\.(?:png|webp|jpe?g)`, 'g'))].length,
    2
  )
  const inlinePurposes: ImagePurpose[] = ['concept', 'workflow']
  const images = Array.from({ length: existingImageCount }, (_, index) => {
    const purpose = inlinePurposes[index % inlinePurposes.length]
    return buildTopicImagePrompt({
      topic: title,
      keyword,
      pillar,
      purpose,
      brief: semanticBrief(title, keyword, excerpt, headings, purpose, index),
      variation: index + 1,
    })
  })

  return {
    title,
    keyword,
    pillar,
    cover: buildTopicImagePrompt({
      topic: title,
      keyword,
      pillar,
      purpose: 'cover',
      brief: semanticBrief(title, keyword, excerpt, headings, 'cover'),
      variation: 0,
    }),
    coverAlt: `${title} technical cover illustration`,
    images,
    imageAlts: images.map((_, index) => `${title} technical diagram ${index + 1}`),
  }
}

function isRetriable(error: unknown): boolean {
  const status = typeof error === 'object' && error !== null && 'status' in error
    ? Number((error as { status?: number }).status)
    : undefined
  if (!status || Number.isNaN(status)) return true
  return status === 408 || status === 409 || status === 429 || status >= 500
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error)
}

async function generateImage(
  client: OpenAI,
  prompt: string,
  purpose: ImagePurpose
): Promise<Buffer> {
  const response = await client.images.generate({
    model: IMAGE_MODEL,
    prompt,
    n: 1,
    size: purpose === 'cover' ? '1536x864' : '1024x1024',
    quality: purpose === 'cover' ? 'high' : 'medium',
    output_format: IMAGE_FORMAT,
    output_compression: IMAGE_COMPRESSION,
    background: 'opaque',
  })
  const base64 = response.data?.[0]?.b64_json
  if (!base64) throw new Error(`${IMAGE_MODEL} returned no base64 image data`)
  return Buffer.from(base64, 'base64')
}

async function generateImageWithRetry(
  client: OpenAI,
  prompt: string,
  purpose: ImagePurpose,
  maxAttempts = 3
): Promise<Buffer> {
  let lastError: unknown

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      console.log(`  ${IMAGE_MODEL} ${purpose} attempt ${attempt}/${maxAttempts}`)
      return await generateImage(client, prompt, purpose)
    } catch (error) {
      lastError = error
      if (!isRetriable(error) || attempt === maxAttempts) break
      const delayMs = 3000 * 2 ** (attempt - 1) + Math.floor(Math.random() * 750)
      console.warn(`  Attempt failed: ${errorMessage(error)}; retrying in ${Math.round(delayMs / 1000)}s`)
      await new Promise((resolve) => setTimeout(resolve, delayMs))
    }
  }

  throw new Error(`${IMAGE_MODEL} ${purpose} generation failed: ${errorMessage(lastError)}`)
}

function writeFileAtomic(filePath: string, data: string | Buffer): void {
  const temporaryPath = `${filePath}.tmp-${process.pid}`
  fs.writeFileSync(temporaryPath, data)
  fs.renameSync(temporaryPath, filePath)
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function updatePostImageReferences(
  slug: string,
  imageCount: number,
  updateCover: boolean,
  updateInline: boolean,
  coverAlt: string
): void {
  const postPath = postPathForSlug(slug)
  let raw = fs.readFileSync(postPath, 'utf-8')
  const encodedSlug = escapeRegExp(slug)
  const coverPath = `/images/blog/${slug}/cover.${IMAGE_FORMAT}`

  if (updateCover) {
    const coverReference = new RegExp(`/images/blog/${encodedSlug}/cover\\.(?:png|webp|jpe?g)`, 'g')
    if (coverReference.test(raw)) {
      raw = raw.replace(coverReference, coverPath)
    } else if (/^coverImage:/m.test(raw)) {
      raw = raw.replace(/^coverImage:\s*.*$/m, `coverImage: ${coverPath}`)
    } else {
      raw = raw.replace(/^---\n([\s\S]*?)\n---/, `---\n$1\ncoverImage: ${coverPath}\n---`)
    }

    const coverAltLine = `coverAlt: ${JSON.stringify(coverAlt)}`
    if (/^coverAlt:/m.test(raw)) {
      raw = raw.replace(/^coverAlt:\s*.*$/m, coverAltLine)
    } else {
      raw = raw.replace(/^coverImage:\s*.*$/m, (coverImageLine) => `${coverImageLine}\n${coverAltLine}`)
    }
  }

  if (updateInline) {
    for (let index = 1; index <= imageCount; index += 1) {
      const imageReference = new RegExp(
        `/images/blog/${encodedSlug}/image-${index}\\.(?:png|webp|jpe?g)`,
        'g'
      )
      raw = raw.replace(imageReference, `/images/blog/${slug}/image-${index}.${IMAGE_FORMAT}`)
    }
  }

  writeFileAtomic(postPath, raw)
}

function removeLegacyAssets(imageDirectory: string, baseNames: string[]): void {
  for (const baseName of baseNames) {
    for (const extension of ['png', 'jpg', 'jpeg']) {
      const legacyPath = path.join(imageDirectory, `${baseName}.${extension}`)
      if (fs.existsSync(legacyPath)) fs.unlinkSync(legacyPath)
    }
  }
}

function saveUpgradedSidecar(slug: string, config: ImageConfig): void {
  const sidecar = {
    version: 2,
    title: config.title,
    keyword: config.keyword,
    pillar: config.pillar,
    textModel: 'existing-post',
    imageModel: IMAGE_MODEL,
    format: IMAGE_FORMAT,
    compression: IMAGE_COMPRESSION,
    generatedAt: new Date().toISOString(),
    cover: config.cover,
    coverAlt: config.coverAlt,
    images: config.images,
    imageAlts: config.imageAlts,
  }
  writeFileAtomic(
    path.join(process.cwd(), 'content/posts', `${slug}.images.json`),
    `${JSON.stringify(sidecar, null, 2)}\n`
  )
}

async function regeneratePost(
  client: OpenAI,
  slug: string,
  coverOnly: boolean,
  inlineOnly: boolean
): Promise<void> {
  const config = loadImageConfig(slug)
  const imageDirectory = path.join(process.cwd(), 'public/images/blog', slug)
  fs.mkdirSync(imageDirectory, { recursive: true })
  const mode = coverOnly ? 'cover' : inlineOnly ? 'inline images' : 'cover and inline images'
  console.log(`\nRegenerating ${mode}: ${slug}`)

  if (!inlineOnly) {
    const cover = await generateImageWithRetry(client, config.cover, 'cover')
    writeFileAtomic(path.join(imageDirectory, `cover.${IMAGE_FORMAT}`), cover)
  }

  if (!coverOnly) {
    const purposes: ImagePurpose[] = ['concept', 'workflow']
    for (let index = 0; index < config.images.length; index += 1) {
      console.log(`  Inline image ${index + 1}/${config.images.length}`)
      const image = await generateImageWithRetry(
        client,
        config.images[index],
        purposes[index % purposes.length]
      )
      writeFileAtomic(path.join(imageDirectory, `image-${index + 1}.${IMAGE_FORMAT}`), image)
    }
  }

  updatePostImageReferences(slug, config.images.length, !inlineOnly, !coverOnly, config.coverAlt)
  saveUpgradedSidecar(slug, config)

  const convertedNames: string[] = []
  if (!inlineOnly) convertedNames.push('cover', 'cover-v2')
  if (!coverOnly) {
    convertedNames.push(...config.images.map((_, index) => `image-${index + 1}`))
  }
  removeLegacyAssets(imageDirectory, convertedNames)
  console.log(`  ✓ Saved compressed ${IMAGE_FORMAT.toUpperCase()} assets and updated exact MDX references`)
}

function parseArguments(): {
  slugs: string[]
  coverOnly: boolean
  inlineOnly: boolean
} {
  const args = process.argv.slice(2)
  const slugIndex = args.indexOf('--slug')
  const regenerateAll = args.includes('--all')
  const confirmAll = args.includes('--confirm-all')
  const coverOnly = args.includes('--cover-only')
  const inlineOnly = args.includes('--inline-only')

  if (coverOnly && inlineOnly) {
    throw new Error('Choose only one of --cover-only or --inline-only')
  }
  if (slugIndex !== -1 && regenerateAll) {
    throw new Error('Choose either --slug or --all, not both')
  }

  if (slugIndex !== -1) {
    const slug = args[slugIndex + 1]
    assertSafeSlug(slug)
    return { slugs: [slug], coverOnly, inlineOnly }
  }

  if (!regenerateAll) {
    throw new Error('Specify --slug <post-slug>, or use --all --confirm-all for every post')
  }
  if (!confirmAll) {
    throw new Error('Refusing a paid all-post run without the explicit --confirm-all guard')
  }

  const postsDirectory = path.join(process.cwd(), 'content/posts')
  const slugs = fs.readdirSync(postsDirectory)
    .filter((file) => file.endsWith('.mdx'))
    .map((file) => file.slice(0, -4))
    .filter((slug) => SAFE_SLUG_RE.test(slug))
    .sort()
  return { slugs, coverOnly, inlineOnly }
}

async function main(): Promise<void> {
  const { slugs, coverOnly, inlineOnly } = parseArguments()
  const imagesPerPost = coverOnly ? 1 : inlineOnly ? 2 : 3
  console.log(`Regenerating approximately ${slugs.length * imagesPerPost} image(s) across ${slugs.length} post(s).`)
  console.log(`Model: ${IMAGE_MODEL}; format: ${IMAGE_FORMAT}; compression: ${IMAGE_COMPRESSION}`)

  const client = getOpenAIClient()
  for (const slug of slugs) {
    await regeneratePost(client, slug, coverOnly, inlineOnly)
  }
  console.log('\nAll requested blog images were regenerated successfully.')
}

main().catch((error) => {
  console.error(`Image regeneration failed: ${errorMessage(error)}`)
  process.exit(1)
})
