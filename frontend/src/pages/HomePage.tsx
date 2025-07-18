import { useQuery } from 'react-query';
import { useState } from 'react';
import { newsApi } from '../services/api';
import NewsCard from '../components/NewsCard';
import NewsPopup from '../components/NewsPopup';
import { NewsItem } from '../types/news';

const HomePage = () => {
  const [featuredPopupOpen, setFeaturedPopupOpen] = useState(false);

  const { data: featuredNews, isLoading: featuredLoading } = useQuery<NewsItem | null>(
    'featured-news',
    newsApi.getFeatured
  );

  const { data: latestNews, isLoading: latestLoading } = useQuery<NewsItem[]>(
    'latest-news',
    () => newsApi.getLatest(10)
  );

  const openFeaturedPopup = () => setFeaturedPopupOpen(true);
  const closeFeaturedPopup = () => setFeaturedPopupOpen(false);

  if (featuredLoading || latestLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '256px' 
      }}>
        <div style={{
          width: '48px',
          height: '48px',
          border: '2px solid var(--border)',
          borderTop: '2px solid var(--primary)',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
      </div>
    );
  }

  return (
    <div>
      {/* Featured News */}
      {featuredNews && (
        <article 
          className="hero" 
          style={{ cursor: "pointer" }}
          onClick={openFeaturedPopup}
        >
          <h1>{featuredNews.title}</h1>
          <img
            src={featuredNews.image_url || `https://images.unsplash.com/photo-1504711434969-e33886168f5c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80`}
            alt={featuredNews.title}
          />
          <p className="date">
            {new Date(featuredNews.created_at).toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
          <p className="excerpt">
            {featuredNews.summary || featuredNews.content.substring(0, 240) + '...'}
          </p>
        </article>
      )}

      {/* Latest News Section */}
      <section>
        <h2 className="section">Latest News</h2>
        
        {latestNews && latestNews.length > 0 ? (
          <div className="cards">
            {latestNews.map((news) => (
              <NewsCard key={news.id} news={news} />
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '48px 0' }}>
            <p style={{ color: 'var(--muted)' }}>No latest news available.</p>
          </div>
        )}
      </section>

      {/* Featured News Popup */}
      {featuredNews && (
        <NewsPopup 
          news={featuredNews} 
          isOpen={featuredPopupOpen} 
          onClose={closeFeaturedPopup} 
        />
      )}
    </div>
  )
};

export default HomePage; 