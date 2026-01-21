import TitleLayout from '@/components/title/TitleLayout';
import ContentContainer from '@/components/warehouse/content/ContentContainer';

export default function WarehousesPage() {
  return (
    <TitleLayout
      title="Warehouses"
      description="View and manage warehouse locations, codes, and operational details."
    >
      <ContentContainer />
    </TitleLayout>
  );
}
