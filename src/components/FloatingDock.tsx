"use client"
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/contexts/ThemeContext';
import { 
  FiHome, 
  FiUser, 
  FiBriefcase, 
  FiCode, 
  FiMail, 
  FiSun, 
  FiMoon,
  FiAward
} from 'react-icons/fi';

interface DockItem {
  id: string;
  icon: React.ElementType;
  label: string;
  href: string;
  action?: () => void;
}

const FloatingDock: React.FC = () => {
  const { isDark, toggleTheme } = useTheme();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);
  const dockRef = useRef<HTMLDivElement>(null);

  const dockItems: DockItem[] = [
    { id: 'home', icon: FiHome, label: 'Home', href: '#home' },
    { id: 'skills', icon: FiUser, label: 'Skills', href: '#skills' },
    { id: 'certifications', icon: FiAward, label: 'Certifications', href: '#certifications' },
    { id: 'projects', icon: FiCode, label: 'Projects', href: '#projects' },
    { id: 'work', icon: FiBriefcase, label: 'Experience', href: '#work' },
    { id: 'contact', icon: FiMail, label: 'Contact', href: '#contact' },
    { 
      id: 'theme', 
      icon: isDark ? FiSun : FiMoon, 
      label: isDark ? 'Light Mode' : 'Dark Mode', 
      href: '#',
      action: toggleTheme
    },
  ];

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (dockRef.current && !isMobile) {
        const rect = dockRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        setMousePosition({
          x: e.clientX - centerX,
          y: e.clientY - centerY
        });
      }
    };

    if (hoveredItem && !isMobile) {
      document.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [hoveredItem, isMobile]);

  const handleClick = (item: DockItem) => {
    if (item.action) {
      item.action();
    } else {
      const element = document.querySelector(item.href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const getDockItemTransform = (itemId: string) => {
    if (hoveredItem !== itemId || isMobile) return 'scale(1) translateY(0)';
    
    const distance = Math.sqrt(mousePosition.x ** 2 + mousePosition.y ** 2);
    const maxDistance = 100;
    const scale = Math.max(1, 1.5 - (distance / maxDistance) * 0.5);
    const translateY = Math.max(-20, -40 + (distance / maxDistance) * 20);
    
    return `scale(${scale}) translateY(${translateY}px)`;
  };

  return (
    <motion.div
      ref={dockRef}
      className="fixed bottom-4 md:bottom-6 left-0 right-0 z-50 flex justify-center px-4"
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 1, duration: 0.8, type: "spring", bounce: 0.3 }}
    >
      <div className="glass p-2 md:p-3 rounded-xl md:rounded-2xl backdrop-blur-xl border border-white/20 shadow-2xl max-w-[90vw] overflow-x-auto">
        <div className="flex items-center space-x-1 md:space-x-2 min-w-max">
          {dockItems.map((item, index) => (
            <div key={item.id} className="relative">
              <motion.button
                className="relative p-2 md:p-3 rounded-lg md:rounded-xl transition-all duration-300 group magnetic touch-manipulation"
                style={{
                  transform: getDockItemTransform(item.id),
                  minWidth: '44px',
                  minHeight: '44px'
                }}
                onMouseEnter={() => !isMobile && setHoveredItem(item.id)}
                onMouseLeave={() => !isMobile && setHoveredItem(null)}
                onTouchStart={() => setHoveredItem(item.id)}
                onTouchEnd={() => setTimeout(() => setHoveredItem(null), 1000)}
                onClick={() => handleClick(item)}
                whileHover={!isMobile ? { 
                  scale: 1.2,
                  backgroundColor: 'var(--color-accent-primary)',
                  color: 'white'
                } : {}}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  delay: 1.2 + index * 0.1,
                  duration: 0.5,
                  type: "spring"
                }}
              >
                {React.createElement(item.icon, {
                  size: isMobile ? 18 : 20,
                  className: "transition-colors duration-300 group-hover:text-white",
                  style: { color: 'var(--color-text-primary)' }
                })}
                
                {/* Glow effect */}
                <div className="absolute inset-0 rounded-lg md:rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-xl -z-10" />
              </motion.button>

              {/* Tooltip */}
              <AnimatePresence>
                {hoveredItem === item.id && (
                  <motion.div
                    className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 pointer-events-none"
                    initial={{ opacity: 0, y: 10, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.8 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="glass px-2 md:px-3 py-1 rounded-lg text-xs md:text-sm font-medium whitespace-nowrap">
                      {item.label}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>

      {/* Dock reflection effect */}
      <div className="absolute inset-0 bg-gradient-to-t from-white/5 to-transparent rounded-xl md:rounded-2xl pointer-events-none" />
    </motion.div>
  );
};

export default FloatingDock; 