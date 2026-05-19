import { notFound } from 'next/navigation'
import { MDXRemote } from 'next-mdx-remote/rsc'
import Link from 'next/link'
import { getAllPosts, getPostBySlug, getRelatedPosts } from '@/lib/mdx'
import { FiArrowLeft, FiClock, FiCalendar } from 'react-icons/fi'
import ShareButton from './ShareButton'
import rehypePrettyCode from 'rehype-pretty-code'
import rehypeSlug from 'rehype-slug'
import remarkGfm from 'remark-gfm'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) return {}
  return {
    title: `${post.title} | Bennie Joseph`,
    description: post.excerpt,
    keywords: [post.keyword ?? '', ...post.tags].filter(Boolean).join(', '),
    authors: [{ name: 'Bennie Joseph' }],
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.date,
      tags: post.tags,
      images: [`/api/og?title=${encodeURIComponent(post.title)}&tags=${encodeURIComponent(post.tags.join(','))}`],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [`/api/og?title=${encodeURIComponent(post.title)}&tags=${encodeURIComponent(post.tags.join(','))}`],
    },
    alternates: {
      canonical: `https://benniejoseph.dev/blog/${slug}`,
    },
  }
}

const mdxOptions = {
  mdxOptions: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      rehypeSlug,
      [
        rehypePrettyCode,
        {
          theme: 'one-dark-pro',
          keepBackground: true,
        },
      ],
    ],
  },
}

const TAG_COLORS: Record<string, string> = {
  Salesforce: 'text-blue-400 border-blue-400/30 bg-blue-400/10',
  AI: 'text-purple-400 border-purple-400/30 bg-purple-400/10',
  Agents: 'text-purple-400 border-purple-400/30 bg-purple-400/10',
  Agentforce: 'text-cyan-400 border-cyan-400/30 bg-cyan-400/10',
  Apex: 'text-green-400 border-green-400/30 bg-green-400/10',
  LWC: 'text-yellow-400 border-yellow-400/30 bg-yellow-400/10',
  Career: 'text-pink-400 border-pink-400/30 bg-pink-400/10',
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) notFound()

  const related = getRelatedPosts(slug, post.tags)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    author: { '@type': 'Person', name: 'Bennie Joseph', url: 'https://benniejoseph.dev' },
    keywords: [post.keyword, ...post.tags].filter(Boolean).join(', '),
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="min-h-screen" style={{ background: 'var(--color-bg-primary)' }}>
        <div className="max-w-6xl mx-auto px-4 pt-28 pb-24">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-12">
            {/* ── Main article ── */}
            <article>
              {/* Breadcrumb */}
              <nav className="flex items-center gap-2 text-xs font-mono mb-8" style={{ color: 'var(--color-text-tertiary)' }}>
                <Link href="/" className="hover:text-blue-400 transition-colors">Home</Link>
                <span>/</span>
                <Link href="/blog" className="hover:text-blue-400 transition-colors">Blog</Link>
                <span>/</span>
                <span className="truncate max-w-[200px]">{post.title}</span>
              </nav>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-5">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className={`text-xs font-mono font-medium px-2.5 py-1 rounded-full border ${TAG_COLORS[tag] ?? 'text-gray-400 border-gray-400/30 bg-gray-400/10'}`}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Title */}
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-black leading-tight mb-6">
                {post.title}
              </h1>

              {/* Meta row */}
              <div className="flex flex-wrap items-center gap-4 pb-8 mb-8 border-b border-white/10 text-sm" style={{ color: 'var(--color-text-tertiary)' }}>
                <span className="flex items-center gap-1.5">
                  <FiCalendar size={13} />
                  {new Date(post.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
                <span className="flex items-center gap-1.5">
                  <FiClock size={13} />
                  {post.readingTime}
                </span>
                <ShareButton title={post.title} />
              </div>

              {/* MDX body */}
              <div className="prose-blog">
                {/* @ts-expect-error async RSC */}
                <MDXRemote source={post.content} options={mdxOptions} />
              </div>

              {/* Author card */}
              <div className="mt-16 p-6 glass rounded-2xl border border-white/10 flex items-start gap-4">
                <div className="w-14 h-14 rounded-full overflow-hidden flex-shrink-0 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl">
                  B
                </div>
                <div>
                  <p className="font-bold mb-1">Bennie Joseph</p>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-tertiary)' }}>
                    Salesforce Certified Application Architect · 9+ years · Building AI agents & SaaS products on the side.
                  </p>
                  <div className="flex gap-3 mt-3">
                    <a href="https://linkedin.com/in/benniejosephrichard" target="_blank" rel="noopener noreferrer" className="text-xs font-mono text-blue-400 hover:underline">LinkedIn</a>
                    <a href="https://github.com/benniejoseph" target="_blank" rel="noopener noreferrer" className="text-xs font-mono text-blue-400 hover:underline">GitHub</a>
                  </div>
                </div>
              </div>

              {/* Back link */}
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 mt-10 text-sm font-mono text-blue-400 hover:gap-3 transition-all"
              >
                <FiArrowLeft size={14} /> Back to all posts
              </Link>
            </article>

            {/* ── Sticky sidebar ── */}
            <aside className="hidden lg:block">
              <div className="sticky top-28 space-y-6">
                {/* Related posts */}
                {related.length > 0 && (
                  <div>
                    <p className="text-xs font-mono uppercase tracking-widest mb-4" style={{ color: 'var(--color-accent-primary)' }}>
                      Related Posts
                    </p>
                    <div className="space-y-3">
                      {related.map((r) => (
                        <Link key={r.slug} href={`/blog/${r.slug}`} className="block group">
                          <div className="glass p-4 rounded-xl border border-white/5 hover:border-blue-500/20 transition-all">
                            <div className="flex flex-wrap gap-1 mb-2">
                              {r.tags.slice(0, 2).map((t) => (
                                <span key={t} className="text-[10px] font-mono text-blue-400">{t}</span>
                              ))}
                            </div>
                            <p className="text-xs font-medium leading-snug group-hover:text-blue-400 transition-colors line-clamp-2">
                              {r.title}
                            </p>
                            <p className="text-[11px] mt-1.5 flex items-center gap-1" style={{ color: 'var(--color-text-tertiary)' }}>
                              <FiClock size={10} />{r.readingTime}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </aside>
          </div>
        </div>
      </div>
    </>
  )
}
