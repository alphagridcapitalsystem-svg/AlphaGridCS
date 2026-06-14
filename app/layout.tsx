import React from "react"
import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"

import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { SuperAdminSeeder } from "@/components/superadmin-seeder"

import "./globals.css"

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
})

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  metadataBase: new URL("https://www.alphagridcs.online"),

  title: {
    default: "AlphaGrid Capital System",
    template: "%s | AlphaGrid Capital System",
  },

  description:
    "Secure investment platform offering transparent investment plans, referral rewards, automated account management, and real-time portfolio tracking for global users.",

  keywords: [
    "AlphaGrid Capital System",
    "investment platform",
    "investment plans",
    "capital management",
    "passive income",
    "crypto investment",
    "online investing",
  ],

  alternates: {
    canonical: "https://www.alphagridcs.online",
  },

  openGraph: {
    title: "AlphaGrid Capital System | Secure Investment & Wealth Platform",
    description: "Secure investment platform offering transparent investment plans, referral rewards, automated account management, and real-time portfolio tracking for global users.",
    url: "https://www.alphagridcs.online",
    siteName: "AlphaGrid Capital System",
    locale: "en_US",
    type: "website",

    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "AlphaGrid Capital System",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "AlphaGrid Capital System | Secure Investment & Wealth Platform",
    description: "Secure investment platform offering transparent investment plans, referral rewards, automated account management, and real-time portfolio tracking for global users.",
    images: ["/og-image.png"],
  },

  robots: {
    index: true,
    follow: true,

    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-video-preview": -1,
      "max-snippet": -1,
    },
  },

  manifest: "/site.webmanifest",

  icons: {
    icon: [
      {
        url: "/favicon.ico",
        sizes: "any",
      },
      {
        url: "/favicon-16x16.png",
        type: "image/png",
        sizes: "16x16",
      },
      {
        url: "/favicon-32x32.png",
        type: "image/png",
        sizes: "32x32",
      },
      {
        url: "/android-chrome-192x192.png",
        type: "image/png",
        sizes: "192x192",
      },
      {
        url: "/android-chrome-512x512.png",
        type: "image/png",
        sizes: "512x512",
      },
    ],

    shortcut: ["/favicon.ico"],

    apple: [
      {
        url: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,

  themeColor: [
    {
      media: "(prefers-color-scheme: light)",
      color: "#8B6914",
    },
    {
      media: "(prefers-color-scheme: dark)",
      color: "#1a1612",
    },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const jsonLd = {
    "@context": "https://schema.org",

    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://www.alphagridcs.online/#organization",

        name: "AlphaGrid Capital System | Secure Investment & Wealth Platform",

        url: "https://www.alphagridcs.online",

        logo: {
          "@type": "ImageObject",
          url: "https://www.alphagridcs.online/android-chrome-512x512.png",
        },
      },

      {
        "@type": "WebSite",
        "@id": "https://www.alphagridcs.online/#website",

        url: "https://www.alphagridcs.online",

        name: "AlphaGrid Capital System | Secure Investment & Wealth Platform",

        description:
          "Secure investment platform offering transparent investment plans, referral rewards, automated account management, and real-time portfolio tracking for global users.",

        inLanguage: "en",

        publisher: {
          "@id": "https://www.alphagridcs.online/#organization",
        },
      },
    ],
  }

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geist.variable} ${geistMono.variable}`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd),
          }}
        />
      </head>

      <body className="font-sans antialiased">
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
