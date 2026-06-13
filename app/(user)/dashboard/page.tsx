'use client'

import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Eye, 
  EyeOff, 
  ArrowDownToLine, 
  ArrowUpFromLine, 
  Loader2,
  TrendingUp,
  CheckCircle2
} from 'lucide-react'

type Wallet = {
  balance: number
  total_deposited: number
  total_withdrawn: number
  total_earned: number
}

type InvestmentPlan = {
  id: string
  name: string
  description: string
  min_amount: number
  max_amount: number
  duration_days: number
  daily_reward_percentage: number
}

export default function DashboardPage() {
  const [wallet, setWallet] = useState<Wallet | null>(null)
  const [plans, setPlans] = useState<InvestmentPlan[]>([])
  const [showBalance, setShowBalance] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push('/auth/login')
        return
      }

      // Fetch wallet
      const { data: walletData } = await supabase
        .from('wallets')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (walletData) {
        setWallet(walletData)
      }

      // Fetch investment plans
      const { data: plansData } = await supabase
        .from('investment_plans')
        .select('*')
        .eq('is_active', true)
        .order('min_amount', { ascending: true })

      if (plansData) {
        setPlans(plansData)
      }

      setIsLoading(false)
    }

    fetchData()
  }, [router])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-ET', {
      style: 'decimal',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount)
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="p-4">
      {/* Wallet Card */}
      <Card className="mb-6 bg-gradient-to-br from-primary/10 via-primary/5 to-background border-primary/20">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Wallet Balance</p>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-3xl font-bold text-foreground">
                  {showBalance ? `ETB ${formatCurrency(wallet?.balance || 0)}` : '••••••••'}
                </p>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setShowBalance(!showBalance)}
                >
                  {showBalance ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
            </div>
          </div>
          
          <div className="mt-6 flex gap-3">
            <Link href="/deposit" className="flex-1">
              <Button className="w-full gap-2">
                <ArrowDownToLine className="h-4 w-4" />
                Deposit
              </Button>
            </Link>
            <Link href="/withdraw" className="flex-1">
              <Button variant="outline" className="w-full gap-2 bg-transparent">
                <ArrowUpFromLine className="h-4 w-4" />
                Withdraw
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-6 grid grid-cols-3 gap-4 border-t border-border pt-4">
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Deposited</p>
              <p className="text-sm font-medium text-foreground">
                {showBalance ? formatCurrency(wallet?.total_deposited || 0) : '••••'}
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Withdrawn</p>
              <p className="text-sm font-medium text-foreground">
                {showBalance ? formatCurrency(wallet?.total_withdrawn || 0) : '••••'}
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Earned</p>
              <p className="text-sm font-medium text-success">
                {showBalance ? formatCurrency(wallet?.total_earned || 0) : '••••'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Investment Plans */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-foreground">Investment Plans</h2>
        <p className="text-sm text-muted-foreground">Choose a plan to start earning</p>
      </div>

      <div className="space-y-4">
        {plans.map((plan) => (
          <Card key={plan.id} className="overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{plan.name}</CardTitle>
              </div>
              <CardDescription>{plan.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Min Investment</p>
                  <p className="font-medium text-foreground">ETB {formatCurrency(plan.min_amount)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Max Investment</p>
                  <p className="font-medium text-foreground">
                    {plan.max_amount >= 999999999 ? 'No Limit' : `ETB ${formatCurrency(plan.max_amount)}`}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Duration</p>
                  <p className="font-medium text-foreground">{plan.duration_days} days</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Daily Reward</p>
                  <p className="font-medium text-success">{plan.daily_reward_percentage} %</p>
                </div>
              </div>

              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2 text-foreground">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  Daily claimable rewards
                </li>
                <li className="flex items-center gap-2 text-foreground">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  Guaranteed returns
                </li>
              </ul>

              <Link href={`/invest/${plan.id}`}>
                <Button className="w-full">Invest Now</Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
