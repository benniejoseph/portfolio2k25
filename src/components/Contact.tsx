"use client"
import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import emailjs from 'emailjs-com';

const floatingElements = [
  { type: 'plane', style: 'left-4 top-10', delay: 0 },
  { type: 'envelope', style: 'right-8 top-24', delay: 0.2 },
  { type: 'bubble', style: 'left-1/2 top-1/3', delay: 0.4 },
  { type: 'bubble', style: 'right-1/3 bottom-10', delay: 0.6 },
];

const tooltips = [
  'What should we call you?',
  'Where can we reach you?',
  'Share your thoughts!'
];

const Contact: React.FC = () => {
  const form = useRef<HTMLFormElement | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [wiggle, setWiggle] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [focusIdx, setFocusIdx] = useState<number | null>(null);
  const [buttonFly, setButtonFly] = useState(false);

  // --- IMPORTANT: Set up EmailJS ---
  // 1. Go to https://www.emailjs.com/
  // 2. Sign up for a free account.
  // 3. Add a new Email Service (e.g., Gmail).
  // 4. Create an Email Template. Make sure it includes variables like {{from_name}}, {{reply_to}}, {{message}}.
  // 5. Get your Service ID, Template ID, and User ID (Public Key) from your account settings.
  // 6. Store these securely, ideally as environment variables.

  const SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID; // <--- REPLACE or use env var
  const TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID; // <--- REPLACE or use env var
  const USER_ID = process.env.NEXT_PUBLIC_EMAILJS_USER_ID;       // <--- REPLACE or use env var

  const sendEmail = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!SERVICE_ID || !TEMPLATE_ID || !USER_ID) {
        setError("EmailJS credentials are missing. Please configure them.");
        setWiggle(true);
        setTimeout(() => setWiggle(false), 600);
        return;
    }

    setIsSending(true);
    setButtonFly(true);

    emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, form.current as HTMLFormElement, USER_ID)
      .then(() => {
          console.log('EmailJS Success:', 'Message sent successfully');
          setIsSent(true);
          setIsSending(false);
          setShowConfetti(true);
          setButtonFly(false);
          form.current?.reset(); // Reset form fields
          setTimeout(() => setIsSent(false), 3000);
          setTimeout(() => setShowConfetti(false), 3500);
      }, (error) => {
          console.error('EmailJS Error:', error.text);
          setError('Failed to send message. Please try again later.');
          setIsSending(false);
          setButtonFly(true);
          setWiggle(true);
          setTimeout(() => setWiggle(false), 600);
      });
  };

  // Animation variants
  const fieldVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.9 },
    visible: (i: number) => ({ opacity: 1, y: 0, scale: 1, transition: { delay: 0.2 + i * 0.15, duration: 0.6, type: 'spring', bounce: 0.5 } })
  };

  return (
    <section id="contact" className="relative min-h-[100vh] py-20 flex items-center justify-center bg-gradient-to-br from-blue-900 via-sky-900/60 to-purple-900/80 overflow-hidden">
      {/* Animated SVG/Background Flair */}
      <svg className="absolute left-0 top-0 w-full h-full pointer-events-none z-0" width="100%" height="100%">
        <defs>
          <linearGradient id="contact-bg-gradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#2563eb" />
            <stop offset="100%" stopColor="#a21caf" />
          </linearGradient>
        </defs>
        <ellipse cx="15%" cy="25%" rx="120" ry="60" fill="url(#contact-bg-gradient)" opacity="0.10" />
        <ellipse cx="85%" cy="80%" rx="160" ry="80" fill="url(#contact-bg-gradient)" opacity="0.12" />
      </svg>

      {/* Animated Floating Elements */}
      {floatingElements.map((el, i) => (
        <motion.div
          key={i}
          className={`absolute z-10 ${el.style}`}
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 0.7, y: [0, 10, 0] }}
          transition={{ delay: el.delay, duration: 4, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
        >
          {el.type === 'plane' && (
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none"><path d="M4 24L44 4L34 44L22 26L4 24Z" fill="#38bdf8" stroke="#0ea5e9" strokeWidth="2" /><circle cx="22" cy="26" r="2" fill="#0ea5e9" /></svg>
          )}
          {el.type === 'envelope' && (
            <svg width="44" height="32" viewBox="0 0 44 32" fill="none"><rect x="2" y="6" width="40" height="24" rx="4" fill="#fbbf24" stroke="#f59e42" strokeWidth="2" /><path d="M2 6L22 22L42 6" stroke="#f59e42" strokeWidth="2" /></svg>
          )}
          {el.type === 'bubble' && (
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none"><circle cx="18" cy="18" r="16" fill="#a5b4fc" stroke="#6366f1" strokeWidth="2" /><circle cx="24" cy="14" r="2" fill="#6366f1" /><circle cx="14" cy="20" r="1.5" fill="#6366f1" /></svg>
          )}
        </motion.div>
      ))}

      {/* Waving Hand Emoji */}
      <motion.div
        className="absolute left-1/2 top-24 -translate-x-1/2 z-20"
        initial={{ rotate: -20 }}
        animate={{ rotate: [0, 20, -20, 0] }}
        transition={{ duration: 2, repeat: Infinity, repeatType: 'loop', ease: 'easeInOut' }}
      >
        <span className="text-5xl select-none">👋</span>
      </motion.div>

      {/* Confetti Animation */}
      <AnimatePresence>
        {showConfetti && (
          <motion.div
            className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="w-64 h-64 relative"
              initial={{ scale: 0.7 }}
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: 2, repeatType: 'reverse' }}
            >
              {[...Array(18)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-3 h-3 rounded-full"
                  style={{
                    background: `hsl(${i * 20}, 90%, 60%)`,
                    left: `${30 + 30 * Math.cos((i / 18) * 2 * Math.PI)}px`,
                    top: `${30 + 30 * Math.sin((i / 18) * 2 * Math.PI)}px`,
                  }}
                  initial={{ scale: 0 }}
                  animate={{ scale: [1, 1.5, 1] }}
                  transition={{ delay: i * 0.05, duration: 0.7, repeat: 1, repeatType: 'reverse' }}
                />
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Centered Floating Cloud Card */}
      <div className="container max-w-lg mx-auto z-20">
        <motion.h2
          className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-sky-500 bg-clip-text text-transparent text-center mb-10"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6 }}
        >
          Let&apos;s Connect!
        </motion.h2>
        <motion.div
          className="h-1 w-20 bg-gradient-to-r from-blue-600 to-sky-500 mx-auto mb-8 rounded-full"
          initial={{ width: 0 }}
          whileInView={{ width: 80 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        />
        <motion.div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] h-[220px] bg-white/20 rounded-full blur-2xl opacity-60 z-10 hidden md:block"
          initial={{ scale: 0.9 }}
          animate={{ scale: [1, 1.04, 1] }}
          transition={{ duration: 4, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
        />
        <motion.form
          ref={form}
          onSubmit={sendEmail}
          className={`space-y-6 glass-card p-8 rounded-2xl shadow-2xl relative bg-white/20 backdrop-blur-2xl border border-white/20 ${wiggle ? 'animate-shake' : ''}`}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8 }}
        >
          {[['name', 'Name', 'text', 'Your Name'], ['email', 'Email', 'email', 'your.email@example.com'], ['message', 'Message', 'textarea', 'Your message here...']].map(([name, label, type, placeholder], i) => (
            <motion.div key={name}
              custom={i}
              variants={fieldVariants}
              initial="hidden"
              animate="visible"
              className="relative"
            >
              <label htmlFor={name} className="block text-sm font-medium text-lightText mb-1">{label}</label>
              {type === 'textarea' ? (
                <textarea
                  name={name}
                  id={name}
                  rows={5}
                  required
                  className={`w-full px-4 py-2 bg-dark/50 border border-primary/30 rounded-md focus:ring-2 focus:ring-sky-400 focus:border-sky-400 transition duration-200 text-lightText placeholder-lightText/50 ${focusIdx === i ? 'shadow-lg ring-2 ring-sky-300' : ''}`}
                  placeholder={placeholder as string}
                  onFocus={() => setFocusIdx(i)}
                  onBlur={() => setFocusIdx(null)}
                ></textarea>
              ) : (
                <input
                  type={type as string}
                  name={name}
                  id={name}
                  required
                  className={`w-full px-4 py-2 bg-dark/50 border border-primary/30 rounded-md focus:ring-2 focus:ring-sky-400 focus:border-sky-400 transition duration-200 text-lightText placeholder-lightText/50 ${focusIdx === i ? 'shadow-lg ring-2 ring-sky-300' : ''}`}
                  placeholder={placeholder as string}
                  onFocus={() => setFocusIdx(i)}
                  onBlur={() => setFocusIdx(null)}
                />
              )}
              {/* Tooltip */}
              <AnimatePresence>
                {focusIdx === i && (
                  <motion.div
                    className="absolute left-0 -top-8 bg-sky-500 text-white text-xs px-3 py-1 rounded-full shadow-lg z-30"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.3 }}
                  >
                    {tooltips[i]}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
          <div className="text-center relative min-h-[56px]">
            <motion.button
              type="submit"
              disabled={isSending || isSent}
              className={`px-8 py-3 rounded font-semibold transition duration-300 ease-in-out flex items-center justify-center mx-auto
                ${isSent ? 'bg-green-500 text-white cursor-not-allowed' : ''}
                ${isSending ? 'bg-sky-400 text-white cursor-wait' : ''}
                ${!isSending && !isSent ? 'bg-primary text-darkText hover:bg-secondary' : ''}
                relative overflow-hidden`}
              whileTap={{ scale: 0.95 }}
              animate={buttonFly ? { x: [0, 1000], opacity: [1, 0] } : {}}
              transition={{ duration: 1, ease: 'easeInOut' }}
            >
              {isSending ? (
                <motion.span
                  initial={{ opacity: 1 }}
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ repeat: Infinity, duration: 1 }}
                  className="flex items-center gap-2"
                >
                  <svg width="24" height="24" fill="none" className="animate-spin"><circle cx="12" cy="12" r="10" stroke="#0ea5e9" strokeWidth="4" opacity="0.3" /><path d="M12 2a10 10 0 0 1 10 10" stroke="#0ea5e9" strokeWidth="4" /></svg>
                  Sending...
                </motion.span>
              ) : isSent ? (
                <motion.span
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2"
                >
                  <svg width="24" height="24" fill="none"><circle cx="12" cy="12" r="10" stroke="#22c55e" strokeWidth="4" opacity="0.3" /><path d="M6 12l4 4 8-8" stroke="#22c55e" strokeWidth="3" /></svg>
                  Message Sent!
                </motion.span>
              ) : (
                <span className="flex items-center gap-2">
                  <svg width="24" height="24" fill="none"><path d="M4 12L20 6L14 20L12 14L4 12Z" fill="#38bdf8" stroke="#0ea5e9" strokeWidth="2" /></svg>
                  Send Message
                </span>
              )}
            </motion.button>
            {/* Error Emoji */}
            <AnimatePresence>
              {error && (
                <motion.div
                  className="absolute left-1/2 -translate-x-1/2 top-12 text-3xl select-none"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0, rotate: [0, -10, 10, 0] }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.5 }}
                >
                  😅
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          {error && <motion.p className="mt-4 text-center text-red-400" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>{error}</motion.p>}
        </motion.form>
      </div>
    </section>
  );
};

export default Contact;