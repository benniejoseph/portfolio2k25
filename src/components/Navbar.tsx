"use client"
import React, { useState, useEffect } from 'react';
import { Link as ScrollLink } from 'react-scroll';
import { motion, AnimatePresence } from 'framer-motion';
import { FaGithub, FaLinkedin, FaBars, FaTimes } from 'react-icons/fa';
import useSound from 'use-sound';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [playClick] = useSound('/sounds/click.mp3', { volume: 0.3 });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = ['home', 'skills', 'certifications', 'projects', 'work', 'contact'];

  const handleNavLinkClick = () => {
    if (playClick) playClick();
    setIsMobileMenuOpen(false);
  };

  const handleResumeClick = () => {
    if (playClick) playClick();
  };

  const mobileMenuVariants = {
    closed: {
      opacity: 0,
      x: "100%",
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    },
    open: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    }
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 50, delay: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'glass shadow-lg' 
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo/Name */}
          <ScrollLink
            to="home"
            smooth={true}
            duration={500}
            spy={true}
            offset={-80}
            className="text-xl md:text-2xl lg:text-3xl font-bold cursor-pointer hover:opacity-80 transition-opacity z-50"
            style={{ color: 'var(--color-accent-primary)' }}
            onClick={handleNavLinkClick}
          >
            BJR
          </ScrollLink>

          {/* Centered Desktop Navigation */}
          <div className="hidden lg:flex absolute left-1/2 transform -translate-x-1/2">
            <div className="flex items-center space-x-8">
              {navItems.map((item) => (
                <ScrollLink
                  key={item}
                  to={item}
                  smooth={true}
                  duration={500}
                  spy={true}
                  offset={-70}
                  activeClass="text-accent-primary"
                  className="group capitalize cursor-pointer transition-all duration-300 relative text-base font-medium"
                  style={{ color: 'var(--color-text-secondary)' }}
                  onClick={handleNavLinkClick}
                >
                  {item}
                  <span 
                    className="absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full"
                    style={{ backgroundColor: 'var(--color-accent-primary)' }}
                  />
                </ScrollLink>
              ))}
            </div>
          </div>

          {/* Desktop Right Section */}
          <div className="hidden lg:flex items-center space-x-6">
            {/* Social Icons */}
            <div className="flex items-center space-x-4">
              <a 
                href="https://github.com/benniejoseph" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="p-2 rounded-lg hover:scale-110 transition-all duration-300"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                <FaGithub size={18} />
              </a>
              <a 
                href="https://linkedin.com/in/benniejosephrichard/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="p-2 rounded-lg hover:scale-110 transition-all duration-300"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                <FaLinkedin size={18} />
              </a>
            </div>

            {/* Resume Button */}
            <a
              href="/Bennie_J_Richard_SF.pdf"
              download="Bennie_J_Richard_SF.pdf"
              onClick={handleResumeClick}
              className="btn-modern text-sm px-4 py-2"
            >
              Resume
            </a>
          </div>

          {/* Mobile & Tablet Menu Button */}
          <button
            className="lg:hidden p-2 rounded-lg transition-colors duration-300"
            style={{ color: 'var(--color-text-primary)' }}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={mobileMenuVariants}
            className="fixed inset-0 z-40 lg:hidden"
          >
            {/* Backdrop */}
            <div 
              className="absolute inset-0 backdrop-blur-lg"
              style={{ backgroundColor: 'var(--color-bg-primary)' }}
              onClick={() => setIsMobileMenuOpen(false)}
            />
            
            {/* Menu Content */}
            <div className="relative glass m-4 rounded-2xl p-6 max-w-sm ml-auto">
              <div className="flex flex-col space-y-6">
                {/* Navigation Links */}
                {navItems.map((item, index) => (
                  <motion.div
                    key={item}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <ScrollLink
                      to={item}
                      smooth={true}
                      duration={500}
                      spy={true}
                      offset={-70}
                      activeClass="text-accent-primary"
                      className="block capitalize cursor-pointer transition-colors text-lg font-medium py-2"
                      style={{ color: 'var(--color-text-primary)' }}
                      onClick={handleNavLinkClick}
                    >
                      {item}
                    </ScrollLink>
                  </motion.div>
                ))}
                
                {/* Divider */}
                <div 
                  className="border-t pt-6"
                  style={{ borderColor: 'var(--color-border)' }}
                >
                  {/* Social Icons */}
                  <div className="flex items-center justify-center space-x-6 mb-6">
                    <a 
                      href="https://github.com/benniejoseph" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="p-3 rounded-xl glass hover:scale-110 transition-all duration-300"
                      style={{ color: 'var(--color-text-primary)' }}
                    >
                      <FaGithub size={20} />
                    </a>
                    <a 
                      href="https://linkedin.com/in/benniejosephrichard/" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="p-3 rounded-xl glass hover:scale-110 transition-all duration-300"
                      style={{ color: 'var(--color-text-primary)' }}
                    >
                      <FaLinkedin size={20} />
                    </a>
                  </div>

                  {/* Resume Button */}
                  <a
                    href="/Bennie_J_Richard_SF.pdf"
                    download="Bennie_J_Richard_SF.pdf"
                    onClick={handleResumeClick}
                    className="btn-modern w-full text-center"
                  >
                    Download Resume
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;