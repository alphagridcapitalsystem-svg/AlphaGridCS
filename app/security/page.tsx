import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Security",
  description:
    "Learn how AlphaGrid Capital System protects user accounts, transactions, and personal information.",
}

export default function SecurityPage() {
  return (
    <main className="container mx-auto max-w-5xl px-4 py-12">

      <h1 className="text-4xl font-bold mb-8">
        Security & Account Protection
      </h1>

      <div className="space-y-6">

        <div className="rounded-xl border bg-card p-6">
          <h2 className="text-xl font-semibold mb-3">
            Account Security
          </h2>

          <p className="text-muted-foreground leading-8">
            Every account is protected through secure authentication,
            encrypted communication channels, and continuous monitoring
            designed to reduce unauthorized access.
          </p>
        </div>

        <div className="rounded-xl border bg-card p-6">
          <h2 className="text-xl font-semibold mb-3">
            Deposit Verification
          </h2>

          <p className="text-muted-foreground leading-8">
            All deposits require verification before they are approved and
            credited to user accounts, providing additional protection
            against fraudulent transactions.
          </p>
        </div>

        <div className="rounded-xl border bg-card p-6">
          <h2 className="text-xl font-semibold mb-3">
            Data Protection
          </h2>

          <p className="text-muted-foreground leading-8">
            Personal information is stored securely and is only used for
            operating the platform and providing customer support.
          </p>
        </div>

        <div className="rounded-xl border bg-card p-6">
          <h2 className="text-xl font-semibold mb-3">
            User Responsibility
          </h2>

          <p className="text-muted-foreground leading-8">
            Users should keep passwords private, avoid sharing login
            credentials, and immediately report any suspicious account
            activity through our support channels.
          </p>
        </div>

      </div>

    </main>
  )
}
