// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    // Configure Tailwind to scan files in the 'src' directory
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}', // Keep if you might add a 'pages' dir later
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}', // Most important for App Router
  ],
  theme: {
    extend: {
      colors: {
        primary: '#64ffda',
        'primary-dark': '#45e6c3',
        secondary: '#0a192f',
        accent: '#ff6b6b',
        dark: '#020c1b',
        'light-text': '#ccd6f6',
        'dark-text': '#8892b0',
        'background-dark': '#0a192f',
        'background-slightly-darker': '#112240',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['Fira Code', 'monospace'],
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #64ffda 0%, #45e6c3 100%)',
        'gradient-dark': 'linear-gradient(135deg, #0a192f 0%, #112240 100%)',
        'gradient-text': 'linear-gradient(120deg, #64ffda 0%, #ff6b6b 100%)',
      },
      animation: {
        'fade-in': 'fadeIn 1s ease-out forwards',
        'slide-in-up': 'slideInUp 0.8s ease-out forwards',
        // Add bounce if needed (like for the down arrow)
        'bounce-slow': 'bounce 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' }, // Use string values for opacity keyframes
          '100%': { opacity: '1' },
        },
        slideInUp: {
          '0%': { transform: 'translateY(30px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        // Ensure bounce keyframes exist if used in animation
        bounce: {
          '0%, 100%': {
            transform: 'translateY(-15%)', // Adjusted intensity
            animationTimingFunction: 'cubic-bezier(0.8, 0, 1, 1)',
          },
          '50%': {
            transform: 'translateY(0)',
            animationTimingFunction: 'cubic-bezier(0, 0, 0.2, 1)',
          },
        },
      },
    },
  },
  plugins: [],
}
export default config