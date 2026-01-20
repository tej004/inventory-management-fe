import PageTitle from './PageTitle';

interface TitleLayoutProps {
  title: string;
  children: React.ReactNode;
}

export default function TitleLayout({ title, children }: TitleLayoutProps) {
  return (
    <div>
      <PageTitle title={title} />
      <main>{children}</main>
    </div>
  );
}
