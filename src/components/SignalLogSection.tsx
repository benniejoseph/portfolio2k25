'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { FiArrowRight, FiCalendar, FiClock } from 'react-icons/fi'
import type { PostFrontmatter } from '@/lib/mdx'

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

const EDITORIAL_FOCUS = ['Winter ’27 rollout', 'Dreamforce ’26', 'AIforce', 'Customer Success']

function tagColor(tag: string) {
  return TAG_COLOR[tag] ?? 'var(--signal)'
}

export default function SignalLogSection({ posts }: { posts: PostFrontmatter[] }) {
  return (
    <section id="blog" className="relative px-6 py-24 lg:px-12">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="mb-12"
        >
          <div className="mb-4 flex items-center gap-3">
            <span className="status-dot dot-signal" />
            <span className="sys-label">Field notes</span>
          </div>

          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-3xl">
              <h2
                className="display-headline"
                style={{ fontSize: 'clamp(38px, 6vw, 68px)', color: 'var(--text)', lineHeight: 0.98 }}
              >
                Practical thinking for the{' '}
                <span style={{ color: 'var(--signal)' }}>Agentic Enterprise.</span>
              </h2>
              <p className="mt-5 max-w-2xl text-sm leading-7" style={{ color: 'var(--text-2)' }}>
                Salesforce architecture, trusted agents, platform releases, and the customer-success decisions that turn new capabilities into useful outcomes.
              </p>
            </div>
            <Link href="/blog" className="terminal-cmd rounded-full">
              Explore all writing <FiArrowRight size={13} />
            </Link>
          </div>

          <div className="mt-7 flex flex-wrap gap-2">
            {EDITORIAL_FOCUS.map((focus, index) => (
              <span
                key={focus}
                className="rounded-full border px-3 py-1.5 text-[10px] font-semibold"
                style={{
                  color: index === 3 ? 'var(--live)' : index === 2 ? 'var(--neural)' : index === 1 ? 'var(--fire)' : 'var(--signal)',
                  borderColor: 'var(--border-2)',
                  background: 'color-mix(in srgb, var(--panel) 76%, transparent)',
                }}
              >
                {focus}
              </span>
            ))}
          </div>
        </motion.div>

        {posts.length === 0 ? (
          <div
            className="rounded-[28px] border p-10 text-center"
            style={{ borderColor: 'var(--border)', background: 'color-mix(in srgb, var(--panel) 84%, transparent)' }}
          >
            <p className="text-sm" style={{ color: 'var(--text-2)' }}>New field notes are in progress. Please check back soon.</p>
          </div>
        ) : (
          <div className="mb-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post, index) => (
              <motion.article
                key={post.slug}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.42, delay: index * 0.08 }}
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
                        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, transparent 44%, color-mix(in srgb, var(--panel) 92%, transparent))' }} />
                      </div>
                    )}

                    <div className="flex flex-1 flex-col p-5">
                      <div className="mb-4 flex flex-wrap gap-1.5">
                        {post.tags.slice(0, 2).map((tag) => (
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

                      <h3 className="line-clamp-2 text-lg font-semibold leading-snug" style={{ color: 'var(--text)' }}>{post.title}</h3>
                      <p className="mt-3 line-clamp-3 text-xs leading-6" style={{ color: 'var(--text-2)' }}>{post.excerpt}</p>

                      <div className="mt-auto flex items-center justify-between border-t pt-4" style={{ borderColor: 'var(--border)' }}>
                        <div className="flex flex-wrap items-center gap-3 text-[10px]" style={{ color: 'var(--text-3)' }}>
                          <span className="flex items-center gap-1.5">
                            <FiCalendar size={11} />
                            {new Date(post.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' })}
                          </span>
                          <span className="flex items-center gap-1.5"><FiClock size={11} />{post.readingTime}</span>
                        </div>
                        <FiArrowRight className="transition-transform duration-200 group-hover:translate-x-1" size={14} style={{ color: 'var(--signal)' }} />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
