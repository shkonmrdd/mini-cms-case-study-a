export interface NewsItem {
  id: number;
  title: string;
  content: string;
  summary?: string;
  image_url?: string;
  category: string;
  created_at: string;
  updated_at: string;
  created_at_formatted: string;
  updated_at_formatted: string;
  is_featured: boolean;
}

export interface CreateNewsItem {
  title: string;
  content: string;
  summary?: string;
  category: string;
  is_featured?: boolean;
  image?: File;
}

export interface UpdateNewsItem extends CreateNewsItem {
  id: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T> {
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
}

export interface NewsSearchParams {
  search?: string;
  page?: number;
  limit?: number;
}

export type NewsCategory = 'COMMUNITY' | 'BUSINESS' | 'SCIENCE' | 'SPORTS';

export const NEWS_CATEGORIES: NewsCategory[] = ['COMMUNITY', 'BUSINESS', 'SCIENCE', 'SPORTS'];

export const getCategoryStyle = (category: string): string => {
  switch (category.toUpperCase()) {
    case 'COMMUNITY':
      return 'category-community';
    case 'BUSINESS':
      return 'category-business';
    case 'SCIENCE':
      return 'category-science';
    case 'SPORTS':
      return 'category-sports';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}; 