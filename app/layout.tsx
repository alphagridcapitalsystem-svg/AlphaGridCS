import React from "react"
import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/toaster'
import { SuperAdminSeeder } from '@/components/superadmin-seeder'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'AlphaGrid Capital System',
  description: 'Secure and profitable investment platform. Start your wealth-building journey today with our trusted investment plans.',
  generator: 'S-PRO',
  icons: {
    icon: [
      // 1. Your new default favicon pointing to public/icon.png
      {
        url: '/icon.png', 
        type: 'image/png',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#8B6914' },
    { media: '(prefers-color-scheme: dark)', color: '#1a1612' },
  ],
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    // Kept suppressHydrationWarning here where it belongs
    <html lang="en" className="bg-background" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
          storageKey="theme-preference"
          // REMOVED suppressHydrationWarning from here to fix the TS error
        >
          {children}
          <Toaster />
          <SuperAdminSeeder />
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}