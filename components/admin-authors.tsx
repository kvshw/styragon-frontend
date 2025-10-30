'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Save, Edit, Trash2 } from 'lucide-react'

interface Author {
  id: number
  name: string
  email: string
  bio?: string | null
  avatar_url?: string | null
}

interface AuthorForm {
  name: string
  email: string
  bio: string
  avatar_url: string
}

export default function AdminAuthorsManager() {
  const [authors, setAuthors] = useState<Author[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Author | null>(null)
  const [form, setForm] = useState<AuthorForm>({ name: '', email: '', bio: '', avatar_url: '' })
  const [saving, setSaving] = useState(false)

  const fetchAuthors = async () => {
    setLoading(true)
    const { data } = await supabase.from('authors').select('*').order('name', { ascending: true })
    setAuthors(data || [])
    setLoading(false)
  }

  useEffect(() => { fetchAuthors() }, [])

  const resetForm = () => {
    setForm({ name: '', email: '', bio: '', avatar_url: '' })
    setEditing(null)
  }

  const saveAuthor = async () => {
    setSaving(true)
    try {
      const payload = { name: form.name, email: form.email, bio: form.bio || null, avatar_url: form.avatar_url || null }
      if (editing) {
        const { error } = await supabase.from('authors').update(payload).eq('id', editing.id)
        if (error) throw error
      } else {
        const { error } = await supabase.from('authors').insert(payload)
        if (error) throw error
      }
      resetForm()
      fetchAuthors()
    } finally {
      setSaving(false)
    }
  }

  const deleteAuthor = async (id: number) => {
    if (!confirm('Delete this author?')) return
    await supabase.from('authors').delete().eq('id', id)
    fetchAuthors()
  }

  if (loading) return <div className="text-center py-12 text-foreground/70">Loading authors...</div>

  return (
    <div className="space-y-8">
      <Card className="p-6 border-border/20 bg-card/50 backdrop-blur-sm">
        <h3 className="text-2xl font-serif font-semibold mb-6">{editing ? 'Edit Author' : 'Add Author'}</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm mb-2">Name</label>
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="h-12" />
          </div>
          <div>
            <label className="block text-sm mb-2">Email</label>
            <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="h-12" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm mb-2">Bio</label>
            <Textarea rows={4} value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm mb-2">Avatar URL</label>
            <Input value={form.avatar_url} onChange={(e) => setForm({ ...form, avatar_url: e.target.value })} className="h-12" />
          </div>
        </div>
        <div className="mt-6 flex gap-3">
          <Button onClick={saveAuthor} disabled={saving} className="bg-amber-600 hover:bg-amber-700">
            <Save className="h-4 w-4 mr-2" /> {editing ? 'Update' : 'Create'}
          </Button>
          {editing && (
            <Button variant="outline" onClick={resetForm}>Cancel</Button>
          )}
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {authors.map((a) => (
          <Card key={a.id} className="p-6 border-border/20 bg-card/50 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-lg font-semibold">{a.name}</h4>
              <span className="text-sm text-foreground/60">{a.email}</span>
            </div>
            {a.bio && <p className="text-sm text-foreground/70 mb-4">{a.bio}</p>}
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => { setEditing(a); setForm({ name: a.name, email: a.email, bio: a.bio || '', avatar_url: a.avatar_url || '' }) }}>
                <Edit className="h-4 w-4 mr-2" /> Edit
              </Button>
              <Button size="sm" variant="outline" onClick={() => deleteAuthor(a.id)} className="text-red-600 hover:text-red-700">
                <Trash2 className="h-4 w-4 mr-2" /> Delete
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}


