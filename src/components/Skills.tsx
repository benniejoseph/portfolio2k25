'use client'
import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const MODULES = [
  {
    id: 'MOD_01',
    label: 'SALESFORCE PLATFORM',
    color: 'var(--signal)',
    colorRaw: 'rgba(0,212,255,',
    skills: [
      { name: 'Apex / Triggers',        level: 96 },
      { name: 'LWC / Aura',             level: 94 },
      { name: 'Platform Events',        level: 90 },
      { name: 'OmniScript / FlexCards', level: 87 },
      { name: 'SOQL / SOSL',            level: 95 },
      { name: 'REST / SOAP APIs',       level: 92 },
      { name: 'Salesforce Flows',       level: 88 },
      { name: 'SFDX / CI/CD',           level: 85 },
      { name: 'Service Cloud',          level: 91 },
      { name: 'nCino Banking',          level: 82 },
    ],
  },
  {
    id: 'MOD_02',
    label: 'AI-AGENTIC SYSTEMS',
    color: 'var(--neural)',
    colorRaw: 'rgba(124,58,237,',
    skills: [
      { name: 'LangGraph / RAG',        level: 90 },
      { name: 'OpenAI / Claude APIs',   level: 93 },
      { name: 'Prompt Engineering',     level: 91 },
      { name: 'Agentforce / Einstein',  level: 88 },
      { name: 'Vector Search (pgvec)', level: 83 },
      { name: 'Google Gemini',          level: 85 },
      { name: 'Twilio / LiveKit',       level: 80 },
      { name: 'NLP Pipelines',          level: 84 },
    ],
  },
  {
    id: 'MOD_03',
    label: 'FULL-STACK DEVELOPMENT',
    color: 'var(--live)',
    colorRaw: 'rgba(16,185,129,',
    skills: [
      { name: 'TypeScript / Next.js',   level: 92 },
      { name: 'Node.js / NestJS',       level: 88 },
      { name: 'Python / FastAPI',       level: 82 },
      { name: 'PostgreSQL / Drizzle',   level: 86 },
      { name: 'React / Framer Motion',  level: 90 },
      { name: 'Docker / Cloud Run',     level: 80 },
      { name: 'Tailwind CSS',           level: 89 },
      { name: 'Git / GitHub Actions',   level: 91 },
    ],
  },
]

function SkillBar({ name, level, color, colorRaw, index }: {
  name: string; level: number; color: string; colorRaw: string; index: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <div ref={ref} className="space-y-1">
      <div className="flex justify-between items-center">
        <span
          className="sys-label"
          style={{ fontSize: '10px', letterSpacing: '0.14em', color: 'var(--text-2)' }}
        >
          {name}
        </span>
        <span
          className="sys-label"
          style={{ fontSize: '10px', color, opacity: inView ? 1 : 0, transition: 'opacity 0.4s' }}
        >
          {level}%
        </span>
      </div>
      <div className="skill-bar-track">
        <motion.div
          className="h-full rounded-sm"
          style={{
            background: `linear-gradient(90deg, ${colorRaw}0.9) 0%, ${colorRaw}0.4) 100%)`,
            boxShadow: `0 0 8px ${colorRaw}0.5)`,
          }}
          initial={{ width: 0 }}
          animate={{ width: inView ? `${level}%` : 0 }}
          transition={{ duration: 1.1, delay: index * 0.06, ease: [0.4, 0, 0.2, 1] }}
        />
      </div>
    </div>
  )
}

export default function Skills() {
  return (
    <section id="skills" className="relative py-24 px-6 lg:px-12">
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
            <span className="status-dot dot-signal" />
            <span className="sys-label">SYS_CAPABILITIES // LOADED</span>
          </div>
          <h2
            className="display-headline crt-text"
            style={{ fontSize: 'clamp(36px, 6vw, 64px)', color: 'var(--text)' }}
          >
            CAPABILITY
            <span style={{ color: 'var(--signal)' }}> MATRIX</span>
          </h2>
          <p
            className="sys-label mt-3"
            style={{ fontSize: '11px', color: 'var(--text-3)', letterSpacing: '0.2em' }}
          >
            FULL-STACK PROFICIENCY · ENTERPRISE SALESFORCE · AI-AGENTIC SYSTEMS
          </p>
        </motion.div>

        {/* Module panels */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {MODULES.map((mod, mi) => (
            <motion.div
              key={mod.id}
              className="sys-panel overflow-hidden"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.6, delay: mi * 0.15 }}
            >
              {/* Module header */}
              <div
                className="sys-panel-header flex items-center justify-between px-4 py-2.5"
                style={{ borderBottom: `1px solid ${mod.color}22` }}
              >
                <div className="flex items-center gap-2">
                  <span
                    className="status-dot"
                    style={{ background: mod.color, boxShadow: `0 0 6px ${mod.color}` }}
                  />
                  <span
                    className="sys-label"
                    style={{ fontSize: '9px', color: mod.color, letterSpacing: '0.18em' }}
                  >
                    {mod.id}
                  </span>
                </div>
                <span
                  className="sys-label"
                  style={{ fontSize: '8px', color: 'var(--text-3)', letterSpacing: '0.12em' }}
                >
                  ● ONLINE
                </span>
              </div>

              {/* Module title */}
              <div className="px-4 py-3">
                <div
                  className="sys-label"
                  style={{ fontSize: '11px', color: mod.color, letterSpacing: '0.2em', marginBottom: '16px' }}
                >
                  {mod.label}
                </div>

                {/* Skill bars */}
                <div className="space-y-3">
                  {mod.skills.map((s, si) => (
                    <SkillBar
                      key={s.name}
                      name={s.name}
                      level={s.level}
                      color={mod.color}
                      colorRaw={mod.colorRaw}
                      index={si}
                    />
                  ))}
                </div>

                {/* Footer telemetry */}
                <div
                  className="mt-5 pt-3 flex justify-between"
                  style={{ borderTop: '1px solid var(--border)' }}
                >
                  <span className="sys-label-dim" style={{ fontSize: '8px' }}>
                    SKILLS_LOADED: {mod.skills.length}
                  </span>
                  <span className="sys-label-dim" style={{ fontSize: '8px' }}>
                    AVG:{' '}
                    <span style={{ color: mod.color }}>
                      {Math.round(mod.skills.reduce((a, s) => a + s.level, 0) / mod.skills.length)}%
                    </span>
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
