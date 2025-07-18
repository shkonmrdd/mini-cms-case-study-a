# Mini CMS - News Publishing System

A modern, full-stack news content management system with separate public and admin interfaces. Built entirely using AI-assisted development tools and modern web technologies.

## 📸 Preview

![Mini CMS Screenshot](docs/screenshot.jpg)

*Modern news publishing system with clean public interface and secure admin panel*

## ✨ Features

### Public Site
- 🏠 **Homepage** with featured news and latest articles grid
- 🔍 **Search functionality** across news titles, content, and categories  
- 📱 **Responsive design** with modern UI components
- 🎨 **Category-based color coding** (Community, Business, Science, Sports)

### Admin Panel  
- 🔐 **Secure authentication** via Clerk
- ✏️ **Create, edit, and delete** news articles
- 📷 **Image upload** support (JPG, PNG, GIF, WebP up to 20MB)
- ⭐ **Featured article** designation for homepage
- 📊 **Admin dashboard** with article management
- ✅ **Form validation** on both frontend and backend

## 🛠 Tech Stack

### Backend
- **Node.js** + **Express.js** + **TypeScript** - REST API server
- **Prisma ORM** + **PostgreSQL** - Database with type-safe queries  
- **Clerk** - Authentication and user management
- **Multer** - File upload handling
- **Express Validator** - Input validation
- **Bun/tsx** - Fast TypeScript runtime

### Frontend  
- **React 18** + **TypeScript** - Component-based UI
- **Vite** - Build tool and development server
- **Tailwind CSS** - Utility-first styling
- **React Router** - Client-side routing
- **React Query** - Server state management
- **React Hook Form** - Form handling
- **Clerk React** - Authentication components

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ or Bun
- PostgreSQL database
- Clerk account for authentication

### 1. Clone and Install
```bash
git clone <your-repo-url>
cd mini-cms-case-study

# Install all dependencies
npm run install:all
# or with bun (recommended)
bun run install:all:bun
```

### 2. Environment Setup

Create `.env` files:

**Backend** (`backend/.env`):
```env
DATABASE_URL="postgresql://username:password@localhost:5432/mini_cms"
CLERK_SECRET_KEY="sk_test_your_clerk_secret_key"
CLERK_PUBLISHABLE_KEY="pk_test_your_clerk_publishable_key"
NODE_ENV="development"
PORT=5001
```

**Frontend** (`frontend/.env`):
```env
VITE_CLERK_PUBLISHABLE_KEY="pk_test_your_clerk_publishable_key"
VITE_API_BASE_URL="http://localhost:5001/api"
```

### 3. Database Setup
```bash
cd backend

# Generate Prisma client
npm run db:generate

# Run database migrations
npm run db:migrate

# Seed with sample data
npm run init-db

cd ..
```

### 4. Start Development
```bash
# Start both backend and frontend
npm run dev
# or with bun
bun run dev:bun
```

**URLs:**
- Frontend: http://localhost:3049
- Backend API: http://localhost:5001
- Admin Panel: http://localhost:3049/admin

## 📚 Usage Guide

### Public Site Access
1. Visit http://localhost:3049 for the homepage
2. Use the search bar in the header to find articles
3. Click on articles to view details in a popup

### Admin Access  
1. Click "Admin" in the header or visit http://localhost:3049/admin
2. Sign in via Clerk authentication
3. Access the dashboard to manage articles

### Managing Articles
- **Create**: Click "Add News" button in admin dashboard
- **Edit**: Click edit icon in the articles table
- **Delete**: Click delete icon (with confirmation)
- **Feature**: Toggle the "Featured" checkbox to highlight on homepage

## 🔌 API Endpoints

### Public Endpoints
```
GET  /api/news              # All news with pagination & search
GET  /api/news/featured     # Featured article
GET  /api/news/latest       # Latest articles
GET  /api/news/:id          # Single article by ID
```

### Protected Endpoints (Auth Required)
```
POST   /api/news            # Create new article
PUT    /api/news/:id        # Update article
DELETE /api/news/:id        # Delete article
```

### Search & Filtering
```
GET /api/news?search=query&page=1&limit=10&category=BUSINESS
```

## 📁 Project Structure

```
mini-cms-case-study/
├── backend/                 # Express.js API server
│   ├── prisma/             # Database schema & migrations
│   ├── routes/             # API route handlers
│   ├── middleware/         # Auth & validation middleware
│   ├── database/           # Database utilities
│   ├── scripts/            # Database seeding scripts
│   └── server.ts           # Main server file
├── frontend/               # React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API client & utilities
│   │   ├── types/          # TypeScript type definitions
│   │   └── hooks/          # Custom React hooks
│   └── dist/               # Built files (production)
├── uploads/                # User-uploaded images
└── package.json            # Root workspace configuration
```

## 🔒 Authentication & Security

This application uses **Clerk** for secure authentication:

- ✅ **JWT token verification** on protected API routes
- ✅ **Frontend route protection** with React components
- ✅ **Automatic token refresh** and management
- ✅ **Production-ready** security implementation

Public routes (news viewing, search) work without authentication. Admin routes require sign-in.

## 🎨 Design Features

- **Modern UI** with Tailwind CSS components
- **Responsive layout** for mobile and desktop  
- **Category color coding** for visual organization
- **Featured article highlighting** on homepage
- **Clean admin interface** with intuitive navigation
- **Loading states and error handling**

## 🚀 Production Deployment

The project includes comprehensive deployment guides for:
- **Render.com** (recommended) - Free PostgreSQL + hosting
- **Vercel + Railway** - Optimized frontend + backend separation

See `DEPLOYMENT.md` for detailed instructions.

## 🧪 AI-Generated Code

This entire project was built using AI assistance:
- **No hand-written code** - purely AI-generated
- **Modern best practices** throughout
- **TypeScript for type safety**
- **Comprehensive validation** on both ends
- **Production-ready architecture**

## 🛠 Available Scripts

### Root Level
```bash
npm run dev              # Start both backend & frontend
npm run install:all      # Install all dependencies
npm run build           # Build frontend for production
```

### Backend Scripts
```bash
npm run dev             # Start development server
npm run db:migrate      # Run database migrations  
npm run db:studio       # Open Prisma Studio
npm run init-db         # Seed database with sample data
```

### Frontend Scripts
```bash
npm run dev             # Start Vite development server
npm run build           # Build for production
npm run preview         # Preview production build
```

## 🔧 Development Tips

### Using Bun (Recommended)
```bash
# Faster installation and runtime
bun run install:all:bun
bun run dev:bun
```

### Database Management
```bash
# Reset database completely
cd backend && npm run db:reset

# View data in browser
npm run db:studio
```

### Debugging
- Backend API logs all requests in development
- Frontend includes React Query DevTools
- Check browser console for detailed error messages

## 📋 Requirements Checklist

- ✅ **AI-generated codebase** with no manual coding
- ✅ **Separate admin and public interfaces**
- ✅ **News article CRUD operations**
- ✅ **Image upload functionality**
- ✅ **Search across articles**
- ✅ **Modern, responsive design**
- ✅ **Type-safe development** with TypeScript
- ✅ **Production-ready deployment** options
- ✅ **Secure authentication** implementation

## 🐛 Troubleshooting

### Common Issues

**Database Connection:**
- Ensure PostgreSQL is running
- Check DATABASE_URL format in backend/.env

**Authentication Errors:**
- Verify Clerk keys are set correctly
- Check that keys match between frontend and backend

**Port Conflicts:**
- Backend uses port 5001, frontend uses 3049
- Change ports in package.json scripts if needed

**File Upload Issues:**
- Check uploads/ directory permissions
- Verify file size limits (20MB max)

### Support
Check existing documentation:
- `CLERK_SETUP.md` - Authentication setup
- `DEPLOYMENT.md` - Production deployment
- `MIGRATION_TO_PRISMA.md` - Database information
