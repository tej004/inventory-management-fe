import ContentContainer from '@/components/dashboard/content/ContentContainer';
import TitleLayout from '@/components/title/TitleLayout';

export default function DashboardPage() {
  return (
    <TitleLayout
      title="Dashboard"
      description="Overview of inventory metrics, recent activity, and key performance indicators."
    >
      <ContentContainer />
    </TitleLayout>
  );
}
