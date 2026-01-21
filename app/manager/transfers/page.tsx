import TitleLayout from '@/components/title/TitleLayout';
import ContentContainer from '@/components/transfers/content/ContentContainer';

export default function TransfersPage() {
  return (
    <TitleLayout
      title="Transfers"
      description="Manage stock transfers between warehouses and track transfer requests."
    >
      <ContentContainer />
    </TitleLayout>
  );
}
