import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  Landmark,
  FileText,
  ArrowLeft,
  Shield,
  AlertTriangle,
  Scale,
  CreditCard,
  UserCheck,
} from "lucide-react"

export default function TermsPage() {
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
          <FileText className="mx-auto h-14 w-14 text-primary" />

          <h1 className="mt-6 text-4xl font-bold tracking-tight text-foreground md:text-5xl">
            Terms of Service
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            These Terms of Service govern your access to and use of AlphaGrid
            Capital System. By creating an account or using our platform, you
            agree to comply with these terms and all applicable laws.
          </p>

          <p className="mt-6 text-sm text-muted-foreground">
            Last Updated: June 2026
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-20">
        <div className="container mx-auto max-w-5xl space-y-8 px-4">

          <div className="rounded-xl border border-border bg-card p-8 transition-all duration-300 hover:border-primary/40">
            <div className="flex items-center gap-3">
              <UserCheck className="h-8 w-8 text-primary" />

              <h2 className="text-2xl font-semibold text-card-foreground">
                1. Account Eligibility
              </h2>
            </div>

            <p className="mt-6 text-muted-foreground leading-7">
              Users are responsible for ensuring that their use of the platform
              complies with local laws and regulations. By creating an account,
              you confirm that the information you provide is accurate,
              complete, and kept up to date.
            </p>

            <p className="mt-4 text-muted-foreground leading-7">
              You are responsible for maintaining the confidentiality of your
              login credentials and for all activities performed through your
              account.
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card p-8 transition-all duration-300 hover:border-primary/40">
            <div className="flex items-center gap-3">
              <CreditCard className="h-8 w-8 text-primary" />

              <h2 className="text-2xl font-semibold text-card-foreground">
                2. Deposits and Withdrawals
              </h2>
            </div>

            <p className="mt-6 text-muted-foreground leading-7">
              Deposits are credited after successful verification through the
              supported payment methods. Processing times may vary depending on
              banking systems and security reviews.
            </p>

            <p className="mt-4 text-muted-foreground leading-7">
              Withdrawal requests are reviewed before processing. Additional
              verification may be required to protect user accounts and prevent
              unauthorized transactions.
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card p-8 transition-all duration-300 hover:border-primary/40">
            <div className="flex items-center gap-3">
              <Shield className="h-8 w-8 text-primary" />

              <h2 className="text-2xl font-semibold text-card-foreground">
                3. Platform Security
              </h2>
            </div>

            <p className="mt-6 text-muted-foreground leading-7">
              AlphaGrid Capital System uses security measures designed to
              protect user accounts and transaction data. Users must not attempt
              to bypass authentication systems, interfere with platform
              operations, or access resources without authorization.
            </p>

            <p className="mt-4 text-muted-foreground leading-7">
              Any activity that threatens platform stability or user security
              may result in immediate account suspension or permanent
              termination.
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card p-8 transition-all duration-300 hover:border-primary/40">
            <div className="flex items-center gap-3">
              <Scale className="h-8 w-8 text-primary" />

              <h2 className="text-2xl font-semibold text-card-foreground">
                4. User Responsibilities
              </h2>
            </div>

            <ul className="mt-6 space-y-4 text-muted-foreground">
              <li>• Provide accurate registration information.</li>

              <li>• Keep account credentials secure.</li>

              <li>• Comply with all applicable laws.</li>

              <li>• Avoid fraudulent or misleading activity.</li>

              <li>• Respect the integrity and availability of the platform.</li>
            </ul>
          </div>

          <div className="rounded-xl border border-border bg-card p-8 transition-all duration-300 hover:border-primary/40">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-8 w-8 text-primary" />

              <h2 className="text-2xl font-semibold text-card-foreground">
                5. Limitation of Liability
              </h2>
            </div>

            <p className="mt-6 text-muted-foreground leading-7">
              While we strive to provide reliable services and maintain platform
              availability, no online system can guarantee uninterrupted
              operation. Temporary maintenance, technical issues, or external
              events may affect access to the platform.
            </p>

            <p className="mt-4 text-muted-foreground leading-7">
              Users acknowledge that they are responsible for evaluating their
              own financial decisions and understanding the features available
              through the platform.
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card p-8 transition-all duration-300 hover:border-primary/40">
            <h2 className="text-2xl font-semibold text-card-foreground">
              6. Changes to These Terms
            </h2>

            <p className="mt-6 text-muted-foreground leading-7">
              AlphaGrid Capital System reserves the right to update or modify
              these Terms of Service at any time. Continued use of the platform
              after changes become effective constitutes acceptance of the
              updated terms.
            </p>
          </div>

          <div className="rounded-xl border border-primary/20 bg-primary/5 p-8 text-center">
            <h2 className="text-2xl font-bold text-foreground">
              Questions About These Terms?
            </h2>

            <p className="mt-4 text-muted-foreground">
              If you have any questions regarding these Terms of Service, our
              support team is available to assist you.
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

              <Link href="/privacy">Privacy Policy</Link>

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

