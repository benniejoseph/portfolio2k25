'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { AnimatePresence, motion } from 'framer-motion'
import { FiArrowLeft, FiArrowRight, FiCalendar, FiClock, FiRss } from 'react-icons/fi'
import type { PostFrontmatter } from '@/lib/mdx'
import ThemeToggle from '@/components/ThemeToggle'

interface BlogClientProps {
  posts: PostFrontmatter[]
  tags: string[]
}

const TAG_COLOR: Record<string, string> = {
  Salesforce: 'var(--signal)',
  AI: 'var(--neural)',
  Agents: 'var(--neural)',
  Agentforce: 'var(--signal)',
  AIforce: 'var(--neural)',
  Winter27: 'var(--signal)',
  Dreamforce26: 'var(--fire)',
  'Customer Success': 'var(--live)',
  Apex: 'var(--live)',
  LWC: 'var(--fire)',
  Architecture: 'var(--neural)',
  Security: 'var(--fire)',
  API: 'var(--live)',
}

const FOCUS_AREAS = [
  { label: 'Winter ’27', detail: 'Preview & rolling rollout', color: 'var(--signal)' },
  { label: 'Dreamforce ’26', detail: 'Agentic Enterprise', color: 'var(--fire)' },
  { label: 'AIforce', detail: 'Research to application', color: 'var(--neural)' },
  { label: 'Customer Success', detail: 'Adoption to outcomes', color: 'var(--live)' },
]

const EDITORIAL_RUNWAY = [
  {
    title: "Winter ’27 API v68: release readiness without preview surprises",
    detail: 'Instance timing, regression scope, feature status, and rollback planning.',
    color: 'var(--signal)',
  },
  {
    title: "Apex and LWC v68 upgrade playbooks",
    detail: 'Compile versions, component versioning, tests, and production rollout boundaries.',
    color: 'var(--live)',
  },
  {
    title: "Flow versioned updates and Agentforce metadata",
    detail: 'What to test, activate, roll back, and keep in source control.',
    color: 'var(--fire)',
  },
  {
    title: "AIforce after Dreamforce ’26",
    detail: 'An engineering evaluation framework for a research initiative—not a fictional runtime.',
    color: 'var(--neural)',
  },
  {
    title: 'Koa pilot evaluation before GA',
    detail: 'A hypothetical harness for reasoning quality, safety, latency, and operational fit.',
    color: 'var(--signal)',
  },
  {
    title: 'Headless 360 and MCP security boundaries',
    detail: 'Capability status, identity, tool permissions, approvals, and auditable execution.',
    color: 'var(--fire)',
  },
]

function tagColor(tag: string) {
  return TAG_COLOR[tag] ?? 'var(--signal)'
}

function PostCard({ post, index }: { post: PostFrontmatter; index: number }) {
  const accent = tagColor(post.tags[0])

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.04, 0.24) }}
    >
      <Link href={`/blog/${post.slug}`} className="group block h-full">
        <div
          className="flex h-full flex-col overflow-hidden rounded-[26px] border transition-transform duration-300 group-hover:-translate-y-1"
          style={{
            borderColor: 'var(--border)',
            background: 'color-mix(in srgb, var(--panel) 86%, transparent)',
            backdropFilter: 'blur(18px)',
          }}
        >
          {post.coverImage && (
            <div className="relative aspect-[3/2] w-full shrink-0 overflow-hidden">
              <Image
                src={post.coverImage}
                alt={post.coverAlt || post.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, transparent 46%, color-mix(in srgb, var(--panel) 92%, transparent))' }} />
            </div>
          )}

          <div className="flex flex-1 flex-col p-5">
            <div className="mb-4 flex flex-wrap gap-1.5">
              {post.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border px-2.5 py-1 text-[9px] font-semibold"
                  style={{
                    color: tagColor(tag),
                    borderColor: `color-mix(in srgb, ${tagColor(tag)} 30%, transparent)`,
                    background: `color-mix(in srgb, ${tagColor(tag)} 8%, transparent)`,
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>

            <h2 className="line-clamp-3 text-lg font-semibold leading-snug" style={{ color: 'var(--text)' }}>{post.title}</h2>
            <p className="mt-3 line-clamp-3 text-xs leading-6" style={{ color: 'var(--text-2)' }}>{post.excerpt}</p>

            <div className="mt-auto flex items-center justify-between border-t pt-4" style={{ borderColor: 'var(--border)' }}>
              <div className="flex flex-wrap items-center gap-3 text-[10px]" style={{ color: 'var(--text-3)' }}>
                <span className="flex items-center gap-1.5">
                  <FiCalendar size={11} />
                  {new Date(post.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' })}
                </span>
                <span className="flex items-center gap-1.5"><FiClock size={11} />{post.readingTime}</span>
              </div>
              <FiArrowRight className="transition-transform duration-200 group-hover:translate-x-1" size={14} style={{ color: accent }} />
            </div>
          </div>
        </div>
      </Link>
    </motion.article>
  )
}

export default function BlogClient({ posts, tags }: BlogClientProps) {
  const [activeTag, setActiveTag] = useState('All')

  const filtered = useMemo(
    () => (activeTag === 'All' ? posts : posts.filter((post) => post.tags.includes(activeTag))),
    [activeTag, posts]
  )

  const featured = posts.find((post) => post.featured)
  const remainingPosts = filtered.filter((post) => activeTag !== 'All' || !post.featured)

  return (
    <div className="min-h-screen" style={{ background: 'var(--void)' }}>
      <div className="fixed left-4 top-4 z-50 flex items-center gap-2">
        <Link href="/" className="terminal-cmd min-h-11 rounded-full px-4 py-2 text-xs">
          <FiArrowLeft size={13} /> Portfolio
        </Link>
        <ThemeToggle />
      </div>

      <section className="relative overflow-hidden px-6 pb-14 pt-32 lg:px-12">
        <div
          className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[720px] -translate-x-1/2 rounded-full blur-3xl"
          style={{ background: 'linear-gradient(90deg, var(--signal), var(--neural))', opacity: 0.12 }}
        />
        <div className="relative mx-auto max-w-6xl">
          <motion.div initial={{ opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
            <div className="mb-4 flex items-center gap-3">
              <span className="status-dot dot-signal" />
              <span className="sys-label">Salesforce & AI field notes</span>
            </div>
            <h1
              className="display-headline max-w-4xl"
              style={{ fontSize: 'clamp(46px, 9vw, 96px)', color: 'var(--text)', lineHeight: 0.92 }}
            >
              Ideas for making the{' '}
              <span style={{ color: 'var(--signal)' }}>Agentic Enterprise real.</span>
            </h1>
            <p className="mt-7 max-w-2xl text-base leading-8" style={{ color: 'var(--text-2)' }}>
              Practical Salesforce architecture, trusted-agent patterns, release analysis, and customer-success thinking—grounded in what teams can adopt, operate, and measure.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <a href="/blog/rss.xml" className="terminal-cmd min-h-11 rounded-full px-4 py-2 text-xs">
                <FiRss size={13} /> Follow via RSS
              </a>
              <span className="text-xs" style={{ color: 'var(--text-3)' }}>{posts.length} articles</span>
            </div>
          </motion.div>
        </div>
      </section>

      <main className="mx-auto max-w-6xl px-6 pb-24 lg:px-12">
        <div
          className="mb-10 rounded-[26px] border p-5 sm:p-6"
          style={{
            borderColor: 'color-mix(in srgb, var(--signal) 28%, var(--border))',
            background: 'linear-gradient(135deg, color-mix(in srgb, var(--signal) 10%, var(--panel)), color-mix(in srgb, var(--neural) 7%, var(--panel)))',
          }}
        >
          <p className="text-sm font-semibold" style={{ color: 'var(--text)' }}>Release status · 23 September 2026</p>
          <p className="mt-2 text-xs leading-6" style={{ color: 'var(--text-2)' }}>
            Winter ’27 is in preview and rolling out by instance; it is not yet universally available. Release-focused articles call out preview, beta, pilot, and rollout status so teams can plan without treating announcements as shipped capability.
          </p>
        </div>

        <div className="mb-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {FOCUS_AREAS.map((area) => (
            <div
              key={area.label}
              className="rounded-[20px] border p-4"
              style={{ borderColor: `color-mix(in srgb, ${area.color} 28%, var(--border))`, background: 'color-mix(in srgb, var(--panel) 82%, transparent)' }}
            >
              <p className="text-sm font-semibold" style={{ color: area.color }}>{area.label}</p>
              <p className="mt-1 text-[11px]" style={{ color: 'var(--text-3)' }}>{area.detail}</p>
            </div>
          ))}
        </div>

        <section
          className="mb-12 overflow-hidden rounded-[30px] border p-6 sm:p-8"
          style={{
            borderColor: 'var(--border)',
            background: 'color-mix(in srgb, var(--panel) 86%, transparent)',
          }}
          aria-labelledby="editorial-runway-title"
        >
          <div className="mb-6 max-w-3xl">
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em]" style={{ color: 'var(--signal)' }}>
              Editorial runway
            </p>
            <h2 id="editorial-runway-title" className="mt-2 text-2xl font-semibold" style={{ color: 'var(--text)' }}>
              Next technical deep dives
            </h2>
            <p className="mt-2 text-sm leading-6" style={{ color: 'var(--text-2)' }}>
              Queued for source-checked publication. Release-specific claims are re-verified against official documentation when each article is generated.
            </p>
          </div>

          <ol className="grid gap-3 md:grid-cols-2">
            {EDITORIAL_RUNWAY.map((topic, index) => (
              <li
                key={topic.title}
                className="flex gap-4 rounded-[20px] border p-4"
                style={{ borderColor: 'var(--border)', background: 'color-mix(in srgb, var(--panel-2) 72%, transparent)' }}
              >
                <span
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[10px] font-bold"
                  style={{ color: topic.color, background: `color-mix(in srgb, ${topic.color} 12%, transparent)` }}
                  aria-hidden="true"
                >
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span>
                  <strong className="block text-sm leading-5" style={{ color: 'var(--text)' }}>{topic.title}</strong>
                  <span className="mt-1 block text-xs leading-5" style={{ color: 'var(--text-2)' }}>{topic.detail}</span>
                </span>
              </li>
            ))}
          </ol>
        </section>

        {featured && activeTag === 'All' && (
          <motion.section initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.16em]" style={{ color: 'var(--fire)' }}>Featured article</p>
            <Link href={`/blog/${featured.slug}`} className="group block">
              <div
                className="grid overflow-hidden rounded-[30px] border md:grid-cols-[minmax(0,1fr)_minmax(280px,0.75fr)]"
                style={{ borderColor: 'color-mix(in srgb, var(--fire) 34%, var(--border))', background: 'color-mix(in srgb, var(--panel) 88%, transparent)' }}
              >
                <div className="flex flex-col justify-center p-7 md:p-10">
                  <div className="mb-5 flex flex-wrap gap-2">
                    {featured.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border px-2.5 py-1 text-[9px] font-semibold"
                        style={{ color: tagColor(tag), borderColor: `color-mix(in srgb, ${tagColor(tag)} 30%, transparent)` }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h2 className="text-2xl font-semibold leading-tight sm:text-3xl" style={{ color: 'var(--text)' }}>{featured.title}</h2>
                  <p className="mt-4 max-w-2xl text-sm leading-7" style={{ color: 'var(--text-2)' }}>{featured.excerpt}</p>
                  <div className="mt-7 flex flex-wrap items-center gap-4 text-[11px]" style={{ color: 'var(--text-3)' }}>
                    <span className="flex items-center gap-1.5"><FiCalendar size={12} />{new Date(featured.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })}</span>
                    <span className="flex items-center gap-1.5"><FiClock size={12} />{featured.readingTime}</span>
                    <span className="ml-auto flex items-center gap-1.5 font-semibold" style={{ color: 'var(--signal)' }}>Read article <FiArrowRight size={13} /></span>
                  </div>
                </div>
                {featured.coverImage && (
                  <div className="relative min-h-[260px] overflow-hidden">
                    <Image src={featured.coverImage} alt={featured.coverAlt || featured.title} fill className="object-cover transition-transform duration-700 group-hover:scale-[1.03]" sizes="(max-width: 768px) 100vw, 45vw" priority />
                  </div>
                )}
              </div>
            </Link>
          </motion.section>
        )}

        <div className="mb-8" aria-label="Filter articles by topic">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em]" style={{ color: 'var(--text-3)' }}>Browse by topic</p>
          <div className="flex flex-wrap gap-2">
            {['All', ...tags].map((tag) => {
              const selected = activeTag === tag
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setActiveTag(tag)}
                  className="min-h-11 rounded-full border px-4 py-2 text-xs font-semibold transition-colors"
                  style={{
                    borderColor: selected ? 'var(--signal)' : 'var(--border)',
                    background: selected ? 'var(--signal-dim)' : 'color-mix(in srgb, var(--panel) 76%, transparent)',
                    color: selected ? 'var(--signal)' : 'var(--text-2)',
                  }}
                  aria-pressed={selected}
                >
                  {tag === 'All' ? 'All articles' : tag}
                </button>
              )
            })}
          </div>
        </div>

        {remainingPosts.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-sm" style={{ color: 'var(--text-2)' }}>No articles match this topic yet.</p>
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {remainingPosts.map((post, index) => <PostCard key={post.slug} post={post} index={index} />)}
            </div>
          </AnimatePresence>
        )}
      </main>
    </div>
  )
}
