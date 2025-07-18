import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { ArrowLeft, Upload, X } from 'lucide-react';
import { newsApi } from '../services/api';
import { CreateNewsItem, NewsItem, NEWS_CATEGORIES } from '../types/news';

interface FormData {
  title: string;
  content: string;
  summary: string;
  category: string;
  is_featured: boolean;
  image?: FileList;
}

const AdminNewsForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;
  const queryClient = useQueryClient();
  
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [existingImage, setExistingImage] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors }, setValue, watch, reset } = useForm<FormData>();

  // Fetch existing news for editing
  const { data: existingNews, isLoading: loadingNews } = useQuery<NewsItem>(
    ['news', id],
    () => newsApi.getById(Number(id)),
    { enabled: isEditing }
  );

  // Create mutation
  const createMutation = useMutation(newsApi.create, {
    onSuccess: () => {
      queryClient.invalidateQueries('admin-all-news');
      navigate('/admin/dashboard');
    },
  });

  // Update mutation
  const updateMutation = useMutation(newsApi.update, {
    onSuccess: () => {
      queryClient.invalidateQueries('admin-all-news');
      navigate('/admin/dashboard');
    },
  });

  // Populate form when editing
  useEffect(() => {
    if (existingNews) {
      reset({
        title: existingNews.title,
        content: existingNews.content,
        summary: existingNews.summary || '',
        category: existingNews.category,
        is_featured: existingNews.is_featured,
      });
      setExistingImage(existingNews.image_url || null);
    }
  }, [existingNews, reset]);

  // Handle image upload preview
  const watchedImage = watch('image');
  useEffect(() => {
    if (watchedImage && watchedImage[0]) {
      const file = watchedImage[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, [watchedImage]);

  const onSubmit = async (data: FormData) => {
    const newsData: CreateNewsItem = {
      title: data.title,
      content: data.content,
      summary: data.summary,
      category: data.category,
      is_featured: data.is_featured,
      image: data.image?.[0],
    };

    try {
      if (isEditing && id) {
        await updateMutation.mutateAsync({
          ...newsData,
          id: Number(id),
        });
      } else {
        await createMutation.mutateAsync(newsData);
      }
    } catch (error) {
      alert('Error saving news article. Please try again.');
    }
  };

  const removeImage = () => {
    setValue('image', undefined);
    setImagePreview(null);
    setExistingImage(null);
  };

  if (isEditing && loadingNews) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const isLoading = createMutation.isLoading || updateMutation.isLoading;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center space-x-4 mb-6">
        <button
          onClick={() => navigate('/admin/dashboard')}
          className="p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-2xl font-bold text-gray-900">
          {isEditing ? 'Edit News Article' : 'Create New News Article'}
        </h1>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Title *
            </label>
            <input
              id="title"
              type="text"
              {...register('title', { required: 'Title is required' })}
              className="input-field"
              placeholder="Enter news title"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
            )}
          </div>

          {/* Category and Featured */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                id="category"
                {...register('category', { required: 'Category is required' })}
                className="input-field"
              >
                <option value="">Select category</option>
                {NEWS_CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
              )}
            </div>

            <div className="flex items-center">
              <input
                id="is_featured"
                type="checkbox"
                {...register('is_featured')}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="is_featured" className="ml-2 block text-sm text-gray-700">
                Mark as featured article
              </label>
            </div>
          </div>

          {/* Summary */}
          <div>
            <label htmlFor="summary" className="block text-sm font-medium text-gray-700 mb-2">
              Summary
            </label>
            <textarea
              id="summary"
              rows={3}
              {...register('summary')}
              className="input-field"
              placeholder="Brief summary of the article (optional)"
            />
          </div>

          {/* Content */}
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
              Content *
            </label>
            <textarea
              id="content"
              rows={12}
              {...register('content', { required: 'Content is required' })}
              className="input-field"
              placeholder="Write your news article content here..."
            />
            {errors.content && (
              <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>
            )}
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Featured Image
            </label>
            
            {/* Current/Preview Image */}
            {(imagePreview || existingImage) && (
              <div className="mb-4 relative inline-block">
                <img
                  src={imagePreview || existingImage || ''}
                  alt="Preview"
                  className="h-32 w-48 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                >
                  <X size={16} />
                </button>
              </div>
            )}

            {/* Upload Button */}
            <div className="flex items-center space-x-4">
              <label className="cursor-pointer bg-gray-50 hover:bg-gray-100 border border-gray-300 rounded-lg px-4 py-2 flex items-center space-x-2 transition-colors">
                <Upload size={20} />
                <span>Choose Image</span>
                <input
                  type="file"
                  accept="image/*"
                  {...register('image')}
                  className="hidden"
                />
              </label>
              <span className="text-sm text-gray-500">
                JPG, PNG, GIF up to 5MB
              </span>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/admin/dashboard')}
            className="btn-secondary"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn-primary"
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : (isEditing ? 'Update Article' : 'Create Article')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminNewsForm; 