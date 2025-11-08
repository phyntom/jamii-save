import type React from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { DashboardHeader } from '@/components/dashboard/header';
import { AppSidebar } from '@/components/dashboard/app-sidebar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-muted/30">
      <SidebarProvider className='flex flex-col'>
        <DashboardHeader />
        <main className="flex flex-1">
          <AppSidebar />
          <div className="flex-1 container mx-auto px-4 py-8">{children}</div>
        </main>
      </SidebarProvider>
    </div>
  );
}
