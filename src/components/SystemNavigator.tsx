'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { FiMenu, FiMoon, FiSun, FiX } from 'react-icons/fi'
import { useTheme } from '@/contexts/ThemeContext'

const SECTIONS = [
  { id: 'home', label: 'Home' },
  { id: 'skills', label: 'Expertise' },
  { id: 'certifications', label: 'Credentials' },
  { id: 'projects', label: 'Projects' },
  { id: 'work', label: 'Journey' },
  { id: 'blog', label: 'Writing' },
  { id: 'contact', label: 'Contact' },
]

export default function SystemNavigator() {
  const [active, setActive] = useState('home')
  const [menuOpen, setMenuOpen] = useState(false)
  const { isDark, toggleTheme } = useTheme()
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    const sections = SECTIONS.map(({ id }) => document.getElementById(id)).filter(
      (section): section is HTMLElement => Boolean(section)
    )

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]

        if (visible?.target.id) setActive(visible.target.id)
      },
      {
        rootMargin: '-28% 0px -58% 0px',
        threshold: [0, 0.08, 0.2, 0.45],
      }
    )

    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!menuOpen) return

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }

    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [menuOpen])

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: reduceMotion ? 'auto' : 'smooth',
      block: 'start',
    })
    setActive(id)
    setMenuOpen(false)
  }

  const themeLabel = isDark ? 'Switch to light theme' : 'Switch to dark theme'

  return (
    <header className="site-nav-shell">
      <nav className="site-nav" aria-label="Primary navigation">
        <button className="site-brand" type="button" onClick={() => scrollTo('home')}>
          <span className="site-brand-mark" aria-hidden="true">BJ</span>
          <span className="site-brand-copy">
            <strong>Bennie Joseph</strong>
            <span>Customer Success · Salesforce</span>
          </span>
        </button>

        <div className="site-nav-links">
          {SECTIONS.map(({ id, label }) => (
            <button
              key={id}
              className="site-nav-link"
              type="button"
              onClick={() => scrollTo(id)}
              aria-current={active === id ? 'page' : undefined}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="site-nav-actions">
          <button
            type="button"
            className="site-theme-toggle"
            onClick={toggleTheme}
            aria-label={themeLabel}
            title={themeLabel}
          >
            {isDark ? <FiSun aria-hidden="true" /> : <FiMoon aria-hidden="true" />}
          </button>
          <button
            type="button"
            className="site-menu-toggle"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="primary-mobile-navigation"
            aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          >
            {menuOpen ? <FiX aria-hidden="true" /> : <FiMenu aria-hidden="true" />}
          </button>
        </div>

        <AnimatePresence>
          {menuOpen && (
            <motion.div
              id="primary-mobile-navigation"
              className="site-mobile-menu"
              initial={reduceMotion ? false : { opacity: 0, y: -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: reduceMotion ? 0 : 0.2, ease: 'easeOut' }}
            >
              <span className="site-mobile-eyebrow">Explore the portfolio</span>
              <div className="site-mobile-links">
                {SECTIONS.map(({ id, label }, index) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => scrollTo(id)}
                    aria-current={active === id ? 'page' : undefined}
                  >
                    <span>{String(index + 1).padStart(2, '0')}</span>
                    {label}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  )
}
