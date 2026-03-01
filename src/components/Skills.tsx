"use client"
import React from 'react';
import { motion } from 'framer-motion';
import {
  FaCode, FaCogs, FaCloud, FaDatabase, FaGitAlt, FaPython, FaDocker, FaAws, FaBrain, FaRobot
} from 'react-icons/fa';
import {
  SiSalesforce, SiLightning, SiJavascript, SiReact, SiNodedotjs,
  SiTypescript, SiNextdotjs, SiTailwindcss, SiGit, SiPostgresql, SiOpenai
} from 'react-icons/si';
import { FiUser, FiCode as FiCodeIcon, FiCpu, FiTool, FiGitBranch, FiZap, FiSearch } from 'react-icons/fi';
// FaBrain and FaRobot are used below for AI skills

const salesforceSkills = [
  { name: 'Apex', icon: <FaCode size={32} />, color: '#00A1E0' },
  { name: 'LWC', icon: <SiLightning size={32} />, color: '#FFB75D' },
  { name: 'SOQL & SOSL', icon: <FaDatabase size={32} />, color: '#00A1E0' },
  { name: 'Salesforce Flows', icon: <FaCogs size={32} />, color: '#00A1E0' },
  { name: 'Service Cloud', icon: <FaCloud size={32} />, color: '#00A1E0' },
  { name: 'OmniScript', icon: <SiSalesforce size={32} />, color: '#00A1E0' },
  { name: 'Platform Events', icon: <FaCogs size={32} />, color: '#00A1E0' },
  { name: 'REST / SOAP APIs', icon: <FaCloud size={32} />, color: '#00A1E0' },
  { name: 'Salesforce DX', icon: <FaGitAlt size={32} />, color: '#00A1E0' },
  { name: 'Sales Cloud', icon: <SiSalesforce size={32} />, color: '#00A1E0' },
];

const webSkills = [
  { name: 'TypeScript', icon: <SiTypescript size={32} />, color: '#3178C6' },
  { name: 'JavaScript (ES6+)', icon: <SiJavascript size={32} />, color: '#F7DF1E' },
  { name: 'Python', icon: <FaPython size={32} />, color: '#3776AB' },
  { name: 'React.js', icon: <SiReact size={32} />, color: '#61DAFB' },
  { name: 'Next.js', icon: <SiNextdotjs size={32} />, color: '#FFFFFF' },
  { name: 'Node.js', icon: <SiNodedotjs size={32} />, color: '#339933' },
  { name: 'PostgreSQL', icon: <SiPostgresql size={32} />, color: '#336791' },
  { name: 'CSS / Tailwind', icon: <SiTailwindcss size={32} />, color: '#06B6D4' },
  { name: 'Git & GitHub', icon: <SiGit size={32} />, color: '#F05032' },
  { name: 'Docker', icon: <FaDocker size={32} />, color: '#2496ED' },
];

const aiSkills = [
  { name: 'OpenAI / GPT', icon: <SiOpenai size={32} />, color: '#10a37f' },
  { name: 'Google Gemini', icon: <FaRobot size={32} />, color: '#4285F4' },
  { name: 'LangGraph', icon: <FiGitBranch size={32} />, color: '#1C7C3C' },
  { name: 'RAG Pipelines', icon: <FiSearch size={32} />, color: '#9C27B0' },
  { name: 'AI Agents', icon: <FaBrain size={32} />, color: '#FF6B35' },
  { name: 'Prompt Engineering', icon: <FaCode size={32} />, color: '#00BCD4' },
  { name: 'NLP', icon: <FiZap size={32} />, color: '#4CAF50' },
  { name: 'Computer Vision', icon: <FiCpu size={32} />, color: '#FF5722' },
  { name: 'Twilio / LiveKit', icon: <FiTool size={32} />, color: '#F22F46' },
  { name: 'AWS / CI/CD', icon: <FaAws size={32} />, color: '#FF9900' },
];

const cardVariants = {
  hidden: { y: 50, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.5, ease: "easeOut" }
  }
};

const SkillSection = ({
  title,
  skills,
  icon,
  delay = 0,
}: {
  title: string;
  skills: { name: string; icon: React.ReactNode; color: string }[];
  icon: React.ReactNode;
  delay?: number;
}) => (
  <motion.div
    initial={{ opacity: 0 }}
    whileInView={{ opacity: 1 }}
    viewport={{ once: true, amount: 0.2 }}
    transition={{ duration: 0.5, delay }}
    className="mb-16"
  >
    <div className="flex items-center gap-3 mb-8 justify-center">
      <div className="p-2 glass rounded-lg">{icon}</div>
      <h3 className="text-2xl font-heading font-semibold" style={{ color: 'var(--color-text-primary)' }}>
        {title}
      </h3>
    </div>

    <motion.div
      className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      transition={{ staggerChildren: 0.08 }}
    >
      {skills.map((skill, index) => (
        <motion.div
          key={index}
          className="glass p-4 md:p-6 rounded-xl hover:scale-105 transition-all duration-300 text-center group"
          variants={cardVariants}
          whileHover={{ y: -5 }}
        >
          <div className="mb-3 transition-transform duration-300 group-hover:scale-110 flex justify-center" style={{ color: skill.color }}>
            {skill.icon}
          </div>
          <span className="text-xs md:text-sm font-medium leading-tight block" style={{ color: 'var(--color-text-secondary)' }}>
            {skill.name}
          </span>
        </motion.div>
      ))}
    </motion.div>
  </motion.div>
);

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
              <FiUser size={24} style={{ color: 'var(--color-accent-primary)' }} />
            </div>
            <span className="font-mono text-sm font-medium tracking-wider uppercase" style={{ color: 'var(--color-text-tertiary)' }}>
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
            From enterprise Salesforce architecture to Generative AI pipelines — full-stack expertise across the modern tech landscape.
          </motion.p>
        </motion.div>

        <SkillSection
          title="Salesforce Platform"
          skills={salesforceSkills}
          icon={<SiSalesforce size={20} style={{ color: '#00A1E0' }} />}
          delay={0.2}
        />

        <SkillSection
          title="Full-Stack Development"
          skills={webSkills}
          icon={<FiCodeIcon size={20} style={{ color: 'var(--color-accent-primary)' }} />}
          delay={0.3}
        />

        <SkillSection
          title="Generative AI & Agentic Systems"
          skills={aiSkills}
          icon={<FiCpu size={20} style={{ color: '#10a37f' }} />}
          delay={0.4}
        />
      </div>

      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/4 -right-32 w-64 h-64 rounded-full opacity-10"
          style={{ background: 'var(--color-accent-gradient)', filter: 'blur(40px)' }}
          animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute bottom-1/4 -left-32 w-48 h-48 rounded-full opacity-10"
          style={{ background: 'var(--color-accent-gradient)', filter: 'blur(40px)' }}
          animate={{ scale: [1.2, 1, 1.2], rotate: [360, 180, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        />
      </div>
    </section>
  );
};

export default Skills;
