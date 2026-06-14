import { Metadata } from "next"

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Frequently asked questions about deposits, withdrawals, referrals, account security, and platform operations.",
}

const faqs = [
  {
    question: "How long does deposit verification take?",
    answer:
      "Most deposits are reviewed and processed within 12–24 hours after submission."
  },

  {
    question: "How do withdrawals work?",
    answer:
      "Withdrawal requests are reviewed and processed according to the platform's withdrawal schedule and security verification procedures."
  },

  {
    question: "Can I invite friends?",
    answer:
      "Yes. Every registered user receives a unique referral link that can be shared to earn referral rewards according to the current referral program."
  },

  {
    question: "Is my information protected?",
    answer:
      "Yes. We use secure authentication, encrypted communication, and controlled verification processes to help protect user accounts."
  },

  {
    question: "How can I contact support?",
    answer:
      "Support is available through our official Telegram support bot and contact page."
  }
]

export default function FAQPage() {
  return (
    <main className="container mx-auto max-w-5xl px-4 py-12">

      <h1 className="text-4xl font-bold mb-8">
        Frequently Asked Questions
      </h1>

      <div className="space-y-5">

        {faqs.map((faq) => (

          <div
            key={faq.question}
            className="rounded-xl border bg-card p-6"
          >

            <h2 className="text-lg font-semibold mb-3">
              {faq.question}
            </h2>

            <p className="text-muted-foreground leading-7">
              {faq.answer}
            </p>

          </div>

        ))}

      </div>

    </main>
  )
}
