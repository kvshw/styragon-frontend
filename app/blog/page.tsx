"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Calendar, Clock, ArrowRight, Search, Filter, User } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { apiClient, BlogPost, Category } from "@/lib/supabase-api"

// Helper function to get the correct image URL
const getImageUrl = (post: BlogPost): string | null => {
  if (post.featured_image_url) {
    if (post.featured_image_url.startsWith('/')) {
      return `http://localhost:8000${post.featured_image_url}`
    }
    return post.featured_image_url
  }
  return null
}

// Helper function to format date
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

export default function BlogPage() {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalPosts, setTotalPosts] = useState(0)
  const [showFilters, setShowFilters] = useState(false)

  const postsPerPage = 9

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [blogData, categoriesData] = await Promise.all([
          apiClient.getBlogPosts({ 
            published: true,
            search: searchTerm || undefined,
            category: selectedCategory !== "All" ? selectedCategory : undefined,
            page: currentPage,
            ordering: '-published_at'
          }),
          apiClient.getCategories()
        ])
        
        setBlogPosts(blogData.results)
        setTotalPosts(blogData.count)
        setTotalPages(Math.ceil(blogData.count / postsPerPage))
        setCategories(categoriesData)
      } catch (error) {
        console.error('Failed to fetch data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [searchTerm, selectedCategory, currentPage])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentPage(1) // Reset to first page when searching
  }

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
    setCurrentPage(1) // Reset to first page when changing category
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const renderPagination = () => {
    if (totalPages <= 1) return null

    const pages = []
    const maxVisiblePages = 5
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2))
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1)
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <Button
          key={i}
          variant={i === currentPage ? "default" : "outline"}
          size="sm"
          onClick={() => handlePageChange(i)}
          className={i === currentPage ? "bg-amber-600 text-amber-50" : ""}
        >
          {i}
        </Button>
      )
    }

    return (
      <div className="flex items-center justify-center gap-2 mt-12">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        {pages}
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </div>
    )
  }

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
            <Link href="/#blog" className="text-amber-600 hover:text-amber-700 font-medium">
              ← Back to Home
            </Link>
            <div className="text-sm text-muted-foreground">
              {totalPosts} {totalPosts === 1 ? 'Article' : 'Articles'}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-16">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-16 animate-fade-in-up">
            <p className="text-sm tracking-widest text-amber-600 mb-4 font-medium">BLOG</p>
            <h1 className="text-5xl md:text-7xl font-serif font-bold text-foreground text-balance mb-6">
              All Articles
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
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

          {/* Results Count */}
          <div className="text-center mb-8">
            <p className="text-muted-foreground">
              Showing {blogPosts.length} of {totalPosts} articles
              {selectedCategory !== "All" && ` in ${selectedCategory}`}
              {searchTerm && ` matching "${searchTerm}"`}
            </p>
          </div>

          {/* Blog Grid */}
          {blogPosts.length > 0 ? (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {blogPosts.map((post, index) => (
                  <Card
                    key={post.id}
                    className="overflow-hidden border-border/50 hover:border-amber-500/50 transition-all duration-700 group hover:shadow-2xl hover:shadow-amber-500/10 hover:scale-105 animate-fade-in-up"
                    style={{ animationDelay: `${(index % 6) * 0.1}s` }}
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
                            <Badge variant="secondary" className="bg-amber-100/20 text-amber-600 border-amber-500/30">
                              {post.category.name}
                            </Badge>
                          </div>
                        )}
                        {post.featured && (
                          <div className="absolute top-4 right-4">
                            <Badge className="bg-amber-600 text-amber-50">
                              Featured
                            </Badge>
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
                          <Button
                            size="sm"
                            className="text-amber-600 hover:text-amber-700 hover:bg-amber-50/20 group/btn"
                          >
                            Read More
                            <ArrowRight className="h-3 w-3 group-hover/btn:translate-x-1 transition-transform duration-300" />
                          </Button>
                        </div>
                      </div>
                    </Link>
                  </Card>
                ))}
              </div>

              {/* Pagination */}
              {renderPagination()}
            </>
          ) : (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-2xl font-semibold text-foreground mb-2">No articles found</h3>
              <p className="text-muted-foreground mb-6">
                {searchTerm || selectedCategory !== "All" 
                  ? "Try adjusting your search or filter criteria."
                  : "No articles have been published yet."
                }
              </p>
              {(searchTerm || selectedCategory !== "All") && (
                <Button
                  onClick={() => {
                    setSearchTerm("")
                    setSelectedCategory("All")
                    setCurrentPage(1)
                  }}
                  className="bg-amber-600 hover:bg-amber-700"
                >
                  Clear Filters
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
