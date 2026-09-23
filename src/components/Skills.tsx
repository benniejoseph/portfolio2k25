'use client'

import { motion } from 'framer-motion'

const CAPABILITIES = [
  {
    number: '01',
    title: 'Customer value & adoption',
    summary: 'Connect the technology roadmap to the people, operating model, and outcomes required for adoption to stick.',
    color: 'var(--signal)',
    skills: ['Customer Success', 'Outcome planning', 'Stakeholder alignment', 'Adoption strategy', 'Technical discovery'],
  },
  {
    number: '02',
    title: 'Salesforce architecture',
    summary: 'Design secure, maintainable Salesforce solutions that can evolve across teams, clouds, integrations, and releases.',
    color: 'var(--neural)',
    skills: ['Apex & LWC', 'Service Cloud', 'Flow & OmniStudio', 'REST & SOAP', 'Platform Events', 'SFDX & CI/CD', 'nCino'],
  },
  {
    number: '03',
    title: 'Agentic systems & products',
    summary: 'Build grounded AI experiences with clear tool boundaries, observability, human review, and measurable usefulness.',
    color: 'var(--live)',
    skills: ['Agentforce', 'LangGraph', 'RAG & vector search', 'OpenAI & Claude APIs', 'Python', 'TypeScript & Next.js', 'Realtime voice AI'],
  },
]

export default function Skills() {
  return (
    <section id="skills" className="relative px-6 py-24 lg:px-12">
      <div className="mx-auto max-w-6xl">
        <motion.div
          className="mb-14 max-w-3xl"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
        >
          <div className="mb-4 flex items-center gap-3">
            <span className="status-dot dot-neural" />
            <span className="sys-label">Capabilities</span>
          </div>
          <h2
            className="display-headline"
            style={{ fontSize: 'clamp(38px, 6vw, 68px)', color: 'var(--text)', lineHeight: 0.98 }}
          >
            Technical depth, organized around{' '}
            <span style={{ color: 'var(--signal)' }}>customer progress.</span>
          </h2>
          <p className="mt-5 max-w-2xl text-sm leading-7" style={{ color: 'var(--text-2)' }}>
            The useful combination is not a list of tools. It is the ability to move from an executive outcome to an architecture, then stay close enough to delivery to make it real.
          </p>
        </motion.div>

        <div className="grid gap-5 lg:grid-cols-3">
          {CAPABILITIES.map((capability, index) => (
            <motion.article
              key={capability.title}
              className="group relative overflow-hidden rounded-[28px] border p-6 sm:p-7"
              style={{
                borderColor: `color-mix(in srgb, ${capability.color} 24%, var(--border))`,
                background: 'color-mix(in srgb, var(--panel) 84%, transparent)',
                backdropFilter: 'blur(20px)',
              }}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <div
                className="absolute -right-8 -top-12 h-40 w-40 rounded-full blur-3xl"
                style={{ background: capability.color, opacity: 0.12 }}
              />
              <div className="relative">
                <div className="mb-7 flex items-center justify-between">
                  <span
                    className="flex h-10 w-10 items-center justify-center rounded-full border text-xs font-semibold"
                    style={{
                      color: capability.color,
                      borderColor: `color-mix(in srgb, ${capability.color} 35%, transparent)`,
                      background: `color-mix(in srgb, ${capability.color} 10%, transparent)`,
                    }}
                  >
                    {capability.number}
                  </span>
                  <span className="h-px w-16" style={{ background: `linear-gradient(90deg, transparent, ${capability.color})`, opacity: 0.55 }} />
                </div>

                <h3 className="text-xl font-semibold leading-tight" style={{ color: 'var(--text)' }}>{capability.title}</h3>
                <p className="mt-4 min-h-[96px] text-sm leading-6" style={{ color: 'var(--text-2)' }}>{capability.summary}</p>

                <div className="mt-7 flex flex-wrap gap-2 border-t pt-5" style={{ borderColor: 'var(--border)' }}>
                  {capability.skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full border px-3 py-1.5 text-[10px] font-medium"
                      style={{
                        color: 'var(--text-2)',
                        borderColor: 'var(--border-2)',
                        background: 'color-mix(in srgb, var(--panel-2) 74%, transparent)',
                      }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
