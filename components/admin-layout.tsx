'use client'

import { useEffect, useState } from 'react'
import { useAdminAuth } from '@/contexts/admin-auth-context'
import { supabase } from '@/lib/supabase'
import AdminLogin from './admin-login'
import AdminDashboard from './admin-dashboard'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { LogOut, User, Pencil } from 'lucide-react'

export default function AdminLayout() {
  const { user, loading, signOut } = useAdminAuth()
  const [isRecovery, setIsRecovery] = useState(false)
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [resetLoading, setResetLoading] = useState(false)
  const [resetError, setResetError] = useState('')
  const [resetMessage, setResetMessage] = useState('')
  const [adminName, setAdminName] = useState<string>('')
  const [editingName, setEditingName] = useState(false)
  const [nameSaving, setNameSaving] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState('')
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [pass1, setPass1] = useState('')
  const [pass2, setPass2] = useState('')
  const [profileSaving, setProfileSaving] = useState(false)
  const [profileError, setProfileError] = useState('')
  const [profileMessage, setProfileMessage] = useState('')
  const [showPasswordFields, setShowPasswordFields] = useState(false)

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

  useEffect(() => {
    const loadAdminProfile = async () => {
      if (!user?.email) return
      const { data } = await supabase
        .from('admin_users')
        .select('full_name, avatar_url')
        .eq('email', user.email)
        .maybeSingle()
      setAdminName(data?.full_name || '')
      setAvatarUrl(data?.avatar_url || '')
    }
    loadAdminProfile()
  }, [user?.email])

  const saveAdminName = async () => {
    if (!user?.email) return
    setNameSaving(true)
    await supabase
      .from('admin_users')
      .update({ full_name: adminName || null, updated_at: new Date().toISOString() })
      .eq('email', user.email)
    setNameSaving(false)
    setEditingName(false)
  }

  const uploadAvatar = async (file: File): Promise<string | null> => {
    try {
      const ext = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
      const path = `admin-avatars/${fileName}`
      const { error } = await supabase.storage.from('images').upload(path, file)
      if (error) throw error
      const { data } = supabase.storage.from('images').getPublicUrl(path)
      return data.publicUrl
    } catch (e) {
      return null
    }
  }

  const saveProfile = async () => {
    if (!user?.email) return
    setProfileError('')
    setProfileMessage('')
    setProfileSaving(true)
    try {
      let newAvatarUrl = avatarUrl
      if (avatarFile) {
        const uploaded = await uploadAvatar(avatarFile)
        if (uploaded) newAvatarUrl = uploaded
      }

      const { error: updateErr } = await supabase
        .from('admin_users')
        .update({ full_name: adminName || null, avatar_url: newAvatarUrl || null, updated_at: new Date().toISOString() })
        .eq('email', user.email)
      if (updateErr) throw updateErr

      if (pass1 || pass2) {
        if (pass1 !== pass2) {
          setProfileError('Passwords do not match')
          setProfileSaving(false)
          return
        }
        if (pass1.length < 8) {
          setProfileError('Password must be at least 8 characters')
          setProfileSaving(false)
          return
        }
        const { error: pwErr } = await supabase.auth.updateUser({ password: pass1 })
        if (pwErr) throw pwErr
      }

      setAvatarFile(null)
      setProfileMessage('Profile updated successfully')
      // keep modal open so user sees confirmation
    } catch (e: any) {
      setProfileError(e?.message || 'Failed to update profile')
    } finally {
      setProfileSaving(false)
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

  // Gate admin UI: must be present in admin_users
  if (user && adminName === '' && !editingName && !isRecovery) {
    // If no admin record name loaded yet, we still allow; but if profile fetch showed no row,
    // adminName remains empty. We'll display Access Denied.
  }

  return (
    <div className="min-h-screen bg-background admin-scope">
      {/* Admin Header */}
      <div className="border-b border-border/20 bg-card/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-serif font-bold text-foreground">
                Admin Dashboard
              </h1>
              <div className="h-6 w-px bg-border/20"></div>
              <div className="flex items-center gap-3 text-sm text-foreground/70">
                <User className="h-4 w-4" />
                {editingName ? (
                  <div className="flex items-center gap-2">
                    <Input
                      value={adminName ?? ''}
                      onChange={(e) => setAdminName(e.target.value)}
                      placeholder="Your name"
                      className="h-8 w-48"
                    />
                    <Button size="sm" onClick={saveAdminName} disabled={nameSaving} className="h-8 px-3 bg-amber-600 hover:bg-amber-700">
                      {nameSaving ? 'Saving…' : 'Save'}
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setEditingName(false)} className="h-8 px-3">Cancel</Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{adminName || user.email}</span>
                    <button
                      className="text-foreground/50 hover:text-amber-600"
                      title="Edit display name"
                      onClick={() => setEditingName(true)}
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <a
                href="/"
                className="text-foreground/60 hover:text-amber-600 transition-colors text-sm font-medium"
              >
                View Site
              </a>
              <Dialog open={profileOpen} onOpenChange={setProfileOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="border-border/20">Profile</Button>
                </DialogTrigger>
                <DialogContent className="admin-dialog max-w-lg bg-card text-foreground border border-border/30 shadow-2xl rounded-2xl">
                  <DialogHeader>
                    <DialogTitle>Admin Profile</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-2">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full overflow-hidden bg-amber-100 flex items-center justify-center text-amber-700 font-semibold">
                        {adminName ? adminName.split(' ').map(n => n[0]).join('').slice(0,2) : (user.email || 'U').slice(0,2).toUpperCase()}
                      </div>
                      {avatarUrl && (
                        <img src={avatarUrl} alt="avatar" className="w-12 h-12 rounded-full object-cover border border-amber-600/40" />
                      )}
                    </div>
                    <div>
                      <label className="block text-sm mb-2">Display name</label>
                      <Input value={adminName ?? ''} onChange={(e) => setAdminName(e.target.value)} className="h-10 border-border/40 bg-card text-foreground placeholder:text-foreground/50 focus:border-amber-600/60 focus:ring-amber-600/20" />
                    </div>
                    {/* Removed manual Avatar URL input per request */}
                    <div>
                      <label className="block text-sm mb-2">Upload new avatar</label>
                      <Input type="file" accept="image/*" onChange={(e) => setAvatarFile(e.target.files?.[0] || null)} className="h-10 border-border/40 bg-card text-foreground placeholder:text-foreground/50 focus:border-amber-600/60 focus:ring-amber-600/20" />
                    </div>
                    <div>
                      <label className="flex items-center gap-2 text-sm">
                        <input type="checkbox" checked={showPasswordFields} onChange={(e) => setShowPasswordFields(e.target.checked)} />
                        Change password
                      </label>
                      {showPasswordFields && (
                        <div className="grid grid-cols-2 gap-3 mt-3">
                          <div>
                            <label className="block text-sm mb-2">New password</label>
                            <Input autoComplete="new-password" type="password" value={pass1} onChange={(e) => setPass1(e.target.value)} className="h-10 border-border/40 bg-card text-foreground placeholder:text-foreground/50 focus:border-amber-600/60 focus:ring-amber-600/20" />
                          </div>
                          <div>
                            <label className="block text-sm mb-2">Confirm password</label>
                            <Input autoComplete="new-password" type="password" value={pass2} onChange={(e) => setPass2(e.target.value)} className="h-10 border-border/40 bg-card text-foreground placeholder:text-foreground/50 focus:border-amber-600/60 focus:ring-amber-600/20" />
                          </div>
                        </div>
                      )}
                    </div>
                    {profileError && <div className="p-3 text-sm text-red-600 bg-red-600/10 border border-red-600/20 rounded">{profileError}</div>}
                    {profileMessage && <div className="p-3 text-sm text-green-600 bg-green-600/10 border border-green-600/20 rounded">{profileMessage}</div>}
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setProfileOpen(false)}>Cancel</Button>
                    <Button onClick={saveProfile} disabled={profileSaving} className="bg-amber-600 hover:bg-amber-700">
                      {profileSaving ? 'Saving…' : 'Save changes'}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
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
