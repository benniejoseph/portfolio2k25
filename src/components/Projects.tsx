'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiExternalLink, FiGithub } from 'react-icons/fi'

const PROJECTS = [
  {
    id: 'SYS-001',
    name: 'TradeTaper',
    subtitle: 'Trading Journal Platform',
    desc: 'Production-grade full-stack trading journal — NestJS backend, Next.js frontend, real-time WebSocket data feeds, PostgreSQL. 523 commits, modular monorepo with auth, market-data ingestion, strategy modules.',
    stack: ['TypeScript', 'NestJS', 'Next.js', 'WebSocket', 'PostgreSQL', 'Docker'],
    live: 'https://www.tradetaper.com',
    github: '',
    status: 'ONLINE',
    uptime: 99,
    color: 'var(--live)',
    colorRaw: 'rgba(16,185,129,',
  },
  {
    id: 'SYS-002',
    name: 'Audiolyse',
    subtitle: 'AI Call Coaching Platform',
    desc: 'Bulk call transcription + AI coaching using Next.js 14 and Gemini 2.5 Pro. Parallel audio processing, sentiment analysis, agent performance scoring. English, Hindi & Hinglish support.',
    stack: ['Next.js 14', 'Gemini 2.5', 'Supabase', 'TypeScript'],
    live: 'https://www.audiolyse.com',
    github: '',
    status: 'ONLINE',
    uptime: 97,
    color: 'var(--neural)',
    colorRaw: 'rgba(124,58,237,',
  },
  {
    id: 'SYS-003',
    name: 'Doreish',
    subtitle: 'Autonomous AI Agent Ops',
    desc: 'Multi-agent orchestration platform — single control plane for SaaS ops. Agents act as autonomous employees across dev, support, marketing. OpenAI APIs, pgvector, Upstash Redis queuing.',
    stack: ['TypeScript', 'Next.js', 'Postgres', 'Redis', 'OpenAI'],
    live: 'https://www.doreish.com',
    github: '',
    status: 'ONLINE',
    uptime: 98,
    color: 'var(--signal)',
    colorRaw: 'rgba(0,212,255,',
  },
  {
    id: 'SYS-004',
    name: 'Agent Assemble',
    subtitle: 'LangGraph Agentic Platform',
    desc: 'LangGraph + RAG-based agentic platform enabling users to define workflows in natural language. Spawns AI agents to autonomously execute API tools, scheduling, and multi-step business processes.',
    stack: ['LangGraph', 'RAG', 'Python', 'OpenAI', 'REST APIs'],
    live: '',
    github: '',
    status: 'CLASSIFIED',
    uptime: 94,
    color: 'var(--fire)',
    colorRaw: 'rgba(245,158,11,',
  },
  {
    id: 'SYS-005',
    name: 'Mona',
    subtitle: 'Real-Time AI Meeting Assistant',
    desc: 'Real-time AI voice assistant in MS Teams + Zoom using Twilio, LiveKit, OpenAI Realtime API. Automates transcription, meeting minutes, and parallel task execution during live meetings.',
    stack: ['Twilio', 'LiveKit', 'OpenAI Realtime', 'Teams SDK'],
    live: '',
    github: '',
    status: 'CLASSIFIED',
    uptime: 91,
    color: 'var(--fire)',
    colorRaw: 'rgba(245,158,11,',
  },
  {
    id: 'SYS-006',
    name: 'Cenithos',
    subtitle: 'AI-Powered Cross-Platform App',
    desc: 'Cross-platform app — Flutter mobile, TypeScript web, Python backend. AI integration with Firebase. Automated security scanning, linting, test coverage baked into the pipeline.',
    stack: ['Flutter', 'Python', 'TypeScript', 'Firebase'],
    live: 'https://centhios-web.vercel.app',
    github: 'https://github.com/benniejoseph/cenithos',
    status: 'ONLINE',
    uptime: 88,
    color: 'var(--live)',
    colorRaw: 'rgba(16,185,129,',
  },
]

export default function Projects() {
  const [active, setActive] = useState(0)
  const [dir, setDir] = useState(1)

  const go = (next: number) => {
    setDir(next > active ? 1 : -1)
    setActive(next)
  }

  useEffect(() => {
    const t = setInterval(() => {
      setDir(1)
      setActive(p => (p + 1) % PROJECTS.length)
    }, 7000)
    return () => clearInterval(t)
  }, [])

  const p = PROJECTS[active]

  return (
    <section id="projects" className="relative py-24 px-6 lg:px-12">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="status-dot dot-live" />
            <span className="sys-label">DEPLOYED_SYSTEMS // {PROJECTS.length} ACTIVE</span>
          </div>
          <h2
            className="display-headline crt-text"
            style={{ fontSize: 'clamp(36px, 6vw, 64px)', color: 'var(--text)' }}
          >
            SYSTEM
            <span style={{ color: 'var(--signal)' }}> REGISTRY</span>
          </h2>
          <p
            className="sys-label mt-3"
            style={{ fontSize: '11px', color: 'var(--text-3)', letterSpacing: '0.2em' }}
          >
            PRODUCTION DEPLOYMENTS · AI PLATFORMS · ENTERPRISE TOOLS
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">

          {/* Main panel */}
          <div className="sys-panel overflow-hidden" style={{ minHeight: '420px' }}>
            {/* Panel header */}
            <div
              className="sys-panel-header flex items-center justify-between px-5 py-3"
              style={{ borderBottom: `1px solid ${p.color}22` }}
            >
              <div className="flex items-center gap-2">
                <span
                  className="status-dot"
                  style={{
                    background: p.status === 'ONLINE' ? 'var(--live)' : 'var(--fire)',
                    boxShadow: `0 0 6px ${p.status === 'ONLINE' ? 'var(--live)' : 'var(--fire)'}`,
                  }}
                />
                <span className="sys-label" style={{ fontSize: '9px', color: p.color }}>
                  {p.id} — {p.name.toUpperCase()}
                </span>
              </div>
              <span
                className="sys-label"
                style={{
                  fontSize: '9px',
                  color: p.status === 'ONLINE' ? 'var(--live)' : 'var(--fire)',
                  letterSpacing: '0.14em',
                }}
              >
                ● {p.status}
              </span>
            </div>

            {/* Content */}
            <AnimatePresence mode="wait" custom={dir}>
              <motion.div
                key={active}
                custom={dir}
                initial={{ opacity: 0, x: dir * 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: dir * -40 }}
                transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                className="p-6"
              >
                <div className="mb-6">
                  <h3
                    className="display-headline"
                    style={{ fontSize: 'clamp(24px, 4vw, 40px)', color: p.color, marginBottom: '4px' }}
                  >
                    {p.name}
                  </h3>
                  <div
                    className="sys-label"
                    style={{ fontSize: '11px', color: 'var(--text-2)', letterSpacing: '0.16em' }}
                  >
                    {p.subtitle}
                  </div>
                </div>

                {/* Uptime bar */}
                <div className="mb-6">
                  <div className="flex justify-between mb-1">
                    <span className="sys-label-dim" style={{ fontSize: '8px' }}>UPTIME_SCORE</span>
                    <span className="sys-label" style={{ fontSize: '8px', color: p.color }}>{p.uptime}%</span>
                  </div>
                  <div className="skill-bar-track">
                    <motion.div
                      className="h-full"
                      style={{
                        background: `linear-gradient(90deg, ${p.colorRaw}0.8) 0%, ${p.colorRaw}0.3) 100%)`,
                        boxShadow: `0 0 8px ${p.colorRaw}0.4)`,
                      }}
                      initial={{ width: 0 }}
                      animate={{ width: `${p.uptime}%` }}
                      transition={{ duration: 0.9, ease: [0.4, 0, 0.2, 1] }}
                    />
                  </div>
                </div>

                <p
                  className="leading-relaxed mb-6"
                  style={{
                    fontFamily: 'var(--font-inter, sans-serif)',
                    fontSize: '13px',
                    color: 'var(--text-2)',
                  }}
                >
                  {p.desc}
                </p>

                {/* Stack tokens */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {p.stack.map(tag => (
                    <span
                      key={tag}
                      className="sys-label px-2 py-1 rounded-sm"
                      style={{
                        fontSize: '9px',
                        color: p.color,
                        border: `1px solid ${p.colorRaw}0.3)`,
                        background: `${p.colorRaw}0.06)`,
                        letterSpacing: '0.1em',
                      }}
                    >
                      [{tag}]
                    </span>
                  ))}
                </div>

                {/* Action links */}
                <div className="flex gap-3">
                  {p.live && (
                    <a
                      href={p.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="terminal-cmd terminal-cmd-solid flex items-center gap-1.5"
                      style={{ fontSize: '9px' }}
                    >
                      <FiExternalLink size={10} />
                      LAUNCH_SYSTEM
                    </a>
                  )}
                  {p.github && (
                    <a
                      href={p.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="terminal-cmd flex items-center gap-1.5"
                      style={{ fontSize: '9px' }}
                    >
                      <FiGithub size={10} />
                      VIEW_SOURCE
                    </a>
                  )}
                  {!p.live && !p.github && (
                    <span
                      className="sys-label-dim"
                      style={{ fontSize: '9px', letterSpacing: '0.1em' }}
                    >
                      ▒ ACCESS_RESTRICTED
                    </span>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* System index sidebar */}
          <div className="flex flex-col gap-2">
            {PROJECTS.map((proj, i) => (
              <motion.button
                key={proj.id}
                onClick={() => go(i)}
                className="sys-panel text-left px-4 py-3 flex items-center gap-3 transition-colors"
                style={{
                  border: i === active ? `1px solid ${proj.color}` : '1px solid var(--border)',
                  background: i === active ? `${proj.colorRaw}0.06)` : 'var(--panel)',
                }}
                whileTap={{ scale: 0.97 }}
              >
                <span
                  className="status-dot shrink-0"
                  style={{
                    background: proj.status === 'ONLINE' ? 'var(--live)' : 'var(--fire)',
                    boxShadow: i === active
                      ? `0 0 6px ${proj.status === 'ONLINE' ? 'var(--live)' : 'var(--fire)'}`
                      : 'none',
                  }}
                />
                <div className="flex-1 min-w-0">
                  <div
                    className="sys-label truncate"
                    style={{
                      fontSize: '10px',
                      color: i === active ? proj.color : 'var(--text-2)',
                      letterSpacing: '0.1em',
                    }}
                  >
                    {proj.name}
                  </div>
                  <div className="sys-label-dim truncate" style={{ fontSize: '8px' }}>
                    {proj.id} · {proj.status}
                  </div>
                </div>
              </motion.button>
            ))}

            {/* Counter */}
            <div
              className="sys-label text-center mt-2"
              style={{ fontSize: '9px', color: 'var(--text-3)', letterSpacing: '0.2em' }}
            >
              {String(active + 1).padStart(2, '0')} / {String(PROJECTS.length).padStart(2, '0')}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
