import { getAllPosts, getAllTags } from '@/lib/mdx'
import BlogClient from './BlogClient'

export const metadata = {
  title: 'Signal Log — Salesforce & AI Blog | Bennie Joseph',
  description:
    'In-depth articles on Salesforce architecture, Agentforce, Apex, LWC, and AI agent development. Practical takes from a Salesforce Certified Application Architect with 9+ years of enterprise experience.',
  keywords: [
    'Salesforce blog', 'Agentforce tutorial', 'Apex best practices',
    'LWC examples', 'Salesforce AI', 'AI agents Salesforce',
    'Salesforce architect blog', 'Salesforce developer tips',
  ],
  openGraph: {
    title: 'Signal Log — Salesforce & AI Blog | Bennie Joseph',
    description: 'In-depth articles on Salesforce architecture, Agentforce, AI agents, Apex and LWC from a Certified Application Architect.',
    type: 'website',
    url: 'https://benniejoseph.dev/blog',
  },
  alternates: {
    canonical: 'https://benniejoseph.dev/blog',
  },
}

export default function BlogPage() {
  const posts = getAllPosts()
  const tags = getAllTags()
  return <BlogClient posts={posts} tags={tags} />
}
