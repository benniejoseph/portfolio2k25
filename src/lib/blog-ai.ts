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
  pillar: 'salesforce' | 'ai-agentic' | 'career'
  tags: string[]
}

const SYSTEM_PROMPT = `You are a technical writer for Bennie Joseph, a Salesforce Certified Application Architect
with 9+ years of enterprise experience who also builds AI agents and SaaS products.

Write in first-person, opinionated, practitioner tone. No fluff. No filler paragraphs.
Rules:
- Every post MUST include at least one real code snippet (Apex, LWC, TypeScript, or Python)
- Every post MUST include a real-world example from enterprise projects
- Every post MUST end with a TL;DR section (3 bullet points max)
- Word count: 1200–1800 words
- Format: valid MDX with frontmatter
- Use ## for H2, ### for H3
- Code blocks must specify language: \`\`\`apex, \`\`\`typescript, etc.
- Tone: direct, practitioner, occasionally opinionated ("Here's the unpopular take...")
- At exactly 2 natural breakpoints in the post body (NOT in the intro, NOT in the TL;DR, NOT inside code blocks), insert a standalone image placeholder on its own line using this exact format:
  {IMAGE_PROMPT: "your prompt here"}

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
  - Post about code quality / best practices / limits → Style 3 (Blueprint)
  - Post about comparison / migration / vs → Style 2 (Comparison)
  - Post about pipelines / architecture / systems → Style 4 (Architecture)
  - Post about career / learning / overview → Style 1 (Whiteboard)
  - FIRST image: usually the architecture/how-it-works (Style 3 or 4)
  - SECOND image: usually the comparison/checklist (Style 2 or 3)
  - NEVER use generic prompts like "diagram of X" — name EVERY component, code line, and metric

Output ONLY the raw MDX file content starting with --- frontmatter. No preamble.`

function buildPrompt(opts: GeneratePostOptions): string {
  return `Write a technical blog post with the following spec:

Title: "${opts.title}"
Primary SEO keyword: "${opts.keyword}"
Content pillar: ${opts.pillar}
Tags: ${opts.tags.join(', ')}
Date: ${new Date().toISOString().split('T')[0]}

The frontmatter MUST be:
---
title: "${opts.title}"
excerpt: "[Write a compelling 150-char excerpt targeting the keyword]"
date: "${new Date().toISOString().split('T')[0]}"
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

// Regex to find image placeholder lines written by the LLM
const IMAGE_PLACEHOLDER_RE = /\{IMAGE_PROMPT:\s*"([^"]+)"\}/g

/**
 * Generate an image using Nano Banana 2 (gemini-3.1-flash-image-preview).
 * Uses generateContent API (not generateImages).
 * aspectRatio: '16:9' for wide cover images, '1:1' for square inline images
 */
async function generateImage(
  prompt: string,
  aspectRatio: '16:9' | '1:1' = '1:1'
): Promise<Buffer> {
  const response = await gemini.models.generateContent({
    model: 'gemini-3.1-flash-image-preview',
    contents: prompt,
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
      integrationModules: ['REST API v62.0', 'Streaming API'],
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
          components: ['Model: claude-sonnet / gpt-4.1', 'tool_use blocks', 'Structured JSON output', '200K context'],
        },
        {
          name: 'Execution & Audit',
          color: 'grey',
          components: ['Output Handler', 'Validation Layer', 'Audit Logger', 'Kill Switch'],
        },
      ],
      centralNode: 'Agent Loop — runAgent()',
      integrationModules: ['Anthropic API / OpenAI API', 'Salesforce REST API v62.0'],
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

  // Generate cover image (16:9 wide landscape)
  console.log('Generating cover image with Gemini Imagen 3...')
  const coverPromptFn = COVER_PROMPTS[opts.pillar] ?? COVER_PROMPTS.salesforce
  const coverPrompt = coverPromptFn(opts.title, opts.keyword)
  const coverBuffer = await generateImage(coverPrompt, '16:9')
  fs.writeFileSync(path.join(imgDir, 'cover.png'), coverBuffer)
  console.log('✓ Cover image saved')

  // Replace inline image placeholders with generated images
  let mdx = rawMdx
  const matches = [...rawMdx.matchAll(IMAGE_PLACEHOLDER_RE)]

  for (let i = 0; i < matches.length; i++) {
    const match = matches[i]
    const imgPrompt = match[1]
    console.log(`Generating inline image ${i + 1}/${matches.length} with Gemini Imagen 3...`)
    const imgBuffer = await generateImage(imgPrompt, '1:1')
    const imgFilename = `image-${i + 1}.png`
    fs.writeFileSync(path.join(imgDir, imgFilename), imgBuffer)
    console.log(`✓ Inline image ${i + 1} saved`)
    mdx = mdx.replace(match[0], `\n![](/images/blog/${slug}/${imgFilename})\n`)
  }

  // Inject coverImage field into frontmatter (before the closing ---)
  const fmCloseIdx = mdx.indexOf('\n---', 4)
  if (fmCloseIdx !== -1) {
    mdx = `${mdx.slice(0, fmCloseIdx)}\ncoverImage: /images/blog/${slug}/cover.png${mdx.slice(fmCloseIdx)}`
  }

  const filePath = path.join(process.cwd(), 'content/posts', `${slug}.mdx`)
  fs.writeFileSync(filePath, mdx, 'utf-8')
  return slug
}

// Topic backlog — rotate through these for automated generation
export const TOPIC_BACKLOG: GeneratePostOptions[] = [
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
]
