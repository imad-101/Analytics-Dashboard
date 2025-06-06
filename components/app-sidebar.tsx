"use client";
import { UserButton, useUser } from "@clerk/nextjs";
import { cn } from "@/lib/utils";
import Image from "next/image";
import {
  LayoutDashboard,
  BarChart3,
  Users,
  CreditCard,
  Search,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  useSidebar,
} from "@/components/ui/sidebar";

const navigation = [
  {
    name: "Overview",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    name: "Feature Usage",
    href: "/?tab=feature-usage",
    icon: BarChart3,
  },
  {
    name: "User Activity",
    href: "/?tab=user-activity",
    icon: Users,
  },
  {
    name: "Subscriptions",
    href: "/?tab=subscriptions",
    icon: CreditCard,
  },
  {
    name: "Platform Stats",
    href: "/?tab=platforms",
    icon: Search,
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { user } = useUser();
  const { state } = useSidebar();

  return (
    <Sidebar
      collapsible="icon"
      className="border-r bg-background"
      style={
        {
          "--sidebar-width-icon": "4rem",
        } as React.CSSProperties
      }
    >
      <SidebarHeader className="flex h-20 items-start px-2">
        <div className="p-3 mt-auto">
          <div className="flex items-center gap-3">
            <Image
              src="/favicon.png"
              alt="Pinsearch"
              width={32}
              height={32}
              className="shrink-0"
            />
            <div
              className={cn(
                "flex-1 min-w-0",
                state === "collapsed" && "hidden"
              )}
            >
              <p className="text-sm font-medium truncate">Pinsearch</p>
              <p className="text-xs text-muted-foreground truncate">v1.0.0</p>
            </div>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="px-2 pl-4 py-6">
        <SidebarMenu>
          <div className="space-y-1">
            <h2
              className={cn(
                "mb-2 px-2 text-xs font-semibold tracking-tight text-muted-foreground uppercase",
                state === "collapsed" && "hidden"
              )}
            >
              Analytics
            </h2>
            {navigation.map((item) => (
              <SidebarMenuButton
                key={item.name}
                asChild
                isActive={pathname === item.href}
                tooltip={item.name}
                className="w-full justify-start"
              >
                <Link href={item.href} className="flex items-center gap-3">
                  <item.icon className="h-4 w-4 shrink-0" />
                  <span className="truncate">{item.name}</span>
                </Link>
              </SidebarMenuButton>
            ))}
          </div>
        </SidebarMenu>
      </SidebarContent>
      <div className="border-t p-4 mt-auto">
        <div className="flex items-center gap-3">
          <UserButton
            afterSignOutUrl="/"
            appearance={{
              elements: {
                avatarBox: "h-8 w-8 shrink-0",
              },
            }}
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">
              {user?.fullName || user?.username || "User"}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {user?.primaryEmailAddress?.emailAddress || ""}
            </p>
          </div>
        </div>
      </div>
    </Sidebar>
  );
}
