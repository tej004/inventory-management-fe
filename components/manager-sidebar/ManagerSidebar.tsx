import Link from 'next/link';
import {
  Home,
  Boxes,
  Package,
  BarChart,
  CreditCard,
  Repeat,
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';

const navItems = [
  { label: 'Dashboard', href: '/manager/dashboard', icon: Home },
  { label: 'Stocks', href: '/manager/stocks', icon: Boxes },
  { label: 'Transactions', href: '/manager/transactions', icon: CreditCard },
  { label: 'Transfers', href: '/manager/transfers', icon: Repeat },
  { label: 'Warehouses', href: '/manager/warehouses', icon: Package },
  { label: 'Products', href: '/manager/products', icon: BarChart },
];

import { SidebarTrigger } from '@/components/ui/sidebar';

export default function ManagerSidebar() {
  return (
    <>
      <div className="fixed top-4 left-4 z-50 md:hidden">
        <SidebarTrigger className="rounded-full shadow-md bg-background p-2" />
      </div>
      <Sidebar collapsible="icon">
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Manager</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {navItems.map(({ label, href, icon: Icon }) => (
                  <SidebarMenuItem key={label}>
                    <SidebarMenuButton asChild>
                      <Link href={href} className="flex items-center gap-3">
                        <Icon className="h-5 w-5" />
                        <span className="truncate">{label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <div className="flex-1 flex flex-col justify-end hidden md:flex">
          <div className="flex justify-end pb-4 pr-3">
            <SidebarTrigger className="rounded-full shadow-md" />
          </div>
        </div>
      </Sidebar>
    </>
  );
}
