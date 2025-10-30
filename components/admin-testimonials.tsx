'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Save, Plus, Trash2, Edit, Star, StarOff, Eye, EyeOff } from 'lucide-react'

interface Testimonial {
  id: number
  client_name: string
  client_title?: string | null
  client_company?: string | null
  client_avatar_url?: string | null
  content: string
  rating: number
  featured: boolean
  published: boolean
  created_at?: string
}

interface TestimonialForm {
  client_name: string
  client_title: string
  client_company: string
  client_avatar_url: string
  content: string
  rating: number
  featured: boolean
  published: boolean
}

export default function AdminTestimonialsManager() {
  const [items, setItems] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Testimonial | null>(null)
  const [form, setForm] = useState<TestimonialForm>({
    client_name: '',
    client_title: '',
    client_company: '',
    client_avatar_url: '',
    content: '',
    rating: 5,
    featured: false,
    published: true,
  })
  const [saving, setSaving] = useState(false)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)

  const fetchItems = async () => {
    setLoading(true)
    const { data } = await supabase.from('testimonials').select('*').order('created_at', { ascending: false })
    setItems(data || [])
    setLoading(false)
  }

  useEffect(() => { fetchItems() }, [])

  const resetForm = () => {
    setForm({ client_name: '', client_title: '', client_company: '', client_avatar_url: '', content: '', rating: 5, featured: false, published: true })
    setEditing(null)
    setAvatarFile(null)
  }

  const uploadAvatar = async (file: File): Promise<string | null> => {
    try {
      const ext = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
      const path = `testimonial-avatars/${fileName}`
      const { error } = await supabase.storage.from('images').upload(path, file)
      if (error) throw error
      const { data } = supabase.storage.from('images').getPublicUrl(path)
      return data.publicUrl
    } catch (e) {
      console.warn('Avatar upload failed:', e)
      return null
    }
  }

  const saveItem = async () => {
    setSaving(true)
    try {
      let avatarUrl = form.client_avatar_url || ''
      if (avatarFile) {
        const uploaded = await uploadAvatar(avatarFile)
        if (uploaded) avatarUrl = uploaded
      }
      const payload = {
        client_name: form.client_name,
        client_title: form.client_title || null,
        client_company: form.client_company || null,
        client_avatar_url: avatarUrl || null,
        content: form.content,
        rating: form.rating,
        featured: form.featured,
        published: form.published,
      }
      if (editing) {
        const { error } = await supabase.from('testimonials').update(payload).eq('id', editing.id)
        if (error) throw error
      } else {
        const { error } = await supabase.from('testimonials').insert(payload)
        if (error) throw error
      }
      resetForm()
      fetchItems()
    } finally {
      setSaving(false)
    }
  }

  const deleteItem = async (id: number) => {
    if (!confirm('Delete this testimonial?')) return
    await supabase.from('testimonials').delete().eq('id', id)
    fetchItems()
  }

  const toggleFlag = async (id: number, field: 'featured' | 'published', value: boolean) => {
    await supabase.from('testimonials').update({ [field]: !value }).eq('id', id)
    fetchItems()
  }

  if (loading) return <div className="text-center py-12 text-foreground/70">Loading testimonials...</div>

  return (
    <div className="space-y-8">
      <Card className="p-6 border-border/20 bg-card/50 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-serif font-semibold">{editing ? 'Edit Testimonial' : 'Add Testimonial'}</h3>
          {!editing && (
            <Button onClick={resetForm} variant="outline" className="h-10">Clear</Button>
          )}
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm mb-2">Client name</label>
            <Input value={form.client_name} onChange={(e) => setForm({ ...form, client_name: e.target.value })} className="h-12" />
          </div>
          <div>
            <label className="block text-sm mb-2">Client title</label>
            <Input value={form.client_title} onChange={(e) => setForm({ ...form, client_title: e.target.value })} className="h-12" />
          </div>
          <div>
            <label className="block text-sm mb-2">Client company</label>
            <Input value={form.client_company} onChange={(e) => setForm({ ...form, client_company: e.target.value })} className="h-12" />
          </div>
          <div>
            <label className="block text-sm mb-2">Avatar URL</label>
            <Input value={form.client_avatar_url} onChange={(e) => setForm({ ...form, client_avatar_url: e.target.value })} className="h-12" />
          </div>
          <div>
            <label className="block text-sm mb-2">Upload Avatar</label>
            <Input type="file" accept="image/*" onChange={(e) => setAvatarFile(e.target.files?.[0] || null)} className="h-12" />
            <p className="text-xs text-foreground/50 mt-1">PNG/JPG, will be stored in Supabase Storage</p>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm mb-2">Content</label>
            <Textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} rows={4} />
          </div>
          <div>
            <label className="block text-sm mb-2">Rating (1-5)</label>
            <Input type="number" min={1} max={5} value={form.rating} onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })} className="h-12" />
          </div>
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} />
              <span>Published</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} />
              <span>Featured</span>
            </label>
          </div>
        </div>
        <div className="mt-6 flex gap-3">
          <Button onClick={saveItem} disabled={saving} className="bg-amber-600 hover:bg-amber-700">
            <Save className="h-4 w-4 mr-2" /> {editing ? 'Update' : 'Create'}
          </Button>
          {editing && (
            <Button variant="outline" onClick={resetForm}>Cancel</Button>
          )}
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((t) => (
          <Card key={t.id} className="p-6 border-border/20 bg-card/50 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-lg font-semibold">{t.client_name}</h4>
              <div className="flex gap-2">
                <Badge className="bg-amber-600/20 text-amber-600">{t.rating}★</Badge>
                {t.featured && <Badge className="bg-amber-600 text-white">Featured</Badge>}
                {t.published ? <Badge className="bg-green-600 text-white">Published</Badge> : <Badge className="bg-foreground/60 text-white">Draft</Badge>}
              </div>
            </div>
            {t.client_company && <p className="text-sm text-foreground/60 mb-2">{t.client_title} · {t.client_company}</p>}
            <p className="text-foreground/80 mb-4">{t.content}</p>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => { setEditing(t); setForm({ client_name: t.client_name, client_title: t.client_title || '', client_company: t.client_company || '', client_avatar_url: t.client_avatar_url || '', content: t.content, rating: t.rating, featured: t.featured, published: t.published }) }}>
                <Edit className="h-4 w-4 mr-2" /> Edit
              </Button>
              <Button size="sm" variant="outline" onClick={() => toggleFlag(t.id, 'published', t.published)}>
                {t.published ? <Eye className="h-4 w-4 mr-2" /> : <EyeOff className="h-4 w-4 mr-2" />} {t.published ? 'Unpublish' : 'Publish'}
              </Button>
              <Button size="sm" variant="outline" onClick={() => toggleFlag(t.id, 'featured', t.featured)}>
                {t.featured ? <Star className="h-4 w-4 mr-2" /> : <StarOff className="h-4 w-4 mr-2" />} {t.featured ? 'Unfeature' : 'Feature'}
              </Button>
              <Button size="sm" variant="outline" onClick={() => deleteItem(t.id)} className="text-red-600 hover:text-red-700">
                <Trash2 className="h-4 w-4 mr-2" /> Delete
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}


