'use client';

import { CategoryDetail } from '../../../../../components/CategoryDetail';
import { useParams, useRouter } from 'next/navigation';

export default function CategoryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const categoryId = parseInt(params.id as string);

  return (
    <CategoryDetail 
      categoryId={categoryId}
      onBack={() => router.push('/page/cms/categories')}
      onNavigate={(state: any) => {
        if (state.page === 'categories') {
          router.push('/page/cms/categories');
        } else if (state.page === 'category-detail') {
          router.push(`/page/cms/categories/${state.id}`);
        } else if (state.page === 'article-detail') {
          router.push(`/page/cms/articles/${state.id}`);
        }
      }}
    />
  );
}
