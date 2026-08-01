"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
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
  ChevronRight,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";

export function AppSidebar() {
  const pathname = usePathname();

  const mainNav = [
    { name: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
    { name: "Clients", url: "/clients", icon: Users },
    { name: "Invoices", url: "/invoices", icon: FileText },
  ];

  const accountNav = [
    { name: "Settings", url: "/settings", icon: Settings },
  ];

  return (
    <Sidebar className="border-r border-border/40 bg-background">
      {/* ── Header / Logo ── */}
      <SidebarHeader className="px-5 py-">
        <Link
          href="/dashboard"
          className="flex items-center gap-3 transition-opacity hover:opacity-80"
        >
          <Image
          src={"/logo.png"}
          height={40}
          width={50}
          alt="logo"
        />
        </Link>
      </SidebarHeader>

      {/* ── Navigation ── */}
      <SidebarContent className="px-3 py-2">
        {/* Main section */}
        <SidebarGroup>
          <SidebarGroupLabel className="px-3 text-[10px] tracking-[0.1em] font-semibold text-muted-foreground/40 uppercase">
            Main
          </SidebarGroupLabel>
          <div className="space-y-1 mt-2">
            {mainNav.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.url;

              return (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive}
                    className={`
                      relative rounded-lg h-10 px-3 transition-all duration-150 group
                      ${
                        isActive
                          ? "bg-primary text-primary-foreground shadow-md shadow-primary/15 font-semibold"
                          : "text-muted-foreground hover:bg-muted/60 hover:text-foreground font-medium"
                      }
                    `}
                  >
                    <Link
                      href={item.url}
                      className="flex items-center gap-3 w-full"
                    >
                      <Icon className="h-[18px] w-[18px] shrink-0" />
                      <span className="text-[13px]">{item.name}</span>
                      {isActive && (
                        <ChevronRight className="h-3.5 w-3.5 ml-auto opacity-60" />
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </div>
        </SidebarGroup>

        {/* Account section */}
        <SidebarGroup className="mt-4">
          <SidebarGroupLabel className="px-3 text-[10px] tracking-[0.1em] font-semibold text-muted-foreground/40 uppercase">
            Account
          </SidebarGroupLabel>
          <div className="space-y-1 mt-2">
            {accountNav.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.url;

              return (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive}
                    className={`
                      relative rounded-lg h-10 px-3 transition-all duration-150 group
                      ${
                        isActive
                          ? "bg-primary text-primary-foreground shadow-md shadow-primary/15 font-semibold"
                          : "text-muted-foreground hover:bg-muted/60 hover:text-foreground font-medium"
                      }
                    `}
                  >
                    <Link
                      href={item.url}
                      className="flex items-center gap-3 w-full"
                    >
                      <Icon className="h-[18px] w-[18px] shrink-0" />
                      <span className="text-[13px]">{item.name}</span>
                      {isActive && (
                        <ChevronRight className="h-3.5 w-3.5 ml-auto opacity-60" />
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </div>
        </SidebarGroup>
      </SidebarContent>

      {/* ── Footer ── */}
      <SidebarFooter className="p-3">
        {/* User card */}
        <div className="flex items-center gap-3 rounded-lg px-3 py-2.5 mb-2">
          <Avatar className="h-8 w-8 border border-border/60">
            <AvatarFallback className="bg-primary/10 text-primary text-[12px] font-bold">
              SA
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-semibold text-foreground truncate leading-tight">
              Samuel Adu
            </p>
            <p className="text-[11px] text-muted-foreground/50 truncate leading-tight">
              samuel@adustudio.gh
            </p>
          </div>
        </div>

        <Separator className="bg-border/80 mb-2" />

        {/* Logout */}
        <button className="flex items-center gap-3 w-full rounded-lg px-3 py-2.5 text-[13px] font-medium text-muted-foreground/70 transition-all duration-150 hover:bg-destructive/[0.06] hover:text-destructive">
          <LogOut className="h-[18px] w-[18px] shrink-0" />
          Logout
        </button>
      </SidebarFooter>
    </Sidebar>
  );
}