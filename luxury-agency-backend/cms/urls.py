from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'categories', views.CategoryViewSet)
router.register(r'authors', views.AuthorViewSet)
router.register(r'blog-posts', views.BlogPostViewSet)
router.register(r'projects', views.ProjectViewSet)
router.register(r'services', views.ServiceViewSet)
router.register(r'testimonials', views.TestimonialViewSet)

urlpatterns = [
    path('api/', include(router.urls)),
]
