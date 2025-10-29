"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { apiClient, BlogPost, Category } from "@/lib/supabase-api"
import { useEffect, useState } from "react"

// Helper function to get the correct image URL
const getImageUrl = (post: BlogPost): string | null => {
  if (post.featured_image_url) {
    // If it's a relative path, prepend the API base URL
    if (post.featured_image_url.startsWith('/')) {
      return `http://localhost:8000${post.featured_image_url}`
    }
    // If it's already a full URL, return as is
    return post.featured_image_url
  }
  return null
}

export function Blog() {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState("All")

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [blogData, categoriesData] = await Promise.all([
          apiClient.getBlogPosts({ published: true }),
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
  }, [])

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


  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <section id="blog" className="py-16 sm:py-24 lg:py-32 px-4 sm:px-6 bg-gradient-to-br from-background via-card/20 to-background relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-12 sm:mb-16">
            <p className="text-sm sm:text-base tracking-widest text-amber-600 mb-4 font-medium">INSIGHTS & THOUGHTS</p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-serif font-bold text-foreground text-balance mb-4 sm:mb-6">
              Our Latest
              <span className="block text-amber-600">Insights</span>
            </h2>
            <p className="text-lg sm:text-xl lg:text-2xl text-foreground/70 max-w-4xl mx-auto leading-relaxed">
              Discover the latest trends, strategies, and insights from our team of experts in luxury digital experiences.
            </p>
          </div>
          
          {/* Category Filter Skeleton */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-10 w-20 bg-muted-foreground/20 rounded-full animate-pulse"></div>
            ))}
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="overflow-hidden border-border/50 animate-pulse">
                <div className="h-48 bg-muted-foreground/20"></div>
                <div className="p-6 space-y-4">
                  <div className="h-4 bg-muted-foreground/20 rounded w-3/4"></div>
                  <div className="h-6 bg-muted-foreground/20 rounded w-full"></div>
                  <div className="h-4 bg-muted-foreground/20 rounded w-2/3"></div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="blog" className="py-16 sm:py-24 lg:py-32 px-4 sm:px-6 bg-gradient-to-br from-background via-card/20 to-background relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-500/10 to-transparent animate-pulse" />
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,rgba(245,158,11,0.1),transparent_50%)]" />
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_80%,rgba(245,158,11,0.1),transparent_50%)]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16 animate-fade-in-up">
          <p className="text-sm sm:text-base tracking-widest text-amber-600 mb-4 font-medium animate-fade-in-up delay-300">INSIGHTS & THOUGHTS</p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-serif font-bold text-foreground text-balance mb-4 sm:mb-6 animate-fade-in-up delay-500">
            Our Latest
            <span className="block text-amber-600 hover:text-amber-500 transition-colors duration-500">Insights</span>
          </h2>
          <p className="text-lg sm:text-xl lg:text-2xl text-foreground/70 max-w-4xl mx-auto leading-relaxed animate-fade-in-up delay-700">
            Discover the latest trends, strategies, and insights from our team of experts in luxury digital experiences.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-8 sm:mb-12 animate-fade-in-up delay-1000">
          <Button
            key="All"
            variant={selectedCategory === "All" ? "default" : "outline"}
            onClick={() => setSelectedCategory("All")}
            className={`px-4 sm:px-6 py-2 sm:py-3 rounded-full transition-all duration-300 hover:scale-105 text-sm sm:text-base ${
              selectedCategory === "All" 
                ? "bg-amber-600 text-amber-50 hover:bg-amber-700 shadow-lg shadow-amber-600/25" 
                : "border-amber-300/30 text-foreground hover:border-amber-500 hover:text-amber-600 hover:bg-amber-50/10"
            }`}
            style={{ animationDelay: `0s` }}
          >
            All
          </Button>
          {categories.map((category, index) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.name ? "default" : "outline"}
              onClick={() => setSelectedCategory(category.name)}
              className={`px-4 sm:px-6 py-2 sm:py-3 rounded-full transition-all duration-300 hover:scale-105 text-sm sm:text-base ${
                selectedCategory === category.name 
                  ? "bg-amber-600 text-amber-50 hover:bg-amber-700 shadow-lg shadow-amber-600/25" 
                  : "border-amber-300/30 text-foreground hover:border-amber-500 hover:text-amber-600 hover:bg-amber-50/10"
              }`}
              style={{ animationDelay: `${(index + 1) * 0.1}s` }}
            >
              {category.name}
            </Button>
          ))}
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
                      <span className="px-3 py-1 bg-amber-600 text-amber-50 text-xs font-medium rounded-full">
                        Featured
                      </span>
                    </div>
                  </div>
                  <div className="p-6 sm:p-8 lg:p-12 flex flex-col justify-center">
                    <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-4 text-sm sm:text-base text-muted-foreground">
                      {post.category && (
                        <span className="px-2 py-1 bg-amber-100/20 text-amber-600 rounded text-xs sm:text-sm font-medium">
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
                    <h3 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-foreground mb-4 group-hover:text-amber-600 transition-colors duration-500">
                      {post.title}
                    </h3>
                    <p className="text-foreground/70 leading-relaxed mb-6 text-base sm:text-lg">
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
          {displayRegular.map((post, index) => (
            <Card 
              key={post.id} 
              className="overflow-hidden border-border/50 hover:border-amber-500/50 transition-all duration-700 group hover:shadow-2xl hover:shadow-amber-500/10 hover:scale-105 animate-fade-in-up"
              style={{ animationDelay: `${(index + 1) * 0.2}s` }}
            >
              <Link href={`/blog/${post.slug}`} className="block">
              <div className="relative h-48 sm:h-56 overflow-hidden">
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
                    <span className="px-2 py-1 bg-amber-100/20 text-amber-600 rounded text-xs sm:text-sm font-medium">
                      {post.category.name}
                    </span>
                  </div>
                )}
              </div>
              <div className="p-4 sm:p-6">
                <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-3 text-xs sm:text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                    {post.published_at ? formatDate(post.published_at) : formatDate(post.created_at)}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                    {post.read_time} min read
                  </div>
                </div>
                <h3 className="text-lg sm:text-xl font-serif font-bold text-foreground mb-3 group-hover:text-amber-600 transition-colors duration-500 line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-foreground/70 leading-relaxed mb-4 text-sm sm:text-base line-clamp-3">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between">
                  {post.author && (
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-amber-200 to-amber-300 flex items-center justify-center">
                        <span className="text-amber-800 font-semibold text-xs">
                          {post.author.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <span className="text-foreground/70 text-sm">{post.author.name}</span>
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
            <Link href="/blog-section">
              View All Articles
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
