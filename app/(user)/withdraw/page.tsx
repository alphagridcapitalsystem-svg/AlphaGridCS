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
  Building2,
  Smartphone
} from 'lucide-react'
import { cn } from '@/lib/utils'

type PaymentMethod = 'cbe' | 'telebirr' | null

export default function WithdrawPage() {
  const [step, setStep] = useState(1)
  const [amount, setAmount] = useState('')
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(null)
  const [accountDetails, setAccountDetails] = useState('')
  const [walletBalance, setWalletBalance] = useState(0)
  const [availableWithdrawal, setAvailableWithdrawal] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const MIN_WITHDRAWAL = 200

  useEffect(() => {
    const fetchWallet = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push('/auth/login')
        return
      }

      const { data: wallet } = await supabase
        .from('wallets')
        .select('balance, total_earned, total_withdrawn')
        .eq('user_id', user.id)
        .single()

      if (wallet) {
        setWalletBalance(wallet.balance)

        setAvailableWithdrawal(
          (wallet.total_earned ?? 0) -
          (wallet.total_withdrawn ?? 0)
        )
      }
      setIsLoading(false)
    }

    fetchWallet()
  }, [router])

  const handleAmountSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    
    const amountNum = parseFloat(amount)
    if (isNaN(amountNum) || amountNum < MIN_WITHDRAWAL) {
      setError(`Minimum withdrawal amount is ETB ${MIN_WITHDRAWAL.toLocaleString()}`)
      return
    }
    
    if (amountNum > availableWithdrawal) {
      setError('Insufficient balance')
      return
    }
    
    setStep(2)
  }

  const handlePaymentMethodSelect = (method: PaymentMethod) => {
    setPaymentMethod(method)
    setStep(3)
  }

  const handleAccountDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    
    if (!accountDetails.trim()) {
      setError('Please enter your account details')
      return
    }
    
    setStep(4)
  }

  const handleSubmitWithdrawal = async () => {
    setIsSubmitting(true)
    setError(null)

    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push('/auth/login')
        return
      }

      const withdrawalAmount = parseFloat(amount)

      // First, verify and deduct from wallet balance
      const { data: wallet, error: walletFetchError } = await supabase
        .from('wallets')
        .select('balance, total_earned, total_withdrawn')
        .eq('user_id', user.id)
        .single()

      if (walletFetchError || !wallet) {
        throw new Error('Failed to verify wallet balance')
      }

      const availableWithdrawal =
        (wallet.total_earned ?? 0) -
        (wallet.total_withdrawn ?? 0)

      if (withdrawalAmount > availableWithdrawal) {
        throw new Error('Insufficient withdrawable profit')
      }

      // Deduct balance first (will be refunded if withdrawal is rejected)
      const newBalance = wallet.balance - withdrawalAmount
      const newTotalWithdrawn =
        (wallet.total_withdrawn ?? 0) + withdrawalAmount
 
      const { error: walletUpdateError } = await supabase
        .from('wallets')
        .update({ balance: newBalance, total_withdrawn: newTotalWithdrawn })
        .eq('user_id', user.id)

      if (walletUpdateError) {
        throw new Error('Failed to deduct wallet balance')
      }

      const { data: withdrawals, error: withdrawalError } = await supabase
        .from('withdrawals')
        .insert({
          user_id: user.id,
          amount: withdrawalAmount,
          payment_method: paymentMethod,
          account_details: accountDetails,
          status: 'pending',
        })
        .select()
        .single()
      console.log("Withdrawal error:", withdrawalError)

      if (withdrawalError) {
        // Rollback wallet balance if withdrawal insert fails
        await supabase.from('wallets').update({ balance: wallet.balance }).eq('user_id', user.id)
        throw withdrawalError
      }

      // Create transaction record
      const { data, error } = await supabase
        .from('transactions')
        .insert({
          user_id: user.id,
          reference_id: withdrawals.id,
          type: 'withdrawal',
          amount: -withdrawalAmount,
          status: 'pending',
          description: `Withdrawal request via ${paymentMethod === 'cbe' ? 'CBE Bank' : 'Telebirr'} - Balance deducted`,
        })

      if (error) {
        await supabase.from('wallets').update({ balance: wallet.balance }).eq('user_id', user.id)
        throw error
      }


      // Update local state
      setWalletBalance(newBalance)
      setSuccess(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit withdrawal')
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
              <h2 className="mt-4 text-xl font-semibold text-foreground">Withdrawal Requested</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Your withdrawal request has been submitted successfully. 
                It will be processed within 12-24 hours.
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
          <h1 className="text-xl font-semibold text-foreground">Withdraw Funds</h1>
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

      {/* Balance Info */}
      <div className="mb-6 rounded-lg bg-muted/50 p-4">
        <p className="text-sm text-muted-foreground">Withdrwable Balance</p>
        <p className="text-xl font-bold text-foreground">ETB {availableWithdrawal.toLocaleString()}</p>
      </div>

      {/* Step 1: Enter Amount */}
      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Enter Amount</CardTitle>
            <CardDescription>
              Minimum withdrawal is ETB {MIN_WITHDRAWAL.toLocaleString()}
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
                  min={MIN_WITHDRAWAL}
                  max={availableWithdrawal}
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
            <CardTitle>Withdrawal Method</CardTitle>
            <CardDescription>
              Where should we send ETB {parseFloat(amount).toLocaleString()}?
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
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

      {/* Step 3: Account Details */}
      {step === 3 && (
        <Card>
          <CardHeader>
            <CardTitle>Your Account Details</CardTitle>
            <CardDescription>
              {paymentMethod === 'cbe' 
                ? 'Enter your CBE bank account number'
                : 'Enter your Telebirr phone number'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAccountDetailsSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="accountDetails">
                  {paymentMethod === 'cbe' ? 'Account Number' : 'Phone Number'}
                </Label>
                <Input
                  id="accountDetails"
                  type="text"
                  placeholder={paymentMethod === 'cbe' ? 'Enter account number' : 'e.g., +251912345678'}
                  value={accountDetails}
                  onChange={(e) => setAccountDetails(e.target.value)}
                  required
                />
              </div>
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1 bg-transparent" onClick={() => setStep(2)} type="button">
                  Back
                </Button>
                <Button type="submit" className="flex-1">
                  Continue
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Step 4: Confirm */}
      {step === 4 && (
        <Card>
          <CardHeader>
            <CardTitle>Confirm Withdrawal</CardTitle>
            <CardDescription>
              Please review your withdrawal details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg bg-muted p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Amount</span>
                <span className="font-medium text-foreground">ETB {parseFloat(amount).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Method</span>
                <span className="font-medium text-foreground">
                  {paymentMethod === 'cbe' ? 'CBE Bank' : 'Telebirr'}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  {paymentMethod === 'cbe' ? 'Account' : 'Phone'}
                </span>
                <span className="font-mono font-medium text-foreground">{accountDetails}</span>
              </div>
            </div>

            <Alert className="bg-warning/10 border-warning/20">
              <AlertCircle className="h-4 w-4 text-warning" />
              <AlertDescription className="text-warning-foreground">
                Withdrawals are processed within 12-24 hours. Please ensure your account details are correct.
              </AlertDescription>
            </Alert>

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
              <Button className="flex-1" onClick={handleSubmitWithdrawal} disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Confirm Withdrawal'
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
