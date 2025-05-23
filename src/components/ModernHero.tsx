"use client"
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
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
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center space-y-8 max-w-4xl mx-auto">
            
            {/* Animated Profile Image */}
            <motion.div
              className="relative mx-auto w-32 h-32 mb-8"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ 
                duration: 1, 
                type: "spring", 
                bounce: 0.4,
                delay: 0.2 
              }}
            >
              <div className="relative">
                {/* Holographic ring */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 animate-spin-slow opacity-75 blur-sm" />
                <div className="absolute inset-1 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 animate-pulse opacity-60" />
                
                {/* Profile image placeholder */}
                <div 
                  className="relative w-full h-full rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold z-10"
                  style={{ backgroundColor: 'var(--color-bg-secondary)' }}
                >
                  BJR
                </div>
              </div>
            </motion.div>

            {/* Animated greeting */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="space-y-2"
            >
              <motion.p 
                className="text-lg font-mono"
                style={{ color: 'var(--color-text-secondary)' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                Hello World, I&apos;m
              </motion.p>
            </motion.div>

            {/* Main heading with gradient text */}
            <motion.h1
              className="text-5xl md:text-7xl lg:text-8xl font-black leading-tight"
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.6, type: "spring", bounce: 0.4 }}
            >
              <span className="gradient-text block">Bennie J</span>
              <span className="gradient-text block">Richard</span>
            </motion.h1>

            {/* Professional title with typewriter effect */}
            <motion.h2
              className="text-xl md:text-2xl lg:text-3xl font-semibold mb-6"
              style={{ color: 'var(--color-text-secondary)' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1 }}
            >
              <span className="font-mono text-blue-500">{'<'}</span>
              <span className="mx-2">Full Stack Application Developer</span>
              <span className="font-mono text-blue-500">{'/>'}</span>
            </motion.h2>

            {/* Description with reveal animation */}
            <motion.p
              className="text-lg md:text-xl max-w-3xl mx-auto leading-relaxed"
              style={{ color: 'var(--color-text-tertiary)' }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.2 }}
            >
              Specializing in integrating Salesforce with{' '}
              <span className="gradient-text font-semibold">Generative AI</span>, 
              creating intelligent solutions that transform business processes. 
              Expert in <span className="gradient-text font-semibold">Lightning Web Components, Apex, </span>, 
              <span className="gradient-text font-semibold"> JavaScript, Python, React Framewok</span>, and 
              enterprise-scale development.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.4 }}
            >
              <motion.button
                className="btn-modern group relative overflow-hidden"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onHoverStart={() => setIsHovering(true)}
                onHoverEnd={() => setIsHovering(false)}
              >
                <FiDownload className="inline mr-2" />
                Download Resume
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              </motion.button>

              <motion.button
                className="px-8 py-4 border-2 rounded-lg font-medium transition-all duration-300 relative group"
                style={{ 
                  borderColor: 'var(--color-accent-primary)',
                  color: 'var(--color-accent-primary)'
                }}
                whileHover={{ 
                  scale: 1.05,
                  backgroundColor: 'var(--color-accent-primary)',
                  color: 'white'
                }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                View My Work
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
              </motion.button>
            </motion.div>

            {/* Social Links */}
            <motion.div
              className="flex justify-center space-x-6 pt-8"
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
                  className="p-3 rounded-full glass hover:scale-110 transition-all duration-300 group"
                  whileHover={{ y: -5 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 1.8 + index * 0.1 }}
                >
                  <social.icon 
                    size={20} 
                    className="transition-colors duration-300"
                    style={{ color: 'var(--color-text-primary)' }}
                  />
                </motion.a>
              ))}
            </motion.div>

            {/* Scroll indicator */}
            <motion.div
              className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 2 }}
            >
              <motion.div
                className="flex flex-col items-center space-y-2 cursor-pointer"
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                onClick={() => {
                  document.querySelector('#skills')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <span 
                  className="text-sm font-mono"
                  style={{ color: 'var(--color-text-tertiary)' }}
                >
                  scroll down
                </span>
                <FiArrowDown 
                  size={20} 
                  style={{ color: 'var(--color-accent-primary)' }}
                />
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Floating orbs */}
        <AnimatePresence>
          {isHovering && (
            <motion.div
              className="absolute pointer-events-none"
              style={{
                left: x,
                top: y,
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
            >
              <div className="w-4 h-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-sm opacity-60" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Geometric shapes background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>
    </section>
  );
};

export default ModernHero; 