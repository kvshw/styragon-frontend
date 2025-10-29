#!/usr/bin/env python
import os
import sys
import django

# Add the project directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'luxury_cms.settings')
django.setup()

from cms.models import Category, Author, BlogPost, Project, Service, Testimonial
from django.contrib.auth.models import User

def create_sample_data():
    print("Creating sample data...")
    
    # Create categories
    design_cat = Category.objects.create(
        name="Design",
        slug="design",
        description="UI/UX Design and Visual Design",
        color="#f59e0b"
    )
    
    dev_cat = Category.objects.create(
        name="Development",
        slug="development", 
        description="Web Development and Software Engineering",
        color="#3b82f6"
    )
    
    # Create authors
    author1 = Author.objects.create(
        name="Sarah Chen",
        email="sarah@styragon.com",
        bio="Senior UX Designer with 8+ years of experience in luxury brand design",
        social_links={"linkedin": "https://linkedin.com/in/sarahchen"}
    )
    
    author2 = Author.objects.create(
        name="Marcus Rodriguez",
        email="marcus@styragon.com",
        bio="Lead Full-Stack Developer specializing in scalable SAAS platforms",
        social_links={"github": "https://github.com/marcusrod"}
    )
    
    # Create services
    Service.objects.create(
        title="SAAS Development",
        description="Enterprise-grade software platforms engineered for scale, performance, and seamless user experiences.",
        icon="Sparkles",
        order_index=1
    )
    
    Service.objects.create(
        title="Web Design",
        description="Sophisticated digital interfaces that marry aesthetic refinement with intuitive functionality.",
        icon="Layers",
        order_index=2
    )
    
    Service.objects.create(
        title="Custom Development",
        description="Bespoke technical solutions crafted to your unique business requirements and vision.",
        icon="Code2",
        order_index=3
    )
    
    Service.objects.create(
        title="Digital Strategy",
        description="Comprehensive roadmaps that align technology with your business objectives and growth.",
        icon="Zap",
        order_index=4
    )
    
    # Create blog posts
    BlogPost.objects.create(
        title="The Future of Luxury Digital Experiences",
        slug="future-luxury-digital-experiences",
        excerpt="Exploring how luxury brands are transforming their digital presence to meet evolving consumer expectations.",
        content="In today's digital landscape, luxury brands face unique challenges in maintaining their exclusivity while embracing digital transformation...",
        category=design_cat,
        author=author1,
        featured=True,
        published=True,
        tags=["luxury", "digital", "ux", "branding"]
    )
    
    BlogPost.objects.create(
        title="Building Scalable SAAS Architecture",
        slug="building-scalable-saas-architecture",
        excerpt="Best practices for creating robust, scalable software-as-a-service platforms that can grow with your business.",
        content="When building a SAAS platform, architecture decisions made early can significantly impact your ability to scale...",
        category=dev_cat,
        author=author2,
        featured=True,
        published=True,
        tags=["saas", "architecture", "scalability", "development"]
    )
    
    # Create projects
    Project.objects.create(
        title="Luxury Fashion E-commerce Platform",
        slug="luxury-fashion-ecommerce",
        description="A sophisticated e-commerce platform for a high-end fashion brand featuring advanced personalization and AR try-on capabilities.",
        content="This project involved creating a comprehensive e-commerce solution that combines luxury aesthetics with cutting-edge technology...",
        client_name="Elegance Couture",
        technologies=["Next.js", "TypeScript", "Stripe", "AR.js"],
        status="completed",
        featured=True,
        published=True
    )
    
    Project.objects.create(
        title="Financial Analytics Dashboard",
        slug="financial-analytics-dashboard",
        description="A comprehensive financial analytics platform for investment firms with real-time data visualization and reporting capabilities.",
        content="Built for a leading investment firm, this dashboard provides real-time insights into market trends and portfolio performance...",
        client_name="Capital Partners",
        technologies=["React", "D3.js", "Python", "PostgreSQL"],
        status="completed",
        featured=True,
        published=True
    )
    
    # Create testimonials
    Testimonial.objects.create(
        client_name="Jennifer Walsh",
        client_title="CEO",
        client_company="Elegance Couture",
        content="Styragon transformed our digital presence completely. The new platform not only looks stunning but has increased our online sales by 300%.",
        rating=5,
        featured=True,
        published=True
    )
    
    Testimonial.objects.create(
        client_name="David Kim",
        client_title="CTO",
        client_company="Capital Partners",
        content="The analytics dashboard they built for us is exceptional. It's intuitive, powerful, and has become an essential tool for our investment decisions.",
        rating=5,
        featured=True,
        published=True
    )
    
    print("Sample data created successfully!")

if __name__ == "__main__":
    create_sample_data()
