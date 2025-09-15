"use client";

import { useState } from "react";
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
import { firestoreService, Warehouse } from "@/lib/firestore";

const WarehouseSchema = z.object({
  name: z.string().min(2, "Tên kho tối thiểu 2 ký tự"),
  address: z.string().min(5, "Địa chỉ tối thiểu 5 ký tự"),
  capacity: z.string().min(1, "Sức chứa là bắt buộc"),
  description: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email("Email không hợp lệ").optional().or(z.literal("")),
  status: z.enum(['active', 'inactive', 'maintenance']),
});

type WarehouseValues = z.infer<typeof WarehouseSchema>;

interface WarehouseFormProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (warehouse: Warehouse) => void;
  warehouse?: Warehouse | null;
  mode: 'create' | 'edit';
}

export function WarehouseForm({ 
  open, 
  onClose, 
  onSuccess, 
  warehouse, 
  mode 
}: WarehouseFormProps) {
  const [loading, setLoading] = useState(false);

  const form = useForm<WarehouseValues>({
    resolver: zodResolver(WarehouseSchema),
    defaultValues: {
      name: warehouse?.name || "",
      address: warehouse?.address || "",
      capacity: warehouse?.capacity?.toString() || "",
      description: warehouse?.description || "",
      phone: warehouse?.phone || "",
      email: warehouse?.email || "",
      status: warehouse?.status || "active",
    },
  });

  const handleSubmit = async (values: WarehouseValues) => {
    setLoading(true);
    try {
      if (mode === 'create') {
        const warehouseData = {
          name: values.name,
          address: values.address,
          capacity: parseInt(values.capacity),
          description: values.description,
          phone: values.phone,
          email: values.email,
          status: values.status,
          currentStock: 0,
          totalItems: 0,
          ownerId: "", // Will be set by API
          managers: [],
        };

        const warehouseId = await firestoreService.createWarehouse(warehouseData);
        
        const newWarehouse: Warehouse = {
          id: warehouseId,
          ...warehouseData,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        toast.success("Tạo kho hàng thành công!");
        onSuccess(newWarehouse);
      } else if (mode === 'edit' && warehouse) {
        const updates = {
          name: values.name,
          address: values.address,
          capacity: parseInt(values.capacity),
          description: values.description,
          phone: values.phone,
          email: values.email,
          status: values.status,
        };

        await firestoreService.updateWarehouse(warehouse.id, updates);

        const updatedWarehouse: Warehouse = {
          ...warehouse,
          ...updates,
          updatedAt: new Date(),
        };

        toast.success("Cập nhật kho hàng thành công!");
        onSuccess(updatedWarehouse);
      }

      form.reset();
      onClose();
    } catch (error: any) {
      console.error('Warehouse form error:', error);
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
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? 'Tạo kho hàng mới' : 'Chỉnh sửa kho hàng'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'create' 
              ? 'Điền thông tin để tạo kho hàng mới'
              : 'Cập nhật thông tin kho hàng'
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
                    <FormLabel>Tên kho hàng *</FormLabel>
                    <FormControl>
                      <Input placeholder="Kho Hà Nội" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Trạng thái</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn trạng thái" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="active">Hoạt động</SelectItem>
                        <SelectItem value="inactive">Tạm dừng</SelectItem>
                        <SelectItem value="maintenance">Bảo trì</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Địa chỉ *</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="123 Nguyễn Trãi, Thanh Xuân, Hà Nội" 
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
                name="capacity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sức chứa (m²) *</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="1000" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Số điện thoại</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="0123456789" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input 
                      type="email"
                      placeholder="warehouse@company.com" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mô tả</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Mô tả về kho hàng..." 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                  ? (mode === 'create' ? "Đang tạo..." : "Đang cập nhật...") 
                  : (mode === 'create' ? "Tạo kho hàng" : "Cập nhật")
                }
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}