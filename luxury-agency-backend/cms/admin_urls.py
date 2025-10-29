from django.urls import path
from django.contrib.admin.views.main import ChangeList
from .admin_views import CustomAdminIndexView
from .models import BlogPost, Project, Service, Category, Author, Testimonial

urlpatterns = [
    path('', CustomAdminIndexView.as_view(), name='index'),
]

