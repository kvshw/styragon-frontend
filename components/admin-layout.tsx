'use client'

import { useAdminAuth } from '@/contexts/admin-auth-context'
import AdminLogin from './admin-login'
import AdminDashboard from './admin-dashboard'
import { Button } from '@/components/ui/button'
import { LogOut, User } from 'lucide-react'

export default function AdminLayout() {
  const { user, loading, signOut } = useAdminAuth()

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
