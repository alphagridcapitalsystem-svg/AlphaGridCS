'use client'

import React from "react"

import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  ArrowLeft, 
  Loader2, 
  AlertCircle, 
  CheckCircle2, 
  Copy, 
  Check,
  Building2,
  Smartphone
} from 'lucide-react'
import { cn } from '@/lib/utils'

type PaymentMethod = 'cbe' | 'telebirr' | 'awash' | null

type PaymentAccount = {
  name: string
  number: string
  enabled: boolean
}

type PaymentDetails = {
  cbe: PaymentAccount
  telebirr: PaymentAccount
  awash: PaymentAccount
}

export default function DepositPage() {
  // v2.1 - Fixed deposit submission with method field
  const [step, setStep] = useState(1)
  const [amount, setAmount] = useState('')
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(null)
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [copied, setCopied] = useState<string | null>(null)
  const router = useRouter()

  const MIN_DEPOSIT = 2000

  useEffect(() => {
    const fetchPaymentDetails = async () => {
      setIsLoading(true)
      const supabase = createClient()
      
      // First try payment_methods table
      const { data: paymentMethods } = await supabase
        .from('payment_methods')
        .select('*')
        .eq('active', true)

      if (paymentMethods && paymentMethods.length > 0) {
        const details: PaymentDetails = {
          cbe: { name: '', number: '', enabled: false },
          telebirr: { name: '', number: '', enabled: false },
          awash: { name: '', number: '', enabled: false }
        }

        paymentMethods.forEach((pm: { name: string; account_name: string; account_number: string; active: boolean }) => {
          const key = pm.name.toLowerCase().replace(' bank', '').replace(' ', '') as keyof PaymentDetails
          if (key === 'cbe' || key === 'telebirr' || key === 'awash') {
            details[key] = {
              name: pm.account_name,
              number: pm.account_number,
              enabled: pm.active
            }
          }
        })

        setPaymentDetails(details)
        setIsLoading(false)
        return
      }

      // Fallback to platform_settings
      const { data: settings } = await supabase
        .from('platform_settings')
        .select('setting_key, setting_value')
        .in('setting_key', [
          'cbe_account_name', 'cbe_account_number', 'cbe_enabled',
          'telebirr_account_name', 'telebirr_account_number', 'telebirr_enabled',
          'awash_account_name', 'awash_account_number', 'awash_enabled'
        ])

      if (settings) {
        const settingsMap: Record<string, string> = {}
        settings.forEach((s: { setting_key: string; setting_value: string }) => {
          settingsMap[s.setting_key] = s.setting_value
        })

        setPaymentDetails({
          cbe: {
            name: settingsMap.cbe_account_name || '',
            number: settingsMap.cbe_account_number || '',
            enabled: settingsMap.cbe_enabled !== 'false'
          },
          telebirr: {
            name: settingsMap.telebirr_account_name || '',
            number: settingsMap.telebirr_account_number || '',
            enabled: settingsMap.telebirr_enabled !== 'false'
          },
          awash: {
            name: settingsMap.awash_account_name || '',
            number: settingsMap.awash_account_number || '',
            enabled: settingsMap.awash_enabled !== 'false'
          }
        })
      }
      setIsLoading(false)
    }

    fetchPaymentDetails()
  }, [])

  const handleAmountSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    
    const amountNum = parseFloat(amount)
    if (isNaN(amountNum) || amountNum < MIN_DEPOSIT) {
      setError(`Minimum deposit amount is ETB ${MIN_DEPOSIT.toLocaleString()}`)
      return
    }
    
    setStep(2)
  }

  const handlePaymentMethodSelect = (method: PaymentMethod) => {
    setPaymentMethod(method)
    setStep(3)
  }

  const handleCopy = async (text: string, field: string) => {
    await navigator.clipboard.writeText(text)
    setCopied(field)
    setTimeout(() => setCopied(null), 2000)
  }

  const handleSubmitDeposit = async () => {
    setIsSubmitting(true)
    setError(null)

    try {
      const supabase = createClient()
      const { data: { user }, error: authError } = await supabase.auth.getUser()

      if (authError) {
        console.error("[AlphaGridCS] Auth error:", authError)
        throw authError
      }

      if (!user) {
        router.push('/auth/login')
        return
      }

      const depositData = {
        user_id: user.id,
        amount: parseFloat(amount),
        payment_method: paymentMethod,
        method: paymentMethod,  // Database requires both payment_method AND method - CRITICAL
        status: 'pending',
        created_at: new Date().toISOString(),
      }

      const { data: depositResult, error: depositError } = await supabase
        .from('deposits')
        .insert([depositData])
        .select()
        .single()

      if (depositError) {
        console.error("[AlphaGridCS] Deposit insert error:", depositError)
        throw depositError
      }

      // Create transaction record
      const transactionData = {
        user_id: user.id,
        type: 'deposit',
        amount: parseFloat(amount),
        status: 'pending',
        description: `Deposit request via ${paymentMethod === 'cbe' ? 'CBE Bank' : paymentMethod === 'telebirr' ? 'Telebirr' : 'Awash Bank'}`,
        reference_id: depositResult.id,
        created_at: new Date().toISOString(),
      }

      const { data: txResult, error: txError } = await supabase
        .from('transactions')
        .insert([transactionData])
        .select()

      if (txError) {
        console.error("[AlphaGridCS] Transaction insert error:", txError)
        console.warn("[AlphaGridCS] Continuing despite transaction error")
      } else {
        console.log("[AlphaGridCS] Transaction created:", txResult)
      }

      setSuccess(true)
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to submit deposit'
      console.error("[AlphaGridCS] Deposit submission error:", errorMsg)
      setError(errorMsg)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (success) {
    return (
      <div className="p-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
                <CheckCircle2 className="h-8 w-8 text-success" />
              </div>
              <h2 className="mt-4 text-xl font-semibold text-foreground">Deposit Submitted</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Your deposit request has been submitted successfully. 
                It will be processed within 12-24 hours. <br />Please send a screenshot of your deposit confirmation through our <br /> <a href="https://t.me/AlphaGridCapitalSystemBot" target="_blank" style={{ color: 'red' }}>Customer support telegram bot</a>.
              </p>
              <Link href="/dashboard" className="mt-6 w-full">
                <Button className="w-full">Back to Dashboard</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-4">
      {/* Header */}
      <div className="mb-6 flex items-center gap-4">
        <Link href="/dashboard">
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-xl font-semibold text-foreground">Deposit Funds</h1>
          <p className="text-sm text-muted-foreground">Step {step} of 4</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6 flex gap-2">
        {[1, 2, 3, 4].map((s) => (
          <div
            key={s}
            className={cn(
              "h-1.5 flex-1 rounded-full transition-colors",
              s <= step ? "bg-primary" : "bg-muted"
            )}
          />
        ))}
      </div>

      {/* Step 1: Enter Amount */}
      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Enter Amount</CardTitle>
            <CardDescription>
              Minimum deposit is ETB {MIN_DEPOSIT.toLocaleString()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAmountSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Amount (ETB)</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  min={MIN_DEPOSIT}
                  required
                />
              </div>
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <Button type="submit" className="w-full">
                Continue
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Choose Payment Method */}
      {step === 2 && (
        <Card>
          <CardHeader>
            <CardTitle>Payment Method</CardTitle>
            <CardDescription>
              Choose how you want to deposit ETB {parseFloat(amount).toLocaleString()}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {paymentDetails?.cbe.enabled && paymentDetails.cbe.number && (
              <button
                type="button"
                onClick={() => handlePaymentMethodSelect('cbe')}
                className="flex w-full items-center gap-4 rounded-lg border border-border p-4 transition-colors hover:bg-muted"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Building2 className="h-6 w-6 text-primary" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-foreground">CBE Bank</p>
                  <p className="text-sm text-muted-foreground">Commercial Bank of Ethiopia</p>
                </div>
              </button>
            )}

            {paymentDetails?.telebirr.enabled && paymentDetails.telebirr.number && (
              <button
                type="button"
                onClick={() => handlePaymentMethodSelect('telebirr')}
                className="flex w-full items-center gap-4 rounded-lg border border-border p-4 transition-colors hover:bg-muted"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/50">
                  <Smartphone className="h-6 w-6 text-accent-foreground" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-foreground">Telebirr</p>
                  <p className="text-sm text-muted-foreground">Mobile Money</p>
                </div>
              </button>
            )}

            {paymentDetails?.awash.enabled && paymentDetails.awash.number && (
              <button
                type="button"
                onClick={() => handlePaymentMethodSelect('awash')}
                className="flex w-full items-center gap-4 rounded-lg border border-border p-4 transition-colors hover:bg-muted"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-chart-2/20">
                  <Building2 className="h-6 w-6 text-chart-2" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-foreground">Awash Bank</p>
                  <p className="text-sm text-muted-foreground">Awash International Bank</p>
                </div>
              </button>
            )}

            <Button 
              variant="outline" 
              className="w-full mt-4 bg-transparent" 
              onClick={() => setStep(1)}
            >
              Back
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Payment Details */}
      {step === 3 && paymentDetails && (
        <Card>
          <CardHeader>
            <CardTitle>Payment Details</CardTitle>
            <CardDescription>
              Send exactly ETB {parseFloat(amount).toLocaleString()} to the account below
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {paymentMethod && paymentDetails && (
              <>
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Account Name</Label>
                  <div className="flex items-center justify-between rounded-lg bg-muted p-3">
                    <span className="font-medium text-foreground">{paymentDetails[paymentMethod].name}</span>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8"
                      onClick={() => handleCopy(paymentDetails[paymentMethod].name, 'name')}
                    >
                      {copied === 'name' ? (
                        <Check className="h-4 w-4 text-success" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground">
                    {paymentMethod === 'telebirr' ? 'Phone Number' : 'Account Number'}
                  </Label>
                  <div className="flex items-center justify-between rounded-lg bg-muted p-3">
                    <span className="font-mono font-medium text-foreground">{paymentDetails[paymentMethod].number}</span>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8"
                      onClick={() => handleCopy(paymentDetails[paymentMethod].number, 'number')}
                    >
                      {copied === 'number' ? (
                        <Check className="h-4 w-4 text-success" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </>
            )}

            <Alert className="bg-warning/10 border-warning/20">
              <AlertCircle className="h-4 w-4 text-warning" />
              <AlertDescription className="text-warning-foreground">
                Deposit will be processed within 12-24 hours. If you send more than the requested amount, the excess money will NOT be refunded.
              </AlertDescription>
            </Alert>

            <div className="flex gap-3 pt-2">
              <Button variant="outline" className="flex-1 bg-transparent" onClick={() => setStep(2)}>
                Back
              </Button>
              <Button className="flex-1" onClick={() => setStep(4)}>
                I have sent the money
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 4: Confirm */}
      {step === 4 && (
        <Card>
          <CardHeader>
            <CardTitle>Confirm Deposit</CardTitle>
            <CardDescription>
              Please confirm that you have sent the payment
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg bg-muted p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Amount</span>
                <span className="font-medium text-foreground">ETB {parseFloat(amount).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Payment Method</span>
                <span className="font-medium text-foreground">
                  {paymentMethod === 'cbe' ? 'CBE Bank' : paymentMethod === 'telebirr' ? 'Telebirr' : 'Awash Bank'}
                </span>
              </div>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="flex gap-3">
              <Button variant="outline" className="flex-1 bg-transparent" onClick={() => setStep(3)} disabled={isSubmitting}>
                Back
              </Button>
              <Button className="flex-1" onClick={handleSubmitDeposit} disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Confirm Deposit'
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
