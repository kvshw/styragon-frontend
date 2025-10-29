"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Calendar, Clock, ArrowRight, Search, User } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { apiClient, BlogPost, Category } from "@/lib/api"

// Helper function to get the correct image URL
const getImageUrl = (post: BlogPost): string | null => {
  if (post.featured_image) {
    if (post.featured_image.startsWith('/')) {
      return `http://localhost:8000${post.featured_image}`
    }
    return post.featured_image
  }
  return post.featured_image_url || null
}

// Helper function to format date
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

export default function BlogSectionPage() {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [blogData, categoriesData] = await Promise.all([
          apiClient.getBlogPosts({ 
            published: true,
            search: searchTerm || undefined,
            category: selectedCategory !== "All" ? selectedCategory : undefined,
            ordering: '-published_at'
          }),
          apiClient.getCategories()
        ])
        
        setBlogPosts(blogData.results)
        setCategories(categoriesData)
      } catch (error) {
        console.error('Failed to fetch data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [searchTerm, selectedCategory])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
  }

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
  }

  const featuredPosts = blogPosts.filter(post => post.featured)
  const regularPosts = blogPosts.filter(post => !post.featured)
  const allPosts = [...featuredPosts, ...regularPosts]
  
  // When "All" is selected, show featured posts + up to 5 regular posts (max 6 total)
  // When a category is selected, show all posts in that category
  const getDisplayPosts = () => {
    if (selectedCategory === "All") {
      const remainingSlots = 6 - featuredPosts.length
      return {
        featured: featuredPosts,
        regular: regularPosts.slice(0, Math.max(0, remainingSlots))
      }
    } else {
      const categoryPosts = allPosts.filter(post => post.category?.name === selectedCategory)
      return {
        featured: [],
        regular: categoryPosts
      }
    }
  }

  const { featured: displayFeatured, regular: displayRegular } = getDisplayPosts()

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto px-6 py-16">
          <div className="max-w-7xl mx-auto">
            {/* Header Skeleton */}
            <div className="text-center mb-16 animate-pulse">
              <div className="h-8 bg-muted-foreground/20 rounded w-1/4 mx-auto mb-4"></div>
              <div className="h-12 bg-muted-foreground/20 rounded w-3/4 mx-auto mb-6"></div>
              <div className="h-6 bg-muted-foreground/20 rounded w-1/2 mx-auto"></div>
            </div>

            {/* Search Skeleton */}
            <div className="max-w-2xl mx-auto mb-12 animate-pulse">
              <div className="h-12 bg-muted-foreground/20 rounded-lg"></div>
            </div>

            {/* Grid Skeleton */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="overflow-hidden bg-card/50 backdrop-blur-sm border-border animate-pulse">
                  <div className="aspect-video bg-muted-foreground/20"></div>
                  <div className="p-6 space-y-4">
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
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Header */}
      <div className="border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-amber-600 hover:text-amber-700 font-medium">
              ← Back to Home
            </Link>
            <div className="text-sm text-muted-foreground">
              {blogPosts.length} {blogPosts.length === 1 ? 'Article' : 'Articles'}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-16">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-16 animate-fade-in-up">
            <p className="text-sm tracking-widest text-amber-600 mb-4 font-medium animate-fade-in-up delay-300">BLOG</p>
            <h1 className="text-5xl md:text-7xl font-serif font-bold text-foreground text-balance mb-6 animate-fade-in-up delay-500">
              Latest Articles
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed animate-fade-in-up delay-700">
              Discover insights, tutorials, and stories from our team of experts.
            </p>
          </div>

          {/* Search and Filters */}
          <div className="max-w-4xl mx-auto mb-12">
            <form onSubmit={handleSearch} className="relative mb-6">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 pr-4 py-3 text-lg border-border/50 focus:border-amber-500/50 focus:ring-amber-500/20"
              />
            </form>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 justify-center">
              <Button
                variant={selectedCategory === "All" ? "default" : "outline"}
                size="sm"
                onClick={() => handleCategoryChange("All")}
                className={selectedCategory === "All" ? "bg-amber-600 text-amber-50" : ""}
              >
                All
              </Button>
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.name ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleCategoryChange(category.name)}
                  className={selectedCategory === category.name ? "bg-amber-600 text-amber-50" : ""}
                >
                  {category.name}
                </Button>
              ))}
            </div>
          </div>

          {/* Featured Post - Only show when All is selected */}
          {selectedCategory === "All" && displayFeatured.length > 0 && (
            <div className="mb-16 animate-fade-in-up delay-1200">
              {displayFeatured.map((post) => (
                <Card key={post.id} className="overflow-hidden border-border/50 hover:border-amber-500/50 transition-all duration-700 group hover:shadow-2xl hover:shadow-amber-500/10">
                  <Link href={`/blog/${post.slug}`} className="block">
                    <div className="grid lg:grid-cols-2 gap-0">
                      <div className="relative h-64 lg:h-auto overflow-hidden">
                        {getImageUrl(post) ? (
                          <Image
                            src={getImageUrl(post)!}
                            alt={post.title}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-700"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center">
                            <span className="text-amber-600 text-4xl font-bold">STYRAGON</span>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
                        <div className="absolute top-4 left-4">
                          <Badge className="bg-amber-600 text-amber-50">
                            Featured
                          </Badge>
                        </div>
                      </div>
                      <div className="p-8 lg:p-12 flex flex-col justify-center">
                        <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
                          {post.category && (
                            <span className="px-2 py-1 bg-amber-100/20 text-amber-600 rounded text-xs font-medium">
                              {post.category.name}
                            </span>
                          )}
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            {post.published_at ? formatDate(post.published_at) : formatDate(post.created_at)}
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            {post.read_time} min read
                          </div>
                        </div>
                        <h3 className="text-3xl lg:text-4xl font-serif font-bold text-foreground mb-4 group-hover:text-amber-600 transition-colors duration-500">
                          {post.title}
                        </h3>
                        <p className="text-foreground/70 leading-relaxed mb-6 text-lg">
                          {post.excerpt}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            {post.author && (
                              <>
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-200 to-amber-300 flex items-center justify-center">
                                  <span className="text-amber-800 font-semibold text-sm">
                                    {post.author.name.split(' ').map(n => n[0]).join('')}
                                  </span>
                                </div>
                                <span className="text-foreground/70 font-medium">{post.author.name}</span>
                              </>
                            )}
                          </div>
                          <div className="text-amber-600 hover:text-amber-700 group/btn flex items-center gap-2">
                            Read More
                            <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform duration-300" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </Card>
              ))}
            </div>
          )}

          {/* Blog Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayRegular.map((post, index) => (
              <Card 
                key={post.id} 
                className="overflow-hidden border-border/50 hover:border-amber-500/50 transition-all duration-700 group hover:shadow-2xl hover:shadow-amber-500/10 hover:scale-105 animate-fade-in-up"
                style={{ animationDelay: `${(index + 1) * 0.2}s` }}
              >
                <Link href={`/blog/${post.slug}`} className="block">
                  <div className="relative h-48 overflow-hidden">
                    {getImageUrl(post) ? (
                      <Image
                        src={getImageUrl(post)!}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center">
                        <span className="text-amber-600 text-2xl font-bold">STYRAGON</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
                    {post.category && (
                      <div className="absolute top-4 left-4">
                        <span className="px-2 py-1 bg-amber-100/20 text-amber-600 rounded text-xs font-medium">
                          {post.category.name}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-4 mb-3 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>{post.published_at ? formatDate(post.published_at) : formatDate(post.created_at)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{post.read_time} min read</span>
                      </div>
                    </div>
                    <h3 className="text-xl font-serif font-semibold text-foreground mb-3 group-hover:text-amber-600 transition-colors duration-500 line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-foreground/70 leading-relaxed text-sm group-hover:text-foreground/90 transition-colors duration-500 line-clamp-3 mb-4">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between">
                      {post.author && (
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-200 to-amber-300 flex items-center justify-center">
                            <span className="text-amber-800 font-semibold text-xs">
                              {post.author.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <span className="text-foreground/70 font-medium text-sm">{post.author.name}</span>
                        </div>
                      )}
                      <div className="text-amber-600 hover:text-amber-700 group/btn flex items-center gap-1">
                        <ArrowRight className="h-3 w-3 group-hover/btn:translate-x-1 transition-transform duration-300" />
                      </div>
                    </div>
                  </div>
                </Link>
              </Card>
            ))}
          </div>

          {displayRegular.length === 0 && (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg">No blog posts found for the selected category.</p>
            </div>
          )}

          {/* CTA Section */}
          <div className="text-center mt-16 animate-fade-in-up delay-1000">
            <Button 
              size="lg" 
              className="bg-amber-600 text-amber-50 hover:bg-amber-700 px-8 py-6 text-base font-serif font-semibold shadow-lg shadow-amber-600/25 hover:shadow-amber-600/40 hover:scale-105 transition-all duration-300 group"
              asChild
            >
              <Link href="/blog">
                View All Articles
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
