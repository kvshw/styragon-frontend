'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface Lead {
  id: string
  name: string
  email: string
  phone?: string | null
  company?: string | null
  website?: string | null
  project_type?: string | null
  budget_range?: string | null
  timeline?: string | null
  goals?: string | null
  details?: string | null
  file_url?: string | null
  created_at: string
}

export default function AdminLeads() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchLeads = async () => {
      setLoading(true)
      const { data } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false })
      setLeads(data || [])
      setLoading(false)
    }
    fetchLeads()
  }, [])

  if (loading) return <div className="text-foreground/60">Loading leads…</div>

  if (!leads.length) return <div className="text-foreground/60">No leads yet.</div>

  return (
    <div className="space-y-4">
      {leads.map((lead) => (
        <Card key={lead.id} className="p-6 border-border/20 bg-card/50 backdrop-blur-sm">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h4 className="text-lg font-semibold text-foreground">
                {lead.name} <span className="text-foreground/50 font-normal">• {new Date(lead.created_at).toLocaleString()}</span>
              </h4>
              <div className="text-sm text-foreground/70">
                <a className="hover:text-amber-600" href={`mailto:${lead.email}`}>{lead.email}</a>
                {lead.phone ? <> • {lead.phone}</> : null}
                {lead.company ? <> • {lead.company}</> : null}
                {lead.website ? <> • <a className="hover:text-amber-600" href={lead.website} target="_blank" rel="noreferrer">website</a></> : null}
              </div>
              <div className="text-sm text-foreground/70 mt-2">
                {lead.project_type && <span className="mr-3">Type: {lead.project_type}</span>}
                {lead.budget_range && <span className="mr-3">Budget: {lead.budget_range}</span>}
                {lead.timeline && <span>Timeline: {lead.timeline}</span>}
              </div>
              {lead.goals && <p className="mt-3 text-foreground/80">Goals: {lead.goals}</p>}
              {lead.details && <p className="mt-2 text-foreground/70 whitespace-pre-wrap">{lead.details}</p>}
            </div>
            <div className="flex items-center gap-3">
              {lead.file_url && (
                <Button asChild variant="outline" className="h-10">
                  <a href={lead.file_url} target="_blank" rel="noreferrer">View attachment</a>
                </Button>
              )}
              <Button asChild variant="outline" className="h-10">
                <a href={`mailto:${lead.email}?subject=Thanks%20for%20contacting%20Styragon`}>Reply</a>
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}


