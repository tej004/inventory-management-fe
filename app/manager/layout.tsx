import { SidebarProvider } from '@/components/ui/sidebar';
import ManagerSidebar from '@/components/manager-sidebar/ManagerSidebar';

export default function ManagerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <ManagerSidebar />
        <main className="flex-1 p-4 sm:p-8 bg-background text-foreground min-w-0">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
