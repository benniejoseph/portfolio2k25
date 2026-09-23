'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Image from 'next/image'
import { FiChevronDown } from 'react-icons/fi'

const EXPERIENCE = [
  {
    company: 'Salesforce',
    logo: null,
    mark: 'SF',
    duration: 'Present',
    period: 'Sep 2026 – Present',
    current: true,
    color: 'var(--signal)',
    roles: [
      {
        title: 'Customer Success Manager',
        period: 'Sep 2026 – Present',
        location: 'India',
        brief:
          'Joined Salesforce in September 2026 to begin a new chapter in customer success. The focus is helping customers connect platform adoption, trusted AI, and the Agentic Enterprise to outcomes that last.',
        stack: ['Customer Success', 'Salesforce Platform', 'Agentic Enterprise', 'Adoption'],
        highlights: [] as string[],
      },
    ],
  },
  {
    company: 'Deloitte USI',
    logo: '/images/deloitte.webp',
    mark: 'D',
    duration: '5 yrs 4 mos',
    period: 'May 2021 – Sep 2026',
    current: false,
    color: 'var(--neural)',
    roles: [
      {
        title: 'Senior Consultant — Salesforce Application Engineer (GenAI & Salesforce)',
        period: 'May 2021 – Sep 2026',
        location: 'Bengaluru, India · Hybrid',
        brief:
          'Architected and led full-stack Salesforce and GenAI solutions for 19+ enterprise clients, translating complex delivery needs into reusable platforms, automations, and engineering standards.',
        stack: ['Apex', 'LWC', 'LangGraph', 'RAG', 'OpenAI', 'Python', 'nCino', 'CI/CD'],
        highlights: [
          'Architected “Agent Assemble” — a LangGraph + RAG platform that turns natural-language workflows into autonomous, API-executing agents.',
          'Developed “Mona” — a real-time AI assistant for Microsoft Teams and Zoom using Twilio, LiveKit, and the OpenAI Realtime API.',
          'Engineered a GenAI Copilot on Salesforce Service Cloud that extracts entities, creates cases, and generates investigation summaries.',
          'Built a multilingual LWC chatbot for contextual Salesforce record creation and retrieval through REST APIs and NLP services.',
          'Developed an Oregon DMV portal on OmniScript with Gemini-assisted form filling, computer-vision validation, and fraud analysis.',
          'Implemented AutoRABIT and Git CI/CD pipelines for the Deloitte nCino Accelerator, reducing implementation cost by 25% across 19 loan-origination institutions.',
          'Designed Apex trigger frameworks, Platform Event exception logging, and reusable LWC libraries that reduced cross-project development effort by 30%.',
          'Mentored 5+ engineers and established design and code-review standards adopted across the Salesforce practice.',
        ],
      },
    ],
  },
  {
    company: 'Accenture Solutions',
    logo: '/images/acn.webp',
    mark: 'A',
    duration: '4 yrs 6 mos',
    period: 'Dec 2016 – May 2021',
    current: false,
    color: 'var(--live)',
    roles: [
      {
        title: 'Application Senior Analyst — Salesforce Developer',
        period: 'Dec 2016 – May 2021',
        location: 'Bengaluru, India',
        brief:
          'Led full-stack Salesforce Service Cloud development for a life-sciences client serving 10,000+ community users, with an emphasis on secure access, reliable integrations, and lower support effort.',
        stack: ['LWC', 'Apex', 'Service Cloud', 'SAML/SSO', 'REST APIs', 'SOAP APIs', 'Git'],
        highlights: [
          'Led development of custom LWC components, Apex classes, and Salesforce Flows for a life-sciences community serving 10,000+ users.',
          'Developed secure community portals with external authentication using SAML and SSO.',
          'Architected resilient REST and SOAP integrations with external enterprise systems, improving data reliability by 40%.',
          'Built an automated PDF generation module with Apex and LWC, eliminating 80% of manual activity and saving 200+ person-hours monthly.',
          'Implemented Salesforce knowledge-base automation that reduced help-desk dependency by 50% and improved case resolution.',
          'Managed branching, merging, and releases with Git and SVN while contributing to Agile planning, design reviews, and retrospectives.',
        ],
      },
    ],
  },
]

export default function Work() {
  const [expanded, setExpanded] = useState<string | null>('Deloitte USI-0')

  return (
    <section id="work" className="relative px-6 py-24 lg:px-12">
      <div className="mx-auto max-w-5xl">
        <motion.div
          className="mb-14 max-w-3xl"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
        >
          <div className="mb-4 flex items-center gap-3">
            <span className="status-dot dot-signal" />
            <span className="sys-label">Experience</span>
          </div>
          <h2
            className="display-headline"
            style={{ fontSize: 'clamp(38px, 6vw, 68px)', color: 'var(--text)', lineHeight: 0.98 }}
          >
            From building the platform to helping customers{' '}
            <span style={{ color: 'var(--signal)' }}>realize its value.</span>
          </h2>
          <p className="mt-5 max-w-2xl text-sm leading-7" style={{ color: 'var(--text-2)' }}>
            Nine-plus years across Salesforce engineering, enterprise architecture, AI products, and now customer success.
          </p>
        </motion.div>

        <div className="relative space-y-6 pl-5 sm:pl-10">
          <div
            className="absolute bottom-3 left-0 top-3 w-px sm:left-4"
            style={{ background: 'linear-gradient(180deg, var(--signal), var(--neural), var(--live))', opacity: 0.35 }}
          />

          {EXPERIENCE.map((experience, experienceIndex) => (
            <motion.article
              key={experience.company}
              className="relative rounded-[28px] border"
              style={{
                borderColor: `color-mix(in srgb, ${experience.color} 28%, var(--border))`,
                background: 'color-mix(in srgb, var(--panel) 84%, transparent)',
                boxShadow: experience.current ? '0 22px 70px color-mix(in srgb, var(--signal) 16%, transparent)' : 'none',
                backdropFilter: 'blur(20px)',
              }}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.55, delay: experienceIndex * 0.1 }}
            >
              <span
                className="absolute -left-[25px] top-9 h-3 w-3 rounded-full sm:-left-[31px]"
                style={{ background: experience.color, boxShadow: `0 0 18px ${experience.color}` }}
              />

              <header
                className="flex flex-wrap items-center gap-4 rounded-t-[28px] border-b px-5 py-5 sm:px-7"
                style={{ borderColor: 'var(--border)', background: 'color-mix(in srgb, var(--panel-2) 70%, transparent)' }}
              >
                <div
                  className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-2xl border text-xs font-bold"
                  style={{ borderColor: 'var(--border-2)', background: 'var(--panel)', color: experience.color }}
                >
                  {experience.logo ? (
                    <Image
                      src={experience.logo}
                      alt={`${experience.company} logo`}
                      width={36}
                      height={36}
                      className="max-h-9 max-w-9 object-contain"
                      style={{ width: 'auto', height: 'auto' }}
                    />
                  ) : (
                    experience.mark
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-lg font-semibold" style={{ color: 'var(--text)' }}>{experience.company}</h3>
                  <p className="mt-0.5 text-xs" style={{ color: 'var(--text-2)' }}>
                    {experience.period} · {experience.duration}
                  </p>
                </div>
                <span
                  className="rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em]"
                  style={{
                    color: experience.current ? 'var(--signal)' : 'var(--text-2)',
                    borderColor: experience.current ? 'color-mix(in srgb, var(--signal) 40%, transparent)' : 'var(--border)',
                    background: experience.current ? 'color-mix(in srgb, var(--signal) 10%, transparent)' : 'transparent',
                  }}
                >
                  {experience.current ? 'Current role' : 'Previous role'}
                </span>
              </header>

              {experience.roles.map((role, roleIndex) => {
                const key = `${experience.company}-${roleIndex}`
                const open = expanded === key
                const hasHighlights = role.highlights.length > 0

                return (
                  <div key={key} className="px-5 py-6 sm:px-7">
                    <button
                      type="button"
                      className="w-full text-left"
                      onClick={() => hasHighlights && setExpanded(open ? null : key)}
                      aria-expanded={hasHighlights ? open : undefined}
                      disabled={!hasHighlights}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h4 className="text-base font-semibold leading-snug" style={{ color: 'var(--text)' }}>{role.title}</h4>
                          <p className="mt-1 text-xs" style={{ color: 'var(--text-3)' }}>{role.period} · {role.location}</p>
                        </div>
                        {hasHighlights && (
                          <FiChevronDown
                            aria-hidden="true"
                            className="mt-1 shrink-0 transition-transform duration-300"
                            size={18}
                            style={{ color: experience.color, transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
                          />
                        )}
                      </div>

                      <p className="mt-4 max-w-3xl text-sm leading-7" style={{ color: 'var(--text-2)' }}>{role.brief}</p>

                      <div className="mt-5 flex flex-wrap gap-2">
                        {role.stack.map((skill) => (
                          <span
                            key={skill}
                            className="rounded-full border px-3 py-1 text-[10px] font-medium"
                            style={{
                              color: experience.color,
                              borderColor: `color-mix(in srgb, ${experience.color} 26%, transparent)`,
                              background: `color-mix(in srgb, ${experience.color} 8%, transparent)`,
                            }}
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </button>

                    <AnimatePresence initial={false}>
                      {open && hasHighlights && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                          className="overflow-hidden"
                        >
                          <div className="mt-6 border-t pt-5" style={{ borderColor: 'var(--border)' }}>
                            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.16em]" style={{ color: experience.color }}>
                              Selected outcomes
                            </p>
                            <ul className="grid gap-3">
                              {role.highlights.map((item) => (
                                <li key={item} className="flex gap-3 text-sm leading-6" style={{ color: 'var(--text-2)' }}>
                                  <span aria-hidden="true" style={{ color: experience.color }}>•</span>
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )
              })}
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
