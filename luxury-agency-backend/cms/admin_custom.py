from django.contrib import admin
from django.template.response import TemplateResponse
from django.urls import path
from django.utils.html import format_html
from django.db.models import Count
from .models import Category, Author, BlogPost, Project, Service, Testimonial


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug', 'color_preview', 'created_at']
    list_filter = ['created_at']
    search_fields = ['name', 'description']
    prepopulated_fields = {'slug': ('name',)}
    readonly_fields = ['created_at', 'updated_at']
    
    def color_preview(self, obj):
        return format_html(
            '<div style="width: 20px; height: 20px; background-color: {}; border-radius: 3px; display: inline-block; margin-right: 8px;"></div>{}',
            obj.color, obj.color
        )
    color_preview.short_description = 'Color'


@admin.register(Author)
class AuthorAdmin(admin.ModelAdmin):
    list_display = ['name', 'email', 'created_at']
    search_fields = ['name', 'email']
    readonly_fields = ['created_at', 'updated_at']


@admin.register(BlogPost)
class BlogPostAdmin(admin.ModelAdmin):
    list_display = ['title', 'author', 'category', 'status_badge', 'featured_badge', 'image_preview', 'published_at', 'created_at']
    list_filter = ['published', 'featured', 'category', 'author', 'created_at']
    search_fields = ['title', 'excerpt', 'content']
    prepopulated_fields = {'slug': ('title',)}
    raw_id_fields = ['author', 'category']
    date_hierarchy = 'published_at'
    readonly_fields = ['created_at', 'updated_at', 'image_preview']
    fieldsets = (
        ('Basic Information', {
            'fields': ('title', 'slug', 'excerpt', 'content')
        }),
        ('Images', {
            'fields': ('featured_image', 'image_preview', 'featured_image_url'),
            'classes': ('wide',)
        }),
        ('Categorization', {
            'fields': ('category', 'author', 'tags')
        }),
        ('SEO', {
            'fields': ('meta_title', 'meta_description', 'read_time'),
            'classes': ('collapse',)
        }),
        ('Publishing', {
            'fields': ('featured', 'published', 'published_at', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    actions = ['make_published', 'make_unpublished', 'make_featured', 'make_unfeatured']
    
    def status_badge(self, obj):
        if obj.published:
            return format_html('<span style="background: #10b981; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: 600;">Published</span>')
        else:
            return format_html('<span style="background: #f59e0b; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: 600;">Draft</span>')
    status_badge.short_description = 'Status'
    
    def featured_badge(self, obj):
        if obj.featured:
            return format_html('<span style="background: #d97706; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: 600;">Featured</span>')
        return ''
    featured_badge.short_description = 'Featured'
    
    def image_preview(self, obj):
        if obj.featured_image:
            return format_html(
                '<img src="{}" style="width: 100px; height: 60px; object-fit: cover; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);" />',
                obj.featured_image.url
            )
        elif obj.featured_image_url:
            return format_html(
                '<img src="{}" style="width: 100px; height: 60px; object-fit: cover; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);" />',
                obj.featured_image_url
            )
        return format_html('<span style="color: #6b7280; font-style: italic;">No image</span>')
    image_preview.short_description = 'Image Preview'

    def make_published(self, request, queryset):
        queryset.update(published=True)
    make_published.short_description = "Mark selected blog posts as published"

    def make_unpublished(self, request, queryset):
        queryset.update(published=False)
    make_unpublished.short_description = "Mark selected blog posts as unpublished"

    def make_featured(self, request, queryset):
        queryset.update(featured=True)
    make_featured.short_description = "Mark selected blog posts as featured"

    def make_unfeatured(self, request, queryset):
        queryset.update(featured=False)
    make_unfeatured.short_description = "Mark selected blog posts as unfeatured"


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ['title', 'client_name', 'status_badge', 'featured_badge', 'image_preview', 'created_at']
    list_filter = ['published', 'featured', 'created_at']
    search_fields = ['title', 'description', 'client_name']
    prepopulated_fields = {'slug': ('title',)}
    readonly_fields = ['created_at', 'updated_at', 'image_preview']
    fieldsets = (
        ('Basic Information', {
            'fields': ('title', 'slug', 'description', 'content')
        }),
        ('Images', {
            'fields': ('featured_image', 'image_preview', 'featured_image_url', 'gallery_images'),
            'classes': ('wide',)
        }),
        ('Project Details', {
            'fields': ('client_name', 'project_url', 'github_url', 'technologies', 'status')
        }),
        ('Publishing', {
            'fields': ('featured', 'published', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    actions = ['make_published', 'make_unpublished', 'make_featured', 'make_unfeatured']
    
    def status_badge(self, obj):
        if obj.published:
            return format_html('<span style="background: #10b981; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: 600;">Published</span>')
        else:
            return format_html('<span style="background: #f59e0b; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: 600;">Draft</span>')
    status_badge.short_description = 'Status'
    
    def featured_badge(self, obj):
        if obj.featured:
            return format_html('<span style="background: #d97706; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: 600;">Featured</span>')
        return ''
    featured_badge.short_description = 'Featured'
    
    def image_preview(self, obj):
        if obj.featured_image:
            return format_html(
                '<img src="{}" style="width: 100px; height: 60px; object-fit: cover; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);" />',
                obj.featured_image.url
            )
        elif obj.featured_image_url:
            return format_html(
                '<img src="{}" style="width: 100px; height: 60px; object-fit: cover; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);" />',
                obj.featured_image_url
            )
        return format_html('<span style="color: #6b7280; font-style: italic;">No image</span>')
    image_preview.short_description = 'Image Preview'

    def make_published(self, request, queryset):
        queryset.update(published=True)
    make_published.short_description = "Mark selected projects as published"

    def make_unpublished(self, request, queryset):
        queryset.update(published=False)
    make_unpublished.short_description = "Mark selected projects as unpublished"

    def make_featured(self, request, queryset):
        queryset.update(featured=True)
    make_featured.short_description = "Mark selected projects as featured"

    def make_unfeatured(self, request, queryset):
        queryset.update(featured=False)
    make_unfeatured.short_description = "Mark selected projects as unfeatured"


@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ['title', 'icon', 'order_index', 'created_at']
    list_editable = ['order_index']
    search_fields = ['title', 'description']
    readonly_fields = ['created_at', 'updated_at']


@admin.register(Testimonial)
class TestimonialAdmin(admin.ModelAdmin):
    list_display = ['client_name', 'client_title', 'rating_stars', 'featured_badge', 'created_at']
    list_filter = ['rating', 'featured', 'created_at']
    search_fields = ['client_name', 'quote']
    readonly_fields = ['created_at', 'updated_at']
    actions = ['make_featured', 'make_unfeatured']
    
    def rating_stars(self, obj):
        stars = '★' * obj.rating + '☆' * (5 - obj.rating)
        return format_html('<span style="color: #f59e0b; font-size: 16px;">{}</span>', stars)
    rating_stars.short_description = 'Rating'
    
    def featured_badge(self, obj):
        if obj.featured:
            return format_html('<span style="background: #d97706; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: 600;">Featured</span>')
        return ''
    featured_badge.short_description = 'Featured'

    def make_featured(self, request, queryset):
        queryset.update(featured=True)
    make_featured.short_description = "Mark selected testimonials as featured"

    def make_unfeatured(self, request, queryset):
        queryset.update(featured=False)
    make_unfeatured.short_description = "Mark selected testimonials as unfeatured"


# Custom Admin Index View
class CustomAdminSite(admin.AdminSite):
    site_header = "Styragon Admin"
    site_title = "Styragon Admin"
    index_title = ""
    
    def index(self, request, extra_context=None):
        """
        Display the main admin index page with statistics.
        """
        # Get statistics
        stats = {
            'total_blog_posts': BlogPost.objects.count(),
            'total_projects': Project.objects.count(),
            'total_services': Service.objects.count(),
            'total_categories': Category.objects.count(),
            'total_authors': Author.objects.count(),
            'total_testimonials': Testimonial.objects.count(),
            'published_blog_posts': BlogPost.objects.filter(published=True).count(),
            'featured_blog_posts': BlogPost.objects.filter(featured=True).count(),
            'featured_projects': Project.objects.filter(featured=True).count(),
        }
        
        # Get recent blog posts
        recent_blog_posts = BlogPost.objects.select_related('author', 'category').order_by('-created_at')[:5]
        
        # Get recent projects
        recent_projects = Project.objects.select_related('category').order_by('-created_at')[:5]
        
        extra_context = extra_context or {}
        extra_context.update({
            'stats': stats,
            'recent_blog_posts': recent_blog_posts,
            'recent_projects': recent_projects,
            'total_blog_posts': stats['total_blog_posts'],
            'total_projects': stats['total_projects'],
            'total_services': stats['total_services'],
            'total_categories': stats['total_categories'],
        })
        
        return super().index(request, extra_context)

# Create custom admin site instance
admin_site = CustomAdminSite(name='luxury_admin')

# Register all models with the custom admin site
admin_site.register(Category, CategoryAdmin)
admin_site.register(Author, AuthorAdmin)
admin_site.register(BlogPost, BlogPostAdmin)
admin_site.register(Project, ProjectAdmin)
admin_site.register(Service, ServiceAdmin)
admin_site.register(Testimonial, TestimonialAdmin)
