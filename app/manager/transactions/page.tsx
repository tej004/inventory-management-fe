import TitleLayout from '@/components/title/TitleLayout';
import ContentContainer from '@/components/transactions/ContentContainer';

export default function TransactionsPage() {
  return (
    <TitleLayout
      title="Transactions"
      description="Track inventory transactions, movement history, and audit logs."
    >
      <ContentContainer />
    </TitleLayout>
  );
}
