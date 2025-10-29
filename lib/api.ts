const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

export interface BlogPost {
  id: number
  title: string
  slug: string
  excerpt: string
  content: string
  featured_image?: string
  featured_image_url?: string
  author?: {
    id: number
    name: string
    email: string
    bio?: string
    avatar_url?: string
  }
  category?: {
    id: number
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
  id: number
  title: string
  slug: string
  description: string
  challenge?: string
  solution?: string
  results?: string
  featured_image?: string
  featured_image_url?: string
  project_url?: string
  technologies: Category[]
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
  id: number
  client_name: string
  client_title?: string
  client_avatar_url?: string
  quote: string
  rating: number
  featured: boolean
  created_at: string
  updated_at?: string
}

export interface Category {
  id: number
  name: string
  slug: string
  description?: string
  color: string
  created_at: string
  updated_at?: string
}

export interface Author {
  id: number
  name: string
  email: string
  bio?: string
  avatar_url?: string
  created_at: string
  updated_at?: string
}

class ApiClient {
  private baseUrl: string

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    })

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`)
    }

    return response.json()
  }

  // Blog Posts
  async getBlogPosts(params?: {
    search?: string
    category?: string
    featured?: boolean
    published?: boolean
    ordering?: string
    page?: number
  }): Promise<{ results: BlogPost[]; count: number; next?: string; previous?: string }> {
    const searchParams = new URLSearchParams()
    if (params?.search) searchParams.append('search', params.search)
    if (params?.category) searchParams.append('category', params.category)
    if (params?.featured !== undefined) searchParams.append('featured', params.featured.toString())
    if (params?.published !== undefined) searchParams.append('published', params.published.toString())
    if (params?.ordering) searchParams.append('ordering', params.ordering)
    if (params?.page) searchParams.append('page', params.page.toString())

    const queryString = searchParams.toString()
    return this.request(`/blog-posts/${queryString ? `?${queryString}` : ''}`)
  }

  async getBlogPost(slug: string): Promise<BlogPost> {
    return this.request(`/blog-posts/${slug}/`)
  }

  async getFeaturedBlogPosts(): Promise<BlogPost[]> {
    const response = await this.request<{results: BlogPost[]}>('/blog-posts/?featured=true')
    return response.results
  }

  async getBlogPostsByCategory(categorySlug: string): Promise<BlogPost[]> {
    return this.request(`/blog-posts/by_category/?category=${categorySlug}`)
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
    const searchParams = new URLSearchParams()
    if (params?.search) searchParams.append('search', params.search)
    if (params?.status) searchParams.append('status', params.status)
    if (params?.featured !== undefined) searchParams.append('featured', params.featured.toString())
    if (params?.published !== undefined) searchParams.append('published', params.published.toString())
    if (params?.ordering) searchParams.append('ordering', params.ordering)
    if (params?.page) searchParams.append('page', params.page.toString())

    const queryString = searchParams.toString()
    return this.request(`/projects/${queryString ? `?${queryString}` : ''}`)
  }

  async getProject(slug: string): Promise<Project> {
    return this.request(`/projects/${slug}/`)
  }

  async getFeaturedProjects(): Promise<Project[]> {
    const response = await this.request<{results: Project[]}>('/projects/?featured=true')
    return response.results
  }

  async getProjectsByStatus(status: string): Promise<Project[]> {
    return this.request(`/projects/by_status/?status=${status}`)
  }

  // Services
  async getServices(): Promise<Service[]> {
    const response = await this.request<{results: Service[]}>('/services/')
    return response.results
  }

  // Testimonials
  async getTestimonials(params?: {
    featured?: boolean
    published?: boolean
    rating?: number
    ordering?: string
    page?: number
  }): Promise<{ results: Testimonial[]; count: number; next?: string; previous?: string }> {
    const searchParams = new URLSearchParams()
    if (params?.featured !== undefined) searchParams.append('featured', params.featured.toString())
    if (params?.published !== undefined) searchParams.append('published', params.published.toString())
    if (params?.rating) searchParams.append('rating', params.rating.toString())
    if (params?.ordering) searchParams.append('ordering', params.ordering)
    if (params?.page) searchParams.append('page', params.page.toString())

    const queryString = searchParams.toString()
    return this.request(`/testimonials/${queryString ? `?${queryString}` : ''}`)
  }

  async getFeaturedTestimonials(): Promise<Testimonial[]> {
    const response = await this.request<{results: Testimonial[]}>('/testimonials/?featured=true')
    return response.results
  }

  // Categories
  async getCategories(): Promise<Category[]> {
    const response = await this.request<{results: Category[]}>('/categories/')
    return response.results
  }

  // Authors
  async getAuthors(): Promise<Author[]> {
    const response = await this.request<{results: Author[]}>('/authors/')
    return response.results
  }
}

export const apiClient = new ApiClient()
