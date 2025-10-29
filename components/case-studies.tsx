"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink, Github, Calendar, User } from "lucide-react"
import { apiClient, Project } from "@/lib/supabase-api"
import { useEffect, useState } from "react"
import Image from "next/image"

// Helper function to get the correct image URL
const getImageUrl = (project: Project): string | null => {
  if (project.featured_image_url) {
    // If it's a relative path, prepend the API base URL
    if (project.featured_image_url.startsWith('/')) {
      return `http://localhost:8000${project.featured_image_url}`
    }
    // If it's already a full URL, return as is
    return project.featured_image_url
  }
  return null
}

export function CaseStudies() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await apiClient.getFeaturedProjects()
        setProjects(data)
      } catch (error) {
        console.error('Failed to fetch projects:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [])

  if (loading) {
    return (
      <section id="work" className="py-16 sm:py-24 lg:py-32 px-4 sm:px-6 bg-muted/20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-12 sm:mb-16 lg:mb-20">
            <p className="text-sm sm:text-base tracking-widest text-amber-600 mb-4 font-medium">OUR WORK</p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-serif font-bold text-foreground text-balance">
              Featured Projects
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="overflow-hidden bg-card/50 backdrop-blur-sm border-border animate-pulse">
                <div className="aspect-video bg-muted-foreground/20"></div>
                <div className="p-4 sm:p-6 space-y-4">
                  <div className="h-6 bg-muted-foreground/20 rounded w-3/4"></div>
                  <div className="h-4 bg-muted-foreground/20 rounded w-full"></div>
                  <div className="h-4 bg-muted-foreground/20 rounded w-2/3"></div>
                  <div className="flex gap-2">
                    <div className="h-6 bg-muted-foreground/20 rounded w-16"></div>
                    <div className="h-6 bg-muted-foreground/20 rounded w-20"></div>
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
    <section id="work" className="py-16 sm:py-24 lg:py-32 px-4 sm:px-6 bg-muted/20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-amber-500/5 to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-500/3 to-transparent pointer-events-none animate-pulse" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-12 sm:mb-16 lg:mb-20 animate-fade-in-up">
          <p className="text-sm sm:text-base tracking-widest text-amber-600 mb-4 font-medium animate-fade-in-up delay-300">OUR WORK</p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-serif font-bold text-foreground text-balance animate-fade-in-up delay-500">
            Featured Projects
          </h2>
          <p className="text-lg sm:text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mt-4 sm:mt-6 animate-fade-in-up delay-700">
            Discover our portfolio of exceptional digital experiences that have transformed businesses and delighted users.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {projects.map((project, index) => (
            <Card
              key={project.id}
              className={`overflow-hidden bg-card/50 backdrop-blur-sm border-border hover:border-amber-500/50 transition-all duration-700 group hover:shadow-2xl hover:shadow-amber-500/20 hover:scale-105 animate-fade-in-up delay-${(index + 1) * 200} hover:animate-glow`}
            >
              {getImageUrl(project) && (
                <div className="aspect-video relative overflow-hidden">
                  <Image
                    src={getImageUrl(project)!}
                    alt={project.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent group-hover:from-background/40 transition-all duration-700" />
                  <div className="absolute top-4 right-4">
                    <Badge 
                      variant="secondary" 
                      className={`${
                        project.status === 'completed' 
                          ? 'bg-green-500/20 text-green-600 border-green-500/30' 
                          : project.status === 'in_progress'
                          ? 'bg-amber-500/20 text-amber-600 border-amber-500/30'
                          : 'bg-blue-500/20 text-blue-600 border-blue-500/30'
                      }`}
                    >
                      {project.status.replace('_', ' ')}
                    </Badge>
                  </div>
                </div>
              )}
              
              <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
                <div className="space-y-2">
                  <h3 className="text-lg sm:text-xl font-serif font-semibold text-foreground group-hover:text-amber-600 transition-colors duration-500">
                    {project.title}
                  </h3>
                  {project.client_name && (
                    <div className="flex items-center gap-2 text-sm sm:text-base text-muted-foreground">
                      <User className="h-4 w-4" />
                      <span>{project.client_name}</span>
                    </div>
                  )}
                </div>
                
                <p className="text-foreground/70 leading-relaxed text-sm sm:text-base group-hover:text-foreground/90 transition-colors duration-500">
                  {project.description}
                </p>
                
                {project.technologies && project.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.slice(0, 3).map((tech) => (
                      <Badge key={tech} variant="outline" className="text-xs sm:text-sm">
                        {tech}
                      </Badge>
                    ))}
                    {project.technologies.length > 3 && (
                      <Badge variant="outline" className="text-xs sm:text-sm">
                        +{project.technologies.length - 3} more
                      </Badge>
                    )}
                  </div>
                )}
                
                <div className="flex items-center justify-between pt-4">
                  <div className="flex gap-2">
                    {project.project_url && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="hover:bg-amber-600 hover:text-amber-50 hover:border-amber-600 transition-all duration-300"
                        asChild
                      >
                        <a href={project.project_url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          View Project
                        </a>
                      </Button>
                    )}
                    {project.github_url && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="hover:bg-amber-600 hover:text-amber-50 hover:border-amber-600 transition-all duration-300"
                        asChild
                      >
                        <a href={project.github_url} target="_blank" rel="noopener noreferrer">
                          <Github className="h-4 w-4 mr-2" />
                          Code
                        </a>
                      </Button>
                    )}
                  </div>
                  
                  {project.start_date && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>{new Date(project.start_date).getFullYear()}</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 animate-shimmer" />
            </Card>
          ))}
        </div>

        {projects.length === 0 && (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg">No featured projects available at the moment.</p>
          </div>
        )}
      </div>
    </section>
  )
}