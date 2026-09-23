'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'
import {
  FiArrowRight,
  FiBookOpen,
  FiGithub,
  FiLinkedin,
  FiMail,
} from 'react-icons/fi'

const PROOF = [
  { value: '9+', label: 'years across Salesforce' },
  { value: '6', label: 'platform credentials' },
  { value: '19+', label: 'enterprise clients' },
]

const SOCIAL = [
  { icon: FiLinkedin, href: 'https://linkedin.com/in/benniejosephrichard', label: 'LinkedIn' },
  { icon: FiGithub, href: 'https://github.com/benniejoseph', label: 'GitHub' },
  { icon: FiMail, href: 'mailto:benniejoseph.r@gmail.com', label: 'Email' },
]

export default function ModernHero() {
  const reduceMotion = useReducedMotion()

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: reduceMotion ? 'auto' : 'smooth',
      block: 'start',
    })
  }

  const enter = (delay = 0) => ({
    initial: reduceMotion ? false : { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: {
      duration: reduceMotion ? 0 : 0.65,
      delay: reduceMotion ? 0 : delay,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  })

  return (
    <section id="home" className="hero-stage" aria-labelledby="hero-title">
      <div className="hero-aura hero-aura-aqua" aria-hidden="true" />
      <div className="hero-aura hero-aura-violet" aria-hidden="true" />
      <div className="hero-aura hero-aura-coral" aria-hidden="true" />

      <div className="hero-layout">
        <motion.div className="hero-copy" {...enter(0.08)}>
          <div className="hero-role-line">
            <span className="status-dot dot-live" aria-hidden="true" />
            <span>Customer Success Manager at Salesforce</span>
            <span className="hero-role-date">Since Sep 2026</span>
          </div>

          <h1 id="hero-title" className="hero-title">
            <span>Bennie</span>
            <span>Joseph</span>
          </h1>

          <motion.p className="hero-thesis" {...enter(0.18)}>
            Customer success, built on <span>technical depth.</span>
          </motion.p>

          <motion.p className="hero-summary" {...enter(0.26)}>
            I connect people, platform, and AI so teams move beyond implementation
            and turn Salesforce into lasting customer value.
          </motion.p>

          <motion.div className="hero-actions" {...enter(0.34)}>
            <button className="terminal-cmd terminal-cmd-solid" onClick={() => scrollTo('work')}>
              Explore my journey
              <FiArrowRight aria-hidden="true" />
            </button>
            <Link href="/blog" className="terminal-cmd">
              <FiBookOpen aria-hidden="true" />
              Read field notes
            </Link>
          </motion.div>

          <motion.dl className="hero-proof" aria-label="Career highlights" {...enter(0.42)}>
            {PROOF.map((item) => (
              <div key={item.label} className="hero-proof-item">
                <dt>{item.label}</dt>
                <dd>{item.value}</dd>
              </div>
            ))}
          </motion.dl>

          <motion.div className="hero-social" aria-label="Social links" {...enter(0.5)}>
            {SOCIAL.map((item) => {
              const external = item.href.startsWith('http')
              return (
                <a
                  key={item.label}
                  href={item.href}
                  target={external ? '_blank' : undefined}
                  rel={external ? 'noopener noreferrer' : undefined}
                  aria-label={external ? `${item.label} (opens in a new tab)` : item.label}
                >
                  <item.icon aria-hidden="true" />
                  <span>{item.label}</span>
                </a>
              )
            })}
          </motion.div>
        </motion.div>

        <motion.div
          className="hero-visual"
          initial={reduceMotion ? false : { opacity: 0, scale: 0.94, x: 28 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{
            duration: reduceMotion ? 0 : 0.85,
            delay: reduceMotion ? 0 : 0.16,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <div className="hero-portrait-halo" aria-hidden="true" />
          <div className="hero-portrait-shell">
            <div className="hero-portrait-frame">
              <Image
                src="/images/profile.webp"
                alt="Bennie Joseph, Customer Success Manager at Salesforce"
                fill
                priority
                className="hero-portrait-image"
                sizes="(max-width: 767px) 78vw, (max-width: 1199px) 420px, 500px"
              />
              <div className="hero-portrait-wash" aria-hidden="true" />
              <div className="hero-portrait-caption">
                <span className="hero-caption-kicker">Current chapter</span>
                <strong>Salesforce</strong>
                <span>Customer Success · Bengaluru</span>
              </div>
            </div>

            <div className="hero-orbit-label hero-orbit-label-top">
              <span aria-hidden="true">✦</span>
              Application Architect
            </div>
            <div className="hero-orbit-label hero-orbit-label-bottom">
              <span className="status-dot dot-live" aria-hidden="true" />
              People · Platform · AI
            </div>
          </div>
        </motion.div>
      </div>

      <button className="hero-scroll-cue" onClick={() => scrollTo('skills')} aria-label="Scroll to expertise">
        <span>Explore</span>
        <FiArrowRight aria-hidden="true" />
      </button>
    </section>
  )
}
