"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Script from "next/script"

export default function StartProjectPage() {
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    website: "",
    project_type: "Website",
    budget_range: "",
    timeline: "",
    goals: "",
    details: "",
  })

  const onChange = (k: keyof typeof form, v: string) => setForm((p) => ({ ...p, [k]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      let fileUrl: string | null = null
      if (file) {
        const ext = file.name.split(".").pop()
        const key = `lead-${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
        const { error: upErr } = await supabase.storage.from("leads").upload(key, file)
        if (upErr) throw upErr
        const { data } = supabase.storage.from("leads").getPublicUrl(key)
        fileUrl = data.publicUrl
      }

      const { error } = await supabase.from("leads").insert({ ...form, file_url: fileUrl })
      if (error) throw error
      setSuccess(true)
    } catch (err) {
      alert("Failed to submit form. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  if (success) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto px-6 py-16 max-w-4xl">
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-foreground mb-4">Thank you</h1>
          <p className="text-lg text-foreground/70 mb-8">We received your project details. Book a discovery call below or we’ll reach out within 1 business day.</p>
          <div className="w-full rounded-xl overflow-hidden border border-border/40 bg-card p-2">
            <div className="calendly-inline-widget" data-url="https://calendly.com/styragon-free/styragon-discovery-call" style={{ minWidth: 320, height: 700 }} />
            <Script src="https://assets.calendly.com/assets/external/widget.js" strategy="lazyOnload" />
          </div>
          <div className="mt-6 text-center">
            <a href="/" className="inline-flex items-center justify-center h-12 px-6 rounded-md bg-amber-600 text-amber-50 hover:bg-amber-700 transition-colors">
              Return to website
            </a>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-6 py-16 max-w-4xl">
        <div className="text-center mb-12">
          <p className="text-sm tracking-widest text-amber-600 mb-3 font-medium">START PROJECT</p>
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-foreground">Tell us about your project</h1>
          <p className="text-lg text-foreground/70 mt-4">2 minutes to complete. We’ll reply within 1 business day.</p>
        </div>

        <Card className="p-8 bg-card/50 backdrop-blur-sm border-border/40">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm mb-2">Name *</label>
              <Input value={form.name} onChange={(e) => onChange("name", e.target.value)} required />
            </div>
            <div>
              <label className="block text-sm mb-2">Email *</label>
              <Input type="email" value={form.email} onChange={(e) => onChange("email", e.target.value)} required />
            </div>
            <div>
              <label className="block text-sm mb-2">Phone</label>
              <Input value={form.phone} onChange={(e) => onChange("phone", e.target.value)} />
            </div>
            <div>
              <label className="block text-sm mb-2">Company</label>
              <Input value={form.company} onChange={(e) => onChange("company", e.target.value)} />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm mb-2">Website</label>
              <Input value={form.website} onChange={(e) => onChange("website", e.target.value)} />
            </div>
            <div>
              <label className="block text-sm mb-2">Project type</label>
              <select value={form.project_type} onChange={(e) => onChange("project_type", e.target.value)} className="w-full h-10 rounded-md bg-background border border-border/40 px-3">
                <option>Website</option>
                <option>SaaS</option>
                <option>Ecommerce</option>
                <option>Branding</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm mb-2">Budget range</label>
              <select value={form.budget_range} onChange={(e) => onChange("budget_range", e.target.value)} className="w-full h-10 rounded-md bg-background border border-border/40 px-3">
                <option value="">Select…</option>
                <option>0–$1k</option>
                <option>$1k–$3k</option>
                <option>$3k–$10k</option>
                <option>$10k–$25k</option>
                <option>$25k–$50k</option>
                <option>$50k+</option>
              </select>
            </div>
            <div>
              <label className="block text-sm mb-2">Timeline</label>
              <select value={form.timeline} onChange={(e) => onChange("timeline", e.target.value)} className="w-full h-10 rounded-md bg-background border border-border/40 px-3">
                <option value="">Select…</option>
                <option>ASAP</option>
                <option>1–2 months</option>
                <option>3–4 months</option>
                <option>Flexible</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm mb-2">Goals / success criteria</label>
              <Input value={form.goals} onChange={(e) => onChange("goals", e.target.value)} />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm mb-2">Details</label>
              <Textarea rows={5} value={form.details} onChange={(e) => onChange("details", e.target.value)} />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm mb-2">Attach brief (optional)</label>
              <Input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
            </div>
            <div className="md:col-span-2 flex justify-end">
              <Button type="submit" disabled={submitting} className="bg-amber-600 hover:bg-amber-700">
                {submitting ? "Submitting…" : "Submit"}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </main>
  )
}


