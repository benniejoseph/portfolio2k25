export const siteConfig = {
  name: 'Bennie Joseph',
  title: 'Bennie Joseph | Salesforce Architect & AI Agent Builder',
  url: process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || 'https://benniejoseph.dev',
  description:
    'Salesforce Certified Application Architect with 9+ years building enterprise Salesforce, Agentforce, AI agent, Apex, LWC, and SaaS systems.',
  author: {
    name: 'Bennie Joseph',
    email: 'benniejoseph.r@gmail.com',
    title: 'Salesforce Certified Application Architect',
    location: 'Bengaluru, India',
    linkedin: 'https://linkedin.com/in/benniejosephrichard',
    github: 'https://github.com/benniejoseph',
  },
  keywords: [
    'Salesforce Application Architect',
    'Salesforce Certified Architect',
    'Agentforce developer',
    'Salesforce AI consultant',
    'Apex developer',
    'Lightning Web Components developer',
    'Salesforce integration architect',
    'Salesforce freelance consultant',
    'AI agent development',
    'Salesforce nCino',
    'Salesforce agentic systems',
    'enterprise Salesforce developer India',
    'Salesforce AI builder',
    'hire Salesforce architect',
  ],
} as const

export const siteUrl = siteConfig.url.replace(/\/$/, '')

export function absoluteUrl(path = '/') {
  if (path.startsWith('http://') || path.startsWith('https://')) return path
  return `${siteUrl}${path.startsWith('/') ? path : `/${path}`}`
}
