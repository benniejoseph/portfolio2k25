'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { FiArrowRight, FiCalendar, FiClock } from 'react-icons/fi'
import type { PostFrontmatter } from '@/lib/mdx'

const TAG_COLOR: Record<string, string> = {
  Salesforce: 'var(--signal)',
  AI:         'var(--neural)',
  Agents:     'var(--neural)',
  Agentforce: 'var(--signal)',
  Apex:       'var(--live)',
  LWC:        'var(--fire)',
  Career:     'var(--neural)',
  RAG:        'var(--neural)',
  Performance:'var(--live)',
  Architecture:'var(--neural)',
}

export default function SignalLogSection({ posts }: { posts: PostFrontmatter[] }) {
  return (
    <section id="blog" className="relative py-24 px-6 lg:px-12">
      <div className="max-w-6xl mx-auto">

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="status-dot dot-signal" />
            <span className="sys-label">DATASTREAM_06 // INTELLIGENCE_FEED</span>
          </div>

          <div className="flex items-end justify-between flex-wrap gap-4">
            <h2
              className="display-headline crt-text"
              style={{ fontSize: 'clamp(32px, 5vw, 56px)', color: 'var(--text)' }}
            >
              SIGNAL
              <span style={{ color: 'var(--signal)' }}> LOG</span>
            </h2>
            <Link
              href="/blog"
              className="terminal-cmd hidden md:flex items-center gap-1.5"
              style={{ fontSize: '9px' }}
            >
              VIEW_ALL_POSTS <FiArrowRight size={10} />
            </Link>
          </div>

          <p style={{
            fontFamily: 'var(--font-inter, sans-serif)',
            fontSize: '13px',
            color: 'var(--text-2)',
            marginTop: '0.75rem',
            maxWidth: '480px',
            lineHeight: 1.7,
          }}>
            Practical takes on Salesforce architecture, AI agents, and building products as an indie developer.
          </p>
        </motion.div>

        {/* ── Post grid ── */}
        {posts.length === 0 ? (
          <div className="sys-panel p-10 text-center">
            <span className="sys-label-dim" style={{ fontSize: '10px' }}>
              NO_POSTS_YET — CHECK_BACK_SOON
            </span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {posts.map((post, i) => (
              <motion.article
                key={post.slug}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                <Link href={`/blog/${post.slug}`} className="block group h-full">
                  <div className="sys-panel blog-post-card h-full flex flex-col overflow-hidden">

                    {/* Cover image */}
                    {post.coverImage && (
                      <div
                        className="relative w-full flex-shrink-0 overflow-hidden"
                        style={{ aspectRatio: '3/2' }}
                      >
                        <Image
                          src={post.coverImage}
                          alt={post.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                        <div
                          className="absolute inset-0"
                          style={{ background: 'linear-gradient(to bottom, transparent 40%, var(--void) 100%)' }}
                        />
                      </div>
                    )}

                    <div className="p-5 flex flex-col flex-1">
                      {/* Tags */}
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {post.tags.slice(0, 2).map(tag => (
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
                      <h3
                        className="display-headline blog-post-title mb-2 flex-1 line-clamp-2"
                        style={{
                          fontSize: '0.95rem',
                          lineHeight: 1.35,
                          color: 'var(--text)',
                          transition: 'color 0.2s',
                        }}
                      >
                        {post.title}
                      </h3>

                      {/* Excerpt */}
                      <p
                        className="line-clamp-2 mb-4"
                        style={{
                          fontFamily: 'var(--font-inter, sans-serif)',
                          fontSize: '11px',
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
                          <span className="sys-label-dim flex items-center gap-1" style={{ fontSize: '8px' }}>
                            <FiCalendar size={9} />
                            {new Date(post.date).toLocaleDateString('en-IN', {
                              day: 'numeric', month: 'short', year: 'numeric',
                            })}
                          </span>
                          <span className="sys-label-dim flex items-center gap-1" style={{ fontSize: '8px' }}>
                            <FiClock size={9} />
                            {post.readingTime}
                          </span>
                        </div>
                        <FiArrowRight
                          size={12}
                          style={{ color: 'var(--signal)', opacity: 0, transition: 'opacity 0.2s' }}
                          className="group-hover:opacity-100 group-hover:translate-x-0.5 transition-transform"
                        />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>
        )}

        {/* Mobile view-all */}
        <div className="flex justify-center md:hidden mt-2">
          <Link href="/blog" className="terminal-cmd flex items-center gap-1.5" style={{ fontSize: '9px' }}>
            VIEW_ALL_POSTS <FiArrowRight size={10} />
          </Link>
        </div>

      </div>
    </section>
  )
}
