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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { firestoreService, UserProfile } from "@/lib/firestore";
import { useAuth } from "@/contexts/AuthContext";

const SetupSchema = z.object({
  displayName: z.string().min(2, "Tên tối thiểu 2 ký tự"),
  role: z.enum(['admin', 'manager', 'staff'], {
    required_error: "Vui lòng chọn vai trò",
  }),
  warehouseName: z.string().min(2, "Tên kho tối thiểu 2 ký tự"),
  warehouseAddress: z.string().min(5, "Địa chỉ tối thiểu 5 ký tự"),
  warehouseCapacity: z.string().min(1, "Sức chứa là bắt buộc"),
});

type SetupValues = z.infer<typeof SetupSchema>;

interface SetupDialogProps {
  open: boolean;
  onComplete: (profile: UserProfile) => void;
}

export function SetupDialog({ open, onComplete }: SetupDialogProps) {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const { user } = useAuth();

  const form = useForm<SetupValues>({
    resolver: zodResolver(SetupSchema),
    defaultValues: {
      displayName: user?.displayName || "",
      role: "manager",
      warehouseName: "",
      warehouseAddress: "",
      warehouseCapacity: "",
    },
  });

  const handleSetup = async (values: SetupValues) => {
    if (!user) return;

    setLoading(true);
    try {
      // Tạo warehouse trước
      const warehouseId = await firestoreService.createWarehouse({
        name: values.warehouseName,
        address: values.warehouseAddress,
        capacity: parseInt(values.warehouseCapacity),
        currentStock: 0,
        totalItems: 0,
        ownerId: user.uid,
        managers: [user.uid],
        status: 'active',
      });

      // Tạo user profile
      const userProfile: Omit<UserProfile, 'createdAt' | 'lastLogin'> = {
        uid: user.uid,
        email: user.email || "",
        displayName: values.displayName,
        role: values.role,
        warehouses: [warehouseId],
        permissions: {
          canManageInventory: values.role === 'admin' || values.role === 'manager',
          canProcessOrders: true,
          canViewReports: values.role === 'admin' || values.role === 'manager',
        },
        isSetupComplete: true,
      };

      await firestoreService.createUserProfile(userProfile);

      toast.success("Thiết lập tài khoản thành công!");

      // Create complete profile object for callback
      const completeProfile: UserProfile = {
        ...userProfile,
        createdAt: new Date(),
        lastLogin: new Date(),
      };

      onComplete(completeProfile);
    } catch (error: any) {
      console.error('Setup error:', error);
      toast.error("Lỗi khi thiết lập tài khoản: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const nextStep = async () => {
    const isValid = await form.trigger(['displayName', 'role']);
    if (isValid) {
      setStep(2);
    }
  };

  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-[500px]" onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Thiết lập tài khoản</DialogTitle>
          <DialogDescription>
            Chào mừng! Hãy thiết lập thông tin cơ bản để bắt đầu sử dụng hệ thống.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSetup)} className="space-y-6">
            {step === 1 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Thông tin cá nhân</CardTitle>
                  <CardDescription>Bước 1/2: Cung cấp thông tin về bạn</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="displayName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tên hiển thị</FormLabel>
                        <FormControl>
                          <Input placeholder="Nguyễn Văn A" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Vai trò</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Chọn vai trò của bạn" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="admin">Quản trị viên</SelectItem>
                            <SelectItem value="manager">Quản lý kho</SelectItem>
                            <SelectItem value="staff">Nhân viên</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="button" onClick={nextStep} className="w-full">
                    Tiếp theo
                  </Button>
                </CardContent>
              </Card>
            )}

            {step === 2 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Thiết lập kho hàng</CardTitle>
                  <CardDescription>Bước 2/2: Tạo kho hàng đầu tiên</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="warehouseName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tên kho hàng</FormLabel>
                        <FormControl>
                          <Input placeholder="Kho Hà Nội" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="warehouseAddress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Địa chỉ</FormLabel>
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

                  <FormField
                    control={form.control}
                    name="warehouseCapacity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sức chứa (m²)</FormLabel>
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

                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setStep(1)}
                      className="flex-1"
                    >
                      Quay lại
                    </Button>
                    <Button
                      type="submit"
                      disabled={loading}
                      className="flex-1"
                    >
                      {loading ? "Đang thiết lập..." : "Hoàn thành"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}