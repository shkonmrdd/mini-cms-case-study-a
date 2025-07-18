import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import path from 'path';
import { body, validationResult } from 'express-validator';
import multer, { StorageEngine } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { clerkMiddleware } from '@clerk/express';

// Import database and routes
import db from './database/database';
import newsRoutes from './routes/news';

const app: Application = express();
const PORT: number = process.env.PORT ? parseInt(process.env.PORT) : 5001;

// Secure Clerk middleware - MUST come first to properly verify JWT tokens
app.use(clerkMiddleware({
  secretKey: process.env.CLERK_SECRET_KEY,
  publishableKey: process.env.CLERK_PUBLISHABLE_KEY,
  authorizedParties: process.env.NODE_ENV === 'production' 
    ? ['https://mini-cms-frontend.onrender.com']
    : ['http://localhost:3049', 'http://localhost:3000'],
}));

// CORS middleware
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://mini-cms-frontend.onrender.com', 'https://mini-cms-case-study.onrender.com']
    : ['http://localhost:3049', 'http://localhost:3000'],
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Create uploads directory if it doesn't exist (production-safe)
const uploadsDir = path.join(__dirname, '../uploads');
try {
  if (!require('fs').existsSync(uploadsDir)) {
    require('fs').mkdirSync(uploadsDir, { recursive: true });
  }
} catch (error) {
  console.warn('Could not create uploads directory:', error);
}

// Serve uploaded images
app.use('/uploads', express.static(uploadsDir));

// Configure multer for file uploads with production-safe settings
const storage: StorageEngine = process.env.NODE_ENV === 'production' 
  ? multer.memoryStorage() // Use memory storage for production
  : multer.diskStorage({
      destination: (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
        cb(null, uploadsDir);
      },
      filename: (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
        const uniqueName = uuidv4() + path.extname(file.originalname);
        cb(null, uniqueName);
      }
    });

const upload = multer({
  storage: storage,
  limits: {
    fileSize: process.env.NODE_ENV === 'production' ? 20 * 1024 * 1024 : 20 * 1024 * 1024 // 2MB for production, 5MB for dev
  },
  fileFilter: (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Make upload middleware available
app.locals.upload = upload;

// Add request logging for debugging
app.use((req: Request, res: Response, next: NextFunction) => {
  if (req.method !== 'GET') {
    console.log(`${req.method} ${req.path} - Content-Type: ${req.headers['content-type']} - Size: ${req.headers['content-length']}`);
  }
  next();
});

// Routes
app.use('/api/news', newsRoutes);

// Health check endpoint for Render.com
app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req: Request, res: Response) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
}); 