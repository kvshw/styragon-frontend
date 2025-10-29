from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q
from .models import Category, Author, BlogPost, Project, Service, Testimonial
from .serializers import (
    CategorySerializer, AuthorSerializer, BlogPostListSerializer, BlogPostDetailSerializer,
    ProjectListSerializer, ProjectDetailSerializer, ServiceSerializer, TestimonialSerializer
)


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    lookup_field = 'slug'
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'description']
    ordering_fields = ['name', 'created_at']
    ordering = ['name']


class AuthorViewSet(viewsets.ModelViewSet):
    queryset = Author.objects.all()
    serializer_class = AuthorSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'email', 'bio']
    ordering_fields = ['name', 'created_at']
    ordering = ['name']


class BlogPostViewSet(viewsets.ModelViewSet):
    queryset = BlogPost.objects.select_related('author', 'category').all()
    lookup_field = 'slug'
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['published', 'featured', 'category', 'author']
    search_fields = ['title', 'excerpt', 'content', 'tags']
    ordering_fields = ['created_at', 'published_at', 'title']
    ordering = ['-published_at', '-created_at']

    def get_serializer_class(self):
        if self.action == 'list':
            return BlogPostListSerializer
        return BlogPostDetailSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        # Only show published posts for non-admin users
        if not self.request.user.is_staff:
            queryset = queryset.filter(published=True)
        return queryset

    @action(detail=False, methods=['get'])
    def featured(self, request):
        """Get featured blog posts"""
        featured_posts = self.get_queryset().filter(featured=True, published=True)
        serializer = self.get_serializer(featured_posts, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def by_category(self, request):
        """Get blog posts by category slug"""
        category_slug = request.query_params.get('category')
        if category_slug:
            posts = self.get_queryset().filter(category__slug=category_slug, published=True)
            serializer = self.get_serializer(posts, many=True)
            return Response(serializer.data)
        return Response({'error': 'Category slug required'}, status=status.HTTP_400_BAD_REQUEST)


class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    lookup_field = 'slug'
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['published', 'featured', 'status']
    search_fields = ['title', 'description', 'client_name', 'technologies']
    ordering_fields = ['created_at', 'title']
    ordering = ['-created_at']

    def get_serializer_class(self):
        if self.action == 'list':
            return ProjectListSerializer
        return ProjectDetailSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        # Only show published projects for non-admin users
        if not self.request.user.is_staff:
            queryset = queryset.filter(published=True)
        return queryset

    @action(detail=False, methods=['get'])
    def featured(self, request):
        """Get featured projects"""
        featured_projects = self.get_queryset().filter(featured=True, published=True)
        serializer = self.get_serializer(featured_projects, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def by_status(self, request):
        """Get projects by status"""
        status_filter = request.query_params.get('status')
        if status_filter:
            projects = self.get_queryset().filter(status=status_filter, published=True)
            serializer = self.get_serializer(projects, many=True)
            return Response(serializer.data)
        return Response({'error': 'Status required'}, status=status.HTTP_400_BAD_REQUEST)


class ServiceViewSet(viewsets.ModelViewSet):
    queryset = Service.objects.filter(active=True)
    serializer_class = ServiceSerializer
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['order_index', 'title']
    ordering = ['order_index', 'title']


class TestimonialViewSet(viewsets.ModelViewSet):
    queryset = Testimonial.objects.all()
    serializer_class = TestimonialSerializer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['published', 'featured', 'rating']
    ordering_fields = ['created_at', 'rating']
    ordering = ['-created_at']

    def get_queryset(self):
        queryset = super().get_queryset()
        # Only show published testimonials for non-admin users
        if not self.request.user.is_staff:
            queryset = queryset.filter(published=True)
        return queryset

    @action(detail=False, methods=['get'])
    def featured(self, request):
        """Get featured testimonials"""
        featured_testimonials = self.get_queryset().filter(featured=True, published=True)
        serializer = self.get_serializer(featured_testimonials, many=True)
        return Response(serializer.data)