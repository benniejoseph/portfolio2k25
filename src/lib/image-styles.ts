/**
 * Infographic style prompt generators for Gemini Imagen 4.
 * 4 distinct visual archetypes — pick the right one per post type.
 */

export interface WhiteboardData {
  title: string
  subtitle: string
  sections: Array<{ title: string; points: string[] }>
  footerQuote?: string
}

export interface ComparisonData {
  title: string
  subtitle: string
  col1Title: string
  col1Points: string[]
  col2Title: string
  col2Points: string[]
}

export interface BlueprintData {
  title: string
  subtitle: string
  badCode?: string
  goodCode?: string
  badLabel?: string
  goodLabel?: string
  whyCards?: Array<{ label: string; icon: string }>
  checklist?: string[]
  authorLabel?: string
  footerItems?: string[]
}

export interface ArchitectureData {
  title: string
  subtitle: string
  layers: Array<{ name: string; color: string; components: string[] }>
  centralNode?: string
  integrationModules?: string[]
  bottomPanel?: { label: string; modules: string[] }
}

// ─────────────────────────────────────────────
// Style 1 — Napkin Sketch / Hand-drawn Whiteboard
// Best for: Career posts, mindset pieces, overview/intro posts
// ─────────────────────────────────────────────
export function styleWhiteboard(data: WhiteboardData): string {
  const sectionPrompts = data.sections
    .map((s) => {
      const pts = s.points.map((p) => `"${p}"`).join(', ')
      return `A section titled "${s.title}" featuring hand-drawn boxes and points: ${pts}.`
    })
    .join('\n- ')

  const quote = data.footerQuote ?? 'Build the future with code and cloud!'

  return `An educational napkin-sketch style infographic whiteboard on the topic of "${data.title}: ${data.subtitle}".
Overall Aesthetic: Hand-drawn, creative, warm, and highly organized whiteboard layout on an off-white paper canvas background.
Main Header: The title "${data.title}" is written in a bold, prominent, hand-drawn black marker font at the top-center, underlined with two rough black pen lines. Below it, the subtitle "${data.subtitle}" is written in a smaller blue marker font.

Visual Elements and Sections:
- A square pastel yellow sticky note pinned with a blue push-pin in the top-left corner with the exact text "Salesforce + AI".
- A square pastel pink sticky note in the center-left displaying "BIG OPPORTUNITIES!".
- A square pastel blue sticky note in the center-right displaying "MINDSET MATTERS!".
- ${sectionPrompts}
- Assorted small hand-drawn doodle icons like clouds, stars, checkmarks, and simple hand-drawn arrows connecting the sections to show progression and relationships.
- A foot banner at the very bottom with a hand-written motivational quote in blue marker: "${quote}".

Style Details: Sharp focus, flat design, authentic hand-drawn whiteboard marker textures, high contrast, clean line drawings, absolutely no rendering artifacts, perfectly legible hand-written typography. Use a color scheme of black, blue, pink, and yellow against a clean cream-colored background.`
}

// ─────────────────────────────────────────────
// Style 2 — Modern Tech Before vs After Comparison
// Best for: Migration posts, Agentforce vs Copilot, LWC vs React, Flow vs Apex
// ─────────────────────────────────────────────
export function styleComparison(data: ComparisonData): string {
  const col1Blocks = data.col1Points
    .map((p) => `A block for "${p}" describing the old problem with a small icon.`)
    .join('\n  - ')

  const col2Blocks = data.col2Points
    .map((p) => `A block for "${p}" describing the modern solution with a clean icon.`)
    .join('\n  - ')

  return `A clean, modern, high-tech comparison infographic illustrating "${data.title}: ${data.subtitle}".
Overall Layout: A split vertical column layout comparing the old way on the left and the new way on the right, divided by a subtle gradient vertical divider in the center.

Header:
- At the top, a bold, clean sans-serif headline: "${data.title}" in deep navy blue.
- Directly beneath, a smaller subtitle in dark gray: "${data.subtitle}".

Left Column (${data.col1Title}):
- Header: "${data.col1Title}" in a clear bold blue-gray box.
- Colors: Soft reddish and greyish pastel accents to denote complexity/inefficiency.
- Content Blocks:
  - ${col1Blocks}
  - A central technical flow diagram showing tangled colored lines (representing complexity) between blocks, labeled with the most relevant components.

Right Column (${data.col2Title}):
- Header: "${data.col2Title}" in a clean bold bright blue box.
- Colors: Soft green and bright blue vector elements to represent efficiency, speed, and order.
- Content Blocks:
  - ${col2Blocks}
  - A central technical diagram showing a beautiful, glowing central geometric node labeled "Single Source of Truth", with clean, straight, organized blue lines connected directly to key blocks.
  - A flat vector speedometer graphic labeled "FAST" with the needle pointing to the green zone.

Style Details: Clean vector illustration style, modern SaaS interface aesthetic, professional layout, flat design, high-quality typography, crisp lines, bright and professional tech color palette (deep navy, teal, bright blue, soft red, soft green, on a light blue-grey background), perfectly sharp rendering, zero text noise or spelling errors.`
}

// ─────────────────────────────────────────────
// Style 3 — High-Fidelity Technical Blueprint (Dark Mode)
// Best for: Apex/code deep dives, governor limits, performance, security
// Closest match to the "Bulkify Your Apex" reference image
// ─────────────────────────────────────────────
export function styleBlueprint(data: BlueprintData): string {
  const badLabel = data.badLabel ?? 'BEFORE — ANTI-PATTERN'
  const goodLabel = data.goodLabel ?? 'AFTER — BEST PRACTICE'
  const badCode = data.badCode ?? '// bad pattern here'
  const goodCode = data.goodCode ?? '// good pattern here'
  const whyCards = (data.whyCards ?? []).map((c) => `"${c.label}" with a ${c.icon} icon`).join(', ')
  const checklistItems = (data.checklist ?? []).map((i) => `"${i}"`).join(', ')
  const authorLabel = data.authorLabel ?? 'Bennie Joseph | Salesforce Architect'
  const footerItems = (data.footerItems ?? ['Salesforce Expertise', 'AI Agents', 'Automation', 'Integration']).join('", "')

  return `A highly detailed, technical blueprint-style developer infographic poster on the theme of "${data.title}".
Overall Theme: High-tech dark mode developer dashboard, cybersecurity blueprint, with sharp glowing lines and neat borders.
Colors: Deep dark navy background with glowing neon blue, electric cyan, warning red, and success green highlights.

Header:
- A prominent top-center glowing blue header: "${data.title}".
- Below it, a clean subtitle: "${data.subtitle}" with a small Salesforce logo on the top-left and an "APEX BEST PRACTICES" badge on the top-right.

Section 1: "WHY IT MATTERS" (Top Row, 3 Horizontal Cards)
- ${whyCards || '"Architecture" with a server icon, "Performance" with a flame icon, "Reliability" with a shield icon'}

Section 2: "THE COST" (Middle Row, Side-by-Side Comparison)
- Left Box (Red Theme): "${badLabel}". Shows a red status pill "DANGER — ANTI-PATTERN".
- Right Box (Green Theme): "${goodLabel}". Shows a green status pill "SUCCESS — BEST PRACTICE".

Section 3: "CODE PATTERNS" (Main Center)
- Left Column (Bad Code in Red Border):
  - Heading: "// BAD"
  - Code block:
    ${badCode}
- Right Column (Good Code in Green Border):
  - Heading: "// GOOD"
  - Code block:
    ${goodCode}

Section 4: "DEVELOPER PROFILE & CHECKLIST" (Bottom Row)
- Left Side: A 3D Pixar-style cartoon avatar portrait of Bennie Joseph (see attached reference photo for his real likeness — match his face shape, skin tone, beard, and hairstyle), with a warm friendly smile showing teeth, wearing a grey crew-neck sweatshirt with the word "MAGNETIC" on it, set against a warm orange bokeh background. The avatar is labeled "${authorLabel}". Next to it is a quote bubble: "Architecting intuitive systems, engineering scalable solutions."
- Right Side: A checklist with points: ${checklistItems || '"Follow best practices", "Test thoroughly", "Document everything"'}.
- Footer: A thin bar with icons for "${footerItems}" and the text "CODE SMART. AUTOMATE FASTER. DELIVER EXCELLENCE."

Style Details: Super high resolution, technical drawing grid, razor-sharp white and neon text, crisp layout, developer IDE aesthetic, flat vector graphics with subtle glow, highly legible monospace font for code blocks, professional presentation.`
}

// ─────────────────────────────────────────────
// Style 4 — System Architecture & Flow Map
// Best for: RAG pipelines, multi-agent workflows, integration architecture
// ─────────────────────────────────────────────
export function styleArchitecture(data: ArchitectureData): string {
  const layerDescriptions = data.layers
    .map((l) => {
      const comps = l.components.map((c) => `"${c}"`).join(', ')
      return `A "${l.name}" container (colored in ${l.color}) containing modules: ${comps}.`
    })
    .join('\n- ')

  const centralNode = data.centralNode ?? 'Central Processing Node'
  const integrationMods = (data.integrationModules ?? ['API Gateway', 'External Services'])
    .map((m) => `"${m}"`)
    .join(' and ')
  const bottomPanel = data.bottomPanel
    ? `A bottom panel labeled "${data.bottomPanel.label}" with sub-modules ${data.bottomPanel.modules.map((m) => `"${m}"`).join(', ')}.`
    : ''

  return `A high-quality architectural system block diagram illustrating the "${data.title}".
Overall Theme: Technical architecture map, clean flow chart, analytical, educational, modern and well-structured layout.
Background: A very clean, subtle light gray background with faint grid lines.

Header:
- At the top-center, a massive dark bold rounded header block displaying "${data.title}".
- Below the title, a small subtitle: "${data.subtitle}".
- In the top-right corner, a small circular profile icon showing Bennie Joseph's likeness (see attached reference photo — match his face, skin tone, beard, and hairstyle, rendered as a clean flat-vector portrait icon), labeled "Bennie Joseph | Architect".

Architecture Layers (Arranged hierarchically with clear connections):
- ${layerDescriptions}
- A central block at the heart of the system labeled "${centralNode}" with a rotating arrow icon. This central node has multiple dotted directional connector lines feeding into and out of all surrounding layers.
- An "INTEGRATION LAYER" box on the upper right with modules ${integrationMods}.
- ${bottomPanel}

Style Details: Technical blueprint style, clean rounded rectangle containers, precise dotted lines with arrowheads showing control and data flow, soft pastel color scheme (pale yellows, soft blues, light greens, and dark blues), micro vector icons inside each block, neat modern sans-serif fonts, absolutely crisp rendering, no blurred elements, zero spelling mistakes, publication-ready engineering diagram.`
}
