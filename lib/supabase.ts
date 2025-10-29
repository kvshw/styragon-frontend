import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://wgryzcdwebjbmkadrerh.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indncnl6Y2R3ZWJqYm1rYWRyZXJoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE2NzE0MTYsImV4cCI6MjA3NzI0NzQxNn0.ovE4f2fwDTSMkYicgzGOtwbV7v67oFh06T6FpqthgSY'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Database {
  public: {
    Tables: {
      categories: {
        Row: {
          id: number
          name: string
          slug: string
          description: string | null
          color: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          name: string
          slug: string
          description?: string | null
          color?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          name?: string
          slug?: string
          description?: string | null
          color?: string
          created_at?: string
          updated_at?: string
        }
      }
      authors: {
        Row: {
          id: number
          name: string
          email: string
          bio: string | null
          avatar_url: string | null
          social_links: any
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          name: string
          email: string
          bio?: string | null
          avatar_url?: string | null
          social_links?: any
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          name?: string
          email?: string
          bio?: string | null
          avatar_url?: string | null
          social_links?: any
          created_at?: string
          updated_at?: string
        }
      }
      blog_posts: {
        Row: {
          id: number
          title: string
          slug: string
          excerpt: string | null
          content: string
          featured_image_url: string | null
          category_id: number | null
          author_id: number | null
          featured: boolean
          published: boolean
          published_at: string | null
          read_time: number
          meta_title: string | null
          meta_description: string | null
          tags: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          title: string
          slug: string
          excerpt?: string | null
          content: string
          featured_image_url?: string | null
          category_id?: number | null
          author_id?: number | null
          featured?: boolean
          published?: boolean
          published_at?: string | null
          read_time?: number
          meta_title?: string | null
          meta_description?: string | null
          tags?: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          title?: string
          slug?: string
          excerpt?: string | null
          content?: string
          featured_image_url?: string | null
          category_id?: number | null
          author_id?: number | null
          featured?: boolean
          published?: boolean
          published_at?: string | null
          read_time?: number
          meta_title?: string | null
          meta_description?: string | null
          tags?: string[]
          created_at?: string
          updated_at?: string
        }
      }
      projects: {
        Row: {
          id: number
          title: string
          slug: string
          description: string | null
          content: string | null
          challenge: string | null
          solution: string | null
          results: string | null
          featured_image_url: string | null
          gallery_images: string[]
          client_name: string | null
          project_url: string | null
          github_url: string | null
          technologies: string[]
          status: string
          featured: boolean
          published: boolean
          start_date: string | null
          end_date: string | null
          meta_title: string | null
          meta_description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          title: string
          slug: string
          description?: string | null
          content?: string | null
          challenge?: string | null
          solution?: string | null
          results?: string | null
          featured_image_url?: string | null
          gallery_images?: string[]
          client_name?: string | null
          project_url?: string | null
          github_url?: string | null
          technologies?: string[]
          status?: string
          featured?: boolean
          published?: boolean
          start_date?: string | null
          end_date?: string | null
          meta_title?: string | null
          meta_description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          title?: string
          slug?: string
          description?: string | null
          content?: string | null
          challenge?: string | null
          solution?: string | null
          results?: string | null
          featured_image_url?: string | null
          gallery_images?: string[]
          client_name?: string | null
          project_url?: string | null
          github_url?: string | null
          technologies?: string[]
          status?: string
          featured?: boolean
          published?: boolean
          start_date?: string | null
          end_date?: string | null
          meta_title?: string | null
          meta_description?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      services: {
        Row: {
          id: string
          title: string
          description: string
          icon: string | null
          order_index: number
          active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          icon?: string | null
          order_index?: number
          active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          icon?: string | null
          order_index?: number
          active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      testimonials: {
        Row: {
          id: number
          client_name: string
          client_title: string | null
          client_company: string | null
          client_avatar_url: string | null
          content: string
          rating: number
          featured: boolean
          published: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          client_name: string
          client_title?: string | null
          client_company?: string | null
          client_avatar_url?: string | null
          content: string
          rating?: number
          featured?: boolean
          published?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          client_name?: string
          client_title?: string | null
          client_company?: string | null
          client_avatar_url?: string | null
          content?: string
          rating?: number
          featured?: boolean
          published?: boolean
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
