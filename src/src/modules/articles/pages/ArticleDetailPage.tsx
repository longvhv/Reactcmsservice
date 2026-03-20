import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useFetch } from '@longvhv/query';
import { useTranslation } from '@longvhv/i18n';
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Eye, 
  ThumbsUp, 
  Share2, 
  MessageCircle,
  Calendar,
  User,
  Tag,
  Folder,
  Clock,
  TrendingUp,
  MoreVertical
} from 'lucide-react';
import { articleService } from '../services/articleService';
import { Article } from '@/types/article';
import { formatDate } from '@longvhv/shared';

const ArticleDetailPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  // Fetch article
  const { data: article, isLoading } = useFetch<Article>(
    ['article', id],
    () => articleService.getById(id!),
    {
      enabled: !!id,
    }
  );

  // Fetch related articles
  const { data: relatedArticles } = useFetch(
    ['related-articles', id],
    () => articleService.getRelated(id!),
    {
      enabled: !!id,
    }
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Không tìm thấy bài viết</h2>
        <Link
          to="/articles"
          className="text-blue-600 dark:text-blue-400 hover:underline"
        >
          Quay lại danh sách bài viết
        </Link>
      </div>
    );
  }

  const getStatusBadge = () => {
    const configs = {
      draft: { bg: 'bg-gray-100 dark:bg-gray-800', text: 'text-gray-600 dark:text-gray-400', label: 'Draft' },
      pending: { bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-600 dark:text-yellow-400', label: 'Pending Review' },
      published: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-600 dark:text-green-400', label: 'Published' },
      rejected: { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-600 dark:text-red-400', label: 'Rejected' },
      archived: { bg: 'bg-gray-100 dark:bg-gray-800', text: 'text-gray-600 dark:text-gray-400', label: 'Archived' },
    };

    const config = configs[article.status];

    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/articles')}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Articles
        </button>

        <div className="flex items-center gap-3">
          <Link
            to={`/articles/${id}/edit`}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
          >
            <Edit className="w-4 h-4" />
            Edit
          </Link>
          <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Article Header */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* Featured Image */}
        {article.featuredImage && (
          <div className="aspect-video bg-gray-100 dark:bg-gray-900">
            <img
              src={article.featuredImage}
              alt={article.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="p-8">
          {/* Meta */}
          <div className="flex flex-wrap items-center gap-3 mb-4">
            {getStatusBadge()}
            
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-sm font-medium">
              📄 {article.type}
            </span>

            {article.isFeatured && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full text-sm font-medium">
                ⭐ Featured
              </span>
            )}

            {article.isBreaking && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full text-sm font-medium">
                🚨 Breaking
              </span>
            )}
          </div>

          {/* Title */}
          <h1 className="text-4xl font-bold mb-4">{article.title}</h1>

          {/* Summary */}
          {article.summary && (
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-6">
              {article.summary}
            </p>
          )}

          {/* Author & Date */}
          <div className="flex flex-wrap items-center gap-6 pb-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-medium text-lg">
                {article.author.name.charAt(0)}
              </div>
              <div>
                <div className="font-medium">{article.author.name}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {article.author.role}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <Calendar className="w-4 h-4" />
              <span className="text-sm">
                {article.publishedAt ? formatDate(article.publishedAt) : formatDate(article.createdAt)}
              </span>
            </div>

            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <Clock className="w-4 h-4" />
              <span className="text-sm">
                {article.stats?.avgReadTime ? `${Math.ceil(article.stats.avgReadTime / 60)} min read` : '5 min read'}
              </span>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-6 pt-6">
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <Eye className="w-5 h-5" />
              <span className="font-medium">{article.stats?.views || 0}</span>
              <span className="text-sm">views</span>
            </div>

            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <ThumbsUp className="w-5 h-5" />
              <span className="font-medium">{article.stats?.likes || 0}</span>
              <span className="text-sm">likes</span>
            </div>

            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <MessageCircle className="w-5 h-5" />
              <span className="font-medium">{article.stats?.comments || 0}</span>
              <span className="text-sm">comments</span>
            </div>

            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <Share2 className="w-5 h-5" />
              <span className="font-medium">{article.stats?.shares || 0}</span>
              <span className="text-sm">shares</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-8">
        <div 
          className="prose dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />
      </div>

      {/* Categories & Tags */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
        <div className="space-y-4">
          {/* Categories */}
          {article.categories.length > 0 && (
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Folder className="w-5 h-5" />
                Categories
              </h3>
              <div className="flex flex-wrap gap-2">
                {article.categories.map((category) => (
                  <Link
                    key={category.id}
                    to={`/articles?category=${category.id}`}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    <Folder className="w-3 h-3" />
                    {category.name}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Tag className="w-5 h-5" />
                Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag) => (
                  <Link
                    key={tag.id}
                    to={`/articles?tag=${tag.id}`}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full text-sm hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                  >
                    #{tag.name}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Related Articles */}
      {relatedArticles && relatedArticles.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Related Articles
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {relatedArticles.slice(0, 3).map((related: any) => (
              <Link
                key={related.id}
                to={`/articles/${related.id}`}
                className="group"
              >
                <div className="bg-gray-50 dark:bg-gray-900 rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
                  {related.featuredImage && (
                    <div className="aspect-video bg-gray-200 dark:bg-gray-700">
                      <img
                        src={related.featuredImage}
                        alt={related.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <h4 className="font-medium line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {related.title}
                    </h4>
                    {related.publishedAt && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                        {formatDate(related.publishedAt)}
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ArticleDetailPage;