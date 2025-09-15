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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { LoadingState } from "@/components/loading-spinner";
import { InventoryForm } from "@/components/inventory-form";
import { firestoreService, InventoryItem, Warehouse } from "@/lib/firestore";
import { useUser } from "@/contexts/UserContext";
import { toast } from "sonner";
import {
  Package,
  Search,
  Filter,
  Plus,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  AlertTriangle,
  TrendingUp,
  SortAsc,
} from "lucide-react";

export default function InventoryPage() {
  const router = useRouter();
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [warehouseFilter, setWarehouseFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("name");
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [deletingItem, setDeletingItem] = useState<InventoryItem | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const { userProfile } = useUser();

  const loadData = async () => {
    try {
      setLoading(true);
      const [inventoryData, warehousesData] = await Promise.all([
        firestoreService.getAllInventory(),
        firestoreService.getUserWarehouses()
      ]);
      setInventory(inventoryData);
      setWarehouses(warehousesData);
    } catch (error: any) {
      console.error('Error loading inventory:', error);
      toast.error("Lỗi khi tải danh sách hàng hóa");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredInventory = inventory
    .filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === "all" || item.category === categoryFilter;
      const matchesStatus = statusFilter === "all" || item.status === statusFilter;
      const matchesWarehouse = warehouseFilter === "all" || item.warehouseId === warehouseFilter;
      return matchesSearch && matchesCategory && matchesStatus && matchesWarehouse;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "quantity":
          return b.quantity - a.quantity;
        case "price":
          return b.unitPrice - a.unitPrice;
        case "updated":
          return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime();
        default:
          return 0;
      }
    });

  const handleCreateItem = () => {
    setEditingItem(null);
    setShowForm(true);
  };

  const handleEditItem = (item: InventoryItem) => {
    setEditingItem(item);
    setShowForm(true);
  };

  const handleDeleteItem = async () => {
    if (!deletingItem || deleteLoading) return;

    try {
      setDeleteLoading(true);
      await firestoreService.deleteInventoryItem(deletingItem.id);
      setInventory(inventory.filter(item => item.id !== deletingItem.id));
      toast.success("Xóa sản phẩm thành công!");
    } catch (error: any) {
      toast.error("Lỗi khi xóa sản phẩm: " + error.message);
    } finally {
      setDeleteLoading(false);
      setDeletingItem(null);
    }
  };

  const handleFormSuccess = (item: InventoryItem) => {
    if (editingItem) {
      // Update existing item
      setInventory(inventory.map(i =>
        i.id === item.id ? item : i
      ));
    } else {
      // Add new item
      setInventory([item, ...inventory]);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "in_stock":
        return <Badge variant="default" className="bg-green-100 text-green-800">Còn hàng</Badge>;
      case "low_stock":
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Sắp hết</Badge>;
      case "out_of_stock":
        return <Badge variant="destructive">Hết hàng</Badge>;
      default:
        return <Badge variant="outline">Không xác định</Badge>;
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const getWarehouseName = (warehouseId: string) => {
    const warehouse = warehouses.find(w => w.id === warehouseId);
    return warehouse?.name || "Không xác định";
  };

  const categories = [...new Set(inventory.map(item => item.category))];

  const stats = {
    total: inventory.length,
    inStock: inventory.filter(item => item.status === 'in_stock').length,
    lowStock: inventory.filter(item => item.status === 'low_stock').length,
    outOfStock: inventory.filter(item => item.status === 'out_of_stock').length,
    totalValue: inventory.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0),
  };

  if (loading) {
    return <LoadingState message="Đang tải danh sách hàng hóa..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Hàng hóa</h1>
          <p className="text-muted-foreground">
            Quản lý tồn kho và sản phẩm ({inventory.length} sản phẩm)
          </p>
        </div>
        <Button onClick={handleCreateItem}>
          <Plus className="mr-2 h-4 w-4" />
          Thêm sản phẩm
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng sản phẩm</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              {filteredInventory.length !== stats.total && `${filteredInventory.length} hiển thị`}
              {filteredInventory.length === stats.total && "Trong tất cả kho"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Còn hàng</CardTitle>
            <Package className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.inStock}</div>
            <p className="text-xs text-muted-foreground">
              {stats.total > 0 ? ((stats.inStock / stats.total) * 100).toFixed(1) : 0}% tổng số
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sắp hết</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.lowStock}</div>
            <p className="text-xs text-muted-foreground">
              Cần nhập thêm hàng
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hết hàng</CardTitle>
            <Package className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.outOfStock}</div>
            <p className="text-xs text-muted-foreground">
              Cần nhập hàng gấp
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Giá trị tồn kho</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {formatPrice(stats.totalValue)}
            </div>
            <p className="text-xs text-muted-foreground">
              Tổng giá trị hàng tồn
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách sản phẩm</CardTitle>
          <CardDescription>
            Quản lý và theo dõi tình trạng hàng hóa
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Tìm kiếm sản phẩm, SKU..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex gap-2">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[140px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Danh mục" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="in_stock">Còn hàng</SelectItem>
                  <SelectItem value="low_stock">Sắp hết</SelectItem>
                  <SelectItem value="out_of_stock">Hết hàng</SelectItem>
                </SelectContent>
              </Select>

              <Select value={warehouseFilter} onValueChange={setWarehouseFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Kho hàng" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả kho</SelectItem>
                  {warehouses.map((warehouse) => (
                    <SelectItem key={warehouse.id} value={warehouse.id}>
                      {warehouse.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[120px]">
                  <SortAsc className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Sắp xếp" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Tên A-Z</SelectItem>
                  <SelectItem value="quantity">Số lượng</SelectItem>
                  <SelectItem value="price">Giá cao</SelectItem>
                  <SelectItem value="updated">Mới cập nhật</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {filteredInventory.length === 0 ? (
            <div className="text-center py-12">
              <Package className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">
                {searchTerm || categoryFilter !== "all" || statusFilter !== "all" || warehouseFilter !== "all"
                  ? "Không tìm thấy sản phẩm"
                  : "Chưa có sản phẩm"
                }
              </h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm || categoryFilter !== "all" || statusFilter !== "all" || warehouseFilter !== "all"
                  ? "Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm"
                  : "Thêm sản phẩm đầu tiên vào kho hàng"
                }
              </p>
              {!searchTerm && categoryFilter === "all" && statusFilter === "all" && warehouseFilter === "all" && (
                <Button onClick={handleCreateItem}>
                  <Plus className="mr-2 h-4 w-4" />
                  Thêm sản phẩm đầu tiên
                </Button>
              )}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Sản phẩm</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Danh mục</TableHead>
                  <TableHead>Số lượng</TableHead>
                  <TableHead>Đơn giá</TableHead>
                  <TableHead>Kho hàng</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Cập nhật</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInventory.map((item) => (
                  <TableRow
                    key={item.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => router.push(`/dashboard/inventory/${item.id}`)}
                  >
                    <TableCell>
                      <div>
                        <div className="font-medium">{item.name}</div>
                        {item.description && (
                          <div className="text-sm text-muted-foreground line-clamp-1">
                            {item.description}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-sm">{item.sku}</TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">{item.quantity}</span>
                        <span className="text-xs text-muted-foreground">
                          Min: {item.minQuantity}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{formatPrice(item.unitPrice)}</TableCell>
                    <TableCell>{getWarehouseName(item.warehouseId)}</TableCell>
                    <TableCell>{getStatusBadge(item.status)}</TableCell>
                    <TableCell>{item.lastUpdated.toLocaleDateString('vi-VN')}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/dashboard/inventory/${item.id}`);
                          }}>
                            <Eye className="mr-2 h-4 w-4" />
                            Xem chi tiết
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={(e) => {
                            e.stopPropagation();
                            handleEditItem(item);
                          }}>
                            <Edit className="mr-2 h-4 w-4" />
                            Chỉnh sửa
                          </DropdownMenuItem>
                          {(userProfile?.role === 'admin' || userProfile?.permissions?.canManageInventory) && (
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                setDeletingItem(item);
                              }}
                              className="text-red-600"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Xóa
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      {inventory.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Thao tác nhanh</CardTitle>
            <CardDescription>
              Các tác vụ thường dùng để quản lý hàng hóa
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Button
                variant="outline"
                className="h-20 flex-col space-y-2"
                onClick={handleCreateItem}
              >
                <Plus className="h-6 w-6" />
                <span>Thêm sản phẩm</span>
              </Button>
              <Button
                variant="outline"
                className="h-20 flex-col space-y-2"
                onClick={() => setStatusFilter('low_stock')}
              >
                <AlertTriangle className="h-6 w-6" />
                <span>Sản phẩm sắp hết</span>
              </Button>
              <Button
                variant="outline"
                className="h-20 flex-col space-y-2"
                onClick={() => setStatusFilter('out_of_stock')}
              >
                <Package className="h-6 w-6" />
                <span>Hàng hết tồn</span>
              </Button>
              <Button
                variant="outline"
                className="h-20 flex-col space-y-2"
                onClick={() => router.push('/dashboard/reports')}
              >
                <TrendingUp className="h-6 w-6" />
                <span>Báo cáo tồn kho</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Inventory Form Dialog */}
      <InventoryForm
        open={showForm}
        onClose={() => setShowForm(false)}
        onSuccess={handleFormSuccess}
        item={editingItem}
        mode={editingItem ? 'edit' : 'create'}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deletingItem} onOpenChange={() => setDeletingItem(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa sản phẩm</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa sản phẩm "{deletingItem?.name}" (SKU: {deletingItem?.sku})?
              <br /><br />
              <strong>Thông tin sản phẩm:</strong>
              <br />• Số lượng hiện tại: {deletingItem?.quantity}
              <br />• Kho hàng: {getWarehouseName(deletingItem?.warehouseId || "")}
              <br /><br />
              Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteLoading}>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteItem}
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