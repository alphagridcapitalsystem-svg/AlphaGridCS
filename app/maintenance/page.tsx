export const dynamic = 'force-dynamic';

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { Landmark, ShieldAlert, RefreshCw } from "lucide-react"

async function getSettings() {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"

    const res = await fetch(`${baseUrl}/api/settings`, {
      cache: "no-store",
    })

    if (!res.ok) return null

    return await res.json()
  } catch (err) {
    console.error("settings fetch failed:", err)
    return null
  }
}

export default async function MaintenancePage() {
  const data = await getSettings()

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header (same vibe as homepage) */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Landmark className="h-7 w-7 text-primary" />
            <span className="text-lg font-bold">
              AlphaGrid Capital System
            </span>
          </div>

          <ThemeToggle />
        </div>
      </header>

      {/* Main */}
      <main className="flex flex-1 items-center justify-center px-4">
        <div className="w-full max-w-2xl text-center space-y-6">

          {/* Icon */}
          <div className="flex justify-center">
            <div className="p-4 rounded-full bg-muted">
              <ShieldAlert className="h-10 w-10 text-primary animate-pulse" />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold">
            We’re under maintenance
          </h1>

          {/* Message */}
          <p className="text-muted-foreground text-sm md:text-base">
            {data?.maintenance_message ||
              "System updates are in progress. Please check back soon."}
          </p>

          {/* Live status feel */}
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <RefreshCw className="h-3 w-3 animate-spin" />
            Checking system status...
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">

            {/* Telegram support ONLY */}
            <a
              href="https://t.me/AlphaGridCapitalSystemBot"
              target="_blank"
            >
              <Button className="w-full sm:w-auto">
                Contact Support on Telegram
              </Button>
            </a>
          </div>

          {/* small footer note */}
          <p className="text-xs text-muted-foreground pt-6">
            You are seeing this because maintenance mode is active.
          </p>
        </div>
      </main>
    </div>
  )
}