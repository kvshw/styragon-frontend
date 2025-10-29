from django.urls import path, include
from rest_framework.routers import DefaultRouter
from django.http import JsonResponse
from . import views

def api_root(request):
    """API root endpoint that lists all available endpoints"""
    return JsonResponse({
        'message': 'Styragon CMS API',
        'version': '1.0',
        'endpoints': {
            'categories': '/api/categories/',
            'authors': '/api/authors/',
            'blog-posts': '/api/blog-posts/',
            'projects': '/api/projects/',
            'services': '/api/services/',
            'testimonials': '/api/testimonials/',
            'admin': '/admin/',
        }
    })

router = DefaultRouter()
router.register(r'categories', views.CategoryViewSet)
router.register(r'authors', views.AuthorViewSet)
router.register(r'blog-posts', views.BlogPostViewSet)
router.register(r'projects', views.ProjectViewSet)
router.register(r'services', views.ServiceViewSet)
router.register(r'testimonials', views.TestimonialViewSet)

urlpatterns = [
    path('', api_root, name='api-root'),
    path('api/', include(router.urls)),
]
