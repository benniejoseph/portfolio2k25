'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiSun, FiMoon } from 'react-icons/fi'
import Link from 'next/link'
import { useTheme } from '@/contexts/ThemeContext'

const SECTIONS: { id: string; code: string; label: string; href?: string }[] = [
  { id: 'home',          code: '00', label: 'BOOT SEQUENCE' },
  { id: 'skills',        code: '01', label: 'CAPABILITIES' },
  { id: 'certifications',code: '02', label: 'CLEARANCE' },
  { id: 'projects',      code: '03', label: 'SYSTEMS' },
  { id: 'work',          code: '04', label: 'MISSIONS' },
  { id: 'contact',       code: '05', label: 'UPLINK' },
  { id: 'blog',          code: '06', label: 'SIGNAL LOG' },
]

export default function SystemNavigator() {
  const [active, setActive] = useState('home')
  const [hovered, setHovered] = useState<string | null>(null)
  const { isDark, toggleTheme } = useTheme()

  useEffect(() => {
    const observers: IntersectionObserver[] = []
    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (!el) return
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActive(id) },
        { threshold: 0.35, rootMargin: '-10% 0px -10% 0px' }
      )
      obs.observe(el)
      observers.push(obs)
    })
    return () => observers.forEach(o => o.disconnect())
  }, [])

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      {/* ── Desktop: vertical left rail ── */}
      <nav
        className="sys-navigator-desktop fixed left-0 top-0 h-full flex flex-col items-center py-8 gap-1"
        style={{
          width: '56px',
          zIndex: 50,
          background: 'var(--nav-bg)',
          backdropFilter: 'blur(12px)',
          borderRight: '1px solid var(--border)',
        }}
      >
        {/* Top mark */}
        <div className="mb-4 flex flex-col items-center gap-1">
          <div className="status-dot dot-signal" />
          <div className="sys-label" style={{ writingMode: 'vertical-rl', fontSize: '8px', letterSpacing: '0.2em', opacity: 0.4 }}>
            AXM
          </div>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center gap-2">
          {SECTIONS.map(({ id, code, label, href }) => {
            const isActive = active === id
            const inner = (
              <span
                className="font-mono text-[11px] font-semibold tracking-wider transition-colors"
                style={{ color: isActive ? 'var(--signal)' : 'var(--text-3)', fontFamily: 'var(--font-mono, monospace)' }}
              >
                {code}
              </span>
            )
            return (
              <div key={id} className="relative flex items-center" onMouseEnter={() => setHovered(id)} onMouseLeave={() => setHovered(null)}>
                {href ? (
                  <Link
                    href={href}
                    className="relative flex flex-col items-center justify-center w-10 h-10 rounded-sm transition-colors"
                    style={{
                      background: isActive ? 'var(--signal-dim)' : 'transparent',
                      borderLeft: isActive ? '2px solid var(--signal)' : '2px solid transparent',
                    }}
                  >
                    {inner}
                  </Link>
                ) : (
                  <motion.button
                    onClick={() => scrollTo(id)}
                    className="relative flex flex-col items-center justify-center w-10 h-10 rounded-sm transition-colors"
                    style={{
                      background: isActive ? 'var(--signal-dim)' : 'transparent',
                      borderLeft: isActive ? '2px solid var(--signal)' : '2px solid transparent',
                    }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {inner}
                  </motion.button>
                )}

                {/* Hover tooltip */}
                <AnimatePresence>
                  {hovered === id && (
                    <motion.div
                      className="absolute left-full ml-2 whitespace-nowrap pointer-events-none"
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -6 }}
                      transition={{ duration: 0.15 }}
                    >
                      <div
                        className="px-3 py-1.5 rounded-sm"
                        style={{
                          background: 'var(--panel)',
                          border: '1px solid var(--border-2)',
                          fontFamily: 'var(--font-mono, monospace)',
                          fontSize: '10px',
                          letterSpacing: '0.15em',
                          color: 'var(--signal)',
                        }}
                      >
                        {label}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="w-10 h-10 flex items-center justify-center rounded-sm transition-colors hover:bg-white/5"
          style={{ color: 'var(--text-3)' }}
          aria-label="Toggle theme"
        >
          {isDark ? <FiSun size={14} /> : <FiMoon size={14} />}
        </button>
      </nav>

      {/* ── Mobile: bottom bar ── */}
      <nav
        className="sys-navigator-mobile fixed bottom-0 left-0 right-0 flex items-center justify-around px-2 py-2"
        style={{
          zIndex: 50,
          background: 'var(--nav-bg)',
          backdropFilter: 'blur(16px)',
          borderTop: '1px solid var(--border)',
          paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom))',
        }}
      >
        {SECTIONS.map(({ id, code, href }) => {
          const isActive = active === id
          const btnStyle = {
            background: isActive ? 'var(--signal-dim)' : 'transparent',
            borderBottom: isActive ? '2px solid var(--signal)' : '2px solid transparent',
            fontFamily: 'var(--font-mono, monospace)',
            fontSize: '11px',
            fontWeight: 600,
            letterSpacing: '0.1em',
            color: isActive ? 'var(--signal)' : 'var(--text-3)',
          }
          return href ? (
            <Link
              key={id}
              href={href}
              className="flex items-center justify-center w-10 h-8 rounded-sm transition-all"
              style={btnStyle}
            >
              {code}
            </Link>
          ) : (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              className="flex items-center justify-center w-10 h-8 rounded-sm transition-all"
              style={btnStyle}
            >
              {code}
            </button>
          )
        })}
        <button
          onClick={toggleTheme}
          className="flex items-center justify-center w-10 h-8"
          style={{ color: 'var(--text-3)' }}
        >
          {isDark ? <FiSun size={13} /> : <FiMoon size={13} />}
        </button>
      </nav>
    </>
  )
}
