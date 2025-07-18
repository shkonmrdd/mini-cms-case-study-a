import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Extend Express Request type to include auth information
declare global {
  namespace Express {
    interface Request {
      auth?: {
        userId: string;
        sessionId?: string;
        getToken: () => Promise<string | null>;
      };
    }
  }
}

// Simple JWT verification middleware for Clerk tokens
export const requireAuth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        message: 'No authorization token provided'
      });
      return;
    }

    const token = authHeader.replace('Bearer ', '');
    
    if (!token) {
      res.status(401).json({
        success: false,
        message: 'Invalid token format'
      });
      return;
    }

    // For development, we'll use a simple check
    // In production, you should verify the JWT properly with Clerk's public key
    try {
      const decoded = jwt.decode(token) as any;
      
      if (!decoded || !decoded.sub) {
        res.status(401).json({
          success: false,
          message: 'Invalid token'
        });
        return;
      }

      // Add auth info to request object
      req.auth = {
        userId: decoded.sub,
        sessionId: decoded.sid || '',
        getToken: async () => token
      };

      next();
    } catch (jwtError) {
      res.status(401).json({
        success: false,
        message: 'Invalid or expired token'
      });
      return;
    }

  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({
      success: false,
      message: 'Authentication failed',
      error: process.env.NODE_ENV === 'development' ? (error as Error).message : 'Internal server error'
    });
  }
};

// Optional: Middleware to get user info (for routes that might need user context but don't require auth)
export const optionalAuth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (token) {
      try {
        const decoded = jwt.decode(token) as any;
        
        if (decoded && decoded.sub) {
          req.auth = {
            userId: decoded.sub,
            sessionId: decoded.sid || '',
            getToken: async () => token
          };
        }
      } catch (jwtError) {
        // Ignore JWT errors for optional auth
        console.warn('Optional auth JWT decode failed:', jwtError);
      }
    }
    
    next();
  } catch (error) {
    // Don't fail on optional auth errors, just continue without auth
    console.warn('Optional auth failed:', error);
    next();
  }
}; 