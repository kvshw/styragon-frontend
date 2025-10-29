# Styragon Backend Deployment Guide

## 🚀 Quick Deploy to Railway (Recommended)

### Step 1: Push to GitHub
```bash
cd luxury-agency-backend
git init
git add .
git commit -m "Initial commit: Django backend for Styragon"
git branch -M main
git remote add origin https://github.com/kvshw/styragon-backend.git
git push -u origin main
```

### Step 2: Deploy to Railway
1. Go to https://railway.app
2. Sign in with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select `kvshw/styragon-backend`
5. Railway will automatically detect Django and deploy

### Step 3: Configure Environment Variables
In Railway dashboard, add these environment variables:
```
DEBUG=False
SECRET_KEY=your-secret-key-here
ALLOWED_HOSTS=your-app.railway.app
DATABASE_URL=postgresql://... (Railway provides this)
```

### Step 4: Run Migrations
In Railway dashboard → Deployments → View Logs:
```bash
python manage.py migrate
python manage.py collectstatic --noinput
python manage.py createsuperuser
```

## 🚀 Alternative: Deploy to Heroku

### Step 1: Install Heroku CLI
Download from: https://devcenter.heroku.com/articles/heroku-cli

### Step 2: Deploy
```bash
heroku login
heroku create styragon-backend
git push heroku main
heroku run python manage.py migrate
heroku run python manage.py createsuperuser
```

## 🔧 Environment Variables

Required environment variables:
- `SECRET_KEY`: Django secret key
- `DEBUG`: Set to `False` for production
- `ALLOWED_HOSTS`: Comma-separated list of allowed hosts
- `DATABASE_URL`: Database connection string (provided by hosting platform)

## 📝 Admin Access

After deployment, access the admin at:
`https://your-backend-url.com/admin`

Create a superuser to manage content:
```bash
python manage.py createsuperuser
```

## 🔗 API Endpoints

- API Root: `https://your-backend-url.com/api/`
- Admin: `https://your-backend-url.com/admin/`
- Blog Posts: `https://your-backend-url.com/api/blog-posts/`
- Projects: `https://your-backend-url.com/api/projects/`
- Services: `https://your-backend-url.com/api/services/`
