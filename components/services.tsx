"use client"

import { Card } from "@/components/ui/card"
import { Code2, Layers, Sparkles, Zap } from "lucide-react"
import { apiClient, Service } from "@/lib/supabase-api"
import { useEffect, useState } from "react"

// Icon mapping for dynamic icons
const iconMap = {
  Sparkles,
  Layers,
  Code2,
  Zap,
} as const

type IconName = keyof typeof iconMap

export function Services() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await apiClient.getServices()
        setServices(data)
      } catch (error) {
        console.error('Failed to fetch services:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchServices()
  }, [])

  if (loading) {
    return (
      <section id="services" className="py-32 px-6 bg-card/30 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <p className="text-sm tracking-widest text-amber-600 mb-4 font-medium">OUR EXPERTISE</p>
            <h2 className="text-5xl md:text-7xl font-serif font-bold text-foreground text-balance">
              Services That Elevate
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="p-12 bg-card/50 backdrop-blur-sm border-border animate-pulse">
                <div className="flex items-start gap-6">
                  <div className="w-16 h-16 bg-muted-foreground/20 rounded"></div>
                  <div className="flex-1 space-y-4">
                    <div className="h-6 bg-muted-foreground/20 rounded w-3/4"></div>
                    <div className="h-4 bg-muted-foreground/20 rounded w-full"></div>
                    <div className="h-4 bg-muted-foreground/20 rounded w-2/3"></div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="services" className="py-16 sm:py-24 lg:py-32 px-4 sm:px-6 bg-card/30 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-secondary/5 to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 via-transparent to-amber-500/5 pointer-events-none animate-pulse" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-12 sm:mb-16 lg:mb-20 animate-fade-in-up">
          <p className="text-sm sm:text-base tracking-widest text-amber-600 mb-4 font-medium animate-fade-in-up delay-300">OUR EXPERTISE</p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-serif font-bold text-foreground text-balance animate-fade-in-up delay-500">
            Services That Elevate
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {services.map((service, index) => {
            const IconComponent = service.icon ? iconMap[service.icon as IconName] : Sparkles
            return (
              <Card
                key={service.id}
                className={`p-6 sm:p-8 lg:p-12 bg-card/50 backdrop-blur-sm border-border hover:border-amber-500/50 transition-all duration-700 group hover:shadow-2xl hover:shadow-amber-500/20 hover:scale-105 animate-fade-in-up delay-${(index + 1) * 200} hover:animate-glow`}
              >
                <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
                  <div className="text-5xl sm:text-6xl lg:text-7xl font-serif font-bold bg-gradient-to-br from-muted-foreground/20 to-amber-600/40 bg-clip-text text-transparent group-hover:from-amber-600/60 group-hover:to-amber-500/50 transition-all duration-700 group-hover:scale-110">
                    {String(service.order_index).padStart(2, '0')}
                  </div>
                  <div className="flex-1 space-y-3 sm:space-y-4">
                    <div className="flex items-center gap-3">
                      <IconComponent className="h-6 w-6 sm:h-7 sm:w-7 text-amber-600 group-hover:text-amber-500 group-hover:scale-110 transition-all duration-500" />
                      <h3 className="text-xl sm:text-2xl font-serif font-semibold tracking-wide text-foreground group-hover:text-amber-600 transition-colors duration-500">{service.title}</h3>
                    </div>
                    <p className="text-foreground/70 leading-relaxed text-base sm:text-lg group-hover:text-foreground/90 transition-colors duration-500">{service.description}</p>
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 animate-shimmer" />
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
