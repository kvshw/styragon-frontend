# Styragon Frontend

Luxury agency website frontend built with Next.js and TypeScript.

## Features

- Modern React/Next.js application
- TypeScript for type safety
- Tailwind CSS for styling
- Responsive design
- API integration with Django backend

## Development

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Setup

1. Install dependencies:
```bash
npm install --legacy-peer-deps
```

2. Create environment file:
```bash
cp .env.local.example .env.local
```

3. Update `.env.local` with your backend API URL:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

4. Start development server:
```bash
npm run dev
```

Visit `http://localhost:3000`

## Deployment (Vercel)

1. Connect this repository to Vercel
2. Set environment variable:
   - `NEXT_PUBLIC_API_URL` = `https://your-backend.up.railway.app/api`
3. Deploy

## API Integration

The frontend connects to the Django backend API for:
- Blog posts
- Projects
- Services  
- Testimonials
- Categories
- Authors

## Project Structure

```
├── app/                 # Next.js app directory
├── components/          # React components
├── lib/                # Utilities and API client
├── public/             # Static assets
└── styles/             # Global styles
```

