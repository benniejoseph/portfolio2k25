'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { FiArrowRight, FiExternalLink, FiGithub } from 'react-icons/fi'

const PROJECTS = [
  {
    name: 'TradeTaper',
    subtitle: 'Trading journal platform',
    description: 'A production-grade trading journal with a NestJS backend, Next.js frontend, realtime WebSocket feeds, PostgreSQL, authentication, market-data ingestion, and strategy modules.',
    stack: ['TypeScript', 'NestJS', 'Next.js', 'WebSocket', 'PostgreSQL', 'Docker'],
    live: 'https://www.tradetaper.com',
    github: '',
    status: 'Live product',
    color: 'var(--live)',
  },
  {
    name: 'Audiolyse',
    subtitle: 'AI call-coaching platform',
    description: 'Bulk call transcription and AI-assisted coaching with parallel audio processing, sentiment analysis, performance signals, and support for English, Hindi, and Hinglish.',
    stack: ['Next.js 14', 'Gemini 2.5', 'Supabase', 'TypeScript'],
    live: 'https://www.audiolyse.com',
    github: '',
    status: 'Live product',
    color: 'var(--neural)',
  },
  {
    name: 'Doreish',
    subtitle: 'Multi-agent operations platform',
    description: 'A shared control plane for AI agents working across development, support, and marketing, with vector search and queue-backed execution for coordinated SaaS operations.',
    stack: ['TypeScript', 'Next.js', 'PostgreSQL', 'Redis', 'OpenAI'],
    live: 'https://www.doreish.com',
    github: '',
    status: 'Live product',
    color: 'var(--signal)',
  },
  {
    name: 'Agent Assemble',
    subtitle: 'Natural-language agent orchestration',
    description: 'A LangGraph and RAG platform that turns natural-language workflows into agents capable of using API tools, schedules, and multi-step business processes.',
    stack: ['LangGraph', 'RAG', 'Python', 'OpenAI', 'REST APIs'],
    live: '',
    github: '',
    status: 'Enterprise build',
    color: 'var(--fire)',
  },
  {
    name: 'Mona',
    subtitle: 'Realtime meeting assistant',
    description: 'A voice AI assistant for Microsoft Teams and Zoom that combines Twilio, LiveKit, and the OpenAI Realtime API for transcription, meeting notes, and parallel task execution.',
    stack: ['Twilio', 'LiveKit', 'OpenAI Realtime', 'Teams SDK'],
    live: '',
    github: '',
    status: 'Enterprise build',
    color: 'var(--fire)',
  },
  {
    name: 'Cenithos',
    subtitle: 'Cross-platform AI application',
    description: 'A Flutter mobile, TypeScript web, and Python backend application with Firebase integration and automated security, linting, and test checks in the delivery pipeline.',
    stack: ['Flutter', 'Python', 'TypeScript', 'Firebase'],
    live: 'https://centhios-web.vercel.app',
    github: 'https://github.com/benniejoseph/cenithos',
    status: 'Open source',
    color: 'var(--live)',
  },
]

export default function Projects() {
  const [active, setActive] = useState(0)
  const project = PROJECTS[active]

  return (
    <section id="projects" className="relative px-6 py-24 lg:px-12">
      <div className="mx-auto max-w-6xl">
        <motion.div
          className="mb-14 max-w-3xl"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
        >
          <div className="mb-4 flex items-center gap-3">
            <span className="status-dot dot-live" />
            <span className="sys-label">Selected work</span>
          </div>
          <h2
            className="display-headline"
            style={{ fontSize: 'clamp(38px, 6vw, 68px)', color: 'var(--text)', lineHeight: 0.98 }}
          >
            Products and platforms built to{' '}
            <span style={{ color: 'var(--signal)' }}>move work forward.</span>
          </h2>
          <p className="mt-5 max-w-2xl text-sm leading-7" style={{ color: 'var(--text-2)' }}>
            A mix of live products and enterprise builds spanning Salesforce, agentic workflows, realtime AI, and full-stack product engineering.
          </p>
        </motion.div>

        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_330px]">
          <div
            className="relative min-h-[440px] overflow-hidden rounded-[32px] border p-6 sm:p-9"
            style={{
              borderColor: `color-mix(in srgb, ${project.color} 32%, var(--border))`,
              background: 'linear-gradient(145deg, color-mix(in srgb, var(--panel) 88%, transparent), color-mix(in srgb, var(--panel-2) 76%, transparent))',
              backdropFilter: 'blur(22px)',
            }}
          >
            <div
              className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full blur-3xl"
              style={{ background: project.color, opacity: 0.13 }}
            />

            <AnimatePresence mode="wait">
              <motion.article
                key={project.name}
                className="relative flex min-h-[370px] flex-col"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span
                    className="rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em]"
                    style={{
                      color: project.color,
                      borderColor: `color-mix(in srgb, ${project.color} 36%, transparent)`,
                      background: `color-mix(in srgb, ${project.color} 9%, transparent)`,
                    }}
                  >
                    {project.status}
                  </span>
                  <span className="text-xs font-medium" style={{ color: 'var(--text-3)' }}>
                    {String(active + 1).padStart(2, '0')} / {String(PROJECTS.length).padStart(2, '0')}
                  </span>
                </div>

                <div className="mt-12 max-w-2xl">
                  <h3 className="display-headline" style={{ fontSize: 'clamp(34px, 6vw, 62px)', color: project.color, lineHeight: 0.95 }}>
                    {project.name}
                  </h3>
                  <p className="mt-3 text-sm font-semibold uppercase tracking-[0.12em]" style={{ color: 'var(--text-2)' }}>{project.subtitle}</p>
                  <p className="mt-6 text-sm leading-7" style={{ color: 'var(--text-2)' }}>{project.description}</p>
                </div>

                <div className="mt-7 flex flex-wrap gap-2">
                  {project.stack.map((technology) => (
                    <span
                      key={technology}
                      className="rounded-full border px-3 py-1.5 text-[10px] font-medium"
                      style={{ color: 'var(--text-2)', borderColor: 'var(--border-2)', background: 'color-mix(in srgb, var(--panel-2) 75%, transparent)' }}
                    >
                      {technology}
                    </span>
                  ))}
                </div>

                <div className="mt-auto flex flex-wrap gap-3 pt-8">
                  {project.live && (
                    <a
                      href={project.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="terminal-cmd terminal-cmd-solid rounded-full"
                    >
                      Visit project <FiExternalLink size={13} />
                    </a>
                  )}
                  {project.github && (
                    <a href={project.github} target="_blank" rel="noopener noreferrer" className="terminal-cmd rounded-full">
                      View source <FiGithub size={13} />
                    </a>
                  )}
                  {!project.live && !project.github && (
                    <p className="text-xs leading-5" style={{ color: 'var(--text-3)' }}>
                      Private enterprise work; details are limited to protect client context.
                    </p>
                  )}
                </div>
              </motion.article>
            </AnimatePresence>
          </div>

          <div className="flex flex-col gap-2" aria-label="Choose a project">
            {PROJECTS.map((item, index) => {
              const isActive = active === index
              return (
                <motion.button
                  key={item.name}
                  type="button"
                  onClick={() => setActive(index)}
                  className="group flex items-center gap-4 rounded-[20px] border px-4 py-4 text-left"
                  style={{
                    borderColor: isActive ? `color-mix(in srgb, ${item.color} 42%, var(--border))` : 'var(--border)',
                    background: isActive ? `color-mix(in srgb, ${item.color} 9%, var(--panel))` : 'color-mix(in srgb, var(--panel) 80%, transparent)',
                  }}
                  whileTap={{ scale: 0.985 }}
                  aria-pressed={isActive}
                >
                  <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: item.color, boxShadow: isActive ? `0 0 14px ${item.color}` : 'none' }} />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold" style={{ color: isActive ? 'var(--text)' : 'var(--text-2)' }}>{item.name}</span>
                    <span className="mt-0.5 block truncate text-[10px]" style={{ color: 'var(--text-3)' }}>{item.status}</span>
                  </span>
                  <FiArrowRight size={14} style={{ color: isActive ? item.color : 'var(--text-3)' }} />
                </motion.button>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
