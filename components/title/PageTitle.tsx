interface PageTitleProps {
  title: string;
  right?: React.ReactNode;
}

export default function PageTitle({ title, right }: PageTitleProps) {
  return (
    <div className="flex flex-col gap-2 mb-4 border-b border-border pb-4">
      <div className="flex items-end justify-between">
        <h1 className="text-3xl font-bold text-foreground tracking-tight leading-tight">
          {title}
        </h1>
        {right && <div>{right}</div>}
      </div>
    </div>
  );
}
