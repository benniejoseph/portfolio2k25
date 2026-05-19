import './globals.css'
import type { Metadata } from 'next'
import { Syne, Inter, JetBrains_Mono } from 'next/font/google'
import { ThemeProvider } from "@/contexts/ThemeContext";

const syne = Syne({ subsets: ['latin'], variable: '--font-syne', weight: ['400','500','600','700','800'] })
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono', weight: ['300','400','500','600','700'] })

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
    <html lang="en" suppressHydrationWarning className={`${syne.variable} ${inter.variable} ${mono.variable}`}>
      <body className="antialiased" style={{ fontFamily: 'var(--font-inter, Inter, system-ui, sans-serif)' }}>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function() {
  try {
    var t = localStorage.getItem('theme');
    if (t) { document.documentElement.setAttribute('data-theme', t); return; }
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
    }
  } catch(e) {}
})();`,
          }}
        />
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}