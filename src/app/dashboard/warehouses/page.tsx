"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LoadingState } from "@/components/loading-spinner";
import { WarehouseForm } from "@/components/warehouse-form";
import { firestoreService, Warehouse } from "@/lib/firestore";
import { useUser } from "@/contexts/UserContext";
import { toast } from "sonner";
import {
  Warehouse as WarehouseIcon,
  MapPin,
  Users,
  Package,
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Phone,
  Mail,
  Activity,
  Filter,
  SortAsc,
} from "lucide-react";

export default function WarehousesPage() {
  const router = useRouter();
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("name");
  const [showForm, setShowForm] = useState(false);
  const [editingWarehouse, setEditingWarehouse] = useState<Warehouse | null>(null);
  const [deletingWarehouse, setDeletingWarehouse] = useState<Warehouse | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const { userProfile } = useUser();

  const loadWarehouses = async () => {
    try {
      setLoading(true);
      const data = await firestoreService.getUserWarehouses();
      setWarehouses(data);
    } catch (error: any) {
      console.error('Error loading warehouses:', error);
      toast.error("Lỗi khi tải danh sách kho hàng");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWarehouses();
  }, []);

  const filteredWarehouses = warehouses
    .filter(warehouse => {
      const matchesSearch = warehouse.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        warehouse.address.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "all" || warehouse.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "capacity":
          return b.capacity - a.capacity;
        case "usage":
          return (b.currentStock / b.capacity) - (a.currentStock / a.capacity);
        case "created":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        default:
          return 0;
      }
    });

  const handleCreateWarehouse = () => {
    setEditingWarehouse(null);
    setShowForm(true);
  };

  const handleViewWarehouse = (warehouse: Warehouse) => {
    router.push(`/dashboard/warehouses/${warehouse.id}`);
  };

  const handleEditWarehouse = (warehouse: Warehouse) => {
    setEditingWarehouse(warehouse);
    setShowForm(true);
  };

  const handleDeleteWarehouse = async () => {
    if (!deletingWarehouse || deleteLoading) return;

    try {
      setDeleteLoading(true);

      // Check if warehouse has inventory items
      const warehouseInventory = await firestoreService.getWarehouseInventory(deletingWarehouse.id);

      if (warehouseInventory.length > 0) {
        toast.error(`Không thể xóa kho hàng có ${warehouseInventory.length} sản phẩm. Vui lòng di chuyển hoặc xóa tất cả sản phẩm trước.`);
        setDeletingWarehouse(null);
        return;
      }

      await firestoreService.deleteWarehouse(deletingWarehouse.id);
      setWarehouses(warehouses.filter(w => w.id !== deletingWarehouse.id));
      toast.success("Xóa kho hàng thành công!");
    } catch (error: any) {
      toast.error("Lỗi khi xóa kho hàng: " + error.message);
    } finally {
      setDeleteLoading(false);
      setDeletingWarehouse(null);
    }
  };

  const handleFormSuccess = (warehouse: Warehouse) => {
    if (editingWarehouse) {
      // Update existing warehouse
      setWarehouses(warehouses.map(w =>
        w.id === warehouse.id ? warehouse : w
      ));
    } else {
      // Add new warehouse
      setWarehouses([warehouse, ...warehouses]);
    }
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
    return <LoadingState message="Đang tải danh sách kho hàng..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Kho hàng</h1>
          <p className="text-muted-foreground">
            Quản lý các kho hàng trong hệ thống ({warehouses.length} kho)
          </p>
        </div>
        <Button onClick={handleCreateWarehouse}>
          <Plus className="mr-2 h-4 w-4" />
          Thêm kho hàng
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng kho hàng</CardTitle>
            <WarehouseIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{warehouses.length}</div>
            <p className="text-xs text-muted-foreground">
              {filteredWarehouses.length !== warehouses.length &&
                `${filteredWarehouses.length} hiển thị`
              }
              {filteredWarehouses.length === warehouses.length && "Trong hệ thống"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đang hoạt động</CardTitle>
            <Activity className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {warehouses.filter(w => w.status === 'active').length}
            </div>
            <p className="text-xs text-muted-foreground">
              {warehouses.filter(w => w.status === 'inactive').length} tạm dừng, {warehouses.filter(w => w.status === 'maintenance').length} bảo trì
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng sức chứa</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {warehouses.reduce((sum, w) => sum + w.capacity, 0).toLocaleString()} m²
            </div>
            <p className="text-xs text-muted-foreground">
              Trung bình {warehouses.length > 0 ? Math.round(warehouses.reduce((sum, w) => sum + w.capacity, 0) / warehouses.length).toLocaleString() : 0} m²/kho
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tỷ lệ sử dụng</CardTitle>
            <Package className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {warehouses.length > 0
                ? ((warehouses.reduce((sum, w) => sum + w.currentStock, 0) / warehouses.reduce((sum, w) => sum + w.capacity, 0)) * 100).toFixed(1)
                : 0
              }%
            </div>
            <p className="text-xs text-muted-foreground">
              {warehouses.reduce((sum, w) => sum + w.currentStock, 0).toLocaleString()} / {warehouses.reduce((sum, w) => sum + w.capacity, 0).toLocaleString()} m²
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Tìm kiếm kho hàng..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="active">Hoạt động</SelectItem>
              <SelectItem value="inactive">Tạm dừng</SelectItem>
              <SelectItem value="maintenance">Bảo trì</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[140px]">
              <SortAsc className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Sắp xếp" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Tên A-Z</SelectItem>
              <SelectItem value="capacity">Sức chứa</SelectItem>
              <SelectItem value="usage">Tỷ lệ sử dụng</SelectItem>
              <SelectItem value="created">Mới nhất</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Warehouses Grid */}
      {filteredWarehouses.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <WarehouseIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">
              {searchTerm ? "Không tìm thấy kho hàng" : "Chưa có kho hàng"}
            </h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm
                ? "Thử tìm kiếm với từ khóa khác"
                : "Tạo kho hàng đầu tiên để bắt đầu quản lý"
              }
            </p>
            {!searchTerm && (
              <Button onClick={handleCreateWarehouse}>
                <Plus className="mr-2 h-4 w-4" />
                Tạo kho hàng đầu tiên
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredWarehouses.map((warehouse) => (
            <Card
              key={warehouse.id}
              className="hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => handleViewWarehouse(warehouse)}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{warehouse.name}</CardTitle>
                  <div className="flex items-center space-x-2">
                    {getStatusBadge(warehouse.status)}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={(e) => {
                          e.stopPropagation();
                          handleViewWarehouse(warehouse);
                        }}>
                          <Eye className="mr-2 h-4 w-4" />
                          Xem chi tiết
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => {
                          e.stopPropagation();
                          handleEditWarehouse(warehouse);
                        }}>
                          <Edit className="mr-2 h-4 w-4" />
                          Chỉnh sửa
                        </DropdownMenuItem>
                        {(userProfile?.role === 'admin' || warehouse.ownerId === userProfile?.uid) && (
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeletingWarehouse(warehouse);
                            }}
                            className="text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Xóa
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                <CardDescription className="flex items-center">
                  <MapPin className="mr-1 h-3 w-3" />
                  {warehouse.address}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Contact Info */}
                {(warehouse.phone || warehouse.email) && (
                  <div className="space-y-1 text-sm">
                    {warehouse.phone && (
                      <div className="flex items-center text-muted-foreground">
                        <Phone className="mr-2 h-3 w-3" />
                        {warehouse.phone}
                      </div>
                    )}
                    {warehouse.email && (
                      <div className="flex items-center text-muted-foreground">
                        <Mail className="mr-2 h-3 w-3" />
                        {warehouse.email}
                      </div>
                    )}
                  </div>
                )}

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center">
                    <Package className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>{warehouse.totalItems || 0} sản phẩm</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>{warehouse.managers.length} quản lý</span>
                  </div>
                </div>

                {/* Capacity Bar */}
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Sức chứa</span>
                    <span>{warehouse.currentStock}/{warehouse.capacity} m²</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${getCapacityColor(warehouse.currentStock, warehouse.capacity)}`}
                      style={{ width: `${Math.min((warehouse.currentStock / warehouse.capacity) * 100, 100)}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {((warehouse.currentStock / warehouse.capacity) * 100).toFixed(1)}% đã sử dụng
                  </p>
                </div>

                {/* Description */}
                {warehouse.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {warehouse.description}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Quick Actions */}
      {warehouses.length > 0 && (
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
                variant="outline"
                className="h-20 flex-col space-y-2"
                onClick={handleCreateWarehouse}
              >
                <Plus className="h-6 w-6" />
                <span>Thêm kho mới</span>
              </Button>
              <Button
                variant="outline"
                className="h-20 flex-col space-y-2"
                onClick={() => router.push('/dashboard/inventory')}
              >
                <Package className="h-6 w-6" />
                <span>Quản lý hàng hóa</span>
              </Button>
              <Button
                variant="outline"
                className="h-20 flex-col space-y-2"
                onClick={() => router.push('/dashboard/reports')}
              >
                <Activity className="h-6 w-6" />
                <span>Báo cáo kho</span>
              </Button>
              <Button
                variant="outline"
                className="h-20 flex-col space-y-2"
                onClick={() => setStatusFilter('maintenance')}
              >
                <Filter className="h-6 w-6" />
                <span>Kho bảo trì</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Warehouse Form Dialog */}
      <WarehouseForm
        open={showForm}
        onClose={() => setShowForm(false)}
        onSuccess={handleFormSuccess}
        warehouse={editingWarehouse}
        mode={editingWarehouse ? 'edit' : 'create'}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deletingWarehouse} onOpenChange={() => setDeletingWarehouse(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa kho hàng</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa kho hàng "{deletingWarehouse?.name}"?
              <br /><br />
              <strong>Lưu ý:</strong> Kho hàng chỉ có thể xóa khi không còn sản phẩm nào bên trong.
              Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteLoading}>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteWarehouse}
              disabled={deleteLoading}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleteLoading ? "Đang xóa..." : "Xóa"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}