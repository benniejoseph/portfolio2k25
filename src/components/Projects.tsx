"use client"
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

// --- REPLACE WITH YOUR ACTUAL PROJECTS ---
const projectData = [
  {
    title: 'Custom LWC Quote Calculator',
    description: 'Developed a complex Lightning Web Component for sales teams to generate quotes with dynamic pricing rules and product configurations.',
    imageUrl: '/images/about04.png', // <-- Add images to public/images/
    tags: ['LWC', 'Apex', 'Sales Cloud', 'JavaScript'],
    liveUrl: '#', // Add live link if available
    githubUrl: 'https://github.com/yourusername/project-repo', // Add repo link
    color: 'from-blue-500 to-cyan-500',
    accentColor: 'blue'
  },
  {
    title: 'Service Cloud Chatbot Integration',
    description: 'Integrated an Einstein Bot with external knowledge base API for automated customer support case deflection.',
    imageUrl: '/images/about04.png', // <-- Add images to public/images/
    tags: ['Service Cloud', 'Einstein Bots', 'Apex', 'REST API'],
    liveUrl: '#',
    githubUrl: 'https://github.com/yourusername/project-repo',
    color: 'from-purple-500 to-pink-500',
    accentColor: 'purple'
  },
   {
    title: 'Community Portal Enhancement',
    description: 'Redesigned and implemented new features for a customer community portal using Experience Cloud and custom components.',
    imageUrl: '/images/about04.png', // <-- Add images to public/images/
    tags: ['Experience Cloud', 'LWC', 'Apex', 'CSS'],
    liveUrl: '#',
    githubUrl: 'https://github.com/yourusername/another-repo',
    color: 'from-orange-500 to-red-500',
    accentColor: 'orange'
  },
  // Add more projects...
];
// --- END OF REPLACE SECTION ---

interface Project {
  title: string;
  description: string;
  imageUrl: string;
  tags: string[];
  liveUrl?: string | null;
  githubUrl?: string | null;
  color?: string;
  accentColor?: string;
}

const Projects = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState<number>(0);

  const getAdjacentIndex = (index: number, offset: number) => {
    return (index + offset + projectData.length) % projectData.length;
  };

  const handlePrev = () => {
    setDirection(-1);
    setActiveIndex((prev) => (prev - 1 + projectData.length) % projectData.length);
  };

  const handleNext = () => {
    setDirection(1);
    setActiveIndex((prev) => (prev + 1) % projectData.length);
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.95
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.95
    })
  };

  // Helper for preview overlay
  const PreviewOverlay = ({ project, align }: { project: Project; align: 'left' | 'right' }) => (
    <div className={`absolute inset-0 bg-black/50 flex flex-col justify-end ${align === 'left' ? 'items-start pl-3' : 'items-end pr-3'} pb-4`}>
      <span className="text-white text-lg font-bold mb-1 drop-shadow-lg max-w-[90%] truncate">{project.title}</span>
      <div className="flex flex-wrap gap-1 mb-1">
        {project.tags.map((tag: string) => (
          <span key={tag} className="px-2 py-0.5 bg-white/20 rounded-full text-xs text-white font-medium shadow">{tag}</span>
        ))}
      </div>
      <span className="text-white text-2xl font-bold">{align === 'left' ? '←' : '→'}</span>
    </div>
  );

  return (
    <section id="projects" className="section relative flex flex-col items-center justify-center min-h-[80vh] py-20 bg-transparent">
      {/* Heading */}
      <div className="w-full max-w-4xl mx-auto text-center mb-12">
        <motion.h2
          className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-sky-500 bg-clip-text text-transparent"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6 }}
        >
          Featured Projects
        </motion.h2>
        <motion.div
          className="h-1 w-20 bg-gradient-to-r from-blue-600 to-sky-500 mx-auto mt-4 rounded-full"
          initial={{ width: 0 }}
          whileInView={{ width: 80 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        />
      </div>
      {/* Carousel */}
      <div className="relative w-full max-w-6xl mx-auto flex items-center justify-center" style={{ minHeight: 500 }}>
        {/* Left Preview */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 z-20 flex items-center h-[70%]">
          <motion.div
            className="w-48 h-full rounded-xl overflow-hidden shadow-lg cursor-pointer group"
            onClick={handlePrev}
            whileHover={{ scale: 1.04 }}
            initial={{ opacity: 0.7 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="relative w-full h-full">
              <Image
                src={projectData[getAdjacentIndex(activeIndex, -1)].imageUrl}
                alt={projectData[getAdjacentIndex(activeIndex, -1)].title}
                fill
                style={{ objectFit: 'cover' }}
                className="w-full h-full"
                sizes="(max-width: 768px) 100vw, 384px"
                priority={false}
              />
              <PreviewOverlay project={projectData[getAdjacentIndex(activeIndex, -1)]} align="left" />
            </div>
          </motion.div>
        </div>

        {/* Main Project Card - glassmorphism, gradient overlays, modern card styling */}
        <div className="relative w-full max-w-3xl mx-auto z-30">
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
                opacity: { duration: 0.2 },
                scale: { duration: 0.2 }
              }}
              className="relative w-full h-[420px] md:h-[500px] rounded-2xl overflow-hidden shadow-2xl flex items-center justify-center"
            >
              <div className="relative w-full h-full">
                <Image
                  src={projectData[activeIndex].imageUrl}
                  alt={projectData[activeIndex].title}
                  fill
                  style={{ objectFit: 'cover' }}
                  className="w-full h-full"
                  sizes="(max-width: 768px) 100vw, 768px"
                  priority
                />
                {/* Glassmorphism and gradient overlays */}
                <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/40 to-transparent" />
                <div className="absolute inset-0 backdrop-blur-md bg-white/10" />
                <div className="relative z-10 flex flex-col items-center justify-center h-full w-full px-6 text-center">
                  <h3 className="text-3xl md:text-4xl font-extrabold text-white mb-4 drop-shadow-lg">
                    {projectData[activeIndex].title}
                  </h3>
                  <p className="text-white/90 text-lg md:text-xl mb-6 max-w-2xl mx-auto drop-shadow">
                    {projectData[activeIndex].description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-6 justify-center">
                    {projectData[activeIndex].tags.map((tag: string) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm text-white font-medium shadow"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  {projectData[activeIndex].liveUrl && (
                    <a
                      href={projectData[activeIndex].liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-700 hover:to-sky-600 text-white font-semibold rounded-lg shadow-lg transition-colors text-lg"
                    >
                      Live Demo
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right Preview */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 z-20 flex items-center h-[70%]">
          <motion.div
            className="w-48 h-full rounded-xl overflow-hidden shadow-lg cursor-pointer group"
            onClick={handleNext}
            whileHover={{ scale: 1.04 }}
            initial={{ opacity: 0.7 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="relative w-full h-full">
              <Image
                src={projectData[getAdjacentIndex(activeIndex, 1)].imageUrl}
                alt={projectData[getAdjacentIndex(activeIndex, 1)].title}
                fill
                style={{ objectFit: 'cover' }}
                className="w-full h-full"
                sizes="(max-width: 768px) 100vw, 384px"
                priority={false}
              />
              <PreviewOverlay project={projectData[getAdjacentIndex(activeIndex, 1)]} align="right" />
            </div>
          </motion.div>
        </div>

        {/* Project Counter */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-40">
          <div className="text-white font-medium text-lg bg-black/40 px-4 py-1 rounded-full">
            {activeIndex + 1} / {projectData.length}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Projects;