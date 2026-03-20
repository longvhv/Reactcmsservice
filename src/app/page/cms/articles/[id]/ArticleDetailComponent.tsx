// Business logic component
'use client';
import { ArticleDetail } from '../../../../../components/ArticleDetail';
import { CMSLayout } from '../../../../../components/CMSLayout';
import { useRouter } from '../../../../../contexts/RouterContext';

export function ArticleDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const articleId = parseInt(params.id);

  return (
    <CMSLayout>
      <ArticleDetail 
        articleId={articleId}
        onNavigate={(state: any) => {
          if (state.page === 'articles') {
            router.push('/page/cms/articles');
          } else if (state.page === 'article-detail') {
            router.push(`/page/cms/articles/${state.id}`);
          }
        }}
      />
    </CMSLayout>
  );
}