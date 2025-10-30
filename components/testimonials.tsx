'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Card } from '@/components/ui/card'
import Image from 'next/image'

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
}

export function Testimonials() {
  const [items, setItems] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      const { data } = await supabase
        .from('testimonials')
        .select('*')
        .eq('published', true)
        .order('featured', { ascending: false })
        .order('created_at', { ascending: false })
      setItems(data || [])
      setLoading(false)
    }
    load()
  }, [])

  if (loading) return null
  if (!items.length) return null

  return (
    <section id="testimonials" className="py-24 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <p className="text-sm tracking-widest text-amber-600 mb-4 font-medium">TESTIMONIALS</p>
          <h2 className="text-4xl md:text-6xl font-serif font-bold text-foreground">What clients say</h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((t) => (
            <Card key={t.id} className="p-8 bg-card/50 backdrop-blur-sm border-border/50">
              <div className="flex items-center gap-4 mb-4">
                {t.client_avatar_url ? (
                  <div className="w-12 h-12 rounded-full overflow-hidden">
                    <Image src={t.client_avatar_url} alt={t.client_name} width={48} height={48} />
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 font-semibold">
                    {t.client_name.split(' ').map(n => n[0]).join('').slice(0,2)}
                  </div>
                )}
                <div>
                  <div className="font-semibold">{t.client_name}</div>
                  {(t.client_title || t.client_company) && (
                    <div className="text-sm text-foreground/60">{t.client_title}{t.client_title && t.client_company ? ' · ' : ''}{t.client_company}</div>
                  )}
                </div>
              </div>
              <p className="text-foreground/80 leading-relaxed">“{t.content}”</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}


