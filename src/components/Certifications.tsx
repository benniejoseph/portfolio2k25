'use client'

import { motion } from 'framer-motion'
import { FiAward, FiCheck } from 'react-icons/fi'

const CERTIFICATIONS = [
  {
    name: 'Salesforce Certified Application Architect',
    detail: 'Umbrella credential spanning Data Architecture and Sharing & Visibility Architecture.',
    category: 'Architect',
    featured: true,
  },
  { name: 'Salesforce Certified Sharing & Visibility Architect', detail: 'Enterprise access, sharing, and security design.', category: 'Architect', featured: false },
  { name: 'Salesforce Certified Data Architect', detail: 'Scalable data models, governance, and platform data design.', category: 'Architect', featured: false },
  { name: 'Salesforce Certified Platform Developer I', detail: 'Programmatic Salesforce development fundamentals.', category: 'Developer', featured: false },
  { name: 'Salesforce Certified Platform Developer II', detail: 'Advanced programmatic development and solution design.', category: 'Developer', featured: false },
  { name: 'nCino Certified 201 Commercial Banking', detail: 'Commercial banking platform specialization.', category: 'Specialist', featured: false },
]

const RECOGNITION = [
  {
    title: 'AWS DeepRacer Championship — India',
    detail: 'Ranked 17th nationally, reaching the Top 32 in the Accenture League with reinforcement learning.',
  },
  {
    title: 'Pinnacle Award — Accenture',
    detail: 'Recognized for exceeding client expectations on high-visibility Salesforce delivery.',
  },
  {
    title: 'Deloitte Spot Awards ×3',
    detail: 'Recognized for engineering excellence and Core Business Operations delivery.',
  },
]

export default function Certifications() {
  return (
    <section id="certifications" className="relative px-6 py-24 lg:px-12">
      <div className="mx-auto max-w-6xl">
        <motion.div
          className="mb-14 max-w-3xl"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
        >
          <div className="mb-4 flex items-center gap-3">
            <span className="status-dot dot-fire" />
            <span className="sys-label">Credentials & recognition</span>
          </div>
          <h2
            className="display-headline"
            style={{ fontSize: 'clamp(38px, 6vw, 68px)', color: 'var(--text)', lineHeight: 0.98 }}
          >
            Proven platform expertise,{' '}
            <span style={{ color: 'var(--signal)' }}>earned in the field.</span>
          </h2>
          <p className="mt-5 max-w-2xl text-sm leading-7" style={{ color: 'var(--text-2)' }}>
            Architecture credentials support the work; delivery outcomes, trusted partnerships, and continuous learning give them meaning.
          </p>
        </motion.div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CERTIFICATIONS.map((certification, index) => (
            <motion.article
              key={certification.name}
              className={`relative overflow-hidden rounded-[24px] border p-6 ${certification.featured ? 'sm:col-span-2' : ''}`}
              style={{
                borderColor: certification.featured ? 'color-mix(in srgb, var(--signal) 42%, var(--border))' : 'var(--border)',
                background: certification.featured
                  ? 'linear-gradient(135deg, color-mix(in srgb, var(--signal) 14%, var(--panel)), color-mix(in srgb, var(--neural) 8%, var(--panel)))'
                  : 'color-mix(in srgb, var(--panel) 86%, transparent)',
                backdropFilter: 'blur(18px)',
              }}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.45, delay: index * 0.06 }}
            >
              <div className="mb-5 flex items-center justify-between gap-3">
                <span
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full"
                  style={{ color: 'var(--signal)', background: 'color-mix(in srgb, var(--signal) 12%, transparent)' }}
                >
                  {certification.featured ? <FiAward size={18} /> : <FiCheck size={16} />}
                </span>
                <span
                  className="rounded-full border px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.14em]"
                  style={{ color: 'var(--text-2)', borderColor: 'var(--border-2)' }}
                >
                  {certification.category}
                </span>
              </div>
              <h3 className="text-base font-semibold leading-snug" style={{ color: 'var(--text)' }}>{certification.name}</h3>
              <p className="mt-3 text-xs leading-6" style={{ color: 'var(--text-2)' }}>{certification.detail}</p>
            </motion.article>
          ))}
        </div>

        <div className="mt-14">
          <div className="mb-5 flex items-center gap-3">
            <span className="status-dot dot-neural" />
            <h3 className="text-xs font-semibold uppercase tracking-[0.16em]" style={{ color: 'var(--text-2)' }}>Selected recognition</h3>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {RECOGNITION.map((award, index) => (
              <motion.article
                key={award.title}
                className="rounded-[22px] border p-5"
                style={{ borderColor: 'var(--border)', background: 'color-mix(in srgb, var(--panel) 82%, transparent)', backdropFilter: 'blur(16px)' }}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
              >
                <h4 className="text-sm font-semibold" style={{ color: 'var(--text)' }}>{award.title}</h4>
                <p className="mt-2 text-xs leading-6" style={{ color: 'var(--text-2)' }}>{award.detail}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
