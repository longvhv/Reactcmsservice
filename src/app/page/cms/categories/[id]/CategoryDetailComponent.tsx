// Business logic component
'use client';
import { CategoryDetail } from '../../../../../components/CategoryDetail';
import { CMSLayout } from '../../../../../components/CMSLayout';
import { useRouter } from '../../../../../contexts/RouterContext';

export function CategoryDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const categoryId = parseInt(params.id);

  return (
    <CMSLayout>
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
    </CMSLayout>
  );
}