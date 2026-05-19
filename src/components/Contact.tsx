'use client'
import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import emailjs from 'emailjs-com'
import { FiGithub, FiLinkedin, FiMail } from 'react-icons/fi'

const CHANNELS = [
  { icon: FiMail,     label: 'UPLINK_MAIL',     value: 'benniejoseph.r@gmail.com',         href: 'mailto:benniejoseph.r@gmail.com',            color: 'var(--signal)' },
  { icon: FiLinkedin, label: 'UPLINK_LINKEDIN',  value: '/in/benniejosephrichard',           href: 'https://linkedin.com/in/benniejosephrichard', color: 'var(--neural)' },
  { icon: FiGithub,   label: 'UPLINK_GITHUB',    value: '/benniejoseph',                     href: 'https://github.com/benniejoseph',            color: 'var(--live)' },
]

export default function Contact() {
  const form = useRef<HTMLFormElement>(null)
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [err, setErr] = useState<string | null>(null)
  const [focused, setFocused] = useState<string | null>(null)

  const SERVICE_ID  = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID
  const TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID
  const USER_ID     = process.env.NEXT_PUBLIC_EMAILJS_USER_ID

  const send = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setErr(null)
    if (!SERVICE_ID || !TEMPLATE_ID || !USER_ID) {
      setErr('UPLINK_CONFIG_MISSING — EmailJS credentials not set')
      return
    }
    setSending(true)
    emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, form.current!, USER_ID)
      .then(() => {
        setSent(true)
        setSending(false)
        form.current?.reset()
        setTimeout(() => setSent(false), 6000)
      }, (error) => {
        setErr(`TRANSMIT_FAILED — ${error.text}`)
        setSending(false)
      })
  }

  const inputStyle = (name: string) => ({
    background: 'transparent',
    border: 'none',
    borderBottom: `1px solid ${focused === name ? 'var(--signal)' : 'var(--border-2)'}`,
    borderRadius: 0,
    color: 'var(--text)',
    fontFamily: 'var(--font-mono, monospace)',
    fontSize: '12px',
    letterSpacing: '0.1em',
    padding: '8px 0',
    width: '100%',
    outline: 'none',
    transition: 'border-color 0.2s',
    boxShadow: focused === name ? '0 1px 0 0 var(--signal)' : 'none',
  } as React.CSSProperties)

  return (
    <section id="contact" className="relative py-24 px-6 lg:px-12">
      <div className="max-w-5xl mx-auto">

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
            <span className="sys-label">UPLINK_05 // OPEN_CHANNEL</span>
          </div>
          <h2
            className="display-headline crt-text"
            style={{ fontSize: 'clamp(36px, 6vw, 64px)', color: 'var(--text)' }}
          >
            ESTABLISH
            <span style={{ color: 'var(--signal)' }}> UPLINK</span>
          </h2>
          <p
            className="sys-label mt-3"
            style={{ fontSize: '11px', color: 'var(--text-3)', letterSpacing: '0.2em' }}
          >
            SIGNAL AVAILABLE · RESPONSE TIME &lt;24H · COLLABORATION OPEN
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">

          {/* Terminal form */}
          <motion.div
            className="sys-panel overflow-hidden relative"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {/* Scanline sweep animation */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'linear-gradient(180deg, transparent 0%, rgba(0,212,255,0.03) 50%, transparent 100%)',
                backgroundSize: '100% 200%',
              }}
              animate={{ backgroundPositionY: ['0%', '200%'] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: 'linear' }}
            />

            {/* Terminal header bar */}
            <div
              className="sys-panel-header flex items-center gap-3 px-5 py-3"
              style={{ borderBottom: '1px solid var(--border)' }}
            >
              <span className="status-dot dot-signal" />
              <span className="sys-label" style={{ fontSize: '9px', letterSpacing: '0.18em' }}>
                TERMINAL — UPLINK_TRANSMIT v1.0
              </span>
              <span
                className="sys-label ml-auto"
                style={{ fontSize: '8px', color: 'var(--live)' }}
              >
                ● CHANNEL_OPEN
              </span>
            </div>

            <form ref={form} onSubmit={send} className="p-6 space-y-6 relative z-10">

              {/* Prompt prefix lines */}
              <div>
                <div
                  className="sys-label mb-2"
                  style={{ fontSize: '9px', color: 'var(--signal)', letterSpacing: '0.16em' }}
                >
                  INPUT_IDENT
                </div>
                <div className="flex items-center gap-2">
                  <span className="sys-label" style={{ fontSize: '10px', color: 'var(--text-3)' }}>›</span>
                  <input
                    type="text"
                    name="name"
                    placeholder="your_name"
                    required
                    style={inputStyle('name')}
                    onFocus={() => setFocused('name')}
                    onBlur={() => setFocused(null)}
                  />
                </div>
              </div>

              <div>
                <div
                  className="sys-label mb-2"
                  style={{ fontSize: '9px', color: 'var(--signal)', letterSpacing: '0.16em' }}
                >
                  RETURN_ADDRESS
                </div>
                <div className="flex items-center gap-2">
                  <span className="sys-label" style={{ fontSize: '10px', color: 'var(--text-3)' }}>›</span>
                  <input
                    type="email"
                    name="email"
                    placeholder="you@domain.com"
                    required
                    style={inputStyle('email')}
                    onFocus={() => setFocused('email')}
                    onBlur={() => setFocused(null)}
                  />
                </div>
              </div>

              <div>
                <div
                  className="sys-label mb-2"
                  style={{ fontSize: '9px', color: 'var(--signal)', letterSpacing: '0.16em' }}
                >
                  MESSAGE_PAYLOAD
                </div>
                <div className="flex gap-2">
                  <span
                    className="sys-label mt-2"
                    style={{ fontSize: '10px', color: 'var(--text-3)' }}
                  >›</span>
                  <textarea
                    name="message"
                    placeholder="describe_your_mission..."
                    required
                    rows={5}
                    style={{
                      ...inputStyle('message'),
                      borderBottom: 'none',
                      border: `1px solid ${focused === 'message' ? 'var(--signal)' : 'var(--border-2)'}`,
                      padding: '10px',
                      resize: 'none',
                    }}
                    onFocus={() => setFocused('message')}
                    onBlur={() => setFocused(null)}
                  />
                </div>
              </div>

              <motion.button
                type="submit"
                disabled={sending || sent}
                className="terminal-cmd terminal-cmd-solid w-full justify-center"
                style={{ fontSize: '10px', padding: '12px', letterSpacing: '0.18em' }}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
              >
                {sending ? (
                  <span className="flex items-center justify-center gap-2">
                    <motion.span
                      animate={{ opacity: [1, 0, 1] }}
                      transition={{ duration: 0.8, repeat: Infinity }}
                    >
                      █
                    </motion.span>
                    TRANSMITTING...
                  </span>
                ) : sent ? (
                  '✓ SIGNAL_RECEIVED — AWAITING_RESPONSE'
                ) : (
                  '▶ TRANSMIT_MESSAGE'
                )}
              </motion.button>

              <AnimatePresence>
                {err && (
                  <motion.div
                    className="sys-label px-3 py-2 rounded-sm"
                    style={{ fontSize: '9px', color: 'var(--fire)', border: '1px solid var(--fire)', background: 'rgba(245,158,11,0.06)' }}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    {err}
                  </motion.div>
                )}
                {sent && (
                  <motion.div
                    className="sys-label px-3 py-2 rounded-sm text-center"
                    style={{ fontSize: '9px', color: 'var(--live)', border: '1px solid var(--live)', background: 'rgba(16,185,129,0.06)' }}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    UPLINK_ESTABLISHED — MESSAGE QUEUED FOR DELIVERY
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </motion.div>

          {/* Channel index */}
          <motion.div
            className="flex flex-col gap-4"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            {/* Status card */}
            <div className="sys-panel p-5">
              <div className="flex items-center gap-2 mb-4">
                <span className="status-dot dot-live" style={{ animation: 'blink 1.4s ease-in-out infinite' }} />
                <span className="sys-label" style={{ fontSize: '9px', color: 'var(--live)', letterSpacing: '0.18em' }}>
                  OPERATOR_STATUS
                </span>
              </div>
              <div
                className="display-headline"
                style={{ fontSize: '18px', color: 'var(--live)', marginBottom: '6px' }}
              >
                AVAILABLE
              </div>
              <p className="sys-label-dim" style={{ fontSize: '9px', letterSpacing: '0.06em' }}>
                Open to new missions, consulting, and collaboration.<br />
                Response latency: &lt;24h.
              </p>
            </div>

            {/* Channel links */}
            <div className="sys-panel p-5 space-y-3">
              <div
                className="sys-label mb-4"
                style={{ fontSize: '9px', color: 'var(--text-3)', letterSpacing: '0.18em' }}
              >
                ACTIVE_CHANNELS
              </div>
              {CHANNELS.map((ch, i) => (
                <motion.a
                  key={ch.label}
                  href={ch.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 py-2 transition-colors group"
                  style={{ color: 'var(--text-3)', textDecoration: 'none' }}
                  initial={{ opacity: 0, x: 15 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  onMouseEnter={e => (e.currentTarget.style.color = ch.color)}
                  onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-3)')}
                >
                  <ch.icon size={13} />
                  <div>
                    <div
                      className="sys-label"
                      style={{ fontSize: '8px', letterSpacing: '0.14em', color: 'inherit' }}
                    >
                      {ch.label}
                    </div>
                    <div className="sys-label-dim" style={{ fontSize: '9px', letterSpacing: '0.06em' }}>
                      {ch.value}
                    </div>
                  </div>
                </motion.a>
              ))}
            </div>

            {/* ASCII signature */}
            <div
              className="sys-panel p-4"
              style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '9px', lineHeight: '1.5', color: 'var(--text-3)', opacity: 0.5 }}
            >
              <div>{'// BJR_SYS v9.0'}</div>
              <div>{'// SALESFORCE_ARCH'}</div>
              <div>{'// AI_AGENTIC_DEV'}</div>
              <div>{'// READY_TO_EVOLVE'}</div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
