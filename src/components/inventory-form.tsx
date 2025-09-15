"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { firestoreService, InventoryItem, Warehouse } from "@/lib/firestore";

const InventorySchema = z.object({
    name: z.string().min(2, "Tên sản phẩm tối thiểu 2 ký tự"),
    description: z.string().optional(),
    sku: z.string().min(1, "SKU là bắt buộc"),
    quantity: z.string().min(1, "Số lượng là bắt buộc"),
    minQuantity: z.string().min(1, "Số lượng tối thiểu là bắt buộc"),
    unitPrice: z.string().min(1, "Đơn giá là bắt buộc"),
    warehouseId: z.string().min(1, "Vui lòng chọn kho hàng"),
    category: z.string().min(1, "Danh mục là bắt buộc"),
    supplier: z.string().optional(),
    location: z.string().optional(),
});

type InventoryValues = z.infer<typeof InventorySchema>;

interface InventoryFormProps {
    open: boolean;
    onClose: () => void;
    onSuccess: (item: InventoryItem) => void;
    item?: InventoryItem | null;
    mode: 'create' | 'edit';
}

const categories = [
    "Electronics",
    "Clothing",
    "Food & Beverage",
    "Books",
    "Home & Garden",
    "Sports",
    "Toys",
    "Health & Beauty",
    "Automotive",
    "Other"
];

export function InventoryForm({
    open,
    onClose,
    onSuccess,
    item,
    mode
}: InventoryFormProps) {
    const [loading, setLoading] = useState(false);
    const [warehouses, setWarehouses] = useState<Warehouse[]>([]);

    const form = useForm<InventoryValues>({
        resolver: zodResolver(InventorySchema),
        defaultValues: {
            name: item?.name || "",
            description: item?.description || "",
            sku: item?.sku || "",
            quantity: item?.quantity?.toString() || "",
            minQuantity: item?.minQuantity?.toString() || "",
            unitPrice: item?.unitPrice?.toString() || "",
            warehouseId: item?.warehouseId || "",
            category: item?.category || "",
            supplier: item?.supplier || "",
            location: item?.location || "",
        },
    });

    // Load warehouses
    useEffect(() => {
        const loadWarehouses = async () => {
            try {
                const data = await firestoreService.getUserWarehouses();
                setWarehouses(data);
            } catch (error) {
                console.error('Error loading warehouses:', error);
            }
        };

        if (open) {
            loadWarehouses();
        }
    }, [open]);

    const handleSubmit = async (values: InventoryValues) => {
        setLoading(true);
        try {
            if (mode === 'create') {
                const itemData = {
                    name: values.name,
                    description: values.description || "",
                    sku: values.sku,
                    quantity: parseInt(values.quantity),
                    minQuantity: parseInt(values.minQuantity),
                    unitPrice: parseFloat(values.unitPrice),
                    warehouseId: values.warehouseId,
                    category: values.category,
                    supplier: values.supplier || "",
                    location: values.location || "",
                    ownerId: "", // Will be set by API
                    status: 'in_stock' as const,
                    updatedBy: "",
                };

                const itemId = await firestoreService.addInventoryItem(itemData);

                const newItem: InventoryItem = {
                    id: itemId,
                    ...itemData,
                    createdAt: new Date(),
                    lastUpdated: new Date(),
                };

                toast.success("Thêm sản phẩm thành công!");
                onSuccess(newItem);
            } else if (mode === 'edit' && item) {
                const updates = {
                    name: values.name,
                    description: values.description || "",
                    sku: values.sku,
                    quantity: parseInt(values.quantity),
                    minQuantity: parseInt(values.minQuantity),
                    unitPrice: parseFloat(values.unitPrice),
                    warehouseId: values.warehouseId,
                    category: values.category,
                    supplier: values.supplier || "",
                    location: values.location || "",
                };

                await firestoreService.updateInventoryItem(item.id, updates);

                const updatedItem: InventoryItem = {
                    ...item,
                    ...updates,
                    lastUpdated: new Date(),
                };

                toast.success("Cập nhật sản phẩm thành công!");
                onSuccess(updatedItem);
            }

            form.reset();
            onClose();
        } catch (error: any) {
            console.error('Inventory form error:', error);
            toast.error("Lỗi: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        form.reset();
        onClose();
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        {mode === 'create' ? 'Thêm sản phẩm mới' : 'Chỉnh sửa sản phẩm'}
                    </DialogTitle>
                    <DialogDescription>
                        {mode === 'create'
                            ? 'Điền thông tin để thêm sản phẩm vào kho'
                            : 'Cập nhật thông tin sản phẩm'
                        }
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Tên sản phẩm *</FormLabel>
                                        <FormControl>
                                            <Input placeholder="iPhone 15 Pro" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="sku"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>SKU *</FormLabel>
                                        <FormControl>
                                            <Input placeholder="IP15P-128-BLK" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Mô tả</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Mô tả chi tiết về sản phẩm..."
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="category"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Danh mục *</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Chọn danh mục" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {categories.map((category) => (
                                                    <SelectItem key={category} value={category}>
                                                        {category}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="warehouseId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Kho hàng *</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Chọn kho hàng" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {warehouses.map((warehouse) => (
                                                    <SelectItem key={warehouse.id} value={warehouse.id}>
                                                        {warehouse.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <FormField
                                control={form.control}
                                name="quantity"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Số lượng *</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                placeholder="100"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="minQuantity"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Tồn kho tối thiểu *</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                placeholder="10"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="unitPrice"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Đơn giá (VND) *</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                placeholder="25000000"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="supplier"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nhà cung cấp</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Apple Inc."
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="location"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Vị trí trong kho</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="A1-B2-C3"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="flex justify-end space-x-2 pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleClose}
                                disabled={loading}
                            >
                                Hủy
                            </Button>
                            <Button type="submit" disabled={loading}>
                                {loading
                                    ? (mode === 'create' ? "Đang thêm..." : "Đang cập nhật...")
                                    : (mode === 'create' ? "Thêm sản phẩm" : "Cập nhật")
                                }
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}