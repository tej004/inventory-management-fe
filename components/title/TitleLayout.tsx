import PageTitle from './PageTitle';

interface TitleLayoutProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

export default function TitleLayout({
  title,
  description,
  children,
}: TitleLayoutProps) {
  return (
    <div>
      <PageTitle title={title} description={description} />
      <main>{children}</main>
    </div>
  );
}
