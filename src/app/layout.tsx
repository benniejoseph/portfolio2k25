import './globals.css'
import type { Metadata } from 'next'
import { Syne, Inter, JetBrains_Mono } from 'next/font/google'
import { ThemeProvider } from "@/contexts/ThemeContext";
import { absoluteUrl, siteConfig, siteUrl } from '@/lib/site'

const syne = Syne({ subsets: ['latin'], variable: '--font-syne', weight: ['400','500','600','700','800'] })
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono', weight: ['300','400','500','600','700'] })

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: siteConfig.name,
  creator: siteConfig.author.name,
  publisher: siteConfig.author.name,
  category: 'technology',
  title: {
    default: siteConfig.title,
    template: '%s | Bennie Joseph',
  },
  description: siteConfig.description,
  keywords: [...siteConfig.keywords],
  authors: [{ name: siteConfig.author.name, url: siteUrl }],
  alternates: {
    canonical: '/',
    types: {
      'application/rss+xml': absoluteUrl('/blog/rss.xml'),
    },
  },
  openGraph: {
    title: siteConfig.title,
    description: siteConfig.description,
    type: 'website',
    url: siteUrl,
    siteName: siteConfig.name,
    locale: 'en_US',
    images: [{ url: absoluteUrl('/api/og?title=Bennie+Joseph&tags=Salesforce,AI'), width: 1200, height: 630, alt: siteConfig.title }],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.title,
    description: siteConfig.description,
    images: [absoluteUrl('/api/og?title=Bennie+Joseph&tags=Salesforce,AI')],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
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
