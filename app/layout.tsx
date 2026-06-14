import React from "react"
import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercelanalytics/next'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/toaster'
import { SuperAdminSeeder } from '@/components/superadmin-seeder'
import './globals.css'

const _geist = Geist({ subsets: ["latin"], variable: '--font-sans' });
const _geistMono = Geist_Mono({ subsets: ["latin"], variable: '--font-mono' });

export const metadata: Metadata = {
  metadataBase: new URL("https://www.alphagridcs.online"),
  title: {
    default: "AlphaGrid Capital System",
    template: "%s | AlphaGrid Capital System",
  },
  description:
    "Secure investment platform offering transparent investment plans, referral rewards, and account management.",
  keywords: [
    "AlphaGrid Capital System",
    "investment platform",
    "investment plans",
    "capital management",
    "passive income",
    "crypto investment",
    "online investing",
  ],
  openGraph: {
    title: "AlphaGrid Capital System",
    description: "Build your wealth with trusted investment plans.",
    url: "https://www.alphagridcs.online",
    siteName: "AlphaGrid Capital System",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AlphaGrid Capital System",
    description: "Build your wealth with trusted investment plans.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [{ url: "/icon_x192.png", type: "image/png" }],
    shortcut: [{ url: "/icon_x192.png", type: "image/png" }],
    apple: [{ url: "/apple-icon.png", type: "image/png" }],
  },
  alternates: {
    canonical: "/",
  },
};

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
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    'name': 'AlphaGrid Capital System',
    'url': 'https://www.alphagridcs.online',
  };

  return (
    <html lang="en" className="bg-background" suppressHydrationWarning>
      <body className="font-sans antialiased">
        {/* Standard HTML Script tag embedded directly in the tree to escape Next context drops */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
          storageKey="theme-preference"
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
