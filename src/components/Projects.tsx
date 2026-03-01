"use client"
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import Image from 'next/image';
import { FiChevronLeft, FiChevronRight, FiExternalLink, FiGithub, FiCode } from 'react-icons/fi';

const projectData = [
  {
    title: 'TradeTaper – Trading Journal Platform',
    description: 'Production-grade full-stack trading journal with a NestJS backend, Next.js frontend & admin portal, real-time WebSocket data feeds, and PostgreSQL — deployed via Docker and CI/CD GitHub Actions (523 commits). Modular monorepo with auth, market-data ingestion, trade strategy modules, and automated seed/migration workflows.',
    imageUrl: '/images/about04.png',
    tags: ['TypeScript', 'NestJS', 'Next.js', 'WebSocket', 'PostgreSQL', 'Docker'],
    liveUrl: '#',
    githubUrl: 'https://github.com/benniejoseph/tradetaper',
    color: 'from-green-500 to-emerald-500',
    accentColor: 'green'
  },
  {
    title: 'Audiolyse – AI Call Coaching Platform',
    description: 'Bulk call transcription and AI coaching web app using Next.js 14 App Router and Google Gemini 2.5 Pro. Processes audio files in parallel generating transcriptions, meeting minutes, sentiment analysis, and agent performance scores (1–100). Supports English, Hindi & Hinglish with automatic language detection.',
    imageUrl: '/images/about04.png',
    tags: ['Next.js 14', 'Gemini 2.5 Pro', 'Supabase', 'Node.js', 'TypeScript'],
    liveUrl: '#',
    githubUrl: 'https://github.com/benniejoseph/audiolyse',
    color: 'from-purple-500 to-pink-500',
    accentColor: 'purple'
  },
  {
    title: 'Doreish – Autonomous AI Agent Ops Platform',
    description: 'Multi-agent orchestration platform serving as a single control plane for SaaS operations — agents defined as autonomous "employees" execute tasks across dev, support, marketing and sales using OpenAI APIs and vector search (pgvector). Full cloud infra via Terraform, async queuing via Upstash Redis + QStash.',
    imageUrl: '/images/about04.png',
    tags: ['TypeScript', 'Next.js', 'Postgres', 'Redis', 'Terraform', 'OpenAI'],
    liveUrl: '#',
    githubUrl: 'https://github.com/benniejoseph/doreish',
    color: 'from-blue-500 to-cyan-500',
    accentColor: 'blue'
  },
  {
    title: 'Agent Assemble – LangGraph Agentic Platform',
    description: 'LangGraph and RAG-based agentic platform enabling users to define workflows in natural language. Spawns AI agents to autonomously execute API-based tools, scheduling, and multi-step business processes — built at Deloitte to automate enterprise operations.',
    imageUrl: '/images/about04.png',
    tags: ['LangGraph', 'RAG', 'Python', 'OpenAI', 'REST APIs'],
    liveUrl: '#',
    githubUrl: '#',
    color: 'from-orange-500 to-amber-500',
    accentColor: 'orange'
  },
  {
    title: 'Mona – Real-Time AI Meeting Assistant',
    description: 'Real-time AI voice assistant integrated into MS Teams and Zoom using Twilio, LiveKit, and OpenAI Realtime API. Automates call transcription, meeting minutes generation, and parallel task execution (emails, calendar reminders) during live meetings.',
    imageUrl: '/images/about04.png',
    tags: ['Twilio', 'LiveKit', 'OpenAI Realtime', 'MS Teams SDK', 'Zoom SDK'],
    liveUrl: '#',
    githubUrl: '#',
    color: 'from-teal-500 to-green-500',
    accentColor: 'teal'
  },
  {
    title: 'Cenithos – AI-Powered Cross-Platform App',
    description: 'Cross-platform application with mobile via Flutter, web via TypeScript, and backend via Python — AI integration with Firebase/Firestore data layer. Automated security vulnerability scanning, linting, test coverage, and performance hotspot reports built into the pipeline.',
    imageUrl: '/images/about04.png',
    tags: ['Flutter', 'Python', 'TypeScript', 'Firebase', 'REST APIs'],
    liveUrl: '#',
    githubUrl: 'https://github.com/benniejoseph/cenithos',
    color: 'from-red-500 to-rose-500',
    accentColor: 'red'
  },
];

const Projects = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-150, 0, 150], [-15, 0, 15]);

  const handleNext = () => {
    setDirection(1);
    setActiveIndex((prev) => (prev + 1) % projectData.length);
  };

  const handlePrev = () => {
    setDirection(-1);
    setActiveIndex((prev) => (prev - 1 + projectData.length) % projectData.length);
  };

  const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 50;
    if (info.offset.x > threshold) {
      handlePrev();
    } else if (info.offset.x < -threshold) {
      handleNext();
    }
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.8,
      rotateY: direction > 0 ? 20 : -20,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      rotateY: 0,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
      scale: 0.8,
      rotateY: direction < 0 ? 20 : -20,
    })
  };

  // Auto-advance slides (optional)
  useEffect(() => {
    const timer = setInterval(() => {
      handleNext();
    }, 8000); // Change slide every 8 seconds

    return () => clearInterval(timer);
  }, []);

  return (
    <section id="projects" className="section relative overflow-hidden">
      <div className="container">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="inline-flex items-center gap-3 mb-6"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="p-3 glass rounded-xl">
              <FiCode 
                size={24} 
                style={{ color: 'var(--color-accent-primary)' }}
              />
            </div>
            <span 
              className="font-mono text-sm font-medium tracking-wider uppercase"
              style={{ color: 'var(--color-text-tertiary)' }}
            >
               Projects
            </span>
          </motion.div>

          <motion.h2
            className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-6"
            style={{ color: 'var(--color-text-primary)' }}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            Featured{' '}
            <span className="gradient-text">Projects</span>
          </motion.h2>

          <motion.p
            className="text-lg md:text-xl max-w-3xl mx-auto leading-relaxed"
            style={{ color: 'var(--color-text-tertiary)' }}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            A collection of projects showcasing my expertise in Salesforce development, modern web technologies, and innovative solutions.
          </motion.p>
        </motion.div>

        {/* Projects Carousel */}
        <div className="relative max-w-6xl mx-auto">
          {/* Navigation Arrows */}
          <motion.button
            className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-30 p-3 md:p-4 glass rounded-full hover:scale-110 transition-all duration-300"
            style={{ color: 'var(--color-text-primary)' }}
            onClick={handlePrev}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <FiChevronLeft size={20} />
          </motion.button>

          <motion.button
            className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-30 p-3 md:p-4 glass rounded-full hover:scale-110 transition-all duration-300"
            style={{ color: 'var(--color-text-primary)' }}
            onClick={handleNext}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <FiChevronRight size={20} />
          </motion.button>

          {/* Main Project Card */}
          <div className="relative h-[500px] md:h-[600px] mx-4 md:mx-16">
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={activeIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.3 },
                  scale: { duration: 0.3 },
                  rotateY: { duration: 0.3 }
                }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.1}
                onDragEnd={handleDragEnd}
                style={{ x, rotate }}
                className="absolute inset-0 cursor-grab active:cursor-grabbing"
              >
                <div className="glass rounded-2xl h-full overflow-hidden relative group">
                  {/* Background Image */}
                  <div className="absolute inset-0">
                    <Image
                      src={projectData[activeIndex].imageUrl}
                      alt={projectData[activeIndex].title}
                      fill
                      style={{ objectFit: 'cover' }}
                      className="w-full h-full transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1000px"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
                  </div>

                  {/* Content */}
                  <div className="relative z-10 h-full flex flex-col justify-end p-6 md:p-8 lg:p-10">
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {projectData[activeIndex].tags.map((tag: string) => (
                          <span
                            key={tag}
                            className="px-3 py-1 text-xs md:text-sm font-medium rounded-full backdrop-blur-sm"
                            style={{
                              backgroundColor: 'var(--color-accent-primary)',
                              color: 'white'
                            }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Title */}
                      <h3 className="text-2xl md:text-3xl lg:text-4xl font-heading font-bold text-white mb-4">
                        {projectData[activeIndex].title}
                      </h3>

                      {/* Description */}
                      <p className="text-white/90 text-sm md:text-base lg:text-lg mb-6 leading-relaxed max-w-2xl">
                        {projectData[activeIndex].description}
                      </p>

                      {/* Action Buttons */}
                      <div className="flex flex-col sm:flex-row gap-3">
                        {projectData[activeIndex].liveUrl && (
                          <motion.a
                            href={projectData[activeIndex].liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-black rounded-lg font-semibold hover:bg-white/90 transition-all duration-300 text-sm md:text-base"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <FiExternalLink size={18} />
                            Live Demo
                          </motion.a>
                        )}
                        
                        {projectData[activeIndex].githubUrl && (
                          <motion.a
                            href={projectData[activeIndex].githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-black transition-all duration-300 text-sm md:text-base"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <FiGithub size={18} />
                            View Code
                          </motion.a>
                        )}
                      </div>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Progress Indicators */}
          <div className="flex justify-center space-x-2 mt-8">
            {projectData.map((_, index) => (
              <motion.button
                key={index}
                className="w-3 h-3 rounded-full transition-all duration-300"
                style={{
                  backgroundColor: index === activeIndex 
                    ? 'var(--color-accent-primary)' 
                    : 'var(--color-text-tertiary)'
                }}
                onClick={() => {
                  setDirection(index > activeIndex ? 1 : -1);
                  setActiveIndex(index);
                }}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 + index * 0.1 }}
              />
            ))}
          </div>

          {/* Project Counter */}
          <motion.div
            className="text-center mt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <span 
              className="text-sm font-mono"
              style={{ color: 'var(--color-text-tertiary)' }}
            >
              {String(activeIndex + 1).padStart(2, '0')} / {String(projectData.length).padStart(2, '0')}
            </span>
          </motion.div>

          {/* Swipe Instruction (Mobile) */}
          <motion.div
            className="block md:hidden text-center mt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            <span 
              className="text-xs font-mono"
              style={{ color: 'var(--color-text-tertiary)' }}
            >
              ← Swipe to navigate →
            </span>
          </motion.div>
        </div>
      </div>

      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/4 -right-32 w-64 h-64 rounded-full opacity-10"
          style={{ 
            background: 'var(--color-accent-gradient)',
            filter: 'blur(40px)'
          }}
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute bottom-1/4 -left-32 w-48 h-48 rounded-full opacity-10"
          style={{ 
            background: 'var(--color-accent-gradient)',
            filter: 'blur(40px)'
          }}
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
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

export default Projects;