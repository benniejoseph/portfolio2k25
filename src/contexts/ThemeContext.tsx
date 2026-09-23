"use client"
import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>('dark')
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const frame = window.requestAnimationFrame(() => {
      const savedTheme = window.localStorage?.getItem('theme') as Theme | null;
      const systemTheme: Theme = window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
      setTheme(savedTheme === 'dark' || savedTheme === 'light' ? savedTheme : systemTheme)
      setMounted(true);
    })

    return () => window.cancelAnimationFrame(frame)
  }, []);

  useEffect(() => {
    if (!mounted || typeof window === 'undefined') return;
    window.localStorage?.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme, mounted]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  const value = {
    theme,
    toggleTheme,
    isDark: theme === 'dark'
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
