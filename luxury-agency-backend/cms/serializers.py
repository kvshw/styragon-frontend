from rest_framework import serializers
from .models import Category, Author, BlogPost, Project, Service, Testimonial


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'description', 'color', 'created_at', 'updated_at']


class AuthorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Author
        fields = ['id', 'name', 'email', 'bio', 'avatar_url', 'social_links', 'created_at', 'updated_at']


class BlogPostListSerializer(serializers.ModelSerializer):
    author = AuthorSerializer(read_only=True)
    category = CategorySerializer(read_only=True)
    
    class Meta:
        model = BlogPost
        fields = [
            'id', 'title', 'slug', 'excerpt', 'featured_image', 'featured_image_url', 
            'author', 'category', 'featured', 'published', 'published_at', 
            'read_time', 'tags', 'created_at'
        ]


class BlogPostDetailSerializer(serializers.ModelSerializer):
    author = AuthorSerializer(read_only=True)
    category = CategorySerializer(read_only=True)
    
    class Meta:
        model = BlogPost
        fields = [
            'id', 'title', 'slug', 'excerpt', 'content', 'featured_image', 'featured_image_url',
            'author', 'category', 'featured', 'published', 'published_at',
            'read_time', 'meta_title', 'meta_description', 'tags',
            'created_at', 'updated_at'
        ]


class ProjectListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = [
            'id', 'title', 'slug', 'description', 'featured_image', 'featured_image_url',
            'client_name', 'status', 'featured', 'published', 'technologies',
            'start_date', 'end_date', 'created_at'
        ]


class ProjectDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = [
            'id', 'title', 'slug', 'description', 'content', 'featured_image', 'featured_image_url',
            'gallery_images', 'client_name', 'project_url', 'github_url',
            'technologies', 'status', 'featured', 'published', 'start_date',
            'end_date', 'created_at', 'updated_at'
        ]


class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = ['id', 'title', 'description', 'icon', 'order_index', 'active', 'created_at', 'updated_at']


class TestimonialSerializer(serializers.ModelSerializer):
    class Meta:
        model = Testimonial
        fields = [
            'id', 'client_name', 'client_title', 'client_company', 'client_avatar_url',
            'content', 'rating', 'featured', 'published', 'created_at', 'updated_at'
        ]
