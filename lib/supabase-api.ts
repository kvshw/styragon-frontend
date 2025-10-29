import { supabase } from './supabase'

export interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  featured_image_url?: string
  author?: {
    id: string
    name: string
    email: string
    bio?: string
    avatar_url?: string
  }
  category?: {
    id: string
    name: string
    slug: string
    description?: string
    color: string
  }
  featured: boolean
  published: boolean
  published_at?: string
  read_time: number
  tags?: string[]
  meta_title?: string
  meta_description?: string
  created_at: string
  updated_at?: string
}

export interface Project {
  id: string
  title: string
  slug: string
  description: string
  challenge?: string
  solution?: string
  results?: string
  featured_image_url?: string
  project_url?: string
  technologies: string[]
  featured: boolean
  published: boolean
  meta_title?: string
  meta_description?: string
  created_at: string
  updated_at?: string
}

export interface Service {
  id: string
  title: string
  description: string
  icon?: string
  order_index: number
  active: boolean
  created_at: string
  updated_at?: string
}

export interface Testimonial {
  id: string
  client_name: string
  client_title?: string
  client_avatar_url?: string
  content: string
  rating: number
  featured: boolean
  created_at: string
  updated_at?: string
}

export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  color: string
  created_at: string
  updated_at?: string
}

export interface Author {
  id: string
  name: string
  email: string
  bio?: string
  avatar_url?: string
  created_at: string
  updated_at?: string
}

class SupabaseApiClient {
  // Blog Posts
  async getBlogPosts(params?: {
    search?: string
    category?: string
    featured?: boolean
    published?: boolean
    ordering?: string
    page?: number
  }): Promise<{ results: BlogPost[]; count: number; next?: string; previous?: string }> {
    try {
      let query = supabase
        .from('blog_posts')
        .select(`
          *,
          author:authors(*),
          category:categories(*)
        `)

      if (params?.published !== undefined) {
        query = query.eq('published', params.published)
      }
      if (params?.featured !== undefined) {
        query = query.eq('featured', params.featured)
      }
      if (params?.search) {
        query = query.or(`title.ilike.%${params.search}%,content.ilike.%${params.search}%`)
      }
      if (params?.category) {
        query = query.eq('category.slug', params.category)
      }

      const { data, error } = await query.order('created_at', { ascending: false })

      if (error) throw error

      return {
        results: data || [],
        count: data?.length || 0
      }
    } catch (error) {
      console.warn('Error fetching blog posts:', error)
      return { results: [], count: 0 }
    }
  }

  async getBlogPost(slug: string): Promise<BlogPost | null> {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select(`
          *,
          author:authors(*),
          category:categories(*)
        `)
        .eq('slug', slug)
        .eq('published', true)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.warn('Error fetching blog post:', error)
      return null
    }
  }

  async getFeaturedBlogPosts(): Promise<BlogPost[]> {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select(`
          *,
          author:authors(*),
          category:categories(*)
        `)
        .eq('featured', true)
        .eq('published', true)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.warn('Error fetching featured blog posts:', error)
      return []
    }
  }

  // Projects
  async getProjects(params?: {
    search?: string
    status?: string
    featured?: boolean
    published?: boolean
    ordering?: string
    page?: number
  }): Promise<{ results: Project[]; count: number; next?: string; previous?: string }> {
    try {
      let query = supabase
        .from('projects')
        .select('*')

      if (params?.published !== undefined) {
        query = query.eq('published', params.published)
      }
      if (params?.featured !== undefined) {
        query = query.eq('featured', params.featured)
      }
      if (params?.search) {
        query = query.or(`title.ilike.%${params.search}%,description.ilike.%${params.search}%`)
      }
      if (params?.status) {
        query = query.eq('status', params.status)
      }

      const { data, error } = await query.order('created_at', { ascending: false })

      if (error) throw error

      return {
        results: data || [],
        count: data?.length || 0
      }
    } catch (error) {
      console.warn('Error fetching projects:', error)
      return { results: [], count: 0 }
    }
  }

  async getProject(slug: string): Promise<Project | null> {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('slug', slug)
        .eq('published', true)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.warn('Error fetching project:', error)
      return null
    }
  }

  async getFeaturedProjects(): Promise<Project[]> {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('featured', true)
        .eq('published', true)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.warn('Error fetching featured projects:', error)
      return []
    }
  }

  // Services
  async getServices(): Promise<Service[]> {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('active', true)
        .order('order_index', { ascending: true })

      if (error) throw error
      return data || []
    } catch (error) {
      console.warn('Error fetching services:', error)
      return []
    }
  }

  // Testimonials
  async getTestimonials(params?: {
    featured?: boolean
    published?: boolean
    rating?: number
    ordering?: string
    page?: number
  }): Promise<{ results: Testimonial[]; count: number; next?: string; previous?: string }> {
    try {
      let query = supabase
        .from('testimonials')
        .select('*')

      if (params?.published !== undefined) {
        query = query.eq('published', params.published)
      }
      if (params?.featured !== undefined) {
        query = query.eq('featured', params.featured)
      }
      if (params?.rating) {
        query = query.eq('rating', params.rating)
      }

      const { data, error } = await query.order('created_at', { ascending: false })

      if (error) throw error

      return {
        results: data || [],
        count: data?.length || 0
      }
    } catch (error) {
      console.warn('Error fetching testimonials:', error)
      return { results: [], count: 0 }
    }
  }

  async getFeaturedTestimonials(): Promise<Testimonial[]> {
    try {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .eq('featured', true)
        .eq('published', true)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.warn('Error fetching featured testimonials:', error)
      return []
    }
  }

  // Categories
  async getCategories(): Promise<Category[]> {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name', { ascending: true })

      if (error) throw error
      return data || []
    } catch (error) {
      console.warn('Error fetching categories:', error)
      return []
    }
  }

  // Authors
  async getAuthors(): Promise<Author[]> {
    try {
      const { data, error } = await supabase
        .from('authors')
        .select('*')
        .order('name', { ascending: true })

      if (error) throw error
      return data || []
    } catch (error) {
      console.warn('Error fetching authors:', error)
      return []
    }
  }
}

export const apiClient = new SupabaseApiClient()
