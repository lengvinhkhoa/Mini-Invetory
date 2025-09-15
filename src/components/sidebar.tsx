"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import { useUser } from "@/contexts/UserContext";
import { toast } from "sonner";
import {
  LayoutDashboard,
  Package,
  Warehouse,
  TrendingUp,
  Settings,
  LogOut,
  Menu,
  X,
  Users,
  FileText,
  BarChart3,
  ShoppingCart,
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const navigation = [
  {
    name: "Tổng quan",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Kho hàng",
    href: "/dashboard/warehouses",
    icon: Warehouse,
  },
  {
    name: "Hàng hóa",
    href: "/dashboard/inventory",
    icon: Package,
  },
  {
    name: "Đơn hàng",
    href: "/dashboard/orders",
    icon: ShoppingCart,
  },
  {
    name: "Báo cáo",
    href: "/dashboard/reports",
    icon: BarChart3,
  },
  {
    name: "Giao dịch",
    href: "/dashboard/transactions",
    icon: TrendingUp,
  },
];

const adminNavigation = [
  {
    name: "Người dùng",
    href: "/dashboard/users",
    icon: Users,
  },
  {
    name: "Nhật ký",
    href: "/dashboard/logs",
    icon: FileText,
  },
];

export function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, signOut } = useAuth();
  const { userProfile } = useUser();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("Đăng xuất thành công!");
      router.push("/auth");
    } catch (error: any) {
      toast.error("Lỗi khi đăng xuất");
    }
  };

  const getRoleLabel = (role: string) => {
    const roles = {
      admin: "Quản trị viên",
      manager: "Quản lý kho",
      staff: "Nhân viên",
    };
    return roles[role as keyof typeof roles] || role;
  };

  const getRoleColor = (role: string) => {
    const colors = {
      admin: "destructive",
      manager: "default",
      staff: "secondary",
    };
    return colors[role as keyof typeof colors] || "default";
  };

  const isAdmin = userProfile?.role === "admin";

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full lg:w-16"
        )}
      >
        {/* Header */}
        <div className="flex h-16 items-center justify-between px-4 border-b">
          <div className={cn("flex items-center", !isOpen && "lg:justify-center")}>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Package className="h-4 w-4" />
            </div>
            <span className={cn("ml-2 text-lg font-semibold", !isOpen && "hidden lg:hidden")}>
              Inventory
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className="lg:hidden"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* User Profile */}
        {userProfile && (
          <div className="p-4 border-b">
            <div className={cn("flex items-center", !isOpen && "lg:justify-center")}>
              <Avatar className="h-10 w-10">
                <AvatarImage src={user?.photoURL || ""} alt={userProfile.displayName} />
                <AvatarFallback>
                  {userProfile.displayName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className={cn("ml-3 min-w-0 flex-1", !isOpen && "hidden lg:hidden")}>
                <p className="text-sm font-medium text-gray-900 truncate">
                  {userProfile.displayName}
                </p>
                <Badge
                  variant={getRoleColor(userProfile.role) as any}
                  className="text-xs mt-1"
                >
                  {getRoleLabel(userProfile.role)}
                </Badge>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-2 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Button
                key={item.name}
                variant={isActive ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start",
                  !isOpen && "lg:justify-center lg:px-2"
                )}
                onClick={() => router.push(item.href)}
              >
                <item.icon className="h-4 w-4 flex-shrink-0" />
                <span className={cn("ml-3", !isOpen && "hidden lg:hidden")}>
                  {item.name}
                </span>
              </Button>
            );
          })}

          {isAdmin && (
            <>
              <Separator className="my-4" />
              <div className="px-2 py-1">
                <h3 className={cn("text-xs font-semibold text-gray-500 uppercase tracking-wider", !isOpen && "hidden lg:hidden")}>
                  Quản trị
                </h3>
              </div>
              {adminNavigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Button
                    key={item.name}
                    variant={isActive ? "secondary" : "ghost"}
                    className={cn(
                      "w-full justify-start",
                      !isOpen && "lg:justify-center lg:px-2"
                    )}
                    onClick={() => router.push(item.href)}
                  >
                    <item.icon className="h-4 w-4 flex-shrink-0" />
                    <span className={cn("ml-3", !isOpen && "hidden lg:hidden")}>
                      {item.name}
                    </span>
                  </Button>
                );
              })}
            </>
          )}
        </nav>

        {/* Footer */}
        <div className="border-t p-2 space-y-1">
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start",
              !isOpen && "lg:justify-center lg:px-2"
            )}
            onClick={() => router.push("/dashboard/settings")}
          >
            <Settings className="h-4 w-4 flex-shrink-0" />
            <span className={cn("ml-3", !isOpen && "hidden lg:hidden")}>
              Cài đặt
            </span>
          </Button>
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50",
              !isOpen && "lg:justify-center lg:px-2"
            )}
            onClick={handleSignOut}
          >
            <LogOut className="h-4 w-4 flex-shrink-0" />
            <span className={cn("ml-3", !isOpen && "hidden lg:hidden")}>
              Đăng xuất
            </span>
          </Button>
        </div>
      </div>
    </>
  );
}

// Mobile menu button
interface MobileMenuButtonProps {
  onClick: () => void;
}

export function MobileMenuButton({ onClick }: MobileMenuButtonProps) {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={onClick}
      className="lg:hidden"
    >
      <Menu className="h-5 w-5" />
    </Button>
  );
}