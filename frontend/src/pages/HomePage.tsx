import { useQuery } from 'react-query';
import { newsApi } from '../services/api';
import NewsCard from '../components/NewsCard';
import { NewsItem } from '../types/news';

const HomePage = () => {
  const { data: featuredNews, isLoading: featuredLoading } = useQuery<NewsItem | null>(
    'featured-news',
    newsApi.getFeatured
  );

  const { data: latestNews, isLoading: latestLoading } = useQuery<NewsItem[]>(
    'latest-news',
    () => newsApi.getLatest(4)
  );

  if (featuredLoading || latestLoading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Featured News */}
      {featuredNews && (
        <section>
          <NewsCard news={featuredNews} featured />
        </section>
      )}

      {/* Latest News Section */}
      <section>
        <h2 className="text-2xl font-bold text-orange-600 mb-6">Latest News</h2>
        
        {latestNews && latestNews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {latestNews.map((news) => (
              <NewsCard key={news.id} news={news} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600">No latest news available.</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default HomePage; 