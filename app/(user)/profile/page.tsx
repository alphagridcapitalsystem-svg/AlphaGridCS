'use client'

import React from "react"

import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { 
  Loader2, 
  AlertCircle, 
  CheckCircle2,
  User,
  Mail,
  Key,
  Copy,
  Check
} from 'lucide-react'
import { toast } from "sonner"

type Profile = {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  role: string
  referral_code: string | null
  created_at: string
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  
  // Form states
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [refData, setRefData] = useState({
    totalInvited: 0,
    totalConverted: 0,
    totalPending: 0,
    totalEarned: 0,
    invitedUsers: [],
    rewards: [],
  })
  const [claimingId, setClaimingId] = useState<string | null>(null)
  const [now, setNow] = useState(Date.now())
  
  // Password form states
  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  
  const router = useRouter()

  const getTimeLeft = (availableAt: string) => {
    const diff = new Date(availableAt).getTime() - now

    if (diff <= 0) return null

    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24)

    return `${days}d ${hours}h`
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const fetchProfile = async () => {
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
        setProfile(profileData)
        setFullName(profileData.full_name || '')
        setEmail(profileData.email)
      }

      setIsLoading(false)
    }

    fetchProfile()
  }, [router])

  const handleCopyReferralCode = async () => {
    if (profile) {
      await navigator.clipboard.writeText(profile.referral_code || '')
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
}

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setError(null)
    setSuccess(null)

    try {
      const supabase = createClient()
      
      // Update profile
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          full_name: fullName,
          email: email,
        })
        .eq('id', profile?.id)

      if (profileError) throw profileError

      // Update auth email if changed
      if (email !== profile?.email) {
        const { error: authError } = await supabase.auth.updateUser({
          email: email,
        })
        if (authError) throw authError
      }

      setSuccess('Profile updated successfully')
      setProfile(prev => prev ? { ...prev, full_name: fullName, email } : null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile')
    } finally {
      setIsSaving(false)
    }
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsChangingPassword(true)
    setError(null)
    setSuccess(null)

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match')
      setIsChangingPassword(false)
      return
    }

    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters')
      setIsChangingPassword(false)
      return
    }

    try {
      const supabase = createClient()
      
      // First verify current password by re-authenticating
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: profile?.email || '',
        password: currentPassword,
      })

      if (signInError) {
        throw new Error('Current password is incorrect')
      }

      // Update password
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      })

      if (updateError) throw updateError

      setSuccess('Password changed successfully')
      setShowPasswordForm(false)
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to change password')
    } finally {
      setIsChangingPassword(false)
    }
  }

  useEffect(() => {
  const fetchDashboard = async () => {
    try {
      const res = await fetch("/api/referrals/dashboard")

      if (!res.ok) {
        throw new Error(`Failed to fetch dashboard: ${res.status}`)
      }

      const data = await res.json()

      setRefData(data)
    } catch (err) {
      console.error("[AlphaGridCS] Dashboard fetch error:", err)

      // optional fallback so UI doesn't die
      setRefData({
        totalInvited: 0,
        totalConverted: 0,
        totalPending: 0,
        totalEarned: 0,
        invitedUsers: [],
        rewards: [],
      })
    }
  }

  fetchDashboard()
}, [])

  const getInitials = (name: string | null) => {
    if (!name) return 'U'
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="p-4 space-y-6">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-foreground">Profile</h1>
        <p className="text-sm text-muted-foreground">Manage your account settings</p>
      </div>

      {success && (
        <Alert className="bg-success/10 border-success/20">
          <CheckCircle2 className="h-4 w-4 text-success" />
          <AlertDescription className="text-success">{success}</AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Profile Avatar & ID */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center text-center">
            <Avatar className="h-20 w-20">
              <AvatarImage src={profile?.avatar_url || undefined} />
              <AvatarFallback className="text-xl bg-primary/10 text-primary">
                {getInitials(profile?.full_name ?? null)}
              </AvatarFallback>
            </Avatar>
            <h2 className="mt-4 text-lg font-semibold text-foreground">
              {profile?.full_name || 'User'}
            </h2>
            <p className="text-sm text-muted-foreground">{profile?.email}</p>

             <div className="mt-4 flex items-center gap-2 rounded-lg bg-muted px-3 py-2">
              <span className="text-xs text-muted-foreground">Referral code:</span>
              <span className="font-mono text-xs text-foreground">{profile?.referral_code}</span>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6"
                onClick={handleCopyReferralCode}
              >
                {copied ? (
                  <Check className="h-3 w-3 text-success" />
                ) : (
                  <Copy className="h-3 w-3" />
                )}
              </Button>
            </div>


          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Referral Information</CardTitle>
          <CardDescription>
            Track your earnings and invited users
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">

          {/* SUMMARY */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg bg-muted p-3">
              <p className="text-xs text-muted-foreground">Total earned</p>
              <p className="text-lg font-semibold text-green-500">
                ${Number(refData.totalEarned || 0).toFixed(2)}
              </p>
            </div>

            <div className="rounded-lg bg-muted p-3">
              <p className="text-xs text-muted-foreground">Invited</p>
              <p className="text-lg font-semibold">
                {refData.totalInvited}
              </p>
            </div>

            <div className="rounded-lg bg-muted p-3">
              <p className="text-xs text-muted-foreground">Total deposited users</p>
              <p className="text-lg font-semibold text-green-500">
                {refData.totalConverted}
              </p>
            </div>

            <div className="rounded-lg bg-muted p-3">
              <p className="text-xs text-muted-foreground">Not deposited users</p>
              <p className="text-lg font-semibold text-yellow-500">
                {refData.totalPending}
              </p>
            </div>
          </div>

          {/* Claimable rewards */}
          <div className="space-y-3">
            <p className="text-sm font-medium">Claimable referral rewards</p>

            <div className="max-h-60 overflow-auto space-y-3">
              {(
                refData.rewards ?? []).map((r: any) => {

                const rewardId = r.id ?? r.reward_id
                if (!rewardId) return null

                const status = (r.status || "").toLowerCase().trim()

                const availableAt = r.available_at
                  ? new Date(r.available_at).getTime()
                  : null

                const isAvailable = availableAt ? availableAt <= now : true
                const timeLeft = availableAt ? getTimeLeft(r.available_at) : null

                return (
                  <div key={rewardId} className="border-b pb-3 space-y-2">

                    {/* TOP ROW */}
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <p className="font-mono text-[10px] text-muted-foreground">
                          User ID: {r.referred_user_id?.slice(0, 8) ?? "unknown"}..
                        </p>

                        <p className="text-[10px] text-muted-foreground">
                          {r.created_at
                            ? new Date(r.created_at).toLocaleDateString()
                            : "N/A"}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-green-500 font-medium">
                          +${Number(r.reward_amount || 0).toFixed(2)}
                        </p>
                      </div>
                    </div>

                    {/* STATUS / COUNTDOWN */}
                    {status === "pending" && (
                      <p className="text-[10px] text-yellow-500">
                        {isAvailable ? "Ready to claim" : `Unlocks in ${timeLeft}`}
                      </p>
                    )}

                    {status === "claimed" && (
                      <p className="text-[10px] text-green-500 font-medium">
                        Added to wallet ✓
                      </p>
                    )}

                    {/* ACTION */}
                    <div className="flex justify-end">
                      {status === "pending" && isAvailable && (
                        <Button
                          size="sm"
                          disabled={claimingId === rewardId}
                          onClick={async () => {
                            setClaimingId(rewardId)

                            try {
                              const res = await fetch("/api/referrals/claim", {
                                method: "POST",
                                headers: {
                                  "Content-Type": "application/json",
                                },
                                body: JSON.stringify({ rewardId }),
                              })

                              if (!res.ok) throw new Error("Failed to claim")

                              const updated = await fetch("/api/referrals/dashboard")
                              const data = await updated.json()
                              setRefData(data)
                              toast.success("Referral claimed successfully!")
                            } catch (err) {
                              console.error(err)
                            } finally {
                              setClaimingId(null)
                            }
                          }}
                        >
                          {claimingId === rewardId ? "..." : "Add to wallet"}
                        </Button>
                      )}
                    </div>

                  </div>
                )
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Edit Profile */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <User className="h-4 w-4" />
            Personal Information
          </CardTitle>
          <CardDescription>Update your personal details</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                type="text"
                placeholder="Enter your full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Change Password */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Key className="h-4 w-4" />
            Password
          </CardTitle>
          <CardDescription>Change your account password</CardDescription>
        </CardHeader>
        <CardContent>
          {!showPasswordForm ? (
            <Button 
              variant="outline" 
              className="w-full bg-transparent"
              onClick={() => setShowPasswordForm(true)}
            >
              Change Password
            </Button>
          ) : (
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  placeholder="Enter current password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                />
              </div>
              <Separator />
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              <div className="flex gap-3">
                <Button 
                  type="button" 
                  variant="outline" 
                  className="flex-1 bg-transparent"
                  onClick={() => {
                    setShowPasswordForm(false)
                    setCurrentPassword('')
                    setNewPassword('')
                    setConfirmPassword('')
                    setError(null)
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" className="flex-1" disabled={isChangingPassword}>
                  {isChangingPassword ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Changing...
                    </>
                  ) : (
                    'Update Password'
                  )}
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
