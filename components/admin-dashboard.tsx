'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff, 
  Star, 
  StarOff, 
  Upload, 
  X, 
  Save, 
  ArrowLeft,
  Search,
  Filter,
  Calendar,
  User,
  Image as ImageIcon
} from 'lucide-react'
import AdminCategoriesManager from './admin-categories'
import AdminTestimonialsManager from './admin-testimonials'
import AdminAuthorsManager from './admin-authors'
import AdminLeads from './admin-leads'

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  featured_image_url: string | null
  published: boolean
  featured: boolean
  author_id?: string | null
  category_id?: string | null
  created_at: string
  updated_at?: string
}

interface Project {
  id: string
  title: string
  slug: string
  description: string
  featured_image_url: string | null
  published: boolean
  featured: boolean
  created_at: string
  updated_at?: string
}

interface NewBlogPost {
  title: string
  slug: string
  excerpt: string
  content: string
  featured_image_url: File | null
  published: boolean
  featured: boolean
  category_id: string | null
  author_id: string | null
}

interface NewProject {
  title: string
  slug: string
  description: string
  featured_image_url: File | null
  published: boolean
  featured: boolean
}

type ViewMode = 'list' | 'create' | 'edit'
type ContentType = 'blog' | 'project' | 'categories' | 'testimonials' | 'authors' | 'leads'

interface Category {
  id: string
  name: string
  slug: string
}

interface Author {
  id: string
  name: string
  email: string
}

export default function AdminDashboard() {
  // State management
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [slugError, setSlugError] = useState<string | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [authors, setAuthors] = useState<Author[]>([])
  
  // UI state
  const [viewMode, setViewMode] = useState<ViewMode>('list')
  const [contentType, setContentType] = useState<ContentType>('blog')
  const [editingItem, setEditingItem] = useState<BlogPost | Project | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filter, setFilter] = useState<'all' | 'published' | 'draft' | 'featured'>('all')
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null)
  
  // Form state
  const [newBlogPost, setNewBlogPost] = useState<NewBlogPost>({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    featured_image_url: null,
    published: false,
    featured: false,
    category_id: null,
    author_id: null
  })
  
  const [newProject, setNewProject] = useState<NewProject>({
    title: '',
    slug: '',
    description: '',
    featured_image_url: null,
    published: false,
    featured: false
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      // Fetch blog posts
      const { data: blogData, error: blogError } = await supabase
        .from('blog_posts')
        .select('id, title, slug, excerpt, content, featured_image_url, published, featured, category_id, created_at, updated_at')
        .order('created_at', { ascending: false })

      if (blogError) throw blogError

      // Fetch projects
      const { data: projectData, error: projectError } = await supabase
        .from('projects')
        .select('id, title, slug, description, featured_image_url, published, featured, created_at, updated_at')
        .order('created_at', { ascending: false })

      if (projectError) throw projectError

      // Fetch categories
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select('id, name, slug')
        .order('name', { ascending: true })

      if (categoriesError) throw categoriesError

      // Fetch authors
      const { data: authorsData, error: authorsError } = await supabase
        .from('authors')
        .select('id, name, email')
        .order('name', { ascending: true })

      if (authorsError) throw authorsError

      setBlogPosts(blogData || [])
      setProjects(projectData || [])
      setCategories(categoriesData || [])
      setAuthors(authorsData || [])
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `${contentType === 'blog' ? 'blog-images' : 'project-images'}/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data } = supabase.storage
        .from('images')
        .getPublicUrl(filePath)

      return data.publicUrl
    } catch (error) {
      console.error('Error uploading image:', error)
      return null
    }
  }

  const handleCreate = async () => {
    setUploading(true)
    try {
      // Validate slug uniqueness
      const slugToCheck = contentType === 'blog' ? newBlogPost.slug : newProject.slug
      const tableToCheck = contentType === 'blog' ? 'blog_posts' : 'projects'
      const { data: existing, error: checkError } = await supabase
        .from(tableToCheck)
        .select('id')
        .eq('slug', slugToCheck)
        .limit(1)
      if (checkError) throw checkError
      if (existing && existing.length > 0) {
        setSlugError('This slug is already in use. Please choose another.')
        setUploading(false)
        return
      }

      let imageUrl = null
      
      if (contentType === 'blog' && newBlogPost.featured_image_url) {
        imageUrl = await uploadImage(newBlogPost.featured_image_url)
        if (!imageUrl) {
          alert('Failed to upload image')
          return
        }
      } else if (contentType === 'project' && newProject.featured_image_url) {
        imageUrl = await uploadImage(newProject.featured_image_url)
        if (!imageUrl) {
          alert('Failed to upload image')
          return
        }
      }

      const table = contentType === 'blog' ? 'blog_posts' : 'projects'
      const data = contentType === 'blog' ? {
        title: newBlogPost.title,
        slug: newBlogPost.slug,
        excerpt: newBlogPost.excerpt,
        content: newBlogPost.content,
        featured_image_url: imageUrl,
        published: newBlogPost.published,
        featured: newBlogPost.featured,
        category_id: newBlogPost.category_id,
        author_id: newBlogPost.author_id
      } : {
        title: newProject.title,
        slug: newProject.slug,
        description: newProject.description,
        featured_image_url: imageUrl,
        published: newProject.published,
        featured: newProject.featured
      }

      const { error } = await supabase
        .from(table)
        .insert(data)

      if (error) throw error

      // Reset form
      if (contentType === 'blog') {
        setNewBlogPost({
          title: '',
          slug: '',
          excerpt: '',
          content: '',
          featured_image_url: null,
          published: false,
          featured: false,
          category_id: null,
          author_id: null
        })
      } else {
        setNewProject({
          title: '',
          slug: '',
          description: '',
          featured_image_url: null,
          published: false,
          featured: false
        })
      }

      setViewMode('list')
      fetchData()
    } catch (error) {
      console.error('Error creating item:', error)
      alert('Failed to create item')
    } finally {
      setUploading(false)
    }
  }

  const handleUpdate = async () => {
    if (!editingItem) return
    
    setUploading(true)
    try {
      // Validate slug uniqueness (exclude current item)
      const slugToCheck = contentType === 'blog' ? newBlogPost.slug : newProject.slug
      const tableToCheck = contentType === 'blog' ? 'blog_posts' : 'projects'
      const { data: existing, error: checkError } = await supabase
        .from(tableToCheck)
        .select('id')
        .eq('slug', slugToCheck)
        .neq('id', editingItem.id)
        .limit(1)
      if (checkError) throw checkError
      if (existing && existing.length > 0) {
        setSlugError('This slug is already in use. Please choose another.')
        setUploading(false)
        return
      }

      let imageUrl = editingItem.featured_image_url
      
      if (contentType === 'blog' && newBlogPost.featured_image_url) {
        imageUrl = await uploadImage(newBlogPost.featured_image_url)
        if (!imageUrl) {
          alert('Failed to upload image')
          return
        }
      } else if (contentType === 'project' && newProject.featured_image_url) {
        imageUrl = await uploadImage(newProject.featured_image_url)
        if (!imageUrl) {
          alert('Failed to upload image')
          return
        }
      }

      const table = contentType === 'blog' ? 'blog_posts' : 'projects'
      const data = contentType === 'blog' ? {
        title: newBlogPost.title,
        slug: newBlogPost.slug,
        excerpt: newBlogPost.excerpt,
        content: newBlogPost.content,
        featured_image_url: imageUrl,
        published: newBlogPost.published,
        featured: newBlogPost.featured,
        category_id: newBlogPost.category_id,
        author_id: newBlogPost.author_id
      } : {
        title: newProject.title,
        slug: newProject.slug,
        description: newProject.description,
        featured_image_url: imageUrl,
        published: newProject.published,
        featured: newProject.featured
      }

      const { error } = await supabase
        .from(table)
        .update(data)
        .eq('id', editingItem.id)

      if (error) throw error

      setViewMode('list')
      setEditingItem(null)
      fetchData()
    } catch (error) {
      console.error('Error updating item:', error)
      alert('Failed to update item')
    } finally {
      setUploading(false)
    }
  }

  const handleDeleteConfirm = async () => {
    if (!deleteTargetId) return
    try {
      const table = contentType === 'blog' ? 'blog_posts' : 'projects'
      const { error } = await supabase.from(table).delete().eq('id', deleteTargetId)
      if (error) throw error
      setDeleteTargetId(null)
      fetchData()
    } catch (error) {
      console.error('Error deleting item:', error)
      alert('Failed to delete item')
    }
  }

  const handleTogglePublished = async (id: string, currentStatus: boolean) => {
    try {
      const table = contentType === 'blog' ? 'blog_posts' : 'projects'
      const { error } = await supabase
        .from(table)
        .update({ published: !currentStatus })
        .eq('id', id)

      if (error) throw error

      fetchData()
    } catch (error) {
      console.error('Error updating:', error)
    }
  }

  const handleToggleFeatured = async (id: string, currentStatus: boolean) => {
    try {
      const table = contentType === 'blog' ? 'blog_posts' : 'projects'
      const { error } = await supabase
        .from(table)
        .update({ featured: !currentStatus })
        .eq('id', id)

      if (error) throw error

      fetchData()
    } catch (error) {
      console.error('Error updating:', error)
    }
  }

  const startEdit = (item: BlogPost | Project) => {
    setEditingItem(item)
    if (contentType === 'blog') {
      const blogItem = item as BlogPost
      setNewBlogPost({
        title: blogItem.title,
        slug: blogItem.slug,
        excerpt: blogItem.excerpt,
        content: blogItem.content,
        featured_image_url: null,
        published: blogItem.published,
        featured: blogItem.featured,
        category_id: blogItem.category_id ?? null,
        author_id: blogItem.author_id ?? null
      })
    } else {
      const projectItem = item as Project
      setNewProject({
        title: projectItem.title,
        slug: projectItem.slug,
        description: projectItem.description,
        featured_image_url: null,
        published: projectItem.published,
        featured: projectItem.featured
      })
    }
    setViewMode('edit')
  }

  const resetForm = () => {
    if (contentType === 'blog') {
      setNewBlogPost({
        title: '',
        slug: '',
        excerpt: '',
        content: '',
        featured_image_url: null,
        published: false,
        featured: false,
        category_id: null,
        author_id: null
      })
    } else {
      setNewProject({
        title: '',
        slug: '',
        description: '',
        featured_image_url: null,
        published: false,
        featured: false
      })
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (contentType === 'blog') {
        setNewBlogPost({ ...newBlogPost, featured_image_url: file })
      } else {
        setNewProject({ ...newProject, featured_image_url: file })
      }
    }
  }

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }

  const handleTitleChange = (title: string) => {
    if (contentType === 'blog') {
      setNewBlogPost({ 
        ...newBlogPost, 
        title,
        slug: generateSlug(title)
      })
    } else {
      setNewProject({ 
        ...newProject, 
        title,
        slug: generateSlug(title)
      })
    }
    setSlugError(null)
  }

  // Filter and search
  const getFilteredItems = () => {
    if (contentType === 'blog') {
      let filtered = blogPosts

      // Search filter
      if (searchTerm) {
        filtered = filtered.filter(item =>
          item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
        )
      }

      // Status filter
      if (filter === 'published') {
        filtered = filtered.filter(item => item.published)
      } else if (filter === 'draft') {
        filtered = filtered.filter(item => !item.published)
      } else if (filter === 'featured') {
        filtered = filtered.filter(item => item.featured)
      }

      return filtered
    } else {
      let filtered = projects

      // Search filter
      if (searchTerm) {
        filtered = filtered.filter(item =>
          item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description.toLowerCase().includes(searchTerm.toLowerCase())
        )
      }

      // Status filter
      if (filter === 'published') {
        filtered = filtered.filter(item => item.published)
      } else if (filter === 'draft') {
        filtered = filtered.filter(item => !item.published)
      } else if (filter === 'featured') {
        filtered = filtered.filter(item => item.featured)
      }

      return filtered
    }
  }

  const filteredItems = getFilteredItems()

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-amber-600 mx-auto"></div>
          <p className="mt-4 text-foreground/70 text-lg">Loading admin dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl sm:text-5xl font-serif font-bold text-foreground mb-2">
                Styragon Admin
                <span className="block text-amber-600">Dashboard</span>
              </h1>
              <p className="text-lg sm:text-xl text-foreground/70 font-light">Manage your luxury content with precision</p>
            </div>
            <div className="flex items-center gap-4">
              <Button
                onClick={fetchData}
                variant="outline"
                className="inline-flex items-center px-6 py-3 text-base border-border hover:border-amber-600 hover:text-amber-600 hover:bg-amber-600/10 transition-all duration-300"
              >
                Refresh Data
              </Button>
            </div>
          </div>
        </div>

        {/* Content Type Tabs */}
        <div className="mb-8">
          <div className="border-b border-border/20">
            <nav className="-mb-px flex space-x-8 overflow-x-auto">
              <button
                onClick={() => {
                  setContentType('blog')
                  setViewMode('list')
                  setSearchTerm('')
                  setFilter('all')
                }}
                className={`py-3 px-1 border-b-2 font-serif font-semibold text-lg transition-all duration-300 ${
                  contentType === 'blog'
                    ? 'border-amber-600 text-amber-600'
                    : 'border-transparent text-foreground/60 hover:text-foreground hover:border-amber-600/50'
                }`}
              >
                Blog Posts ({blogPosts.length})
              </button>
              <button
                onClick={() => {
                  setContentType('project')
                  setViewMode('list')
                  setSearchTerm('')
                  setFilter('all')
                }}
                className={`py-3 px-1 border-b-2 font-serif font-semibold text-lg transition-all duration-300 ${
                  contentType === 'project'
                    ? 'border-amber-600 text-amber-600'
                    : 'border-transparent text-foreground/60 hover:text-foreground hover:border-amber-600/50'
                }`}
              >
                Projects ({projects.length})
              </button>
              <button
                onClick={() => {
                  setContentType('categories')
                  setViewMode('list')
                  setSearchTerm('')
                  setFilter('all')
                }}
                className={`py-3 px-1 border-b-2 font-serif font-semibold text-lg transition-all duration-300 ${
                  contentType === 'categories'
                    ? 'border-amber-600 text-amber-600'
                    : 'border-transparent text-foreground/60 hover:text-foreground hover:border-amber-600/50'
                }`}
              >
                Categories
              </button>
              <button
                onClick={() => {
                  setContentType('testimonials')
                  setViewMode('list')
                  setSearchTerm('')
                  setFilter('all')
                }}
                className={`py-3 px-1 border-b-2 font-serif font-semibold text-lg transition-all duration-300 ${
                  contentType === 'testimonials'
                    ? 'border-amber-600 text-amber-600'
                    : 'border-transparent text-foreground/60 hover:text-foreground hover:border-amber-600/50'
                }`}
              >
                Testimonials
              </button>
              <button
                onClick={() => {
                  setContentType('authors')
                  setViewMode('list')
                  setSearchTerm('')
                  setFilter('all')
                }}
                className={`py-3 px-1 border-b-2 font-serif font-semibold text-lg transition-all duration-300 ${
                  contentType === 'authors'
                    ? 'border-amber-600 text-amber-600'
                    : 'border-transparent text-foreground/60 hover:text-foreground hover:border-amber-600/50'
                }`}
              >
                Authors
              </button>
              <button
                onClick={() => {
                  setContentType('leads')
                  setViewMode('list')
                  setSearchTerm('')
                  setFilter('all')
                }}
                className={`py-3 px-1 border-b-2 font-serif font-semibold text-lg transition-all duration-300 ${
                  contentType === 'leads'
                    ? 'border-amber-600 text-amber-600'
                    : 'border-transparent text-foreground/60 hover:text-foreground hover:border-amber-600/50'
                }`}
              >
                Leads
              </button>
            </nav>
          </div>
        </div>

        {/* Categories/Testmonials managers */}
        {viewMode === 'list' && contentType === 'categories' && (
          <AdminCategoriesManager />
        )}
        {viewMode === 'list' && contentType === 'testimonials' && (
          <AdminTestimonialsManager />
        )}
        {viewMode === 'list' && contentType === 'authors' && (
          <AdminAuthorsManager />
        )}
        {viewMode === 'list' && contentType === 'leads' && (
          <AdminLeads />
        )}

        {/* List View for Blog/Projects */}
        {viewMode === 'list' && (contentType === 'blog' || contentType === 'project') && (
          <>
            {/* Search and Filter Bar */}
            <div className="mb-8 flex flex-col sm:flex-row gap-6">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-foreground/40 h-5 w-5" />
                  <Input
                    type="text"
                    placeholder={`Search ${contentType === 'blog' ? 'blog posts' : 'projects'}...`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 h-12 text-lg border-border/20 bg-background/50 focus:border-amber-600/50 focus:ring-amber-600/20"
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value as any)}
                  className="px-4 py-3 border border-border/20 rounded-md text-base bg-background/50 focus:border-amber-600/50 focus:ring-amber-600/20"
                >
                  <option value="all">All</option>
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                  <option value="featured">Featured</option>
                </select>
                <Button
                  onClick={() => {
                    resetForm()
                    setViewMode('create')
                  }}
                  className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 text-base font-medium h-12"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Add {contentType === 'blog' ? 'Blog Post' : 'Project'}
                </Button>
              </div>
            </div>

            {/* Items Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredItems.map((item) => (
                <Card key={item.id} className="overflow-hidden hover:shadow-2xl transition-all duration-500 border-border/20 bg-card/50 backdrop-blur-sm hover:border-amber-600/30 group">
                  {/* Image */}
                  {item.featured_image_url && (
                    <div className="aspect-video relative overflow-hidden">
                      <img
                        src={item.featured_image_url}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 right-3 flex gap-2">
                        {item.featured && (
                          <Badge className="bg-amber-600/90 text-white border-0 px-3 py-1 text-sm font-medium">
                            <Star className="h-4 w-4 mr-1" />
                            Featured
                          </Badge>
                        )}
                        <Badge className={`${item.published ? 'bg-green-600/90 text-white' : 'bg-foreground/60 text-white'} border-0 px-3 py-1 text-sm font-medium`}>
                          {item.published ? 'Published' : 'Draft'}
                        </Badge>
                      </div>
                    </div>
                  )}

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="font-serif font-semibold text-xl mb-3 line-clamp-2 text-foreground group-hover:text-amber-600 transition-colors duration-300">
                      {item.title}
                    </h3>
                    <p className="text-foreground/70 text-base mb-4 line-clamp-3 leading-relaxed">
                      {contentType === 'blog' 
                        ? (item as BlogPost).excerpt 
                        : (item as Project).description
                      }
                    </p>
                    <div className="flex items-center justify-between text-sm text-foreground/50 mb-6">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {new Date(item.created_at).toLocaleDateString()}
                      </div>
                      <span className="text-foreground/40 font-mono">#{item.slug}</span>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => startEdit(item)}
                        className="flex-1 h-10 text-sm font-medium border-border/20 hover:border-amber-600/50 hover:text-amber-600 hover:bg-amber-600/10 transition-all duration-300"
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleTogglePublished(item.id, item.published)}
                        className={`h-10 px-3 border-border/20 hover:border-green-600/50 transition-all duration-300 ${
                          item.published ? 'text-green-600 hover:text-green-700' : 'text-foreground/60 hover:text-green-600'
                        }`}
                      >
                        {item.published ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleToggleFeatured(item.id, item.featured)}
                        className={`h-10 px-3 border-border/20 hover:border-amber-600/50 transition-all duration-300 ${
                          item.featured ? 'text-amber-600 hover:text-amber-700' : 'text-foreground/60 hover:text-amber-600'
                        }`}
                      >
                        {item.featured ? <Star className="h-4 w-4" /> : <StarOff className="h-4 w-4" />}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setDeleteTargetId(item.id)}
                        className="h-10 px-3 text-red-600 hover:text-red-700 border-border/20 hover:border-red-600/50 hover:bg-red-600/10 transition-all duration-300"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {filteredItems.length === 0 && (
              <div className="text-center py-16">
                <p className="text-foreground/60 text-xl font-light mb-8">
                  {searchTerm || filter !== 'all' 
                    ? `No ${contentType === 'blog' ? 'blog posts' : 'projects'} found matching your criteria.`
                    : `No ${contentType === 'blog' ? 'blog posts' : 'projects'} yet.`
                  }
                </p>
                <Button
                  onClick={() => {
                    resetForm()
                    setViewMode('create')
                  }}
                  className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-4 text-lg font-medium h-14"
                >
                  <Plus className="h-5 w-5 mr-3" />
                  Add Your First {contentType === 'blog' ? 'Blog Post' : 'Project'}
                </Button>
              </div>
            )}
          </>
        )}

        {/* Create/Edit Form */}
        {(viewMode === 'create' || viewMode === 'edit') && (
          <div className="max-w-5xl mx-auto">
            <div className="mb-8">
              <Button
                variant="outline"
                onClick={() => {
                  setViewMode('list')
                  setEditingItem(null)
                  resetForm()
                }}
                className="mb-6 h-12 px-6 text-base border-border/20 hover:border-amber-600/50 hover:text-amber-600 hover:bg-amber-600/10 transition-all duration-300"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to {contentType === 'blog' ? 'Blog Posts' : 'Projects'}
              </Button>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-foreground">
                {viewMode === 'create' 
                  ? `Create New ${contentType === 'blog' ? 'Blog Post' : 'Project'}`
                  : `Edit ${contentType === 'blog' ? 'Blog Post' : 'Project'}`
                }
              </h2>
            </div>

            <Card className="p-8 border-border/20 bg-card/50 backdrop-blur-sm">
              <form onSubmit={(e) => {
                e.preventDefault()
                viewMode === 'create' ? handleCreate() : handleUpdate()
              }} className="space-y-8">
                {/* Title */}
                <div>
                  <label className="block text-lg font-medium text-foreground mb-3">
                    Title *
                  </label>
                  <Input
                    type="text"
                    value={contentType === 'blog' ? newBlogPost.title : newProject.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="Enter title..."
                    className="h-14 text-lg border-border/20 bg-background/50 focus:border-amber-600/50 focus:ring-amber-600/20"
                    required
                  />
                </div>

                {/* Slug */}
                <div>
                  <label className="block text-lg font-medium text-foreground mb-3">
                    Slug *
                  </label>
                  <Input
                    type="text"
                    value={contentType === 'blog' ? newBlogPost.slug : newProject.slug}
                    onChange={(e) => {
                      if (contentType === 'blog') {
                        setNewBlogPost({ ...newBlogPost, slug: e.target.value })
                      } else {
                        setNewProject({ ...newProject, slug: e.target.value })
                      }
                      setSlugError(null)
                    }}
                    placeholder="url-friendly-slug"
                    className="h-14 text-lg border-border/20 bg-background/50 focus:border-amber-600/50 focus:ring-amber-600/20"
                    required
                  />
                  {slugError && (
                    <p className="mt-2 text-sm text-red-500">{slugError}</p>
                  )}
                </div>

                {/* Description/Excerpt */}
                <div>
                  <label className="block text-lg font-medium text-foreground mb-3">
                    {contentType === 'blog' ? 'Excerpt' : 'Description'} *
                  </label>
                  <Textarea
                    value={contentType === 'blog' ? newBlogPost.excerpt : newProject.description}
                    onChange={(e) => {
                      if (contentType === 'blog') {
                        setNewBlogPost({ ...newBlogPost, excerpt: e.target.value })
                      } else {
                        setNewProject({ ...newProject, description: e.target.value })
                      }
                    }}
                    placeholder={`Enter ${contentType === 'blog' ? 'excerpt' : 'description'}...`}
                    rows={4}
                    className="text-lg border-border/20 bg-background/50 focus:border-amber-600/50 focus:ring-amber-600/20"
                    required
                  />
                </div>

                {/* Category (Blog only) */}
                {contentType === 'blog' && (
                  <div>
                    <label className="block text-lg font-medium text-foreground mb-3">
                      Category
                    </label>
                    <select
                      value={newBlogPost.category_id ?? ''}
                      onChange={(e) => setNewBlogPost({ ...newBlogPost, category_id: e.target.value || null })}
                      className="w-full h-14 text-lg px-4 border border-border/20 rounded-md bg-background/50 focus:border-amber-600/50 focus:ring-amber-600/20"
                    >
                      <option value="">No category</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Author (Blog only) */}
                {contentType === 'blog' && (
                  <div>
                    <label className="block text-lg font-medium text-foreground mb-3">
                      Author
                    </label>
                    <select
                      value={newBlogPost.author_id ?? ''}
                      onChange={(e) => setNewBlogPost({ ...newBlogPost, author_id: e.target.value || null })}
                      className="w-full h-14 text-lg px-4 border border-border/20 rounded-md bg-background/50 focus:border-amber-600/50 focus:ring-amber-600/20"
                    >
                      <option value="">No author</option>
                      {authors.map((a) => (
                        <option key={a.id} value={a.id}>{a.name} ({a.email})</option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Content (Blog only) */}
                {contentType === 'blog' && (
                  <div>
                    <label className="block text-lg font-medium text-foreground mb-3">
                      Content *
                    </label>
                    <Textarea
                      value={newBlogPost.content}
                      onChange={(e) => setNewBlogPost({ ...newBlogPost, content: e.target.value })}
                      placeholder="Enter blog content..."
                      rows={10}
                      className="text-lg border-border/20 bg-background/50 focus:border-amber-600/50 focus:ring-amber-600/20"
                      required
                    />
                  </div>
                )}

                {/* Featured Image */}
                <div>
                  <label className="block text-lg font-medium text-foreground mb-3">
                    Featured Image
                  </label>
                  <div className="flex items-center gap-6">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="flex-1 h-14 text-lg border-border/20 bg-background/50 focus:border-amber-600/50 focus:ring-amber-600/20"
                    />
                    <div className="text-base text-foreground/60 flex items-center">
                      <ImageIcon className="h-5 w-5 mr-2" />
                      {contentType === 'blog' ? 'Blog' : 'Project'} Image
                    </div>
                  </div>
                </div>

                {/* Status Options */}
                <div className="flex gap-8">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={contentType === 'blog' ? newBlogPost.published : newProject.published}
                      onChange={(e) => {
                        if (contentType === 'blog') {
                          setNewBlogPost({ ...newBlogPost, published: e.target.checked })
                        } else {
                          setNewProject({ ...newProject, published: e.target.checked })
                        }
                      }}
                      className="w-5 h-5 rounded border-border/20 text-amber-600 shadow-sm focus:border-amber-600 focus:ring focus:ring-amber-200 focus:ring-opacity-50"
                    />
                    <span className="ml-3 text-lg text-foreground">Published</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={contentType === 'blog' ? newBlogPost.featured : newProject.featured}
                      onChange={(e) => {
                        if (contentType === 'blog') {
                          setNewBlogPost({ ...newBlogPost, featured: e.target.checked })
                        } else {
                          setNewProject({ ...newProject, featured: e.target.checked })
                        }
                      }}
                      className="w-5 h-5 rounded border-border/20 text-amber-600 shadow-sm focus:border-amber-600 focus:ring focus:ring-amber-200 focus:ring-opacity-50"
                    />
                    <span className="ml-3 text-lg text-foreground">Featured</span>
                  </label>
                </div>

                {/* Submit Buttons */}
                <div className="flex justify-end gap-6 pt-8 border-t border-border/20">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setViewMode('list')
                      setEditingItem(null)
                      resetForm()
                    }}
                    className="h-14 px-8 text-lg font-medium border-border/20 hover:border-foreground/30 hover:text-foreground transition-all duration-300"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={uploading || !!slugError}
                    className="bg-amber-600 hover:bg-amber-700 text-white h-14 px-8 text-lg font-medium"
                  >
                    {uploading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                        {viewMode === 'create' ? 'Creating...' : 'Updating...'}
                      </>
                    ) : (
                      <>
                        <Save className="h-5 w-5 mr-3" />
                        {viewMode === 'create' ? 'Create' : 'Update'}
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        )}

        {/* Delete confirmation modal */}
        <AlertDialog open={!!deleteTargetId} onOpenChange={(open) => { if (!open) setDeleteTargetId(null) }}>
          <AlertDialogContent className="admin-dialog">
            <AlertDialogHeader>
              <AlertDialogTitle>Delete this item?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. The item will be permanently removed.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={handleDeleteConfirm}>
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  )
}