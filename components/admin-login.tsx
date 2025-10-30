'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Eye, EyeOff, Lock, Mail, ArrowRight } from 'lucide-react'

interface LoginForm {
  email: string
  password: string
}

export default function AdminLogin({ onLogin }: { onLogin: () => void }) {
  const [form, setForm] = useState<LoginForm>({
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: form.email,
        password: form.password
      })

      if (error) {
        setError(error.message)
        return
      }

      if (data.user) {
        onLogin()
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: keyof LoginForm, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }))
    if (error) setError('')
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Brand */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-serif font-bold text-foreground mb-2">
            Styragon
            <span className="block text-amber-600">Admin</span>
          </h1>
          <p className="text-lg text-foreground/70 font-light">
            Secure access to your luxury content management
          </p>
        </div>

        {/* Login Form */}
        <Card className="p-8 border-border/20 bg-card/50 backdrop-blur-sm">
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email Field */}
            <div>
              <label className="block text-lg font-medium text-foreground mb-3">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-foreground/40 h-5 w-5" />
                <Input
                  type="email"
                  value={form.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="admin@styragon.com"
                  className="h-14 pl-12 text-lg border-border/20 bg-background/50 focus:border-amber-600/50 focus:ring-amber-600/20"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-lg font-medium text-foreground mb-3">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-foreground/40 h-5 w-5" />
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  placeholder="Enter your password"
                  className="h-14 pl-12 pr-12 text-lg border-border/20 bg-background/50 focus:border-amber-600/50 focus:ring-amber-600/20"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-foreground/40 hover:text-foreground/70 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-600/10 border border-red-600/20 rounded-md">
                <p className="text-red-600 text-base font-medium">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-14 bg-amber-600 hover:bg-amber-700 text-white text-lg font-medium"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                  Signing In...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="h-5 w-5 ml-3" />
                </>
              )}
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-border/20">
            <p className="text-center text-foreground/60 text-sm">
              Authorized personnel only
            </p>
          </div>
        </Card>

        {/* Back to Site */}
        <div className="text-center mt-8">
          <a
            href="/"
            className="text-foreground/60 hover:text-amber-600 transition-colors text-base font-medium"
          >
            ← Back to main site
          </a>
        </div>
      </div>
    </div>
  )
}
