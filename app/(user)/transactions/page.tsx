'use client'

import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Loader2, 
  ArrowDownToLine,
  ArrowUpFromLine,
  TrendingUp,
  Gift,
  Settings,
  Receipt
} from 'lucide-react'
import { cn } from '@/lib/utils'

type Transaction = {
  id: string
  type: 'deposit' | 'withdrawal' | 'investment' | 'reward' | 'adjustment'
  amount: number
  status: 'pending' | 'approved' | 'rejected' | 'completed' | 'cancelled'
  description: string | null
  created_at: string
}

const typeConfig = {
  deposit: {
    icon: ArrowDownToLine,
    label: 'Deposit',
    color: 'text-success',
    bgColor: 'bg-success/10',
  },
  withdrawal: {
    icon: ArrowUpFromLine,
    label: 'Withdrawal',
    color: 'text-destructive',
    bgColor: 'bg-destructive/10',
  },
  investment: {
    icon: TrendingUp,
    label: 'Investment',
    color: 'text-primary',
    bgColor: 'bg-primary/10',
  },
  reward: {
    icon: Gift,
    label: 'Reward',
    color: 'text-success',
    bgColor: 'bg-success/10',
  },
  adjustment: {
    icon: Settings,
    label: 'Adjustment',
    color: 'text-muted-foreground',
    bgColor: 'bg-muted',
  },
}

const statusConfig = {
  pending: { label: 'Pending', variant: 'secondary' as const },
  approved: { label: 'Approved', variant: 'default' as const },
  rejected: { label: 'Rejected', variant: 'destructive' as const },
  completed: { label: 'Completed', variant: 'default' as const },
  cancelled: { label: 'Cancelled', variant: 'destructive' as const },
}

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchTransactions = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push('/auth/login')
        return
      }

      const { data: transactionsData } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50)

      if (transactionsData) {
        setTransactions(transactionsData)
      }
      setIsLoading(false)
    }

    fetchTransactions()
  }, [router])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
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
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-foreground">Transactions</h1>
        <p className="text-sm text-muted-foreground">Your transaction history</p>
      </div>

      {transactions.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center py-8">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                <Receipt className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-foreground">No Transactions</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Your transaction history will appear here
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {transactions.map((transaction) => {
            const config = typeConfig[transaction.type] ?? {
              icon: Receipt,
              label: transaction.type,
              color: "text-muted-foreground",
              bgColor: "bg-muted",
            }

            const status = statusConfig[transaction.status] ?? {
              label: transaction.status,
              variant: "secondary" as const,
            }

            const Icon = config.icon
            const isPositive = ['deposit', 'reward', 'referral_reward'].includes(transaction.type)

            return (
              <Card key={transaction.id}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-full",
                      config.bgColor
                    )}>
                      <Icon className={cn("h-5 w-5", config.color)} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-medium text-foreground truncate">
                          {config.label}
                        </p>
                        <p className={cn(
                          "font-semibold tabular-nums",
                          isPositive ? "text-success" : "text-foreground"
                        )}>
                          {isPositive ? '+ ' : '- '}ETB {transaction.amount.toLocaleString()}
                        </p>
                      </div>
                      <div className="flex items-center justify-between gap-2 mt-1">
                        <p className="text-xs text-muted-foreground truncate">
                          {transaction.description || formatDate(transaction.created_at)}
                        </p>
                        <Badge variant={status.variant} className="text-xs shrink-0">
                          {status.label}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
