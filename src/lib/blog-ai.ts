import OpenAI from 'openai'
import fs from 'fs'
import path from 'path'

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

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

  How to write a strong IMAGE_PROMPT:
  • Be SPECIFIC — name the exact technologies, components and systems (e.g. "Salesforce lightning cloud icon", "Apex trigger class box", "React component tree", "vector database cylinder", "LLM reasoning node", "API gateway hexagon")
  • Describe the COMPOSITION — what is on the left, center, right; what connects to what; how data flows
  • Use DIAGRAM framing: "isometric architecture diagram", "split comparison left vs right", "layered stack diagram", "flowchart with nodes and arrows", "before/after side-by-side"
  • First placeholder: illustrate the "how it works" architecture or core concept of that section
  • Second placeholder: illustrate the specific pattern, comparison, or technical decision being explained in that section
  • Style suffix to always include: "dark near-black background (#080810), neon cyan data-flow arrows, purple glowing node borders, technical illustration style, dramatic rim lighting, no text, no labels, no typography"
  • GOOD example: "Isometric architecture diagram: left side shows a Salesforce Org box (blue cloud outline) with an Apex Trigger block above it, center shows a processing node (glowing circuit board) with CPU gauge hitting red, right side shows a clean optimised query node with green glow; neon cyan arrows flowing left to right showing data path, dark near-black background, purple accent highlights, no text"
  • BAD example: "dark cyberpunk illustration of salesforce" ← too vague, produces generic art

  Place placeholders where a diagram would genuinely help the reader understand what you are explaining.

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
  const response = await client.chat.completions.create({
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

const STYLE_SUFFIX = 'Dark near-black background (#080810). Neon cyan data-flow lines and arrows. Purple glowing node/border highlights. Technical illustration style — part diagram, part concept art. Dramatic rim lighting on components. High detail. No text, no labels, no typography anywhere in the image.'

async function generateDalleImage(
  prompt: string,
  size: '1536x1024' | '1024x1024' = '1024x1024'
): Promise<Buffer> {
  const response = await client.images.generate({
    model: 'gpt-image-1',
    prompt: `${prompt} ${STYLE_SUFFIX}`,
    n: 1,
    size,
    quality: 'high',
  })
  const b64 = response.data?.[0]?.b64_json
  if (!b64) throw new Error('No image data returned from gpt-image-1')
  return Buffer.from(b64, 'base64')
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

  // Generate cover image (wide 16:9)
  console.log('Generating cover image...')
  const pillarVisuals: Record<string, string> = {
    'salesforce': 'Salesforce Lightning cloud platform — Apex code blocks, Lightning Web Components, org architecture layers, shield/certification badge, data model relationships',
    'ai-agentic': 'AI agent reasoning loop — LLM brain node, tool-calling arrows, memory store, orchestration engine, multi-step thought chain, vector embeddings flowing as particles',
    'career': 'Developer career progression — certification milestone nodes, skill tree branches, enterprise org chart, learning path roadmap',
  }
  const visualVocab = pillarVisuals[opts.pillar] ?? opts.tags.join(', ')
  const coverPrompt = `Wide cinematic hero illustration for a technical blog post titled "${opts.title}". Central concept: ${opts.keyword}. Visual elements to include: ${visualVocab}. Composition: panoramic layout showing the main architecture, workflow, or contrast that is the core argument of this post — with clear visual separation between the competing or connected components. Make it feel like an expert drew the definitive diagram for this topic.`
  const coverBuffer = await generateDalleImage(coverPrompt, '1536x1024')
  fs.writeFileSync(path.join(imgDir, 'cover.png'), coverBuffer)
  console.log('✓ Cover image saved')

  // Replace inline image placeholders with generated images
  let mdx = rawMdx
  const matches = [...rawMdx.matchAll(IMAGE_PLACEHOLDER_RE)]

  for (let i = 0; i < matches.length; i++) {
    const match = matches[i]
    const imgPrompt = match[1]
    console.log(`Generating inline image ${i + 1}/${matches.length}...`)
    const imgBuffer = await generateDalleImage(imgPrompt, '1024x1024')
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
    title: 'Flow vs Apex in 2025: When to Use Which',
    keyword: 'salesforce flow vs apex 2025',
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
