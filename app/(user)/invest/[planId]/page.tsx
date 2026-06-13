'use client'

import React from "react"

import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
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
  TrendingUp,
  Calendar,
  Gift
} from 'lucide-react'

type InvestmentPlan = {
  id: string
  name: string
  description: string
  min_amount: number
  max_amount: number
  duration_days: number
  daily_reward_percentage: number
}

export default function InvestPage() {
  const params = useParams()
  const planId = params.planId as string
  const [plan, setPlan] = useState<InvestmentPlan | null>(null)
  const [amount, setAmount] = useState('')
  const [walletBalance, setWalletBalance] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push('/auth/login')
        return
      }

      // Fetch plan
      const { data: planData } = await supabase
        .from('investment_plans')
        .select('*')
        .eq('id', planId)
        .single()

      if (planData) {
        setPlan(planData)
        setAmount(planData.min_amount.toString())
      }

      // Fetch wallet
      const { data: wallet } = await supabase
        .from('wallets')
        .select('balance')
        .eq('user_id', user.id)
        .single()

      if (wallet) {
        setWalletBalance(wallet.balance)
      }

      setIsLoading(false)
    }

    fetchData()
  }, [planId, router])

  const calculateDailyReward = () => {
    if (!plan || !amount) return 0
    return (parseFloat(amount) * plan.daily_reward_percentage) / 100
  }

  const calculateTotalReturn = () => {
    if (!plan || !amount) return 0
    const amountNum = parseFloat(amount)
    return (amountNum * plan.daily_reward_percentage) / 100 * plan.duration_days
  }

  const handleInvest = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    
    if (!plan) return

    const amountNum = parseFloat(amount)
    
    if (isNaN(amountNum) || amountNum < plan.min_amount) {
      setError(`Minimum investment is ETB ${plan.min_amount.toLocaleString()}`)
      return
    }

    if (plan.max_amount < 999999999 && amountNum > plan.max_amount) {
      setError(`Maximum investment for this plan is ETB ${plan.max_amount.toLocaleString()}`)
      return
    }

    if (amountNum > walletBalance) {
      setError('Insufficient wallet balance. Please deposit funds first.')
      return
    }

    setIsSubmitting(true)

    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push('/auth/login')
        return
      }

      const endDate = new Date()
      endDate.setDate(endDate.getDate() + plan.duration_days)

      const dailyReward = (amountNum * plan.daily_reward_percentage) / 100

      // Create order
      const { error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          plan_id: plan.id,
          amount: amountNum,
          daily_reward: dailyReward,
          end_date: endDate.toISOString(),
          next_claim_at: new Date().toISOString(),
        })

      if (orderError) throw orderError

      // Update wallet balance
      const { error: walletError } = await supabase
        .from('wallets')
        .update({ 
          balance: walletBalance - amountNum,
        })
        .eq('user_id', user.id)

      if (walletError) throw walletError

      // Create transaction record
      await supabase
        .from('transactions')
        .insert({
          user_id: user.id,
          type: 'investment',
          amount: amountNum,
          balance_before: walletBalance,
          balance_after: walletBalance - amountNum,
          description: `Investment in ${plan.name} plan`,
          status: 'completed',
        })

      setSuccess(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create investment')
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

  if (!plan) {
    return (
      <div className="p-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <AlertCircle className="h-12 w-12 text-destructive" />
              <h2 className="mt-4 text-xl font-semibold text-foreground">Plan Not Found</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                The investment plan you are looking for does not exist.
              </p>
              <Link href="/dashboard" className="mt-6">
                <Button>Back to Dashboard</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (success) {
    return (
      <div className="p-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-success/10">
                <CheckCircle2 className="h-10 w-10 text-success" />
              </div>
              <h2 className="mt-4 text-xl font-semibold text-foreground">Investment Successful!</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                You have successfully invested ETB {parseFloat(amount).toLocaleString()} in the {plan.name} plan.
                Start claiming your daily rewards now!
              </p>
              <div className="mt-6 flex w-full flex-col gap-2">
                <Link href="/orders">
                  <Button className="w-full">View My Orders</Button>
                </Link>
                <Link href="/dashboard">
                  <Button variant="outline" className="w-full bg-transparent">Back to Dashboard</Button>
                </Link>
              </div>
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
          <h1 className="text-xl font-semibold text-foreground">Invest in {plan.name}</h1>
          <p className="text-sm text-muted-foreground">{plan.description}</p>
        </div>
      </div>

      {/* Plan Details Card */}
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle>{plan.name} Plan</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="rounded-lg bg-muted p-3">
              <Calendar className="mx-auto h-5 w-5 text-muted-foreground" />
              <p className="mt-1 text-lg font-semibold text-foreground">{plan.duration_days}</p>
              <p className="text-xs text-muted-foreground">Days</p>
            </div>
            <div className="rounded-lg bg-muted p-3">
              <Gift className="mx-auto h-5 w-5 text-muted-foreground" />
              <p className="mt-1 text-lg font-semibold text-foreground">{plan.daily_reward_percentage}%</p>
              <p className="text-xs text-muted-foreground">Daily</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Balance Info */}
      <div className="mb-6 rounded-lg bg-muted/50 p-4">
        <p className="text-sm text-muted-foreground">Available Balance</p>
        <p className="text-xl font-bold text-foreground">ETB {walletBalance.toLocaleString()}</p>
      </div>

      {/* Investment Form */}
      <Card>
        <CardHeader>
          <CardTitle>Investment Amount</CardTitle>
          <CardDescription>
            Min: ETB {plan.min_amount.toLocaleString()} | 
            Max: {plan.max_amount >= 999999999 ? 'No Limit' : `ETB ${plan.max_amount.toLocaleString()}`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleInvest} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount (ETB)</Label>
              <Input
                id="amount"
                type="number"
                placeholder="Enter investment amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min={plan.min_amount}
                max={plan.max_amount >= 999999999 ? undefined : plan.max_amount}
                required
              />
            </div>

            {amount && parseFloat(amount) > 0 && (
              <div className="rounded-lg bg-muted p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Daily Reward</span>
                  <span className="font-medium text-success">
                    {plan.daily_reward_percentage} %
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Duration</span>
                  <span className="font-medium text-foreground">{plan.duration_days} days</span>
                </div>
                <div className="flex justify-between text-sm border-t border-border pt-2 mt-2">
                  <span className="text-muted-foreground">Total Return</span>
                  <span className="font-bold text-primary">
                    ETB {calculateTotalReturn().toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            )}

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                'Invest Now'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
