/** @type {import('next-sitemap').IConfig} */
const fs = require('fs')
const path = require('path')
const matter = require('gray-matter')

const siteUrl = process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || 'https://benniejoseph.dev'
const postsDir = path.join(process.cwd(), 'content/posts')

function getPostMetadata() {
  if (!fs.existsSync(postsDir)) return new Map()

  return new Map(
    fs.readdirSync(postsDir)
      .filter((file) => file.endsWith('.mdx'))
      .map((file) => {
        const raw = fs.readFileSync(path.join(postsDir, file), 'utf8')
        const { data } = matter(raw)
        const slug = file.replace(/\.mdx$/, '')
        return [`/blog/${slug}`, data]
      })
  )
}

module.exports = {
  siteUrl,
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [
      { userAgent: '*', allow: '/' },
    ],
  },
  exclude: ['/api/*', '/blog/rss.xml'],
  changefreq: 'weekly',
  priority: 0.7,
  transform: async (config, loc) => {
    const posts = getPostMetadata()
    const post = posts.get(loc)

    if (loc === '/') {
      return { loc, changefreq: 'weekly', priority: 1.0, lastmod: new Date().toISOString() }
    }

    if (loc === '/blog') {
      return { loc, changefreq: 'daily', priority: 0.9, lastmod: new Date().toISOString() }
    }

    if (post) {
      return {
        loc,
        changefreq: 'monthly',
        priority: 0.8,
        lastmod: new Date(post.updated || post.date || Date.now()).toISOString(),
      }
    }

    return {
      loc,
      changefreq: config.changefreq,
      priority: config.priority,
      lastmod: new Date().toISOString(),
    }
  },
  additionalPaths: async () => {
    return [
      { loc: '/blog', changefreq: 'daily', priority: 0.9 },
    ]
  },
}
