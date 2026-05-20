import './globals.css'
import type { Metadata } from 'next'
import { Syne, Inter, JetBrains_Mono } from 'next/font/google'
import { ThemeProvider } from "@/contexts/ThemeContext";

const syne = Syne({ subsets: ['latin'], variable: '--font-syne', weight: ['400','500','600','700','800'] })
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono', weight: ['300','400','500','600','700'] })

export const metadata: Metadata = {
  title: {
    default: 'Bennie Joseph — Salesforce Certified Application Architect',
    template: '%s | Bennie Joseph',
  },
  description:
    'Salesforce Certified Application Architect with 9+ years building enterprise solutions. Expert in Agentforce, AI agents, Apex, LWC, and SaaS. Available for consulting and freelance projects.',
  keywords: [
    'Salesforce Application Architect',
    'Salesforce Certified Architect',
    'Agentforce developer',
    'Salesforce AI consultant',
    'Apex developer',
    'Lightning Web Components developer',
    'Salesforce integration architect',
    'Salesforce freelance consultant',
    'AI agent development',
    'Salesforce nCino',
    'Salesforce agentic systems',
    'enterprise Salesforce developer India',
    'Salesforce AI builder',
    'hire Salesforce architect',
  ],
  authors: [{ name: 'Bennie Joseph', url: 'https://benniejoseph.dev' }],
  metadataBase: new URL('https://benniejoseph.dev'),
  openGraph: {
    title: 'Bennie Joseph — Salesforce Certified Application Architect',
    description:
      'Salesforce Certified Application Architect with 9+ years. Expert in Agentforce, AI agents, Apex, and LWC. Building enterprise solutions and AI-powered SaaS products.',
    type: 'website',
    url: 'https://benniejoseph.dev',
    siteName: 'Bennie Joseph',
    images: [{ url: '/api/og?title=Bennie+Joseph&tags=Salesforce,AI', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bennie Joseph — Salesforce Certified Application Architect',
    description: 'Salesforce Certified Application Architect with 9+ years. Expert in Agentforce, AI agents, Apex, and LWC.',
    images: ['/api/og?title=Bennie+Joseph&tags=Salesforce,AI'],
  },
  robots: { index: true, follow: true },
  alternates: {
    canonical: 'https://benniejoseph.dev',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${syne.variable} ${inter.variable} ${mono.variable}`}>
      <body className="antialiased" style={{ fontFamily: 'var(--font-inter, Inter, system-ui, sans-serif)' }}>
        {/* FOUC prevention — runs before React hydrates. Default: light. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');document.documentElement.setAttribute('data-theme',t||'light');}catch(e){document.documentElement.setAttribute('data-theme','light');}})();`,
          }}
        />
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
