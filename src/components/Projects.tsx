"use client"
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import Image from 'next/image';
import { FiChevronLeft, FiChevronRight, FiExternalLink, FiGithub, FiCode } from 'react-icons/fi';

// --- REPLACE WITH YOUR ACTUAL PROJECTS ---
const projectData = [
  {
    title: 'Custom LWC Quote Calculator',
    description: 'Developed a complex Lightning Web Component for sales teams to generate quotes with dynamic pricing rules and product configurations.',
    imageUrl: '/images/about04.png',
    tags: ['LWC', 'Apex', 'Sales Cloud', 'JavaScript'],
    liveUrl: '#',
    githubUrl: 'https://github.com/yourusername/project-repo',
    color: 'from-blue-500 to-cyan-500',
    accentColor: 'blue'
  },
  {
    title: 'Service Cloud Chatbot Integration',
    description: 'Integrated an Einstein Bot with external knowledge base API for automated customer support case deflection.',
    imageUrl: '/images/about04.png',
    tags: ['Service Cloud', 'Einstein Bots', 'Apex', 'REST API'],
    liveUrl: '#',
    githubUrl: 'https://github.com/yourusername/project-repo',
    color: 'from-purple-500 to-pink-500',
    accentColor: 'purple'
  },
   {
    title: 'Community Portal Enhancement',
    description: 'Redesigned and implemented new features for a customer community portal using Experience Cloud and custom components.',
    imageUrl: '/images/about04.png',
    tags: ['Experience Cloud', 'LWC', 'Apex', 'CSS'],
    liveUrl: '#',
    githubUrl: 'https://github.com/yourusername/another-repo',
    color: 'from-orange-500 to-red-500',
    accentColor: 'orange'
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
               Portfolio
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