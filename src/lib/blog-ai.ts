import OpenAI from 'openai'
import fs from 'fs'
import os from 'os'
import path from 'path'
import {
  buildFallbackImageBrief,
  buildTopicImagePrompt,
  type BlogPillar,
  type ImagePurpose,
} from './image-styles'

const DEFAULT_TEXT_MODELS = ['gpt-6-astra', 'gpt-5.6-sol'] as const
export const BLOG_IMAGE_MODEL = 'gpt-image-2'
export const BLOG_IMAGE_FORMAT = 'webp'
const BLOG_IMAGE_COMPRESSION = 86
const FACT_SNAPSHOT_DATE = '2026-09-23'

let openAIClient: OpenAI | undefined

function getOpenAIClient(): OpenAI {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is required for blog and image generation')
  }

  openAIClient ??= new OpenAI({
    apiKey,
    maxRetries: 1,
    timeout: 10 * 60 * 1000,
  })
  return openAIClient
}

export interface GeneratePostOptions {
  title: string
  keyword: string
  pillar: BlogPillar
  tags: string[]
  /** Official pages the article must consult and cite. */
  sourceUrls?: string[]
  /** Verified wording that constrains preview, pilot, rollout, and GA claims. */
  factNotes?: string[]
}

interface GeneratedPost {
  mdx: string
  model: string
}

interface SaveOptions {
  force?: boolean
}

interface ImageSidecar {
  version: 2
  title: string
  keyword: string
  pillar: BlogPillar
  textModel: string
  imageModel: typeof BLOG_IMAGE_MODEL
  format: typeof BLOG_IMAGE_FORMAT
  compression: number
  generatedAt: string
  cover: string
  coverAlt: string
  images: string[]
  imageAlts: string[]
}

// This is a dated fact ledger, not a license to extrapolate. The generation
// prompt also enables official-domain web search so later scheduled runs can
// verify whether preview/pilot statements have changed.
const PLATFORM_CONTEXT = `
FACT SNAPSHOT: ${FACT_SNAPSHOT_DATE}. Verify time-sensitive status against official sources at generation time.

OPENAI GENERATION STACK:
- Preferred text model: gpt-6-astra. Automatic fallback: gpt-5.6-sol.
- Image model: gpt-image-2 through the OpenAI Image API.
- Never silently replace these with an older model name in examples.

SALESFORCE RELEASE CONTEXT:
- Summer '26 maps to platform API v67.0.
- Winter '27 maps to platform API v68.0.
- On September 23, 2026, Winter '27 is in preview and rolling production deployment, not universally available. Production weekends are September 4, October 2, and October 9, with the overall release date listed as October 12. Always tell readers to verify the target org's instance and enabled features.
- Do not call a v68 feature generally available merely because it appears in preview release notes. State the documented status and org/release dependency.

DREAMFORCE '26 STATUS GUARDRAILS:
- AIforce was announced as a new Salesforce AI lab/initiative. It is not a generally available product or runtime.
- Headless 360 is an announced expansion and direction spanning multiple enterprise capabilities. Do not make a blanket GA claim; name and source the status of each individual capability.
- Koa is being piloted with select customers. Salesforce described expected U.S. general availability in winter 2026; as of this snapshot, do not describe Koa as GA.

WRITING GUARDRAIL:
- Separate announcement, research initiative, pilot, preview, beta, rollout, and GA. Those words are not interchangeable.
- Prefer "Data 360" for current Salesforce naming, but explain "formerly Data Cloud" once when it helps discoverability.
`

const SYSTEM_PROMPT = `You write technical articles for Bennie Joseph, a Salesforce Certified Application Architect with 9+ years of enterprise experience who is now a Customer Success Manager at Salesforce.

Write with a direct practitioner voice, but never invent Bennie's client history, project outcomes, private Salesforce information, customer details, metrics, or first-hand participation. If a scenario is not supplied as a verified personal fact, label it as a hypothetical or composite architecture scenario. Do not imply access to non-public roadmaps.

${PLATFORM_CONTEXT}

CONTENT RULES:
- Output only raw MDX beginning with YAML frontmatter. Do not wrap it in a code fence.
- Do not use MDX imports, exports, JSX components, script tags, or raw HTML.
- Use ## for H2 and ### for H3. Every fenced code block must name its language.
- Include at least one runnable or realistically complete Apex, LWC, TypeScript, or Python example.
- Explain operational tradeoffs: security, limits, observability, failure modes, rollout, and cost where relevant.
- Architecture posts need a decision matrix and must address behavior at small, medium, and enterprise scale.
- End with a ## TL;DR section containing no more than three bullets.
- Cite current or release-specific claims with descriptive Markdown links to official sources. Never invent a URL or source title.
- Do not mention CTA, CTA preparation, Certified Technical Architect study, or certification exam preparation. Tags must never contain CTA.
- Target 1,500–2,600 useful words; architecture posts may reach 3,200 when the extra depth is earned.

IMAGE BRIEF RULES:
- Immediately after frontmatter, emit exactly one line in this format:
  {COVER_PROMPT: "2–4 sentence topic-specific visual brief" | ALT: "descriptive alt text under 20 words"}
- At two natural breakpoints, emit exactly two lines in this format:
  {IMAGE_PROMPT: "2–4 sentence topic-specific visual brief" | ALT: "descriptive alt text under 20 words"}
- Describe the actual objects, components, decisions, states, or code concepts to depict. Do not prescribe a reusable poster template.
- Make the cover a memorable visual thesis, the first inline image a mental model, and the second a workflow or implementation path. They must not share the same composition.
- Prefer no embedded image text; when a diagram truly needs it, use at most two short labels. Never request paragraphs, fake code, company logos, watermarks, or an author portrait.
- Avoid generic robots, brains, handshakes, cloud diagrams, agent loops, and decorative node graphs unless the topic specifically requires them.`

function buildPrompt(opts: GeneratePostOptions): string {
  const today = new Date().toISOString().split('T')[0]
  const sources = opts.sourceUrls?.length
    ? opts.sourceUrls.map((url) => `- ${url}`).join('\n')
    : '- Find and cite relevant official Salesforce or OpenAI primary documentation.'
  const facts = opts.factNotes?.length
    ? opts.factNotes.map((note) => `- ${note}`).join('\n')
    : '- Do not infer a product status that is not documented by an official source.'

  return `Write the complete post for this brief.

Title: "${opts.title}"
Primary keyword: "${opts.keyword}"
Pillar: ${opts.pillar}
Tags: ${opts.tags.join(', ')}
Publication date: ${today}

VERIFIED FACT NOTES:
${facts}

PRIMARY SOURCES TO CONSULT AND CITE:
${sources}

The frontmatter must contain exactly these core fields (you may add a sources list):
---
title: "${opts.title.replace(/"/g, '\\"')}"
excerpt: "A concrete, accurate summary of at most 160 characters"
date: "${today}"
lastVerified: "${today}"
tags: [${opts.tags.map((tag) => `"${tag.replace(/"/g, '\\"')}"`).join(', ')}]
keyword: "${opts.keyword.replace(/"/g, '\\"')}"
featured: false
---

Use the sources as evidence inside the article, not as an undigested link dump. Explicitly identify preview, pilot, rollout, and GA status where relevant. Include a realistic code example, two different inline image briefs, and the final TL;DR.`
}

const COVER_DIRECTIVE_RE = /\{COVER_PROMPT:\s*"((?:[^"\\]|\\.)*)"\s*\|\s*ALT:\s*"((?:[^"\\]|\\.)*)"\s*\}\n?/
const IMAGE_PLACEHOLDER_RE = /\{IMAGE_PROMPT:\s*"((?:[^"\\]|\\.)*)"\s*\|\s*ALT:\s*"((?:[^"\\]|\\.)*)"\s*\}/g

function normalizeModelOutput(value: string): string {
  return value
    .trim()
    .replace(/^```(?:mdx|markdown)?\s*\n/i, '')
    .replace(/\n```\s*$/, '')
    .trim()
}

function decodeDirectiveValue(value: string): string {
  try {
    return JSON.parse(`"${value}"`) as string
  } catch {
    return value.replace(/\\"/g, '"').replace(/\\\\/g, '\\')
  }
}

function validateGeneratedMdx(mdx: string, opts: GeneratePostOptions): void {
  if (!mdx.startsWith('---\n')) {
    throw new Error('Generated content does not begin with MDX frontmatter')
  }
  if (!mdx.includes(`title: "${opts.title.replace(/"/g, '\\"')}"`)) {
    throw new Error('Generated frontmatter title does not match the requested topic')
  }
  if (!COVER_DIRECTIVE_RE.test(mdx)) {
    throw new Error('Generated content is missing a complete COVER_PROMPT and ALT directive')
  }

  const inlineDirectives = [...mdx.matchAll(IMAGE_PLACEHOLDER_RE)]
  if (inlineDirectives.length !== 2) {
    throw new Error(`Generated content must contain exactly 2 inline image directives; received ${inlineDirectives.length}`)
  }
  if (inlineDirectives.some((match) => !decodeDirectiveValue(match[2]).trim())) {
    throw new Error('Every inline image directive must include descriptive alt text')
  }

  const outsideCodeFences = mdx.replace(/```[\s\S]*?```/g, '')
  if (
    /^\s*(?:import|export)\s/m.test(outsideCodeFences) ||
    /<script\b/i.test(outsideCodeFences) ||
    /<(?!https?:\/\/)[A-Za-z][^>]*>/.test(outsideCodeFences)
  ) {
    throw new Error('Generated content contains executable MDX, JSX, or raw HTML syntax')
  }

  if (!/```(?:apex|typescript|javascript|python|soql)\s/i.test(mdx)) {
    throw new Error('Generated content is missing a language-tagged technical code example')
  }

  if (!/^## TL;DR\s*$/m.test(mdx)) {
    throw new Error('Generated content is missing the required TL;DR section')
  }

  if (opts.sourceUrls?.length) {
    const citedUrls = mdx.match(/https:\/\/(?:www\.)?(?:salesforce\.com|developer\.salesforce\.com|help\.salesforce\.com|admin\.salesforce\.com|developers\.openai\.com)\/[^\s)\]]+/g) ?? []
    const citedCount = new Set(citedUrls).size
    const minimumCitations = Math.min(2, opts.sourceUrls.length)
    if (citedCount < minimumCitations) {
      throw new Error(`Generated content cited ${citedCount} official source URL(s); expected at least ${minimumCitations}`)
    }
  }
}

function configuredTextModels(): string[] {
  const models = [
    process.env.BLOG_PRIMARY_TEXT_MODEL || DEFAULT_TEXT_MODELS[0],
    process.env.BLOG_FALLBACK_TEXT_MODEL || DEFAULT_TEXT_MODELS[1],
  ]
  return [...new Set(models)]
}

function errorSummary(error: unknown): string {
  if (error instanceof Error) return error.message
  return String(error)
}

async function generatePostWithMetadata(opts: GeneratePostOptions): Promise<GeneratedPost> {
  const client = getOpenAIClient()
  const errors: string[] = []
  const models = configuredTextModels()

  for (let index = 0; index < models.length; index += 1) {
    const model = models[index]
    console.log(`[blog] Text generation attempt ${index + 1}/${models.length}: ${model} via Responses API`)

    try {
      const response = await client.responses.create({
        model,
        instructions: SYSTEM_PROMPT,
        input: buildPrompt(opts),
        max_output_tokens: 16000,
        store: false,
        tools: [
          {
            type: 'web_search',
            filters: {
              allowed_domains: [
                'salesforce.com',
                'developer.salesforce.com',
                'help.salesforce.com',
                'admin.salesforce.com',
                'developers.openai.com',
              ],
            },
            search_context_size: 'medium',
          },
        ],
      })

      const mdx = normalizeModelOutput(response.output_text || '')
      if (!mdx) {
        throw new Error(`OpenAI returned no text (response status: ${response.status})`)
      }

      validateGeneratedMdx(mdx, opts)
      console.log(`[blog] ✓ Text generated and validated with ${model}`)
      return { mdx, model }
    } catch (error) {
      const summary = errorSummary(error)
      errors.push(`${model}: ${summary}`)
      console.warn(`[blog] ✗ ${model} failed: ${summary}`)
      if (index < models.length - 1) {
        console.warn(`[blog] ↻ Falling back automatically to ${models[index + 1]}`)
      }
    }
  }

  throw new Error(`All configured text models failed. ${errors.join(' | ')}`)
}

/** Generate validated MDX, preferring gpt-6-astra with gpt-5.6-sol fallback. */
export async function generatePost(opts: GeneratePostOptions): Promise<string> {
  const result = await generatePostWithMetadata(opts)
  return result.mdx
}

export function toPostSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/[\s-]+/g, '-')
    .slice(0, 60)
    .replace(/-+$/g, '')
}

function isRetriableImageError(error: unknown): boolean {
  const status = typeof error === 'object' && error !== null && 'status' in error
    ? Number((error as { status?: number }).status)
    : undefined
  if (!status || Number.isNaN(status)) return true
  return status === 408 || status === 409 || status === 429 || status >= 500
}

async function generateImage(prompt: string, purpose: ImagePurpose): Promise<Buffer> {
  const response = await getOpenAIClient().images.generate({
    model: BLOG_IMAGE_MODEL,
    prompt,
    n: 1,
    size: purpose === 'cover' ? '1536x864' : '1024x1024',
    quality: purpose === 'cover' ? 'high' : 'medium',
    output_format: BLOG_IMAGE_FORMAT,
    output_compression: BLOG_IMAGE_COMPRESSION,
    background: 'opaque',
  })
  const base64 = response.data?.[0]?.b64_json
  if (!base64) {
    throw new Error(`${BLOG_IMAGE_MODEL} returned no base64 image data`)
  }
  return Buffer.from(base64, 'base64')
}

async function generateImageWithRetry(
  prompt: string,
  purpose: ImagePurpose,
  maxAttempts = 3
): Promise<Buffer> {
  let lastError: unknown

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      console.log(`[blog] ${BLOG_IMAGE_MODEL} ${purpose} image attempt ${attempt}/${maxAttempts}`)
      return await generateImage(prompt, purpose)
    } catch (error) {
      lastError = error
      const summary = errorSummary(error)
      if (!isRetriableImageError(error) || attempt === maxAttempts) {
        throw new Error(`${BLOG_IMAGE_MODEL} ${purpose} generation failed: ${summary}`)
      }
      const delayMs = 3000 * 2 ** (attempt - 1) + Math.floor(Math.random() * 750)
      console.warn(`[blog] Image attempt failed: ${summary}; retrying in ${Math.round(delayMs / 1000)}s`)
      await new Promise((resolve) => setTimeout(resolve, delayMs))
    }
  }

  throw lastError instanceof Error ? lastError : new Error(String(lastError))
}

function writeFileAtomic(filePath: string, data: string | Buffer): void {
  const temporaryPath = `${filePath}.tmp-${process.pid}`
  fs.writeFileSync(temporaryPath, data)
  fs.renameSync(temporaryPath, filePath)
}

function saveRecoveryDraft(slug: string, mdx: string): string {
  const root = process.env.RUNNER_TEMP || os.tmpdir()
  const draftDir = path.join(root, 'portfolio-blog-generation')
  fs.mkdirSync(draftDir, { recursive: true })
  const draftPath = path.join(draftDir, `${slug}.mdx`)
  writeFileAtomic(draftPath, mdx)
  return draftPath
}

function removeLegacyPng(imageDirectory: string, baseName: string): void {
  const oldPath = path.join(imageDirectory, `${baseName}.png`)
  if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath)
}

export async function generateAndSave(
  opts: GeneratePostOptions,
  saveOptions: SaveOptions = {}
): Promise<string> {
  const slug = toPostSlug(opts.title)
  if (!slug) throw new Error('The post title did not produce a safe slug')

  const postsDirectory = path.join(process.cwd(), 'content/posts')
  const postPath = path.join(postsDirectory, `${slug}.mdx`)
  if (fs.existsSync(postPath) && !saveOptions.force) {
    throw new Error(`Post already exists at content/posts/${slug}.mdx (use --force to replace it)`)
  }

  const generated = await generatePostWithMetadata(opts)
  const recoveryDraft = saveRecoveryDraft(slug, generated.mdx)
  console.log(`[blog] Recovery draft saved at ${recoveryDraft}`)

  let mdx = generated.mdx
  const coverMatch = mdx.match(COVER_DIRECTIVE_RE)
  const coverBrief = coverMatch
    ? decodeDirectiveValue(coverMatch[1])
    : buildFallbackImageBrief(opts.title, opts.keyword, 'cover')
  const coverAlt = coverMatch
    ? decodeDirectiveValue(coverMatch[2])
    : `${opts.title} technical cover illustration`
  if (coverMatch) mdx = mdx.replace(coverMatch[0], '')

  const inlineMatches = [...mdx.matchAll(IMAGE_PLACEHOLDER_RE)]
  const inlinePurposes: ImagePurpose[] = ['concept', 'workflow']
  const inlinePrompts = inlineMatches.map((match, index) => buildTopicImagePrompt({
    topic: opts.title,
    keyword: opts.keyword,
    pillar: opts.pillar,
    purpose: inlinePurposes[index],
    brief: decodeDirectiveValue(match[1]) || buildFallbackImageBrief(opts.title, opts.keyword, inlinePurposes[index], index),
    variation: index + 1,
  }))
  const inlineAlts = inlineMatches.map((match) => decodeDirectiveValue(match[2]))
  const coverPrompt = buildTopicImagePrompt({
    topic: opts.title,
    keyword: opts.keyword,
    pillar: opts.pillar,
    purpose: 'cover',
    brief: coverBrief,
    variation: 0,
  })

  const imageDirectory = path.join(process.cwd(), 'public/images/blog', slug)
  fs.mkdirSync(imageDirectory, { recursive: true })

  console.log(`[blog] Generating topic-specific cover with ${BLOG_IMAGE_MODEL}`)
  const coverBuffer = await generateImageWithRetry(coverPrompt, 'cover')
  writeFileAtomic(path.join(imageDirectory, `cover.${BLOG_IMAGE_FORMAT}`), coverBuffer)

  for (let index = 0; index < inlinePrompts.length; index += 1) {
    const baseName = `image-${index + 1}`
    console.log(`[blog] Generating distinct inline image ${index + 1}/${inlinePrompts.length}`)
    const imageBuffer = await generateImageWithRetry(inlinePrompts[index], inlinePurposes[index])
    writeFileAtomic(path.join(imageDirectory, `${baseName}.${BLOG_IMAGE_FORMAT}`), imageBuffer)
    mdx = mdx.replace(
      inlineMatches[index][0],
      `\n![${inlineAlts[index]}](/images/blog/${slug}/${baseName}.${BLOG_IMAGE_FORMAT})\n`
    )
  }

  const frontmatterEnd = mdx.indexOf('\n---', 4)
  if (frontmatterEnd === -1) throw new Error('Could not locate the closing frontmatter delimiter')
  mdx = `${mdx.slice(0, frontmatterEnd)}\ncoverImage: /images/blog/${slug}/cover.${BLOG_IMAGE_FORMAT}\ncoverAlt: ${JSON.stringify(coverAlt)}${mdx.slice(frontmatterEnd)}`

  const sidecar: ImageSidecar = {
    version: 2,
    title: opts.title,
    keyword: opts.keyword,
    pillar: opts.pillar,
    textModel: generated.model,
    imageModel: BLOG_IMAGE_MODEL,
    format: BLOG_IMAGE_FORMAT,
    compression: BLOG_IMAGE_COMPRESSION,
    generatedAt: new Date().toISOString(),
    cover: coverPrompt,
    coverAlt,
    images: inlinePrompts,
    imageAlts: inlineAlts,
  }

  fs.mkdirSync(postsDirectory, { recursive: true })
  writeFileAtomic(path.join(postsDirectory, `${slug}.images.json`), `${JSON.stringify(sidecar, null, 2)}\n`)
  writeFileAtomic(postPath, `${mdx.trim()}\n`)

  removeLegacyPng(imageDirectory, 'cover')
  for (let index = 0; index < inlinePrompts.length; index += 1) {
    removeLegacyPng(imageDirectory, `image-${index + 1}`)
  }
  if (fs.existsSync(recoveryDraft)) fs.unlinkSync(recoveryDraft)

  console.log(`[blog] ✓ Saved ${slug} using ${generated.model} + ${BLOG_IMAGE_MODEL}`)
  return slug
}

const WINTER_27_OVERVIEW = 'https://www.salesforce.com/news/stories/winter-2027-product-release-announcement/'
const WINTER_27_COUNTDOWN = 'https://admin.salesforce.com/blog/2026/admin-winter-27-release-countdown'
const WINTER_27_NOTES = 'https://help.salesforce.com/s/articleView?id=release-notes.salesforce_release_notes.htm&language=en_US&release=220&type=5'
const APEX_V68_NOTES = 'https://help.salesforce.com/s/articleView?id=release-notes.rn_apex.htm&language=en_US&type=5'
const LWC_V68_NOTES = 'https://help.salesforce.com/s/articleView?id=release-notes.rn_lc.htm&language=en_US&type=5'
const FLOW_V68_NOTES = 'https://help.salesforce.com/s/articleView?id=platform.automate_flow_versioned_updates_68.htm&language=en_US&type=5'
const AGENTFORCE_METADATA_NOTES = 'https://help.salesforce.com/s/articleView?id=release-notes.rn_agentforce_metadata.htm&language=en_US&type=5'
const AIFORCE_ANNOUNCEMENT = 'https://www.salesforce.com/au/news/stories/aiforce-announcement/'
const HEADLESS_360_UPDATE = 'https://www.salesforce.com/news/stories/expanding-headless-360-enterprise-capabilities/'
const KOA_ANNOUNCEMENT = 'https://www.salesforce.com/uk/news/stories/koa-reasoning-model/'

/**
 * Timely topics come first so the weekly job does not spend months clearing an
 * obsolete queue before covering the current release. Source URLs and status
 * notes travel with each topic and become hard constraints in the prompt.
 */
export const TOPIC_BACKLOG: GeneratePostOptions[] = [
  {
    title: "Winter '27 API v68: A Release Readiness Guide Without Preview Surprises",
    keyword: 'salesforce winter 27 api v68 release readiness',
    pillar: 'salesforce',
    tags: ['Salesforce', 'Winter27', 'API', 'Release Management'],
    sourceUrls: [WINTER_27_COUNTDOWN, WINTER_27_OVERVIEW, WINTER_27_NOTES],
    factNotes: [
      "API v68 belongs to Winter '27.",
      "As of September 23, 2026, Winter '27 is in preview and rolling production deployment; the overall release date is October 12.",
      'Feature availability depends on the target org and instance rollout.',
    ],
  },
  {
    title: "Apex in Winter '27: Testing API v68 Changes Before Your Org Upgrades",
    keyword: 'apex winter 27 api v68 changes testing',
    pillar: 'salesforce',
    tags: ['Salesforce', 'Apex', 'Winter27', 'Testing'],
    sourceUrls: [APEX_V68_NOTES, WINTER_27_COUNTDOWN, WINTER_27_NOTES],
    factNotes: [
      'Treat v68 release-note behavior as preview or rollout-dependent until the target org is upgraded.',
      'Separate compile-version behavior from org-runtime behavior in every example.',
    ],
  },
  {
    title: "LWC API v68 Versioning: A Safe Winter '27 Upgrade Playbook",
    keyword: 'lwc api version 68 winter 27 versioning',
    pillar: 'salesforce',
    tags: ['Salesforce', 'LWC', 'Winter27', 'JavaScript'],
    sourceUrls: [LWC_V68_NOTES, WINTER_27_COUNTDOWN, WINTER_27_NOTES],
    factNotes: [
      'State precisely which LWC behavior is tied to component API versioning.',
      'Do not imply every org has completed the Winter 27 rollout on September 23, 2026.',
    ],
  },
  {
    title: "Flow Versioned Updates in Winter '27: Test, Activate, and Roll Back Safely",
    keyword: 'salesforce flow versioned updates winter 27 v68',
    pillar: 'salesforce',
    tags: ['Salesforce', 'Flow', 'Winter27', 'Release Management'],
    sourceUrls: [FLOW_V68_NOTES, WINTER_27_COUNTDOWN, WINTER_27_NOTES],
    factNotes: [
      'Explain versioned updates only as documented for v68 and distinguish preview from activated production behavior.',
    ],
  },
  {
    title: "Agentforce Metadata in Winter '27: What Belongs in Source Control",
    keyword: 'agentforce metadata winter 27 source control devops',
    pillar: 'salesforce',
    tags: ['Salesforce', 'Agentforce', 'Winter27', 'DevOps'],
    sourceUrls: [AGENTFORCE_METADATA_NOTES, WINTER_27_NOTES, WINTER_27_OVERVIEW],
    factNotes: [
      'Use only metadata types and lifecycle behavior explicitly documented in the Winter 27 notes.',
      'Do not claim a metadata capability is GA without an explicit official status.',
    ],
  },
  {
    title: "AIforce After Dreamforce '26: An Engineering Evaluation Framework, Not Another Runtime",
    keyword: 'salesforce aiforce dreamforce 2026 engineering',
    pillar: 'ai-agentic',
    tags: ['Salesforce', 'AIforce', 'Dreamforce26', 'AI'],
    sourceUrls: [AIFORCE_ANNOUNCEMENT, HEADLESS_360_UPDATE, WINTER_27_OVERVIEW],
    factNotes: [
      'AIforce is a newly announced AI lab and initiative, not a generally available product or runtime.',
      'Focus on the research-to-product evaluation questions an enterprise team should ask.',
    ],
  },
  {
    title: 'Koa Pilot: How to Evaluate a Salesforce Reasoning Model Before GA',
    keyword: 'salesforce koa reasoning model pilot evaluation',
    pillar: 'ai-agentic',
    tags: ['Salesforce', 'Koa', 'Dreamforce26', 'AI Evaluation'],
    sourceUrls: [KOA_ANNOUNCEMENT, AIFORCE_ANNOUNCEMENT, WINTER_27_OVERVIEW],
    factNotes: [
      'Koa is being piloted with select customers as of September 23, 2026.',
      'Salesforce stated expected U.S. GA in winter 2026; do not present that expectation as completed GA.',
      'Use a hypothetical evaluation harness, not invented benchmark results.',
    ],
  },
  {
    title: "Headless 360 After Dreamforce '26: Map Capabilities Before You Design the Architecture",
    keyword: 'salesforce headless 360 dreamforce 2026 architecture',
    pillar: 'architecture',
    tags: ['Salesforce', 'Headless360', 'Dreamforce26', 'Architecture'],
    sourceUrls: [HEADLESS_360_UPDATE, AIFORCE_ANNOUNCEMENT, WINTER_27_OVERVIEW],
    factNotes: [
      'Headless 360 is an announced expansion across multiple enterprise capabilities.',
      'Avoid a blanket GA statement; list individual capability status only when the official page supports it.',
    ],
  },
  {
    title: "Dreamforce '26 Architecture Debrief: Separate Announcements, Pilots, Preview, and GA",
    keyword: 'dreamforce 2026 salesforce technical announcements status',
    pillar: 'architecture',
    tags: ['Salesforce', 'Dreamforce26', 'Architecture', 'Release Management'],
    sourceUrls: [AIFORCE_ANNOUNCEMENT, HEADLESS_360_UPDATE, KOA_ANNOUNCEMENT, WINTER_27_OVERVIEW],
    factNotes: [
      'Build a sourced status matrix; do not collapse initiative, pilot, preview, rollout, and GA into one category.',
    ],
  },
  {
    title: 'Agentforce and MCP Security: Identity, Tool Permissions, and Audit Boundaries',
    keyword: 'agentforce mcp security identity tool permissions',
    pillar: 'architecture',
    tags: ['Salesforce', 'Agentforce', 'MCP', 'Security'],
    sourceUrls: [HEADLESS_360_UPDATE, WINTER_27_NOTES, AGENTFORCE_METADATA_NOTES],
    factNotes: [
      'Use least privilege, explicit tool allowlists, human approval for consequential writes, and auditable execution as design principles.',
    ],
  },
  {
    title: 'Release Architecture for a 50-Developer Salesforce Team',
    keyword: 'salesforce release architecture branching large team',
    pillar: 'architecture',
    tags: ['Salesforce', 'Architecture', 'DevOps', 'Governance'],
    sourceUrls: [WINTER_27_COUNTDOWN, WINTER_27_NOTES],
    factNotes: [
      'Use a clearly labeled composite scenario. Do not claim it is Bennie’s customer or project.',
    ],
  },
  {
    title: 'Data 360 Zero Copy: Architecture, Governance, and Failure Modes',
    keyword: 'salesforce data 360 zero copy architecture governance',
    pillar: 'architecture',
    tags: ['Salesforce', 'Data360', 'Architecture', 'Governance'],
    sourceUrls: [HEADLESS_360_UPDATE, WINTER_27_OVERVIEW],
    factNotes: [
      'Use Data 360 as the current name and explain formerly Data Cloud once for clarity.',
      'Do not invent connector availability, latency, or cost figures.',
    ],
  },
]
