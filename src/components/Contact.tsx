"use client"
import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import emailjs from 'emailjs-com';
import { 
  FiMail, 
  FiSend, 
  FiCheck, 
  FiUser, 
  FiAtSign, 
  FiMessageCircle,
  FiGithub,
  FiLinkedin
} from 'react-icons/fi';

const Contact: React.FC = () => {
  const form = useRef<HTMLFormElement | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // EmailJS Configuration
  const SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
  const TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
  const USER_ID = process.env.NEXT_PUBLIC_EMAILJS_USER_ID;

  const sendEmail = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!SERVICE_ID || !TEMPLATE_ID || !USER_ID) {
      setError("EmailJS credentials are missing. Please configure them.");
      return;
    }

    setIsSending(true);

    emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, form.current as HTMLFormElement, USER_ID)
      .then(() => {
        console.log('EmailJS Success:', 'Message sent successfully');
        setIsSent(true);
        setIsSending(false);
        form.current?.reset();
        setTimeout(() => setIsSent(false), 5000);
      }, (error) => {
        console.error('EmailJS Error:', error.text);
        setError('Failed to send message. Please try again later.');
        setIsSending(false);
      });
  };

  const contactInfo = [
    {
      icon: FiMail,
      label: 'Email',
      value: 'benniejoseph.r@gmail.com',
      href: 'mailto:benniejoseph.r@gmail.com'
    },
    {
      icon: FiLinkedin,
      label: 'LinkedIn',
      value: '/in/benniejosephrichard',
      href: 'https://linkedin.com/in/benniejosephrichard'
    },
    {
      icon: FiGithub,
      label: 'GitHub',
      value: '/benniejoseph',
      href: 'https://github.com/benniejoseph'
    }
  ];

  const formFields = [
    {
      name: 'name',
      label: 'Your Name',
      type: 'text',
      placeholder: 'John Doe',
      icon: FiUser,
      required: true
    },
    {
      name: 'email',
      label: 'Email Address',
      type: 'email',
      placeholder: 'john@example.com',
      icon: FiAtSign,
      required: true
    },
    {
      name: 'message',
      label: 'Message',
      type: 'textarea',
      placeholder: 'Tell me about your project or just say hello!',
      icon: FiMessageCircle,
      required: true,
      rows: 5
    }
  ];

  return (
    <section id="contact" className="section relative overflow-hidden">
      <div className="container">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="inline-flex items-center gap-3 mb-6"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="p-3 glass rounded-xl">
              <FiMail 
                size={24} 
                style={{ color: 'var(--color-accent-primary)' }}
              />
            </div>
            <span 
              className="font-mono text-sm font-medium tracking-wider uppercase"
              style={{ color: 'var(--color-text-tertiary)' }}
            >
               Contact
            </span>
          </motion.div>

          <motion.h2
            className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-6"
            style={{ color: 'var(--color-text-primary)' }}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            Let&apos;s Create{' '}
            <span className="gradient-text">Together</span>
          </motion.h2>

          <motion.p
            className="text-lg md:text-xl max-w-3xl mx-auto leading-relaxed"
            style={{ color: 'var(--color-text-tertiary)' }}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Have a project in mind or just want to chat? I&apos;m always open to discussing new opportunities and interesting challenges.
          </motion.p>
        </motion.div>

        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-start">
          {/* Contact Information */}
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="glass p-8 rounded-2xl">
              <h3 
                className="text-2xl font-heading font-bold mb-6"
                style={{ color: 'var(--color-text-primary)' }}
              >
                Get In Touch
              </h3>
              
              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <motion.a
                    key={info.label}
                    href={info.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 p-4 rounded-xl transition-all duration-300 group hover:scale-105"
                    style={{ backgroundColor: 'var(--color-bg-tertiary)' }}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                    whileHover={{ x: 10 }}
                  >
                    <div 
                      className="p-3 rounded-lg"
                      style={{ backgroundColor: 'var(--color-accent-primary)' }}
                    >
                      <info.icon size={20} color="white" />
                    </div>
                    <div>
                      <h4 
                        className="font-semibold mb-1"
                        style={{ color: 'var(--color-text-primary)' }}
                      >
                        {info.label}
                      </h4>
                      <p 
                        className="text-sm"
                        style={{ color: 'var(--color-text-secondary)' }}
                      >
                        {info.value}
                      </p>
                    </div>
                  </motion.a>
                ))}
              </div>

              {/* Availability Status */}
              <motion.div
                className="mt-8 p-4 rounded-xl border"
                style={{ 
                  backgroundColor: 'var(--color-bg-tertiary)',
                  borderColor: 'var(--color-success)'
                }}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.8 }}
              >
                <div className="flex items-center gap-3">
                  <div 
                    className="w-3 h-3 rounded-full animate-pulse"
                    style={{ backgroundColor: 'var(--color-success)' }}
                  />
                  <span 
                    className="font-medium"
                    style={{ color: 'var(--color-text-primary)' }}
                  >
                    Available for new projects
                  </span>
                </div>
                <p 
                  className="text-sm mt-2"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  Usually responds within 24 hours
                </p>
              </motion.div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <form
              ref={form}
              onSubmit={sendEmail}
              className="glass p-8 rounded-2xl space-y-6"
            >
              <h3 
                className="text-2xl font-heading font-bold mb-6"
                style={{ color: 'var(--color-text-primary)' }}
              >
                Send a Message
              </h3>

              {formFields.map((field, index) => (
                <motion.div
                  key={field.name}
                  className="relative"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                >
                  <label 
                    htmlFor={field.name}
                    className="block text-sm font-medium mb-2"
                    style={{ color: 'var(--color-text-secondary)' }}
                  >
                    {field.label}
                    {field.required && (
                      <span style={{ color: 'var(--color-error)' }}>*</span>
                    )}
                  </label>
                  
                  <div className="relative">
                    <div 
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10"
                      style={{ 
                        color: focusedField === field.name 
                          ? 'var(--color-accent-primary)' 
                          : 'var(--color-text-tertiary)' 
                      }}
                    >
                      <field.icon size={18} />
                    </div>
                    
                    {field.type === 'textarea' ? (
                      <textarea
                        id={field.name}
                        name={field.name}
                        rows={field.rows}
                        required={field.required}
                        placeholder={field.placeholder}
                        className="w-full pl-12 pr-4 py-3 rounded-xl border transition-all duration-300 resize-none"
                        style={{
                          backgroundColor: 'var(--color-bg-secondary)',
                          borderColor: focusedField === field.name 
                            ? 'var(--color-accent-primary)' 
                            : 'var(--color-border)',
                          color: 'var(--color-text-primary)',
                          boxShadow: focusedField === field.name 
                            ? 'var(--shadow-glow)' 
                            : 'none'
                        }}
                        onFocus={() => setFocusedField(field.name)}
                        onBlur={() => setFocusedField(null)}
                      />
                    ) : (
                      <input
                        type={field.type}
                        id={field.name}
                        name={field.name}
                        required={field.required}
                        placeholder={field.placeholder}
                        className="w-full pl-12 pr-4 py-3 rounded-xl border transition-all duration-300"
                        style={{
                          backgroundColor: 'var(--color-bg-secondary)',
                          borderColor: focusedField === field.name 
                            ? 'var(--color-accent-primary)' 
                            : 'var(--color-border)',
                          color: 'var(--color-text-primary)',
                          boxShadow: focusedField === field.name 
                            ? 'var(--shadow-glow)' 
                            : 'none'
                        }}
                        onFocus={() => setFocusedField(field.name)}
                        onBlur={() => setFocusedField(null)}
                      />
                    )}
                  </div>
                </motion.div>
              ))}

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={isSending || isSent}
                className="w-full btn-modern relative overflow-hidden"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.9 }}
              >
                <span className="flex items-center justify-center gap-2">
                  {isSending ? (
                    <>
                      <motion.div
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      />
                      Sending...
                    </>
                  ) : isSent ? (
                    <>
                      <FiCheck size={20} />
                      Message Sent!
                    </>
                  ) : (
                    <>
                      <FiSend size={20} />
                      Send Message
                    </>
                  )}
                </span>
              </motion.button>

              {/* Success/Error Messages */}
              <AnimatePresence>
                {isSent && (
                  <motion.div
                    className="text-center p-4 rounded-xl"
                    style={{ 
                      backgroundColor: 'var(--color-success)',
                      color: 'white'
                    }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                  >
                    ✨ Thank you! Your message has been sent successfully. I&apos;ll get back to you soon!
                  </motion.div>
                )}
                
                {error && (
                  <motion.div
                    className="text-center p-4 rounded-xl"
                    style={{ 
                      backgroundColor: 'var(--color-error)',
                      color: 'white'
                    }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                  >
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </motion.div>
        </div>
      </div>

      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 -left-32 w-64 h-64 rounded-full opacity-10"
          style={{ 
            background: 'var(--color-accent-gradient)',
            filter: 'blur(40px)'
          }}
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute bottom-20 -right-32 w-48 h-48 rounded-full opacity-10"
          style={{ 
            background: 'var(--color-accent-gradient)',
            filter: 'blur(40px)'
          }}
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>
    </section>
  );
};

export default Contact;