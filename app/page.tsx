"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { 
  Shield, 
  TrendingUp, 
  Clock, 
  Users, 
  CheckCircle2, 
  ArrowRight,
  Landmark,
  BadgePercent,
  ChevronDown
} from "lucide-react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { InvestmentPlansDisplay } from "@/components/investment-plans-display"

export default function HomePage() {
  const router = useRouter()

  useEffect(() => {
    const hash = window.location.hash;

    if (hash.includes("type=recovery")) {
      router.replace("/reset-password" + hash);
    }
  }, [router]);

  
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <Landmark className="h-7 w-7 text-primary" />
            <span className="text-xl font-bold text-foreground">AlphaGrid Capital System</span>
          </Link>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link href="/auth/login">
              <Button>Sign In</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl">
              Build Your Wealth with Trusted Investment Plans
            </h1>
            <p className="mt-6 text-pretty text-lg text-muted-foreground md:text-xl">
              Join thousands of investors earning consistent returns. Our secure platform offers transparent investment plans with daily rewards and guaranteed ROI.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/auth/login">
                <Button size="lg" className="gap-2 text-base">
                  Start Investing <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <a href="#plans">
                <Button variant="outline" size="lg" className="gap-2 text-base bg-transparent">
                  View Plans <ChevronDown className="h-4 w-4" />
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Metrics */}
      <section className="border-y border-border bg-muted/50 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <div className="text-center">
              <p className="text-3xl font-bold text-primary md:text-4xl">15K+</p>
              <p className="mt-1 text-sm text-muted-foreground">Active Investors</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-primary md:text-4xl">ETB 50M+</p>
              <p className="mt-1 text-sm text-muted-foreground">Total Invested</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-primary md:text-4xl">99.9%</p>
              <p className="mt-1 text-sm text-muted-foreground">Uptime</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-primary md:text-4xl">24/7</p>
              <p className="mt-1 text-sm text-muted-foreground">Support</p>
            </div>
          </div>
        </div>
      </section>

      {/* Investment Plans */}
      <section id="plans" className="py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold text-foreground md:text-4xl">Investment Plans</h2>
            <p className="mt-4 text-muted-foreground">
              Choose the plan that fits your investment goals. All plans include daily income and transparent returns.
            </p>
          </div>
          <InvestmentPlansDisplay />
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="border-y border-border bg-muted/30 py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold text-foreground md:text-4xl">Why Choose AlphaGrid Capital System</h2>
            <p className="mt-4 text-muted-foreground">
              We prioritize security, transparency, and your financial success.
            </p>
          </div>
          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg border border-border bg-card p-6">
              <Shield className="h-10 w-10 text-primary" />
              <h3 className="mt-4 font-semibold text-card-foreground">Secure Platform</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Bank-level security with encrypted transactions and secure data storage.
              </p>
            </div>
            <div className="rounded-lg border border-border bg-card p-6">
              <TrendingUp className="h-10 w-10 text-primary" />
              <h3 className="mt-4 font-semibold text-card-foreground">Guaranteed Returns</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Consistent ROI with transparent tracking of your investment growth.
              </p>
            </div>
            <div className="rounded-lg border border-border bg-card p-6">
              <Clock className="h-10 w-10 text-primary" />
              <h3 className="mt-4 font-semibold text-card-foreground">Daily Rewards</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Claim your rewards daily and watch your balance grow every day.
              </p>
            </div>
            <div className="rounded-lg border border-border bg-card p-6">
              <Users className="h-10 w-10 text-primary" />
              <h3 className="mt-4 font-semibold text-card-foreground">Trusted Community</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Join thousands of satisfied investors building their wealth with us.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold text-foreground md:text-4xl">What Our Investors Say</h2>
            <p className="mt-4 text-muted-foreground">
              Real stories from real investors who have grown their wealth with us.
            </p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            <div className="rounded-lg border border-border bg-card p-6">
              <p className="text-card-foreground">
                {"\"I started with the Starter plan and within 3 months, I upgraded to Growth. The daily rewards are consistent and the platform is very easy to use.\""}
              </p>
              <div className="mt-4 border-t border-border pt-4">
                <p className="font-medium text-card-foreground">Abebe T.</p>
                <p className="text-sm text-muted-foreground">Investor since 2024</p>
              </div>
            </div>
            <div className="rounded-lg border border-border bg-card p-6">
              <p className="text-card-foreground">
                {"\"The Premium plan has been a game-changer for my investment portfolio. The 1% daily reward adds up quickly and withdrawals are always processed on time.\""}
              </p>
              <div className="mt-4 border-t border-border pt-4">
                <p className="font-medium text-card-foreground">Meron K.</p>
                <p className="text-sm text-muted-foreground">Investor since 2023</p>
              </div>
            </div>
            <div className="rounded-lg border border-border bg-card p-6">
              <p className="text-card-foreground">
                {"\"I was skeptical at first, but AlphaGrid Capital System proved me wrong. Their customer support is excellent and my investments have grown steadily.\""}
              </p>
              <div className="mt-4 border-t border-border pt-4">
                <p className="font-medium text-card-foreground">Daniel M.</p>
                <p className="text-sm text-muted-foreground">Investor since 2024</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-border bg-muted/30 py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold text-foreground md:text-4xl">Frequently Asked Questions</h2>
            <p className="mt-4 text-muted-foreground">
              Everything you need to know about investing with us.
            </p>
          </div>
          <div className="mx-auto mt-12 max-w-3xl">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>How do I start investing?</AccordionTrigger>
                <AccordionContent>
                  Simply create an account, deposit funds using CBE Bank or Telebirr, and choose your preferred investment plan. Your investment starts earning immediately after your deposit is confirmed.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>What is the minimum deposit amount?</AccordionTrigger>
                <AccordionContent>
                  The minimum deposit amount is ETB 2,000. This allows you to start with our Starter plan and begin earning daily rewards right away.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>How do daily rewards work?</AccordionTrigger>
                <AccordionContent>
                  Each investment plan has a daily reward percentage. You can claim your rewards once every 24 hours. The rewards are added directly to your wallet balance.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4">
                <AccordionTrigger>How long does withdrawal take?</AccordionTrigger>
                <AccordionContent>
                  Withdrawals are typically processed within 12-24 hours. The minimum withdrawal amount is ETB 1,500. Funds are sent to your registered bank account or mobile wallet.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-5">
                <AccordionTrigger>Is my investment secure?</AccordionTrigger>
                <AccordionContent>
                  Yes, we use bank-level security measures to protect your funds and personal information. All transactions are encrypted and monitored for suspicious activity.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center">
            <BadgePercent className="mx-auto h-12 w-12 text-primary" />
            <h2 className="mt-6 text-3xl font-bold text-foreground md:text-4xl">
              Ready to Start Growing Your Wealth?
            </h2>
            <p className="mt-4 text-muted-foreground">
              Join thousands of investors and start earning daily rewards today.
            </p>
            <Link href="/auth/login" className="mt-8 inline-block">
              <Button size="lg" className="gap-2 text-base">
                Start Investing Now <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/50 py-12">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <Link href="/" className="flex items-center gap-2">
                <Landmark className="h-6 w-6 text-primary" />
                <span className="text-lg font-bold text-foreground">AlphaGrid Capital System</span>
              </Link>
              <p className="mt-4 text-sm text-muted-foreground">
                Your trusted partner in building wealth through smart investments.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground">Quick Links</h4>
              <ul className="mt-4 space-y-2">
                <li><a href="#plans" className="text-sm text-muted-foreground hover:text-foreground">Investment Plans</a></li>
                <li><Link href="/auth/login" className="text-sm text-muted-foreground hover:text-foreground">Sign In</Link></li>
                <li><Link href="/auth/sign-up" className="text-sm text-muted-foreground hover:text-foreground">Create Account</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground">Legal</h4>
              <ul className="mt-4 space-y-2">
                <li><Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground">Terms of Service</Link></li>
                <li><Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground">Privacy Policy</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground">Support</h4>
              <ul className="mt-4 space-y-2">
                <li><Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground">Contact Us</Link></li>
                <li><a href="https://t.me/AlphaGridCapitalSystemBot" target="_blank" className="text-sm text-muted-foreground hover:text-foreground">Help Center</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 border-t border-border pt-8 text-center">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} AlphaGrid Capital System. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
