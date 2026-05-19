'use client'
import { FiSun, FiMoon } from 'react-icons/fi'
import { useTheme } from '@/contexts/ThemeContext'

export default function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme()
  return (
    <button
      onClick={toggleTheme}
      className="flex items-center justify-center w-8 h-8 rounded-sm transition-colors hover:bg-white/5"
      style={{ color: 'var(--text-3)', border: '1px solid var(--border)' }}
      aria-label="Toggle theme"
    >
      {isDark ? <FiSun size={13} /> : <FiMoon size={13} />}
    </button>
  )
}
