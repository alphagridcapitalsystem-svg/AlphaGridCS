'use client'

import React from "react"

import { createClient } from '@/lib/supabase/client'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { 
  Landmark, 
  LayoutDashboard, 
  Users, 
  ArrowDownToLine,
  ArrowUpFromLine, 
  LogOut, 
  Loader2,
  Menu,
  X,
  TrendingUp,
  Settings,
  Shield,
  UserCog,
  FileText,
  Flag
} from 'lucide-react'
import { ThemeToggle } from '@/components/theme-toggle'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type UserProfile = {
  id: string
  email: string
  full_name: string | null
  role: string
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push('/auth/login')
        return
      }

      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (profileData) {
        // Check if user has staff role
        if (!['moderator', 'admin', 'super_admin'].includes(profileData.role)) {
          router.push('/dashboard')
          return
        }
        setProfile(profileData)
      }
      setIsLoading(false)
    }

    checkAuth()
  }, [router])

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  if (isLoading) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  // Determine which navigation items to show based on role
  const isSuperAdmin = profile?.role === 'super_admin'
  const isModerator = profile?.role === 'moderator'

  const adminNavItems = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/users', label: 'Users', icon: Users },
    { href: '/admin/deposits', label: 'Deposits', icon: ArrowDownToLine },
    { href: '/admin/withdrawals', label: 'Withdrawals', icon: ArrowUpFromLine },
    { href: '/admin/investments', label: 'Investments', icon: TrendingUp },
    { href: '/admin/settings', label: 'Settings', icon: Settings },
  ]

  const superAdminNavItems = [
    { href: '/super-admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/super-admin/plans', label: 'Investment Plans', icon: TrendingUp },
    { href: '/super-admin/users', label: 'All Users', icon: Users },
    { href: '/super-admin/admins', label: 'Staff Management', icon: UserCog },
    { href: '/super-admin/settings', label: 'System Settings', icon: Settings },
    { href: '/super-admin/audit-logs', label: 'Audit Logs', icon: FileText },
  ]

  const moderatorNavItems = [
    { href: '/moderator', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/moderator/reports', label: 'Reports & Flags', icon: Flag },
  ]

  // Select the right nav items based on current path and role
  let navItems = adminNavItems
  let panelTitle = 'Admin Panel'
  
  if (pathname.startsWith('/super-admin')) {
    navItems = superAdminNavItems
    panelTitle = 'Super Admin'
  } else if (pathname.startsWith('/moderator')) {
    navItems = moderatorNavItems
    panelTitle = 'Moderator Panel'
  } else if (pathname.startsWith('/admin')) {
    // Super admins can also access admin panel
    navItems = adminNavItems
    panelTitle = isSuperAdmin ? 'Admin Panel (Super Admin)' : 'Admin Panel'
  }

  return (
    <div className="flex min-h-svh bg-background">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 transform border-r border-border bg-sidebar transition-transform duration-200 ease-in-out lg:relative lg:translate-x-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-4">
          <Link href="/admin" className="flex items-center gap-2">
            <Landmark className="h-6 w-6 text-sidebar-primary" />
            <span className="text-lg font-bold text-sidebar-foreground">Admin</span>
          </Link>
          <Button 
            variant="ghost" 
            size="icon" 
            className="lg:hidden text-sidebar-foreground"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <nav className="flex flex-col gap-1 p-4">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                  isActive 
                    ? "bg-sidebar-accent text-sidebar-accent-foreground" 
                    : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 border-t border-sidebar-border p-4">
          <div className="flex items-center gap-3 rounded-lg bg-sidebar-accent/50 p-3">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-sidebar-foreground truncate">
                {profile?.full_name || profile?.email}
              </p>
              <p className="text-xs text-sidebar-foreground/60 capitalize">{profile?.role}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        {/* Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <Button 
            variant="ghost" 
            size="icon" 
            className="lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div className="hidden lg:block">
            <h1 className="text-lg font-semibold text-foreground">{panelTitle}</h1>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
