import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  Landmark,
  ShieldCheck,
  Lock,
  Database,
  Eye,
  UserRound,
  FileText,
  ArrowLeft,
} from "lucide-react"

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <Landmark className="h-7 w-7 text-primary" />
            <span className="text-xl font-bold text-foreground">
              AlphaGrid Capital System
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <ThemeToggle />

            <Link href="/auth/login">
              <Button>Sign In</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="border-b border-border bg-muted/30 py-20">
        <div className="container mx-auto max-w-5xl px-4 text-center">
          <ShieldCheck className="mx-auto h-14 w-14 text-primary" />

          <h1 className="mt-6 text-4xl font-bold tracking-tight text-foreground md:text-5xl">
            Privacy Policy
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            Your privacy is important to us. This Privacy Policy explains how
            AlphaGrid Capital System collects, uses, stores, and protects your
            information while providing our investment platform.
          </p>

          <p className="mt-6 text-sm text-muted-foreground">
            Last Updated: June 2026
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-20">
        <div className="container mx-auto max-w-5xl space-y-8 px-4">

          {/* Information Collection */}
          <div className="rounded-xl border border-border bg-card p-8 transition-all duration-300 hover:border-primary/40">
            <div className="flex items-center gap-3">
              <UserRound className="h-8 w-8 text-primary" />

              <h2 className="text-2xl font-semibold text-card-foreground">
                Information We Collect
              </h2>
            </div>

            <p className="mt-6 leading-7 text-muted-foreground">
              We collect information that you voluntarily provide when creating
              an account, completing verification processes, making deposits,
              requesting withdrawals, or contacting our support team.
            </p>

            <ul className="mt-6 space-y-3 text-muted-foreground">
              <li>• Full name and account information</li>
              <li>• Email address and contact details</li>
              <li>• Transaction and payment records</li>
              <li>• Device and browser information</li>
              <li>• Platform activity and security logs</li>
            </ul>
          </div>

          {/* Data Usage */}
          <div className="rounded-xl border border-border bg-card p-8 transition-all duration-300 hover:border-primary/40">
            <div className="flex items-center gap-3">
              <Database className="h-8 w-8 text-primary" />

              <h2 className="text-2xl font-semibold text-card-foreground">
                How We Use Your Information
              </h2>
            </div>

            <p className="mt-6 leading-7 text-muted-foreground">
              Your information is used exclusively to operate and improve our
              platform, process transactions, verify identities, enhance
              security, and provide customer support.
            </p>

            <div className="mt-6 grid gap-4 md:grid-cols-2">

              <div className="rounded-lg border border-border bg-muted/30 p-5">
                <h3 className="font-semibold text-foreground">
                  Account Management
                </h3>

                <p className="mt-2 text-sm text-muted-foreground">
                  Create and maintain your account securely while providing a
                  personalized experience.
                </p>
              </div>

              <div className="rounded-lg border border-border bg-muted/30 p-5">
                <h3 className="font-semibold text-foreground">
                  Transaction Processing
                </h3>

                <p className="mt-2 text-sm text-muted-foreground">
                  Verify deposits, withdrawals, investments, and reward
                  distributions.
                </p>
              </div>

              <div className="rounded-lg border border-border bg-muted/30 p-5">
                <h3 className="font-semibold text-foreground">
                  Fraud Prevention
                </h3>

                <p className="mt-2 text-sm text-muted-foreground">
                  Detect suspicious activity and protect user accounts from
                  unauthorized access.
                </p>
              </div>

              <div className="rounded-lg border border-border bg-muted/30 p-5">
                <h3 className="font-semibold text-foreground">
                  Customer Support
                </h3>

                <p className="mt-2 text-sm text-muted-foreground">
                  Respond to inquiries and provide assistance whenever you need
                  help.
                </p>
              </div>

            </div>
          </div>

          {/* Security */}
          <div className="rounded-xl border border-border bg-card p-8 transition-all duration-300 hover:border-primary/40">
            <div className="flex items-center gap-3">
              <Lock className="h-8 w-8 text-primary" />

              <h2 className="text-2xl font-semibold text-card-foreground">
                Data Protection & Security
              </h2>
            </div>

            <p className="mt-6 leading-7 text-muted-foreground">
              We implement industry-standard technical and organizational
              measures to safeguard personal information from unauthorized
              access, disclosure, alteration, or destruction.
            </p>

            <div className="mt-8 rounded-lg border border-primary/20 bg-primary/5 p-6">
              <p className="font-medium text-foreground">
                Security Features
              </p>

              <ul className="mt-4 space-y-3 text-muted-foreground">
                <li>✓ Encrypted communications</li>
                <li>✓ Secure authentication systems</li>
                <li>✓ Continuous security monitoring</li>
                <li>✓ Access controls for sensitive information</li>
              </ul>
            </div>
          </div>

          {/* Sharing */}
          <div className="rounded-xl border border-border bg-card p-8 transition-all duration-300 hover:border-primary/40">
            <div className="flex items-center gap-3">
              <Eye className="h-8 w-8 text-primary" />

              <h2 className="text-2xl font-semibold text-card-foreground">
                Information Sharing
              </h2>
            </div>

            <p className="mt-6 leading-7 text-muted-foreground">
              AlphaGrid Capital System does not sell personal information to
              third parties. Information may only be shared when necessary to
              provide services, comply with legal obligations, prevent fraud,
              or protect the security of our platform and users.
            </p>
          </div>

          {/* User Rights */}
          <div className="rounded-xl border border-border bg-card p-8 transition-all duration-300 hover:border-primary/40">
            <div className="flex items-center gap-3">
              <FileText className="h-8 w-8 text-primary" />

              <h2 className="text-2xl font-semibold text-card-foreground">
                Your Rights
              </h2>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">

              <div className="rounded-lg border border-border p-5">
                <h3 className="font-semibold text-foreground">
                  Access
                </h3>

                <p className="mt-2 text-sm text-muted-foreground">
                  Request access to the personal information associated with
                  your account.
                </p>
              </div>

              <div className="rounded-lg border border-border p-5">
                <h3 className="font-semibold text-foreground">
                  Correction
                </h3>

                <p className="mt-2 text-sm text-muted-foreground">
                  Update inaccurate or outdated information whenever necessary.
                </p>
              </div>

              <div className="rounded-lg border border-border p-5">
                <h3 className="font-semibold text-foreground">
                  Security
                </h3>

                <p className="mt-2 text-sm text-muted-foreground">
                  Protect your account with strong credentials and secure
                  devices.
                </p>
              </div>

              <div className="rounded-lg border border-border p-5">
                <h3 className="font-semibold text-foreground">
                  Support
                </h3>

                <p className="mt-2 text-sm text-muted-foreground">
                  Contact our support team for questions regarding your data or
                  privacy concerns.
                </p>
              </div>

            </div>
          </div>

          {/* CTA */}
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-8 text-center">
            <h2 className="text-2xl font-bold text-foreground">
              Your Privacy Matters
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              We are committed to maintaining transparency and protecting your
              personal information through responsible data practices and modern
              security standards.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
              <Link href="/contact">
                <Button size="lg">
                  Contact Support
                </Button>
              </Link>

              <Link href="/">
                <Button variant="outline" size="lg">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Home
                </Button>
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/50 py-10">
        <div className="container mx-auto px-4">

          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">

            <div className="flex items-center gap-2">
              <Landmark className="h-6 w-6 text-primary" />

              <span className="font-semibold text-foreground">
                AlphaGrid Capital System
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
              <Link href="/">Home</Link>
              <Link href="/terms">Terms of Service</Link>
              <Link href="/contact">Contact</Link>
            </div>

          </div>

          <div className="mt-8 border-t border-border pt-6 text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} AlphaGrid Capital System. All rights
            reserved.
          </div>

        </div>
      </footer>
    </div>
  )
}
  

