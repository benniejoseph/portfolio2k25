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

  const navItems = ['home', 'skills', 'projects', 'work', 'contact'];

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
          ? 'bg-gradient-to-r from-dark/90 to-dark/80 backdrop-blur-md shadow-lg' 
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto flex justify-between items-center py-6 px-8">
        {/* Logo/Name */}
        <ScrollLink
          to="home"
          smooth={true}
          duration={500}
          spy={true}
          offset={-80}
          className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-sky-500 bg-clip-text text-transparent cursor-pointer hover:opacity-80 transition-opacity"
          onClick={handleNavLinkClick}
        >
          Bennie J Richard
        </ScrollLink>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-12">
          {/* Navigation Links */}
          <div className="flex items-center space-x-10">
            {navItems.map((item) => (
              <ScrollLink
                key={item}
                to={item}
                smooth={true}
                duration={500}
                spy={true}
                offset={-70}
                activeClass="text-primary"
                className="group capitalize text-lightText hover:text-primary cursor-pointer transition-all duration-300 relative text-lg"
                onClick={handleNavLinkClick}
              >
                {item}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" />
              </ScrollLink>
            ))}
          </div>

          {/* Social Icons and Resume */}
          <div className="flex items-center space-x-8 pl-8 border-l border-gray-700">
            {/* Social Icons */}
            <div className="flex items-center space-x-6">
              <a 
                href="https://github.com/benniejoseph" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-lightText hover:text-primary transition-colors hover:scale-110 transform duration-300"
              >
                <FaGithub size={22} />
              </a>
              <a 
                href="https://linkedin.com/in/benniejosephrichard/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-lightText hover:text-primary transition-colors hover:scale-110 transform duration-300"
              >
                <FaLinkedin size={22} />
              </a>
            </div>

            {/* Resume Button */}
            <a
              href="/Bennie_J_Richard_SF.pdf"
              download="Bennie_J_Richard_SF.pdf"
              onClick={handleResumeClick}
              className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-sky-500 text-white rounded-full hover:opacity-90 transition-opacity duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-lg font-medium"
            >
              Resume
            </a>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-lightText hover:text-primary transition-colors"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={mobileMenuVariants}
            className="fixed top-[72px] right-0 w-64 h-screen bg-dark/95 backdrop-blur-md shadow-xl md:hidden"
          >
            <div className="flex flex-col p-6 space-y-6">
              {navItems.map((item) => (
                <ScrollLink
                  key={item}
                  to={item}
                  smooth={true}
                  duration={500}
                  spy={true}
                  offset={-70}
                  activeClass="text-primary"
                  className="capitalize text-lightText hover:text-primary cursor-pointer transition-colors text-lg"
                  onClick={handleNavLinkClick}
                >
                  {item}
                </ScrollLink>
              ))}
              
              <div className="flex items-center space-x-4 pt-4 border-t border-gray-700">
                <a 
                  href="https://github.com/benniejoseph" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-lightText hover:text-primary transition-colors"
                >
                  <FaGithub size={24} />
                </a>
                <a 
                  href="https://linkedin.com/in/benniejosephrichard/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-lightText hover:text-primary transition-colors"
                >
                  <FaLinkedin size={24} />
                </a>
              </div>

              <a
                href="/Bennie_J_Richard_SF.pdf"
                download="Bennie_J_Richard_SF.pdf"
                onClick={handleResumeClick}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-sky-500 text-white rounded-full hover:opacity-90 transition-opacity duration-300 text-center"
              >
                Resume
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;