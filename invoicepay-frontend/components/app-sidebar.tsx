"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import {
  LayoutDashboard,
  Users,
  FileText,
  Settings,
  LogOut,
} from "lucide-react";

export function AppSidebar() {
  const pathname = usePathname();

  const navLinks = [
    { name: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
    { name: "Clients", url: "/clients", icon: Users },
    { name: "Invoices", url: "/invoices", icon: FileText },
    { name: "Settings", url: "/settings", icon: Settings },
  ];

  return (
    <Sidebar className="border-r border-primary/10 bg-primary/5 backdrop-blur-xl shadow-xl">

      {/* Logo */}
      <SidebarHeader className="border-b border-primary/10 px-6 py-6 flex flex-row items-center gap-0 text-xl font-bold tracking-tight">
        <span className="text-primary">Invoice</span>Pay
      </SidebarHeader>

      {/* Navigation */}
      <SidebarContent className="py-4">
        <SidebarGroup className="space-y-2 px-3">

          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.url;

            return (
              <SidebarMenuItem key={item.name}>
                <SidebarMenuButton
                  asChild
                  className={`
                    rounded-md px-4 py-7 transition-all duration-200
                    ${
                      isActive
                        ? "bg-primary/20 backdrop-blur-md text-primary border border-primary/20 shadow-md"
                        : "text-muted-foreground hover:bg-primary/10 hover:text-primary"
                    }
                  `}
                >
                  <Link
                    href={item.url}
                    className="flex items-center gap-3"
                  >
                    <Icon className="h-5 w-5 opacity-80" />
                    <span className="text-sm font-medium">
                      {item.name}
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarGroup>
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className="border-t border-primary/10 p-4">
        <button className="flex items-center gap-3 w-full rounded-lg px-3 py-2 text-sm text-muted-foreground transition hover:bg-primary/10 hover:text-primary">
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </SidebarFooter>

    </Sidebar>
  );
}