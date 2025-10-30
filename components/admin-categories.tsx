'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Save, Plus, Trash2, Edit } from 'lucide-react'

interface Category {
  id: number
  name: string
  slug: string
  description?: string | null
  color?: string | null
  created_at?: string
  updated_at?: string
}

interface CategoryForm {
  name: string
  slug: string
  description: string
  color: string
}

export default function AdminCategoriesManager() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Category | null>(null)
  const [form, setForm] = useState<CategoryForm>({ name: '', slug: '', description: '', color: '#f59e0b' })
  const [saving, setSaving] = useState(false)

  const generateSlug = (title: string) => title.toLowerCase().replace(/[^a-z0-9 -]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim()

  const fetchCategories = async () => {
    setLoading(true)
    const { data } = await supabase.from('categories').select('*').order('name', { ascending: true })
    setCategories(data || [])
    setLoading(false)
  }

  useEffect(() => { fetchCategories() }, [])

  const resetForm = () => {
    setForm({ name: '', slug: '', description: '', color: '#f59e0b' })
    setEditing(null)
  }

  const saveCategory = async () => {
    setSaving(true)
    try {
      const payload = { name: form.name, slug: form.slug, description: form.description || null, color: form.color }
      if (editing) {
        const { error } = await supabase.from('categories').update(payload).eq('id', editing.id)
        if (error) throw error
      } else {
        const { error } = await supabase.from('categories').insert(payload)
        if (error) throw error
      }
      resetForm()
      fetchCategories()
    } finally {
      setSaving(false)
    }
  }

  const deleteCategory = async (id: number) => {
    if (!confirm('Delete this category?')) return
    await supabase.from('categories').delete().eq('id', id)
    fetchCategories()
  }

  if (loading) {
    return (
      <div className="text-center py-12 text-foreground/70">Loading categories...</div>
    )
  }

  return (
    <div className="space-y-8">
      <Card className="p-6 border-border/20 bg-card/50 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-serif font-semibold">{editing ? 'Edit Category' : 'Add Category'}</h3>
          {!editing && (
            <Button onClick={resetForm} variant="outline" className="h-10">Clear</Button>
          )}
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm mb-2">Name</label>
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value, slug: generateSlug(e.target.value) })} className="h-12" />
          </div>
          <div>
            <label className="block text-sm mb-2">Slug</label>
            <Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className="h-12" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm mb-2">Description</label>
            <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} />
          </div>
          <div>
            <label className="block text-sm mb-2">Color</label>
            <Input type="color" value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} className="h-12 p-1" />
          </div>
        </div>
        <div className="mt-6 flex gap-3">
          <Button onClick={saveCategory} disabled={saving} className="bg-amber-600 hover:bg-amber-700">
            <Save className="h-4 w-4 mr-2" /> {editing ? 'Update' : 'Create'}
          </Button>
          {editing && (
            <Button variant="outline" onClick={resetForm}>Cancel</Button>
          )}
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((c) => (
          <Card key={c.id} className="p-6 border-border/20 bg-card/50 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="inline-block w-4 h-4 rounded" style={{ backgroundColor: c.color || '#f59e0b' }} />
                <h4 className="text-lg font-semibold">{c.name}</h4>
              </div>
              <span className="text-sm text-foreground/50">{c.slug}</span>
            </div>
            {c.description && <p className="text-sm text-foreground/70 mb-4">{c.description}</p>}
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => { setEditing(c); setForm({ name: c.name, slug: c.slug, description: c.description || '', color: c.color || '#f59e0b' }) }}>
                <Edit className="h-4 w-4 mr-2" /> Edit
              </Button>
              <Button size="sm" variant="outline" onClick={() => deleteCategory(c.id)} className="text-red-600 hover:text-red-700">
                <Trash2 className="h-4 w-4 mr-2" /> Delete
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}


