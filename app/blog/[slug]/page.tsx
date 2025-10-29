"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, ArrowLeft, User, Tag } from "lucide-react"
import { apiClient, BlogPost } from "@/lib/supabase-api"

export default function BlogPostPage() {
  const [post, setPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const data = await apiClient.getBlogPost(slug)
        setPost(data)
      } catch (err) {
        setError("Post not found")
        console.error('Failed to fetch blog post:', err)
      } finally {
        setLoading(false)
      }
    }

    if (slug) {
      fetchPost()
    }
  }, [slug])

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto px-6 py-32">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse">
              <div className="h-8 bg-muted-foreground/20 rounded w-1/4 mb-6"></div>
              <div className="h-12 bg-muted-foreground/20 rounded w-3/4 mb-8"></div>
              <div className="aspect-video bg-muted-foreground/20 rounded-lg mb-8"></div>
              <div className="space-y-4">
                <div className="h-4 bg-muted-foreground/20 rounded w-full"></div>
                <div className="h-4 bg-muted-foreground/20 rounded w-5/6"></div>
                <div className="h-4 bg-muted-foreground/20 rounded w-4/6"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-foreground mb-4">Post Not Found</h1>
          <p className="text-muted-foreground mb-8">The blog post you're looking for doesn't exist.</p>
          <Button onClick={() => router.push('/blog-section')} className="bg-amber-600 hover:bg-amber-700">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Blog
          </Button>
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
            <Button
              variant="ghost"
              onClick={() => router.push('/blog-section')}
              className="text-amber-600 hover:text-amber-700 hover:bg-amber-50"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Blog
            </Button>
            <div className="text-sm text-muted-foreground">
              {post.category && (
                <Badge variant="outline" className="mr-2">
                  {post.category.name}
                </Badge>
              )}
              {post.featured && (
                <Badge className="bg-amber-600 text-amber-50">
                  Featured
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="container mx-auto px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-serif font-bold text-foreground mb-6 leading-tight">
              {post.title}
            </h1>
            
            {post.excerpt && (
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-8">
                {post.excerpt}
              </p>
            )}

            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
              {post.author && (
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>{post.author.name}</span>
                </div>
              )}
              
              {post.published_at && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(post.published_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}</span>
                </div>
              )}
              
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{post.read_time} min read</span>
              </div>
            </div>
          </div>

          {/* Featured Image */}
          {getImageUrl(post) && (
            <div className="relative aspect-video rounded-2xl overflow-hidden mb-12 shadow-2xl">
              <Image
                src={getImageUrl(post)!}
                alt={post.title}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent" />
            </div>
          )}

          {/* Content */}
          <Card className="p-8 md:p-12 bg-card/50 backdrop-blur-sm border-border/50">
            <div 
              className="prose prose-lg max-w-none prose-headings:font-serif prose-headings:text-foreground prose-p:text-muted-foreground prose-p:leading-relaxed prose-a:text-amber-600 prose-a:no-underline hover:prose-a:underline prose-strong:text-foreground prose-code:text-amber-600 prose-code:bg-amber-50 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-pre:bg-muted prose-pre:border prose-pre:border-border"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </Card>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="mt-12">
              <div className="flex items-center gap-2 mb-4">
                <Tag className="h-5 w-5 text-amber-600" />
                <h3 className="text-lg font-semibold text-foreground">Tags</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="hover:bg-amber-50 hover:border-amber-300 hover:text-amber-700 transition-colors">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Author Bio */}
          {post.author && post.author.bio && (
            <Card className="mt-12 p-8 bg-card/50 backdrop-blur-sm border-border/50">
              <div className="flex items-start gap-4">
                {post.author.avatar_url && (
                  <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
                    <Image
                      src={post.author.avatar_url}
                      alt={post.author.name}
                      width={64}
                      height={64}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    About {post.author.name}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {post.author.bio}
                  </p>
                </div>
              </div>
            </Card>
          )}

          {/* Navigation */}
          <div className="mt-16 text-center">
            <Button
              onClick={() => router.push('/blog-section')}
              className="bg-amber-600 hover:bg-amber-700 text-amber-50 px-8 py-3"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to All Posts
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
