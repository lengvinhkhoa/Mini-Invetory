"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useUser } from "@/contexts/UserContext";
import { SetupDialog } from "@/components/setup-dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LoadingState } from "@/components/loading-spinner";
import { UserProfile } from "@/lib/firestore";
import {
  Package,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Warehouse,
  AlertTriangle,
  Activity,
} from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { userProfile, loading } = useUser();
  const [showSetup, setShowSetup] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    if (!loading && user && !userProfile) {
      setShowSetup(true);
    } else if (userProfile) {
      setProfile(userProfile);
      setShowSetup(false);
    }
  }, [user, userProfile, loading]);

  const handleSetupComplete = (newProfile: UserProfile) => {
    setProfile(newProfile);
    setShowSetup(false);
  };

  if (loading) {
    return <LoadingState message="Đang tải thông tin tài khoản..." />;
  }

  if (!profile) {
    return (
      <>
        <LoadingState message="Đang thiết lập tài khoản của bạn..." />
        <SetupDialog open={showSetup} onComplete={handleSetupComplete} />
      </>
    );
  }

  const getRoleLabel = (role: string) => {
    const roles = {
      admin: 'Quản trị viên',
      manager: 'Quản lý kho',
      staff: 'Nhân viên'
    };
    return roles[role as keyof typeof roles] || role;
  };

  const getRoleColor = (role: string) => {
    const colors = {
      admin: 'destructive',
      manager: 'default',
      staff: 'secondary'
    };
    return colors[role as keyof typeof colors] || 'default';
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tổng quan</h1>
          <p className="text-muted-foreground">
            Chào mừng trở lại, {profile.displayName}! Đây là tình hình hệ thống của bạn.
          </p>
        </div>
        <Badge variant={getRoleColor(profile.role) as any} className="text-sm">
          {getRoleLabel(profile.role)}
        </Badge>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng sản phẩm</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+12%</span> so với tháng trước
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Giá trị tồn kho</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₫2.4M</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+8%</span> so với tháng trước
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Giao dịch hôm nay</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">47</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-red-600">-3%</span> so với hôm qua
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cảnh báo</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">
              Sản phẩm sắp hết hàng
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Tables */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        {/* Recent Activity */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Hoạt động gần đây</CardTitle>
            <CardDescription>
              Các giao dịch nhập/xuất trong 7 ngày qua
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { type: "IN", item: "Laptop Dell XPS 13", quantity: 5, time: "2 giờ trước", user: "Nguyễn Văn A" },
                { type: "OUT", item: "iPhone 15 Pro", quantity: 2, time: "4 giờ trước", user: "Trần Thị B" },
                { type: "IN", item: "Samsung Galaxy S24", quantity: 10, time: "6 giờ trước", user: "Lê Văn C" },
                { type: "OUT", item: "MacBook Air M2", quantity: 1, time: "8 giờ trước", user: "Phạm Thị D" },
              ].map((activity, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-full ${
                    activity.type === "IN" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                  }`}>
                    {activity.type === "IN" ? (
                      <TrendingUp className="h-4 w-4" />
                    ) : (
                      <TrendingDown className="h-4 w-4" />
                    )}
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {activity.type === "IN" ? "Nhập" : "Xuất"} {activity.quantity} {activity.item}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {activity.user} • {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Thống kê nhanh</CardTitle>
            <CardDescription>
              Tình hình kho hàng hiện tại
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Warehouse className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Số kho hàng</span>
              </div>
              <span className="font-medium">{profile.warehouses.length}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Nhân viên</span>
              </div>
              <span className="font-medium">12</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Package className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Danh mục</span>
              </div>
              <span className="font-medium">8</span>
            </div>

            <div className="pt-4 border-t">
              <h4 className="text-sm font-medium mb-2">Quyền hạn của bạn</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Quản lý hàng hóa</span>
                  <Badge variant={profile.permissions.canManageInventory ? "default" : "secondary"} className="text-xs">
                    {profile.permissions.canManageInventory ? "Có" : "Không"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Xử lý đơn hàng</span>
                  <Badge variant={profile.permissions.canProcessOrders ? "default" : "secondary"} className="text-xs">
                    {profile.permissions.canProcessOrders ? "Có" : "Không"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Xem báo cáo</span>
                  <Badge variant={profile.permissions.canViewReports ? "default" : "secondary"} className="text-xs">
                    {profile.permissions.canViewReports ? "Có" : "Không"}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Thao tác nhanh</CardTitle>
          <CardDescription>
            Các tác vụ thường dùng để quản lý kho hàng
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Button 
              className="h-20 flex-col space-y-2" 
              variant="outline"
              onClick={() => router.push('/dashboard/inventory')}
            >
              <Package className="h-6 w-6" />
              <span>Thêm sản phẩm</span>
            </Button>
            <Button 
              className="h-20 flex-col space-y-2" 
              variant="outline"
              onClick={() => router.push('/dashboard/inventory')}
            >
              <TrendingUp className="h-6 w-6" />
              <span>Nhập hàng</span>
            </Button>
            <Button 
              className="h-20 flex-col space-y-2" 
              variant="outline"
              onClick={() => router.push('/dashboard/inventory')}
            >
              <TrendingDown className="h-6 w-6" />
              <span>Xuất hàng</span>
            </Button>
            <Button 
              className="h-20 flex-col space-y-2" 
              variant="outline"
              onClick={() => router.push('/dashboard/reports')}
            >
              <Activity className="h-6 w-6" />
              <span>Xem báo cáo</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      <SetupDialog open={showSetup} onComplete={handleSetupComplete} />
    </div>
  );
}