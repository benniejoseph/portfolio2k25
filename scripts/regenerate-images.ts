#!/usr/bin/env npx tsx
/**
 * Regenerate infographic-style images for existing blog posts.
 * Uses the updated STYLE_SUFFIX from blog-ai.ts (clean professional infographic).
 *
 * Usage:
 *   npx tsx scripts/regenerate-images.ts              ← regenerate ALL posts
 *   npx tsx scripts/regenerate-images.ts --slug lwc-to-react-what-salesforce-devs-need-to-know
 *
 * Requires: OPENAI_API_KEY in .env.local
 */

import OpenAI from 'openai'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

// Load .env.local
const envPath = path.join(process.cwd(), '.env.local')
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8')
  for (const line of envContent.split('\n')) {
    const [key, ...rest] = line.split('=')
    if (key && rest.length) process.env[key.trim()] = rest.join('=').trim()
  }
}

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

const STYLE_SUFFIX =
  'Clean white or very light grey background. Professional technical infographic style — like a whitepaper or architecture diagram. Bold readable sans-serif text labels inside colored boxes. Color-coded sections: blue for Salesforce/platform components, green for AI/LLM components, orange for data-flow arrows, grey for middleware/control layers. High contrast, grid-aligned layout. Crisp typography. Looks like it was made in Lucidchart or Figma by a professional solutions architect. No decorative elements — purely functional diagram.'

// Per-post image definitions: cover + inline images with specific infographic prompts
const POST_IMAGE_CONFIGS: Record<
  string,
  {
    cover: string
    images: string[]
  }
> = {
  'agentforce-vs-einstein-copilot-what-is-actually-different': {
    cover:
      'Wide landscape infographic titled "Agentforce vs Einstein Copilot" showing two columns side by side. Left column labeled "Einstein Copilot" (blue): boxes for "User Asks Question", "CRM Context Loaded", "Copilot Suggests Action", "User Approves". Right column labeled "Agentforce Agent" (green): boxes for "Business Assigns Goal", "Atlas Reasoning Engine", "Tool Call Sequence", "Action Executed", "Escalate on Exception". Center divider arrow labeled "Shift from Assistant to Actor". Bottom comparison row with labels: "Human in Loop" vs "Human on Exception". Color-coded, grid-aligned, clean whitepaper diagram style.',
    images: [
      'Infographic: "Agentforce Action Design Principles" — three vertical columns. Left column (blue) labeled "Read Actions": boxes for "Get Account Health", "Find Open Cases", "Check Entitlement". Center column (grey) labeled "Decision Actions": boxes for "Calculate Discount", "Classify Lead Tier", "Assess Risk Score". Right column (orange) labeled "Write Actions": boxes for "Create Task", "Update Priority", "Send Notification". Arrows flow left to right. Each column has a risk indicator: Low, Medium, High. Clean infographic style with labels.',
      'Infographic: "When to Use Copilot vs Agentforce" — decision matrix table. 5 rows: "Lead Qualification" (Agentforce ✓), "Email Drafting" (Copilot ✓), "Case Triage" (Agentforce ✓), "Account Summary" (Copilot ✓), "Renewal Outreach" (Agentforce ✓). Two columns with colored headers: blue "Einstein Copilot (Assistant)" and green "Agentforce (Agent)". Checkmarks and X marks in each cell. Bottom note: "High volume + repeatable = Agentforce". Grid-aligned table style.',
    ],
  },

  'building-ai-agent-claude-api-salesforce': {
    cover:
      'Wide infographic titled "Claude API + Salesforce Integration Architecture". Four labeled boxes in sequence connected by arrows: 1. "Salesforce Org" (blue) — contains sub-boxes "Connected App", "OAuth Token". 2. "Node.js Agent" (grey) — contains "Tool Definitions", "Agent Loop". 3. "Claude API" (green) — contains "claude-sonnet-4-5", "tool_use responses". 4. "Salesforce Records" (blue) — contains "Query Results", "Created Records". Orange arrows labeled with action names: "Auth Request", "Tool Call", "SOQL Query", "Record Update". Clean architecture diagram on white background.',
    images: [
      'Comparison infographic: "Claude vs OpenAI for Salesforce Agents" — two-column table. Headers: "Claude (Anthropic)" in green, "GPT-4.1 (OpenAI)" in orange. 6 rows with labels: "Context Window" (200K vs 128K), "SOQL Hallucination" (Low vs Medium), "Tool Use" (Excellent vs Very Good), "JSON Fidelity" (Highly Reliable vs Reliable), "Cost per 1M tokens" (~$3 vs ~$2.50), "Best For" (Complex chains vs Ecosystem tools). Clean comparison table style, bold headers, alternating row shading.',
      'Infographic: "Production Agent Safety Checklist" — vertical checklist layout. 10 items with checkboxes, color-coded by category. Green items (Security): "Named Credential for API key", "WITH USER_MODE queries", "httpOnly token storage". Blue items (Reliability): "Turn limit MAX_TURNS=10", "Exponential backoff on rate limits", "Error wrapping in tool results". Orange items (Observability): "Agent run logging", "Tool call audit trail", "Cost monitoring dashboard". Bold labels, clean professional style.',
    ],
  },

  'building-ai-agents-with-openai-and-salesforce': {
    cover:
      'Wide infographic titled "OpenAI + Salesforce Agent Architecture". Three vertical swim lanes. Lane 1 "Salesforce Org" (blue): LWC UI → Apex Service → Named Credential → Sharing Rules. Lane 2 "Apex Control Layer" (grey): PromptBuilder → ToolRegistry → AgentRunLogger → ValidationService. Lane 3 "OpenAI API" (green): GPT-4.1-mini → tool_calls response → text response. Orange arrows connecting lanes with labels: "Serialize CRM Context", "Send Approved Tools", "Execute Tool", "Log Result". Bottom note: "OpenAI never sees Salesforce credentials". White background, grid-aligned, bold labels.',
    images: [
      'Infographic: "Safe Tool Design Pattern for Salesforce Agents". Left side shows BAD example (red border): one wide "do_anything" tool box with "Free-form SOQL", "Direct record updates", "No permission checks" — labeled "DANGEROUS". Right side shows GOOD example (green border): six small specific tool boxes — "summarize_case", "check_entitlement", "draft_response", "recommend_priority", "create_escalation", "search_knowledge" — each with permission and audit icons. Arrow from bad to good labeled "Design principle: expose business actions, not database operations".',
      'Infographic: "Enterprise Agent Guardrails Checklist" — 5 numbered sections. 1. "Permission Enforcement" (blue): WITH USER_MODE, stripInaccessible, FLS checks. 2. "Field Minimization" (grey): send only required fields, no full SObject serialization. 3. "Deterministic Execution" (orange): Apex validates before acting, business rules in code. 4. "Auditability" (green): Agent_Run__c, Agent_Tool_Call__c, Agent_Recommendation__c objects. 5. "Failure Handling" (red): timeouts, retry queue, kill switch via Custom Metadata. Bold section headers, icon bullets.',
    ],
  },

  'building-your-first-ai-agent-with-claude-api-and-salesforce': {
    cover:
      'Wide infographic titled "Claude API Salesforce Case Triage Agent — Architecture". Five sequential steps connected by arrows: 1. "Case Created" (blue Salesforce icon) → 2. "Apex Loads Context" (grey box: Case + Account + Entitlement + Activity) → 3. "Queueable Callout" (grey box: Named Credential + API Request) → 4. "Claude Reasons" (green box: claude-sonnet-4-5, returns structured JSON: priority, queue, summary) → 5. "Apex Validates + Writes" (blue box: permission check → Case Update → Agent_Run__c log). Color-coded, grid-aligned, arrows labeled with data type.',
    images: [
      'Infographic: "Apex-Claude Integration Pattern". Shows the complete code flow. Left side: Apex class boxes — "QueueableCaselTriageJob", "CaseContextBuilder", "ClaudeCalloutService", "AgentResponseValidator". Right side: Claude API boxes — "Messages Endpoint", "System Prompt", "Structured JSON Response". Center: Named Credential box with security lock icon. Arrows labeled: "Serialize case context", "POST request", "Parse JSON response", "Validate fields". All boxes have class names, method names as sub-labels. Blue=Salesforce, green=Claude, grey=integration layer.',
      'Infographic: "Agent Evaluation Metrics Dashboard". Six metric boxes in 2x3 grid. Each box has metric name, description, and target range. 1. "Priority Accuracy" — correct vs total (target: >85%). 2. "Queue Accuracy" — correct routing (target: >90%). 3. "Escalation Miss Rate" — false negatives (target: <5%). 4. "Human Override Rate" — agent wrong (target: <20%). 5. "Avg Handle Time" — reduction from baseline (target: -30%). 6. "Cost per Case" — API tokens (target: <$0.05). Color indicator: green=good, yellow=warning, red=investigate. Clean dashboard grid style.',
    ],
  },

  'lwc-to-react-what-salesforce-devs-need-to-know': {
    cover:
      'Wide infographic titled "LWC vs React for Salesforce Developers". Two columns with shared center divider. Left column "LWC" (Salesforce blue): "Platform-governed runtime", "@wire for data fetching", "Lightning Data Service", "SLDS design system", "Salesforce metadata deployment", "FLS/Sharing enforced by platform". Right column "React" (cyan): "Application-owned runtime", "useQuery + fetch for data", "Custom API layer required", "Your design system", "Vercel/Cloud/CDN deployment", "Auth + security = your responsibility". Center divider labeled "Rule: LWC inside Salesforce, React for external product experiences". Clean split comparison.',
    images: [
      'Infographic table titled "LWC → React Concept Mapping" — two-column comparison table. 10 rows, alternating grey/white. LWC column (blue header): @api, @track, @wire, connectedCallback, dispatchEvent, NavigationMixin, lightning-record-form, LightningDataService, @salesforce/apex import, jest.mock apex. React column (cyan header): props, useState, useQuery/TanStack, useEffect([]), callback prop, useNavigate, React Hook Form, custom fetch+cache, REST API call, msw handler. Bold column headers, clean table style, monospace font for code items.',
      'Infographic: "React Migration Checklist for Salesforce Devs" — vertical checklist with 4 color-coded sections. Section 1 "Architecture" (blue): Auth strategy, BFF layer, API limit protection, Permission enforcement. Section 2 "Components" (cyan): @wire → useQuery, @api → props, events → callbacks, Navigation → React Router. Section 3 "Security" (orange): No API keys in browser, httpOnly tokens, FLS on server side, CORS config. Section 4 "Deployment" (green): Env vars, Feature flags, Error boundaries, Observability setup. Checkbox icons, section headers, clean professional list.',
    ],
  },

  'rag-for-salesforce-orgs-index-your-knowledge-base': {
    cover:
      'Wide infographic titled "RAG Architecture for Salesforce Knowledge Base". Five vertical stages labeled left to right. Stage 1 "Salesforce Knowledge" (blue): Published articles, Data categories, Visibility rules, Multiple languages. Stage 2 "Indexer Service" (grey): Scheduled pull, HTML→text normalizer, Metadata extractor. Stage 3 "Embedding + Storage" (green): Chunk text, Generate embeddings, Store in vector DB with metadata. Stage 4 "Permission-Aware Retrieval" (orange): Filter by visibility, Semantic search, Re-rank results. Stage 5 "Answer Generation" (purple): LLM + context, Citation enforcement, Structured response. Arrows connecting stages with data type labels.',
    images: [
      'Infographic: "What to Extract from Salesforce Knowledge Records" — structured field mapping diagram. Left: Salesforce Knowledge__kav object box (blue) with field list: Title, ArticleBody, UrlName, LastModifiedDate, Language, IsVisibleInPfe, IsVisibleInCsp, DataCategories. Right: Vector DB document box (green) with mapped fields: id=UrlName, text=cleaned_body, metadata={title, language, categories, visibility, version, lastModified}. Center arrow labeled "Normalizer + Chunker". Below: warning box "Do NOT embed: draft articles, archived, internal-only for customer channels". Clean mapping diagram.',
      'Infographic: "5 RAG Failure Modes in Salesforce" — vertical list with icons. 1. "Wrong Version Retrieved" (red): old policy article answers instead of current → Fix: include PublishStatus and LastModifiedDate in filter. 2. "Visibility Leak" (red): internal article shown to customer channel → Fix: always filter IsVisibleIn* before retrieval. 3. "Region Mismatch" (orange): EMEA policy answers NA question → Fix: index region/language metadata, filter at query time. 4. "HTML Noise" (orange): raw HTML in embeddings → Fix: strip_tags normalizer before chunking. 5. "Stale Cache" (yellow): changed article not re-indexed → Fix: delta sync on LastModifiedDate. Bold numbered list.',
    ],
  },

  'agentforce-custom-actions-a-builder-playbook': {
    cover:
      'Wide infographic titled "Agentforce Custom Actions: Architecture Overview". Three rows showing action categories. Row 1 "Read Actions" (blue): Get Account Health → Load Case History → Check Entitlement → Return structured JSON. Row 2 "Decision Actions" (grey): Calculate Eligibility → Classify Tier → Assess Risk → Return recommendation. Row 3 "Write Actions" (orange): Create Task → Update Status → Send Notification → Log to Agent_Run__c. Left side: "Agentforce Agent (Atlas)" box with "Decides which action to call". Right side: "Salesforce Platform" box with "Executes deterministically". Vertical arrows connecting agent to each action row. Clean swimlane diagram.',
    images: [
      'Infographic: "Custom Action Input/Output Schema Design". Split diagram showing best vs worst practice. Left "Bad Design" (red border): action named "update_salesforce" with wide inputs: soql_query, object_name, field_map, where_clause, operation_type — labeled "Too broad, unpredictable". Right "Good Design" (green border): action named "create_renewal_task" with specific inputs: account_id (required), due_date_offset_days, assignee_queue, risk_reason — labeled "Narrow, predictable, auditable". Bottom principle: "Good action = one clear business operation with typed inputs". Clean split comparison.',
      'Infographic: "Agentforce Action Testing Checklist". Two columns: "Unit Tests" (blue) and "Integration Tests" (green). Unit test checklist: input validation, null handling, permission enforcement, error messages, boundary conditions. Integration test checklist: agent calls correct action, action runs in correct context, output format matches schema, audit record created, failure mode handled gracefully. Bottom section "Go-Live Criteria" (orange): 100% test coverage, human review for write actions, logging object created, kill switch configured, eval set reviewed. Checkbox-style professional checklist.',
    ],
  },
}

async function generateImage(prompt: string, size: '1536x1024' | '1024x1024'): Promise<Buffer> {
  const fullPrompt = `${prompt} ${STYLE_SUFFIX}`
  console.log(`  Prompt preview: ${fullPrompt.slice(0, 100)}...`)

  const response = await client.images.generate({
    model: 'gpt-image-1',
    prompt: fullPrompt,
    n: 1,
    size,
    quality: 'high',
  })

  const b64 = response.data?.[0]?.b64_json
  if (!b64) throw new Error('No image data returned from gpt-image-1')
  return Buffer.from(b64, 'base64')
}

async function ensureCoverImageInFrontmatter(slug: string): Promise<void> {
  const postPath = path.join(process.cwd(), 'content/posts')
  const files = fs.readdirSync(postPath).filter((f) => f.endsWith('.mdx'))

  for (const file of files) {
    const content = fs.readFileSync(path.join(postPath, file), 'utf-8')
    const { data: fm, content: body } = matter(content)

    // Check if this file belongs to this slug
    const fileSlug = file.replace('.mdx', '')
    if (fileSlug !== slug && !file.includes(slug.slice(0, 30))) continue

    if (!fm.coverImage) {
      const coverPath = `/images/blog/${slug}/cover.png`
      const raw = fs.readFileSync(path.join(postPath, file), 'utf-8')
      const updated = raw.replace(/^---\n([\s\S]*?)\n---/, (_, fmBody) => {
        return `---\n${fmBody}\ncoverImage: ${coverPath}\n---`
      })
      fs.writeFileSync(path.join(postPath, file), updated, 'utf-8')
      console.log(`  ✓ Added coverImage to ${file}`)
    }
  }
}

async function regeneratePost(slug: string): Promise<void> {
  const config = POST_IMAGE_CONFIGS[slug]
  if (!config) {
    console.log(`  ⚠ No image config found for slug: ${slug} — skipping`)
    return
  }

  const imgDir = path.join(process.cwd(), 'public/images/blog', slug)
  fs.mkdirSync(imgDir, { recursive: true })

  console.log(`\n📸 Regenerating images for: ${slug}`)

  // Cover image
  console.log('  → Generating cover (1536×1024)...')
  const coverBuf = await generateImage(config.cover, '1536x1024')
  fs.writeFileSync(path.join(imgDir, 'cover.png'), coverBuf)
  console.log('  ✓ cover.png saved')

  // Inline images
  for (let i = 0; i < config.images.length; i++) {
    console.log(`  → Generating image-${i + 1} (1024×1024)...`)
    const buf = await generateImage(config.images[i], '1024x1024')
    fs.writeFileSync(path.join(imgDir, `image-${i + 1}.png`), buf)
    console.log(`  ✓ image-${i + 1}.png saved`)
  }

  // Ensure frontmatter has coverImage
  await ensureCoverImageInFrontmatter(slug)
}

async function main() {
  const args = process.argv.slice(2)
  const slugArg = args.indexOf('--slug')

  const slugs =
    slugArg !== -1
      ? [args[slugArg + 1]]
      : Object.keys(POST_IMAGE_CONFIGS)

  console.log(`\n🔄 Regenerating images for ${slugs.length} post(s) with infographic style\n`)

  for (const slug of slugs) {
    await regeneratePost(slug)
  }

  console.log('\n✅ All done. Commit public/images/blog/ to deploy.')
}

main().catch((err) => {
  console.error('Error:', err.message)
  process.exit(1)
})
