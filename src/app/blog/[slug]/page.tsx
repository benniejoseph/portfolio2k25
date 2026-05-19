import { notFound } from 'next/navigation'
import { MDXRemote } from 'next-mdx-remote/rsc'
import Link from 'next/link'
import Image from 'next/image'
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
        { theme: 'one-dark-pro', keepBackground: true },
      ],
    ],
  },
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

      <div className="min-h-screen" style={{ background: 'var(--void)' }}>
        <div className="max-w-6xl mx-auto px-6 lg:px-12 pt-20 pb-24">

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-12">
            {/* ── Main article ── */}
            <article>
              {/* Breadcrumb */}
              <nav className="flex items-center gap-2 mb-8" style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '9px', letterSpacing: '0.14em', color: 'var(--text-3)' }}>
                <Link href="/" className="transition-colors hover:text-[var(--signal)]">HOME</Link>
                <span>/</span>
                <Link href="/blog" className="transition-colors hover:text-[var(--signal)]">SIGNAL_LOG</Link>
                <span>/</span>
                <span className="truncate max-w-[200px]" style={{ color: 'var(--text-2)' }}>
                  {post.slug.toUpperCase().replace(/-/g, '_')}
                </span>
              </nav>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 mb-5">
                {post.tags.map((tag) => (
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
              <h1
                className="display-headline crt-text mb-6"
                style={{ fontSize: 'clamp(24px, 4vw, 48px)', lineHeight: 1.1, color: 'var(--text)' }}
              >
                {post.title}
              </h1>

              {/* Meta row */}
              <div
                className="flex flex-wrap items-center gap-4 pb-8 mb-8"
                style={{ borderBottom: '1px solid var(--border)' }}
              >
                <span className="sys-label-dim flex items-center gap-1.5" style={{ fontSize: '9px' }}>
                  <FiCalendar size={11} />
                  {new Date(post.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
                <span className="sys-label-dim flex items-center gap-1.5" style={{ fontSize: '9px' }}>
                  <FiClock size={11} />
                  {post.readingTime}
                </span>
                <ShareButton title={post.title} />
              </div>

              {/* Cover image */}
              {post.coverImage && (
                <div
                  className="relative w-full mb-10 overflow-hidden"
                  style={{ height: 'clamp(200px, 30vw, 360px)', borderRadius: '4px', border: '1px solid var(--border-2)' }}
                >
                  <Image
                    src={post.coverImage}
                    alt={post.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1200px) 100vw, 900px"
                    priority
                  />
                  <div
                    className="absolute inset-0"
                    style={{ background: 'linear-gradient(to bottom, transparent 55%, var(--void) 100%)' }}
                  />
                </div>
              )}

              {/* MDX body */}
              <div className="prose-blog">
                {/* @ts-expect-error async RSC */}
                <MDXRemote source={post.content} options={mdxOptions} />
              </div>

              {/* Author card */}
              <div
                className="sys-panel mt-16 p-6 flex items-start gap-4"
              >
                <div
                  className="flex-shrink-0 flex items-center justify-center"
                  style={{
                    width: '48px',
                    height: '48px',
                    background: 'var(--signal-dim)',
                    border: '1px solid var(--border-2)',
                    fontFamily: 'var(--font-syne, sans-serif)',
                    fontSize: '1.25rem',
                    fontWeight: 800,
                    color: 'var(--signal)',
                  }}
                >
                  BJ
                </div>
                <div>
                  <div className="sys-label mb-1" style={{ fontSize: '10px', color: 'var(--signal)' }}>
                    BENNIE_JOSEPH
                  </div>
                  <p className="sys-label-dim mb-3" style={{ fontSize: '9px', letterSpacing: '0.06em', textTransform: 'none' }}>
                    Salesforce Certified Application Architect · 9+ years · Building AI agents & SaaS products.
                  </p>
                  <div className="flex gap-3">
                    <a href="https://linkedin.com/in/benniejosephrichard" target="_blank" rel="noopener noreferrer"
                      className="sys-label" style={{ fontSize: '8px', color: 'var(--neural)' }}>
                      [LINKEDIN]
                    </a>
                    <a href="https://github.com/benniejoseph" target="_blank" rel="noopener noreferrer"
                      className="sys-label" style={{ fontSize: '8px', color: 'var(--text-3)' }}>
                      [GITHUB]
                    </a>
                  </div>
                </div>
              </div>

              {/* Back link */}
              <Link
                href="/blog"
                className="terminal-cmd inline-flex items-center gap-1.5 mt-10"
                style={{ fontSize: '9px' }}
              >
                <FiArrowLeft size={10} />
                BACK_TO_SIGNAL_LOG
              </Link>
            </article>

            {/* ── Sticky sidebar ── */}
            <aside className="hidden lg:block">
              <div className="sticky top-20 space-y-4">
                {related.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="status-dot dot-neural" />
                      <span className="sys-label" style={{ fontSize: '8px', color: 'var(--neural)' }}>
                        RELATED_SIGNALS
                      </span>
                    </div>
                    <div className="space-y-3">
                      {related.map((r) => (
                        <Link key={r.slug} href={`/blog/${r.slug}`} className="block group">
                          <div className="sys-panel p-4 blog-related-card">
                            <div className="flex flex-wrap gap-1 mb-2">
                              {r.tags.slice(0, 2).map((t) => (
                                <span
                                  key={t}
                                  className="sys-label"
                                  style={{ fontSize: '7px', color: TAG_COLOR[t] ?? 'var(--signal)' }}
                                >
                                  [{t}]
                                </span>
                              ))}
                            </div>
                            <p
                              className="line-clamp-2 transition-colors duration-200 group-hover:text-[var(--signal)]"
                              style={{
                                fontFamily: 'var(--font-inter, sans-serif)',
                                fontSize: '11px',
                                color: 'var(--text-2)',
                                lineHeight: 1.4,
                              }}
                            >
                              {r.title}
                            </p>
                            <span className="sys-label-dim flex items-center gap-1 mt-1.5" style={{ fontSize: '8px' }}>
                              <FiClock size={9} />{r.readingTime}
                            </span>
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
