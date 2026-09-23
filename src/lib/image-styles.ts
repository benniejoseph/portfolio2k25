/**
 * Topic-aware art direction for blog images generated with OpenAI GPT Image 2.
 *
 * The previous image system reused four rigid infographic templates, so unrelated
 * posts converged on the same layout. These directions are deliberately selected
 * from the topic, image purpose, and variation number. A cover and its inline
 * images therefore remain visually related without being copies of one another.
 */

export type BlogPillar = 'salesforce' | 'ai-agentic' | 'career' | 'architecture'
export type ImagePurpose = 'cover' | 'concept' | 'workflow'

export interface TopicImagePromptInput {
  topic: string
  keyword: string
  pillar: BlogPillar
  purpose: ImagePurpose
  brief: string
  variation?: number
}

interface VisualDirection {
  name: string
  composition: string
  medium: string
  detail: string
}

const VISUAL_DIRECTIONS: VisualDirection[] = [
  {
    name: 'luminous systems cartography',
    composition: 'an asymmetric map of named systems connected by precise routes, with one strong focal node and generous negative space',
    medium: 'crisp editorial vector art with subtle volumetric light and fine technical linework',
    detail: 'encode hierarchy through route weight, node scale, and small geometric status markers',
  },
  {
    name: 'exploded technical cutaway',
    composition: 'an exploded isometric cutaway that separates the topic into concrete layers, interfaces, and failure boundaries',
    medium: 'high-end product illustration combining clean 3D forms with flat annotation lines',
    detail: 'show the actual components from the brief rather than generic servers, clouds, or agent-loop icons',
  },
  {
    name: 'data topography',
    composition: 'a landscape of flowing data contours, checkpoints, and sharply defined elevation changes that reveal bottlenecks and scale',
    medium: 'cinematic data visualization with glassy contours, grain, and controlled neon highlights',
    detail: 'make throughput, latency, trust boundaries, or record volume visible as spatial structure',
  },
  {
    name: 'engineering field notes',
    composition: 'a photographed desk-spread of diagrams, code fragments, arrows, and compact decision notes arranged around one central sketch',
    medium: 'tactile ink, marker, paper, and blueprint fragments with realistic shadows',
    detail: 'use topic-specific snippets and symbols; avoid motivational sticky-note filler',
  },
  {
    name: 'terminal macro study',
    composition: 'a dramatic close crop of a terminal or code editor where a few real topic-specific lines become the visual architecture',
    medium: 'dark editorial macro photography blended with razor-sharp syntax highlighting and restrained holographic overlays',
    detail: 'show only contrasts explicitly supported by the brief; never invent that a stable baseline version fails merely because a newer version exists',
  },
  {
    name: 'kinetic transit diagram',
    composition: 'a bold transit-style flow with branching decisions, retries, queues, and terminal states arranged for instant scanning',
    medium: 'Swiss information design with vivid route colors, modular symbols, and subtle depth',
    detail: 'every route and junction must correspond to a named process or decision in the brief',
  },
  {
    name: 'editorial paper cutaway',
    composition: 'layered paper-cut shapes form a surprising visual metaphor for the topic, with technical details embedded inside the layers',
    medium: 'premium magazine cover art with dimensional paper texture, soft shadows, and selective foil accents',
    detail: 'favor a memorable metaphor tied to the topic; do not use generic robots, brains, handshakes, or cloud logos',
  },
  {
    name: 'mission-control evidence board',
    composition: 'a focused control-room panel built around traces, evaluations, policy gates, and a single live system path',
    medium: 'polished dark interface illustration with physical switches, charts, and luminous diagnostic overlays',
    detail: 'show measurable evidence such as confidence, latency, cost, errors, or rollout state when the brief supports it',
  },
  {
    name: 'constellation knowledge graph',
    composition: 'a deep spatial graph of concepts and dependencies with a few highlighted paths that explain the core idea',
    medium: 'scientific visualization with atmospheric depth, fine particles, and precise diagram geometry',
    detail: 'use meaningful clusters and edges from the brief, never decorative random nodes',
  },
  {
    name: 'modular object collection',
    composition: 'a curated grid of distinctive physical objects, each representing one concrete concept, arranged with strong editorial rhythm',
    medium: 'playful but sophisticated studio 3D illustration with clay, glass, metal, and fabric materials',
    detail: 'make every object semantically specific to the topic and vary scale, angle, and material',
  },
]

const PALETTES = [
  'Salesforce navy and cloud blue with aurora violet and warm coral accents',
  'midnight indigo with electric cyan, signal lime, and a small amount of amber',
  'ink black and cobalt with bright turquoise, magenta, and cool white highlights',
  'deep ocean blue with ultramarine, tangerine, mint, and soft lavender',
  'charcoal and royal blue with acid yellow, sky blue, and restrained red alerts',
  'cream and graphite with saturated cloud blue, violet, and vermilion accents',
]

function stableHash(value: string): number {
  let hash = 2166136261
  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i)
    hash = Math.imul(hash, 16777619)
  }
  return hash >>> 0
}

function selectDirection(input: TopicImagePromptInput): VisualDirection {
  const purposeOffset = input.purpose === 'cover' ? 0 : input.purpose === 'concept' ? 3 : 6
  const index = (stableHash(`${input.topic}|${input.keyword}`) + purposeOffset + (input.variation ?? 0)) % VISUAL_DIRECTIONS.length
  return VISUAL_DIRECTIONS[index]
}

/**
 * Wrap an article-specific brief in a deterministic but varied visual direction.
 * The source brief provides semantics; this function supplies composition and
 * production constraints. This is also used when regenerating older sidecars.
 */
export function buildTopicImagePrompt(input: TopicImagePromptInput): string {
  const direction = selectDirection(input)
  const palette = PALETTES[(stableHash(`${input.keyword}|${input.purpose}`) + (input.variation ?? 0)) % PALETTES.length]
  const dimensions = input.purpose === 'cover' ? 'wide 16:9 editorial composition' : 'square editorial composition'
  const purposeGuidance = input.purpose === 'cover'
    ? 'Create one instantly recognizable hero idea with a clear focal point and uncluttered edges for responsive cropping.'
    : input.purpose === 'concept'
      ? 'Explain one mental model at a glance; prioritize relationships and tradeoffs over decoration.'
      : 'Show sequence, branching, inputs, outputs, trust boundaries, and failure or retry paths where relevant.'

  return `Create a ${dimensions} for a technical article titled "${input.topic}".

ARTICLE SUBJECT: ${input.keyword}
ARTICLE-SPECIFIC VISUAL BRIEF: ${input.brief}
PURPOSE: ${purposeGuidance}

VISUAL DIRECTION — ${direction.name.toUpperCase()}:
- Composition: ${direction.composition}.
- Medium: ${direction.medium}.
- Semantic detail: ${direction.detail}.
- Palette: ${palette}. Keep contrast accessible and the main silhouette readable at thumbnail size.

NON-NEGOTIABLES:
- Depict the named technologies, decisions, states, or code concepts in the brief. Do not substitute a generic cloud diagram or generic AI-agent loop.
- Preserve the brief's factual meaning. Do not invent success or failure states, and never portray an older supported API or release as broken solely because a newer version exists.
- Prefer no embedded text. When a diagram cannot work without it, use at most two short labels. No paragraphs, fake code, gibberish typography, watermarks, company logos, or portraits.
- Do not reproduce Salesforce trademarks or UI screenshots. Brand influence should come from color and energetic trailblazer-era optimism, not copied assets.
- Keep this image compositionally distinct from companion images for the same article.
- Polished publication quality, precise geometry, crisp edges, and no visual artifacts.`
}

export function buildFallbackImageBrief(
  topic: string,
  keyword: string,
  purpose: ImagePurpose,
  inlineIndex = 0
): string {
  if (purpose === 'cover') {
    return `Turn the defining technical tension in "${topic}" into a concrete visual metaphor. Center the real subject "${keyword}" and reveal the most important boundary, decision, or transformation.`
  }

  if (purpose === 'concept') {
    return `Visualize the core mental model behind "${topic}": the actors, constraints, and tradeoffs a practitioner must understand before implementation. Focus on "${keyword}".`
  }

  return `Map a realistic implementation path for "${topic}" from input through validation and execution to observable outcome. Include the likely failure boundary and recovery path. Variation ${inlineIndex + 1}; subject: "${keyword}".`
}
