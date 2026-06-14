"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  Landmark,
  MessageCircle,
  Mail,
  Clock,
  Send,
  ArrowLeft,
  ShieldCheck,
  Headphones,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function ContactPage() {
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      setLoading(true)

      const res = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          subject,
          message,
        }),
      })

      const data = await res.json()

      if (data.ok) {
        toast({ title: "✅ Message sent successfully!"})

        // clear form
        setName("")
        setEmail("")
        setSubject("")
        setMessage("")
      } else {
        toast({ title: "❌ Failed to send message"})
        console.error("Contact form sending error:", data)
      }
    } catch (err) {
        toast({ title: "❌ Something went wrong" })
        console.error("Contact form error:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur">
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
          <MessageCircle className="mx-auto h-14 w-14 text-primary" />
          <h1 className="mt-6 text-4xl font-bold text-foreground">
            Contact Us
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            Need help? Send us a message and we’ll get back to you via Telegram.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="grid gap-8 lg:grid-cols-3">

            {/* LEFT INFO */}
            <div className="space-y-6">
              <div className="rounded-xl border border-border bg-card p-6">
                <MessageCircle className="h-10 w-10 text-primary" />
                <h2 className="mt-4 text-xl font-semibold">Telegram Support</h2>
                <a
                  href="https://t.me/AlphaGridCapitalSystemBot"
                  target="_blank"
                >
                  <Button className="mt-4 w-full">Open Telegram</Button>
                </a>
              </div>

              <div className="rounded-xl border border-border bg-card p-6">
                <Mail className="h-10 w-10 text-primary" />
                <h2 className="mt-4 text-xl font-semibold">Email</h2>
                <p className="text-sm text-muted-foreground">
                  support@alphagridcapital.com
                </p>
              </div>

              <div className="rounded-xl border border-border bg-card p-6">
                <Clock className="h-10 w-10 text-primary" />
                <h2 className="mt-4 text-xl font-semibold">Support Hours</h2>
                <p className="text-sm text-muted-foreground">
                  24/7 support available
                </p>
              </div>
            </div>

            {/* FORM */}
            <div className="lg:col-span-2">
              <div className="rounded-xl border border-border bg-card p-8">
                <div className="flex items-center gap-3">
                  <Send className="h-6 w-6 text-primary" />
                  <h2 className="text-2xl font-bold">Send Message</h2>
                </div>

                <form onSubmit={handleSubmit} className="mt-8 space-y-6">

                  <div className="grid gap-6 md:grid-cols-2">
                    <Input
                      placeholder="Full Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />

                    <Input
                      type="email"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  <Input
                    placeholder="Subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                  />

                  <Textarea
                    placeholder="Message"
                    className="min-h-[160px]"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                  />

                  <Button
                    type="submit"
                    className="w-full gap-2"
                    disabled={loading}
                  >
                    <Send className="h-4 w-4" />
                    {loading ? "Sending..." : "Send Message"}
                  </Button>

                </form>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 text-center">
        <h2 className="text-3xl font-bold">We’re here to help</h2>
        <p className="mt-4 text-muted-foreground">
          Fast support through Telegram
        </p>

        <div className="mt-6 flex justify-center gap-4">
          <a href="https://t.me/AlphaGridCapitalSystemBot" target="_blank">
            <Button>Open Telegram</Button>
          </a>

          <Link href="/">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-border py-10 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} AlphaGrid Capital System
      </footer>
    </div>
  )
}
