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

import { GoogleGenAI } from '@google/genai'
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

const gemini = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })

// Gemini Imagen 3 style directive — dark, rich, premium developer infographic
const IMAGEN_STYLE =
  'Dark navy background (#0a1628). Neon electric blue (#00d4ff) and vibrant green (#00ff88) accents. Glowing bordered section boxes. Bold crisp white sans-serif text labels inside each box. Orange (#ff6b35) directional arrows showing data flow. Red (#ff4757) for bad/danger patterns, green (#2ed573) for success/good patterns. Ultra-high contrast professional technical infographic. Looks like a premium developer reference card — NOT abstract art. Every component, step, and label must be clearly readable.'

// Per-post image definitions — premium Gemini Imagen 3 prompts
const POST_IMAGE_CONFIGS: Record<string, { cover: string; images: string[] }> = {
  'agentforce-vs-einstein-copilot-what-is-actually-different': {
    cover:
      'Premium dark-themed technical infographic titled "AGENTFORCE vs EINSTEIN COPILOT" in large bold white text. Subtitle "What Is Actually Different" in neon electric blue. Main visual: two tall columns side by side. LEFT COLUMN (neon blue border, header "EINSTEIN COPILOT — Assistant Mode"): boxes labeled "User Asks Question", "CRM Context Loaded", "Copilot Suggests Action", "User Reviews + Approves". Annotation at bottom: "Human in the Loop" with person icon. RIGHT COLUMN (neon green border, header "AGENTFORCE — Agent Mode"): boxes labeled "Business Defines Goal", "Atlas Reasoning Engine", "Multi-Step Tool Calls", "Action Executed", "Escalate on Exception". Annotation at bottom: "Human on Exception" with shield icon. Center glowing orange divider arrow labeled "SHIFT: Assistant → Actor". Bottom strip: 3 key stat cards — "User-Initiated" vs "Goal-Assigned", "Suggest" vs "Execute", "Single-Turn" vs "Multi-Step".',
    images: [
      'Premium dark infographic: "AGENTFORCE ACTION TYPES" — 3 vertical columns with distinct colors. LEFT COLUMN (neon blue, header "READ ACTIONS 🔍"): labeled boxes "GetAccountHealth", "FindOpenCases", "CheckEntitlement", "LoadCaseHistory". Risk badge: "LOW RISK". CENTER COLUMN (grey, header "DECISION ACTIONS ⚡"): labeled boxes "CalculateDiscount", "ClassifyLeadTier", "AssessRenewalRisk", "EvaluatePriority". Risk badge: "MEDIUM RISK". RIGHT COLUMN (orange, header "WRITE ACTIONS ✍️"): labeled boxes "CreateFollowUpTask", "UpdateCasePriority", "SubmitApprovalRequest". Risk badge: "HIGH RISK — needs confirmation". Orange arrows flow left to right. Bottom principle: "Earn autonomy left to right. Start with READ."',
      'Premium dark infographic: "COPILOT vs AGENTFORCE — Decision Matrix" — structured table on dark navy. Header row: "USE CASE" | "EINSTEIN COPILOT ✓" | "AGENTFORCE ✓". 8 data rows with alternating dark shading: "Lead Qualification" (—, ✓ green), "Email Drafting" (✓ green, —), "Case Triage" (—, ✓ green), "Account Summary" (✓ green, —), "Renewal Outreach" (—, ✓ green), "Call Prep" (✓ green, —), "Order Status Handling" (—, ✓ green), "Pipeline Inspection" (✓ green, —). Bottom callout box in neon orange: "Rule: Repeatable + High Volume = Agentforce. Exploratory + Judgment = Copilot".',
    ],
  },

  'building-ai-agent-claude-api-salesforce': {
    cover:
      'Premium dark technical infographic titled "CLAUDE API + SALESFORCE" in huge bold white text. Subtitle "Tool-Use Agent Without Abstraction Layers" in neon blue. Main architecture: 4 boxes connected by glowing orange arrows in horizontal sequence. Box 1 "SALESFORCE ORG" (neon blue border): sub-labels "Connected App", "OAuth 2.0", "Client Credentials". Box 2 "NODE.JS AGENT" (grey border): sub-labels "Tool Definitions", "Agent Loop", "executeTool()". Box 3 "CLAUDE API" (neon green border): sub-labels "claude-sonnet-4-5", "tool_use blocks", "200K context". Box 4 "CRM DATA" (neon blue border): sub-labels "SOQL Results", "Created Records". Arrow labels: "Auth Token", "Tool Call Request", "SOQL Query", "JSON Response". Bottom stats row: "200K Context Window" | "Multi-Step Reasoning" | "No Hallucination on Tools".',
    images: [
      'Premium dark comparison infographic: "CLAUDE vs GPT-4.1 FOR SALESFORCE AGENTS" — two columns. Header: "CLAUDE (Anthropic)" in neon green | "GPT-4.1 (OpenAI)" in orange. 7 comparison rows with alternating background: "Context Window: 200K tokens" vs "128K tokens", "SOQL Hallucination: LOW ✓" vs "Medium ⚠", "Tool Use: Excellent ✓" vs "Very Good ✓", "JSON Fidelity: Highly Reliable ✓" vs "Reliable ✓", "Cost/1M tokens: ~$3" vs "~$2.50", "Best For: Complex chains, large case history" vs "OpenAI ecosystem tools". Bottom recommendation box in neon blue: "Choose Claude when loading 50+ email threads or nested tool call chains".',
      'Premium dark infographic: "PRODUCTION AGENT CHECKLIST" — vertical list with 3 color-coded sections. SECURITY section (neon blue header): ✓ Named Credential (not env var), ✓ WITH USER_MODE in all queries, ✓ httpOnly cookies for tokens, ✓ No API keys in browser. RELIABILITY section (orange header): ✓ MAX_TURNS = 10 guard, ✓ Exponential backoff on 429s, ✓ Error wrapped as tool_result (not thrown), ✓ max_tokens guard for truncation. OBSERVABILITY section (green header): ✓ Agent_Run__c logging, ✓ Tool call audit trail, ✓ Cost monitoring, ✓ Kill switch via Custom Metadata flag.',
    ],
  },

  'building-ai-agents-with-openai-and-salesforce': {
    cover:
      'Premium dark technical infographic titled "OPENAI + SALESFORCE AGENT" in bold white. Subtitle "The Architecture That Survives Production" in neon blue. Three swim-lane columns separated by glowing dividers. LANE 1 "SALESFORCE ORG" (neon blue border): vertical stack — LWC Component → Apex Service → Named Credential → Sharing Rules → FLS Enforcement. LANE 2 "APEX CONTROL LAYER" (grey border): PromptBuilder → ToolRegistry → AgentRunLogger → ValidationService → AgentRecommendation__c. LANE 3 "OPENAI API" (green border): gpt-4.1 → tool_calls response → natural language output. Glowing orange arrows crossing lanes labeled: "Serialize CRM context", "Send approved tools", "Execute in Salesforce", "Log result". Bottom warning strip in red: "OpenAI never sees Salesforce credentials or session IDs".',
    images: [
      'Premium dark split infographic: "TOOL DESIGN — BAD vs GOOD". LEFT HALF (dark red background, header "❌ BAD — Too Broad"): one large box labeled "update_salesforce" with inputs listed: soql_query, object_name, field_map, where_clause, operation_type. Warning badges: "No permission check", "Unpredictable", "Blast radius: ENTIRE ORG". RIGHT HALF (dark green background, header "✓ GOOD — Business Actions"): 5 small specific boxes: "summarize_case", "check_entitlement", "draft_case_response", "recommend_priority", "create_escalation_request". Each with green badge: "Permission-checked", "Auditable", "Bounded". Center arrow in orange: "Design Principle: Expose BUSINESS ACTIONS, not database operations".',
      'Premium dark infographic: "ENTERPRISE GUARDRAILS FRAMEWORK" — 5 numbered sections in vertical layout. Section 1 (neon blue): "PERMISSION ENFORCEMENT — WITH USER_MODE, stripInaccessible(), FLS checks, Sharing rules". Section 2 (grey): "FIELD MINIMIZATION — Send only required fields, no full SObject dump, max 5 records to LLM". Section 3 (orange): "DETERMINISTIC EXECUTION — Apex validates EVERY tool request, business rules in code not prompts". Section 4 (green): "AUDITABILITY — Agent_Run__c, Agent_Tool_Call__c, Agent_Recommendation__c, correlation IDs". Section 5 (red): "FAILURE RESILIENCE — Timeout handling, retry queue, kill switch Custom Metadata flag, graceful degradation".',
    ],
  },

  'building-your-first-ai-agent-with-claude-api-and-salesforce': {
    cover:
      'Premium dark technical infographic titled "CLAUDE API SALESFORCE AGENT" in bold white. Subtitle "Case Triage — Step by Step" in neon electric blue. Five-step horizontal flow with numbered circles. Step 1 (blue circle): "CASE CREATED" — Salesforce Case object icon, trigger fires. Step 2 (grey circle): "APEX LOADS CONTEXT" — boxes: Case Details, Account Tier, Entitlement, Last 5 Emails, Open Escalations. Step 3 (grey circle): "QUEUEABLE CALLOUT" — Named Credential, API Request, 30s timeout. Step 4 (green circle): "CLAUDE REASONS" — claude-sonnet-4-5, returns JSON: {priority, queue, summary, escalate}. Step 5 (blue circle): "APEX VALIDATES + WRITES" — permission check → Case update → Agent_Run__c log. Glowing orange arrows connecting steps with data labels.',
    images: [
      'Premium dark infographic: "APEX + CLAUDE INTEGRATION CLASS DIAGRAM" — split layout. LEFT SIDE (blue section): Apex class boxes with glowing borders — "CaseTriageQueueable implements Queueable", "CaseContextBuilder", "ClaudeCalloutService", "AgentResponseValidator", "AgentRunLogger". RIGHT SIDE (green section): Claude API boxes — "Messages API /v1/messages", "System Prompt (triage policy)", "Tool definitions JSON", "Structured response: priority + queue + summary". CENTER (grey section): "Named Credential" box with lock icon, arrow labeled "POST request (no API key in code)". All class names in monospace white font. Orange arrows connecting left-to-right with labels.',
      'Premium dark dashboard infographic: "AGENT QUALITY METRICS" — 6 metric cards in 2x3 grid. Each card: dark box with neon border, metric name, description, target. Card 1 (green border): "PRIORITY ACCURACY — Correct classifications / Total cases — Target: >85%". Card 2 (green border): "QUEUE ACCURACY — Correct routing decisions — Target: >90%". Card 3 (orange border): "ESCALATION MISS RATE — P1 cases routed to Tier 1 — Target: <5%". Card 4 (orange border): "HUMAN OVERRIDE RATE — Agent decisions changed by rep — Target: <20%". Card 5 (blue border): "HANDLE TIME REDUCTION — vs baseline avg — Target: -30%". Card 6 (blue border): "COST PER CASE — API token cost — Target: <$0.05". Color-coded status indicators.',
    ],
  },

  'lwc-to-react-what-salesforce-devs-need-to-know': {
    cover:
      'Premium dark technical infographic titled "LWC vs REACT" in large bold white. Subtitle "For Salesforce Developers" in neon blue. Two tall columns. LEFT COLUMN (neon blue border, header "⚡ LWC — Salesforce Native"): bullet items in blue boxes — "@wire for data", "Lightning Data Service", "SLDS by default", "FLS/Sharing by platform", "Metadata deployment", "@InvocableMethod integration", "jest.mock apex". RIGHT COLUMN (cyan border, header "⚛ REACT — Application Layer"): bullet items in dark cyan boxes — "useQuery + fetch", "Build your own API layer", "Choose your design system", "Auth = your responsibility", "Vercel/Cloud deploy", "REST API contracts", "msw for mocks". CENTER golden rule strip: "USE LWC: User is inside Salesforce | USE REACT: You\'re building a product experience".',
    images: [
      'Premium dark comparison table infographic: "LWC → REACT CONCEPT MAPPING" — two columns, 12 rows. Column headers: "LWC CONCEPT" (neon blue) | "REACT EQUIVALENT" (cyan). Rows in alternating dark shading: "@api property → props (read-only)", "@track state → useState()", "@wire adapter → useQuery/TanStack", "connectedCallback → useEffect([], [])", "disconnectedCallback → cleanup in useEffect", "dispatchEvent → callback prop", "NavigationMixin → useNavigate()", "lightning-record-form → React Hook Form + Zod", "LightningDataService → custom fetch + cache", "SOQL @AuraEnabled → REST API endpoint", "jest.mock apex → msw handler". Footer: "Hardest unlearn: platform enforces auth+permissions in LWC, you must build that in React".',
      'Premium dark checklist infographic: "SALESFORCE → REACT MIGRATION CHECKLIST" — 4 color-coded sections. ARCHITECTURE (neon blue header): ☐ Auth strategy chosen (PKCE/JWT/BFF), ☐ Backend for Salesforce callouts built, ☐ API rate limits protected, ☐ FLS enforced server-side. COMPONENTS (cyan header): ☐ @wire → useQuery done, ☐ @api → props refactored, ☐ Events → callback props, ☐ NavigationMixin → React Router. SECURITY (orange header): ☐ No API keys in browser, ☐ Tokens in httpOnly cookies, ☐ CORS locked down, ☐ Error msgs sanitized. DEPLOYMENT (green header): ☐ Env vars injected at runtime, ☐ Feature flags added, ☐ Error boundaries in place, ☐ Monitoring configured.',
    ],
  },

  'rag-for-salesforce-orgs-index-your-knowledge-base': {
    cover:
      'Premium dark technical infographic titled "RAG FOR SALESFORCE KNOWLEDGE BASE" in bold white. Subtitle "Index → Retrieve → Answer" in neon electric blue. Five horizontal pipeline stages with glowing arrows. Stage 1 (blue border): "SALESFORCE KNOWLEDGE — Knowledge__kav records, Published + IsLatestVersion=true, Language/Region/Category metadata, Visibility flags". Stage 2 (grey border): "INDEXER SERVICE — Scheduled delta sync on LastModifiedDate, HTML → clean text normalizer, Metadata extractor, Article chunker (1200 chars, 150 overlap)". Stage 3 (green border): "EMBEDDINGS + VECTOR DB — text-embedding-3-large model, pgvector/Pinecone, Rich metadata stored with chunk". Stage 4 (orange border): "PERMISSION-AWARE RETRIEVAL — Filter: audience + region + language + product, Semantic search, Re-rank top-k". Stage 5 (purple border): "ANSWER GENERATION — LLM + retrieved chunks, Mandatory citation, Customer-safe output check". Orange pipeline arrows between stages.',
    images: [
      'Premium dark mapping infographic: "SALESFORCE KNOWLEDGE → VECTOR DB FIELD MAPPING" — two columns connected by center processor. LEFT (blue border, header "Knowledge__kav FIELDS"): Id, KnowledgeArticleId, Title, Summary, UrlName, Language, PublishStatus, IsLatestVersion, LastModifiedDate, Answer__c (body), Product__c, Region__c, Audience__c, DataCategories. CENTER (orange): "NORMALIZER — strip HTML, remove scripts, unescape entities, collapse whitespace → CHUNKER — 1200 chars, 150 overlap, keep headings intact". RIGHT (green border, header "VECTOR CHUNK DOCUMENT"): id, text (clean chunk), metadata: {title, language, product, region, audience, categories, articleId, version, lastModified, url}. RED WARNING box below: "NEVER index: Draft articles, Archived, Internal-only in customer channels".',
      'Premium dark infographic: "5 RAG FAILURE MODES IN SALESFORCE" — vertical numbered list. Each item: icon, failure name, cause, fix. Item 1 (red): "❌ WRONG VERSION RETRIEVED — Old policy answers → Fix: filter PublishStatus=\'Online\' AND IsLatestVersion=true". Item 2 (red): "❌ VISIBILITY LEAK — Internal content shown to customers → Fix: ALWAYS filter IsVisibleInCsp / IsVisibleInPfe before retrieval". Item 3 (orange): "⚠ REGION MISMATCH — EMEA policy answers NA question → Fix: index + filter Region__c at query time". Item 4 (orange): "⚠ HTML NOISE IN EMBEDDINGS — Raw HTML fragments hurt semantic quality → Fix: BeautifulSoup strip before chunking". Item 5 (yellow): "⚠ STALE INDEX — Article updated but not re-indexed → Fix: incremental sync on SystemModstamp every 15 min".',
    ],
  },

  'agentforce-custom-actions-a-builder-playbook': {
    cover:
      'Premium dark technical infographic titled "AGENTFORCE CUSTOM ACTIONS" in bold white. Subtitle "A Builder Playbook" in neon electric blue. Main visual: swimlane architecture. TOP ROW "AGENTFORCE AGENT (Atlas Reasoning)" (neon blue): receives user message → identifies intent → selects action → passes typed inputs. MIDDLE ROW "APEX ACTIONS LAYER" (grey): three action boxes — "EvaluateAccountHealth (READ)" → "GenerateEscalationDraft (DECISION)" → "CreateCSMFollowUpTask (WRITE)". Each with permission lock icon. BOTTOM ROW "SALESFORCE PLATFORM" (dark blue): Account records, Case records, Task records, Audit logs, Agent_Run__c. Vertical orange arrows connecting rows labeled: "Tool call request", "Validated execution", "DML write + audit". Bottom principle strip: "Agent converses. Apex enforces. Salesforce owns."',
    images: [
      'Premium dark split infographic: "ACTION SCHEMA — BAD vs GOOD DESIGN". LEFT HALF (dark red, header "❌ BAD — God Action"): large box "update_salesforce" with inputs: soql_query (string), object_name (string), field_map (object), where_clause (string), operation_type (UPSERT/DELETE/INSERT). Danger badges: "Non-deterministic", "No audit trail", "Agent can delete anything", "NEVER BUILD THIS". RIGHT HALF (dark green, header "✓ GOOD — Single-Purpose Action"): specific box "CreateRenewalFollowUpTask" with typed inputs: account_id (Id, required), due_date_offset_days (Integer, default 2), assignee_queue (String), risk_reason (String, max 1000). Safety badges: "Idempotent ✓", "Permission-checked ✓", "One clear job ✓", "Testable ✓". Bottom: "One action = one business operation".',
      'Premium dark infographic: "FLOW vs APEX FOR CUSTOM ACTIONS" — comparison table. 8 comparison rows. Header: "FACTOR" | "USE FLOW" | "USE APEX". Rows: "Builder" (Admin/Consultant vs Developer), "Logic Complexity" (Simple conditional vs Complex validation), "External Callout" (Limited vs Full HTTP support), "Error Handling" (Fault paths only vs try/catch + custom exceptions), "Bulk Safety" (Risky vs Bulkified patterns), "Test Coverage" (Limited vs Full Apex test classes), "Production Risk" (Prototype/low-risk vs Any data-mutating action), "My Rule" ("Start here to prove logic" vs "Move here for production"). Bottom neon callout: "Always migrate Flow → Apex before touching revenue or customer data".',
    ],
  },
}

async function generateImage(
  prompt: string,
  aspectRatio: '16:9' | '1:1' = '1:1'
): Promise<Buffer> {
  const fullPrompt = `${prompt}\n\nStyle requirements: ${IMAGEN_STYLE}`
  console.log(`  Prompt preview: ${prompt.slice(0, 120)}...`)

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

  if (typeof imageBytes === 'string') return Buffer.from(imageBytes, 'base64')
  return Buffer.from(imageBytes)
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

  // Cover image (16:9 wide)
  console.log('  → Generating cover (16:9)...')
  const coverBuf = await generateImage(config.cover, '16:9')
  fs.writeFileSync(path.join(imgDir, 'cover.png'), coverBuf)
  console.log('  ✓ cover.png saved')

  // Inline images (1:1 square)
  for (let i = 0; i < config.images.length; i++) {
    console.log(`  → Generating image-${i + 1} (1:1)...`)
    const buf = await generateImage(config.images[i], '1:1')
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
