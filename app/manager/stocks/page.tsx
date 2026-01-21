import ContentContainer from '@/components/stocks/content/ContentContainer';
import TitleLayout from '@/components/title/TitleLayout';

export default function StocksPage() {
  return (
    <TitleLayout
      title="Stocks"
      description="Monitor stock levels, quantities, and status across all warehouses."
    >
      <ContentContainer />
    </TitleLayout>
  );
}
