"use client"
import React from 'react';
import { motion } from 'framer-motion';
import { SiSalesforce } from 'react-icons/si';

const certifications = [
  {
    name: 'Salesforce Certified Application Architect',
    description: 'Including Supporting 6x Salesforce certification under Application Domain',
    icon: <SiSalesforce size={40} />,
    color: '#00A1E0',
    gradient: 'from-blue-600 to-sky-500'
  },
  {
    name: 'Salesforce Certified Sharing and Visibility Architect',
    icon: <SiSalesforce size={40} />,
    color: '#00A1E0',
    gradient: 'from-blue-600 to-sky-500'
  },
  {
    name: 'Salesforce Certified Data Architect',
    icon: <SiSalesforce size={40} />,
    color: '#00A1E0',
    gradient: 'from-blue-600 to-sky-500'
  },
  {
    name: 'Salesforce Certified Platform Developer I',
    icon: <SiSalesforce size={40} />,
    color: '#00A1E0',
    gradient: 'from-blue-600 to-sky-500'
  },
  {
    name: 'Salesforce Certified Platform Developer II',
    icon: <SiSalesforce size={40} />,
    color: '#00A1E0',
    gradient: 'from-blue-600 to-sky-500'
  },
  {
    name: 'Salesforce Certified App Builder',
    icon: <SiSalesforce size={40} />,
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
    <section id="certifications" className="section">
      <div className="container text-center">
        <motion.h2
          className="section-heading mb-12 bg-gradient-to-r from-blue-600 to-sky-500 bg-clip-text text-transparent"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6 }}
        >
          Certifications
        </motion.h2>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          transition={{ staggerChildren: 0.1 }}
        >
          {certifications.map((cert, index) => (
            <motion.div
              key={index}
              className="flex flex-col items-center p-8 glass-card hover:scale-105 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20"
              variants={cardVariants}
              style={{
                background: `linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.1) 100%)`,
                border: '1px solid rgba(255,255,255,0.1)'
              }}
            >
              <div 
                className="mb-4 p-4 rounded-full bg-gradient-to-r from-blue-600/10 to-sky-500/10"
                style={{ color: cert.color }}
              >
                {cert.icon}
              </div>
              <h3 className="text-lg font-semibold text-lightText mb-2">{cert.name}</h3>
              {cert.description && (
                <p className="text-sm text-lightText/80">{cert.description}</p>
              )}
              <div className="mt-4 w-24 h-1 bg-gradient-to-r from-blue-600 to-sky-500 rounded-full" />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Certifications; 