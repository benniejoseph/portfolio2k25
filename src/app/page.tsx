// src/app/page.jsx (or page.tsx)
// Make this a client component because it likely orchestrates
// other client components and potentially hooks like react-scroll
"use client"; // <--- Add this if using react-scroll or similar client logic here

import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Skills from '../components/Skills';
import Projects from '../components/Projects';
import Work from '../components/Work';
import Contact from '../components/Contact';
import Certifications from '../components/Certifications';
import { useEffect, useState } from 'react';

export default function Home() {
    const [scrollProgress, setScrollProgress] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const totalScroll = document.documentElement.scrollTop;
            const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scroll = `${totalScroll / windowHeight}`;
            setScrollProgress(Number(scroll));
        };

        const handleVisibility = () => {
            const sections = document.querySelectorAll('.section');
            sections.forEach(section => {
                const rect = section.getBoundingClientRect();
                if (rect.top <= window.innerHeight * 0.75) {
                    section.classList.add('section-enter-active');
                }
            });
        };

        window.addEventListener('scroll', handleScroll);
        window.addEventListener('scroll', handleVisibility);
        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('scroll', handleVisibility);
        };
    }, []);

    useEffect(() => {
        console.log("EmailJS Service ID:", process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID);
    }, []);

    return (
        <>
            {/* Metadata is better handled in layout.tsx */}
            {/* <Head>
                <title>Bennie J Richard - Salesforce Developer</title>
                <meta name="description" content="Portfolio of Bennie J Richard..." />
                <link rel="icon" href="/favicon.ico" />
            </Head> */}

            <div className="animated-bg" />
            <div 
                className="scroll-progress" 
                style={{ transform: `scaleX(${scrollProgress})` }}
            />
            <Navbar />

            <main className="relative">
                <section id="home" className="section section-enter">
                    <div className="container">
                        <Hero />
                    </div>
                </section>

                <section id="skills" className="section section-enter">
                    <div className="container">
                        <Skills />
                    </div>
                </section>

                <section id="certifications" className="section section-enter">
                    <div className="container">
                        <Certifications />
                    </div>
                </section>

                <section id="projects" className="section section-enter">
                    <div className="container">
                        <Projects />
                    </div>
                </section>

                <section id="work" className="section section-enter">
                    <div className="container">
                        <Work />
                    </div>
                </section>

                <section id="contact" className="section section-enter">
                    <div className="container">
                        <Contact />
                    </div>
                </section>
            </main>

            <footer className="text-center py-6 bg-dark text-lightText/50 text-sm">
                <div className="container">
                    <p>© {new Date().getFullYear()} Bennie J Richard. Built with Next.js, Tailwind, Three.js & Framer Motion.</p>
                    <p className="mt-2 text-xs">
                        <span className="code-text">Designed & Built by Bennie J Richard</span>
                    </p>
                </div>
            </footer>
        </>
    );
}