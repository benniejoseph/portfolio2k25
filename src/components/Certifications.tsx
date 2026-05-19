'use client'
import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const CERTS = [
  {
    id: 'ARCH-001',
    name: 'Salesforce Certified Application Architect',
    sub: 'Umbrella credential — Data Architect + Sharing & Visibility Architect',
    tier: 'TOP_CREDENTIAL',
    border: 'var(--fire)',
    dot: 'dot-fire',
    glow: 'rgba(245,158,11,0.12)',
    span: true,
  },
  {
    id: 'ARCH-002',
    name: 'Salesforce Certified Sharing & Visibility Architect',
    sub: null,
    tier: 'ARCHITECT',
    border: 'var(--signal)',
    dot: 'dot-signal',
    glow: 'rgba(0,212,255,0.08)',
    span: false,
  },
  {
    id: 'ARCH-003',
    name: 'Salesforce Certified Data Architect',
    sub: null,
    tier: 'ARCHITECT',
    border: 'var(--signal)',
    dot: 'dot-signal',
    glow: 'rgba(0,212,255,0.08)',
    span: false,
  },
  {
    id: 'DEV-001',
    name: 'Salesforce Certified Platform Developer I',
    sub: null,
    tier: 'DEVELOPER',
    border: 'var(--neural)',
    dot: 'dot-neural',
    glow: 'rgba(124,58,237,0.08)',
    span: false,
  },
  {
    id: 'DEV-002',
    name: 'Salesforce Certified Platform Developer II',
    sub: null,
    tier: 'DEVELOPER',
    border: 'var(--neural)',
    dot: 'dot-neural',
    glow: 'rgba(124,58,237,0.08)',
    span: false,
  },
  {
    id: 'EXT-001',
    name: 'nCino Certified 201 Commercial Banking',
    sub: 'Commercial Banking platform certification',
    tier: 'SPECIALIST',
    border: 'var(--live)',
    dot: 'dot-live',
    glow: 'rgba(16,185,129,0.08)',
    span: false,
  },
]

const AWARDS = [
  {
    code: 'ACH-001',
    title: 'AWS DeepRacer Championship — India',
    detail: 'Ranked 17th nationally (Top 32) in Accenture League using Reinforcement Learning.',
    color: 'var(--fire)',
  },
  {
    code: 'ACH-002',
    title: 'Pinnacle Award — Accenture',
    detail: 'Honored for exceeding client expectations on high-visibility Salesforce delivery.',
    color: 'var(--neural)',
  },
  {
    code: 'ACH-003',
    title: 'Deloitte Spot Awards (×3)',
    detail: 'Engineering excellence and Core Business Operations delivery recognition.',
    color: 'var(--live)',
  },
]

function CertCard({ cert, index }: { cert: typeof CERTS[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })

  return (
    <motion.div
      ref={ref}
      className={`relative overflow-hidden ${cert.span ? 'lg:col-span-2' : ''}`}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <div
        className="sys-panel h-full p-5 relative overflow-hidden"
        style={{
          border: `1px solid ${cert.border}`,
          background: `linear-gradient(135deg, ${cert.glow} 0%, var(--panel) 60%)`,
        }}
      >
        {/* TOP CREDENTIAL watermark for main cert */}
        {cert.span && (
          <div
            className="absolute top-3 right-4 pointer-events-none"
            style={{
              fontFamily: 'var(--font-mono, monospace)',
              fontSize: '8px',
              letterSpacing: '0.28em',
              color: 'var(--fire)',
              opacity: 0.35,
            }}
          >
            ◈ TOP CREDENTIAL
          </div>
        )}

        {/* Cert ID + dot */}
        <div className="flex items-center gap-2 mb-3">
          <span className={`status-dot ${cert.dot}`} />
          <span className="sys-label-dim" style={{ fontSize: '8px', letterSpacing: '0.18em' }}>
            {cert.id}
          </span>
          <span
            className="sys-label ml-auto"
            style={{ fontSize: '8px', color: cert.border, letterSpacing: '0.14em' }}
          >
            [{cert.tier}]
          </span>
        </div>

        {/* Redaction bar that slides away on inView */}
        <div className="relative mb-2">
          <h3
            className="sys-label"
            style={{
              fontSize: cert.span ? '14px' : '12px',
              color: 'var(--text)',
              letterSpacing: '0.04em',
              lineHeight: 1.4,
            }}
          >
            {cert.name}
          </h3>
          <motion.div
            className="absolute inset-0 rounded-sm"
            style={{ background: 'var(--void)', originX: 0 }}
            initial={{ scaleX: 1 }}
            animate={{ scaleX: inView ? 0 : 1 }}
            transition={{ duration: 0.55, delay: 0.3 + index * 0.08, ease: [0.4, 0, 0.2, 1] }}
          />
        </div>

        {cert.sub && (
          <p className="sys-label-dim" style={{ fontSize: '10px', letterSpacing: '0.06em' }}>
            {cert.sub}
          </p>
        )}

        {/* Bottom border glow */}
        <div
          className="absolute bottom-0 left-0 right-0 h-px"
          style={{ background: `linear-gradient(90deg, transparent, ${cert.border}, transparent)` }}
        />
      </div>
    </motion.div>
  )
}

export default function Certifications() {
  return (
    <section id="certifications" className="relative py-24 px-6 lg:px-12">
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
            <span className="status-dot dot-fire" />
            <span className="sys-label">CLEARANCE_LEVEL // ARCHITECT</span>
          </div>
          <h2
            className="display-headline crt-text"
            style={{ fontSize: 'clamp(36px, 6vw, 64px)', color: 'var(--text)' }}
          >
            CLASSIFIED
            <span style={{ color: 'var(--fire)' }}> CREDENTIALS</span>
          </h2>
          <p
            className="sys-label mt-3"
            style={{ fontSize: '11px', color: 'var(--text-3)', letterSpacing: '0.2em' }}
          >
            SALESFORCE ARCHITECT · 6 ACTIVE CERTIFICATIONS · CLEARANCE VERIFIED
          </p>
        </motion.div>

        {/* Cert grid — first cert spans 2 columns on lg */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
          {CERTS.map((cert, i) => (
            <CertCard key={cert.id} cert={cert} index={i} />
          ))}
        </div>

        {/* Awards sub-section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <span className="status-dot dot-neural" />
            <span className="sys-label">ACHIEVEMENT_LOG // 3 RECORDS</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {AWARDS.map((aw, i) => (
              <motion.div
                key={aw.code}
                className="sys-panel p-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className="status-dot"
                    style={{ background: aw.color, boxShadow: `0 0 5px ${aw.color}` }}
                  />
                  <span className="sys-label-dim" style={{ fontSize: '8px' }}>{aw.code}</span>
                </div>
                <div
                  className="sys-label mb-1"
                  style={{ fontSize: '11px', color: aw.color, letterSpacing: '0.06em' }}
                >
                  {aw.title}
                </div>
                <p className="sys-label-dim" style={{ fontSize: '10px', letterSpacing: '0.04em' }}>
                  {aw.detail}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
