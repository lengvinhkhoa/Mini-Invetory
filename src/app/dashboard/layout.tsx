"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";
import { LoadingState } from "@/components/loading-spinner";
import { useSidebar } from "@/hooks/useSidebar";
import { cn } from "@/lib/utils";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { isOpen: sidebarOpen, isLoaded: sidebarLoaded, toggle: toggleSidebar } = useSidebar();

  // Redirect to auth if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth");
    }
  }, [user, authLoading, router]);

  // Show loading while checking auth or loading sidebar state
  if (authLoading || !sidebarLoaded) {
    return <LoadingState message="Đang tải..." />;
  }

  // Don't render if not authenticated
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />
      
      <div
        className={cn(
          "transition-all duration-300 ease-in-out",
          sidebarOpen ? "lg:ml-64" : "lg:ml-16"
        )}
      >
        <Header
          sidebarOpen={sidebarOpen}
          onSidebarToggle={toggleSidebar}
        />
        
        <main className="p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}