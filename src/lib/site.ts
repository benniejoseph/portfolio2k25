export const siteConfig = {
  name: 'Bennie Joseph',
  title: 'Bennie Joseph | Customer Success Manager at Salesforce',
  url: process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || 'https://benniejoseph.dev',
  description:
    'Salesforce Customer Success Manager and Certified Application Architect helping teams connect Salesforce, AI agents, and enterprise architecture to measurable customer outcomes.',
  author: {
    name: 'Bennie Joseph',
    email: 'benniejoseph.r@gmail.com',
    title: 'Customer Success Manager at Salesforce',
    location: 'Bengaluru, India',
    linkedin: 'https://linkedin.com/in/benniejosephrichard',
    github: 'https://github.com/benniejoseph',
  },
  keywords: [
    'Salesforce Application Architect',
    'Salesforce Certified Architect',
    'Salesforce Customer Success Manager',
    'Salesforce customer success',
    'Agentic Enterprise',
    'AIforce',
    'Agentforce developer',
    'Salesforce AI architecture',
    'Apex developer',
    'Lightning Web Components developer',
    'Salesforce integration architect',
    'AI agent development',
    'Salesforce nCino',
    'Salesforce agentic systems',
    'enterprise Salesforce developer India',
    'Salesforce AI builder',
  ],
} as const

export const siteUrl = siteConfig.url.replace(/\/$/, '')

export function absoluteUrl(path = '/') {
  if (path.startsWith('http://') || path.startsWith('https://')) return path
  return `${siteUrl}${path.startsWith('/') ? path : `/${path}`}`
}
