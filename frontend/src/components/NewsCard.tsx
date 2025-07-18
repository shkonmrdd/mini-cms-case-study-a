import { format } from 'date-fns';
import { NewsItem, getCategoryStyle } from '../types/news';

interface NewsCardProps {
  news: NewsItem;
  featured?: boolean;
}

const NewsCard = ({ news, featured = false }: NewsCardProps) => {
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMMM d, yyyy');
    } catch {
      return dateString;
    }
  };

  const placeholderImage = `https://images.unsplash.com/photo-1504711434969-e33886168f5c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80`;

  if (featured) {
    return (
      <article className="card overflow-hidden">
        <div className="md:flex">
          <div className="md:w-2/3">
            <img
              src={news.image_url || placeholderImage}
              alt={news.title}
              className="w-full h-64 md:h-80 object-cover"
            />
          </div>
          <div className="md:w-1/3 p-6 flex flex-col justify-center">
            <p className="text-sm text-gray-600 mb-2">
              {formatDate(news.created_at)}
            </p>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              {news.title}
            </h1>
            <p className="text-gray-600 leading-relaxed">
              {news.summary || news.content.substring(0, 200) + '...'}
            </p>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="card overflow-hidden group">
      <div className="relative">
        <img
          src={news.image_url || placeholderImage}
          alt={news.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
        />
        <div className="absolute top-4 left-4">
          <span className={`px-3 py-1 text-xs font-medium rounded-full ${getCategoryStyle(news.category)}`}>
            {news.category}
          </span>
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
          {news.title}
        </h3>
        
        <p className="text-sm text-gray-600 mb-3">
          {formatDate(news.created_at)}
        </p>
        
        <p className="text-gray-600 text-sm leading-relaxed">
          {news.summary || news.content.substring(0, 150) + '...'}
        </p>
      </div>
    </article>
  );
};

export default NewsCard; 