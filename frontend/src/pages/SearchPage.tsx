import { useQuery } from 'react-query';
import { useSearchParams } from 'react-router-dom';
import { newsApi } from '../services/api';
import NewsCard from '../components/NewsCard';
import { NewsItem } from '../types/news';

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  const { data: searchResults, isLoading, error } = useQuery<NewsItem[]>(
    ['search-news', query],
    () => newsApi.search(query),
    {
      enabled: !!query,
    }
  );

  if (!query) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Search News</h1>
        <p className="text-gray-600">Enter a search term to find news articles.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Search Results</h1>
        <p className="text-red-600">Error loading search results. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Search Results</h1>
        <p className="text-gray-600">
          {searchResults?.length || 0} results for "{query}"
        </p>
      </div>

      {searchResults && searchResults.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {searchResults.map((news) => (
            <NewsCard key={news.id} news={news} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-600">
            No news articles found matching your search. Try different keywords.
          </p>
        </div>
      )}
    </div>
  );
};

export default SearchPage; 