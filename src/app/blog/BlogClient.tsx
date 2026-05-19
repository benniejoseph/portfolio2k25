'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { FiClock, FiCalendar, FiArrowRight, FiRss, FiArrowLeft } from 'react-icons/fi'
import type { PostFrontmatter } from '@/lib/mdx'

interface BlogClientProps {
  posts: PostFrontmatter[]
  tags: string[]
}

const TAG_COLOR: Record<string, string> = {
  Salesforce: 'var(--signal)',
  AI:         'var(--neural)',
  Agents:     'var(--neural)',
  Agentforce: 'var(--signal)',
  Apex:       'var(--live)',
  LWC:        'var(--fire)',
  Career:     'var(--neural)',
}

function BlogCard({ post, index }: { post: PostFrontmatter; index: number }) {
  const mainColor = TAG_COLOR[post.tags[0]] ?? 'var(--signal)'

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.05 }}
      exit={{ opacity: 0, y: -16 }}
    >
      <Link href={`/blog/${post.slug}`} className="block group h-full">
        <div className="sys-panel blog-post-card h-full p-5 flex flex-col">
          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {post.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="sys-label px-2 py-0.5 rounded-sm"
                style={{
                  fontSize: '8px',
                  color: TAG_COLOR[tag] ?? 'var(--signal)',
                  border: `1px solid ${TAG_COLOR[tag] ?? 'var(--signal)'}33`,
                  background: `${TAG_COLOR[tag] ?? 'var(--signal)'}0A`,
                }}
              >
                [{tag}]
              </span>
            ))}
          </div>

          {/* Title */}
          <h2
            className="display-headline blog-post-title mb-3 flex-1 line-clamp-3"
            style={{ fontSize: '1rem', lineHeight: 1.35, color: 'var(--text)', transition: 'color 0.2s' }}
          >
            {post.title}
          </h2>

          {/* Excerpt */}
          <p
            className="line-clamp-3 mb-4"
            style={{
              fontFamily: 'var(--font-inter, sans-serif)',
              fontSize: '12px',
              color: 'var(--text-2)',
              lineHeight: 1.65,
            }}
          >
            {post.excerpt}
          </p>

          {/* Meta */}
          <div
            className="flex items-center justify-between pt-3"
            style={{ borderTop: '1px solid var(--border)' }}
          >
            <div className="flex items-center gap-3">
              <span
                className="sys-label-dim flex items-center gap-1"
                style={{ fontSize: '8px' }}
              >
                <FiCalendar size={9} />
                {new Date(post.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </span>
              <span
                className="sys-label-dim flex items-center gap-1"
                style={{ fontSize: '8px' }}
              >
                <FiClock size={9} />
                {post.readingTime}
              </span>
            </div>
            <FiArrowRight
              size={12}
              style={{ color: mainColor, opacity: 0, transition: 'opacity 0.2s, transform 0.2s' }}
              className="group-hover:opacity-100 group-hover:translate-x-0.5"
            />
          </div>
        </div>
      </Link>
    </motion.article>
  )
}

export default function BlogClient({ posts, tags }: BlogClientProps) {
  const [activeTag, setActiveTag] = useState('All')

  const filtered = useMemo(
    () => (activeTag === 'All' ? posts : posts.filter((p) => p.tags.includes(activeTag))),
    [posts, activeTag]
  )

  const featured = posts.find((p) => p.featured)
  const rest = filtered.filter((p) => !p.featured || activeTag !== 'All')

  return (
    <div className="min-h-screen" style={{ background: 'var(--void)' }}>

      {/* Back to portfolio */}
      <div className="fixed top-4 left-4 z-50">
        <Link href="/" className="terminal-cmd flex items-center gap-1.5" style={{ fontSize: '9px', padding: '6px 12px' }}>
          <FiArrowLeft size={10} />
          PORTFOLIO
        </Link>
      </div>

      {/* Header */}
      <section className="pt-28 pb-16 px-6 lg:px-12 relative overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="status-dot dot-signal" />
              <span className="sys-label">DATASTREAM_06 // INTELLIGENCE_FEED</span>
            </div>

            <h1
              className="display-headline crt-text mb-4"
              style={{ fontSize: 'clamp(40px, 8vw, 80px)', color: 'var(--text)' }}
            >
              SIGNAL
              <span style={{ color: 'var(--signal)' }}> LOG</span>
            </h1>

            <p
              className="mb-6 max-w-xl"
              style={{
                fontFamily: 'var(--font-inter, sans-serif)',
                fontSize: '14px',
                color: 'var(--text-2)',
                lineHeight: 1.7,
              }}
            >
              Practical takes on Salesforce architecture, AI agents, and building products as an indie developer.
              No fluff — only things I&apos;ve actually built or broken.
            </p>

            <div className="flex items-center gap-4">
              <a
                href="/blog/rss.xml"
                className="terminal-cmd flex items-center gap-1.5"
                style={{ fontSize: '9px', color: 'var(--fire)', borderColor: 'rgba(245,158,11,0.3)' }}
              >
                <FiRss size={10} />
                RSS_FEED
              </a>
              <span className="sys-label-dim" style={{ fontSize: '9px' }}>
                POSTS_INDEXED: {posts.length}
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 lg:px-12 pb-24">

        {/* Featured post */}
        {featured && activeTag === 'All' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <div className="flex items-center gap-2 mb-4">
              <span className="status-dot dot-fire" />
              <span className="sys-label" style={{ fontSize: '9px', color: 'var(--fire)' }}>
                FEATURED_TRANSMISSION
              </span>
            </div>

            <Link href={`/blog/${featured.slug}`} className="block group">
              <div
                className="sys-panel p-7 md:p-10"
                style={{ border: '1px solid var(--border-fire)', background: 'rgba(245,158,11,0.04)' }}
              >
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {featured.tags.map((tag) => (
                    <span
                      key={tag}
                      className="sys-label px-2 py-0.5 rounded-sm"
                      style={{
                        fontSize: '8px',
                        color: TAG_COLOR[tag] ?? 'var(--signal)',
                        border: `1px solid ${TAG_COLOR[tag] ?? 'var(--signal)'}33`,
                        background: `${TAG_COLOR[tag] ?? 'var(--signal)'}0A`,
                      }}
                    >
                      [{tag}]
                    </span>
                  ))}
                </div>

                <h2
                  className="display-headline mb-3 transition-colors duration-200 group-hover:text-[var(--signal)]"
                  style={{ fontSize: 'clamp(20px, 3vw, 32px)', color: 'var(--text)', lineHeight: 1.25 }}
                >
                  {featured.title}
                </h2>

                <p
                  className="mb-6 max-w-2xl"
                  style={{
                    fontFamily: 'var(--font-inter, sans-serif)',
                    fontSize: '13px',
                    color: 'var(--text-2)',
                    lineHeight: 1.7,
                  }}
                >
                  {featured.excerpt}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="sys-label-dim flex items-center gap-1" style={{ fontSize: '9px' }}>
                      <FiCalendar size={9} />
                      {new Date(featured.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </span>
                    <span className="sys-label-dim flex items-center gap-1" style={{ fontSize: '9px' }}>
                      <FiClock size={9} />
                      {featured.readingTime}
                    </span>
                  </div>
                  <span
                    className="terminal-cmd flex items-center gap-1.5"
                    style={{ fontSize: '9px', padding: '6px 12px' }}
                  >
                    READ_POST <FiArrowRight size={10} />
                  </span>
                </div>
              </div>
            </Link>
          </motion.div>
        )}

        {/* Tag filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          {['All', ...tags].map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveTag(tag)}
              className="sys-label px-3 py-1.5 rounded-sm transition-all duration-200"
              style={{
                fontSize: '8px',
                border: `1px solid ${activeTag === tag ? 'var(--signal)' : 'var(--border)'}`,
                background: activeTag === tag ? 'var(--signal-dim)' : 'transparent',
                color: activeTag === tag ? 'var(--signal)' : 'var(--text-3)',
                cursor: 'pointer',
              }}
            >
              {tag === 'All' ? 'ALL_POSTS' : `[${tag}]`}
            </button>
          ))}
        </div>

        {/* Post grid */}
        {rest.length === 0 ? (
          <div className="text-center py-20">
            <span className="sys-label-dim" style={{ fontSize: '10px' }}>NO_POSTS_FOUND — TRY_ANOTHER_FILTER</span>
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {rest.map((post, i) => (
                <BlogCard key={post.slug} post={post} index={i} />
              ))}
            </div>
          </AnimatePresence>
        )}
      </div>
    </div>
  )
}
