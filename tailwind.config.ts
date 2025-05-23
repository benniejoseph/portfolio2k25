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
       // --- Paste the theme customizations from the previous example ---
      colors: {
        primary: '#0070D2', // Salesforce Blue
        secondary: '#00A1E0', // Lighter Blue
        accent: '#FAFAFA', // Light Gray / White accent
        dark: '#16325c', // Dark Blue/Navy
        lightText: '#E0E0E0',
        darkText: '#2c2c2c',
        // Add your dark background if not defined globally
        backgroundDark: '#0a192f',
        backgroundSlightlyDarker: '#0f213d',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // Example font (ensure imported in layout/globals)
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
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
       // --- End of pasted theme ---
    },
  },
  plugins: [],
}
export default config