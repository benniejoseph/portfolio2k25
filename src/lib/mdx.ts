import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import readingTime from 'reading-time'

const postsDir = path.join(process.cwd(), 'content/posts')

export interface PostFrontmatter {
  title: string
  excerpt: string
  date: string
  tags: string[]
  slug: string
  readingTime: string
  featured?: boolean
  coverImage?: string
  keyword?: string
}

export interface Post extends PostFrontmatter {
  content: string
}

export function getAllPosts(): PostFrontmatter[] {
  if (!fs.existsSync(postsDir)) return []
  const files = fs.readdirSync(postsDir).filter((f) => f.endsWith('.mdx'))
  return files
    .map((file) => {
      const raw = fs.readFileSync(path.join(postsDir, file), 'utf-8')
      const { data, content } = matter(raw)
      return {
        ...(data as Omit<PostFrontmatter, 'slug' | 'readingTime'>),
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
    ...(data as Omit<PostFrontmatter, 'slug' | 'readingTime'>),
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
