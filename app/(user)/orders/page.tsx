'use client'

import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Loader2, 
  Gift,
  Clock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react'
import { cn } from '@/lib/utils'

type Order = {
  id: string
  plan_id: string
  amount: number
  daily_reward: number
  total_earned: number
  start_date: string
  end_date: string
  next_claim_at: string
  is_active: boolean
  is_completed: boolean
  investment_plans: {
    name: string
    daily_reward_percentage: number
    duration_days: number
  }
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [claimingId, setClaimingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const router = useRouter()

  const fetchOrders = async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      router.push('/auth/login')
      return
    }

    const { data: ordersData } = await supabase
      .from('orders')
      .select(`
        *,
        investment_plans (
          name,
          daily_reward_percentage,
          duration_days
        )
      `)
      .eq('user_id', user.id)
      .eq('is_active', true)
      .order('created_at', { ascending: false })

    if (ordersData) {
      setOrders(ordersData)
    }
    setIsLoading(false)
  }

  useEffect(() => {
    fetchOrders()
  }, [router])

  const canClaim = (order: Order) => {
    const now = new Date()
    const nextClaim = new Date(order.next_claim_at)
    return now >= nextClaim && order.is_active && !order.is_completed
  }

  const getTimeUntilClaim = (order: Order) => {
    const now = new Date()
    const nextClaim = new Date(order.next_claim_at)
    const diff = nextClaim.getTime() - now.getTime()
    
    if (diff <= 0) return null
    
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((diff % (1000 * 60)) / 1000)
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }

  const getDaysRemaining = (order: Order) => {
    const now = new Date()
    const endDate = new Date(order.end_date)
    const diff = endDate.getTime() - now.getTime()
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
  }

  const handleClaimReward = async (order: Order) => {
    if (!canClaim(order)) return
    
    setClaimingId(order.id)
    setError(null)
    setSuccessMessage(null)

    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push('/auth/login')
        return
      }

      // Get current wallet balance
      const { data: wallet } = await supabase
        .from('wallets')
        .select('balance, total_earned')
        .eq('user_id', user.id)
        .single()

      if (!wallet) throw new Error('Wallet not found')

      // Calculate next claim time (24 hours from now)
      const nextClaimAt = new Date()
      nextClaimAt.setHours(nextClaimAt.getHours() + 24)

      // Update wallet balance
      const { error: walletError } = await supabase
        .from('wallets')
        .update({
          balance: wallet.balance + order.daily_reward,
          total_earned: wallet.total_earned + order.daily_reward,
        })
        .eq('user_id', user.id)

      if (walletError) throw walletError

      // Update order
      const { error: orderError } = await supabase
        .from('orders')
        .update({
          total_earned: order.total_earned + order.daily_reward,
          next_claim_at: nextClaimAt.toISOString(),
        })
        .eq('id', order.id)

      if (orderError) throw orderError

      // Create reward record
      await supabase
        .from('rewards')
        .insert({
          user_id: user.id,
          order_id: order.id,
          amount: order.daily_reward,
        })

      // Create transaction record
      await supabase
        .from('transactions')
        .insert({
          user_id: user.id,
          type: 'reward',
          amount: order.daily_reward,
          balance_before: wallet.balance,
          balance_after: wallet.balance + order.daily_reward,
          reference_id: order.id,
          description: `Daily reward from ${order.investment_plans.name} plan`,
          status: 'completed',
        })

      setSuccessMessage(`Claimed ETB ${order.daily_reward.toLocaleString()} reward!`)
      
      // Refresh orders
      await fetchOrders()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to claim reward')
    } finally {
      setClaimingId(null)
    }
  }

  // Timer effect for countdown
  const [, setTick] = useState(0)
  useEffect(() => {
    const interval = setInterval(() => {
      setTick(t => t + 1)
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="p-4">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-foreground">My Orders</h1>
        <p className="text-sm text-muted-foreground">Your active investments</p>
      </div>

      {successMessage && (
        <Alert className="mb-4 bg-success/10 border-success/20">
          <CheckCircle2 className="h-4 w-4 text-success" />
          <AlertDescription className="text-success">{successMessage}</AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {orders.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center py-8">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                <Gift className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-foreground">No Active Orders</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Start investing to see your orders here
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const timeUntilClaim = getTimeUntilClaim(order)
            const daysRemaining = getDaysRemaining(order)
            const canClaimNow = canClaim(order)

            return (
              <Card key={order.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{order.investment_plans.name}</CardTitle>
                    <span className={cn(
                      "rounded-full px-2 py-0.5 text-xs font-medium",
                      order.is_active ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"
                    )}>
                      {order.is_active ? 'Active' : 'Completed'}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Investment</p>
                      <p className="font-medium text-foreground">ETB {order.amount.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Daily Reward</p>
                      <p className="font-medium text-success">{order.investment_plans.daily_reward_percentage.toLocaleString()} %</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Total Earned</p>
                      <p className="font-medium text-foreground">ETB {order.total_earned.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Days Remaining</p>
                      <p className="font-medium text-foreground">{daysRemaining} days</p>
                    </div>
                  </div>

                  {order.is_active && (
                    <div className="pt-2 border-t border-border">
                      {canClaimNow ? (
                        <Button 
                          className="w-full gap-2" 
                          onClick={() => handleClaimReward(order)}
                          disabled={claimingId === order.id}
                        >
                          {claimingId === order.id ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin" />
                              Claiming...
                            </>
                          ) : (
                            <>
                              <Gift className="h-4 w-4" />
                              Claim Reward
                            </>
                          )}
                        </Button>
                      ) : (
                        <div className="flex items-center justify-center gap-2 rounded-lg bg-muted p-3">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">Next claim in</span>
                          <span className="font-mono font-medium text-foreground">{timeUntilClaim}</span>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
