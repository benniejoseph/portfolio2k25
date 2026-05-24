#!/usr/bin/env npx tsx
/**
 * Regenerate infographic-style images for existing blog posts.
 * 4 visual archetypes: Whiteboard, Comparison, Blueprint (dark), Architecture Map
 *
 * Usage:
 *   npx tsx scripts/regenerate-images.ts              ← regenerate ALL posts
 *   npx tsx scripts/regenerate-images.ts --slug lwc-to-react-what-salesforce-devs-need-to-know
 */

import { GoogleGenAI } from '@google/genai'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import {
  styleWhiteboard,
  styleComparison,
  styleBlueprint,
  styleArchitecture,
} from '../src/lib/image-styles'

// Load .env.local
const envPath = path.join(process.cwd(), '.env.local')
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8')
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eqIdx = trimmed.indexOf('=')
    if (eqIdx === -1) continue
    const key = trimmed.slice(0, eqIdx).trim()
    const raw = trimmed.slice(eqIdx + 1).trim()
    const value = raw.replace(/^(['"])(.*)\1$/, '$2')
    if (key && !process.env[key]) process.env[key] = value
  }
}

const gemini = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })

// Per-post image definitions — using style-specific prompt generators
const POST_IMAGE_CONFIGS: Record<string, { cover: string; images: string[] }> = {
  'agentforce-vs-einstein-copilot-what-is-actually-different': {
    cover: styleComparison({
      title: 'AGENTFORCE vs EINSTEIN COPILOT',
      subtitle: 'What Is Actually Different',
      col1Title: 'EINSTEIN COPILOT — Assistant Mode',
      col1Points: [
        'User asks a question → Copilot suggests action',
        'Human reviews and approves every step',
        'Single-turn conversational assistant',
        'Works great for: summarise, draft, search',
      ],
      col2Title: 'AGENTFORCE — Autonomous Agent Mode',
      col2Points: [
        'Business defines a goal → Atlas executes',
        'Multi-step tool calls without human approval',
        'Escalates only on exceptions or low confidence',
        'Works great for: triage, routing, outreach',
      ],
    }),
    images: [
      styleBlueprint({
        title: 'AGENTFORCE ACTION TYPES',
        subtitle: 'Earn Autonomy Left to Right',
        badLabel: 'WRITE ACTIONS — HIGH RISK',
        goodLabel: 'READ ACTIONS — LOW RISK',
        badCode: `// ❌ Never let agent write without guard
UpdateCasePriority(caseId, priority)  // no confirmation
CreateFollowUpTask(accountId)         // no idempotency check`,
        goodCode: `// ✓ Guard every write action
if (!agentConfig.allowWrites) return 'read-only mode';
Result r = CreateFollowUpTask(accountId, dedupKey);
AgentRunLogger.log(r);`,
        whyCards: [
          { label: 'READ ACTIONS — GetAccountHealth, FindOpenCases, CheckEntitlement', icon: 'magnifying glass' },
          { label: 'DECISION ACTIONS — CalculateDiscount, ClassifyLeadTier, AssessRenewalRisk', icon: 'lightning bolt' },
          { label: 'WRITE ACTIONS — CreateFollowUpTask, UpdateCasePriority (guard required)', icon: 'warning shield' },
        ],
        checklist: [
          'Start with READ actions only',
          'Add DECISION actions after 2 weeks of monitoring',
          'WRITE actions need dedicated approval gate',
          'Log every agent action to Agent_Run__c',
          'Build kill switch via Custom Metadata flag',
        ],
      }),
      styleComparison({
        title: 'COPILOT vs AGENTFORCE',
        subtitle: 'Decision Matrix: Which Tool for Which Use Case',
        col1Title: 'EINSTEIN COPILOT ✓',
        col1Points: [
          'Email drafting & summarisation',
          'Account summary before a call',
          'Call prep with relationship context',
          'Pipeline inspection (exploratory)',
          'Ad-hoc Q&A over CRM data',
        ],
        col2Title: 'AGENTFORCE ✓',
        col2Points: [
          'Lead qualification at volume',
          'Case triage & auto-routing',
          'Renewal outreach campaign',
          'Order status handling (high frequency)',
          'SLA breach escalation',
        ],
      }),
    ],
  },

  'building-ai-agent-claude-api-salesforce': {
    cover: styleArchitecture({
      title: 'CLAUDE API + SALESFORCE AGENT',
      subtitle: 'Tool-Use Agent Without Abstraction Layers',
      layers: [
        {
          name: 'Salesforce Org',
          color: 'neon blue',
          components: ['Connected App', 'OAuth 2.0 Client Credentials', 'Named Credential', 'API v62.0'],
        },
        {
          name: 'Node.js Agent Loop',
          color: 'grey',
          components: ['Tool Definitions', 'executeTool()', 'Turn Limiter (MAX_TURNS=10)', 'Error Handler'],
        },
        {
          name: 'Claude API (Anthropic)',
          color: 'neon green',
          components: ['claude-sonnet-4-5', 'tool_use blocks', '200K context window', 'Structured JSON output'],
        },
      ],
      centralNode: 'Agent Loop — runAgent()',
      integrationModules: ['Anthropic SDK', 'Salesforce REST API v62.0'],
      bottomPanel: {
        label: 'CRM DATA FLOW',
        modules: ['SOQL Query Results', 'Created/Updated Records', 'Agent_Run__c Audit Log'],
      },
    }),
    images: [
      styleComparison({
        title: 'CLAUDE vs GPT-4.1',
        subtitle: 'For Salesforce Agent Workloads',
        col1Title: 'GPT-4.1 (OpenAI)',
        col1Points: [
          '128K context window',
          'Medium SOQL hallucination risk',
          'Rich OpenAI ecosystem tooling',
          '~$2.50 per 1M tokens',
          'Best for: short context, OpenAI stack',
        ],
        col2Title: 'Claude Sonnet 4.5 (Anthropic)',
        col2Points: [
          '200K context window',
          'Low SOQL hallucination risk',
          'Excellent multi-step tool use',
          '~$3.00 per 1M tokens',
          'Best for: 50+ email threads, nested tool chains',
        ],
      }),
      styleBlueprint({
        title: 'PRODUCTION AGENT CHECKLIST',
        subtitle: 'Security, Reliability, Observability',
        badLabel: 'COMMON MISTAKES',
        goodLabel: 'PRODUCTION STANDARDS',
        badCode: `// ❌ Never do this
const apiKey = process.env.SF_PASSWORD   // env var
const res = await query(\`SELECT * FROM \${obj}\`) // injection
throw new Error(sfError.message)          // leaks internals`,
        goodCode: `// ✓ Production-safe
// Named Credential — no key in code
const res = await withUserMode(query)    // FLS enforced
return { type: 'tool_result', error: 'validation_failed' } // safe`,
        whyCards: [
          { label: 'SECURITY — Named Credential, WITH USER_MODE, httpOnly tokens', icon: 'lock' },
          { label: 'RELIABILITY — MAX_TURNS guard, exponential backoff on 429, error as tool_result', icon: 'shield' },
          { label: 'OBSERVABILITY — Agent_Run__c log, cost monitor, kill switch via Custom Metadata', icon: 'chart' },
        ],
        checklist: [
          'Named Credential (not env var) for Salesforce auth',
          'WITH USER_MODE on all SOQL queries',
          'MAX_TURNS = 10 infinite loop guard',
          'Errors returned as tool_result (not thrown)',
          'Agent_Run__c audit log for every run',
          'Custom Metadata kill switch flag',
        ],
      }),
    ],
  },

  'building-ai-agents-with-openai-and-salesforce': {
    cover: styleArchitecture({
      title: 'OPENAI + SALESFORCE AGENT',
      subtitle: 'The Architecture That Survives Production',
      layers: [
        {
          name: 'Salesforce Org',
          color: 'neon blue',
          components: ['LWC Component', 'Apex Service', 'Named Credential', 'Sharing Rules', 'FLS Enforcement'],
        },
        {
          name: 'Apex Control Layer',
          color: 'grey',
          components: ['PromptBuilder', 'ToolRegistry', 'AgentRunLogger', 'ValidationService', 'AgentRecommendation__c'],
        },
        {
          name: 'OpenAI API',
          color: 'neon green',
          components: ['gpt-4.1 model', 'tool_calls response', 'Natural language output', 'JSON schema enforcement'],
        },
      ],
      centralNode: 'Apex Orchestration Layer',
      integrationModules: ['OpenAI REST API', 'Named Credential (no key in org)'],
      bottomPanel: {
        label: 'SECURITY BOUNDARY',
        modules: ['OpenAI never sees credentials', 'FLS enforced server-side', 'Audit trail in Agent_Run__c'],
      },
    }),
    images: [
      styleComparison({
        title: 'TOOL DESIGN',
        subtitle: 'Bad God-Action vs Good Business Actions',
        col1Title: '❌ BAD — God Action (Never Build This)',
        col1Points: [
          'update_salesforce(soql_query, object_name, field_map, where_clause, operation_type)',
          'No permission check — agent can delete anything',
          'Unpredictable blast radius across entire org',
          'Zero audit trail — invisible to compliance',
        ],
        col2Title: '✓ GOOD — Single-Purpose Business Actions',
        col2Points: [
          'summarize_case(caseId) — read only, bounded',
          'check_entitlement(accountId) — permission-checked',
          'draft_case_response(caseId, tone) — no DML',
          'create_escalation_request(caseId, reason) — auditable',
        ],
      }),
      styleBlueprint({
        title: 'ENTERPRISE GUARDRAILS FRAMEWORK',
        subtitle: '5 Layers of Defence for Production Agents',
        badLabel: 'UNGUARDED AGENT',
        goodLabel: 'ENTERPRISE-SAFE AGENT',
        badCode: `// ❌ Unguarded — DO NOT DEPLOY
String soql = 'SELECT ' + fields + ' FROM ' + obj;
Database.query(soql);  // injection + FLS bypass
// No audit, no limits, no kill switch`,
        goodCode: `// ✓ Enterprise-safe pattern
List<SObject> results = Security.stripInaccessible(
  AccessType.READABLE,
  Database.queryWithBinds(safeQuery, binds, AccessLevel.USER_MODE)
).getRecords();
AgentRunLogger.log(agentRunId, toolName, results.size());`,
        whyCards: [
          { label: 'PERMISSION ENFORCEMENT — WITH USER_MODE, stripInaccessible(), FLS + Sharing', icon: 'lock' },
          { label: 'FIELD MINIMIZATION — Only required fields, max 5 records to LLM, no full SObject dump', icon: 'filter' },
          { label: 'AUDITABILITY — Agent_Run__c + Agent_Tool_Call__c + correlation IDs + cost tracking', icon: 'document' },
        ],
        checklist: [
          'WITH USER_MODE on every query',
          'stripInaccessible() before sending to LLM',
          'Deterministic Apex validates every tool request',
          'Agent_Run__c + Agent_Tool_Call__c audit trail',
          'Timeout handling + retry queue + graceful degradation',
          'Kill switch via Custom Metadata flag',
        ],
      }),
    ],
  },

  'building-your-first-ai-agent-with-claude-api-and-salesforce': {
    cover: styleArchitecture({
      title: 'CASE TRIAGE AGENT — STEP BY STEP',
      subtitle: 'Claude API + Salesforce Apex End-to-End',
      layers: [
        {
          name: 'Trigger: Case Created',
          color: 'neon blue',
          components: ['Case object trigger fires', 'Queueable enqueued async', 'Context serialised'],
        },
        {
          name: 'Apex Context Builder',
          color: 'grey',
          components: ['Case Details', 'Account Tier', 'Entitlement', 'Last 5 Emails', 'Open Escalations'],
        },
        {
          name: 'Claude API Callout',
          color: 'neon green',
          components: ['claude-sonnet-4-5', 'Named Credential (no key)', '30s timeout', 'JSON: priority + queue + summary'],
        },
      ],
      centralNode: 'CaseTriageQueueable',
      integrationModules: ['Anthropic Messages API', 'Salesforce Named Credential'],
      bottomPanel: {
        label: 'RESULT: APEX VALIDATES + WRITES',
        modules: ['Permission check', 'Case.Priority updated', 'Case.OwnerId routed', 'Agent_Run__c logged'],
      },
    }),
    images: [
      styleBlueprint({
        title: 'APEX AGENT CLASS DIAGRAM',
        subtitle: 'CaseTriageQueueable Full Structure',
        badLabel: 'SYNCHRONOUS — HITS CALLOUT LIMIT',
        goodLabel: 'QUEUEABLE ASYNC — SAFE PATTERN',
        badCode: `// ❌ Synchronous trigger callout — ILLEGAL
trigger CaseTrigger on Case (after insert) {
  Http h = new Http();
  h.send(req);  // Error: Callout not allowed in trigger
}`,
        goodCode: `// ✓ Queueable pattern — correct approach
trigger CaseTrigger on Case (after insert) {
  System.enqueueJob(new CaseTriageQueueable(Trigger.new));
}
public class CaseTriageQueueable implements Queueable, Database.AllowsCallouts {
  public void execute(QueueableContext ctx) { ... }
}`,
        whyCards: [
          { label: 'CaseTriageQueueable implements Queueable, Database.AllowsCallouts', icon: 'code' },
          { label: 'CaseContextBuilder — serialises Case + Account + Entitlement + Emails', icon: 'database' },
          { label: 'AgentResponseValidator — validates JSON, checks permissions, writes safely', icon: 'shield' },
        ],
        checklist: [
          'Implement Queueable + Database.AllowsCallouts',
          'Named Credential — never hardcode API key',
          'MAX_TURNS = 10 guard on agent loop',
          'Validate LLM JSON before any DML',
          'Log to Agent_Run__c with correlation ID',
          'Unit test with @HttpCalloutMock',
        ],
      }),
      styleBlueprint({
        title: 'AGENT QUALITY METRICS',
        subtitle: 'How to Measure Your Triage Agent',
        badLabel: 'UNMONITORED AGENT',
        goodLabel: 'PRODUCTION-MONITORED',
        badCode: `// ❌ No monitoring — blind in production
System.enqueueJob(new CaseTriageQueueable(cases));
// Did it work? Who knows.`,
        goodCode: `// ✓ Instrumented — visibility at every step
AgentRun__c run = AgentRunLogger.start(caseId);
AgentRunLogger.logToolCall(run.Id, 'claude', tokens, cost);
AgentRunLogger.complete(run.Id, priority, queue, overrideFlag);`,
        whyCards: [
          { label: 'PRIORITY ACCURACY > 85% — correct classifications / total cases', icon: 'target' },
          { label: 'QUEUE ACCURACY > 90% — correct routing decisions tracked in Agent_Run__c', icon: 'route' },
          { label: 'COST PER CASE < $0.05 — token cost logged and aggregated per agent run', icon: 'dollar' },
        ],
        checklist: [
          'Priority Accuracy target: > 85%',
          'Queue Accuracy target: > 90%',
          'Escalation Miss Rate target: < 5%',
          'Human Override Rate target: < 20%',
          'Handle Time Reduction target: -30%',
          'Cost per Case target: < $0.05',
        ],
      }),
    ],
  },

  'lwc-to-react-what-salesforce-devs-need-to-know': {
    cover: styleComparison({
      title: 'LWC vs REACT',
      subtitle: 'What Every Salesforce Developer Must Know',
      col1Title: '⚡ LWC — Salesforce Native',
      col1Points: [
        '@wire for reactive data binding',
        'Lightning Data Service (LDS) cache',
        'SLDS design system by default',
        'FLS + Sharing enforced by platform',
        'Metadata deployment via SFDX',
        '@InvocableMethod for Flow integration',
      ],
      col2Title: '⚛ React — Application Layer',
      col2Points: [
        'useQuery + TanStack for data',
        'Build your own API + auth layer',
        'Choose your own design system',
        'Auth + FLS = your responsibility',
        'Vercel/Cloud Run deployment',
        'REST API contracts for integration',
      ],
    }),
    images: [
      styleComparison({
        title: 'LWC → REACT CONCEPT MAPPING',
        subtitle: '14 Core Concepts Side by Side',
        col1Title: 'LWC CONCEPT',
        col1Points: [
          '@api property (parent → child)',
          '@track state (reactive)',
          '@wire adapter (data fetch)',
          'connectedCallback (mount)',
          'disconnectedCallback (unmount)',
          'dispatchEvent (child → parent)',
          'NavigationMixin.Navigate()',
          'lightning-record-form',
          'jest.mock apex modules',
        ],
        col2Title: 'REACT EQUIVALENT',
        col2Points: [
          'props (read-only, one-way)',
          'useState() hook',
          'useQuery() / TanStack Query',
          'useEffect(fn, []) — empty deps',
          'return () => cleanup in useEffect',
          'callback prop (onEvent)',
          'useNavigate() — React Router',
          'React Hook Form + Zod schema',
          'msw (Mock Service Worker)',
        ],
      }),
      styleBlueprint({
        title: 'LWC → REACT MIGRATION CHECKLIST',
        subtitle: '4 Phases: Architecture, Components, Security, Deploy',
        badLabel: 'SKIPPED SECURITY PHASE',
        goodLabel: 'FULL MIGRATION DONE RIGHT',
        badCode: `// ❌ React dev assumes platform protects them
const res = await fetch(\`/api/cases/\${id}\`)
// No auth check — LWC always had platform FLS
// This React endpoint returns data to anyone`,
        goodCode: `// ✓ Explicitly enforce in your API layer
export async function GET(req, { params }) {
  const session = await getServerSession(authOptions)
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 })
  const data = await sfQuery(session.accessToken, params.id)
  return Response.json(stripInaccessibleFields(data))
}`,
        whyCards: [
          { label: 'ARCHITECTURE — Auth strategy (PKCE/JWT/BFF), Salesforce callout backend, CORS', icon: 'blueprint' },
          { label: 'COMPONENTS — @wire → useQuery, @api → props, Events → callback props, NavigationMixin → Router', icon: 'component' },
          { label: 'SECURITY — No API keys in browser, httpOnly tokens, FLS enforced server-side', icon: 'lock' },
        ],
        checklist: [
          'Auth strategy chosen (PKCE/JWT/BFF pattern)',
          'Backend for Salesforce callouts built',
          '@wire adapters replaced with useQuery',
          '@api props replaced with React props',
          'FLS enforced server-side (not assumed)',
          'Feature flags + error boundaries in place',
        ],
      }),
    ],
  },

  'rag-for-salesforce-orgs-index-your-knowledge-base': {
    cover: styleArchitecture({
      title: 'RAG FOR SALESFORCE KNOWLEDGE BASE',
      subtitle: 'Index → Retrieve → Answer',
      layers: [
        {
          name: 'Salesforce Knowledge (Source)',
          color: 'neon blue',
          components: ['Knowledge__kav records', 'PublishStatus = Online filter', 'IsLatestVersion = true', 'Visibility + Region + Language metadata'],
        },
        {
          name: 'Indexer Service',
          color: 'grey',
          components: ['Delta sync on LastModifiedDate', 'HTML → clean text normalizer', 'Chunker: 1200 chars, 150 overlap', 'Metadata extractor'],
        },
        {
          name: 'Vector Database',
          color: 'neon green',
          components: ['text-embedding-3-large', 'pgvector / Pinecone', 'Rich metadata stored with chunk', 'Incremental upsert on sync'],
        },
      ],
      centralNode: 'Permission-Aware Retrieval Engine',
      integrationModules: ['OpenAI Embeddings API', 'Salesforce REST API v62.0'],
      bottomPanel: {
        label: 'ANSWER GENERATION',
        modules: ['LLM + retrieved chunks', 'Mandatory citation enforced', 'Customer-safe output check', 'Answer confidence score'],
      },
    }),
    images: [
      styleBlueprint({
        title: 'KNOWLEDGE → VECTOR DB FIELD MAPPING',
        subtitle: 'Exactly Which Fields to Index and Why',
        badLabel: 'NAIVE INDEX — INDEXES EVERYTHING',
        goodLabel: 'PRODUCTION INDEX — FILTERED + ENRICHED',
        badCode: `# ❌ Naive — indexes drafts, internal, archived
records = sf.query("SELECT Id, Answer__c FROM Knowledge__kav")
for r in records:
    embed_and_store(r['Answer__c'])  # no metadata, no filters`,
        goodCode: `# ✓ Production — filtered, enriched, versioned
records = sf.query("""
  SELECT Id, Title, Answer__c, Language, Product__c,
         Region__c, Audience__c, IsVisibleInCsp, LastModifiedDate
  FROM Knowledge__kav
  WHERE PublishStatus = 'Online'
  AND IsLatestVersion = true
  AND IsVisibleInCsp = true
""")`,
        whyCards: [
          { label: 'SOURCE FIELDS — Id, Title, Answer__c, Language, Product__c, Region__c, Audience__c', icon: 'database' },
          { label: 'NORMALIZER — strip HTML, remove scripts, unescape entities, collapse whitespace', icon: 'filter' },
          { label: 'CHUNK DOCUMENT — text, title, language, product, region, audience, articleId, version, url', icon: 'document' },
        ],
        checklist: [
          'Filter PublishStatus = Online AND IsLatestVersion = true',
          'Filter IsVisibleInCsp / IsVisibleInPfe for customer channels',
          'Strip HTML with BeautifulSoup before embedding',
          'Chunk at 1200 chars with 150 char overlap',
          'Store rich metadata with every chunk',
          'Delta sync on SystemModstamp every 15 min',
        ],
      }),
      styleBlueprint({
        title: '5 RAG FAILURE MODES IN SALESFORCE',
        subtitle: 'What Goes Wrong and Exactly How to Fix It',
        badLabel: 'COMMON RAG FAILURES',
        goodLabel: 'PRODUCTION FIXES',
        badCode: `# ❌ Failure modes in the wild
results = vectordb.search(query, top_k=10)
# Returns: draft articles, archived, internal-only,
# wrong region, stale versions — all look "relevant"`,
        goodCode: `# ✓ Filtered retrieval — safe for customers
results = vectordb.search(
  query=query, top_k=10,
  filter={
    "publish_status": "Online",
    "is_latest_version": True,
    "audience": user_context.audience,
    "region": user_context.region,
    "language": user_context.language,
  }
)`,
        whyCards: [
          { label: 'WRONG VERSION — Old policy answers → fix: IsLatestVersion=true filter', icon: 'clock' },
          { label: 'VISIBILITY LEAK — Internal content shown to customers → fix: IsVisibleInCsp filter', icon: 'eye' },
          { label: 'STALE INDEX — Article updated but not re-indexed → fix: SystemModstamp delta sync every 15 min', icon: 'refresh' },
        ],
        checklist: [
          'WRONG VERSION: filter IsLatestVersion = true at query time',
          'VISIBILITY LEAK: always filter IsVisibleInCsp/IsVisibleInPfe',
          'REGION MISMATCH: index + filter Region__c',
          'HTML NOISE: BeautifulSoup strip before chunking',
          'STALE INDEX: incremental sync on SystemModstamp',
        ],
      }),
    ],
  },

  'agentforce-custom-actions-a-builder-playbook': {
    cover: styleArchitecture({
      title: 'AGENTFORCE CUSTOM ACTIONS',
      subtitle: 'A Builder Playbook — Agent Converses. Apex Enforces.',
      layers: [
        {
          name: 'Agentforce Agent (Atlas Reasoning)',
          color: 'neon blue',
          components: ['Receives user message', 'Identifies intent', 'Selects action', 'Passes typed inputs'],
        },
        {
          name: 'Apex Actions Layer',
          color: 'grey',
          components: ['EvaluateAccountHealth (READ)', 'GenerateEscalationDraft (DECISION)', 'CreateCSMFollowUpTask (WRITE)'],
        },
        {
          name: 'Salesforce Platform',
          color: 'dark blue',
          components: ['Account records', 'Case records', 'Task records', 'Agent_Run__c audit log'],
        },
      ],
      centralNode: '@InvocableMethod — Permission-Checked Execution',
      integrationModules: ['Agentforce Studio', 'Named Credentials for external APIs'],
      bottomPanel: {
        label: 'PRINCIPLE',
        modules: ['Agent converses', 'Apex enforces', 'Salesforce owns the data'],
      },
    }),
    images: [
      styleComparison({
        title: 'ACTION SCHEMA DESIGN',
        subtitle: 'God Action vs Single-Purpose Action',
        col1Title: '❌ BAD — God Action (Never Build This)',
        col1Points: [
          'update_salesforce(soql_query, object_name, field_map, where_clause, operation_type)',
          'Non-deterministic — agent decides what to update',
          'No audit trail — invisible to compliance teams',
          'Blast radius: ENTIRE ORG — agent can delete anything',
        ],
        col2Title: '✓ GOOD — CreateRenewalFollowUpTask',
        col2Points: [
          'account_id: Id (required) — typed, no injection',
          'due_date_offset_days: Integer (default 2)',
          'assignee_queue: String (validated against allowed list)',
          'risk_reason: String (max 1000 chars, sanitised)',
        ],
      }),
      styleComparison({
        title: 'FLOW vs APEX FOR CUSTOM ACTIONS',
        subtitle: '8 Factors — When to Use Which',
        col1Title: 'USE FLOW',
        col1Points: [
          'Builder is Admin or Consultant (no Apex skills)',
          'Simple conditional logic only',
          'Prototype / prove-the-logic phase',
          'Low-risk, non-revenue-touching action',
          'Quick iteration needed (no deploy cycle)',
        ],
        col2Title: 'USE APEX',
        col2Points: [
          'Complex validation with multiple conditions',
          'External REST callout with timeout + retry',
          'Full try/catch + custom exception handling',
          'Bulkified patterns required for volume',
          'Any action that touches revenue or customer data',
        ],
      }),
    ],
  },

  'flow-vs-apex-in-2026-when-to-use-which': {
    cover: styleComparison({
      title: 'FLOW vs APEX IN 2026',
      subtitle: 'When to Use Which — The Architectural Decision Framework',
      col1Title: '✓ USE FLOW WHEN...',
      col1Points: [
        'Logic is declarative, linear, and easy to visualize',
        'Admins or business users need to adjust it regularly',
        'Screen-guided user input or approval routing is needed',
        'Field updates, notifications, and basic routing apply',
        'Agentforce 2.0 needs admin-configurable process steps',
        'Moderate volume — no nested loops or complex joins',
      ],
      col2Title: '✓ USE APEX WHEN...',
      col2Points: [
        'Logic is algorithmic, high-volume, or multi-object',
        'You need deterministic behavior and serious unit tests',
        'Reusable domain services shared across triggers, LWC, agents',
        'Advanced transaction control, dynamic SOQL, bulk DML',
        'Exposing safe, typed, tested actions to Agentforce 2.0',
        'Flow would become a 300-node maze nobody wants to touch',
      ],
    }),
    images: [
      styleComparison({
        title: 'FLOW vs APEX: Real Production Scenarios',
        subtitle: '8 Decision Points — Which Tool Wins and Why',
        col1Title: 'FLOW WINS',
        col1Points: [
          'Lead routing rules that change every quarter → admins own it',
          'Screen wizard for guided renewal opportunity creation',
          'Approval escalation with manager notification + task creation',
          'Agentforce 2.0 triggered process: collect missing billing data',
          'Record-triggered: if Country = Germany → apply DACH sales path',
          'Fault email to ops team when exception path fires',
        ],
        col2Title: 'APEX WINS',
        col2Points: [
          'SLA recalculation across Critical / High / Standard tiers',
          'Bulk case update: 200+ records, premium tier checks, queue routing',
          'Dynamic SOQL with multi-object joins and conditional filters',
          'Invocable action reused by Flow, LWC, Queueable, and agent',
          'Logic requiring 20+ test methods to trust in production',
          'Transactional write with idempotency key + audit log insert',
        ],
      }),
      styleBlueprint({
        title: 'HYBRID PATTERN: FLOW + APEX',
        subtitle: 'Flow Owns the Process. Apex Owns the Complexity. Agentforce Triggers Both.',
        badLabel: 'ANTI-PATTERN — All Logic in Flow',
        goodLabel: 'BEST PRACTICE — Hybrid Boundary',
        badCode: `// All logic in Flow — the 300-node maze
// Get Records inside conditional path
// Duplicated assignment rules across
//   case-create and case-update flows
// No unit tests possible for SLA rules
// Random CPU timeouts under prod volume
// Admins afraid to touch it`,
        goodCode: `@InvocableMethod(label='Recalculate Entitlement')
public static List<Response> recalculate(
  List<Request> requests
) {
  // Flow: detects event, calls this action
  // Apex: SLA calc, region, escalation tier
  // Output: typed Response back to Flow
  // Reusable: Flow + LWC + Agentforce 2.0
}`,
        whyCards: [
          { label: 'Admin Visibility', icon: 'eye' },
          { label: 'Eng Testability', icon: 'shield' },
          { label: 'Agent Ready', icon: 'bot' },
        ],
        checklist: [
          'Flow detects business event and calls invocable Apex action',
          'Apex returns typed Response — no SLA logic inside Flow Builder',
          'Same Apex action reused by LWC, Queueable, and Agentforce 2.0',
          'Admins own process steps. Devs own the algorithm.',
          'All complex rules covered by Apex unit tests at 200-record scale',
        ],
        authorLabel: 'Bennie Joseph | Salesforce Architect',
        footerItems: ['Flow Orchestration', 'Apex Services', 'Invocable Actions', 'Agentforce 2.0'],
      }),
    ],
  },

  'apex-cpu-limit-errors-the-real-fix': {
    cover: styleComparison({
      title: 'APEX CPU LIMIT ERRORS: The Real Fix',
      subtitle: '5 Fake Fixes Teams Try vs The Real Transaction Design Approach',
      col1Title: '❌ FAKE FIXES — Masking the Problem',
      col1Points: [
        'Move everything to Queueable — same bad logic, more headroom',
        'Add @future — hides the issue, delays the crash',
        'Reduce debug logs — saves ~10ms, not 6,000ms',
        'Split batch size — increases total cost, fixes nothing',
        'Ask Salesforce for a limit increase — they won\'t',
        'Result: CPU hits 10,000ms, transaction rolls back, user sees error',
      ],
      col2Title: '✓ REAL FIX — Reduce Transaction Work',
      col2Points: [
        'Map the full transaction: triggers + flows + packages + Agentforce',
        'Add CpuProbe checkpoints — find where CPU is actually spent',
        'Filter unchanged records before any loop or query runs',
        'Replace nested loops (O n²) with maps (O n+n)',
        'Move only non-critical work async — AI summaries, audit snapshots',
        'Result: 10,000ms failures → 2,800ms stable transaction',
      ],
    }),
    images: [
      styleComparison({
        title: 'CPU TRANSACTION ANATOMY',
        subtitle: 'Every Layer That Shares Your 10,000ms Budget in a Modern Salesforce Org',
        col1Title: '❌ UNOPTIMIZED TRANSACTION',
        col1Points: [
          'Trigger handler processes ALL 200 records regardless of field changes',
          'Nested loop: 200 Accounts × 20,000 Contacts = 4,000,000 comparisons',
          'Query returns all open Cases — 800 records, 400 irrelevant',
          'Record-triggered Flow re-updates unchanged Cases, fires Case triggers',
          'Agentforce 2.0 insight write happens synchronously in same transaction',
          'CPU hits 10,000ms → transaction rolls back → user sees failure',
        ],
        col2Title: '✓ OPTIMIZED TRANSACTION',
        col2Points: [
          'Change detection first: 200 records → filter to 8 with real field changes',
          'Map lookup: O(n+n) — 200 + 20,000 passes, not 4,000,000 comparisons',
          'Selective SOQL: IsClosed = false AND status IN relevant set → 40 records',
          'Flow decision guard: entry criteria prevents re-processing unchanged records',
          'Agentforce insight generation enqueued as Queueable — off critical path',
          'CPU lands at 2,800–4,000ms → transaction commits → user sees success',
        ],
      }),
      styleBlueprint({
        title: 'TRIGGER EXECUTION GUARD',
        subtitle: 'Operation-Specific Recursion Guards vs The Global hasRun Anti-Pattern',
        badLabel: 'ANTI-PATTERN — Global Boolean',
        goodLabel: 'BEST PRACTICE — Operation-Specific Keys',
        badCode: `public class BadTriggerGuard {
  public static Boolean hasRun = false;
}
// Blocks ALL trigger logic after first run
// Hides design problems instead of fixing them
// One flag stops legitimate work in same tx`,
        goodCode: `public class TriggerExecutionGuard {
  private static Set<String> executedKeys =
    new Set<String>();
  public static Boolean firstRun(String key) {
    if (executedKeys.contains(key)) return false;
    executedKeys.add(key);
    return true;
  }
}
// Usage: firstRun('Account.afterUpdate.v1')`,
        whyCards: [
          { label: 'Granular Control', icon: 'target' },
          { label: 'Idempotent Design', icon: 'shield' },
          { label: 'Audit Safe', icon: 'checkmark' },
        ],
        checklist: [
          'Use operation-specific keys — not one global flag',
          'Design handlers to be idempotent by default',
          'Combine with change-detection filtering for CPU safety',
          'Never use hasRun to hide a recursion you don\'t understand',
          'Test with realistic bulk data: 200 records, 5 related each',
        ],
        authorLabel: 'Bennie Joseph | Salesforce Architect',
        footerItems: ['CPU Budget', 'Recursion Guard', 'Idempotency', 'Bulk Safety'],
      }),
    ],
  },

  'multi-agent-workflows-lessons-from-building-in-production': {
    cover: styleComparison({
      title: 'MULTI-AGENT WORKFLOWS IN PRODUCTION',
      subtitle: 'What Actually Works vs What Looks Good in Demos',
      col1Title: '❌ AGENT SWARM — Demo Pattern',
      col1Points: [
        'Agents talk to each other freely',
        'State is hidden and hard to inspect',
        'Responsibility is impossible to assign',
        'Failures cannot be replayed or rolled back',
        'No audit trail for compliance',
        'Looks impressive, ships badly',
      ],
      col2Title: '✓ ORCHESTRATED WORKFLOW — Production',
      col2Points: [
        'One orchestrator owns all workflow state',
        'Each agent: typed input, typed output, confidence score',
        'Confidence gates trigger human review automatically',
        'Agents propose actions — deterministic service commits',
        'Full audit log before any DML write',
        'Boring by design. Trusted in production.',
      ],
    }),
    images: [
      styleComparison({
        title: 'ORCHESTRATOR vs GROUP CHAT',
        subtitle: 'The Architecture Decision That Defines Production Readiness',
        col1Title: '❌ GROUP CHAT — Agents Decide Freely',
        col1Points: [
          'Agents message each other without central control',
          'Workflow state is hidden inside individual agents',
          'Responsibility for failures is impossible to assign',
          'Infinite loops: no MAX_TURNS protection',
          'No confidence gates — agent decides when done',
          'Impressive in demos. Catastrophic in production.',
        ],
        col2Title: '✓ ORCHESTRATOR — Centralized Control',
        col2Points: [
          'Single orchestrator owns all workflow state',
          'Agents: typed input → typed output + confidence score',
          'Intake < 0.75 confidence → immediate human review',
          'MAX_TURNS = 10 guard — cannot loop forever',
          'Full AgentResult audit log before any commit',
          'Human review as a product feature, not failure state.',
        ],
      }),
      styleBlueprint({
        title: 'SEPARATE THINKING FROM ACTING',
        subtitle: 'Agents Propose. Deterministic Services Commit.',
        badLabel: 'AGENT ACTS DIRECTLY — DANGEROUS',
        goodLabel: 'AGENT PROPOSES — APEX COMMITS',
        badCode: `// ❌ Agent acts directly — no safety net
const agent = new SalesforceAgent()
agent.updateCase(caseId, { Status: 'Closed', Priority: 'Low' })
// No idempotency. No permission check. No audit.`,
        goodCode: `// ✓ Proposal + deterministic commit layer
type SalesforceUpdateProposal = {
  caseId: string
  fields: { Status?: string; Priority?: string }
  idempotencyKey: string   // prevents duplicate writes
  requiresApproval: boolean
}
// Apex validates: confidence >= 0.85, FLS, idempotency key
AiCaseUpdateService.applyRecommendation(proposal)`,
        whyCards: [
          { label: 'IDEMPOTENCY — AI_Action_Log__c checked before every DML write', icon: 'key' },
          { label: 'CONFIDENCE THRESHOLD — Apex rejects commit if confidence < 0.85', icon: 'filter' },
          { label: 'FIELD CONTROL — Apex owns field list, agent cannot write arbitrary fields', icon: 'lock' },
        ],
        checklist: [
          'Agent returns SalesforceUpdateProposal (no DML)',
          'Apex validates confidence >= 0.85 before commit',
          'AI_Action_Log__c checked for idempotency key',
          'FOR UPDATE lock on Case before write',
          'Action logged with correlation ID',
          'One retry for timeouts, zero retries for policy conflicts',
        ],
        authorLabel: 'Bennie Joseph | Salesforce Architect',
        footerItems: ['Proposals Only', 'Apex Commits', 'Idempotency Keys', 'Audit Trail'],
      }),
    ],
  },
}

async function generateImage(
  prompt: string,
  aspectRatio: '16:9' | '1:1' = '1:1'
): Promise<Buffer> {
  console.log(`  Prompt preview: ${prompt.slice(0, 120)}...`)

  // Nano Banana 2 — gemini-3.1-flash-image-preview (uses generateContent, not generateImages)
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

  const parts = response.candidates?.[0]?.content?.parts ?? []
  const imagePart = parts.find((p: { inlineData?: { data?: string } }) => p.inlineData?.data)
  if (!imagePart?.inlineData?.data) {
    throw new Error('No image data returned from Nano Banana 2 (gemini-3.1-flash-image-preview)')
  }

  return Buffer.from(imagePart.inlineData.data, 'base64')
}

async function ensureCoverImageInFrontmatter(slug: string): Promise<void> {
  const postPath = path.join(process.cwd(), 'content/posts')
  const files = fs.readdirSync(postPath).filter((f) => f.endsWith('.mdx'))

  for (const file of files) {
    const content = fs.readFileSync(path.join(postPath, file), 'utf-8')
    const { data: fm } = matter(content)

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

  console.log('  → Generating cover (16:9)...')
  const coverBuf = await generateImage(config.cover, '16:9')
  fs.writeFileSync(path.join(imgDir, 'cover.png'), coverBuf)
  console.log('  ✓ cover.png saved')

  for (let i = 0; i < config.images.length; i++) {
    console.log(`  → Generating image-${i + 1} (1:1)...`)
    const buf = await generateImage(config.images[i], '1:1')
    fs.writeFileSync(path.join(imgDir, `image-${i + 1}.png`), buf)
    console.log(`  ✓ image-${i + 1}.png saved`)
  }

  await ensureCoverImageInFrontmatter(slug)
}

async function main() {
  const args = process.argv.slice(2)
  const slugArg = args.indexOf('--slug')

  const slugs =
    slugArg !== -1
      ? [args[slugArg + 1]]
      : Object.keys(POST_IMAGE_CONFIGS)

  console.log(`\n🔄 Regenerating images for ${slugs.length} post(s)\n`)

  for (const slug of slugs) {
    await regeneratePost(slug)
  }

  console.log('\n✅ All done. Commit public/images/blog/ to deploy.')
}

main().catch((err) => {
  console.error('Error:', err.message)
  process.exit(1)
})
