# Bennie Joseph — Portfolio and Field Notes

Personal portfolio and technical blog for Bennie Joseph, Customer Success Manager at Salesforce and Salesforce Certified Application Architect.

The site pairs a Dreamforce 2026-inspired visual system with a file-based MDX publication pipeline for Salesforce, Agentforce, AIforce, Winter '27, enterprise architecture, and customer-success engineering content.

## Stack

- Next.js 16 App Router, React 19, TypeScript
- Tailwind CSS and Framer Motion
- MDX posts with syntax highlighting, RSS, sitemap, structured data, and dynamic OG images
- OpenAI Responses API for blog drafting
- OpenAI GPT Image 2 for topic-specific blog artwork
- GitHub Actions for scheduled generation and review-gated image regeneration

## Local development

Requirements:

- Node.js 20.9 or newer
- npm

```bash
npm ci
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Useful checks:

```bash
npm run lint
npm run typecheck
npm run audit-blog
npm run build
```

`npm run check` and `npm run audit-blog -- --strict-images` fail when a post references a missing image. The non-strict `npm run audit-blog` command reports those as warnings so content and image migrations can be reviewed independently without weakening the full release gate.

## Blog automation

Posts live in `content/posts` and their assets live in `public/images/blog/<slug>`.

```bash
npm run generate-post:list
npm run generate-post
npm run generate-post -- --index 4
```

Text generation tries `gpt-6-astra` first and falls back to `gpt-5.6-sol` when the primary model is unavailable. Artwork uses `gpt-image-2`. Cover and inline prompts are derived from each article's topic and purpose; the pipeline deliberately varies composition and avoids a single repeated infographic template.

Required local or GitHub secret:

```text
OPENAI_API_KEY
```

The OpenAI client defaults to the project’s required U.S. regional endpoint, `https://us.api.openai.com/v1`. Override `OPENAI_BASE_URL` only when the API project is configured for another supported processing region.

The scheduled workflow creates one unpublished backlog item at a time and opens a pull request; it never auto-merges or pushes generated editorial content straight to the publishing branch. Review every factual claim, source, code sample, image, and first-person statement before merging, especially for preview, beta, pilot, or rolling Salesforce releases.

## Content and profile sources

- Primary profile metadata: `src/lib/site.ts`
- Employment history: `src/components/Work.tsx`
- Blog editorial context and backlog: `src/lib/blog-ai.ts`
- Existing-image regeneration: `scripts/regenerate-images.ts`
- Machine-readable profile: `public/llms.txt`

## Deployment

The production domain is [www.bennierichard.com](https://www.bennierichard.com). Set `NEXT_PUBLIC_SITE_URL` (or `SITE_URL`) when deploying elsewhere so canonical URLs, RSS, sitemap, JSON-LD, and Open Graph metadata stay consistent.
