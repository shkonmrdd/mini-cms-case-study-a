import { useQuery, useMutation, useQueryClient } from 'react-query';
import { Link } from 'react-router-dom';
import { Edit, Trash2, Plus } from 'lucide-react';
import { format } from 'date-fns';
import { newsApi } from '../services/api';
import { NewsItem, getCategoryStyle } from '../types/news';

const AdminDashboard = () => {
  const queryClient = useQueryClient();

  const { data: allNews, isLoading, error } = useQuery<NewsItem[]>(
    'admin-all-news',
    () => newsApi.getAll()
  );

  const deleteMutation = useMutation(newsApi.delete, {
    onSuccess: () => {
      queryClient.invalidateQueries('admin-all-news');
    },
  });

  const handleDelete = async (id: number, title: string) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      try {
        await deleteMutation.mutateAsync(id);
      } catch (error) {
        alert('Error deleting news article. Please try again.');
      }
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy HH:mm');
    } catch {
      return dateString;
    }
  };

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
        <p className="text-red-600">Error loading news articles. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">News Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Manage your news articles ({allNews?.length || 0} total)
          </p>
        </div>
        <Link
          to="/admin/news/new"
          className="btn-primary flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>Add News</span>
        </Link>
      </div>

      {/* News Table */}
      {allNews && allNews.length > 0 ? (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {allNews.map((news) => (
                <tr key={news.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900 max-w-xs truncate">
                        {news.title}
                      </div>
                      {news.summary && (
                        <div className="text-sm text-gray-500 max-w-xs truncate">
                          {news.summary}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${getCategoryStyle(news.category)}`}>
                      {news.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                      news.is_featured 
                        ? 'bg-yellow-100 text-yellow-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {news.is_featured ? 'Featured' : 'Regular'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(news.created_at)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <Link
                        to={`/admin/news/edit/${news.id}`}
                        className="text-primary-600 hover:text-primary-900 p-1 rounded"
                      >
                        <Edit size={16} />
                      </Link>
                      <button
                        onClick={() => handleDelete(news.id, news.title)}
                        className="text-red-600 hover:text-red-900 p-1 rounded"
                        disabled={deleteMutation.isLoading}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">No news articles found.</p>
          <Link
            to="/admin/news/new"
            className="btn-primary"
          >
            Create your first news article
          </Link>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard; 