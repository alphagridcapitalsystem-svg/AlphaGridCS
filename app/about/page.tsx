import { Metadata } from "next"

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about AlphaGrid Capital System, our mission, investment philosophy, and commitment to providing a secure and transparent platform.",
}

export default function AboutPage() {
  return (
    <main className="container mx-auto max-w-5xl px-4 py-12">
      <section className="space-y-6">
        <h1 className="text-4xl font-bold">About AlphaGrid Capital System</h1>

        <p className="text-muted-foreground leading-8">
          AlphaGrid Capital System is designed to provide investors with a
          modern, transparent, and user-friendly investment experience.
          Our platform focuses on simplicity, security, and efficient account
          management while providing multiple investment opportunities.
        </p>

        <div className="grid gap-6 md:grid-cols-3">

          <div className="rounded-xl border bg-card p-6">
            <h2 className="font-semibold text-xl mb-3">Our Mission</h2>

            <p className="text-muted-foreground">
              To build a trusted investment platform that combines technology,
              transparency, and professional management into one secure system.
            </p>
          </div>

          <div className="rounded-xl border bg-card p-6">
            <h2 className="font-semibold text-xl mb-3">Security First</h2>

            <p className="text-muted-foreground">
              We prioritize account protection, encrypted communications,
              controlled withdrawals, and continuous platform monitoring.
            </p>
          </div>

          <div className="rounded-xl border bg-card p-6">
            <h2 className="font-semibold text-xl mb-3">Transparency</h2>

            <p className="text-muted-foreground">
              Every deposit, withdrawal, referral reward, and investment
              activity is visible within your dashboard for complete clarity.
            </p>
          </div>

        </div>
      </section>
    </main>
  )
}
