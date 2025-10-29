from django.core.management.base import BaseCommand
from django.conf import settings
import requests
import json
from cms.models import Category, Author, BlogPost, Project, Service, Testimonial


class Command(BaseCommand):
    help = 'Sync data from Supabase to Django models'

    def add_arguments(self, parser):
        parser.add_argument(
            '--tables',
            nargs='+',
            default=['categories', 'authors', 'blog_posts', 'projects', 'services', 'testimonials'],
            help='Tables to sync from Supabase'
        )

    def handle(self, *args, **options):
        supabase_url = settings.SUPABASE_URL
        supabase_key = settings.SUPABASE_ANON_KEY
        
        if not supabase_url or not supabase_key:
            self.stdout.write(
                self.style.ERROR('Supabase URL and key must be configured in settings')
            )
            return

        tables = options['tables']
        
        for table in tables:
            self.stdout.write(f'Syncing {table}...')
            try:
                self.sync_table(table, supabase_url, supabase_key)
                self.stdout.write(
                    self.style.SUCCESS(f'Successfully synced {table}')
                )
            except Exception as e:
                self.stdout.write(
                    self.style.ERROR(f'Error syncing {table}: {str(e)}')
                )

    def sync_table(self, table_name, supabase_url, supabase_key):
        url = f"{supabase_url}/rest/v1/{table_name}"
        headers = {
            'apikey': supabase_key,
            'Authorization': f'Bearer {supabase_key}',
            'Content-Type': 'application/json'
        }
        
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        data = response.json()
        
        if table_name == 'categories':
            self.sync_categories(data)
        elif table_name == 'authors':
            self.sync_authors(data)
        elif table_name == 'blog_posts':
            self.sync_blog_posts(data)
        elif table_name == 'projects':
            self.sync_projects(data)
        elif table_name == 'services':
            self.sync_services(data)
        elif table_name == 'testimonials':
            self.sync_testimonials(data)

    def sync_categories(self, data):
        for item in data:
            Category.objects.update_or_create(
                id=item['id'],
                defaults={
                    'name': item['name'],
                    'slug': item['slug'],
                    'description': item.get('description'),
                    'color': item.get('color', '#f59e0b'),
                }
            )

    def sync_authors(self, data):
        for item in data:
            Author.objects.update_or_create(
                id=item['id'],
                defaults={
                    'name': item['name'],
                    'email': item['email'],
                    'bio': item.get('bio'),
                    'avatar_url': item.get('avatar_url'),
                    'social_links': item.get('social_links', {}),
                }
            )

    def sync_blog_posts(self, data):
        for item in data:
            category = None
            if item.get('category_id'):
                try:
                    category = Category.objects.get(id=item['category_id'])
                except Category.DoesNotExist:
                    pass
            
            author = None
            if item.get('author_id'):
                try:
                    author = Author.objects.get(id=item['author_id'])
                except Author.DoesNotExist:
                    pass

            BlogPost.objects.update_or_create(
                id=item['id'],
                defaults={
                    'title': item['title'],
                    'slug': item['slug'],
                    'excerpt': item.get('excerpt'),
                    'content': item['content'],
                    'featured_image_url': item.get('featured_image_url'),
                    'category': category,
                    'author': author,
                    'featured': item.get('featured', False),
                    'published': item.get('published', False),
                    'published_at': item.get('published_at'),
                    'read_time': item.get('read_time', 5),
                    'meta_title': item.get('meta_title'),
                    'meta_description': item.get('meta_description'),
                    'tags': item.get('tags', []),
                }
            )

    def sync_projects(self, data):
        for item in data:
            Project.objects.update_or_create(
                id=item['id'],
                defaults={
                    'title': item['title'],
                    'slug': item['slug'],
                    'description': item.get('description'),
                    'content': item.get('content'),
                    'featured_image_url': item.get('featured_image_url'),
                    'gallery_images': item.get('gallery_images', []),
                    'client_name': item.get('client_name'),
                    'project_url': item.get('project_url'),
                    'github_url': item.get('github_url'),
                    'technologies': item.get('technologies', []),
                    'status': item.get('status', 'completed'),
                    'featured': item.get('featured', False),
                    'published': item.get('published', False),
                    'start_date': item.get('start_date'),
                    'end_date': item.get('end_date'),
                }
            )

    def sync_services(self, data):
        for item in data:
            Service.objects.update_or_create(
                id=item['id'],
                defaults={
                    'title': item['title'],
                    'description': item['description'],
                    'icon': item.get('icon'),
                    'order_index': item.get('order_index', 0),
                    'active': item.get('active', True),
                }
            )

    def sync_testimonials(self, data):
        for item in data:
            Testimonial.objects.update_or_create(
                id=item['id'],
                defaults={
                    'client_name': item['client_name'],
                    'client_title': item.get('client_title'),
                    'client_company': item.get('client_company'),
                    'client_avatar_url': item.get('client_avatar_url'),
                    'content': item['content'],
                    'rating': item.get('rating', 5),
                    'featured': item.get('featured', False),
                    'published': item.get('published', False),
                }
            )
