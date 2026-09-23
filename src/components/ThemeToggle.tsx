'use client'
import { FiSun, FiMoon } from 'react-icons/fi'
import { useTheme } from '@/contexts/ThemeContext'

export default function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme()
  return (
    <button
      onClick={toggleTheme}
      className="flex items-center justify-center w-11 h-11 rounded-full transition-colors hover:bg-white/10"
      style={{ color: 'var(--text-2)', border: '1px solid var(--border-2)' }}
      aria-label={isDark ? 'Use light theme' : 'Use dark theme'}
      title={isDark ? 'Use light theme' : 'Use dark theme'}
    >
      {isDark ? <FiSun size={17} /> : <FiMoon size={17} />}
    </button>
  )
}
