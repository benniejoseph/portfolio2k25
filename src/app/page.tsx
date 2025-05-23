// src/app/page.jsx (or page.tsx)
// Make this a client component because it likely orchestrates
// other client components and potentially hooks like react-scroll
"use client"; // <--- Add this if using react-scroll or similar client logic here

import ParticleBackground from '@/components/ParticleBackground';
import FloatingDock from '@/components/FloatingDock';
import ModernHero from '@/components/ModernHero';
import Skills from '@/components/Skills';
import Certifications from '@/components/Certifications';
import Projects from '@/components/Projects';
import Work from '@/components/Work';
import Contact from '@/components/Contact';

export default function Home() {
    return (
        <main className="relative">
            {/* Interactive Particle Background */}
            <ParticleBackground />
            
            {/* Floating Navigation Dock */}
            <FloatingDock />
            
            {/* Main Content */}
            <ModernHero />
            <Skills />
            <Certifications />
            <Projects />
            <Work />
            <Contact />
        </main>
    );
}