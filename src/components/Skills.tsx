"use client"
import React from 'react';
import { motion } from 'framer-motion';
import {
  FaCode, FaCogs, FaCloud, FaDatabase, FaGitAlt
} from 'react-icons/fa';
import { SiSalesforce, SiLightning, SiHeroku, SiJavascript, SiReact, SiNodedotjs, SiHtml5, SiGit, SiTailwindcss } from 'react-icons/si';
import { FiUser, FiCode as FiCodeIcon } from 'react-icons/fi';

// Color mapping for icons
const iconColors = {
  salesforce: {
    apex: '#00A1E0',
    lwc: '#FFB75D',
    aura: '#FFB75D',
    visualforce: '#00A1E0',
    soql: '#00A1E0',
    flows: '#00A1E0',
    salesCloud: '#00A1E0',
    serviceCloud: '#00A1E0',
    integration: '#00A1E0',
    platformEvents: '#00A1E0',
    sfdx: '#00A1E0'
  },
  web: {
    javascript: '#F7DF1E',
    react: '#61DAFB',
    nodejs: '#339933',
    html5: '#E34F26',
    css3: '#1572B6',
    git: '#F05032',
    heroku: '#430098',
    tailwind: '#06B6D4'
  }
};

const salesforceSkills = [
  { name: 'Apex', icon: <FaCode size={32} />, color: iconColors.salesforce.apex },
  { name: 'LWC', icon: <SiLightning size={32} />, color: iconColors.salesforce.lwc },
  { name: 'Aura Components', icon: <SiLightning size={32} />, color: iconColors.salesforce.aura },
  { name: 'Visualforce', icon: <FaCode size={32} />, color: iconColors.salesforce.visualforce },
  { name: 'SOQL & SOSL', icon: <FaDatabase size={32} />, color: iconColors.salesforce.soql },
  { name: 'Flows & Process Builder', icon: <FaCogs size={32} />, color: iconColors.salesforce.flows },
  { name: 'Sales Cloud', icon: <SiSalesforce size={32} />, color: iconColors.salesforce.salesCloud },
  { name: 'Service Cloud', icon: <FaCloud size={32} />, color: iconColors.salesforce.serviceCloud },
  { name: 'Integration (REST/SOAP)', icon: <FaCloud size={32} />, color: iconColors.salesforce.integration },
  { name: 'Platform Events', icon: <FaCogs size={32} />, color: iconColors.salesforce.platformEvents },
  { name: 'Salesforce DX & CLI', icon: <FaGitAlt size={32} />, color: iconColors.salesforce.sfdx },
];

const webSkills = [
  { name: 'JavaScript (ES6+)', icon: <SiJavascript size={32} />, color: iconColors.web.javascript },
  { name: 'React', icon: <SiReact size={32} />, color: iconColors.web.react },
  { name: 'Node.js', icon: <SiNodedotjs size={32} />, color: iconColors.web.nodejs },
  { name: 'HTML5', icon: <SiHtml5 size={32} />, color: iconColors.web.html5 },
  { name: 'CSS3 / Tailwind', icon: <SiTailwindcss size={32} />, color: iconColors.web.tailwind },
  { name: 'Git & GitHub', icon: <SiGit size={32} />, color: iconColors.web.git },
  { name: 'Heroku', icon: <SiHeroku size={32} />, color: iconColors.web.heroku },
];

const cardVariants = {
  hidden: { y: 50, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.5, ease: "easeOut" }
  }
};

const Skills = () => {
  return (
    <section id="skills" className="section relative overflow-hidden">
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
              <FiUser 
                size={24} 
                style={{ color: 'var(--color-accent-primary)' }}
              />
            </div>
            <span 
              className="font-mono text-sm font-medium tracking-wider uppercase"
              style={{ color: 'var(--color-text-tertiary)' }}
            >
               Skills
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
            Technical{' '}
            <span className="gradient-text">Expertise</span>
          </motion.h2>

          <motion.p
            className="text-lg md:text-xl max-w-3xl mx-auto leading-relaxed"
            style={{ color: 'var(--color-text-tertiary)' }}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Proficient in Salesforce development, modern web technologies, and enterprise-scale application development.
          </motion.p>
        </motion.div>

        {/* Salesforce Skills */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className='mb-16'
        >
          <div className="flex items-center gap-3 mb-8 justify-center">
            <div className="p-2 glass rounded-lg">
              <SiSalesforce size={20} style={{ color: '#00A1E0' }} />
            </div>
            <h3 
              className="text-2xl font-heading font-semibold"
              style={{ color: 'var(--color-text-primary)' }}
            >
              Salesforce Platform
            </h3>
          </div>
          
          <motion.div
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            transition={{ staggerChildren: 0.1 }}
          >
            {salesforceSkills.map((skill, index) => (
              <motion.div
                key={index}
                className="glass p-4 md:p-6 rounded-xl hover:scale-105 transition-all duration-300 text-center group"
                variants={cardVariants}
                whileHover={{ y: -5 }}
              >
                <div className="mb-3 transition-transform duration-300 group-hover:scale-110" style={{ color: skill.color }}>
                  {skill.icon}
                </div>
                <span 
                  className="text-xs md:text-sm font-medium leading-tight block"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  {skill.name}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Web Development Skills */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="flex items-center gap-3 mb-8 justify-center">
            <div className="p-2 glass rounded-lg">
              <FiCodeIcon size={20} style={{ color: 'var(--color-accent-primary)' }} />
            </div>
            <h3 
              className="text-2xl font-heading font-semibold"
              style={{ color: 'var(--color-text-primary)' }}
            >
              Web Technologies & Tools
            </h3>
          </div>
          
          <motion.div
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            transition={{ staggerChildren: 0.1 }}
          >
            {webSkills.map((skill, index) => (
              <motion.div
                key={index}
                className="glass p-4 md:p-6 rounded-xl hover:scale-105 transition-all duration-300 text-center group"
                variants={cardVariants}
                whileHover={{ y: -5 }}
              >
                <div className="mb-3 transition-transform duration-300 group-hover:scale-110" style={{ color: skill.color }}>
                  {skill.icon}
                </div>
                <span 
                  className="text-xs md:text-sm font-medium leading-tight block"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  {skill.name}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
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

export default Skills;