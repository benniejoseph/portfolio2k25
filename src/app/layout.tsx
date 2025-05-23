// src/app/layout.tsx
import './globals.css' // <--- IMPORT GLOBALS CSS HERE
import type { Metadata } from 'next'
// Remove Inter import here if using @import in globals.css
// import { Inter } from 'next/font/google'
import { ThemeProvider } from "@/contexts/ThemeContext";


// const inter = Inter({ subsets: ['latin'] }) // Remove if using @import

export const metadata: Metadata = {
  // --- Update Title/Description ---
  title: 'Bennie Joseph - Salesforce Senior Consultant',
  description: 'Expert Salesforce consultant specializing in AI integration, React, Next.js, and enterprise solutions.',
  keywords: 'Salesforce, AI, React, Next.js, Developer, Consultant',
  authors: [{ name: 'Bennie Joseph' }],
  openGraph: {
    title: 'Bennie Joseph - Salesforce Senior Consultant',
    description: 'Expert Salesforce consultant specializing in AI integration, React, Next.js, and enterprise solutions.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}