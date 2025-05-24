"use client"
import React from 'react';
import { motion } from 'framer-motion';
import { SiSalesforce } from 'react-icons/si';
import { FiAward } from 'react-icons/fi';

const certifications = [
  {
    name: 'Salesforce Certified Application Architect',
    description: 'Including Supporting 6x Salesforce certification under Application Domain',
    icon: <SiSalesforce size={32} />,
    color: '#00A1E0',
    gradient: 'from-blue-600 to-sky-500'
  },
  {
    name: 'Salesforce Certified Sharing and Visibility Architect',
    icon: <SiSalesforce size={32} />,
    color: '#00A1E0',
    gradient: 'from-blue-600 to-sky-500'
  },
  {
    name: 'Salesforce Certified Data Architect',
    icon: <SiSalesforce size={32} />,
    color: '#00A1E0',
    gradient: 'from-blue-600 to-sky-500'
  },
  {
    name: 'Salesforce Certified Platform Developer I',
    icon: <SiSalesforce size={32} />,
    color: '#00A1E0',
    gradient: 'from-blue-600 to-sky-500'
  },
  {
    name: 'Salesforce Certified Platform Developer II',
    icon: <SiSalesforce size={32} />,
    color: '#00A1E0',
    gradient: 'from-blue-600 to-sky-500'
  },
  {
    name: 'Salesforce Certified App Builder',
    icon: <SiSalesforce size={32} />,
    color: '#00A1E0',
    gradient: 'from-blue-600 to-sky-500'
  },
];

const cardVariants = {
  hidden: { y: 50, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.5, ease: "easeOut" }
  }
};

const Certifications = () => {
  return (
    <section id="certifications" className="section relative overflow-hidden">
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
              <FiAward 
                size={24} 
                style={{ color: 'var(--color-accent-primary)' }}
              />
            </div>
            <span 
              className="font-mono text-sm font-medium tracking-wider uppercase"
              style={{ color: 'var(--color-text-tertiary)' }}
            >
               Certifications
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
            <span className="gradient-text">Certifications</span>
          </motion.h2>

          <motion.p
            className="text-lg md:text-xl max-w-3xl mx-auto leading-relaxed"
            style={{ color: 'var(--color-text-tertiary)' }}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Recognized expertise in Salesforce architecture, development, and platform capabilities.
          </motion.p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          transition={{ staggerChildren: 0.1 }}
        >
          {certifications.map((cert, index) => (
            <motion.div
              key={index}
              className="glass p-6 md:p-8 rounded-2xl hover:scale-105 transition-all duration-300 text-center group relative overflow-hidden"
              variants={cardVariants}
              whileHover={{ y: -10 }}
            >
              {/* Background gradient effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-sky-500/10" />
              </div>

              <div className="relative z-10">
                <div 
                  className="mb-6 p-4 rounded-full mx-auto w-fit transition-transform duration-300 group-hover:scale-110"
                  style={{ 
                    backgroundColor: 'var(--color-accent-primary)',
                    color: 'white'
                  }}
                >
                  {cert.icon}
                </div>

                <h3 
                  className="text-lg md:text-xl font-heading font-semibold mb-3 leading-tight"
                  style={{ color: 'var(--color-text-primary)' }}
                >
                  {cert.name}
                </h3>

                {cert.description && (
                  <p 
                    className="text-sm leading-relaxed mb-4"
                    style={{ color: 'var(--color-text-tertiary)' }}
                  >
                    {cert.description}
                  </p>
                )}

                <div 
                  className="mx-auto w-16 h-1 rounded-full"
                  style={{ background: 'var(--color-accent-gradient)' }}
                />
              </div>

              {/* Hover glow effect */}
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-xl -z-10" />
            </motion.div>
          ))}
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

export default Certifications; 