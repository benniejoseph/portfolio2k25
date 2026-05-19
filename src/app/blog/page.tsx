import { getAllPosts, getAllTags } from '@/lib/mdx'
import BlogClient from './BlogClient'

export const metadata = {
  title: 'Blog | Bennie Joseph — Salesforce & AI',
  description:
    'Practical takes on Salesforce architecture, AI agents, and building products. By Bennie Joseph, Salesforce Certified Application Architect.',
  openGraph: {
    title: 'Blog | Bennie Joseph — Salesforce & AI',
    description: 'Practical takes on Salesforce architecture, AI agents, and building products.',
    type: 'website',
  },
}

export default function BlogPage() {
  const posts = getAllPosts()
  const tags = getAllTags()
  return <BlogClient posts={posts} tags={tags} />
}
