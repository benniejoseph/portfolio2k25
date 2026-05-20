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

const personSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Bennie Joseph',
  url: 'https://benniejoseph.dev',
  jobTitle: 'Salesforce Certified Application Architect',
  description: 'Salesforce Certified Application Architect with 9+ years of enterprise experience. Expert in Agentforce, AI agents, Apex, and LWC.',
  sameAs: [
    'https://linkedin.com/in/benniejosephrichard',
    'https://github.com/benniejoseph',
  ],
  knowsAbout: [
    'Salesforce', 'Agentforce', 'Apex', 'Lightning Web Components',
    'AI Agents', 'Salesforce Integration', 'nCino', 'SaaS',
  ],
}

export default function Home() {
  const latestPosts = getAllPosts().slice(0, 3)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
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
