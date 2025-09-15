"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { LoadingState } from "@/components/loading-spinner";
import { WarehouseForm } from "@/components/warehouse-form";
import { firestoreService, Warehouse } from "@/lib/firestore";
import { toast } from "sonner";
import {
  ArrowLeft,
  MapPin,
  Phone,
  Mail,
  Users,
  Package,
  Activity,
  Edit,
  Calendar,
  BarChart3,
} from "lucide-react";

export default function WarehouseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [warehouse, setWarehouse] = useState<Warehouse | null>(null);
  const [loading, setLoading] = useState(true);
  const [showEditForm, setShowEditForm] = useState(false);

  const warehouseId = params.id as string;

  const loadWarehouse = async () => {
    try {
      setLoading(true);
      const data = await firestoreService.getWarehouse(warehouseId);
      if (!data) {
        toast.error("Không tìm thấy kho hàng");
        router.push("/dashboard/warehouses");
        return;
      }
      setWarehouse(data);
    } catch (error: any) {
      console.error('Error loading warehouse:', error);
      toast.error("Lỗi khi tải thông tin kho hàng");
      router.push("/dashboard/warehouses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (warehouseId) {
      loadWarehouse();
    }
  }, [warehouseId]);

  const handleEditSuccess = (updatedWarehouse: Warehouse) => {
    setWarehouse(updatedWarehouse);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="default" className="bg-green-100 text-green-800">Hoạt động</Badge>;
      case "inactive":
        return <Badge variant="secondary">Tạm dừng</Badge>;
      case "maintenance":
        return <Badge variant="outline" className="border-yellow-500 text-yellow-700">Bảo trì</Badge>;
      default:
        return <Badge variant="outline">Không xác định</Badge>;
    }
  };

  const getCapacityColor = (current: number, total: number) => {
    const percentage = (current / total) * 100;
    if (percentage >= 90) return "bg-red-500";
    if (percentage >= 70) return "bg-yellow-500";
    return "bg-green-500";
  };

  if (loading) {
    return <LoadingState message="Đang tải thông tin kho hàng..." />;
  }

  if (!warehouse) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold mb-2">Không tìm thấy kho hàng</h2>
        <Button onClick={() => router.push("/dashboard/warehouses")}>
          Quay lại danh sách
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" onClick={() => router.push("/dashboard/warehouses")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại
          </Button>
          <div>
            <div className="flex items-center space-x-3">
              <h1 className="text-3xl font-bold tracking-tight">{warehouse.name}</h1>
              {getStatusBadge(warehouse.status)}
            </div>
            <p className="text-muted-foreground flex items-center mt-1">
              <MapPin className="h-4 w-4 mr-1" />
              {warehouse.address}
            </p>
          </div>
        </div>
        <Button onClick={() => setShowEditForm(true)}>
          <Edit className="mr-2 h-4 w-4" />
          Chỉnh sửa
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sức chứa</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{warehouse.capacity.toLocaleString()} m²</div>
            <p className="text-xs text-muted-foreground">
              Tổng diện tích
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đã sử dụng</CardTitle>
            <Activity className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {warehouse.currentStock.toLocaleString()} m²
            </div>
            <p className="text-xs text-muted-foreground">
              {((warehouse.currentStock / warehouse.capacity) * 100).toFixed(1)}% sức chứa
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sản phẩm</CardTitle>
            <Package className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {warehouse.totalItems || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Tổng số mặt hàng
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Quản lý</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{warehouse.managers.length}</div>
            <p className="text-xs text-muted-foreground">
              Người quản lý
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Warehouse Info */}
        <Card>
          <CardHeader>
            <CardTitle>Thông tin kho hàng</CardTitle>
            <CardDescription>
              Chi tiết về kho hàng và thông tin liên hệ
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Địa chỉ</label>
                <p className="flex items-center mt-1">
                  <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                  {warehouse.address}
                </p>
              </div>

              {warehouse.phone && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Số điện thoại</label>
                  <p className="flex items-center mt-1">
                    <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                    {warehouse.phone}
                  </p>
                </div>
              )}

              {warehouse.email && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Email</label>
                  <p className="flex items-center mt-1">
                    <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                    {warehouse.email}
                  </p>
                </div>
              )}

              {warehouse.description && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Mô tả</label>
                  <p className="mt-1 text-sm">{warehouse.description}</p>
                </div>
              )}

              <Separator />

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Ngày tạo</label>
                  <p className="flex items-center mt-1">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    {warehouse.createdAt.toLocaleDateString('vi-VN')}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Cập nhật</label>
                  <p className="flex items-center mt-1">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    {warehouse.updatedAt.toLocaleDateString('vi-VN')}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Capacity Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Sức chứa kho hàng</CardTitle>
            <CardDescription>
              Tình trạng sử dụng diện tích kho
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Đã sử dụng</span>
                <span className="font-medium">{warehouse.currentStock.toLocaleString()} m²</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div 
                  className={`h-4 rounded-full ${getCapacityColor(warehouse.currentStock, warehouse.capacity)}`}
                  style={{ width: `${Math.min((warehouse.currentStock / warehouse.capacity) * 100, 100)}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>0 m²</span>
                <span>{warehouse.capacity.toLocaleString()} m²</span>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">Tỷ lệ sử dụng</span>
                <span className="text-lg font-bold">
                  {((warehouse.currentStock / warehouse.capacity) * 100).toFixed(1)}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Diện tích còn lại</span>
                <span className="text-lg font-bold text-green-600">
                  {(warehouse.capacity - warehouse.currentStock).toLocaleString()} m²
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Hoạt động gần đây</CardTitle>
          <CardDescription>
            Các giao dịch nhập/xuất kho trong 7 ngày qua
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <BarChart3 className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Đang phát triển</h3>
            <p className="text-muted-foreground">
              Tính năng theo dõi hoạt động sẽ sớm được cập nhật
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Edit Form Dialog */}
      <WarehouseForm
        open={showEditForm}
        onClose={() => setShowEditForm(false)}
        onSuccess={handleEditSuccess}
        warehouse={warehouse}
        mode="edit"
      />
    </div>
  );
}