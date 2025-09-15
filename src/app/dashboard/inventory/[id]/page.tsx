"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { LoadingState } from "@/components/loading-spinner";
import { InventoryForm } from "@/components/inventory-form";
import { firestoreService, InventoryItem, Warehouse } from "@/lib/firestore";
import { useUser } from "@/contexts/UserContext";
import { toast } from "sonner";
import {
    ArrowLeft,
    Package,
    Edit,
    Trash2,
    Calendar,
    MapPin,
    Phone,
    Barcode,
    DollarSign,
    AlertTriangle,
    TrendingUp,
    History,
    Plus,
    Minus,
    Activity,
    Clock,
    Download,
    Printer,
    MoreHorizontal,
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function InventoryDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [item, setItem] = useState<InventoryItem | null>(null);
    const [warehouse, setWarehouse] = useState<Warehouse | null>(null);
    const [loading, setLoading] = useState(true);
    const [showEditForm, setShowEditForm] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [adjustQuantity, setAdjustQuantity] = useState("");
    const [adjustReason, setAdjustReason] = useState("");
    const [adjustLoading, setAdjustLoading] = useState(false);
    const [transactions, setTransactions] = useState<any[]>([]);
    const [transactionsLoading, setTransactionsLoading] = useState(false);
    const { userProfile } = useUser();

    const itemId = params.id as string;

    const loadItemData = async () => {
        try {
            setLoading(true);
            const itemData = await firestoreService.getInventoryItem(itemId);
            if (!itemData) {
                toast.error("Không tìm thấy sản phẩm");
                router.push("/dashboard/inventory");
                return;
            }
            setItem(itemData);

            // Load warehouse info
            const warehouseData = await firestoreService.getWarehouse(itemData.warehouseId);
            setWarehouse(warehouseData);

            // Load transaction history
            loadTransactionHistory();
        } catch (error: any) {
            console.error('Error loading item:', error);
            toast.error("Lỗi khi tải thông tin sản phẩm");
            router.push("/dashboard/inventory");
        } finally {
            setLoading(false);
        }
    };

    const loadTransactionHistory = async () => {
        try {
            setTransactionsLoading(true);
            // Mock transaction data - in real app, this would come from Firestore
            const mockTransactions = [
                {
                    id: '1',
                    type: 'in',
                    quantity: 100,
                    reason: 'Nhập hàng từ nhà cung cấp',
                    createdAt: new Date(Date.now() - 86400000 * 2), // 2 days ago
                    createdBy: 'Admin',
                    previousQuantity: 0,
                    newQuantity: 100
                },
                {
                    id: '2',
                    type: 'out',
                    quantity: 25,
                    reason: 'Bán hàng',
                    createdAt: new Date(Date.now() - 86400000), // 1 day ago
                    createdBy: 'Staff',
                    previousQuantity: 100,
                    newQuantity: 75
                },
                {
                    id: '3',
                    type: 'adjustment',
                    quantity: -5,
                    reason: 'Kiểm kê - hàng hỏng',
                    createdAt: new Date(Date.now() - 3600000), // 1 hour ago
                    createdBy: 'Manager',
                    previousQuantity: 75,
                    newQuantity: 70
                }
            ];

            // Sort by newest first
            mockTransactions.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
            setTransactions(mockTransactions);
        } catch (error) {
            console.error('Error loading transactions:', error);
        } finally {
            setTransactionsLoading(false);
        }
    };

    useEffect(() => {
        if (itemId) {
            loadItemData();
        }
    }, [itemId]);

    const handleEditSuccess = (updatedItem: InventoryItem) => {
        setItem(updatedItem);
    };

    const handleDelete = async () => {
        if (!item || deleteLoading) return;

        try {
            setDeleteLoading(true);
            await firestoreService.deleteInventoryItem(item.id);
            toast.success("Xóa sản phẩm thành công!");
            router.push("/dashboard/inventory");
        } catch (error: any) {
            toast.error("Lỗi khi xóa sản phẩm: " + error.message);
        } finally {
            setDeleteLoading(false);
            setShowDeleteDialog(false);
        }
    };

    const handleQuantityAdjust = async (type: 'add' | 'subtract') => {
        if (!item || !adjustQuantity || adjustLoading) return;

        const adjustment = parseInt(adjustQuantity);
        if (isNaN(adjustment) || adjustment <= 0) {
            toast.error("Vui lòng nhập số lượng hợp lệ");
            return;
        }

        try {
            setAdjustLoading(true);
            const newQuantity = type === 'add'
                ? item.quantity + adjustment
                : Math.max(0, item.quantity - adjustment);

            await firestoreService.updateInventoryItem(item.id, {
                quantity: newQuantity,
            });

            // Add transaction record
            const newTransaction = {
                id: Date.now().toString(),
                type: type === 'add' ? 'in' : 'out',
                quantity: adjustment,
                reason: adjustReason || `${type === 'add' ? 'Nhập' : 'Xuất'} hàng thủ công`,
                createdAt: new Date(),
                createdBy: userProfile?.name || 'User',
                previousQuantity: item.quantity,
                newQuantity: newQuantity
            };

            setTransactions(prev => [newTransaction, ...prev]);

            const updatedItem = { ...item, quantity: newQuantity };
            setItem(updatedItem);
            setAdjustQuantity("");
            setAdjustReason("");

            toast.success(`${type === 'add' ? 'Nhập' : 'Xuất'} ${adjustment} sản phẩm thành công!`);
        } catch (error: any) {
            toast.error("Lỗi khi điều chỉnh số lượng: " + error.message);
        } finally {
            setAdjustLoading(false);
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

    const canEdit = userProfile?.role === 'admin' || userProfile?.permissions?.canManageInventory;
    const canDelete = userProfile?.role === 'admin' || userProfile?.permissions?.canManageInventory;

    const handleExportReport = () => {
        if (!item) return;

        const reportData = {
            productName: item.name,
            sku: item.sku,
            currentStock: item.quantity,
            minStock: item.minQuantity,
            unitPrice: item.unitPrice,
            totalValue: item.quantity * item.unitPrice,
            status: item.status,
            warehouse: warehouse?.name || 'N/A',
            lastUpdated: item.lastUpdated.toLocaleDateString('vi-VN'),
            transactions: transactions
        };

        const dataStr = JSON.stringify(reportData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `inventory-report-${item.sku}-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        URL.revokeObjectURL(url);

        toast.success("Xuất báo cáo thành công!");
    };

    const handlePrintBarcode = () => {
        if (!item) return;

        // Create a simple barcode print layout
        const printWindow = window.open('', '_blank');
        if (printWindow) {
            printWindow.document.write(`
        <html>
          <head>
            <title>In mã vạch - ${item.sku}</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
              .barcode-container { text-align: center; margin: 20px 0; }
              .barcode { font-family: 'Courier New', monospace; font-size: 24px; letter-spacing: 2px; }
              .product-info { margin-top: 10px; }
            </style>
          </head>
          <body>
            <div class="barcode-container">
              <div class="barcode">||||| ${item.sku} |||||</div>
              <div class="product-info">
                <h3>${item.name}</h3>
                <p>SKU: ${item.sku}</p>
                <p>Giá: ${formatPrice(item.unitPrice)}</p>
              </div>
            </div>
          </body>
        </html>
      `);
            printWindow.document.close();
            printWindow.print();
        }

        toast.success("Đang in mã vạch...");
    };

    if (loading) {
        return <LoadingState message="Đang tải thông tin sản phẩm..." />;
    }

    if (!item) {
        return (
            <div className="text-center py-12">
                <h2 className="text-xl font-semibold mb-2">Không tìm thấy sản phẩm</h2>
                <Button onClick={() => router.push("/dashboard/inventory")}>
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
                    <Button variant="ghost" size="sm" onClick={() => router.push("/dashboard/inventory")}>
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Quay lại
                    </Button>
                    <div>
                        <div className="flex items-center space-x-3">
                            <h1 className="text-3xl font-bold tracking-tight">{item.name}</h1>
                            {getStatusBadge(item.status)}
                        </div>
                        <p className="text-muted-foreground flex items-center mt-1">
                            <Barcode className="h-4 w-4 mr-1" />
                            SKU: {item.sku}
                        </p>
                    </div>
                </div>
                <div className="flex space-x-2">
                    {canEdit && (
                        <Button onClick={() => setShowEditForm(true)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Chỉnh sửa
                        </Button>
                    )}

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline">
                                <MoreHorizontal className="h-4 w-4 mr-2" />
                                Thêm
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={handleExportReport}>
                                <Download className="mr-2 h-4 w-4" />
                                Xuất báo cáo
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={handlePrintBarcode}>
                                <Printer className="mr-2 h-4 w-4" />
                                In mã vạch
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {canDelete && (
                        <Button
                            variant="destructive"
                            onClick={() => setShowDeleteDialog(true)}
                        >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Xóa
                        </Button>
                    )}
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Số lượng hiện tại</CardTitle>
                        <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{item.quantity}</div>
                        <p className="text-xs text-muted-foreground">
                            Tối thiểu: {item.minQuantity}
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Đơn giá</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatPrice(item.unitPrice)}</div>
                        <p className="text-xs text-muted-foreground">
                            Giá bán lẻ
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Tổng giá trị</CardTitle>
                        <TrendingUp className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">
                            {formatPrice(item.quantity * item.unitPrice)}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Giá trị tồn kho
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Trạng thái</CardTitle>
                        <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {getStatusBadge(item.status)}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Tình trạng tồn kho
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Product Info */}
                <Card>
                    <CardHeader>
                        <CardTitle>Thông tin sản phẩm</CardTitle>
                        <CardDescription>
                            Chi tiết về sản phẩm và thông tin kho
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-3">
                            <div>
                                <Label className="text-sm font-medium text-muted-foreground">Tên sản phẩm</Label>
                                <p className="mt-1 font-medium">{item.name}</p>
                            </div>

                            <div>
                                <Label className="text-sm font-medium text-muted-foreground">SKU</Label>
                                <p className="mt-1 font-mono text-sm">{item.sku}</p>
                            </div>

                            {item.description && (
                                <div>
                                    <Label className="text-sm font-medium text-muted-foreground">Mô tả</Label>
                                    <p className="mt-1 text-sm">{item.description}</p>
                                </div>
                            )}

                            <div>
                                <Label className="text-sm font-medium text-muted-foreground">Danh mục</Label>
                                <p className="mt-1">{item.category}</p>
                            </div>

                            {item.supplier && (
                                <div>
                                    <Label className="text-sm font-medium text-muted-foreground">Nhà cung cấp</Label>
                                    <p className="mt-1">{item.supplier}</p>
                                </div>
                            )}

                            {item.location && (
                                <div>
                                    <Label className="text-sm font-medium text-muted-foreground">Vị trí trong kho</Label>
                                    <p className="mt-1 font-mono text-sm">{item.location}</p>
                                </div>
                            )}

                            <Separator />

                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <Label className="text-sm font-medium text-muted-foreground">Ngày tạo</Label>
                                    <p className="flex items-center mt-1">
                                        <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                                        {item.createdAt.toLocaleDateString('vi-VN')}
                                    </p>
                                </div>
                                <div>
                                    <Label className="text-sm font-medium text-muted-foreground">Cập nhật</Label>
                                    <p className="flex items-center mt-1">
                                        <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                                        {item.lastUpdated.toLocaleDateString('vi-VN')}
                                    </p>
                                </div>
                            </div>

                            {warehouse && (
                                <>
                                    <Separator />
                                    <div>
                                        <Label className="text-sm font-medium text-muted-foreground">Kho hàng</Label>
                                        <div className="mt-1 space-y-1">
                                            <p className="font-medium">{warehouse.name}</p>
                                            <p className="text-sm text-muted-foreground flex items-center">
                                                <MapPin className="h-3 w-3 mr-1" />
                                                {warehouse.address}
                                            </p>
                                            {warehouse.phone && (
                                                <p className="text-sm text-muted-foreground flex items-center">
                                                    <Phone className="h-3 w-3 mr-1" />
                                                    {warehouse.phone}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Quantity Management */}
                <Card>
                    <CardHeader>
                        <CardTitle>Quản lý số lượng</CardTitle>
                        <CardDescription>
                            Điều chỉnh tồn kho và theo dõi biến động
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* Current Stock */}
                        <div className="p-4 bg-gray-50 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                                <Label className="text-sm font-medium">Tồn kho hiện tại</Label>
                                {getStatusBadge(item.status)}
                            </div>
                            <div className="text-3xl font-bold">{item.quantity}</div>
                            <div className="text-sm text-muted-foreground mt-1">
                                Tối thiểu: {item.minQuantity} | Giá trị: {formatPrice(item.quantity * item.unitPrice)}
                            </div>
                        </div>

                        {/* Quick Adjust */}
                        {canEdit && (
                            <div className="space-y-3">
                                <Label className="text-sm font-medium">Điều chỉnh nhanh</Label>
                                <div className="grid grid-cols-3 gap-2">
                                    <Input
                                        type="number"
                                        placeholder="Số lượng"
                                        value={adjustQuantity}
                                        onChange={(e) => setAdjustQuantity(e.target.value)}
                                        min="1"
                                    />
                                    <Button
                                        variant="outline"
                                        onClick={() => handleQuantityAdjust('add')}
                                        disabled={adjustLoading || !adjustQuantity}
                                        className="text-green-600 border-green-200 hover:bg-green-50"
                                    >
                                        <Plus className="h-4 w-4 mr-1" />
                                        Nhập
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={() => handleQuantityAdjust('subtract')}
                                        disabled={adjustLoading || !adjustQuantity}
                                        className="text-red-600 border-red-200 hover:bg-red-50"
                                    >
                                        <Minus className="h-4 w-4 mr-1" />
                                        Xuất
                                    </Button>
                                </div>
                                <Input
                                    placeholder="Lý do điều chỉnh (tùy chọn)"
                                    value={adjustReason}
                                    onChange={(e) => setAdjustReason(e.target.value)}
                                />

                                {/* Quick quantity buttons */}
                                <div className="flex space-x-2">
                                    <span className="text-sm text-muted-foreground">Nhanh:</span>
                                    {[1, 5, 10, 25].map((qty) => (
                                        <Button
                                            key={qty}
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => setAdjustQuantity(qty.toString())}
                                            className="h-6 px-2 text-xs"
                                        >
                                            {qty}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        )}

                        <Separator />

                        {/* Stock Alerts */}
                        <div className="space-y-2">
                            <Label className="text-sm font-medium">Cảnh báo tồn kho</Label>
                            {item.quantity === 0 && (
                                <div className="flex items-center p-3 bg-red-50 border border-red-200 rounded-lg">
                                    <AlertTriangle className="h-4 w-4 text-red-600 mr-2" />
                                    <span className="text-sm text-red-800">Sản phẩm đã hết hàng</span>
                                </div>
                            )}
                            {item.quantity > 0 && item.quantity <= item.minQuantity && (
                                <div className="flex items-center p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                                    <AlertTriangle className="h-4 w-4 text-yellow-600 mr-2" />
                                    <span className="text-sm text-yellow-800">
                                        Sản phẩm sắp hết hàng (còn {item.quantity}/{item.minQuantity})
                                    </span>
                                </div>
                            )}
                            {item.quantity > item.minQuantity && (
                                <div className="flex items-center p-3 bg-green-50 border border-green-200 rounded-lg">
                                    <Package className="h-4 w-4 text-green-600 mr-2" />
                                    <span className="text-sm text-green-800">Tồn kho đầy đủ</span>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Stock Trend Chart */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center">
                        <TrendingUp className="h-5 w-5 mr-2" />
                        Xu hướng tồn kho
                    </CardTitle>
                    <CardDescription>
                        Biểu đồ thay đổi số lượng tồn kho theo thời gian
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-200 rounded-lg">
                        <div className="text-center">
                            <TrendingUp className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                            <h3 className="text-lg font-medium mb-2">Biểu đồ xu hướng</h3>
                            <p className="text-muted-foreground">
                                Tính năng biểu đồ sẽ được cập nhật trong phiên bản tiếp theo
                            </p>
                            <div className="mt-4 text-sm text-muted-foreground">
                                <p>Hiện tại: <span className="font-medium">{item.quantity}</span> sản phẩm</p>
                                <p>Tối thiểu: <span className="font-medium">{item.minQuantity}</span> sản phẩm</p>
                                <p>Tỷ lệ: <span className="font-medium">{((item.quantity / Math.max(item.minQuantity, 1)) * 100).toFixed(1)}%</span></p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Transaction History */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center">
                        <History className="h-5 w-5 mr-2" />
                        Lịch sử giao dịch
                    </CardTitle>
                    <CardDescription>
                        Các giao dịch nhập/xuất của sản phẩm này
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {transactionsLoading ? (
                        <div className="text-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                            <p className="text-muted-foreground">Đang tải lịch sử giao dịch...</p>
                        </div>
                    ) : transactions.length === 0 ? (
                        <div className="text-center py-8">
                            <Activity className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                            <h3 className="text-lg font-medium mb-2">Chưa có giao dịch</h3>
                            <p className="text-muted-foreground">
                                Lịch sử giao dịch sẽ hiển thị khi có hoạt động nhập/xuất
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {transactions.map((transaction) => (
                                <div key={transaction.id} className="flex items-start space-x-4 p-4 border rounded-lg">
                                    <div className={`p-2 rounded-full ${transaction.type === 'in'
                                            ? 'bg-green-100 text-green-600'
                                            : transaction.type === 'out'
                                                ? 'bg-red-100 text-red-600'
                                                : 'bg-yellow-100 text-yellow-600'
                                        }`}>
                                        {transaction.type === 'in' ? (
                                            <Plus className="h-4 w-4" />
                                        ) : transaction.type === 'out' ? (
                                            <Minus className="h-4 w-4" />
                                        ) : (
                                            <Activity className="h-4 w-4" />
                                        )}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-2">
                                                <span className={`font-medium ${transaction.type === 'in'
                                                        ? 'text-green-600'
                                                        : transaction.type === 'out'
                                                            ? 'text-red-600'
                                                            : 'text-yellow-600'
                                                    }`}>
                                                    {transaction.type === 'in' ? '+' : transaction.type === 'out' ? '-' : '±'}
                                                    {Math.abs(transaction.quantity)}
                                                </span>
                                                <span className="text-sm text-muted-foreground">
                                                    {transaction.previousQuantity} → {transaction.newQuantity}
                                                </span>
                                            </div>
                                            <div className="flex items-center text-sm text-muted-foreground">
                                                <Clock className="h-3 w-3 mr-1" />
                                                {transaction.createdAt.toLocaleDateString('vi-VN')} {transaction.createdAt.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        </div>

                                        <p className="text-sm text-muted-foreground mt-1">
                                            {transaction.reason}
                                        </p>

                                        <div className="flex items-center justify-between mt-2">
                                            <span className="text-xs text-muted-foreground">
                                                Thực hiện bởi: {transaction.createdBy}
                                            </span>
                                            <Badge variant="outline" className="text-xs">
                                                {transaction.type === 'in' ? 'Nhập kho' :
                                                    transaction.type === 'out' ? 'Xuất kho' : 'Điều chỉnh'}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {transactions.length >= 10 && (
                                <div className="text-center pt-4">
                                    <Button variant="outline" size="sm">
                                        Xem thêm
                                    </Button>
                                </div>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Edit Form Dialog */}
            <InventoryForm
                open={showEditForm}
                onClose={() => setShowEditForm(false)}
                onSuccess={handleEditSuccess}
                item={item}
                mode="edit"
            />

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Xác nhận xóa sản phẩm</AlertDialogTitle>
                        <AlertDialogDescription>
                            Bạn có chắc chắn muốn xóa sản phẩm "{item.name}" (SKU: {item.sku})?
                            <br /><br />
                            <strong>Thông tin sản phẩm:</strong>
                            <br />• Số lượng hiện tại: {item.quantity}
                            <br />• Giá trị tồn kho: {formatPrice(item.quantity * item.unitPrice)}
                            <br />• Kho hàng: {warehouse?.name}
                            <br /><br />
                            Hành động này không thể hoàn tác.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={deleteLoading}>Hủy</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
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