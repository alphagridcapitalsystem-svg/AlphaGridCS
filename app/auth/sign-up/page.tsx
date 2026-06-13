'use client'

import React from "react"

import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import HCaptcha from "@hcaptcha/react-hcaptcha"
import { useRouter } from 'next/navigation'
import { useState, useEffect, useRef } from 'react'
import { Landmark, Loader2, AlertCircle } from 'lucide-react'
import { ThemeToggle } from '@/components/theme-toggle'
import { Alert, AlertDescription } from '@/components/ui/alert'

export default function SignUpPage() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [repeatPassword, setRepeatPassword] = useState('')
  const [referralCode, setReferralCode] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)
  const [captchaToken, setCaptchaToken] = useState("")
  const captchaRef = useRef<HCaptcha>(null)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        router.push('/dashboard')
      } else {
        setIsCheckingAuth(false)
      }
    }
    
    checkAuth()
  }, [router])

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    if (password !== repeatPassword) {
      setError('Passwords do not match')
      setIsLoading(false)
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      setIsLoading(false)
      return
    }

    if (!captchaToken) {
      setError("Please complete the captcha")
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          referralCode,
        }),
      })

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.message)
      }
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          captchaToken,
          emailRedirectTo:
            process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ||
            `${window.location.origin}/dashboard`,
          data: {
            full_name: fullName,
            referred_by: result.referrerId,
          },
        },
      })
      captchaRef.current?.resetCaptcha()
      setCaptchaToken("")
      if (error) throw error
      router.push('/auth/sign-up-success')
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  if (isCheckingAuth) {
    return (
      <div className="flex min-h-svh w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="flex min-h-svh w-full flex-col bg-background">
      <header className="flex h-16 items-center justify-between border-b border-border px-4">
        <Link href="/" className="flex items-center gap-2">
          <Landmark className="h-6 w-6 text-primary" />
          <span className="text-lg font-bold text-foreground">AlphaGrid Capital System</span>
        </Link>
        <ThemeToggle />
      </header>
      
      <div className="flex flex-1 items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm">
          <div className="flex flex-col gap-6">
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Create Account</CardTitle>
                <CardDescription>
                  Start your investment journey today
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSignUp}>
                  <div className="flex flex-col gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input
                        id="fullName"
                        type="text"
                        placeholder="John Doe"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        disabled={isLoading}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={isLoading}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="Min. 6 characters"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={isLoading}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="repeat-password">Confirm Password</Label>
                      <Input
                        id="repeat-password"
                        type="password"
                        required
                        value={repeatPassword}
                        onChange={(e) => setRepeatPassword(e.target.value)}
                        disabled={isLoading}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="referral-code">Enter Referral code</Label>
                      <Input
                        id="referral-code"
                        type="text"
                        required
                        value={referralCode}
                        onChange={(e) => setReferralCode(e.target.value)}
                        disabled={isLoading}
                      />
                    </div>
                    <HCaptcha
                      ref={captchaRef}
                      sitekey={process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY!}
                      onVerify={(token) => {
                        setCaptchaToken(token)
                      }}
                    />
                    {error && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{(error.message || String(error)).includes("email rate limit exceeded") ? "Sorry, the server is busy at the moment. Please try again later." : (error.message || String(error))}</AlertDescription>
                      </Alert>
                    )}
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating account...
                        </>
                      ) : (
                        'Create Account'
                      )}
                    </Button>
                  </div>
                  <div className="mt-6 text-center text-sm">
                    {'Already have an account? '}
                    <Link
                      href="/auth/login"
                      className="font-medium text-primary underline-offset-4 hover:underline"
                    >
                      Sign in
                    </Link>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
