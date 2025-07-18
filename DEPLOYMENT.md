# Deployment Guide

This guide covers deployment options for the Mini CMS application.

## Option 1: Render.com (Recommended) ⭐

**Best for**: Full-stack applications with database
**Cost**: Free tier available for both frontend and backend

### Why Render.com?
- ✅ Free PostgreSQL database (500MB)
- ✅ Both frontend and backend on one platform
- ✅ Automatic deployments from Git
- ✅ Easy environment variable management
- ✅ Built-in health checks

### Prerequisites
1. Push your code to GitHub/GitLab
2. Create a [Render.com](https://render.com) account

### Step 1: Deploy Database
1. In Render dashboard, click "New" → "PostgreSQL"
2. Name: `mini-cms-db`
3. Database Name: `mini_cms`
4. User: `mini_cms_user`
5. Plan: Free
6. Click "Create Database"
7. **Save the Database URL** for later

### Step 2: Deploy Backend
1. Click "New" → "Web Service"
2. Connect your repository
3. Configuration:
   - **Name**: `mini-cms-backend`
   - **Environment**: Node
   - **Build Command**: `cd backend && npm install && npm run db:generate`
   - **Start Command**: `cd backend && npm run db:deploy && npm start`
   - **Plan**: Free

4. Environment Variables:
   ```
   DATABASE_URL=<your-database-url-from-step-1>
   CLERK_SECRET_KEY=<your-clerk-secret-key>
   CLERK_PUBLISHABLE_KEY=<your-clerk-publishable-key>
   NODE_ENV=production
   ```

### Step 3: Deploy Frontend
1. Click "New" → "Static Site"
2. Connect your repository
3. Configuration:
   - **Name**: `mini-cms-frontend`
   - **Build Command**: `cd frontend && npm install && npm run build`
   - **Publish Directory**: `frontend/dist`

4. Environment Variables:
   ```
   VITE_API_BASE_URL=https://mini-cms-case-study.onrender.com/api
   VITE_CLERK_PUBLISHABLE_KEY=<your-clerk-key>
   ```

### Step 4: Update CORS (Important!)
Your backend is already configured for production CORS. Make sure your Render URLs match:
- Frontend URL: `https://mini-cms-frontend.onrender.com`
- Backend URL: `https://mini-cms-case-study.onrender.com`

---

## Option 2: Vercel + Railway

**Best for**: Optimized frontend with separate backend hosting
**Cost**: Free frontend, backend hosting varies

### Frontend on Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. In frontend directory: `vercel`
3. Follow prompts
4. Set environment variables in Vercel dashboard:
   ```
   VITE_API_BASE_URL=https://your-backend-url.railway.app/api
   VITE_CLERK_PUBLISHABLE_KEY=<your-clerk-key>
   ```

### Backend on Railway
1. Go to [Railway.app](https://railway.app)
2. Deploy from GitHub
3. Add PostgreSQL database
4. Set environment variables similar to Render setup

---

## ✅ Security: Secure Authentication Implemented

Your application now uses **secure authentication** with proper JWT verification:

### 🔒 **Current Implementation (Secure)** 
- ✅ **Properly verifies tokens** with Clerk's backend SDK
- ✅ **Maximum security** against token forgery attacks  
- ✅ **Production-ready** with full JWT validation
- ✅ **Environment variables required**: `CLERK_SECRET_KEY` and `CLERK_PUBLISHABLE_KEY`

### **How It Works**
1. **Global Middleware**: `clerkMiddleware()` in `server.ts` validates all incoming requests
2. **Route Protection**: `getAuth()` verifies user authentication on protected routes
3. **Proper Verification**: Uses Clerk's backend SDK for authentic token validation

**Your application is now secure and ready for production! 🎉**

---

## File Upload Configuration

### For Production
Update your backend to handle file uploads in production:

```typescript
// In server.ts - already configured
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueName = uuidv4() + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});
```

⚠️ **Note**: File uploads on free hosting have limitations. For production, consider:
- AWS S3 + CloudFront
- Cloudinary
- UploadThing

---

## Environment Variables Checklist

### Backend (.env)
```
DATABASE_URL=postgresql://username:password@host:port/database
CLERK_SECRET_KEY=sk_test_...
CLERK_PUBLISHABLE_KEY=pk_test_...
NODE_ENV=production
PORT=10000
```

### Frontend
```
VITE_API_BASE_URL=https://your-backend-url.com/api
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
```

---

## Deployment Commands

### Local Build Test
```bash
# Backend
cd backend
npm run build  # if you add a build script
npm start

# Frontend
cd frontend
npm run build
npm run preview
```

### Manual Deployment
```bash
# Using render.yaml (place in project root)
git add .
git commit -m "Deploy to production"
git push origin main
```

---

## Troubleshooting

### Common Issues
1. **Database Connection**: Ensure DATABASE_URL is correct
2. **CORS Errors**: Check frontend/backend URLs in CORS config
3. **Build Failures**: Check Node version compatibility
4. **File Uploads**: Verify upload directory permissions

### Health Checks
- Backend: `https://your-backend-url.com/api/health`
- Frontend: Check console for API connection errors

---

## Cost Breakdown

### Render.com (Free Tier)
- Frontend: Free
- Backend: Free (sleeps after 15min inactivity)
- Database: Free (500MB limit)
- **Total: $0/month**

### Vercel + Railway
- Frontend: Free (generous limits)
- Backend: $5/month (Railway)
- Database: $5/month (Railway PostgreSQL)
- **Total: ~$10/month**

---

## Production Checklist

- [ ] Environment variables configured
- [ ] Database migrations run
- [ ] CORS properly configured  
- [ ] Health check endpoint working
- [ ] File uploads tested
- [ ] SSL certificates (automatic on both platforms)
- [ ] Custom domain configured (optional)

---

## Next Steps

1. **Monitoring**: Set up error tracking (Sentry)
2. **Analytics**: Add Google Analytics or similar
3. **CDN**: Configure for better performance
4. **Backup**: Set up automated database backups 