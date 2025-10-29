'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  featured_image_url: string | null
  published: boolean
  featured: boolean
  created_at: string
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
}

interface NewBlogPost {
  title: string
  slug: string
  excerpt: string
  content: string
  featured_image_url: File | null
  published: boolean
  featured: boolean
}

interface NewProject {
  title: string
  slug: string
  description: string
  featured_image_url: File | null
  published: boolean
  featured: boolean
}

export default function AdminDashboard() {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddBlogPost, setShowAddBlogPost] = useState(false)
  const [showAddProject, setShowAddProject] = useState(false)
  const [newBlogPost, setNewBlogPost] = useState<NewBlogPost>({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    featured_image_url: null,
    published: false,
    featured: false
  })
  const [newProject, setNewProject] = useState<NewProject>({
    title: '',
    slug: '',
    description: '',
    featured_image_url: null,
    published: false,
    featured: false
  })
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      // Fetch blog posts
      const { data: blogData, error: blogError } = await supabase
        .from('blog_posts')
        .select('id, title, slug, excerpt, content, featured_image_url, published, featured, created_at')
        .order('created_at', { ascending: false })

      if (blogError) throw blogError

      // Fetch projects
      const { data: projectData, error: projectError } = await supabase
        .from('projects')
        .select('id, title, slug, description, featured_image_url, published, featured, created_at')
        .order('created_at', { ascending: false })

      if (projectError) throw projectError

      setBlogPosts(blogData || [])
      setProjects(projectData || [])
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const togglePublished = async (table: 'blog_posts' | 'projects', id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from(table)
        .update({ published: !currentStatus })
        .eq('id', id)

      if (error) throw error

      // Refresh data
      fetchData()
    } catch (error) {
      console.error('Error updating:', error)
    }
  }

  const toggleFeatured = async (table: 'blog_posts' | 'projects', id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from(table)
        .update({ featured: !currentStatus })
        .eq('id', id)

      if (error) throw error

      // Refresh data
      fetchData()
    } catch (error) {
      console.error('Error updating:', error)
    }
  }

  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `project-images/${fileName}`

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

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault()
    setUploading(true)

    try {
      let imageUrl = null
      
      if (newProject.featured_image_url) {
        imageUrl = await uploadImage(newProject.featured_image_url)
        if (!imageUrl) {
          alert('Failed to upload image')
          setUploading(false)
          return
        }
      }

      const { error } = await supabase
        .from('projects')
        .insert({
          title: newProject.title,
          slug: newProject.slug,
          description: newProject.description,
          featured_image_url: imageUrl,
          published: newProject.published,
          featured: newProject.featured
        })

      if (error) throw error

      // Reset form
      setNewProject({
        title: '',
        slug: '',
        description: '',
        featured_image_url: null,
        published: false,
        featured: false
      })
      setShowAddProject(false)

      // Refresh data
      fetchData()
    } catch (error) {
      console.error('Error adding project:', error)
      alert('Failed to add project')
    } finally {
      setUploading(false)
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setNewProject({ ...newProject, featured_image_url: file })
    }
  }

  const handleBlogImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setNewBlogPost({ ...newBlogPost, featured_image_url: file })
    }
  }

  const handleAddBlogPost = async (e: React.FormEvent) => {
    e.preventDefault()
    setUploading(true)

    try {
      let imageUrl = null
      
      if (newBlogPost.featured_image_url) {
        imageUrl = await uploadImage(newBlogPost.featured_image_url)
        if (!imageUrl) {
          alert('Failed to upload image')
          setUploading(false)
          return
        }
      }

      const { error } = await supabase
        .from('blog_posts')
        .insert({
          title: newBlogPost.title,
          slug: newBlogPost.slug,
          excerpt: newBlogPost.excerpt,
          content: newBlogPost.content,
          featured_image_url: imageUrl,
          published: newBlogPost.published,
          featured: newBlogPost.featured
        })

      if (error) throw error

      // Reset form
      setNewBlogPost({
        title: '',
        slug: '',
        excerpt: '',
        content: '',
        featured_image_url: null,
        published: false,
        featured: false
      })
      setShowAddBlogPost(false)

      // Refresh data
      fetchData()
    } catch (error) {
      console.error('Error adding blog post:', error)
      alert('Failed to add blog post')
    } finally {
      setUploading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Styragon Admin Dashboard</h1>
          <p className="mt-2 text-gray-600">Manage your content with Supabase</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Blog Posts */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Blog Posts</h2>
                <p className="text-sm text-gray-600">{blogPosts.length} total posts</p>
              </div>
              <button
                onClick={() => setShowAddBlogPost(true)}
                className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700"
              >
                Add Blog Post
              </button>
            </div>
            <div className="divide-y divide-gray-200">
              {blogPosts.map((post) => (
                <div key={post.id} className="px-6 py-4">
                  <div className="flex items-start space-x-4">
                    {post.featured_image_url && (
                      <div className="flex-shrink-0">
                        <img
                          src={post.featured_image_url}
                          alt={post.title}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="text-sm font-medium text-gray-900">{post.title}</h3>
                          <p className="text-sm text-gray-500">{post.slug}</p>
                          <p className="text-xs text-gray-400 truncate">{post.excerpt}</p>
                          <p className="text-xs text-gray-400">
                            {new Date(post.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => togglePublished('blog_posts', post.id, post.published)}
                            className={`px-3 py-1 text-xs rounded-full ${
                              post.published
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {post.published ? 'Published' : 'Draft'}
                          </button>
                          <button
                            onClick={() => toggleFeatured('blog_posts', post.id, post.featured)}
                            className={`px-3 py-1 text-xs rounded-full ${
                              post.featured
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {post.featured ? 'Featured' : 'Normal'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Projects */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Projects</h2>
                <p className="text-sm text-gray-600">{projects.length} total projects</p>
              </div>
              <button
                onClick={() => setShowAddProject(true)}
                className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
              >
                Add Project
              </button>
            </div>
            <div className="divide-y divide-gray-200">
              {projects.map((project) => (
                <div key={project.id} className="px-6 py-4">
                  <div className="flex items-start space-x-4">
                    {project.featured_image_url && (
                      <div className="flex-shrink-0">
                        <img
                          src={project.featured_image_url}
                          alt={project.title}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="text-sm font-medium text-gray-900">{project.title}</h3>
                          <p className="text-sm text-gray-500">{project.slug}</p>
                          <p className="text-xs text-gray-400 truncate">{project.description}</p>
                          <p className="text-xs text-gray-400">
                            {new Date(project.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => togglePublished('projects', project.id, project.published)}
                            className={`px-3 py-1 text-xs rounded-full ${
                              project.published
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {project.published ? 'Published' : 'Draft'}
                          </button>
                          <button
                            onClick={() => toggleFeatured('projects', project.id, project.featured)}
                            className={`px-3 py-1 text-xs rounded-full ${
                              project.featured
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {project.featured ? 'Featured' : 'Normal'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Quick Actions</h2>
          </div>
          <div className="px-6 py-4">
            <div className="flex space-x-4">
              <a
                href="https://supabase.com/dashboard"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Open Supabase Dashboard
              </a>
              <button
                onClick={fetchData}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Refresh Data
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Add Project Modal */}
      {showAddProject && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Add New Project</h3>
                <button
                  onClick={() => setShowAddProject(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              <form onSubmit={handleAddProject} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Title</label>
                  <input
                    type="text"
                    value={newProject.title}
                    onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Slug</label>
                  <input
                    type="text"
                    value={newProject.slug}
                    onChange={(e) => setNewProject({ ...newProject, slug: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    value={newProject.description}
                    onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                    rows={3}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Featured Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                </div>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={newProject.published}
                      onChange={(e) => setNewProject({ ...newProject, published: e.target.checked })}
                      className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    />
                    <span className="ml-2 text-sm text-gray-700">Published</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={newProject.featured}
                      onChange={(e) => setNewProject({ ...newProject, featured: e.target.checked })}
                      className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    />
                    <span className="ml-2 text-sm text-gray-700">Featured</span>
                  </label>
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddProject(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={uploading}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50"
                  >
                    {uploading ? 'Adding...' : 'Add Project'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Add Blog Post Modal */}
      {showAddBlogPost && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Add New Blog Post</h3>
                <button
                  onClick={() => setShowAddBlogPost(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              <form onSubmit={handleAddBlogPost} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Title</label>
                  <input
                    type="text"
                    value={newBlogPost.title}
                    onChange={(e) => setNewBlogPost({ ...newBlogPost, title: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Slug</label>
                  <input
                    type="text"
                    value={newBlogPost.slug}
                    onChange={(e) => setNewBlogPost({ ...newBlogPost, slug: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Excerpt</label>
                  <textarea
                    value={newBlogPost.excerpt}
                    onChange={(e) => setNewBlogPost({ ...newBlogPost, excerpt: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                    rows={2}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Content</label>
                  <textarea
                    value={newBlogPost.content}
                    onChange={(e) => setNewBlogPost({ ...newBlogPost, content: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                    rows={4}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Featured Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleBlogImageChange}
                    className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                  />
                </div>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={newBlogPost.published}
                      onChange={(e) => setNewBlogPost({ ...newBlogPost, published: e.target.checked })}
                      className="rounded border-gray-300 text-green-600 shadow-sm focus:border-green-300 focus:ring focus:ring-green-200 focus:ring-opacity-50"
                    />
                    <span className="ml-2 text-sm text-gray-700">Published</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={newBlogPost.featured}
                      onChange={(e) => setNewBlogPost({ ...newBlogPost, featured: e.target.checked })}
                      className="rounded border-gray-300 text-green-600 shadow-sm focus:border-green-300 focus:ring focus:ring-green-200 focus:ring-opacity-50"
                    />
                    <span className="ml-2 text-sm text-gray-700">Featured</span>
                  </label>
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddBlogPost(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={uploading}
                    className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 disabled:opacity-50"
                  >
                    {uploading ? 'Adding...' : 'Add Blog Post'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
