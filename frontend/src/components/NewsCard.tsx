import { format } from 'date-fns';
import { NewsItem } from '../types/news';

interface NewsCardProps {
  news: NewsItem;
}

const NewsCard = ({ news }: NewsCardProps) => {
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMMM d, yyyy');
    } catch {
      return dateString;
    }
  };

  const getCategoryClass = (category: string) => {
    const categoryLower = category.toLowerCase();
    switch (categoryLower) {
      case 'community':
        return 'category-community';
      case 'business':
        return 'category-business';
      case 'science':
        return 'category-science';
      case 'sports':
        return 'category-sports';
      default:
        return 'category';
    }
  };

  const placeholderImage = `https://images.unsplash.com/photo-1504711434969-e33886168f5c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80`;

  return (
    <article className="card" style={{ backgroundColor: '#fff8e6' }}>
      <div  style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
              <img
          src={news.image_url || placeholderImage}
          alt={news.title}
          style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px' }}
        />
        <p className={getCategoryClass(news.category)}>
          {news.category}
        </p>
      </div>

      <div className="card-content">
        <h3 className="title line-clamp-2">{news.title}</h3>

        <p className="date">
          {formatDate(news.created_at)}
        </p>

        <p className="excerpt line-clamp-3">
          {news.summary || news.content.substring(0, 150) + '...'}
        </p>


      </div>
    </article>
  );
};

export default NewsCard; 