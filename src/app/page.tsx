'use client'

import SignalCanvas from '@/components/SignalCanvas'
import SystemNavigator from '@/components/SystemNavigator'
import ModernHero from '@/components/ModernHero'
import Skills from '@/components/Skills'
import Certifications from '@/components/Certifications'
import Projects from '@/components/Projects'
import Work from '@/components/Work'
import Contact from '@/components/Contact'

export default function Home() {
  return (
    <>
      {/* Fixed: PCB grid via body::before in globals.css */}
      <SignalCanvas />
      <SystemNavigator />
      <main className="relative z-10 lg:pl-14">
        <ModernHero />
        <Skills />
        <Certifications />
        <Projects />
        <Work />
        <Contact />
      </main>
    </>
  )
}
