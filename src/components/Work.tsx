'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

const MISSIONS = [
  {
    company: 'Deloitte USI',
    logo: '/images/deloitte.webp',
    code: 'MSNO-001',
    duration: '4 YRS 10 MOS',
    period: 'May 2021 – Present',
    color: 'var(--signal)',
    colorRaw: 'rgba(0,212,255,',
    roles: [
      {
        title: 'Senior Consultant — Salesforce Application Engineer (GenAI & Salesforce)',
        period: 'May 2021 – Present',
        location: 'Bengaluru, India · Hybrid',
        brief: 'Architected and led full-stack Salesforce + GenAI solutions for 19+ enterprise clients. Built agentic platforms, AI voice assistants, and intelligent Salesforce automations.',
        stack: ['Apex', 'LWC', 'LangGraph', 'RAG', 'OpenAI', 'Python', 'nCino', 'CI/CD'],
        log: [
          'Architected "Agent Assemble" — LangGraph + RAG agentic platform enabling natural-language workflow definition, spawning autonomous API-executing agents.',
          'Developed "Mona" — real-time AI assistant in MS Teams/Zoom using Twilio, LiveKit, OpenAI Realtime API for transcription and parallel task execution.',
          'Engineered "GenAI Copilot" on Salesforce Service Cloud — NLP entity extraction to auto-create cases and generate AI-powered investigation summaries.',
          'Built multilingual AI Chatbot with LWC — dynamic context-based Salesforce record creation and retrieval via REST APIs with backend NLP services.',
          'Developed Oregon DMV portal on OmniScript with Gemini AI — automated form-filling, Computer Vision image validation, fraud analysis.',
          'Implemented CI/CD pipelines using AutoRabbit + Git for Deloitte nCino Accelerator — 25% implementation cost reduction across 19 Loan Origination Institutions.',
          'Designed Apex trigger frameworks, Platform Event exception logging, reusable LWC libraries — 30% cross-project development effort reduction.',
          'Mentored 5+ engineers; established design and code review standards adopted across the Salesforce practice.',
        ],
      },
    ],
  },
  {
    company: 'Accenture Solutions',
    logo: '/images/acn.webp',
    code: 'MSNO-002',
    duration: '4 YRS 6 MOS',
    period: 'Dec 2016 – May 2021',
    color: 'var(--neural)',
    colorRaw: 'rgba(124,58,237,',
    roles: [
      {
        title: 'Application Senior Analyst — Salesforce Developer',
        period: 'Dec 2016 – May 2021',
        location: 'Bengaluru, India',
        brief: 'Led full-stack Salesforce Service Cloud development for a Life Sciences client supporting 10,000+ community users. Built secure portals, REST/SOAP integrations, automation pipelines.',
        stack: ['LWC', 'Apex', 'Service Cloud', 'SAML/SSO', 'REST APIs', 'SOAP APIs', 'Git'],
        log: [
          'Led development of custom LWC components, Apex classes, and Salesforce Flows for a Life Sciences client supporting 10,000+ community users.',
          'Developed secure community portals with external authentication using SAML & SSO — enterprise security compliance.',
          'Architected resilient REST and SOAP API integrations with multiple external enterprise systems — 40% data reliability improvement.',
          'Built custom automated PDF generation module using Apex + LWC — eliminated 80% of manual activity, saving 200+ person-hours monthly.',
          'Implemented Salesforce knowledge base automation — 50% help desk dependency reduction, significantly improved case resolution time.',
          'Managed branching, merging, release processes using Git and SVN; Agile/Scrum sprint planning, design reviews, retrospectives.',
        ],
      },
    ],
  },
]

export default function Work() {
  const [expanded, setExpanded] = useState<string | null>(null)

  return (
    <section id="work" className="relative py-24 px-6 lg:px-12">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="status-dot dot-signal" />
            <span className="sys-label">MISSION_LOG // {MISSIONS.length} DEPLOYMENTS</span>
          </div>
          <h2
            className="display-headline crt-text"
            style={{ fontSize: 'clamp(36px, 6vw, 64px)', color: 'var(--text)' }}
          >
            MISSION
            <span style={{ color: 'var(--signal)' }}> HISTORY</span>
          </h2>
          <p
            className="sys-label mt-3"
            style={{ fontSize: '11px', color: 'var(--text-3)', letterSpacing: '0.2em' }}
          >
            9+ YEARS FIELD EXPERIENCE · ENTERPRISE DEPLOYMENTS · 19+ CLIENTS
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical signal wire */}
          <div
            className="absolute left-6 top-0 bottom-0 w-px"
            style={{ background: 'linear-gradient(180deg, var(--signal) 0%, var(--neural) 100%)', opacity: 0.25 }}
          />

          {/* Animated electron dots travelling down the wire */}
          {[0, 1, 2].map(i => (
            <motion.div
              key={i}
              className="absolute left-[22px] w-2 h-2 rounded-full"
              style={{
                background: i === 0 ? 'var(--signal)' : i === 1 ? 'var(--neural)' : 'var(--live)',
                boxShadow: `0 0 6px ${i === 0 ? 'var(--signal)' : i === 1 ? 'var(--neural)' : 'var(--live)'}`,
              }}
              animate={{ top: ['0%', '100%'] }}
              transition={{
                duration: 4 + i * 1.5,
                repeat: Infinity,
                ease: 'linear',
                delay: i * 1.8,
              }}
            />
          ))}

          <div className="space-y-10 pl-16">
            {MISSIONS.map((m, mi) => {
              return (
                <motion.div
                  key={m.code}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.6, delay: mi * 0.2 }}
                >
                  {/* Mission node */}
                  <div
                    className="absolute -left-0"
                    style={{
                      top: `calc(${mi * 280}px + 20px)`,
                      width: '13px',
                      height: '13px',
                      borderRadius: '2px',
                      border: `1.5px solid ${m.color}`,
                      background: 'var(--base)',
                      left: '0px',
                      marginTop: mi === 0 ? '0' : undefined,
                    }}
                  />

                  <div
                    className="sys-panel overflow-hidden"
                    style={{ border: `1px solid ${m.colorRaw}0.3)` }}
                  >
                    {/* Company header */}
                    <div
                      className="sys-panel-header px-5 py-3 flex items-center gap-4"
                      style={{ borderBottom: `1px solid ${m.colorRaw}0.2)` }}
                    >
                      {m.logo && (
                        <div
                          className="w-9 h-9 rounded-sm overflow-hidden shrink-0 flex items-center justify-center"
                          style={{ background: 'var(--panel)', border: '1px solid var(--border)' }}
                        >
                          <Image
                            src={m.logo}
                            alt={m.company}
                            width={32}
                            height={32}
                            className="object-contain"
                          />
                        </div>
                      )}
                      <div className="flex-1">
                        <div
                          className="sys-label"
                          style={{ fontSize: '12px', color: m.color, letterSpacing: '0.1em' }}
                        >
                          {m.company}
                        </div>
                        <div className="sys-label-dim" style={{ fontSize: '8px' }}>
                          {m.code} · {m.period} · {m.duration}
                        </div>
                      </div>
                      <span
                        className="sys-label"
                        style={{ fontSize: '8px', color: 'var(--live)' }}
                      >
                        ● COMPLETED
                      </span>
                    </div>

                    {/* Role */}
                    {m.roles.map((role, ri) => {
                      const rkey = `${m.code}-${ri}`
                      const open = expanded === rkey

                      return (
                        <div key={ri} className="p-5">
                          <button
                            className="w-full text-left"
                            onClick={() => setExpanded(open ? null : rkey)}
                          >
                            <div className="flex items-start justify-between gap-4 mb-3">
                              <div>
                                <div
                                  className="sys-label mb-1"
                                  style={{ fontSize: '12px', color: 'var(--text)', letterSpacing: '0.04em', lineHeight: 1.4 }}
                                >
                                  {role.title}
                                </div>
                                <div className="sys-label-dim" style={{ fontSize: '9px' }}>
                                  {role.period} · {role.location}
                                </div>
                              </div>
                              <span
                                className="sys-label shrink-0 mt-0.5"
                                style={{ fontSize: '10px', color: m.color }}
                              >
                                {open ? '▲' : '▼'}
                              </span>
                            </div>

                            <p
                              className="leading-relaxed mb-4"
                              style={{
                                fontFamily: 'var(--font-inter, sans-serif)',
                                fontSize: '12px',
                                color: 'var(--text-2)',
                              }}
                            >
                              {role.brief}
                            </p>

                            {/* Stack */}
                            <div className="flex flex-wrap gap-1.5">
                              {role.stack.map(s => (
                                <span
                                  key={s}
                                  className="sys-label px-2 py-0.5 rounded-sm"
                                  style={{
                                    fontSize: '8px',
                                    color: m.color,
                                    border: `1px solid ${m.colorRaw}0.25)`,
                                    background: `${m.colorRaw}0.05)`,
                                  }}
                                >
                                  [{s}]
                                </span>
                              ))}
                            </div>
                          </button>

                          {/* Expandable mission log */}
                          <AnimatePresence initial={false}>
                            {open && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                                className="overflow-hidden"
                              >
                                <div
                                  className="mt-5 pt-4"
                                  style={{ borderTop: `1px solid ${m.colorRaw}0.2)` }}
                                >
                                  <div
                                    className="sys-label mb-3"
                                    style={{ fontSize: '9px', color: m.color }}
                                  >
                                    MISSION_OBJECTIVES
                                  </div>
                                  <ul className="space-y-3">
                                    {role.log.map((item, li) => (
                                      <motion.li
                                        key={li}
                                        className="flex gap-3"
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: li * 0.05 }}
                                      >
                                        <span
                                          className="sys-label shrink-0 mt-0.5"
                                          style={{ fontSize: '9px', color: m.color }}
                                        >
                                          ◈
                                        </span>
                                        <span
                                          style={{
                                            fontFamily: 'var(--font-inter, sans-serif)',
                                            fontSize: '12px',
                                            color: 'var(--text-2)',
                                            lineHeight: 1.6,
                                          }}
                                        >
                                          {item}
                                        </span>
                                      </motion.li>
                                    ))}
                                  </ul>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      )
                    })}
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
