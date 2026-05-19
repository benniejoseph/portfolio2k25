'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { FiClock, FiCalendar, FiTag, FiArrowRight, FiRss } from 'react-icons/fi'
import type { PostFrontmatter } from '@/lib/mdx'

interface BlogClientProps {
  posts: PostFrontmatter[]
  tags: string[]
}

function BlogCard({ post, index }: { post: PostFrontmatter; index: number }) {
  const tagColors: Record<string, string> = {
    Salesforce: 'text-blue-400 border-blue-400/30 bg-blue-400/10',
    AI: 'text-purple-400 border-purple-400/30 bg-purple-400/10',
    Agents: 'text-purple-400 border-purple-400/30 bg-purple-400/10',
    Agentforce: 'text-cyan-400 border-cyan-400/30 bg-cyan-400/10',
    Apex: 'text-green-400 border-green-400/30 bg-green-400/10',
    LWC: 'text-yellow-400 border-yellow-400/30 bg-yellow-400/10',
    Career: 'text-pink-400 border-pink-400/30 bg-pink-400/10',
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <Link href={`/blog/${post.slug}`} className="block group">
        <div className="glass rounded-2xl p-6 border border-white/5 hover:border-blue-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/5 h-full">
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className={`text-[11px] font-mono font-medium px-2 py-0.5 rounded-full border ${
                  tagColors[tag] ?? 'text-gray-400 border-gray-400/30 bg-gray-400/10'
                }`}
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Title */}
          <h2 className="text-lg font-bold leading-snug mb-3 group-hover:text-blue-400 transition-colors duration-200 line-clamp-2">
            {post.title}
          </h2>

          {/* Excerpt */}
          <p className="text-sm leading-relaxed mb-4 line-clamp-3" style={{ color: 'var(--color-text-tertiary)' }}>
            {post.excerpt}
          </p>

          {/* Meta */}
          <div className="flex items-center justify-between pt-3 border-t border-white/5">
            <div className="flex items-center gap-3 text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
              <span className="flex items-center gap-1">
                <FiCalendar size={11} />
                {new Date(post.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </span>
              <span className="flex items-center gap-1">
                <FiClock size={11} />
                {post.readingTime}
              </span>
            </div>
            <FiArrowRight
              size={14}
              className="text-blue-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200"
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
    <div className="min-h-screen" style={{ background: 'var(--color-bg-primary)' }}>
      {/* Header */}
      <section className="pt-32 pb-16 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-blue-500/5 blur-3xl rounded-full" />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="relative z-10 max-w-2xl mx-auto"
        >
          <p className="text-sm font-mono mb-4" style={{ color: 'var(--color-accent-primary)' }}>
            {'<'} thoughts /&gt;
          </p>
          <h1 className="text-4xl md:text-5xl font-black mb-4">
            <span className="gradient-text">Notes from the</span>
            <br />
            Salesforce × AI Frontier
          </h1>
          <p className="text-base md:text-lg leading-relaxed" style={{ color: 'var(--color-text-tertiary)' }}>
            Practical takes on Salesforce architecture, AI agents, and building products as an indie developer.
            No fluff — only things I&apos;ve actually built or broken.
          </p>
          <div className="flex items-center justify-center gap-3 mt-6">
            <a
              href="/blog/rss.xml"
              className="flex items-center gap-2 text-xs font-mono px-3 py-1.5 rounded-full glass border border-orange-400/30 text-orange-400 hover:bg-orange-400/10 transition-colors"
            >
              <FiRss size={12} /> RSS Feed
            </a>
            <span className="text-xs font-mono" style={{ color: 'var(--color-text-tertiary)' }}>
              {posts.length} posts
            </span>
          </div>
        </motion.div>
      </section>

      <div className="max-w-6xl mx-auto px-4 pb-24">
        {/* Featured post */}
        {featured && activeTag === 'All' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <p className="text-xs font-mono uppercase tracking-widest mb-4" style={{ color: 'var(--color-accent-primary)' }}>
              ✦ Featured
            </p>
            <Link href={`/blog/${featured.slug}`} className="group block">
              <div className="glass rounded-3xl p-8 md:p-10 border border-blue-500/20 hover:border-blue-500/40 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10">
                <div className="flex flex-wrap gap-2 mb-5">
                  {featured.tags.map((tag) => (
                    <span key={tag} className="text-xs font-mono px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-400/20">
                      {tag}
                    </span>
                  ))}
                </div>
                <h2 className="text-2xl md:text-3xl font-black mb-3 group-hover:text-blue-400 transition-colors">
                  {featured.title}
                </h2>
                <p className="text-base leading-relaxed mb-6 max-w-2xl" style={{ color: 'var(--color-text-tertiary)' }}>
                  {featured.excerpt}
                </p>
                <div className="flex items-center gap-4 text-sm" style={{ color: 'var(--color-text-tertiary)' }}>
                  <span className="flex items-center gap-1.5"><FiCalendar size={13} />{new Date(featured.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                  <span className="flex items-center gap-1.5"><FiClock size={13} />{featured.readingTime}</span>
                  <span className="ml-auto flex items-center gap-1 text-blue-400 group-hover:gap-2 transition-all">
                    Read post <FiArrowRight size={14} />
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
              className={`flex items-center gap-1.5 text-xs font-mono px-3 py-1.5 rounded-full border transition-all duration-200 ${
                activeTag === tag
                  ? 'bg-blue-500 border-blue-500 text-white'
                  : 'glass border-white/10 hover:border-blue-400/30'
              }`}
              style={activeTag !== tag ? { color: 'var(--color-text-secondary)' } : {}}
            >
              {tag !== 'All' && <FiTag size={10} />}
              {tag}
            </button>
          ))}
        </div>

        {/* Post grid */}
        {rest.length === 0 ? (
          <div className="text-center py-20" style={{ color: 'var(--color-text-tertiary)' }}>
            <p className="font-mono">No posts in this category yet.</p>
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
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
