import OpenAI from 'openai'
import { GoogleGenAI } from '@google/genai'
import fs from 'fs'
import path from 'path'

// OpenAI for text/blog content generation
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

// Gemini for image generation (Imagen 3)
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

  How to write a POWERFUL IMAGE_PROMPT for Gemini Imagen 3 (premium infographic quality):
  • These are PREMIUM INFOGRAPHICS — think "viral Salesforce LinkedIn post" level quality. Dark navy background, neon accent colors, real readable text labels, clean sections.
  • STYLE DIRECTIVE (include in every prompt): "Dark navy background (#0a1628). Neon electric blue (#00d4ff) and vibrant green (#00ff88) accents. Glowing bordered boxes. Bold white sans-serif text labels. Orange (#ff6b35) for data-flow arrows. Red (#ff4757) for danger/bad patterns, green (#2ed573) for success/good patterns. Professional technical infographic — NOT abstract art. Ultra-high contrast. Looks like a premium Salesforce developer guide."
  • CONTENT — Be extremely specific. Name EVERY component, every metric, every label that should appear. Include actual numbers, class names, field names.
  • STRUCTURE — Describe exact layout: "3 vertical swim-lane columns", "split left/right comparison with red left / green right", "numbered steps 1-5 flowing top to bottom", "2x3 grid of metric cards with icons"
  • FIRST placeholder: Show the ARCHITECTURE or "how it works" — components, data flows, sequence of steps. Include real Salesforce/AI component names.
  • SECOND placeholder: Show a COMPARISON, BEFORE/AFTER, DECISION MATRIX, or BEST-PRACTICE CHECKLIST — whatever is most valuable for the section being explained. Include real metrics or criteria.
  • EXAMPLE OF A GREAT PROMPT: "Premium dark-themed infographic titled 'SOQL IN LOOP vs BULKIFIED' in bold white. LEFT SIDE (dark red section labeled 'BAD'): code block showing for-loop with SOQL inside, stats showing '152 SOQL queries fired', '9,847ms CPU time', status badge 'LIMIT EXCEEDED ✗' in red. RIGHT SIDE (dark green section labeled 'GOOD'): code block showing Set<Id> collection then one query outside loop, stats '2 SOQL queries total', '312ms CPU time', status badge 'SUCCESS ✓' in green. Center divider with neon orange arrow labeled 'BULKIFY'. Bottom row showing Governor Limits: SOQL 100, DML 150, CPU 10000ms each in neon blue cards. Dark navy background, bold white typography."
  • BAD PROMPT: "diagram of salesforce bulkification" ← useless, produces generic art

  Place placeholders where a visual would genuinely help the reader understand the concept.

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

// Gemini Imagen 3 style directive — injected into every image prompt
const IMAGEN_STYLE =
  'Dark navy background (#0a1628). Neon electric blue (#00d4ff) and vibrant green (#00ff88) accents. Glowing bordered section boxes. Bold crisp white sans-serif text labels inside each box. Orange (#ff6b35) directional arrows showing data flow. Red (#ff4757) for bad/danger patterns, green (#2ed573) for success/good patterns. Ultra-high contrast professional technical infographic. Looks like a premium developer reference card — NOT abstract art, NOT decorative. Every component, step, and label must be clearly readable.'

/**
 * Generate an image using Gemini Imagen 3.
 * aspectRatio: '16:9' for wide cover images, '1:1' for square inline images
 */
async function generateImage(
  prompt: string,
  aspectRatio: '16:9' | '1:1' = '1:1'
): Promise<Buffer> {
  const fullPrompt = `${prompt}\n\nStyle requirements: ${IMAGEN_STYLE}`

  const response = await gemini.models.generateImages({
    model: 'imagen-3.0-generate-002',
    prompt: fullPrompt,
    config: {
      numberOfImages: 1,
      aspectRatio,
      outputMimeType: 'image/png',
    },
  })

  const imageBytes = response.generatedImages?.[0]?.image?.imageBytes
  if (!imageBytes) throw new Error('No image data returned from Gemini Imagen 3')

  // imageBytes can be a string (base64) or Uint8Array depending on SDK version
  if (typeof imageBytes === 'string') {
    return Buffer.from(imageBytes, 'base64')
  }
  return Buffer.from(imageBytes)
}

// Cover image prompts per content pillar — rich, specific, Imagen 3 optimised
const COVER_PROMPTS: Record<string, (title: string, keyword: string) => string> = {
  salesforce: (title, keyword) =>
    `Premium dark-themed technical infographic COVER IMAGE titled "${title}" in large bold white text at top. ` +
    `Subtitle: "${keyword}" in neon electric blue. ` +
    `Main visual: wide horizontal architecture diagram showing Salesforce platform layers — ` +
    `left section "Salesforce Org" (neon blue border) with labeled boxes: Apex, LWC, Triggers, SOQL, Platform Events, Named Credentials. ` +
    `Center section "Integration Layer" (orange border) with API Gateway, OAuth, Named Credentials boxes. ` +
    `Right section "External Systems" (green border) with AI/ML, ERP, REST API boxes. ` +
    `Glowing orange arrows connecting sections. Bottom strip: 3 key insight cards in neon-bordered dark boxes. ` +
    `Overall feel: premium Salesforce developer reference card.`,

  'ai-agentic': (title, keyword) =>
    `Premium dark-themed technical infographic COVER IMAGE titled "${title}" in large bold white text at top. ` +
    `Subtitle: "${keyword}" in neon electric blue. ` +
    `Main visual: AI agent reasoning loop diagram — ` +
    `center: "LLM / Reasoning Engine" node (bright green glowing circle). ` +
    `Surrounding nodes connected by neon arrows: "Tool Registry" (blue box), "Memory Store" (blue box), ` +
    `"Salesforce CRM" (blue box), "Prompt Builder" (grey box), "Output Handler" (green box), "Audit Logger" (grey box). ` +
    `Arrows labeled: "tool_call", "query context", "structured JSON", "validate + write". ` +
    `Bottom: 3 stat cards showing agent performance metrics. ` +
    `Overall feel: premium AI architecture reference card on dark navy.`,

  career: (title, keyword) =>
    `Premium dark-themed infographic COVER IMAGE titled "${title}" in large bold white text at top. ` +
    `Subtitle: "${keyword}" in neon electric blue. ` +
    `Main visual: career progression roadmap — horizontal timeline with 5 milestone nodes: ` +
    `"Junior Dev" → "Developer" → "Senior Dev" → "Architect" → "Principal/CTO". ` +
    `Each node: dark box with neon border, salary range, key skills listed, certification badges. ` +
    `Color gradient: blue for technical skills, green for career milestones, orange for community. ` +
    `Bottom: 3 action-item cards. Overall feel: premium career guide visual.`,
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
