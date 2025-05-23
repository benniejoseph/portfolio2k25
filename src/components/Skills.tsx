"use client"
import React from 'react';
import { motion } from 'framer-motion';
import {
  FaCode, FaCogs, FaCloud, FaDatabase, FaGitAlt
} from 'react-icons/fa';
import { SiSalesforce, SiLightning, SiHeroku, SiJavascript, SiReact, SiNodedotjs, SiHtml5, SiGit, SiTailwindcss } from 'react-icons/si';

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
  { name: 'Apex', icon: <FaCode size={40} />, color: iconColors.salesforce.apex },
  { name: 'LWC', icon: <SiLightning size={40} />, color: iconColors.salesforce.lwc },
  { name: 'Aura Components', icon: <SiLightning size={40} />, color: iconColors.salesforce.aura },
  { name: 'Visualforce', icon: <FaCode size={40} />, color: iconColors.salesforce.visualforce },
  { name: 'SOQL & SOSL', icon: <FaDatabase size={40} />, color: iconColors.salesforce.soql },
  { name: 'Flows & Process Builder', icon: <FaCogs size={40} />, color: iconColors.salesforce.flows },
  { name: 'Sales Cloud', icon: <SiSalesforce size={40} />, color: iconColors.salesforce.salesCloud },
  { name: 'Service Cloud', icon: <FaCloud size={40} />, color: iconColors.salesforce.serviceCloud },
  { name: 'Integration (REST/SOAP)', icon: <FaCloud size={40} />, color: iconColors.salesforce.integration },
  { name: 'Platform Events', icon: <FaCogs size={40} />, color: iconColors.salesforce.platformEvents },
  { name: 'Salesforce DX & CLI', icon: <FaGitAlt size={40} />, color: iconColors.salesforce.sfdx },
];

const webSkills = [
  { name: 'JavaScript (ES6+)', icon: <SiJavascript size={40} />, color: iconColors.web.javascript },
  { name: 'React', icon: <SiReact size={40} />, color: iconColors.web.react },
  { name: 'Node.js', icon: <SiNodedotjs size={40} />, color: iconColors.web.nodejs },
  { name: 'HTML5', icon: <SiHtml5 size={40} />, color: iconColors.web.html5 },
  { name: 'CSS3 / Tailwind', icon: <SiTailwindcss size={40} />, color: iconColors.web.tailwind },
  { name: 'Git & GitHub', icon: <SiGit size={40} />, color: iconColors.web.git },
  { name: 'Heroku', icon: <SiHeroku size={40} />, color: iconColors.web.heroku },
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
    <section id="skills" className="section">
      <div className="container text-center">
        <motion.h2
          className="section-heading mb-12 bg-gradient-to-r from-blue-600 to-sky-500 bg-clip-text text-transparent"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6 }}
        >
          My Skillset
        </motion.h2>

        {/* Salesforce Skills */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className='mb-16'
        >
          <h3 className="text-2xl font-semibold text-secondary mb-8">Salesforce Platform</h3>
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            transition={{ staggerChildren: 0.1 }}
          >
            {salesforceSkills.map((skill, index) => (
              <motion.div
                key={index}
                className="flex flex-col items-center p-6 glass-card hover:scale-105 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20"
                variants={cardVariants}
                style={{
                  background: `linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.1) 100%)`,
                  border: '1px solid rgba(255,255,255,0.1)'
                }}
              >
                <div className="mb-3" style={{ color: skill.color }}>{skill.icon}</div>
                <span className="text-lightText text-sm md:text-base font-medium">{skill.name}</span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Web Development & Other Skills */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h3 className="text-2xl font-semibold text-secondary mb-8">Web Technologies & Tools</h3>
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            transition={{ staggerChildren: 0.1 }}
          >
            {webSkills.map((skill, index) => (
              <motion.div
                key={index}
                className="flex flex-col items-center p-6 glass-card hover:scale-105 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20"
                variants={cardVariants}
                style={{
                  background: `linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.1) 100%)`,
                  border: '1px solid rgba(255,255,255,0.1)'
                }}
              >
                <div className="mb-3" style={{ color: skill.color }}>{skill.icon}</div>
                <span className="text-lightText text-sm md:text-base font-medium">{skill.name}</span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Skills;