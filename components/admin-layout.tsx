'use client'

import { useEffect, useState } from 'react'
import { useAdminAuth } from '@/contexts/admin-auth-context'
import { supabase } from '@/lib/supabase'
import AdminLogin from './admin-login'
import AdminDashboard from './admin-dashboard'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { LogOut, User } from 'lucide-react'

export default function AdminLayout() {
  const { user, loading, signOut } = useAdminAuth()
  const [isRecovery, setIsRecovery] = useState(false)
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [resetLoading, setResetLoading] = useState(false)
  const [resetError, setResetError] = useState('')
  const [resetMessage, setResetMessage] = useState('')

  useEffect(() => {
    const checkHash = () => {
      if (typeof window === 'undefined') return
      const hash = window.location.hash || ''
      // Supabase adds #access_token=...&type=recovery...
      setIsRecovery(hash.includes('type=recovery'))
    }
    checkHash()
    window.addEventListener('hashchange', checkHash)
    const { data: listener } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setIsRecovery(true)
      }
    })
    return () => {
      window.removeEventListener('hashchange', checkHash)
      listener.subscription.unsubscribe()
    }
  }, [])

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setResetError('')
    setResetMessage('')
    if (!newPassword || newPassword.length < 8) {
      setResetError('Password must be at least 8 characters')
      return
    }
    if (newPassword !== confirmPassword) {
      setResetError('Passwords do not match')
      return
    }
    try {
      setResetLoading(true)
      const { error } = await supabase.auth.updateUser({ password: newPassword })
      if (error) {
        setResetError(error.message)
        return
      }
      setResetMessage('Password updated successfully. You can now access the dashboard.')
      setIsRecovery(false)
      if (typeof window !== 'undefined') {
        // Clear hash to avoid re-trigger
        window.history.replaceState(null, '', window.location.pathname)
      }
    } finally {
      setResetLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-amber-600 mx-auto"></div>
          <p className="mt-4 text-foreground/70 text-lg">Loading...</p>
        </div>
      </div>
    )
  }

  if (isRecovery) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-full max-w-md p-6">
          <h1 className="text-2xl font-serif font-bold text-foreground mb-6">Set a new password</h1>
          <form onSubmit={handlePasswordUpdate} className="space-y-4">
            <div>
              <label className="block text-sm text-foreground mb-2">New password</label>
              <Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="h-12" required />
            </div>
            <div>
              <label className="block text-sm text-foreground mb-2">Confirm password</label>
              <Input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="h-12" required />
            </div>
            {resetError && (
              <div className="p-3 bg-red-600/10 border border-red-600/20 rounded text-red-600 text-sm">{resetError}</div>
            )}
            {resetMessage && (
              <div className="p-3 bg-green-600/10 border border-green-600/20 rounded text-green-600 text-sm">{resetMessage}</div>
            )}
            <Button type="submit" disabled={resetLoading} className="w-full h-12 bg-amber-600 hover:bg-amber-700">
              {resetLoading ? 'Updating…' : 'Update Password'}
            </Button>
          </form>
        </div>
      </div>
    )
  }

  if (!user) {
    return <AdminLogin onLogin={() => {}} />
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Admin Header */}
      <div className="border-b border-border/20 bg-card/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-serif font-bold text-foreground">
                Admin Dashboard
              </h1>
              <div className="h-6 w-px bg-border/20"></div>
              <div className="flex items-center gap-2 text-sm text-foreground/60">
                <User className="h-4 w-4" />
                {user.email}
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <a
                href="/"
                className="text-foreground/60 hover:text-amber-600 transition-colors text-sm font-medium"
              >
                View Site
              </a>
              <Button
                onClick={signOut}
                variant="outline"
                size="sm"
                className="border-border/20 hover:border-red-600/50 hover:text-red-600 hover:bg-red-600/10 transition-all duration-300"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Dashboard */}
      <AdminDashboard />
    </div>
  )
}
