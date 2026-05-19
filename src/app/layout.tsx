// src/app/layout.tsx
import './globals.css' // <--- IMPORT GLOBALS CSS HERE
import type { Metadata } from 'next'
// Remove Inter import here if using @import in globals.css
// import { Inter } from 'next/font/google'
import { ThemeProvider } from "@/contexts/ThemeContext";


// const inter = Inter({ subsets: ['latin'] }) // Remove if using @import

export const metadata: Metadata = {
  title: {
    default: 'Bennie Joseph — Salesforce Architect & AI Builder',
    template: '%s | Bennie Joseph',
  },
  description:
    'Salesforce Certified Application Architect with 9+ years building enterprise solutions. Also building AI agents, SaaS products, and writing about the intersection of Salesforce and AI.',
  keywords: 'Salesforce, AI, Agentforce, Apex, LWC, Next.js, React, Application Architect',
  authors: [{ name: 'Bennie Joseph', url: 'https://benniejoseph.dev' }],
  metadataBase: new URL('https://benniejoseph.dev'),
  openGraph: {
    title: 'Bennie Joseph — Salesforce Architect & AI Builder',
    description:
      'Salesforce Certified Application Architect building enterprise solutions and AI-powered products.',
    type: 'website',
    url: 'https://benniejoseph.dev',
    siteName: 'Bennie Joseph',
    images: [{ url: '/api/og?title=Bennie+Joseph&tags=Salesforce,AI', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bennie Joseph — Salesforce Architect & AI Builder',
    description: 'Salesforce Certified Application Architect building enterprise solutions and AI-powered products.',
    images: ['/api/og?title=Bennie+Joseph&tags=Salesforce,AI'],
  },
  robots: { index: true, follow: true },
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