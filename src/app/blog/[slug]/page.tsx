import { notFound } from 'next/navigation'
import { MDXRemote } from 'next-mdx-remote/rsc'
import Link from 'next/link'
import Image from 'next/image'
import { getAllPosts, getPostBySlug, getRelatedPosts, publicAssetExists } from '@/lib/mdx'
import { FiArrowLeft, FiClock, FiCalendar } from 'react-icons/fi'
import ShareButton from './ShareButton'
import ThemeToggle from '@/components/ThemeToggle'
import rehypePrettyCode from 'rehype-pretty-code'
import rehypeSlug from 'rehype-slug'
import remarkGfm from 'remark-gfm'
import type { Metadata } from 'next'
import { absoluteUrl, siteConfig, siteUrl } from '@/lib/site'

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
  const ogImage = post.coverImage
    ? absoluteUrl(post.coverImage)
    : absoluteUrl(`/api/og?title=${encodeURIComponent(post.title)}&tags=${encodeURIComponent(post.tags.join(','))}`)
  const brandedTitle = `${post.title} | ${siteConfig.name}`
  const pageTitle = brandedTitle.length <= 60 ? brandedTitle : post.title

  return {
    title: { absolute: pageTitle },
    description: post.excerpt,
    keywords: [post.keyword ?? '', ...post.tags].filter(Boolean),
    authors: [{ name: siteConfig.author.name, url: siteUrl }],
    creator: siteConfig.author.name,
    publisher: siteConfig.author.name,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      url: absoluteUrl(`/blog/${slug}`),
      publishedTime: post.date,
      modifiedTime: post.date,
      authors: [siteConfig.author.name],
      section: post.tags[0],
      tags: post.tags,
      images: [{ url: ogImage, width: 1200, height: 630, alt: post.coverAlt || post.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [ogImage],
    },
    alternates: {
      canonical: `/blog/${slug}`,
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
  AI: 'var(--neural)',
  Agents: 'var(--neural)',
  Agentforce: 'var(--signal)',
  AIforce: 'var(--neural)',
  Winter27: 'var(--signal)',
  Dreamforce26: 'var(--fire)',
  'Customer Success': 'var(--live)',
  Apex: 'var(--live)',
  LWC: 'var(--fire)',
  Career: 'var(--neural)',
  Architecture: 'var(--neural)',
  Security: 'var(--fire)',
  API: 'var(--live)',
}

function tagColor(tag: string) {
  return TAG_COLOR[tag] ?? 'var(--signal)'
}

function BlogContentImage({ src, alt }: { src?: string; alt?: string }) {
  if (!src || !publicAssetExists(src)) {
    return (
      <span className="blog-image-placeholder" role="img" aria-label={alt || 'Article visual awaiting regeneration'}>
        <span aria-hidden="true">✦</span>
        <strong>Visual refresh in progress</strong>
        <span>{alt || 'This article illustration will return after the image migration.'}</span>
      </span>
    )
  }

  return (
    <Image
      src={src}
      alt={alt || ''}
      width={1024}
      height={1024}
      sizes="(max-width: 1024px) 100vw, 760px"
    />
  )
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) notFound()

  const related = getRelatedPosts(slug, post.tags)
  const postUrl = absoluteUrl(`/blog/${slug}`)
  const imageUrl = post.coverImage ? absoluteUrl(post.coverImage) : absoluteUrl(`/api/og?title=${encodeURIComponent(post.title)}`)
  const wordCount = post.content.trim().split(/\s+/).filter(Boolean).length
  const isWinter27Article = post.tags.some((tag) => tag.replace(/[\s'’_-]/g, '').toLowerCase() === 'winter27')
  const needsEditorialReverification = !post.lastVerified

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': `${postUrl}#article`,
    headline: post.title,
    description: post.excerpt,
    url: postUrl,
    mainEntityOfPage: postUrl,
    image: imageUrl,
    datePublished: post.date,
    dateModified: post.date,
    author: { '@type': 'Person', '@id': `${siteUrl}/#person`, name: siteConfig.author.name, url: siteUrl },
    publisher: { '@type': 'Person', '@id': `${siteUrl}/#person`, name: siteConfig.author.name, url: siteUrl },
    keywords: [post.keyword, ...post.tags].filter(Boolean).join(', '),
    articleSection: post.tags[0],
    wordCount,
    inLanguage: 'en',
    isAccessibleForFree: true,
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="relative min-h-screen overflow-hidden" style={{ background: 'var(--void)' }}>
        <div
          className="pointer-events-none absolute left-1/2 top-0 h-[460px] w-[780px] -translate-x-1/2 rounded-full blur-3xl"
          style={{ background: 'linear-gradient(90deg, var(--signal), var(--neural))', opacity: 0.1 }}
        />
        <div className="relative max-w-6xl mx-auto px-6 lg:px-12 pt-20 pb-24">

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-12">
            {/* ── Main article ── */}
            <article>
              {/* Breadcrumb */}
              <nav className="flex min-h-11 items-center gap-2 mb-8 text-xs" aria-label="Breadcrumb" style={{ color: 'var(--text-3)' }}>
                <Link href="/" className="transition-colors hover:text-[var(--signal)]">Portfolio</Link>
                <span>/</span>
                <Link href="/blog" className="transition-colors hover:text-[var(--signal)]">Field notes</Link>
                <span>/</span>
                <span className="truncate max-w-[200px]" style={{ color: 'var(--text-2)' }}>
                  {post.title}
                </span>
                <span className="ml-auto">
                  <ThemeToggle />
                </span>
              </nav>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 mb-5">
                {post.tags.map((tag) => (
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

              {/* Title */}
              <h1
                className="display-headline mb-6"
                style={{ fontSize: 'clamp(34px, 6vw, 64px)', lineHeight: 1.02, color: 'var(--text)' }}
              >
                {post.title}
              </h1>

              {/* Meta row */}
              <div
                className="flex flex-wrap items-center gap-4 pb-8 mb-8"
                style={{ borderBottom: '1px solid var(--border)' }}
              >
                <span className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-3)' }}>
                  <FiCalendar size={11} />
                  {new Date(post.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })}
                </span>
                <span className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-3)' }}>
                  <FiClock size={11} />
                  {post.readingTime}
                </span>
                <ShareButton title={post.title} />
              </div>

              {isWinter27Article && (
                <aside
                  className="mb-8 rounded-[20px] border px-5 py-4"
                  style={{
                    borderColor: 'color-mix(in srgb, var(--signal) 32%, var(--border))',
                    background: 'color-mix(in srgb, var(--signal) 8%, var(--panel))',
                  }}
                >
                  <p className="text-sm font-semibold" style={{ color: 'var(--text)' }}>Winter ’27 availability note</p>
                  <p className="mt-1 text-xs leading-6" style={{ color: 'var(--text-2)' }}>
                    Winter ’27 is in preview and rolling out by instance as of 23 September 2026; it is not yet universally available. Confirm each feature in your target org and the current Salesforce release notes before implementation.
                  </p>
                </aside>
              )}

              {needsEditorialReverification && (
                <aside
                  className="mb-8 rounded-[20px] border px-5 py-4"
                  style={{
                    borderColor: 'color-mix(in srgb, var(--fire) 34%, var(--border))',
                    background: 'color-mix(in srgb, var(--fire) 7%, var(--panel))',
                  }}
                >
                  <p className="text-sm font-semibold" style={{ color: 'var(--text)' }}>Editorial verification note</p>
                  <p className="mt-1 text-xs leading-6" style={{ color: 'var(--text-2)' }}>
                    This article predates the source-checked publishing pipeline. Treat release-status wording as historical, and treat first-person examples as illustrative unless the article links supporting public evidence. Verify implementation details against current official documentation.
                  </p>
                </aside>
              )}

              {/* Cover image */}
              {post.coverImage && (
                <div
                  className="relative mb-10 overflow-hidden"
                  style={{ width: '100%', aspectRatio: '16/9', borderRadius: '24px', border: '1px solid var(--border-2)', position: 'relative', overflow: 'hidden', background: 'var(--panel)' }}
                >
                  <Image
                    src={post.coverImage}
                    alt={post.coverAlt || post.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1200px) 100vw, 900px"
                    priority
                  />
                </div>
              )}

              {/* MDX body */}
              <div className="prose-blog">
                {/* @ts-expect-error async RSC */}
                <MDXRemote source={post.content} options={mdxOptions} components={{ img: BlogContentImage }} />
              </div>

              {/* Author card */}
              <div
                className="mt-16 flex items-start gap-4 rounded-[26px] border p-6"
                style={{ borderColor: 'var(--border)', background: 'color-mix(in srgb, var(--panel) 86%, transparent)', backdropFilter: 'blur(18px)' }}
              >
                <div
                  className="flex-shrink-0 flex items-center justify-center"
                  style={{
                    width: '48px',
                    height: '48px',
                    background: 'linear-gradient(135deg, var(--signal-dim), var(--neural-dim))',
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
                  <div className="text-sm font-semibold" style={{ color: 'var(--signal)' }}>
                    Bennie Joseph
                  </div>
                  <p className="mb-3 mt-1 text-xs leading-6" style={{ color: 'var(--text-2)' }}>
                    Customer Success Manager at Salesforce · Salesforce Certified Application Architect · Writing about trusted agents, platform architecture, and customer outcomes.
                  </p>
                  <p className="mb-3 text-[11px] leading-5" style={{ color: 'var(--text-3)' }}>
                    Personal field notes based on public sources—not official Salesforce guidance.
                  </p>
                  <div className="flex gap-3">
                    <a href="https://linkedin.com/in/benniejosephrichard" target="_blank" rel="noopener noreferrer"
                      className="text-xs font-semibold" style={{ color: 'var(--neural)' }}>
                      LinkedIn
                    </a>
                    <a href="https://github.com/benniejoseph" target="_blank" rel="noopener noreferrer"
                      className="text-xs font-semibold" style={{ color: 'var(--text-3)' }}>
                      GitHub
                    </a>
                  </div>
                </div>
              </div>

              {/* Back link */}
              <Link
                href="/blog"
                className="terminal-cmd mt-10 inline-flex min-h-11 items-center gap-1.5 rounded-full"
              >
                <FiArrowLeft size={10} />
                Back to field notes
              </Link>
            </article>

            {/* ── Sticky sidebar ── */}
            <aside className="hidden lg:block">
              <div className="sticky top-20 space-y-4">
                {related.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="status-dot dot-neural" />
                      <span className="text-[10px] font-semibold uppercase tracking-[0.14em]" style={{ color: 'var(--neural)' }}>
                        Related articles
                      </span>
                    </div>
                    <div className="space-y-3">
                      {related.map((r) => (
                        <Link key={r.slug} href={`/blog/${r.slug}`} className="block group">
                          <div
                            className="blog-related-card rounded-[18px] border p-4"
                            style={{ borderColor: 'var(--border)', background: 'color-mix(in srgb, var(--panel) 84%, transparent)' }}
                          >
                            <div className="flex flex-wrap gap-1 mb-2">
                              {r.tags.slice(0, 2).map((t) => (
                                <span
                                  key={t}
                                  className="text-[9px] font-semibold"
                                  style={{ color: tagColor(t) }}
                                >
                                  {t}
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
                            <span className="mt-2 flex items-center gap-1 text-[10px]" style={{ color: 'var(--text-3)' }}>
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
