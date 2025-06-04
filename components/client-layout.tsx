"use client";

import { AppSidebar } from "@/components/app-sidebar";
import Navbar from "@/components/Navbar";

export function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen w-full overflow-hidden">
      <div className="flex-none relative z-20">
        <AppSidebar />
      </div>
      <div className="flex-1 flex flex-col min-w-0 relative">
        <div className="relative z-10">
          <Navbar />
        </div>
        <main className="flex-1 overflow-auto p-4">{children}</main>
      </div>
    </div>
  );
}
