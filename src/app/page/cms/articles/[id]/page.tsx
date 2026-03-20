'use client';

import { ArticleDetail } from '../../../../../components/ArticleDetail';
import { useParams, useRouter } from 'next/navigation';

export default function ArticleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const articleId = parseInt(params.id as string);

  return (
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
  );
}
