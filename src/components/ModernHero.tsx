"use client"
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import Image from 'next/image';
import { FiDownload, FiArrowDown, FiGithub, FiLinkedin, FiMail } from 'react-icons/fi';

const ModernHero: React.FC = () => {
  const [isHovering, setIsHovering] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { damping: 25, stiffness: 150 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        mouseX.set(e.clientX - centerX);
        mouseY.set(e.clientY - centerY);
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  const socialLinks = [
    { icon: FiGithub, href: 'https://github.com/benniejoseph', label: 'GitHub' },
    { icon: FiLinkedin, href: 'https://linkedin.com/in/benniejosephrichard', label: 'LinkedIn' },
    { icon: FiMail, href: 'mailto:benniejoseph.r@gmail.com', label: 'Email' },
  ];

  return (
    <section id="home" className="section relative overflow-hidden">
      <div ref={heroRef} className="container relative z-10">
        <div className="min-h-screen flex items-center py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center w-full">

            {/* ── Left: Text Content ── */}
            <div className="space-y-8 text-center lg:text-left order-2 lg:order-1">

              {/* Greeting */}
              <motion.p
                className="text-lg font-mono"
                style={{ color: 'var(--color-text-secondary)' }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                Hello World, I&apos;m
              </motion.p>

              {/* Name */}
              <motion.h1
                className="text-5xl md:text-6xl lg:text-7xl font-black leading-tight -mt-4"
                initial={{ opacity: 0, y: 80 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.6, type: 'spring', bounce: 0.4 }}
              >
                <span className="gradient-text block">Bennie J</span>
                <span className="gradient-text block">Richard</span>
              </motion.h1>

              {/* Title */}
              <motion.h2
                className="text-lg md:text-xl lg:text-2xl font-semibold"
                style={{ color: 'var(--color-text-secondary)' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 1 }}
              >
                <span className="font-mono text-blue-500">{'<'}</span>
                <span className="mx-2">Salesforce Certified Application Architect</span>
                <span className="font-mono text-blue-500">{'/>'}</span>
              </motion.h2>

              {/* Description */}
              <motion.p
                className="text-base md:text-lg max-w-xl mx-auto lg:mx-0 leading-relaxed"
                style={{ color: 'var(--color-text-tertiary)' }}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.2 }}
              >
                <span className="gradient-text font-semibold">9+ years</span> designing scalable Salesforce
                solutions for global enterprises. Expert in{' '}
                <span className="gradient-text font-semibold">Apex, LWC & REST APIs</span> and architecting{' '}
                <span className="gradient-text font-semibold">Generative AI & agentic workflows</span> that
                automate complex business processes.
              </motion.p>

              {/* Stats */}
              <motion.div
                className="flex flex-wrap justify-center lg:justify-start gap-8 pt-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.3 }}
              >
                {[
                  { value: '9+', label: 'Years Experience' },
                  { value: '19+', label: 'Enterprise Clients' },
                  { value: '6x', label: 'SF Certified' },
                ].map((stat) => (
                  <div key={stat.label} className="text-center">
                    <div className="text-2xl md:text-3xl font-black gradient-text">{stat.value}</div>
                    <div className="text-xs md:text-sm font-mono" style={{ color: 'var(--color-text-tertiary)' }}>
                      {stat.label}
                    </div>
                  </div>
                ))}
              </motion.div>

              {/* CTA Buttons */}
              <motion.div
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center pt-2"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.4 }}
              >
                <motion.a
                  href="/Bennie_J_Richard_March.pdf"
                  download
                  className="btn-modern group relative overflow-hidden inline-flex items-center"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onHoverStart={() => setIsHovering(true)}
                  onHoverEnd={() => setIsHovering(false)}
                >
                  <FiDownload className="inline mr-2" />
                  Download Resume
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                </motion.a>

                <motion.button
                  className="px-8 py-4 border-2 rounded-lg font-medium transition-all duration-300 relative group"
                  style={{
                    borderColor: 'var(--color-accent-primary)',
                    color: 'var(--color-accent-primary)',
                  }}
                  whileHover={{
                    scale: 1.05,
                    backgroundColor: 'var(--color-accent-primary)',
                    color: 'white',
                  }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  View My Work
                </motion.button>
              </motion.div>

              {/* Social Links */}
              <motion.div
                className="flex justify-center lg:justify-start space-x-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 1.6 }}
              >
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-full glass hover:scale-110 transition-all duration-300"
                    whileHover={{ y: -5 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 1.8 + index * 0.1 }}
                  >
                    <social.icon size={20} style={{ color: 'var(--color-text-primary)' }} />
                  </motion.a>
                ))}
              </motion.div>
            </div>

            {/* ── Right: Profile Photo ── */}
            <motion.div
              className="relative flex justify-center items-center order-1 lg:order-2"
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.3, type: 'spring', bounce: 0.2 }}
            >
              {/* Ambient glow rings */}
              <motion.div
                className="absolute w-[340px] h-[400px] md:w-[400px] md:h-[480px] rounded-3xl"
                style={{ background: 'radial-gradient(ellipse, rgba(59,130,246,0.12) 0%, transparent 70%)' }}
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              />
              <motion.div
                className="absolute w-[300px] h-[360px] md:w-[360px] md:h-[440px] rounded-3xl border border-blue-500/15"
                animate={{ rotate: [0, 1, -1, 0] }}
                transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
              />

              {/* Photo wrapper */}
              <div className="relative w-[300px] h-[380px] md:w-[360px] md:h-[460px]">

                {/* Color glow behind photo */}
                <div
                  className="absolute inset-2 rounded-2xl blur-3xl opacity-25 scale-90"
                  style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #ec4899 100%)' }}
                />

                {/* The photo itself */}
                <div
                  className="relative w-full h-full overflow-hidden rounded-2xl"
                  style={{
                    WebkitMaskImage:
                      'radial-gradient(ellipse 92% 90% at 50% 35%, black 45%, rgba(0,0,0,0.9) 60%, transparent 80%)',
                    maskImage:
                      'radial-gradient(ellipse 92% 90% at 50% 35%, black 45%, rgba(0,0,0,0.9) 60%, transparent 80%)',
                  }}
                >
                  <Image
                    src="/images/profile.png"
                    alt="Bennie J Richard"
                    fill
                    style={{ objectFit: 'cover', objectPosition: 'center 10%' }}
                    priority
                    sizes="(max-width: 768px) 300px, 360px"
                  />
                </div>

                {/* Bottom-to-top background fade — blends into page */}
                <div
                  className="absolute inset-0 rounded-2xl pointer-events-none"
                  style={{
                    background:
                      'linear-gradient(to top, var(--color-bg-primary) 0%, rgba(0,0,0,0.5) 25%, transparent 55%)',
                  }}
                />
                {/* Left edge fade */}
                <div
                  className="absolute inset-0 rounded-2xl pointer-events-none"
                  style={{
                    background: 'linear-gradient(to right, var(--color-bg-primary) 0%, transparent 30%)',
                  }}
                />
                {/* Right edge fade */}
                <div
                  className="absolute inset-0 rounded-2xl pointer-events-none"
                  style={{
                    background: 'linear-gradient(to left, var(--color-bg-primary) 0%, transparent 30%)',
                  }}
                />

                {/* ── Floating badges ── */}
                <motion.div
                  className="absolute -bottom-3 -right-3 glass px-4 py-2 rounded-xl border"
                  style={{ borderColor: 'var(--color-accent-primary)' }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.6, type: 'spring', bounce: 0.5 }}
                  whileHover={{ scale: 1.08 }}
                >
                  <span className="text-xs font-mono font-bold" style={{ color: 'var(--color-accent-primary)' }}>
                    ✦ Open to Opportunities
                  </span>
                </motion.div>

                <motion.div
                  className="absolute -top-3 -left-3 glass px-3 py-2 rounded-xl"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.8, type: 'spring', bounce: 0.5 }}
                  whileHover={{ scale: 1.08 }}
                >
                  <span className="text-xs font-mono font-bold text-yellow-400">⭐ 6× SF Certified</span>
                </motion.div>

                <motion.div
                  className="absolute top-1/2 -right-5 glass px-3 py-2 rounded-xl"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 2.0, type: 'spring', bounce: 0.5 }}
                  whileHover={{ scale: 1.08 }}
                >
                  <span className="text-xs font-mono font-bold text-green-400">⚡ 9+ Yrs</span>
                </motion.div>
              </div>
            </motion.div>
          </div>

          {/* Scroll indicator */}
          <motion.div
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 2.2 }}
          >
            <motion.div
              className="flex flex-col items-center space-y-2 cursor-pointer"
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              onClick={() => document.querySelector('#skills')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <span className="text-sm font-mono" style={{ color: 'var(--color-text-tertiary)' }}>
                scroll down
              </span>
              <FiArrowDown size={20} style={{ color: 'var(--color-accent-primary)' }} />
            </motion.div>
          </motion.div>
        </div>

        {/* Floating cursor orb */}
        <AnimatePresence>
          {isHovering && (
            <motion.div
              className="absolute pointer-events-none"
              style={{ left: x, top: y }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
            >
              <div className="w-4 h-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-sm opacity-60" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Background ambient gradients */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1], rotate: [0, 360] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl"
          animate={{ scale: [1.2, 1, 1.2], rotate: [360, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
        />
        {/* Extra warm glow on right side to complement photo's red bg */}
        <motion.div
          className="absolute top-0 right-0 w-96 h-full opacity-5"
          style={{ background: 'radial-gradient(ellipse at right, #ef4444, transparent 60%)' }}
          animate={{ opacity: [0.04, 0.08, 0.04] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>
    </section>
  );
};

export default ModernHero;
