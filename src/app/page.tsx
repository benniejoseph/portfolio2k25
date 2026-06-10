import SignalCanvas from '@/components/SignalCanvas'
import SystemNavigator from '@/components/SystemNavigator'
import ModernHero from '@/components/ModernHero'
import Skills from '@/components/Skills'
import Certifications from '@/components/Certifications'
import Projects from '@/components/Projects'
import Work from '@/components/Work'
import Contact from '@/components/Contact'
import SignalLogSection from '@/components/SignalLogSection'
import { getAllPosts } from '@/lib/mdx'
import { absoluteUrl, siteConfig, siteUrl } from '@/lib/site'

const personSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  '@id': `${siteUrl}/#person`,
  name: siteConfig.author.name,
  url: siteUrl,
  image: absoluteUrl('/images/profile.webp'),
  email: `mailto:${siteConfig.author.email}`,
  jobTitle: siteConfig.author.title,
  description: siteConfig.description,
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Bengaluru',
    addressCountry: 'IN',
  },
  sameAs: [
    siteConfig.author.linkedin,
    siteConfig.author.github,
  ],
  knowsAbout: [
    'Salesforce', 'Agentforce', 'Apex', 'Lightning Web Components',
    'AI Agents', 'Salesforce Integration', 'nCino', 'SaaS',
  ],
  hasCredential: [
    'Salesforce Certified Application Architect',
    'Salesforce Certified Data Architect',
    'Salesforce Certified Sharing & Visibility Architect',
    'Salesforce Certified Platform Developer I',
    'Salesforce Certified Platform Developer II',
    'nCino Certified 201 Commercial Banking',
  ],
}

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${siteUrl}/#website`,
  name: siteConfig.name,
  url: siteUrl,
  description: siteConfig.description,
  inLanguage: 'en',
  author: { '@id': `${siteUrl}/#person` },
}

const profilePageSchema = {
  '@context': 'https://schema.org',
  '@type': 'ProfilePage',
  '@id': `${siteUrl}/#profile`,
  url: siteUrl,
  name: siteConfig.title,
  description: siteConfig.description,
  mainEntity: { '@id': `${siteUrl}/#person` },
}

export default function Home() {
  const latestPosts = getAllPosts().slice(0, 3)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([personSchema, websiteSchema, profilePageSchema]) }}
      />

      <SignalCanvas />
      <SystemNavigator />
      <main className="relative z-10 lg:pl-14">
        <ModernHero />
        <Skills />
        <Certifications />
        <Projects />
        <Work />
        <SignalLogSection posts={latestPosts} />
        <Contact />
      </main>
    </>
  )
}
