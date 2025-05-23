"use client"
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { FiBriefcase, FiMapPin, FiCalendar, FiChevronDown, FiChevronUp } from 'react-icons/fi';

// Updated workData structure based on the reference image
const workData = [
  {
    company: 'Deloitte',
    logo: '/images/deloitte.webp',
    duration: 'Full-time · 4 yrs 1 mo',
    roles: [
      {
        title: 'Senior Consultant',
        period: 'May 2024 – Present · 1 yr 1 mo',
        location: 'Bengaluru, Karnataka, India · Hybrid',
        description: 'Designed and Built Custom AI Chatbot using LWC for multilingual conversational record creation, update, and fetch.',
        skills: ['Service Delivery', 'Quality Assurance Standards', '+8 skills'],
        details: [
          'Designed and Built Custom AI Chatbot using LWC, which is multilingual, Conversational Record Creation, Update and Fetch, Context based and Supports all objects and completely Dynamic using Custom Metadata.',
          'Developed US Oregon Driving License Application Portal using Gemini AI for auto-filling form from uploaded documents, Fraud detection of Identity documents and photo validation.'
        ]
      },
      {
        title: 'Salesforce Consultant',
        period: 'May 2021 – May 2024 · 3 yrs 1 mo',
        location: 'Bengaluru, Karnataka, India',
        description: 'Led Development team for Deloitte Accelerator project (nCino), implementing CI/CD using AutoRabbit and developing packaged base applications for small business clients, reducing cost by 25%.',
        skills: ['JavaScript Libraries', 'Front-End Development', '+7 skills'],
        details: [
          'Architected custom base applications for 19 Loan Origination Institutions using nCino Managed Package in Salesforce and its deployment Process.',
          'Designed apex trigger framework, exception/error logging system using platform events, and development using best practices across all Salesforce features.'
        ]
      }
    ]
  },
  {
    company: 'Accenture',
    logo: '/images/acn.webp',
    duration: '4 yrs 6 mos',
    roles: [
      {
        title: 'Salesforce Senior Developer',
        period: 'Nov 2020 – May 2021 · 7 mos',
        location: 'Bengaluru, Karnataka, India',
        description: 'JavaScript Libraries, Front-End Development and +4 skills',
        skills: ['JavaScript Libraries', 'Front-End Development', '+4 skills'],
        details: [
          'Developed a community portal using Lightning web components, integrated with external user validation system using Salesforce authentication patterns (SAML & SSO).',
          'Integrated with multiple external systems using REST & SOAP APIs to archive, backup, and receive data updates.'
        ]
      },
      {
        title: 'Salesforce Developer',
        period: 'May 2018 – Nov 2020 · 2 yrs 7 mos',
        location: 'Bengaluru Area, India',
        description: 'JavaScript Libraries, Front-End Development and +5 skills',
        skills: ['JavaScript Libraries', 'Front-End Development', '+5 skills'],
        details: [
          'Developed a custom module to automatically create PDFs, reducing 80% of user manual activity.',
          'Employed agile development practices, including sandbox environments and Tortoise SVN/Git for branching and merging.'
        ]
      },
      {
        title: 'Salesforce Analyst',
        period: 'Dec 2016 – May 2018 · 1 yr 6 mos',
        location: 'Bengaluru Area, India',
        description: 'Lightning and Lightning Web Components',
        skills: ['Lightning', 'Lightning Web Components'],
        details: [
          'Developed a Mass Email Send interface using lightning components for personalized emails with attachments.',
          'Worked with client stakeholders to define requirements and manage expectations.'
        ]
      }
    ]
  }
];

const Work = () => {
  const [open, setOpen] = useState<{ companyIdx: number; roleIdx: number } | null>(null);

  const handleToggle = (companyIdx: number, roleIdx: number) => {
    if (open && open.companyIdx === companyIdx && open.roleIdx === roleIdx) {
      setOpen(null);
    } else {
      setOpen({ companyIdx, roleIdx });
    }
  };

  return (
    <section id="work" className="section relative overflow-hidden">
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
              <FiBriefcase 
                size={24} 
                style={{ color: 'var(--color-accent-primary)' }}
              />
            </div>
            <span 
              className="font-mono text-sm font-medium tracking-wider uppercase"
              style={{ color: 'var(--color-text-tertiary)' }}
            >
              Experience
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
            Professional{' '}
            <span className="gradient-text">Journey</span>
          </motion.h2>

          <motion.p
            className="text-lg md:text-xl max-w-3xl mx-auto leading-relaxed"
            style={{ color: 'var(--color-text-tertiary)' }}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            My career progression through leading consulting firms, building enterprise solutions and driving digital transformation.
          </motion.p>
        </motion.div>

        {/* Work Experience Timeline */}
        <div className="max-w-4xl mx-auto space-y-8">
          {workData.map((company, cIdx) => (
            <motion.div
              key={cIdx}
              className="glass p-8 rounded-2xl relative overflow-hidden group"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, delay: cIdx * 0.2 }}
            >
              {/* Company Header */}
              <div className="flex items-start gap-6 mb-8">
                {company.logo && (
                  <motion.div
                    className="p-4 glass rounded-xl shrink-0"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Image 
                      src={company.logo} 
                      alt={company.company} 
                      width={48} 
                      height={48} 
                      className="object-contain rounded-lg" 
                    />
                  </motion.div>
                )}
                
                <div className="flex-1">
                  <h3 
                    className="text-2xl md:text-3xl font-heading font-bold mb-2"
                    style={{ color: 'var(--color-text-primary)' }}
                  >
                    {company.company}
                  </h3>
                  <div className="flex items-center gap-2 text-sm">
                    <FiCalendar 
                      size={16} 
                      style={{ color: 'var(--color-accent-primary)' }}
                    />
                    <span style={{ color: 'var(--color-text-secondary)' }}>
                      {company.duration}
                    </span>
                  </div>
                </div>
              </div>

              {/* Roles */}
              <div className="space-y-6">
                {company.roles.map((role, rIdx) => (
                  <motion.div
                    key={rIdx}
                    className="relative"
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: (cIdx * 0.1) + (rIdx * 0.1) }}
                  >
                    <div 
                      className="neomorph p-6 cursor-pointer transition-all duration-300 hover:shadow-xl"
                      onClick={() => handleToggle(cIdx, rIdx)}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h4 
                            className="text-xl font-semibold mb-2"
                            style={{ color: 'var(--color-text-primary)' }}
                          >
                            {role.title}
                          </h4>
                          
                          <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-3">
                            <div className="flex items-center gap-2 text-sm">
                              <FiCalendar 
                                size={14} 
                                style={{ color: 'var(--color-accent-primary)' }}
                              />
                              <span style={{ color: 'var(--color-text-secondary)' }}>
                                {role.period}
                              </span>
                            </div>
                            
                            <div className="flex items-center gap-2 text-sm">
                              <FiMapPin 
                                size={14} 
                                style={{ color: 'var(--color-accent-primary)' }}
                              />
                              <span style={{ color: 'var(--color-text-tertiary)' }}>
                                {role.location}
                              </span>
                            </div>
                          </div>
                          
                          <p 
                            className="text-sm mb-4 leading-relaxed"
                            style={{ color: 'var(--color-text-secondary)' }}
                          >
                            {role.description}
                          </p>
                          
                          {/* Skills */}
                          <div className="flex flex-wrap gap-2 mb-4">
                            {role.skills.map((skill, sIdx) => (
                              <span
                                key={sIdx}
                                className="px-3 py-1 text-xs font-medium rounded-full"
                                style={{
                                  background: 'var(--color-accent-gradient)',
                                  color: 'white'
                                }}
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        <motion.button
                          className="p-2 rounded-lg transition-colors duration-300"
                          style={{ 
                            backgroundColor: 'var(--color-bg-tertiary)',
                            color: 'var(--color-text-primary)'
                          }}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {open && open.companyIdx === cIdx && open.roleIdx === rIdx ? (
                            <FiChevronUp size={20} />
                          ) : (
                            <FiChevronDown size={20} />
                          )}
                        </motion.button>
                      </div>
                      
                      {/* Expandable Details */}
                      <AnimatePresence initial={false}>
                        {open && open.companyIdx === cIdx && open.roleIdx === rIdx && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.4, ease: "easeInOut" }}
                            className="overflow-hidden"
                          >
                            <div 
                              className="pt-4 mt-4 border-t"
                              style={{ borderColor: 'var(--color-border)' }}
                            >
                              <h5 
                                className="font-semibold mb-3"
                                style={{ color: 'var(--color-text-primary)' }}
                              >
                                Key Achievements:
                              </h5>
                              <ul className="space-y-2">
                                {role.details.map((detail, dIdx) => (
                                  <motion.li
                                    key={dIdx}
                                    className="flex items-start gap-3"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.3, delay: dIdx * 0.1 }}
                                  >
                                    <div 
                                      className="w-2 h-2 rounded-full mt-2 shrink-0"
                                      style={{ backgroundColor: 'var(--color-accent-primary)' }}
                                    />
                                    <span 
                                      className="text-sm leading-relaxed"
                                      style={{ color: 'var(--color-text-secondary)' }}
                                    >
                                      {detail}
                                    </span>
                                  </motion.li>
                                ))}
                              </ul>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Decorative gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            </motion.div>
          ))}
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

export default Work;