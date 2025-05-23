// src/app/layout.tsx
import './globals.css' // <--- IMPORT GLOBALS CSS HERE
import type { Metadata } from 'next'
// Remove Inter import here if using @import in globals.css
// import { Inter } from 'next/font/google'


// const inter = Inter({ subsets: ['latin'] }) // Remove if using @import

export const metadata: Metadata = {
  // --- Update Title/Description ---
  title: 'Bennie J Richard - Salesforce Developer',
  description: 'Portfolio of Bennie J Richard, a Salesforce Developer Engineer specializing in Apex, LWC, and building scalable solutions.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
       <body data-new-gr-c-s-check-loaded="14.1234.0" data-gr-ext-installed="">{children}</body>
    </html>
  )
}