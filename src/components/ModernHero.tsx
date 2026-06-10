'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { FiGithub, FiLinkedin, FiMail } from 'react-icons/fi'

const STATS = [
  { value: '9+',  label: 'YRS_EXP' },
  { value: '19+', label: 'CLIENTS' },
  { value: '6×',  label: 'CERTIFIED' },
]

const SOCIAL = [
  { icon: FiGithub,   href: 'https://github.com/benniejoseph',            label: 'GITHUB' },
  { icon: FiLinkedin, href: 'https://linkedin.com/in/benniejosephrichard', label: 'LINKEDIN' },
  { icon: FiMail,     href: 'mailto:benniejoseph.r@gmail.com',            label: 'EMAIL' },
]

const DATA_CARDS = [
  { text: 'STATUS: ACTIVE',     pos: 'bottom-4 -right-2 md:-right-8', color: 'var(--live)' },
  { text: 'CERT_LVL: ARCH',     pos: '-top-4 -left-2 md:-left-8',     color: 'var(--fire)' },
  { text: 'ADAPT: ENABLED',     pos: 'top-1/2 -right-2 md:-right-10', color: 'var(--signal)' },
]

export default function ModernHero() {
  const [showCursor, setShowCursor] = useState(true)

  useEffect(() => {
    const t2 = setInterval(() => setShowCursor(c => !c), 530)
    return () => { clearInterval(t2) }
  }, [])

  return (
    <section
      id="home"
      className="min-h-screen relative flex items-center overflow-hidden"
      style={{ background: 'transparent' }}
    >
      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 lg:px-12 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_260px] gap-12 lg:gap-20 items-center">

          {/* ── Left: Text Stack ── */}
          <div className="space-y-8 min-w-0 lg:overflow-hidden">

            {/* Boot label */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="flex items-center gap-2"
            >
              <span className="status-dot dot-live" />
              <span className="sys-label">
                {'>'} INITIALIZING BENNIE_JOSEPH.SYS
                <span style={{ opacity: showCursor ? 1 : 0 }}>█</span>
              </span>
            </motion.div>

            {/* Headline */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4, type: 'spring', bounce: 0.2 }}
            >
              <h1
                className="display-headline"
                style={{ fontSize: 'clamp(40px, 4.8vw, 68px)' }}
              >
                <span
                  className="block crt-text"
                  style={{ color: 'var(--text)', WebkitTextStroke: '0px' }}
                >
                  SALESFORCE
                </span>
                <span
                  className="block"
                  style={{ color: 'var(--signal)', letterSpacing: '-0.03em' }}
                >
                  ARCHITECT.
                </span>
              </h1>
              <div className="flex items-center gap-3 mt-3">
                <div className="h-px flex-1 max-w-[48px]" style={{ background: 'var(--border-2)' }} />
                <p
                  className="sys-label"
                  style={{ fontSize: '11px', color: 'var(--text-2)', opacity: 1, letterSpacing: '0.22em' }}
                >
                  AI AGENTIC SYSTEMS · 9+ YRS ENTERPRISE
                </p>
              </div>
            </motion.div>

            {/* Stat boxes */}
            <motion.div
              className="flex flex-wrap gap-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              {STATS.map((s, i) => (
                <motion.div
                  key={s.label}
                  className="sys-panel px-5 py-3 min-w-[80px]"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 + i * 0.1 }}
                >
                  <div
                    className="display-headline crt-text"
                    style={{ fontSize: '1.75rem', color: 'var(--signal)' }}
                  >
                    {s.value}
                  </div>
                  <div className="sys-label-dim mt-0.5">{s.label}</div>
                </motion.div>
              ))}
            </motion.div>

            {/* CTAs */}
            <motion.div
              className="flex flex-wrap gap-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1 }}
            >
              <a href="/Bennie_J_Richard_SF.pdf" download className="terminal-cmd terminal-cmd-solid">
                ▶&nbsp;DOWNLOAD_RESUME.PDF
              </a>
              <button
                className="terminal-cmd"
                onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
              >
                ◈&nbsp;VIEW_DEPLOYED_SYSTEMS
              </button>
            </motion.div>

            {/* Social channels */}
            <motion.div
              className="flex items-center gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.3 }}
            >
              {SOCIAL.map(s => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 transition-colors"
                  style={{ color: 'var(--text-3)', fontFamily: 'var(--font-mono, monospace)', fontSize: '10px', letterSpacing: '0.12em' }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'var(--signal)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-3)')}
                >
                  <s.icon size={12} />
                  [{s.label}]
                </a>
              ))}
            </motion.div>
          </div>

          {/* ── Right: Hexagonal Photo ── */}
          <motion.div
            className="relative flex justify-center"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.5, type: 'spring', bounce: 0.15 }}
          >
            <div className="relative" style={{ width: '260px', height: '300px' }}>

              {/* Outer rotating hex ring */}
              <motion.svg
                className="absolute pointer-events-none"
                style={{ inset: '-28px', width: 'calc(100% + 56px)', height: 'calc(100% + 56px)' }}
                viewBox="0 0 316 356"
                fill="none"
                animate={{ rotate: 360 }}
                transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
              >
                <polygon
                  points="158,4 308,81 308,235 158,312 8,235 8,81"
                  stroke="rgba(0,212,255,0.18)"
                  strokeWidth="1"
                  strokeDasharray="6 12"
                />
              </motion.svg>

              {/* Inner counter-rotating hex ring */}
              <motion.svg
                className="absolute pointer-events-none"
                style={{ inset: '-14px', width: 'calc(100% + 28px)', height: 'calc(100% + 28px)' }}
                viewBox="0 0 288 328"
                fill="none"
                animate={{ rotate: -360 }}
                transition={{ duration: 42, repeat: Infinity, ease: 'linear' }}
              >
                <polygon
                  points="144,3 282,75 282,218 144,290 6,218 6,75"
                  stroke="rgba(124,58,237,0.14)"
                  strokeWidth="0.5"
                />
              </motion.svg>

              {/* Photo with hex clip */}
              <div
                className="w-full h-full overflow-hidden relative"
                style={{
                  clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                  background: 'var(--panel)',
                }}
              >
                {/* Colour overlay */}
                <div
                  className="absolute inset-0 z-10 pointer-events-none"
                  style={{ background: 'linear-gradient(135deg, rgba(0,212,255,0.06) 0%, transparent 60%, rgba(124,58,237,0.08) 100%)' }}
                />
                <Image
                  src="/images/profile.webp"
                  alt="Bennie Joseph — Salesforce Architect & AI Builder"
                  fill
                  style={{ objectFit: 'cover', objectPosition: 'center 8%' }}
                  priority
                  sizes="260px"
                />
              </div>

              {/* Data cards */}
              {DATA_CARDS.map((card, i) => (
                <motion.div
                  key={card.text}
                  className={`absolute ${card.pos} z-20`}
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.4 + i * 0.15, type: 'spring', bounce: 0.4 }}
                >
                  <div
                    className="px-3 py-1.5 rounded-sm whitespace-nowrap"
                    style={{
                      background: 'rgba(2,4,8,0.88)',
                      border: `1px solid ${card.color}`,
                      fontFamily: 'var(--font-mono, monospace)',
                      fontSize: '9px',
                      letterSpacing: '0.14em',
                      color: card.color,
                      backdropFilter: 'blur(8px)',
                    }}
                  >
                    {card.text}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
      >
        <span className="sys-label-dim" style={{ fontSize: '9px' }}>SCROLL_DOWN</span>
        <motion.div
          style={{ color: 'var(--signal)', fontSize: '16px' }}
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        >
          ↓
        </motion.div>
      </motion.div>

      {/* Ambient glow behind photo */}
      <div
        className="absolute top-1/2 right-0 -translate-y-1/2 pointer-events-none"
        style={{
          width: '400px', height: '400px',
          background: 'radial-gradient(ellipse, rgba(0,212,255,0.04) 0%, transparent 70%)',
          transform: 'translateY(-50%)',
        }}
      />
    </section>
  )
}
