import { PrismaClient } from '@prisma/client';

// Define interfaces for our data models
export interface NewsItem {
  id: number;
  title: string;
  content: string;
  summary?: string;
  image_url?: string;
  imageUrl?: string;
  category: string;
  created_at: string;
  updated_at: string;
  createdAt: Date;
  updatedAt: Date;
  created_at_formatted: string;
  updated_at_formatted: string;
  is_featured: boolean;
  isFeatured: boolean;
}

export interface CreateNewsData {
  title: string;
  content: string;
  summary?: string;
  image_url?: string;
  imageUrl?: string;
  category: string;
  is_featured?: boolean;
  isFeatured?: boolean;
}

// Create Prisma client instance
const prisma = new PrismaClient();

// Helper function to format dates
const formatDate = (date: Date): string => {
  return date.toISOString().slice(0, 19).replace('T', ' ');
};

// Database helper functions
export const dbHelpers = {
  // Get all news with optional search and pagination
  getAllNews: async (searchQuery: string = '', page: number = 1, limit: number = 10): Promise<NewsItem[]> => {
    const offset = (page - 1) * limit;
    
    const whereClause = searchQuery ? {
      OR: [
        { title: { contains: searchQuery, mode: 'insensitive' as const } },
        { content: { contains: searchQuery, mode: 'insensitive' as const } },
        { category: { contains: searchQuery, mode: 'insensitive' as const } }
      ]
    } : {};
    
    const news = await prisma.news.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      skip: offset,
      take: limit
    });
    
    return news.map(item => ({
      id: item.id,
      title: item.title,
      content: item.content,
      summary: item.summary || undefined, // Convert null to undefined
      image_url: item.imageUrl || undefined, // For backward compatibility, convert null to undefined
      imageUrl: item.imageUrl || undefined, // Convert null to undefined
      category: item.category,
      created_at: item.createdAt.toISOString(),
      updated_at: item.updatedAt.toISOString(),
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
      created_at_formatted: formatDate(item.createdAt),
      updated_at_formatted: formatDate(item.updatedAt),
      is_featured: item.isFeatured, // For backward compatibility
      isFeatured: item.isFeatured
    }));
  },

  // Get news by ID
  getNewsById: async (id: number): Promise<NewsItem | undefined> => {
    const news = await prisma.news.findUnique({
      where: { id }
    });
    
    if (!news) return undefined;
    
    return {
      ...news,
      image_url: news.imageUrl || undefined, // For backward compatibility
      is_featured: news.isFeatured, // For backward compatibility
      created_at: news.createdAt.toISOString(),
      updated_at: news.updatedAt.toISOString(),
      created_at_formatted: formatDate(news.createdAt),
      updated_at_formatted: formatDate(news.updatedAt)
    };
  },

  // Create new news article
  createNews: async (newsData: CreateNewsData): Promise<NewsItem & { id: number }> => {
    const { title, content, summary, imageUrl, image_url, category, isFeatured, is_featured } = newsData;
    const finalImageUrl = imageUrl || image_url;
    const finalIsFeatured = isFeatured ?? is_featured ?? false;
    
    const news = await prisma.news.create({
      data: {
        title,
        content,
        summary: summary || null,
        imageUrl: finalImageUrl || null,
        category,
        isFeatured: finalIsFeatured
      }
    });
    
    return {
      ...news,
      summary: news.summary || undefined,
      image_url: news.imageUrl || undefined,
      imageUrl: news.imageUrl || undefined,
      is_featured: news.isFeatured,
      isFeatured: news.isFeatured,
      created_at: news.createdAt.toISOString(),
      updated_at: news.updatedAt.toISOString(),
      createdAt: news.createdAt,
      updatedAt: news.updatedAt,
      created_at_formatted: formatDate(news.createdAt),
      updated_at_formatted: formatDate(news.updatedAt)
    };
  },

  // Update news article
  updateNews: async (id: number, newsData: CreateNewsData): Promise<{ changes: number }> => {
    const { title, content, summary, imageUrl, image_url, category, isFeatured, is_featured } = newsData;
    const finalImageUrl = imageUrl || image_url;
    const finalIsFeatured = isFeatured ?? is_featured ?? false;
    
    try {
      await prisma.news.update({
        where: { id },
        data: {
          title,
          content,
          summary: summary || null,
          imageUrl: finalImageUrl || null,
          category,
          isFeatured: finalIsFeatured
        }
      });
      
      return { changes: 1 };
    } catch (error) {
      return { changes: 0 };
    }
  },

  // Delete news article
  deleteNews: async (id: number): Promise<{ changes: number }> => {
    try {
      await prisma.news.delete({
        where: { id }
      });
      
      return { changes: 1 };
    } catch (error) {
      return { changes: 0 };
    }
  },

  // Get featured news
  getFeaturedNews: async (): Promise<NewsItem | null> => {
    const news = await prisma.news.findFirst({
      where: { isFeatured: true },
      orderBy: { createdAt: 'desc' }
    });
    
    if (!news) return null;
    
    return {
      ...news,
      image_url: news.imageUrl, // For backward compatibility
      is_featured: news.isFeatured, // For backward compatibility
      created_at: news.createdAt.toISOString(),
      updated_at: news.updatedAt.toISOString(),
      created_at_formatted: formatDate(news.createdAt),
      updated_at_formatted: formatDate(news.updatedAt)
    };
  },

  // Get latest news (non-featured)
  getLatestNews: async (limit: number = 10): Promise<NewsItem[]> => {
    const news = await prisma.news.findMany({
      where: { isFeatured: false },
      orderBy: { createdAt: 'desc' },
      take: limit
    });
    
    return news.map(item => ({
      ...item,
      image_url: item.imageUrl, // For backward compatibility
      is_featured: item.isFeatured, // For backward compatibility
      created_at: item.createdAt.toISOString(),
      updated_at: item.updatedAt.toISOString(),
      created_at_formatted: formatDate(item.createdAt),
      updated_at_formatted: formatDate(item.updatedAt)
    }));
  }
};

export { prisma };
export default { prisma, ...dbHelpers }; 