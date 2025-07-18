import axios from 'axios';
import { 
  NewsItem, 
  CreateNewsItem, 
  UpdateNewsItem, 
  ApiResponse, 
  PaginatedResponse,
  NewsSearchParams 
} from '../types/news';

// Global token fetcher function - will be set by auth hook
let getTokenFunction: (() => Promise<string | null>) | null = null;

export const setTokenGetter = (tokenGetter: (() => Promise<string | null>) | null) => {
  getTokenFunction = tokenGetter;
};

// Use environment variable for API base URL, fallback to localhost for development
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api';

// Helper function to convert relative image URLs to absolute URLs
const processImageUrl = (imageUrl: string | null | undefined): string | undefined => {
  if (!imageUrl) return undefined;
  
  // If it's already an absolute URL, return as-is
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }
  
  // If it's a relative URL starting with /uploads, make it absolute
  if (imageUrl.startsWith('/uploads/')) {
    const baseUrl = import.meta.env.VITE_API_BASE_URL 
      ? import.meta.env.VITE_API_BASE_URL.replace('/api', '')
      : 'http://localhost:5001';
    return `${baseUrl}${imageUrl}`;
  }
  
  return imageUrl;
};

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Request interceptor for logging and auth
api.interceptors.request.use(
  async (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    
    // Add auth token for protected routes
    if (getTokenFunction && (config.method === 'post' || config.method === 'put' || config.method === 'delete')) {
      try {
        const token = await getTokenFunction();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (error) {
        console.error('Failed to get auth token:', error);
      }
    }
    
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Response Error:', error);
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw error;
  }
);

export const newsApi = {
  // Get all news with optional search and pagination
  getAll: async (params?: NewsSearchParams): Promise<NewsItem[]> => {
    const response = await api.get<PaginatedResponse<NewsItem[]>>('/news', { params });
    return response.data.data.map(item => ({
      ...item,
      image_url: processImageUrl(item.image_url)
    }));
  },

  // Get single news by ID
  getById: async (id: number): Promise<NewsItem> => {
    const response = await api.get<ApiResponse<NewsItem>>(`/news/${id}`);
    return {
      ...response.data.data,
      image_url: processImageUrl(response.data.data.image_url)
    };
  },

  // Get featured news
  getFeatured: async (): Promise<NewsItem | null> => {
    const response = await api.get<ApiResponse<NewsItem | null>>('/news/featured');
    return response.data.data;
  },

  // Get latest news
  getLatest: async (limit = 4): Promise<NewsItem[]> => {
    const response = await api.get<ApiResponse<NewsItem[]>>(`/news/latest?limit=${limit}`);
    return response.data.data;
  },

  // Create new news
  create: async (newsData: CreateNewsItem): Promise<NewsItem> => {
    const formData = new FormData();
    formData.append('title', newsData.title);
    formData.append('content', newsData.content);
    formData.append('category', newsData.category);
    
    if (newsData.summary) {
      formData.append('summary', newsData.summary);
    }
    
    if (newsData.is_featured !== undefined) {
      formData.append('is_featured', newsData.is_featured.toString());
    }
    
    if (newsData.image) {
      formData.append('image', newsData.image);
    }

    const response = await api.post<ApiResponse<NewsItem>>('/news', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  },

  // Update news
  update: async (newsData: UpdateNewsItem): Promise<NewsItem> => {
    const formData = new FormData();
    formData.append('title', newsData.title);
    formData.append('content', newsData.content);
    formData.append('category', newsData.category);
    
    if (newsData.summary) {
      formData.append('summary', newsData.summary);
    }
    
    if (newsData.is_featured !== undefined) {
      formData.append('is_featured', newsData.is_featured.toString());
    }
    
    if (newsData.image) {
      formData.append('image', newsData.image);
    }

    const response = await api.put<ApiResponse<NewsItem>>(`/news/${newsData.id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  },

  // Delete news
  delete: async (id: number): Promise<void> => {
    await api.delete(`/news/${id}`);
  },

  // Search news
  search: async (query: string): Promise<NewsItem[]> => {
    return newsApi.getAll({ search: query });
  },
};

export default api; 