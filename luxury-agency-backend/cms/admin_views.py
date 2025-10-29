from django.contrib.admin.views.main import ChangeList
from django.db.models import Count
from .models import BlogPost, Project, Service, Category, Author, Testimonial


class CustomAdminIndexView(ChangeList):
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        
        # Add statistics to context
        context['total_blog_posts'] = BlogPost.objects.count()
        context['total_projects'] = Project.objects.count()
        context['total_services'] = Service.objects.count()
        context['total_categories'] = Category.objects.count()
        context['total_authors'] = Author.objects.count()
        context['total_testimonials'] = Testimonial.objects.count()
        
        # Add recent activity
        context['recent_blog_posts'] = BlogPost.objects.order_by('-created_at')[:5]
        context['recent_projects'] = Project.objects.order_by('-created_at')[:5]
        
        return context

