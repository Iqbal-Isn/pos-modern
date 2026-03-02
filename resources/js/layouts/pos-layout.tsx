import { ReactNode } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppHeader } from '@/components/app-header';
import { AppSidebar } from '@/components/app-sidebar';

interface POSLayoutProps {
    children: ReactNode;
}

export default function POSLayout({ children }: POSLayoutProps) {
    return (
        <SidebarProvider>
            <AppSidebar />
            <div className="flex flex-1 flex-col overflow-hidden bg-[#f8f9fa]">
                <AppHeader />
                <main className="flex flex-1 flex-col overflow-hidden">
                    {children}
                </main>
            </div>
        </SidebarProvider>
    );
}
