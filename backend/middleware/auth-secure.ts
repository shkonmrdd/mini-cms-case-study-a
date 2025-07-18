import { Request, Response, NextFunction } from 'express';
import { clerkMiddleware, getAuth } from '@clerk/express';

// This file provides a more secure alternative to the current auth middleware
// To use this secure implementation:
// 1. Add CLERK_SECRET_KEY and CLERK_PUBLISHABLE_KEY to your environment variables
// 2. Replace middleware in server.ts: import { secureClerkMiddleware } from './middleware/auth-secure';
// 3. Replace import in routes/news.ts: import { requireAuth } from '../middleware/auth-secure';
// 4. Apply secureClerkMiddleware before CORS in server.ts

// Configure Clerk middleware with proper verification
export const secureClerkMiddleware = clerkMiddleware({
  authorizedParties: process.env.NODE_ENV === 'production' 
    ? ['https://mini-cms-frontend.onrender.com']
    : ['http://localhost:3049', 'http://localhost:3000'],
  secretKey: process.env.CLERK_SECRET_KEY,
  publishableKey: process.env.CLERK_PUBLISHABLE_KEY,
});

// Secure auth middleware that properly verifies tokens with Clerk's backend
export const requireAuth = (req: Request, res: Response, next: NextFunction): void => {
  const auth = getAuth(req);
  
  if (!auth.userId) {
    res.status(401).json({
      success: false,
      message: 'Not authenticated'
    });
    return;
  }

  next();
};

// Optional auth middleware - allows both authenticated and unauthenticated requests
export const optionalAuth = (req: Request, res: Response, next: NextFunction): void => {
  // getAuth() will return auth info if available, or empty object if not
  // No additional logic needed - just continue to the next middleware
  next();
}; 