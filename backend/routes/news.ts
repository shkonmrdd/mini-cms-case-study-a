import express, { Request, Response, NextFunction, RequestHandler } from 'express';
import { body, validationResult } from 'express-validator';
import { dbHelpers } from '../database/database';

const { 
  getAllNews, 
  getNewsById, 
  createNews, 
  updateNews, 
  deleteNews, 
  getFeaturedNews, 
  getLatestNews 
} = dbHelpers;

const router = express.Router();

// Define interfaces for request bodies
interface CreateNewsBody {
  title: string;
  content: string;
  summary?: string;
  category: string;
  is_featured?: string | boolean;
}

interface SearchQuery {
  search?: string;
  page?: string;
  limit?: string;
}

// Validation rules
const newsValidation = [
  body('title').notEmpty().withMessage('Title is required').isLength({ max: 255 }).withMessage('Title too long'),
  body('content').notEmpty().withMessage('Content is required'),
  body('category').notEmpty().withMessage('Category is required'),
  body('summary').optional().isLength({ max: 500 }).withMessage('Summary too long'),
  body('is_featured').optional().isBoolean().withMessage('Featured must be boolean')
];

// Helper function to handle validation errors
const handleValidationErrors: RequestHandler = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      success: false,
      message: 'Validation errors',
      errors: errors.array()
    });
    return;
  }
  next();
};

// GET /api/news - Get all news with optional search and pagination
router.get('/', async (req: Request<{}, any, {}, SearchQuery>, res: Response) => {
  try {
    const { search = '', page = '1', limit = '10' } = req.query;
    const news = await getAllNews(search, parseInt(page), parseInt(limit));
    
    res.json({
      success: true,
      data: news,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: news.length
      }
    });
  } catch (error) {
    console.error('Error fetching news:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching news',
      error: (error as Error).message
    });
  }
});

// GET /api/news/featured - Get featured news
router.get('/featured', async (req: Request, res: Response) => {
  try {
    const featuredNews = await getFeaturedNews();
    res.json({
      success: true,
      data: featuredNews
    });
  } catch (error) {
    console.error('Error fetching featured news:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching featured news',
      error: (error as Error).message
    });
  }
});

// GET /api/news/latest - Get latest news
router.get('/latest', async (req: Request<{}, any, {}, { limit?: string }>, res: Response) => {
  try {
    const { limit = '4' } = req.query;
    const latestNews = await getLatestNews(parseInt(limit));
    res.json({
      success: true,
      data: latestNews
    });
  } catch (error) {
    console.error('Error fetching latest news:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching latest news',
      error: (error as Error).message
    });
  }
});

// GET /api/news/:id - Get single news article
router.get('/:id', async (req: Request<{ id: string }>, res: Response) => {
  try {
    const { id } = req.params;
    const news = await getNewsById(Number(id));
    
    if (!news) {
      res.status(404).json({
        success: false,
        message: 'News article not found'
      });
      return;
    }
    
    res.json({
      success: true,
      data: news
    });
  } catch (error) {
    console.error('Error fetching news:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching news',
      error: (error as Error).message
    });
  }
});

// POST /api/news - Create new news article
router.post('/', async (req: Request<{}, any, CreateNewsBody>, res: Response) => {
  try {
    const upload = (req.app as any).locals.upload;
    
    // Handle file upload first
    upload.single('image')(req, res, async (err: any) => {
      if (err) {
        res.status(400).json({
          success: false,
          message: 'File upload error',
          error: err.message
        });
        return;
      }
      
      // Now validate the form data after multer has processed it
      const validationErrors = [];
      
      if (!req.body.title || req.body.title.trim() === '') {
        validationErrors.push({
          type: 'field',
          msg: 'Title is required',
          path: 'title',
          location: 'body'
        });
      }
      
      if (!req.body.content || req.body.content.trim() === '') {
        validationErrors.push({
          type: 'field',
          msg: 'Content is required',
          path: 'content',
          location: 'body'
        });
      }
      
      if (!req.body.category || req.body.category.trim() === '') {
        validationErrors.push({
          type: 'field',
          msg: 'Category is required',
          path: 'category',
          location: 'body'
        });
      }
      
      if (req.body.title && req.body.title.length > 255) {
        validationErrors.push({
          type: 'field',
          msg: 'Title too long',
          path: 'title',
          location: 'body'
        });
      }
      
      if (req.body.summary && req.body.summary.length > 500) {
        validationErrors.push({
          type: 'field',
          msg: 'Summary too long',
          path: 'summary',
          location: 'body'
        });
      }
      
      if (validationErrors.length > 0) {
        res.status(400).json({
          success: false,
          message: 'Validation errors',
          errors: validationErrors
        });
        return;
      }
      
      const newsData = {
        title: req.body.title,
        content: req.body.content,
        summary: req.body.summary || '',
        category: req.body.category,
        is_featured: req.body.is_featured === 'true' || req.body.is_featured === true,
        image_url: (req as any).file ? `/uploads/${(req as any).file.filename}` : undefined
      };
      
      const createdNews = await createNews(newsData);
      
      res.status(201).json({
        success: true,
        message: 'News article created successfully',
        data: createdNews
      });
    });
  } catch (error) {
    console.error('Error creating news:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating news',
      error: (error as Error).message
    });
  }
});

// PUT /api/news/:id - Update news article
router.put('/:id', async (req: Request<{ id: string }, any, CreateNewsBody>, res: Response) => {
  try {
    const { id } = req.params;
    const upload = (req.app as any).locals.upload;
    
    // Check if news exists
    const existingNews = await getNewsById(Number(id));
    if (!existingNews) {
      res.status(404).json({
        success: false,
        message: 'News article not found'
      });
      return;
    }
    
    // Handle file upload first
    upload.single('image')(req, res, async (err: any) => {
      if (err) {
        res.status(400).json({
          success: false,
          message: 'File upload error',
          error: err.message
        });
        return;
      }
      
      // Now validate the form data after multer has processed it
      const validationErrors = [];
      
      if (!req.body.title || req.body.title.trim() === '') {
        validationErrors.push({
          type: 'field',
          msg: 'Title is required',
          path: 'title',
          location: 'body'
        });
      }
      
      if (!req.body.content || req.body.content.trim() === '') {
        validationErrors.push({
          type: 'field',
          msg: 'Content is required',
          path: 'content',
          location: 'body'
        });
      }
      
      if (!req.body.category || req.body.category.trim() === '') {
        validationErrors.push({
          type: 'field',
          msg: 'Category is required',
          path: 'category',
          location: 'body'
        });
      }
      
      if (req.body.title && req.body.title.length > 255) {
        validationErrors.push({
          type: 'field',
          msg: 'Title too long',
          path: 'title',
          location: 'body'
        });
      }
      
      if (req.body.summary && req.body.summary.length > 500) {
        validationErrors.push({
          type: 'field',
          msg: 'Summary too long',
          path: 'summary',
          location: 'body'
        });
      }
      
      if (validationErrors.length > 0) {
        res.status(400).json({
          success: false,
          message: 'Validation errors',
          errors: validationErrors
        });
        return;
      }
      
      const newsData = {
        title: req.body.title,
        content: req.body.content,
        summary: req.body.summary || '',
        category: req.body.category,
        is_featured: req.body.is_featured === 'true' || req.body.is_featured === true,
        image_url: (req as any).file ? `/uploads/${(req as any).file.filename}` : existingNews.image_url
      };
      
      await updateNews(Number(id), newsData);
      const updatedNews = await getNewsById(Number(id));
      
      res.json({
        success: true,
        message: 'News article updated successfully',
        data: updatedNews
      });
    });
  } catch (error) {
    console.error('Error updating news:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating news',
      error: (error as Error).message
    });
  }
});

// DELETE /api/news/:id - Delete news article
router.delete('/:id', async (req: Request<{ id: string }>, res: Response) => {
  try {
    const { id } = req.params;
    
    // Check if news exists
    const existingNews = await getNewsById(Number(id));
    if (!existingNews) {
      res.status(404).json({
        success: false,
        message: 'News article not found'
      });
      return;
    }
    
    const result = await deleteNews(Number(id));
    
    if (result.changes > 0) {
      res.json({
        success: true,
        message: 'News article deleted successfully'
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'News article not found'
      });
    }
  } catch (error) {
    console.error('Error deleting news:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting news',
      error: (error as Error).message
    });
  }
});

export default router; 