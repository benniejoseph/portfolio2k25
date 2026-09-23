'use client'

import { useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import emailjs from 'emailjs-com'
import { FiGithub, FiLinkedin, FiMail, FiSend } from 'react-icons/fi'

const CHANNELS = [
  { icon: FiMail, label: 'Email', value: 'benniejoseph.r@gmail.com', href: 'mailto:benniejoseph.r@gmail.com', color: 'var(--signal)' },
  { icon: FiLinkedin, label: 'LinkedIn', value: 'benniejosephrichard', href: 'https://linkedin.com/in/benniejosephrichard', color: 'var(--neural)' },
  { icon: FiGithub, label: 'GitHub', value: 'benniejoseph', href: 'https://github.com/benniejoseph', color: 'var(--live)' },
]

export default function Contact() {
  const form = useRef<HTMLFormElement>(null)
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [focused, setFocused] = useState<string | null>(null)

  const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID
  const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID
  const userId = process.env.NEXT_PUBLIC_EMAILJS_USER_ID

  const send = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setErrorMessage(null)

    const formData = new FormData(event.currentTarget)
    if (String(formData.get('website') || '').trim()) return

    if (!serviceId || !templateId || !userId) {
      setErrorMessage('The contact form is not configured right now. Please email me directly instead.')
      return
    }

    setSending(true)
    emailjs.sendForm(serviceId, templateId, form.current!, userId)
      .then(() => {
        setSent(true)
        setSending(false)
        form.current?.reset()
        setTimeout(() => setSent(false), 6000)
      }, () => {
        setErrorMessage('The message could not be sent. Please try again or email me directly.')
        setSending(false)
      })
  }

  const fieldStyle = (name: string) => ({
    width: '100%',
    minHeight: '48px',
    padding: '12px 14px',
    borderRadius: '14px',
    border: `1px solid ${focused === name ? 'var(--signal)' : 'var(--border-2)'}`,
    background: 'color-mix(in srgb, var(--panel-2) 80%, transparent)',
    color: 'var(--text)',
    fontFamily: 'var(--font-inter, sans-serif)',
    fontSize: '16px',
    outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    boxShadow: focused === name ? '0 0 0 3px color-mix(in srgb, var(--signal) 16%, transparent)' : 'none',
  } as React.CSSProperties)

  return (
    <section id="contact" className="relative px-6 py-24 lg:px-12">
      <div className="mx-auto max-w-5xl">
        <motion.div
          className="mb-14 max-w-3xl"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
        >
          <div className="mb-4 flex items-center gap-3">
            <span className="status-dot dot-live" />
            <span className="sys-label">Contact</span>
          </div>
          <h2
            className="display-headline"
            style={{ fontSize: 'clamp(38px, 6vw, 68px)', color: 'var(--text)', lineHeight: 0.98 }}
          >
            Let&apos;s compare notes on what makes{' '}
            <span style={{ color: 'var(--signal)' }}>customer value real.</span>
          </h2>
          <p className="mt-5 max-w-2xl text-sm leading-7" style={{ color: 'var(--text-2)' }}>
            Reach out to talk Salesforce, customer success, enterprise architecture, or the practical path from an AI idea to a trusted production experience.
          </p>
        </motion.div>

        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
          <motion.div
            className="overflow-hidden rounded-[30px] border p-6 sm:p-8"
            style={{
              borderColor: 'color-mix(in srgb, var(--signal) 30%, var(--border))',
              background: 'color-mix(in srgb, var(--panel) 86%, transparent)',
              backdropFilter: 'blur(22px)',
            }}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
          >
            <div className="mb-7">
              <h3 className="text-xl font-semibold" style={{ color: 'var(--text)' }}>Send a message</h3>
              <p className="mt-2 text-sm leading-6" style={{ color: 'var(--text-2)' }}>A little context helps me give you a useful reply.</p>
            </div>

            <form ref={form} onSubmit={send} className="space-y-5">
              <div aria-hidden="true" style={{ position: 'absolute', left: '-10000px', width: '1px', height: '1px', overflow: 'hidden' }}>
                <label htmlFor="contact-website">Leave this field empty</label>
                <input id="contact-website" type="text" name="website" tabIndex={-1} autoComplete="off" />
              </div>
              <div>
                <label htmlFor="contact-name" className="mb-2 block text-sm font-medium" style={{ color: 'var(--text)' }}>Name</label>
                <input
                  id="contact-name"
                  type="text"
                  name="name"
                  autoComplete="name"
                  maxLength={100}
                  required
                  style={fieldStyle('name')}
                  onFocus={() => setFocused('name')}
                  onBlur={() => setFocused(null)}
                />
              </div>

              <div>
                <label htmlFor="contact-email" className="mb-2 block text-sm font-medium" style={{ color: 'var(--text)' }}>Email</label>
                <input
                  id="contact-email"
                  type="email"
                  name="email"
                  autoComplete="email"
                  maxLength={254}
                  required
                  style={fieldStyle('email')}
                  onFocus={() => setFocused('email')}
                  onBlur={() => setFocused(null)}
                />
              </div>

              <div>
                <label htmlFor="contact-message" className="mb-2 block text-sm font-medium" style={{ color: 'var(--text)' }}>What would you like to discuss?</label>
                <textarea
                  id="contact-message"
                  name="message"
                  required
                  maxLength={3000}
                  rows={6}
                  style={{ ...fieldStyle('message'), minHeight: '150px', resize: 'vertical' }}
                  onFocus={() => setFocused('message')}
                  onBlur={() => setFocused(null)}
                />
              </div>

              <motion.button
                type="submit"
                disabled={sending || sent}
                className="terminal-cmd terminal-cmd-solid min-h-12 w-full justify-center rounded-full text-sm disabled:cursor-not-allowed disabled:opacity-70"
                whileHover={{ scale: sending || sent ? 1 : 1.01 }}
                whileTap={{ scale: sending || sent ? 1 : 0.985 }}
              >
                <FiSend size={15} aria-hidden="true" />
                {sending ? 'Sending…' : sent ? 'Message sent' : 'Send message'}
              </motion.button>

              <div aria-live="polite" aria-atomic="true">
                <AnimatePresence mode="wait">
                  {errorMessage && (
                    <motion.p
                      key="error"
                      role="alert"
                      className="rounded-2xl border px-4 py-3 text-sm leading-6"
                      style={{ color: 'var(--fire)', borderColor: 'color-mix(in srgb, var(--fire) 44%, transparent)', background: 'color-mix(in srgb, var(--fire) 8%, transparent)' }}
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                    >
                      {errorMessage}
                    </motion.p>
                  )}
                  {sent && (
                    <motion.p
                      key="success"
                      role="status"
                      className="rounded-2xl border px-4 py-3 text-sm leading-6"
                      style={{ color: 'var(--live)', borderColor: 'color-mix(in srgb, var(--live) 44%, transparent)', background: 'color-mix(in srgb, var(--live) 8%, transparent)' }}
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                    >
                      Thanks — your message has been sent.
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </form>
          </motion.div>

          <motion.aside
            className="flex flex-col gap-4"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.1 }}
          >
            <div
              className="rounded-[26px] border p-6"
              style={{ borderColor: 'var(--border)', background: 'color-mix(in srgb, var(--panel) 84%, transparent)', backdropFilter: 'blur(18px)' }}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.14em]" style={{ color: 'var(--signal)' }}>Current chapter</p>
              <h3 className="mt-3 text-xl font-semibold" style={{ color: 'var(--text)' }}>Customer Success at Salesforce</h3>
              <p className="mt-3 text-sm leading-6" style={{ color: 'var(--text-2)' }}>Started September 2026, bringing an architect&apos;s perspective to adoption and customer outcomes.</p>
            </div>

            <div
              className="rounded-[26px] border p-4"
              style={{ borderColor: 'var(--border)', background: 'color-mix(in srgb, var(--panel) 84%, transparent)', backdropFilter: 'blur(18px)' }}
            >
              {CHANNELS.map((channel) => (
                <a
                  key={channel.label}
                  href={channel.href}
                  target={channel.label === 'Email' ? undefined : '_blank'}
                  rel={channel.label === 'Email' ? undefined : 'noopener noreferrer'}
                  className="flex min-h-12 items-center gap-3 rounded-2xl px-3 py-2 transition-colors hover:bg-[var(--signal-dim)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                  style={{ color: 'var(--text-2)', outlineColor: channel.color }}
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full" style={{ color: channel.color, background: `color-mix(in srgb, ${channel.color} 10%, transparent)` }}>
                    <channel.icon size={17} aria-hidden="true" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold" style={{ color: 'var(--text)' }}>{channel.label}</span>
                    <span className="block truncate text-xs">{channel.value}</span>
                  </span>
                </a>
              ))}
            </div>
          </motion.aside>
        </div>
      </div>
    </section>
  )
}
