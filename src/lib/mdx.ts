import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import readingTime from 'reading-time'

const postsDir = path.join(process.cwd(), 'content/posts')
const publicDir = path.join(process.cwd(), 'public')

export function publicAssetExists(assetPath: string): boolean {
  if (/^https?:\/\//u.test(assetPath)) return true
  if (!assetPath.startsWith('/')) return false

  const resolvedPath = path.resolve(publicDir, assetPath.replace(/^\/+/, ''))
  const publicPrefix = `${path.resolve(publicDir)}${path.sep}`
  return resolvedPath.startsWith(publicPrefix) && fs.existsSync(resolvedPath)
}

export interface PostFrontmatter {
  title: string
  excerpt: string
  date: string
  tags: string[]
  slug: string
  readingTime: string
  featured?: boolean
  coverImage?: string
  coverAlt?: string
  keyword?: string
  lastVerified?: string
}

export interface Post extends PostFrontmatter {
  content: string
}

function parseFrontmatter(
  data: Record<string, unknown>,
  source: string
): Omit<PostFrontmatter, 'slug' | 'readingTime'> {
  const requiredStrings = ['title', 'excerpt', 'date'] as const
  for (const field of requiredStrings) {
    if (typeof data[field] !== 'string' || !data[field].trim()) {
      throw new Error(`Invalid blog frontmatter in ${source}: ${field} must be a non-empty string`)
    }
  }

  if (!Array.isArray(data.tags) || data.tags.length === 0 || data.tags.some((tag) => typeof tag !== 'string')) {
    throw new Error(`Invalid blog frontmatter in ${source}: tags must be a non-empty string array`)
  }

  const title = data.title as string
  const excerpt = data.excerpt as string
  const date = data.date as string
  const tags = data.tags as string[]
  const requestedCover = typeof data.coverImage === 'string' ? data.coverImage : undefined
  const lastVerified = typeof data.lastVerified === 'string' ? data.lastVerified : undefined

  if (Number.isNaN(Date.parse(date))) {
    throw new Error(`Invalid blog frontmatter in ${source}: date must be parseable`)
  }
  if (lastVerified && Number.isNaN(Date.parse(lastVerified))) {
    throw new Error(`Invalid blog frontmatter in ${source}: lastVerified must be parseable`)
  }

  return {
    title,
    excerpt,
    date,
    tags,
    featured: typeof data.featured === 'boolean' ? data.featured : false,
    coverImage: requestedCover && publicAssetExists(requestedCover) ? requestedCover : undefined,
    coverAlt: typeof data.coverAlt === 'string' ? data.coverAlt : undefined,
    keyword: typeof data.keyword === 'string' ? data.keyword : undefined,
    lastVerified,
  }
}

export function getAllPosts(): PostFrontmatter[] {
  if (!fs.existsSync(postsDir)) return []
  const files = fs.readdirSync(postsDir).filter((f) => f.endsWith('.mdx'))
  return files
    .map((file) => {
      const raw = fs.readFileSync(path.join(postsDir, file), 'utf-8')
      const { data, content } = matter(raw)
      return {
        ...parseFrontmatter(data, file),
        slug: file.replace('.mdx', ''),
        readingTime: readingTime(content).text,
      }
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export function getPostBySlug(slug: string): Post | null {
  const filePath = path.join(postsDir, `${slug}.mdx`)
  if (!fs.existsSync(filePath)) return null
  const raw = fs.readFileSync(filePath, 'utf-8')
  const { data, content } = matter(raw)
  return {
    ...parseFrontmatter(data, `${slug}.mdx`),
    slug,
    readingTime: readingTime(content).text,
    content,
  }
}

export function getRelatedPosts(currentSlug: string, tags: string[], limit = 3): PostFrontmatter[] {
  return getAllPosts()
    .filter((p) => p.slug !== currentSlug && p.tags.some((t) => tags.includes(t)))
    .slice(0, limit)
}

export function getAllTags(): string[] {
  const posts = getAllPosts()
  const tagSet = new Set<string>()
  posts.forEach((p) => p.tags.forEach((t) => tagSet.add(t)))
  return Array.from(tagSet).sort()
}
