'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { CheckCircle2 } from 'lucide-react'

interface InvestmentPlan {
  id: string
  name: string
  description: string
  min_amount: number
  max_amount: number
  daily_reward_percentage: number
  duration_days: number
  is_active: boolean
  created_at: string
}

export function InvestmentPlansDisplay() {
  const [plans, setPlans] = useState<InvestmentPlan[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    fetchActivePlans()
  }, [])

  async function fetchActivePlans() {
    try {
      const { data, error } = await supabase
        .from('investment_plans')
        .select('id, name, description, min_amount, max_amount, daily_reward_percentage, duration_days, is_active, created_at')
        .eq('is_active', true)
        .order('created_at', { ascending: true })

      if (error) {
        console.error('[AlphaGridCS] Error fetching plans:', error)
      } else {
        setPlans(data || [])
      }
    } catch (error) {
      console.error('[AlphaGridCS] Error:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="mt-12 grid gap-8 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-96 bg-muted rounded-lg animate-pulse" />
        ))}
      </div>
    )
  }

  if (plans.length === 0) {
    return (
      <div className="mt-12 text-center">
        <p className="text-muted-foreground">No active investment plans available at the moment.</p>
      </div>
    )
  }

  return (
    <div className="mt-12 grid gap-8 md:grid-cols-3">
      {plans.map((plan, index) => (
        <Card
          key={plan.id}
          className={`flex flex-col rounded-xl p-6 ${
            index === 1 ? 'border-2 border-primary shadow-lg md:scale-105' : 'shadow-sm'
          }`}
        >
          <div className="mb-4">
            <span className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${
              index === 0
                ? 'bg-secondary text-secondary-foreground'
                : index === 1
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-accent text-accent-foreground'
            }`}>
              {plan.name}
            </span>
            {index === 1 && (
              <span className="ml-2 rounded-full bg-accent px-2 py-0.5 text-xs font-medium text-accent-foreground">
                Popular
              </span>
            )}
          </div>

          <div>
            <p className="text-2xl font-bold text-foreground">{plan.daily_reward_percentage.toLocaleString()} %</p>
            <p className="text-sm text-muted-foreground">Daily Income</p>
          </div>

          <div className="my-6 border-t border-border" />

          <ul className="flex-1 space-y-3">
            <li className="flex items-center gap-2 text-sm text-foreground">
              <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
              <span>Investment: ETB {plan.min_amount.toLocaleString()} - {plan.max_amount.toLocaleString()}</span>
            </li>
            <li className="flex items-center gap-2 text-sm text-foreground">
              <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
              <span>Duration: {plan.duration_days} days</span>
            </li>
            {plan.description && (
              <li className="flex items-start gap-2 text-sm text-muted-foreground pt-2 border-t border-border">
                <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                <span>{plan.description}</span>
              </li>
            )}
          </ul>

          <Link href="/auth/login" className="mt-6">
            <Button
              className="w-full"
              variant={index === 1 ? 'default' : 'outline'}
            >
              Invest Now
            </Button>
          </Link>
        </Card>
      ))}
    </div>
  )
}
