import Anthropic from '@anthropic-ai/sdk'
import fs from 'fs'
import path from 'path'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

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

Now write the full post body in MDX. Remember: code snippet + real example + TL;DR at the end.`
}

export async function generatePost(opts: GeneratePostOptions): Promise<string> {
  const message = await client.messages.create({
    model: 'claude-opus-4-7',
    max_tokens: 4096,
    system: SYSTEM_PROMPT,
    messages: [{ role: 'user', content: buildPrompt(opts) }],
  })

  const content = message.content[0]
  if (content.type !== 'text') throw new Error('Unexpected response type')
  return content.text
}

export async function generateAndSave(opts: GeneratePostOptions): Promise<string> {
  const mdx = await generatePost(opts)
  const slug = opts.title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .slice(0, 60)

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
    tags: ['AI', 'Claude', 'Salesforce', 'Agents'],
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
