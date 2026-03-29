import { AppSidebar } from "@/components/app-sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full">
        <div className="absolute top-4 right-4 z-20">
          <ThemeToggle />
        </div>
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  );
}
