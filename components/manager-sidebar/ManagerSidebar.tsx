'use client';
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

import { SidebarTrigger, useSidebar } from '@/components/ui/sidebar';
import { ThemeToggle } from '../ui/theme-toggle';

export default function ManagerSidebar() {
  const { setOpenMobile, isMobile, state } = useSidebar();
  const handleNavClick = () => {
    if (isMobile) setOpenMobile(false);
  };
  return (
    <>
      <div className="fixed top-4 left-2 z-50 flex flex-row gap-2 md:hidden">
        <SidebarTrigger className="size-7 p-0 rounded-full shadow-md bg-background" />
        <ThemeToggle />
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
                      <Link
                        href={href}
                        className="flex items-center gap-3"
                        onClick={handleNavClick}
                      >
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
          <div className="flex flex-col gap-2 items-end pb-4 pr-3">
            <ThemeToggle />
            <SidebarTrigger className="rounded-full bg-background shadow-md" />
          </div>
        </div>
      </Sidebar>
    </>
  );
}
