"use client"
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
// import { FaBriefcase } from 'react-icons/fa';

// Updated workData structure based on the reference image
const workData = [
  {
    company: 'Deloitte',
    logo: '/images/deloitte.webp', // Add this image to your public/images/
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
    logo: '/images/acn.webp', // Add this image to your public/images/
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
// --- END OF REPLACE SECTION ---

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
    <section id="work" className="relative min-h-[100vh] py-20 bg-gradient-to-br from-blue-900 via-sky-900/60 to-purple-900/80 flex flex-col items-center overflow-x-hidden">
      {/* Consistent Heading */}
      <div className="w-full max-w-4xl mx-auto text-center mb-16">
        <motion.h2
          className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-sky-500 bg-clip-text text-transparent"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6 }}
        >
          My Career Journey
        </motion.h2>
        <motion.div
          className="h-1 w-20 bg-gradient-to-r from-blue-600 to-sky-500 mx-auto mt-4 rounded-full"
          initial={{ width: 0 }}
          whileInView={{ width: 80 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        />
      </div>

      {/* Centered Column of Company Cards */}
      <div className="w-full max-w-2xl mx-auto flex flex-col items-center gap-12 z-10">
        {workData.map((company, cIdx) => (
          <div key={cIdx} className="relative w-full bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl flex flex-col items-center px-6 py-6 mb-8">
            <h3 className="text-2xl font-bold text-white mb-1 text-center drop-shadow flex items-center gap-2">
              {company.logo && (
                <Image src={company.logo} alt={company.company} width={32} height={32} className="object-contain rounded-full" />
              )}
              {company.company}
            </h3>
            <span className="text-xs text-sky-100/80 font-medium mb-2">{company.duration}</span>
            <div className="w-full flex flex-col gap-6 mt-2">
              {company.roles.map((role, rIdx) => (
                <motion.div
                  key={rIdx}
                  className="relative group cursor-pointer bg-white/10 rounded-xl p-4 shadow-lg border border-white/10 w-full"
                  initial={false}
                  animate={{}}
                  onClick={() => handleToggle(cIdx, rIdx)}
                >
                  <div className="flex flex-col gap-1">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                      <span className="text-lg font-semibold text-white drop-shadow">{role.title}</span>
                      <span className="text-xs text-sky-200/80 font-medium">{role.period}</span>
                    </div>
                    <span className="text-xs text-sky-100/60 mb-1">{role.location}</span>
                    <span className="text-sm text-sky-200/90 mb-2">{role.description}</span>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {role.skills.map((skill, i) => (
                        <span key={i} className="px-2 py-0.5 bg-gradient-to-r from-blue-500 to-sky-500 text-white text-xs rounded-full shadow">
                          {skill}
                        </span>
                      ))}
                    </div>
                    <button className="mt-1 px-3 py-1 rounded-full bg-gradient-to-r from-blue-500 to-sky-500 text-white text-xs font-semibold shadow hover:from-blue-600 hover:to-sky-600 transition-colors w-max">
                      {open && open.companyIdx === cIdx && open.roleIdx === rIdx ? 'Hide Details' : 'Show Details'}
                    </button>
                  </div>
                  <AnimatePresence initial={false}>
                    {open && open.companyIdx === cIdx && open.roleIdx === rIdx && (
                      <motion.ul
                        className="list-disc list-inside text-sm text-blue-900/90 space-y-1 mt-4 text-left max-h-40 overflow-y-auto bg-white/30 rounded-xl p-3"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4 }}
                      >
                        {role.details.map((point: string, i: number) => (
                          <li key={i}>{point}</li>
                        ))}
                      </motion.ul>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Work;