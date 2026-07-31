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
    <Sidebar className="border-r border-border/50 bg-background shadow-none">

      {/* Logo */}
      <SidebarHeader className="border-b border-border/50 px-6 py-6">
        <Link href="/dashboard" className="flex items-center gap-2.5 transition-opacity hover:opacity-90">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shrink-0">
            <span className="ff-display text-[13px] font-bold text-primary-foreground leading-none">
              IP
            </span>
          </div>
          <span className="ff-display text-[18px] font-bold text-foreground tracking-tight">
            InvoicePay
          </span>
        </Link>
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
                    rounded-xl px-4 py-6 transition-all duration-200 group
                    ${
                      isActive
                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 font-semibold"
                        : "text-muted-foreground hover:bg-muted/50 hover:text-foreground font-medium"
                    }
                  `}
                >
                  <Link
                    href={item.url}
                    className="flex items-center gap-3"
                  >
                    <Icon className={`h-5 w-5 ${isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground"}`} />
                    <span className="text-[14px]">
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
      <SidebarFooter className="border-t border-border/50 p-4">
        <button className="flex items-center gap-3 w-full rounded-xl px-4 py-3 text-sm font-medium text-muted-foreground transition-all duration-200 hover:bg-destructive/10 hover:text-destructive">
          <LogOut className="h-5 w-5" />
          Logout
        </button>
      </SidebarFooter>

    </Sidebar>
  );
}