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

  How to write a strong IMAGE_PROMPT (INFOGRAPHIC STYLE):
  • These images are INFOGRAPHICS — they must contain labeled boxes, readable text annotations, arrows with labels, color-coded sections, and clear visual hierarchy. Think: professional architecture diagrams, comparison charts, decision flowcharts with text.
  • Be SPECIFIC — name the exact technologies, steps, and decisions shown. Every box/node should have a clear text label describing what it represents.
  • Describe the LAYOUT and CONTENT — "3-column comparison table", "top-down flowchart with 5 steps", "layered stack with labels for each layer", "left vs right before/after with callout annotations"
  • Include the actual LABELS and TEXT that should appear in the infographic. For example: label boxes as "Apex Service Layer", "Named Credential", "OpenAI API", "Salesforce Data" etc.
  • COLOR CODING — describe which color each section/component uses (e.g., blue for Salesforce components, green for AI/LLM components, orange for data flow, red for danger zones)
  • First placeholder: a structured architecture or "how it works" diagram with labeled steps/components
  • Second placeholder: a comparison chart, decision matrix, or checklist-style infographic illustrating the specific technical decision being explained
  • Style: "Clean white background, professional infographic style, bold readable sans-serif labels inside colored boxes, color-coded arrows showing data flow direction, high contrast, grid-aligned layout — like a technical whitepaper diagram"
  • GOOD example: "Infographic architecture diagram titled 'OpenAI + Salesforce Agent Architecture'. Three vertical columns labeled 'Salesforce Org' (blue), 'Apex Control Layer' (grey), 'OpenAI API' (green). In the Salesforce column: boxes for LWC UI, Apex Service, Named Credential, Sharing Rules. Center column: boxes for PromptBuilder, ToolRegistry, AgentRunLogger with arrows connecting them. Right column: GPT-4 model box with tool_calls response arrow pointing back left. Bold black labels inside each box, orange arrows showing data flow direction. Clean white background, professional technical diagram style."
  • BAD example: "dark cyberpunk illustration of salesforce" ← too vague, produces generic art with no readable labels

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

const STYLE_SUFFIX = 'Clean white or very light grey background. Professional technical infographic style — like a whitepaper or architecture diagram. Bold readable sans-serif text labels inside colored boxes. Color-coded sections: blue for Salesforce/platform components, green for AI/LLM components, orange for data-flow arrows, grey for middleware/control layers. High contrast, grid-aligned layout. Crisp typography. Looks like it was made in Lucidchart or Figma by a professional solutions architect. No decorative elements — purely functional diagram.'

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
    'salesforce': 'Salesforce platform components — labeled boxes for Apex, Lightning Web Components, Org layers, Sharing Model, Platform Events, Named Credentials, and the Salesforce cloud logo. Color: blue for Salesforce core, grey for middleware, orange for integration arrows.',
    'ai-agentic': 'AI agent system components — labeled boxes for LLM/Model, Tool Registry, Memory Store, Orchestrator, Prompt Builder, and Output Handler. Color: green for AI/LLM components, blue for external APIs, orange for data-flow arrows, grey for control layer.',
    'career': 'Developer career roadmap — labeled milestone boxes for skill levels, certification badges, specialization tracks, salary ranges, and community contributions. Color: blue for technical skills, green for career milestones, orange for community/network nodes.',
  }
  const visualVocab = pillarVisuals[opts.pillar] ?? opts.tags.join(', ')
  const coverPrompt = `Wide landscape infographic for a technical blog post titled "${opts.title}". This should look like a professional architecture overview diagram — NOT abstract art. Central concept: ${opts.keyword}. Show the key components, layers, or contrasts of this topic as labeled boxes/sections with connecting arrows. ${visualVocab} Layout: wide horizontal composition with 3-4 main labeled sections showing how the pieces relate. Include short descriptive labels inside each component box. Add a clear visual hierarchy with a title area at top. Looks like a polished solutions architect overview diagram.`
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
