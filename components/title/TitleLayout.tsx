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
    <div className="pt-8 md:pt-0">
      <PageTitle title={title} description={description} />
      <main>{children}</main>
    </div>
  );
}
