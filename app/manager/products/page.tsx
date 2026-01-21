import ProductTable from '@/components/dashboard/product-table/ProductTable';
import ContentContainer from '@/components/products/content/ContentContainer';
import TitleLayout from '@/components/title/TitleLayout';

export default function ProductsPage() {
  return (
    <TitleLayout
      title="Products"
      description="Browse and manage product catalog with pricing, categories, and reorder points."
    >
      <ContentContainer />
    </TitleLayout>
  );
}
