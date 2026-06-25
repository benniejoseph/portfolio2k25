import OpenAI from 'openai'
import { GoogleGenAI } from '@google/genai'
import fs from 'fs'
import path from 'path'
import {
  styleWhiteboard,
  styleComparison,
  styleBlueprint,
  styleArchitecture,
} from './image-styles'

// OpenAI for text/blog content generation
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

// Gemini for image generation (Imagen 4)
const gemini = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })


export interface GeneratePostOptions {
  title: string
  keyword: string
  pillar: 'salesforce' | 'ai-agentic' | 'career' | 'architecture'
  tags: string[]
}

// ─── Current AI Landscape (update this block when models change) ──────────────
const AI_LANDSCAPE = `
CURRENT DATE: ${new Date().toISOString().split('T')[0]}

CURRENT AI MODEL VERSIONS (as of June 2026 — use these in ALL code examples and comparisons):
- Anthropic Claude: claude-sonnet-4-7 (latest), claude-opus-4-8 (most capable), claude-haiku-4-7 (fast/cheap)
  API version header: anthropic-version: 2026-01-01
- OpenAI GPT: gpt-5.5 (latest flagship), gpt-5.5-mini (fast/cheap), o3 (reasoning)
  Use model ID: "gpt-5.5" in all code
- Google Gemini: gemini-3.1-flash (fast), gemini-3.1-pro (capable), gemini-3.1-ultra (most capable)
  Image generation: gemini-3.1-flash-image-preview (Nano Banana 2)
- Meta: Llama 4 Scout (open source, runs locally)
- Salesforce Einstein: Einstein Copilot powered by Agentforce, Einstein 1 Platform
- Agentforce: Agentforce 2.0 (released Winter '26), Atlas Reasoning Engine v2

CURRENT SALESFORCE VERSIONS:
- Salesforce API: v64.0 (Summer '26); v67.0 next — SOQL/DML/Database methods default to user mode; WITH SECURITY_ENFORCED removed (use WITH USER_MODE)
- LWC: native state management GA (Summer '26)
- Agentforce: 2.0 with multi-agent orchestration, custom reasoning steps, Atlas Reasoning Engine v2
- Agentforce Builder (new GA): Agent Script language (.agent files), AiAuthoringBundle metadata type; old builder deprecated July 2026
- Agentforce DX: sf agent CLI (generate agent-spec, preview, sessions, end); @salesforce/mcp package; open-sourced Agent Script toolchain (parser, linter, LSP)
- Salesforce MCP (@salesforce/mcp): 60+ MCP tools, 30+ coding skills, GA for Enterprise Edition+; MuleSoft API-to-MCP; Heroku MCP hosting; AgentExchange MCP marketplace
- Salesforce Headless 360 (announced TDX April 2026): entire platform as API + MCP + CLI — 4000+ APIs, 220+ CLI commands, 60+ MCP tools, no browser required
- Data 360 (formerly Data Cloud): Zero Copy federation (Snowflake/BigQuery), Federated Grounding, native vector search, Unified Catalog, Retriever API for unstructured data
- Apex security: v67 defaults all SOQL/DML to user mode; classes without explicit sharing declaration now default to 'with sharing'
- GraphQL API: GA with full CRUD support (Summer '26); Named Query API GA
- Conditional Composite API: reduces API call volume 40-60%
- CI/CD: sf CLI credential security overhaul — credentials redacted in outputs; separate commands to view credentials; breaking change for existing pipelines

DO NOT reference or use: claude-3-5-sonnet, gpt-4, gpt-4.1, claude-opus-4-5, claude-sonnet-4-5,
anthropic-version 2023-06-01, Salesforce API v59/v61/v62, "Data Cloud" (use Data 360),
WITH SECURITY_ENFORCED (removed in v67), legacy Agentforce Builder. These are outdated.
`
// ──────────────────────────────────────────────────────────────────────────────

const SYSTEM_PROMPT = `You are a technical writer for Bennie Joseph, a Salesforce Certified Application Architect
with 9+ years of enterprise experience who also builds AI agents and SaaS products.
He is actively exploring CTA-level (Certified Technical Architect) architecture concepts
and writes about system design, integration patterns, data architecture, and enterprise
governance from a practitioner's perspective. He does NOT hold the CTA certification —
he is studying these concepts deeply and sharing what he learns with the community.
Never claim or imply CTA certification. Frame architecture content as exploration,
study, and practitioner experience — not as credentialed authority.

Write in first-person, opinionated, practitioner tone. No fluff. No filler paragraphs.

IMPORTANT CONTEXT — ALWAYS APPLY:
${AI_LANDSCAPE}

Rules:
- Every post MUST include at least one real code snippet (Apex, LWC, TypeScript, or Python)
- Every post MUST include a real-world example from enterprise projects
- Every post MUST end with a TL;DR section (3 bullet points max)
- Word count: 1200–2800 words (architecture pillar: 2000–3500 words)
- Format: valid MDX with frontmatter
- Use ## for H2, ### for H3
- Code blocks must specify language: \`\`\`apex, \`\`\`typescript, etc.
- Tone: direct, practitioner, occasionally opinionated ("Here's the unpopular take...")
- Architecture posts MUST include a decision matrix (table comparing approaches with tradeoffs)
- Architecture posts MUST address scale — what happens at 1K, 100K, 10M records/users
- Architecture posts should reference CTA exam domains where relevant (Data Lifecycle, Integration, Identity/Access, System Design) as learning context, not credential claims

COVER IMAGE (placed on its own line immediately after the closing --- of the frontmatter, before the first paragraph):
  {COVER_PROMPT: "your detailed 16:9 cover image prompt tailored to THIS post's specific topic" | ALT: "cover image alt text under 20 words"}

  The cover MUST be unique and specific to this post — NOT a generic Salesforce org diagram or generic agent loop.
  A SOQL post → show actual query patterns. A prompt engineering post → show prompt anatomy.
  A career post → show the roadmap. A Flow vs Apex post → show the decision.

  Cover style selection:
  - Code quality / performance / limits / best practices → Style 3 DARK BLUEPRINT
  - Comparison / migration / vs / before-after → Style 2 SPLIT-SCREEN COMPARISON
  - Pipelines / multi-agent systems / architecture → Style 4 ARCHITECTURE MAP
  - Career / learning / overview / mindset → Style 1 WHITEBOARD

- At exactly 2 natural breakpoints in the post body (NOT in the intro, NOT in the TL;DR, NOT inside code blocks), insert a standalone image placeholder on its own line using this EXACT format (both fields required):
  {IMAGE_PROMPT: "your detailed image generation prompt here" | ALT: "short descriptive alt text for accessibility and SEO, under 20 words"}

  The ALT text must describe what the infographic shows — e.g. "Flow vs Apex decision matrix comparing 8 real production scenarios" not just "diagram".

  ═══════════════════════════════════════════════════
  HOW TO WRITE IMAGE_PROMPTs — PICK ONE OF 4 STYLES
  ═══════════════════════════════════════════════════

  STYLE 1 — WHITEBOARD (for career, intro, overview posts)
  Use for: "The Salesforce Career Roadmap", "Getting Started with AI Agents"
  Prompt format: "Whiteboard-style infographic on '[TOPIC]'. Off-white paper background.
  Hand-drawn black marker header: '[TITLE]'. Pastel sticky notes in corners. Sections with
  hand-drawn boxes: Section 1 '[NAME]' with points '[A]', '[B]', '[C]'. Hand-drawn doodle
  icons connecting sections. Footer quote in blue marker: '[QUOTE]'. Flat design, authentic
  whiteboard marker texture, perfectly legible hand-written typography."

  STYLE 2 — SPLIT-SCREEN COMPARISON (for before/after, migration, vs posts)
  Use for: "LWC vs React", "Flow vs Apex", "Before/After code patterns"
  Prompt format: "Split-screen comparison infographic: '[TITLE]'. Deep navy blue bold header.
  LEFT COLUMN '[OLD WAY]' (soft red/grey, bold blue-grey header box): blocks for '[problem 1]',
  '[problem 2]', '[problem 3]' each with small icon. Central flow diagram showing tangled lines
  between Component A, B, C. RIGHT COLUMN '[NEW WAY]' (soft green/blue, bright blue header box):
  blocks for '[solution 1]', '[solution 2]', '[solution 3]'. Central glowing node 'Single Source
  of Truth' with clean straight lines to Component 1, 2, 3. Speedometer labeled FAST pointing
  green. Clean vector SaaS aesthetic, deep navy/teal/blue palette on light blue-grey background."

  STYLE 3 — DARK BLUEPRINT (for code deep dives, governor limits, performance, security)
  Use for: "Apex Bulkification", "SOQL Optimisation", "Governor Limit errors"
  Prompt format: "Dark blueprint developer infographic: '[TITLE]'. Deep dark navy background,
  glowing neon blue header '[TITLE]'. Subtitle '[SUBTITLE]'. TOP ROW: 3 horizontal cards —
  '[WHY CARD 1] with [icon]', '[WHY CARD 2] with [icon]', '[WHY CARD 3] with [icon]'.
  MIDDLE: side-by-side — LEFT red-themed box '[BAD LABEL]' with red DANGER pill, RIGHT
  green-themed box '[GOOD LABEL]' with green SUCCESS pill. CENTER: left column red border
  '// BAD' code: [bad pattern], right column green border '// GOOD' code: [good pattern].
  BOTTOM: circular avatar 'Bennie Joseph | Architect' + checklist '[item1]', '[item2]', '[item3]'.
  Footer bar: '[footer text]'. Monospace font for code, razor-sharp neon text, grid lines."

  STYLE 4 — ARCHITECTURE MAP (for pipelines, multi-agent systems, integration diagrams)
  Use for: "RAG Pipeline", "Multi-Agent Workflow", "Salesforce + AI Architecture"
  Prompt format: "System architecture diagram: '[TITLE]'. Light grey background with faint grid.
  Dark bold header block '[TITLE]'. Subtitle '[SUBTITLE]'. Top-right: profile badge 'Bennie Joseph | Architect'.
  LAYER 1 '[NAME]' (pastel [color]): modules '[A]', '[B]', '[C]'. LAYER 2 '[NAME]' (pastel [color]):
  modules '[D]', '[E]', '[F]'. LAYER 3 '[NAME]' (pastel [color]): modules '[G]', '[H]'.
  Central node '[CENTRAL NODE]' with rotating arrow, dotted directional connectors to all layers.
  INTEGRATION LAYER (upper right): '[module1]' and '[module2]'. BOTTOM PANEL '[label]':
  sub-modules '[M1]', '[M2]', '[M3]' with flow arrows. Rounded rectangle containers, dotted
  arrowheads, micro vector icons, modern sans-serif fonts, publication-ready engineering diagram."

  ═══════════════════════
  ASSIGNMENT RULES:
  ═══════════════════════
  - DEFAULT for BOTH inline images → Style 3 DARK BLUEPRINT (dark navy, neon, real code)
  - Career / learning / overview posts only → Style 1 Whiteboard
  - NEVER default to Style 2 (Comparison) or Style 4 (Architecture) for inline images
  - Every Blueprint image MUST show real, specific code in the bad/good blocks
    (not placeholder text like "// bad pattern here" — actual Apex, TypeScript, or SOQL)
  - NEVER use generic prompts like "diagram of X" — name EVERY variable, method, and metric

Output ONLY the raw MDX file content starting with --- frontmatter. No preamble.`

function buildPrompt(opts: GeneratePostOptions): string {
  const today = new Date().toISOString().split('T')[0]
  return `Write a technical blog post with the following spec:

Title: "${opts.title}"
Primary SEO keyword: "${opts.keyword}"
Content pillar: ${opts.pillar}
Tags: ${opts.tags.join(', ')}
Date: ${today}

RELEVANCE REQUIREMENT: This post is published on ${today}.
- All model names, API versions, and Salesforce releases must match the AI_LANDSCAPE context above
- Any "in 2025" or "as of last year" language is WRONG — write for a May 2026 reader
- If comparing models, use current versions: claude-sonnet-4-7 vs gpt-5.5, etc.
- Reference Agentforce 2.0, Salesforce API v64.0, LWC native state where relevant

The frontmatter MUST be:
---
title: "${opts.title}"
excerpt: "[Write a compelling 150-char excerpt targeting the keyword]"
date: "${today}"
tags: [${opts.tags.map((t) => `"${t}"`).join(', ')}]
keyword: "${opts.keyword}"
featured: false
---

Now write the full post body in MDX. Remember: code snippet + real example + 2 image placeholders + TL;DR at the end.`
}

export async function generatePost(opts: GeneratePostOptions): Promise<string> {
  const response = await openai.chat.completions.create({
    model: 'gpt-5.5-2026-04-23',
    max_completion_tokens: 16000,
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: buildPrompt(opts) },
    ],
  })

  const choice = response.choices[0]
  const text = choice?.message?.content

  if (!text) {
    throw new Error(`No content in OpenAI response (finish_reason: ${choice?.finish_reason})`)
  }
  return text
}

// Regex to find the cover image directive placed after frontmatter by the LLM.
// Format: {COVER_PROMPT: "prompt" | ALT: "alt text"}
const COVER_DIRECTIVE_RE = /\{COVER_PROMPT:\s*"((?:[^"\\]|\\.)*)"\s*(?:\|\s*ALT:\s*"((?:[^"\\]|\\.)*)")?\}\n?/

// Regex to find inline image placeholder lines written by the LLM.
// Supports both formats:
//   New: {IMAGE_PROMPT: "prompt" | ALT: "alt text"}
//   Old: {IMAGE_PROMPT: "prompt"}  ← backward compat, alt will be empty
const IMAGE_PLACEHOLDER_RE = /\{IMAGE_PROMPT:\s*"((?:[^"\\]|\\.)*)"\s*(?:\|\s*ALT:\s*"((?:[^"\\]|\\.)*)")?\}/g

/**
 * Reference photo of the author (Bennie Joseph), used so Nano Banana 2 can
 * keep his likeness consistent across every generated avatar/profile icon
 * instead of inventing a new face each time.
 */
const AUTHOR_REFERENCE_PATH = path.join(process.cwd(), 'public/images/profile.webp')
let authorReferenceCache: { mimeType: string; data: string } | null | undefined

function loadAuthorReferenceImage(): { mimeType: string; data: string } | null {
  if (authorReferenceCache !== undefined) return authorReferenceCache
  try {
    const buf = fs.readFileSync(AUTHOR_REFERENCE_PATH)
    authorReferenceCache = { mimeType: 'image/webp', data: buf.toString('base64') }
  } catch {
    authorReferenceCache = null
  }
  return authorReferenceCache
}

/** True if the prompt asks for an avatar/profile portrait of the author. */
function promptNeedsAuthorPhoto(prompt: string): boolean {
  return /Bennie Joseph/i.test(prompt)
}

const AUTHOR_PHOTO_INSTRUCTION = `

Note: The first attached image is a real reference photo of the author. Use his likeness (face, beard, hairstyle, skin tone) for any avatar or portrait of him in this scene, rendered in the described illustration style.`

/**
 * Generate an image using Nano Banana 2 (gemini-3.1-flash-image-preview).
 * Uses generateContent API (not generateImages).
 * aspectRatio: '16:9' for wide cover images, '1:1' for square inline images
 * useAuthorPhoto: attach the author's reference photo when the prompt calls
 *   for his avatar/portrait. Set to false to fall back to a plain text-only
 *   prompt (used as a last resort if the photo-attached generation fails).
 */
async function generateImage(
  prompt: string,
  aspectRatio: '16:9' | '1:1' = '1:1',
  useAuthorPhoto = true
): Promise<Buffer> {
  let contents: Array<{ inlineData: { mimeType: string; data: string } } | string> | string = prompt

  if (useAuthorPhoto && promptNeedsAuthorPhoto(prompt)) {
    const reference = loadAuthorReferenceImage()
    if (reference) {
      contents = [
        { inlineData: { mimeType: reference.mimeType, data: reference.data } },
        prompt + AUTHOR_PHOTO_INSTRUCTION,
      ]
    }
  }

  const response = await gemini.models.generateContent({
    model: 'gemini-3.1-flash-image-preview',
    contents,
    config: {
      responseModalities: ['TEXT', 'IMAGE'],
      imageConfig: {
        aspectRatio,
        imageSize: aspectRatio === '16:9' ? '2K' : '1K',
      },
    },
  })

  // Find the image part in the response
  const parts = response.candidates?.[0]?.content?.parts ?? []
  const imagePart = parts.find((p: { inlineData?: { data?: string } }) => p.inlineData?.data)
  if (!imagePart?.inlineData?.data) {
    throw new Error('No image data returned from Nano Banana 2 (gemini-3.1-flash-image-preview)')
  }

  return Buffer.from(imagePart.inlineData.data, 'base64')
}

async function generateImageWithRetry(
  prompt: string,
  aspectRatio: '16:9' | '1:1' = '1:1',
  maxAttempts = 3
): Promise<Buffer> {
  let lastError: Error | undefined
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await generateImage(prompt, aspectRatio)
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err))
      if (attempt < maxAttempts) {
        const delayMs = attempt * 8000
        console.log(`  ⚠ Image gen attempt ${attempt} failed: ${lastError.message}`)
        console.log(`  ↻ Retrying in ${delayMs / 1000}s...`)
        await new Promise((r) => setTimeout(r, delayMs))
      }
    }
  }

  // Last resort: if every attempt with the author's reference photo failed
  // (e.g. the model returned IMAGE_OTHER for that prompt+image combo), retry
  // once without the photo so the pipeline doesn't crash. Likeness will be
  // less accurate for this one image, but the post still gets a cover/image.
  if (promptNeedsAuthorPhoto(prompt)) {
    try {
      console.log('  ↻ Retrying without author reference photo as a fallback...')
      return await generateImage(prompt, aspectRatio, false)
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err))
    }
  }

  throw lastError
}

// Cover image prompts per content pillar — using structured style functions
const COVER_PROMPTS: Record<string, (title: string, keyword: string) => string> = {
  salesforce: (title, keyword) =>
    styleArchitecture({
      title: title.toUpperCase(),
      subtitle: keyword,
      layers: [
        {
          name: 'Salesforce Org',
          color: 'neon blue',
          components: ['Apex Triggers', 'LWC Components', 'SOQL Queries', 'Platform Events', 'Named Credentials'],
        },
        {
          name: 'Integration Layer',
          color: 'orange',
          components: ['API Gateway', 'OAuth 2.0', 'Named Credentials', 'Connected App'],
        },
        {
          name: 'External Systems',
          color: 'neon green',
          components: ['AI / LLM APIs', 'ERP Systems', 'REST / GraphQL', 'Webhooks'],
        },
      ],
      centralNode: 'Salesforce Platform',
      integrationModules: ['REST API v64.0', 'Streaming API'],
      bottomPanel: {
        label: 'KEY INSIGHTS',
        modules: ['Governor Limits Managed', 'FLS + Sharing Enforced', 'Bulkified Patterns'],
      },
    }),

  'ai-agentic': (title, keyword) =>
    styleArchitecture({
      title: title.toUpperCase(),
      subtitle: keyword,
      layers: [
        {
          name: 'Input & Context',
          color: 'neon blue',
          components: ['Tool Registry', 'Memory Store', 'Salesforce CRM', 'Prompt Builder'],
        },
        {
          name: 'LLM / Reasoning Engine',
          color: 'neon green',
          components: ['Model: claude-sonnet-4-7 / gpt-5.5', 'tool_use blocks', 'Structured JSON output', '200K context'],
        },
        {
          name: 'Execution & Audit',
          color: 'grey',
          components: ['Output Handler', 'Validation Layer', 'Audit Logger', 'Kill Switch'],
        },
      ],
      centralNode: 'Agent Loop — runAgent()',
      integrationModules: ['Anthropic API / OpenAI API', 'Salesforce REST API v64.0'],
      bottomPanel: {
        label: 'AGENT METRICS',
        modules: ['Tool Call Accuracy', 'Cost per Run', 'Hallucination Rate'],
      },
    }),

  career: (title, keyword) =>
    styleWhiteboard({
      title: title.toUpperCase(),
      subtitle: keyword,
      sections: [
        {
          title: 'THE ROADMAP',
          points: ['Junior Dev → Developer → Senior Dev → Architect → Principal'],
        },
        {
          title: 'SKILLS TO MASTER',
          points: ['Apex & LWC', 'Data Cloud & AI', 'Integration Patterns'],
        },
        {
          title: 'CERTIFICATIONS',
          points: ['Platform Dev I & II', 'Application Architect', 'System Architect'],
        },
      ],
      footerQuote: 'Build the future with code and cloud. Ship > Perfect.',
    }),

  architecture: (title, keyword) =>
    styleArchitecture({
      title: title.toUpperCase(),
      subtitle: keyword,
      layers: [
        {
          name: 'Enterprise Systems',
          color: 'neon blue',
          components: ['ERP', 'Data Warehouse', 'Identity Provider', 'External APIs'],
        },
        {
          name: 'Integration & Middleware',
          color: 'orange',
          components: ['MuleSoft / API Gateway', 'Platform Events', 'CDC / Pub-Sub', 'Heroku'],
        },
        {
          name: 'Salesforce Platform',
          color: 'neon green',
          components: ['Sales Cloud', 'Service Cloud', 'Experience Cloud', 'Data 360'],
        },
      ],
      centralNode: 'Architecture Decision Record',
      integrationModules: ['Governance & Security', 'Data Classification'],
      bottomPanel: {
        label: 'CTA DOMAINS',
        modules: ['System Design', 'Data Lifecycle', 'Integration', 'Identity & Access'],
      },
    }),
}

export async function generateAndSave(opts: GeneratePostOptions): Promise<string> {
  const rawMdx = await generatePost(opts)
  const slug = opts.title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .slice(0, 60)

  // Create image directory for this post
  const imgDir = path.join(process.cwd(), 'public/images/blog', slug)
  fs.mkdirSync(imgDir, { recursive: true })

  // Extract {COVER_PROMPT} directive written by the LLM (post-specific cover)
  // Falls back to COVER_PROMPTS[pillar] template if the LLM didn't write one
  let mdx = rawMdx
  let coverPrompt: string

  const coverDirectiveMatch = mdx.match(COVER_DIRECTIVE_RE)
  if (coverDirectiveMatch) {
    coverPrompt = coverDirectiveMatch[1]
    mdx = mdx.replace(coverDirectiveMatch[0], '') // strip directive from MDX body
    console.log('Using LLM-generated post-specific cover prompt')
  } else {
    const coverPromptFn = COVER_PROMPTS[opts.pillar] ?? COVER_PROMPTS.salesforce
    coverPrompt = coverPromptFn(opts.title, opts.keyword)
    console.log(`Using fallback cover template for pillar: ${opts.pillar}`)
  }

  // Generate cover image (16:9 wide landscape)
  console.log('Generating cover image with Nano Banana 2 (gemini-3.1-flash-image-preview)...')
  const coverBuffer = await generateImageWithRetry(coverPrompt, '16:9')
  fs.writeFileSync(path.join(imgDir, 'cover.png'), coverBuffer)
  console.log('✓ Cover image saved')

  // Replace inline image placeholders with generated images
  const matches = [...mdx.matchAll(IMAGE_PLACEHOLDER_RE)]
  const collectedImagePrompts: string[] = []

  for (let i = 0; i < matches.length; i++) {
    const match = matches[i]
    const imgPrompt = match[1]
    const altText = match[2] ?? ''
    collectedImagePrompts.push(imgPrompt)

    console.log(`Generating inline image ${i + 1}/${matches.length} with Nano Banana 2...`)
    const imgBuffer = await generateImageWithRetry(imgPrompt, '1:1')
    const imgFilename = `image-${i + 1}.png`
    fs.writeFileSync(path.join(imgDir, imgFilename), imgBuffer)
    console.log(`✓ Inline image ${i + 1} saved`)

    // Use alt text from placeholder — fallback to empty string for backward compat
    mdx = mdx.replace(match[0], `\n![${altText}](/images/blog/${slug}/${imgFilename})\n`)
  }

  // Inject coverImage field into frontmatter (before the closing ---)
  const fmCloseIdx = mdx.indexOf('\n---', 4)
  if (fmCloseIdx !== -1) {
    mdx = `${mdx.slice(0, fmCloseIdx)}\ncoverImage: /images/blog/${slug}/cover.png${mdx.slice(fmCloseIdx)}`
  }

  // Save image prompts as sidecar JSON — allows regenerate-images.ts to
  // regenerate this post's images without a manual POST_IMAGE_CONFIGS entry
  const sidecarPath = path.join(process.cwd(), 'content/posts', `${slug}.images.json`)
  fs.writeFileSync(
    sidecarPath,
    JSON.stringify({ cover: coverPrompt, images: collectedImagePrompts }, null, 2),
    'utf-8'
  )
  console.log(`✓ Image prompts saved to ${slug}.images.json`)

  const filePath = path.join(process.cwd(), 'content/posts', `${slug}.mdx`)
  fs.writeFileSync(filePath, mdx, 'utf-8')
  return slug
}

// Topic backlog — rotate through these for automated generation
// Updated May 2026 — all topics reference current models and platform versions
export const TOPIC_BACKLOG: GeneratePostOptions[] = [
  // ── Already published (skip these) ──────────────────────────────────────────
  {
    title: 'Agentforce vs Einstein Copilot: What Is Actually Different',
    keyword: 'agentforce vs einstein copilot',
    pillar: 'salesforce',
    tags: ['Salesforce', 'Agentforce', 'AI'],
  },
  {
    title: 'LWC to React: What Salesforce Devs Need to Know',
    keyword: 'lwc vs react for salesforce developers',
    pillar: 'salesforce',
    tags: ['Salesforce', 'LWC', 'React'],
  },
  {
    title: 'Building Your First AI Agent with Claude API and Salesforce',
    keyword: 'claude api salesforce integration',
    pillar: 'ai-agentic',
    tags: ['AI', 'Salesforce', 'Agents'],
  },
  {
    title: 'Building AI Agents with OpenAI and Salesforce',
    keyword: 'openai api salesforce integration agent',
    pillar: 'ai-agentic',
    tags: ['AI', 'Salesforce', 'Agents'],
  },
  {
    title: 'Agentforce Custom Actions: A Builder Playbook',
    keyword: 'agentforce custom actions tutorial',
    pillar: 'salesforce',
    tags: ['Salesforce', 'Agentforce', 'Apex'],
  },
  {
    title: 'RAG for Salesforce Orgs: Index Your Knowledge Base',
    keyword: 'rag salesforce knowledge base',
    pillar: 'ai-agentic',
    tags: ['AI', 'RAG', 'Salesforce'],
  },
  {
    title: 'Multi-Agent Workflows: Lessons from Building in Production',
    keyword: 'multi agent workflow design patterns',
    pillar: 'ai-agentic',
    tags: ['AI', 'Agents', 'Architecture'],
  },
  {
    title: 'Apex CPU Limit Errors: The Real Fix',
    keyword: 'apex cpu limit error fix',
    pillar: 'salesforce',
    tags: ['Salesforce', 'Apex', 'Performance'],
  },
  {
    title: 'Flow vs Apex in 2026: When to Use Which',
    keyword: 'salesforce flow vs apex 2026',
    pillar: 'salesforce',
    tags: ['Salesforce', 'Flow', 'Apex'],
  },
  {
    title: 'Prompt Engineering for Salesforce Admins',
    keyword: 'prompt engineering salesforce admins',
    pillar: 'ai-agentic',
    tags: ['AI', 'Salesforce', 'Prompt Engineering'],
  },
  {
    title: 'SOQL Optimization: The Missing Guide',
    keyword: 'soql query optimization tips',
    pillar: 'salesforce',
    tags: ['Salesforce', 'SOQL', 'Performance'],
  },

  // ── New topics — May 2026 and beyond ────────────────────────────────────────
  {
    title: 'Agentforce 2.0: What Actually Changed from 1.0',
    keyword: 'agentforce 2.0 new features winter 26',
    pillar: 'salesforce',
    tags: ['Salesforce', 'Agentforce', 'Winter26'],
  },
  {
    title: 'Claude Sonnet 4.7 vs GPT-5.5 for Salesforce Agents',
    keyword: 'claude sonnet 4.7 vs gpt 5.5 salesforce',
    pillar: 'ai-agentic',
    tags: ['AI', 'Claude', 'OpenAI', 'Salesforce'],
  },
  {
    title: 'Salesforce Data Cloud Vector Search: Build a Semantic Case Router',
    keyword: 'salesforce data cloud vector search 2026',
    pillar: 'salesforce',
    tags: ['Salesforce', 'Data Cloud', 'RAG', 'AI'],
  },
  {
    title: 'LWC Native State Management in Summer 26: Kill Your Wire Adapters',
    keyword: 'lwc native state management summer 26',
    pillar: 'salesforce',
    tags: ['Salesforce', 'LWC', 'Summer26'],
  },
  {
    title: 'Building a Reasoning Agent with o3 and Salesforce',
    keyword: 'openai o3 reasoning agent salesforce',
    pillar: 'ai-agentic',
    tags: ['AI', 'OpenAI', 'o3', 'Salesforce', 'Agents'],
  },
  {
    title: 'Agentforce Multi-Agent Orchestration: Real Patterns from Production',
    keyword: 'agentforce multi agent orchestration patterns',
    pillar: 'salesforce',
    tags: ['Salesforce', 'Agentforce', 'Multi-Agent'],
  },
  {
    title: 'Salesforce API v64.0: What Developers Need to Know',
    keyword: 'salesforce api v64 summer 26 changes',
    pillar: 'salesforce',
    tags: ['Salesforce', 'API', 'Summer26'],
  },
  {
    title: 'From Salesforce Dev to AI Architect: The 2026 Roadmap',
    keyword: 'salesforce developer ai architect career 2026',
    pillar: 'career',
    tags: ['Career', 'Salesforce', 'AI', 'Architect'],
  },
  {
    title: 'Apex Test Coverage in the Age of AI: Stop Writing Boilerplate',
    keyword: 'apex test coverage ai generated 2026',
    pillar: 'salesforce',
    tags: ['Salesforce', 'Apex', 'Testing', 'AI'],
  },
  {
    title: 'Llama 4 Scout on-Premise + Salesforce: When to Go Open Source',
    keyword: 'llama 4 scout salesforce on premise ai',
    pillar: 'ai-agentic',
    tags: ['AI', 'Llama', 'Open Source', 'Salesforce'],
  },
  {
    title: 'Einstein 1 Platform vs Custom AI Stack: The Honest Comparison',
    keyword: 'einstein 1 platform vs custom llm stack',
    pillar: 'salesforce',
    tags: ['Salesforce', 'Einstein', 'AI', 'Architecture'],
  },

  // ── June 2026 — Headless 360, MCP, Agent Script, API v67, Data 360 ──────────
  {
    title: 'Salesforce Headless 360: The Entire Platform Is Now an API',
    keyword: 'salesforce headless 360 api mcp cli',
    pillar: 'salesforce',
    tags: ['Salesforce', 'Headless360', 'API', 'MCP'],
  },
  {
    title: 'Building with @salesforce/mcp: Connect AI Agents to Your Org Without Code',
    keyword: 'salesforce mcp model context protocol agentforce',
    pillar: 'ai-agentic',
    tags: ['Salesforce', 'MCP', 'Agentforce', 'AI'],
  },
  {
    title: 'Agent Script: The New Language for Building Agentforce Agents',
    keyword: 'agent script agentforce builder language 2026',
    pillar: 'salesforce',
    tags: ['Salesforce', 'Agentforce', 'Agent Script', 'Summer26'],
  },
  {
    title: 'Agentforce DX: CI/CD, Metadata Lifecycle, and the .agent File',
    keyword: 'agentforce dx metadata lifecycle aiauthoringbundle 2026',
    pillar: 'salesforce',
    tags: ['Salesforce', 'Agentforce', 'DevOps', 'CI/CD'],
  },
  {
    title: 'Apex API v67: User Mode Is Now the Default — What Breaks and What to Fix',
    keyword: 'apex api v67 user mode default soql security 2026',
    pillar: 'salesforce',
    tags: ['Salesforce', 'Apex', 'Security', 'API'],
  },
  {
    title: 'Data 360 Federated Grounding: RAG Without Moving Your Data',
    keyword: 'salesforce data 360 federated grounding vector search rag',
    pillar: 'ai-agentic',
    tags: ['Salesforce', 'Data360', 'RAG', 'AI', 'Agentforce'],
  },
  {
    title: 'Salesforce GraphQL API Is GA: When to Use It Over REST',
    keyword: 'salesforce graphql api ga vs rest soql 2026',
    pillar: 'salesforce',
    tags: ['Salesforce', 'GraphQL', 'API', 'REST'],
  },
  {
    title: 'Salesforce CI/CD Security Overhaul 2026: What Breaks and How to Fix It',
    keyword: 'salesforce cicd sf cli security credential update 2026',
    pillar: 'salesforce',
    tags: ['Salesforce', 'DevOps', 'CI/CD', 'Security'],
  },
  {
    title: 'sf agent CLI: The Developer Guide to Headless Agentforce Automation',
    keyword: 'sf agent cli commands headless agentforce dx 2026',
    pillar: 'salesforce',
    tags: ['Salesforce', 'CLI', 'Agentforce', 'DevOps'],
  },
  {
    title: 'Conditional Composite API: Cut Your Salesforce API Calls by 40%',
    keyword: 'salesforce conditional composite api v64 reduce api calls',
    pillar: 'salesforce',
    tags: ['Salesforce', 'API', 'Performance', 'Integration'],
  },
  {
    title: 'Salesforce Named Query API: Typed, Versioned SOQL Without String Bugs',
    keyword: 'salesforce named query api ga summer 26',
    pillar: 'salesforce',
    tags: ['Salesforce', 'API', 'SOQL', 'Summer26'],
  },
  {
    title: 'Data 360 Zero Copy: How to Connect Snowflake and BigQuery Without ETL',
    keyword: 'salesforce data 360 zero copy snowflake bigquery federation',
    pillar: 'salesforce',
    tags: ['Salesforce', 'Data360', 'Integration', 'Architecture'],
  },
  {
    title: 'Agentforce Multi-Model Routing: Picking the Right LLM per Task',
    keyword: 'agentforce multi model routing gpt claude gemini 2026',
    pillar: 'ai-agentic',
    tags: ['Salesforce', 'Agentforce', 'AI', 'Architecture'],
  },

  // ── CTA-Level Architecture Deep Dives — June 2026+ ────────────────────────
  // Exploring Certified Technical Architect concepts: system design, integration
  // patterns, data architecture, governance. NOT claiming CTA — learning in public.

  // System Design & Enterprise Architecture
  {
    title: 'Designing a Multi-Cloud Salesforce Architecture: Sales + Service + Experience + Data 360',
    keyword: 'salesforce multi cloud architecture sales service experience data 360 cta',
    pillar: 'architecture',
    tags: ['Salesforce', 'Architecture', 'Multi-Cloud', 'CTA'],
  },
  {
    title: 'Event-Driven Architecture on Salesforce: Platform Events, CDC, and Pub/Sub API at Scale',
    keyword: 'salesforce event driven architecture platform events cdc pub sub api',
    pillar: 'architecture',
    tags: ['Salesforce', 'Architecture', 'Integration', 'Events'],
  },
  {
    title: 'Multi-Org vs Single-Org: The Architecture Decision Framework',
    keyword: 'salesforce multi org single org architecture decision framework cta',
    pillar: 'architecture',
    tags: ['Salesforce', 'Architecture', 'Multi-Org', 'CTA'],
  },
  {
    title: 'API Gateway Patterns for Salesforce: When MuleSoft Is Not the Answer',
    keyword: 'salesforce api gateway patterns mulesoft alternatives integration',
    pillar: 'architecture',
    tags: ['Salesforce', 'Architecture', 'Integration', 'API'],
  },
  {
    title: 'Disaster Recovery Architecture for Salesforce: RPO, RTO, and What Nobody Tests',
    keyword: 'salesforce disaster recovery architecture rpo rto backup strategy',
    pillar: 'architecture',
    tags: ['Salesforce', 'Architecture', 'DR', 'Governance'],
  },

  // Data Architecture & Large Data Volumes
  {
    title: 'Large Data Volume Architecture: What Actually Happens at 200 Million Records',
    keyword: 'salesforce large data volume ldv architecture 200 million records performance',
    pillar: 'architecture',
    tags: ['Salesforce', 'Architecture', 'LDV', 'Performance'],
  },
  {
    title: 'Master Data Management on Salesforce: Golden Record Patterns That Scale',
    keyword: 'salesforce master data management mdm golden record duplicate architecture',
    pillar: 'architecture',
    tags: ['Salesforce', 'Architecture', 'MDM', 'Data'],
  },
  {
    title: 'Data Migration Architecture: Moving 500M Records Without Downtime',
    keyword: 'salesforce data migration architecture large volume zero downtime strategy',
    pillar: 'architecture',
    tags: ['Salesforce', 'Architecture', 'Migration', 'Data'],
  },
  {
    title: 'Archival Strategies: Big Objects, External Objects, and the 80/20 Rule',
    keyword: 'salesforce archival big objects external objects data lifecycle architecture',
    pillar: 'architecture',
    tags: ['Salesforce', 'Architecture', 'Data Lifecycle', 'Performance'],
  },

  // Integration Architecture
  {
    title: 'Saga Pattern on Salesforce: Distributed Transactions Across Clouds',
    keyword: 'salesforce saga pattern distributed transactions integration architecture',
    pillar: 'architecture',
    tags: ['Salesforce', 'Architecture', 'Integration', 'Patterns'],
  },
  {
    title: 'Real-Time vs Near-Real-Time vs Batch: The Integration Decision Tree',
    keyword: 'salesforce integration patterns real time near real time batch decision',
    pillar: 'architecture',
    tags: ['Salesforce', 'Architecture', 'Integration', 'CTA'],
  },
  {
    title: 'Salesforce-to-Salesforce Integration: What the Docs Do Not Tell You',
    keyword: 'salesforce to salesforce integration patterns org connect s2s architecture',
    pillar: 'architecture',
    tags: ['Salesforce', 'Architecture', 'Integration', 'Multi-Org'],
  },

  // Identity, Access & Security Architecture
  {
    title: 'Zero Trust Architecture on Salesforce: Beyond Permission Sets',
    keyword: 'salesforce zero trust architecture security identity access cta',
    pillar: 'architecture',
    tags: ['Salesforce', 'Architecture', 'Security', 'Identity'],
  },
  {
    title: 'Shield Platform Encryption: Architecture Decisions That Cannot Be Reversed',
    keyword: 'salesforce shield platform encryption architecture decisions tradeoffs',
    pillar: 'architecture',
    tags: ['Salesforce', 'Architecture', 'Security', 'Encryption'],
  },
  {
    title: 'Compliance Architecture on Salesforce: HIPAA, SOX, and PCI Patterns',
    keyword: 'salesforce compliance architecture hipaa sox pci regulatory patterns',
    pillar: 'architecture',
    tags: ['Salesforce', 'Architecture', 'Compliance', 'Security'],
  },

  // Performance & Governance Architecture
  {
    title: 'Query Plan Analysis: Reading the Salesforce Optimizer Like an Architect',
    keyword: 'salesforce query plan analysis optimizer soql performance architecture',
    pillar: 'architecture',
    tags: ['Salesforce', 'Architecture', 'Performance', 'SOQL'],
  },
  {
    title: 'Governor Limit Architecture: Designing Systems That Never Hit Limits',
    keyword: 'salesforce governor limits architecture design patterns bulkification',
    pillar: 'architecture',
    tags: ['Salesforce', 'Architecture', 'Performance', 'Apex'],
  },
  {
    title: 'Technical Debt Remediation: How to Refactor a 500-Object Org',
    keyword: 'salesforce technical debt remediation refactor large org architecture',
    pillar: 'architecture',
    tags: ['Salesforce', 'Architecture', 'Governance', 'Refactoring'],
  },
  {
    title: 'Release Architecture: Managing 50 Developers in a Single Salesforce Org',
    keyword: 'salesforce release architecture devops branching strategy large team',
    pillar: 'architecture',
    tags: ['Salesforce', 'Architecture', 'DevOps', 'Governance'],
  },

  // AI + Architecture (the intersection)
  {
    title: 'Agentforce Architecture Patterns: Where Agents Fit in Enterprise System Design',
    keyword: 'agentforce architecture patterns enterprise system design cta 2026',
    pillar: 'architecture',
    tags: ['Salesforce', 'Agentforce', 'Architecture', 'AI'],
  },
  {
    title: 'Grounding Architecture: Data 360 + RAG + Federated Search at Enterprise Scale',
    keyword: 'salesforce grounding architecture data 360 rag federated search enterprise',
    pillar: 'architecture',
    tags: ['Salesforce', 'Architecture', 'Data360', 'RAG', 'AI'],
  },
  {
    title: 'AI Trust Architecture: Guardrails, Audit Trails, and Compliance for Agentforce',
    keyword: 'salesforce ai trust architecture guardrails audit compliance agentforce',
    pillar: 'architecture',
    tags: ['Salesforce', 'Architecture', 'AI', 'Compliance', 'Agentforce'],
  },
]
